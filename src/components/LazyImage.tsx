import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const LazyImage = ({ src, alt, className, fallback = "/placeholder.svg", ...props }: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          img.src = src || fallback;
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(img);
    return () => observer.disconnect();
  }, [src, fallback]);

  return (
    <img
      ref={imgRef}
      alt={alt || ""}
      data-src={src}
      onLoad={() => setLoaded(true)}
      onError={() => { setError(true); setLoaded(true); }}
      className={cn(
        "transition-opacity duration-300",
        loaded ? "opacity-100" : "opacity-0",
        className
      )}
      {...props}
      src={error ? fallback : undefined}
    />
  );
};

export default LazyImage;
