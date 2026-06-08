const loadedImageUrls = new Set<string>();
const inflight = new Map<string, Promise<void>>();

function markLoaded(url: string) {
  if (url) loadedImageUrls.add(url);
}

export function preloadImageAsync(url: string): Promise<void> {
  if (!url) return Promise.resolve();
  if (loadedImageUrls.has(url)) return Promise.resolve();

  const existing = inflight.get(url);
  if (existing) return existing;

  const promise = new Promise<void>((resolve) => {
    const img = new Image();
    const done = () => {
      markLoaded(url);
      inflight.delete(url);
      resolve();
    };

    img.onload = done;
    img.onerror = done;
    img.src = url;

    if (img.complete) {
      done();
    }
  });

  inflight.set(url, promise);
  return promise;
}

/** Preload active slide plus neighbors (prev + next) for smooth navigation. */
export function preloadCarouselImages(images: string[], activeIndex: number) {
  if (images.length === 0) return;

  const indices = new Set<number>([activeIndex]);
  if (images.length > 1) {
    indices.add((activeIndex + 1) % images.length);
    indices.add((activeIndex - 1 + images.length) % images.length);
  }

  indices.forEach((index) => {
    void preloadImageAsync(images[index]);
  });
}

export function isCarouselImageCached(url: string) {
  return loadedImageUrls.has(url);
}

export function markCarouselImageCached(url: string) {
  markLoaded(url);
}
