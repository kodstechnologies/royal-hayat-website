export const DOCTOR_CAROUSEL_CARD_SELECTOR = "[data-doctor-carousel-card]";

type CarouselState = {
  animating: boolean;
  pendingSteps: number;
  settleTimer: ReturnType<typeof setTimeout> | null;
  runPromise: Promise<void> | null;
};

const carouselStates = new WeakMap<HTMLElement, CarouselState>();

function getCards(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(DOCTOR_CAROUSEL_CARD_SELECTOR),
  );
}

function getState(container: HTMLElement): CarouselState {
  let state = carouselStates.get(container);
  if (!state) {
    state = {
      animating: false,
      pendingSteps: 0,
      settleTimer: null,
      runPromise: null,
    };
    carouselStates.set(container, state);
  }
  return state;
}

function isMobileCarousel() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function getMaxScroll(container: HTMLElement) {
  return Math.max(0, container.scrollWidth - container.clientWidth);
}

function isRtlCarousel(container: HTMLElement) {
  return getComputedStyle(container).direction === "rtl";
}

function getNormalizedScrollLeft(container: HTMLElement) {
  const maxScroll = getMaxScroll(container);
  if (!isRtlCarousel(container)) {
    return container.scrollLeft;
  }

  if (container.scrollLeft < 0) {
    return Math.abs(container.scrollLeft);
  }

  return container.scrollLeft;
}

function setNormalizedScrollLeft(
  container: HTMLElement,
  value: number,
  behavior: ScrollBehavior,
) {
  const maxScroll = getMaxScroll(container);
  const clamped = Math.max(0, Math.min(value, maxScroll));

  if (!isRtlCarousel(container)) {
    container.scrollTo({ left: clamped, behavior });
    return;
  }

  if (container.scrollLeft <= 0 && maxScroll > 0) {
    container.scrollTo({ left: -clamped, behavior });
    return;
  }

  container.scrollTo({ left: clamped, behavior });
}

export function scrollDoctorCarouselToStart(container: HTMLElement) {
  const maxScroll = getMaxScroll(container);
  if (!isRtlCarousel(container)) {
    container.scrollTo({ left: 0, behavior: "auto" });
    return;
  }

  container.scrollTo({ left: 0, behavior: "auto" });
  requestAnimationFrame(() => {
    if (maxScroll <= 0) return;
    if (Math.abs(getNormalizedScrollLeft(container)) > 8) {
      setNormalizedScrollLeft(container, 0, "auto");
    }
  });
}

function getTargetScrollLeft(container: HTMLElement, card: HTMLElement) {
  const maxScroll = getMaxScroll(container);

  if (isMobileCarousel()) {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const target = cardCenter - container.clientWidth / 2;
    return Math.max(0, Math.min(target, maxScroll));
  }

  return Math.max(0, Math.min(card.offsetLeft, maxScroll));
}

export function getActiveDoctorCarouselIndex(container: HTMLElement) {
  const cards = getCards(container);
  if (!cards.length) return 0;

  if (!isMobileCarousel()) {
    const scrollLeft = getNormalizedScrollLeft(container);
    let leadingIndex = 0;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].offsetLeft <= scrollLeft + 8) {
        leadingIndex = i;
      } else {
        break;
      }
    }
    return leadingIndex;
  }

  const scrollCenter = getNormalizedScrollLeft(container) + container.clientWidth / 2;
  let activeIndex = 0;
  let minDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(cardCenter - scrollCenter);
    if (distance < minDistance) {
      minDistance = distance;
      activeIndex = index;
    }
  });

  return activeIndex;
}

function getStepTargetIndex(
  container: HTMLElement,
  direction: "left" | "right",
): number | null {
  const cards = getCards(container);
  if (!cards.length) return null;

  if (isMobileCarousel()) {
    const current = getActiveDoctorCarouselIndex(container);
    const next = direction === "right" ? current + 1 : current - 1;
    if (next < 0 || next >= cards.length) return null;
    return next;
  }

  const scrollLeft = getNormalizedScrollLeft(container);
  const viewportRight = scrollLeft + container.clientWidth;

  if (direction === "right") {
    for (let i = 0; i < cards.length; i++) {
      const cardRight = cards[i].offsetLeft + cards[i].offsetWidth;
      if (cardRight > viewportRight + 4) {
        return i;
      }
    }
    return null;
  }

  for (let i = cards.length - 1; i >= 0; i--) {
    if (cards[i].offsetLeft < scrollLeft - 4) {
      return i;
    }
  }
  return null;
}

