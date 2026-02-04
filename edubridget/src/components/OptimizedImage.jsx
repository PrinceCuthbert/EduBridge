import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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
  alt = '', 
  className = '',
  style = {},
  onLoad,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || null);
  const [imageRef, setImageRef] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

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
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
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
      console.error(`Failed to load image: ${src}`);
      setIsLoaded(true); // Still mark as loaded to remove blur
    };
  }, [isInView, src, onLoad]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={`${className} transition-all duration-500 ${
        !isLoaded && placeholder ? 'blur-sm scale-105' : 'blur-0 scale-100'
      }`}
      style={{
        opacity: isLoaded ? 1 : 0.8,
        ...style,
      }}
      loading="lazy" // Native lazy loading as fallback
      {...props}
    />
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onLoad: PropTypes.func,
};

export default OptimizedImage;
