export const DOCTOR_CAROUSEL_CARD_SELECTOR = "[data-doctor-carousel-card]";

type CarouselState = {
  activeIndex: number;
  animating: boolean;
  pendingSteps: number;
  settleTimer: ReturnType<typeof setTimeout> | null;
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
      activeIndex: 0,
      animating: false,
      pendingSteps: 0,
      settleTimer: null,
    };
    carouselStates.set(container, state);
  }
  return state;
}

function isMobileCarousel() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function getTargetScrollLeft(container: HTMLElement, card: HTMLElement) {
  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);

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
    const scrollLeft = container.scrollLeft;
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

  const scrollCenter = container.scrollLeft + container.clientWidth / 2;
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

function snapToIndex(container: HTMLElement, index: number, behavior: ScrollBehavior) {
  const cards = getCards(container);
  const card = cards[index];
  if (!card) return;

  container.scrollTo({
    left: getTargetScrollLeft(container, card),
    behavior,
  });
}

function clearSettleTimer(state: CarouselState) {
  if (state.settleTimer) {
    clearTimeout(state.settleTimer);
    state.settleTimer = null;
  }
}

function waitForScrollSettle(container: HTMLElement) {
  return new Promise<void>((resolve) => {
    const state = getState(container);
    clearSettleTimer(state);

    const done = () => {
      clearSettleTimer(state);
      resolve();
    };

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

    state.settleTimer = setTimeout(done, isMobileCarousel() ? 80 : 420);
  });
}

async function runCarouselSteps(container: HTMLElement, totalDelta: number) {
  const state = getState(container);
  const cards = getCards(container);
  if (!cards.length || totalDelta === 0) return;

  const sign = totalDelta > 0 ? 1 : -1;
  let remaining = Math.abs(totalDelta);

  state.animating = true;
  let currentIndex = getActiveDoctorCarouselIndex(container);

  while (remaining > 0) {
    const nextIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + sign));
    if (nextIndex === currentIndex) break;

    currentIndex = nextIndex;
    state.activeIndex = nextIndex;

    const behavior: ScrollBehavior = isMobileCarousel() ? "auto" : "smooth";
    snapToIndex(container, nextIndex, behavior);
    await waitForScrollSettle(container);
    snapToIndex(container, nextIndex, "auto");
    remaining -= 1;
  }

  state.animating = false;

  if (state.pendingSteps !== 0) {
    const pending = state.pendingSteps;
    state.pendingSteps = 0;
    await runCarouselSteps(container, pending);
  }
}

export function scrollDoctorCarousel(
  container: HTMLElement,
  direction: "left" | "right",
  step = 1,
) {
  const state = getState(container);
  const cards = getCards(container);
  if (!cards.length) return;

  const delta = (direction === "left" ? -1 : 1) * Math.max(1, step);

  if (state.animating) {
    state.pendingSteps = Math.max(
      -cards.length,
      Math.min(cards.length, state.pendingSteps + delta),
    );
    return;
  }

  void runCarouselSteps(container, delta);
}

export function syncDoctorCarouselIndex(container: HTMLElement) {
  const state = getState(container);
  if (state.animating) return;
  state.activeIndex = getActiveDoctorCarouselIndex(container);
}

export function getDoctorCarouselScrollState(container: HTMLElement) {
  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
  return {
    canScrollLeft: container.scrollLeft > 10,
    canScrollRight: container.scrollLeft < maxScroll - 10,
  };
}
