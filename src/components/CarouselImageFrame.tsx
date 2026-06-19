import { useEffect, useMemo } from "react";
import { preloadCarouselImages } from "@/hooks/useCarouselPreload";

type CarouselImageFrameProps = {
  images: string[];
  index: number;
  alt: string;
  className?: string;
  onClick?: () => void;
};

const CarouselImageFrame = ({
  images,
  index,
  alt,
  className = "h-full w-full object-cover",
  onClick,
}: CarouselImageFrameProps) => {
  const imagesKey = useMemo(() => images.join("\0"), [images]);
  const src = images[index] ?? "";

  useEffect(() => {
    preloadCarouselImages(images, index);
  }, [imagesKey, index, images]);

  if (!src) {
    return <div className="relative h-full w-full bg-muted" />;
  }

  return (
    <div className="relative h-full w-full bg-muted">
      <img
        key={src}
        src={src}
        alt={alt}
        className={`${className} absolute inset-0`}
        decoding="async"
        onClick={onClick}
      />
    </div>
  );
};

export default CarouselImageFrame;
