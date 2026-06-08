export const DOCTOR_CAROUSEL_CARD_SELECTOR = "[data-doctor-carousel-card]";

function getScrollStep(container: HTMLElement) {
  const cards = Array.from(
    container.querySelectorAll<HTMLElement>(DOCTOR_CAROUSEL_CARD_SELECTOR),
  );
  if (cards.length >= 2) {
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    if (step > 0) return step;
  }

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  return 280 + (isMobile ? 16 : 24);
}

export function scrollDoctorCarousel(
  container: HTMLElement,
  direction: "left" | "right",
) {
  const step = getScrollStep(container);
  container.scrollBy({
    left: direction === "left" ? -step : step,
    behavior: "smooth",
  });
}

export function getDoctorCarouselScrollState(container: HTMLElement) {
  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
  return {
    canScrollLeft: container.scrollLeft > 10,
    canScrollRight: container.scrollLeft < maxScroll - 10,
  };
}
