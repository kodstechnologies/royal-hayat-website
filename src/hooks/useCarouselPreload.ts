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

type PreloadCarouselOptions = {
  nextLookahead?: number;
  prevLookahead?: number;
};

export function preloadCarouselImages(
  images: string[],
  activeIndex: number,
  options: PreloadCarouselOptions = {},
) {
  if (images.length === 0) return;

  const nextLookahead = options.nextLookahead ?? 2;
  const prevLookahead = options.prevLookahead ?? 1;
  const indices = new Set<number>([activeIndex]);

  if (images.length > 1) {
    for (let step = 1; step <= nextLookahead; step++) {
      indices.add((activeIndex + step) % images.length);
    }
    for (let step = 1; step <= prevLookahead; step++) {
      indices.add((activeIndex - step + images.length) % images.length);
    }
  }

  indices.forEach((index) => {
    const url = images[index];
    if (url) void preloadImageAsync(url);
  });
}

export function isCarouselImageCached(url: string) {
  return loadedImageUrls.has(url);
}

export function markCarouselImageCached(url: string) {
  markLoaded(url);
}
