export const DOCTOR_CAROUSEL_CARD_SELECTOR = "[data-doctor-carousel-card]";

export function scrollDoctorCarousel(
  container: HTMLElement,
  direction: "left" | "right",
) {
  const cards = container.querySelectorAll<HTMLElement>(DOCTOR_CAROUSEL_CARD_SELECTOR);
  if (!cards.length) return;

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

  const nextIndex =
    direction === "left"
      ? Math.max(0, activeIndex - 1)
      : Math.min(cards.length - 1, activeIndex + 1);

  cards[nextIndex].scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });
}
