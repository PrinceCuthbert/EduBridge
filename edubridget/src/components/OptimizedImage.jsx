import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * OptimizedImage Component
 *
 * Implements:
 * 1. Lazy loading with intersection observer
 * 2. Blur-up technique with LQIP (Low Quality Image Placeholder)
 * 3. Progressive image loading
 * 4. Error handling
 *
 * Usage:
 * <OptimizedImage
 *   src="/images/high-res.jpg"
 *   placeholder="/images/low-res.jpg" // or data URI
 *   alt="Description"
 *   className="your-classes"
 * />
 */

const OptimizedImage = ({
  src,
  placeholder,
  alt = "",
  className = "",
  style = {},
  onLoad,
  fallbackSrc,
  showSkeleton = true,
  skeletonClassName = "",
  rounded = false,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || null);
  const [imageRef, setImageRef] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imageRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(imageRef);
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
      },
    );

    observer.observe(imageRef);

    return () => {
      if (imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef]);

  // Load high-res image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      if (onLoad) onLoad();
    };

    img.onerror = () => {
      if (import.meta.env.DEV) {
        console.error(`Failed to load image: ${src}`);
      }

      // Set fallback image if available
      const defaultFallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%2394a3b8'%3EImage Not Available%3C/text%3E%3C/svg%3E`;

      if (fallbackSrc && fallbackSrc !== src) {
        setImageSrc(fallbackSrc);
      } else {
        setImageSrc(defaultFallback);
      }

      setHasError(true);
      setIsLoaded(true);
    };
  }, [isInView, src, onLoad, fallbackSrc]);

  return (
    <div className="relative inline-block w-full h-full">
      {/* Skeleton Loading */}
      {showSkeleton && !isLoaded && (
        <div
          className={`absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 ${rounded ? "rounded-full" : "rounded-lg"} ${skeletonClassName}`}
          style={{
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}>
          <style>{`
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
          `}</style>
        </div>
      )}

      {/* Actual Image */}
      <img
        ref={setImageRef}
        src={imageSrc}
        alt={alt}
        className={`${className} transition-all duration-500 ${
          !isLoaded ? "opacity-0" : "opacity-100"
        } ${rounded ? "rounded-full" : ""}`}
        style={{
          ...style,
        }}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onLoad: PropTypes.func,
  fallbackSrc: PropTypes.string,
  showSkeleton: PropTypes.bool,
  skeletonClassName: PropTypes.string,
  rounded: PropTypes.bool,
};

export default OptimizedImage;