function snapToIndex(container: HTMLElement, index: number, behavior: ScrollBehavior) {
  const cards = getCards(container);
  const card = cards[index];
  if (!card) return;

  setNormalizedScrollLeft(container, getTargetScrollLeft(container, card), behavior);
}

function clearSettleTimer(state: CarouselState) {
  if (state.settleTimer) {
    clearTimeout(state.settleTimer);
    state.settleTimer = null;
  }
}

function waitForScrollSettle(container: HTMLElement, behavior: ScrollBehavior) {
  return new Promise<void>((resolve) => {
    const state = getState(container);
    clearSettleTimer(state);

    const done = () => {
      clearSettleTimer(state);
      resolve();
    };

    if (behavior === "auto") {
      requestAnimationFrame(() => {
        requestAnimationFrame(done);
      });
      state.settleTimer = setTimeout(done, isMobileCarousel() ? 80 : 120);
      return;
    }

    if ("onscrollend" in window) {
      const onEnd = () => {
        container.removeEventListener("scrollend", onEnd);
        done();
      };
      container.addEventListener("scrollend", onEnd, { once: true });
      state.settleTimer = setTimeout(() => {
        container.removeEventListener("scrollend", onEnd);
        done();
      }, 450);
      return;
    }

    state.settleTimer = setTimeout(done, 380);
  });
}

async function executeStep(
  container: HTMLElement,
  direction: "left" | "right",
): Promise<boolean> {
  const targetIndex = getStepTargetIndex(container, direction);
  if (targetIndex === null) return false;

  const behavior: ScrollBehavior = isMobileCarousel() ? "auto" : "smooth";
  snapToIndex(container, targetIndex, behavior);
  await waitForScrollSettle(container, behavior);
  snapToIndex(container, targetIndex, "auto");
  return true;
}

async function drainCarouselQueue(container: HTMLElement, initialDelta: number) {
  const state = getState(container);
  state.animating = true;

  try {
    let delta = initialDelta;

    while (delta !== 0) {
      const direction: "left" | "right" = delta > 0 ? "right" : "left";
      let steps = Math.abs(delta);
      delta = 0;

      while (steps > 0) {
        const moved = await executeStep(container, direction);
        if (!moved) break;
        steps -= 1;
      }

      if (state.pendingSteps !== 0) {
        delta = state.pendingSteps;
        state.pendingSteps = 0;
      }
    }
  } finally {
    state.animating = false;
    state.runPromise = null;
  }
}

export function scrollDoctorCarousel(
  container: HTMLElement,
  direction: "left" | "right",
  step = 1,
): Promise<void> {
  const state = getState(container);
  const cards = getCards(container);
  if (!cards.length || getMaxScroll(container) <= 1) {
    return Promise.resolve();
  }

  const delta = (direction === "left" ? -1 : 1) * Math.max(1, step);

  if (state.animating) {
    state.pendingSteps = Math.max(
      -cards.length,
      Math.min(cards.length, state.pendingSteps + delta),
    );
    return state.runPromise ?? Promise.resolve();
  }

  const run = drainCarouselQueue(container, delta);
  state.runPromise = run;
  return run;
}

export function syncDoctorCarouselIndex(_container: HTMLElement) {
  // Index is derived from scroll position when needed; no cached state to sync.
}

export function getDoctorCarouselScrollState(container: HTMLElement) {
  const cards = getCards(container);
  const maxScroll = getMaxScroll(container);

  if (cards.length <= 1 || maxScroll <= 1) {
    return { canScrollLeft: false, canScrollRight: false };
  }

  if (isMobileCarousel()) {
    const activeIndex = getActiveDoctorCarouselIndex(container);
    return {
      canScrollLeft: activeIndex > 0,
      canScrollRight: activeIndex < cards.length - 1,
    };
  }

  const scrollLeft = getNormalizedScrollLeft(container);
  return {
    canScrollLeft: scrollLeft > 8,
    canScrollRight: scrollLeft < maxScroll - 8,
  };
}
