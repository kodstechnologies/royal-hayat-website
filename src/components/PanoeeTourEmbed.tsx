import { useEffect, useState } from "react";
import { Globe, Maximize2 } from "lucide-react";

export const PANOEE_IFRAME_ALLOW =
  "fullscreen; xr-spatial-tracking; xr; accelerometer; gyroscope; autoplay;";

export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

type PanoeeTourEmbedProps = {
  src: string;
  title: string;
  name?: string;
  id?: string;
  heightClass?: string;
  isAr?: boolean;
};

export default function PanoeeTourEmbed({
  src,
  title,
  name,
  id = "tour-embeded",
  heightClass = "h-[400px]",
  isAr = false,
}: PanoeeTourEmbedProps) {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(isIOSDevice());
  }, []);

  if (isIOS) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-muted/20 p-6 text-center shadow-md ${heightClass}`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Globe className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-2">
          <p className="font-serif text-base text-foreground">{title}</p>
          <p className="font-body text-xs leading-relaxed text-muted-foreground">
            {isAr
              ? "متصفح آيفون لا يدعم ملء الشاشة داخل الصفحة. افتح الجولة في سفاري للحصول على أفضل تجربة."
              : "iPhone cannot use fullscreen inside this page. Open the tour in Safari for the best experience."}
          </p>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-body text-xs font-semibold tracking-wide text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Maximize2 className="h-4 w-4" />
          {isAr ? "افتح الجولة الافتراضية" : "Open Virtual Tour"}
        </a>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl overflow-hidden border border-border shadow-md ${heightClass}`}>
      <iframe
        id={id}
        name={name}
        src={src}
        title={title}
        width="100%"
        height="100%"
        frameBorder={0}
        scrolling="no"
        allow={PANOEE_IFRAME_ALLOW}
        allowFullScreen
        className="h-full w-full"
        loading="eager"
      />
    </div>
  );
}
