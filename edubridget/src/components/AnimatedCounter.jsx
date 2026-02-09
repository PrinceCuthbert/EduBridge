import { useEffect, useRef, useState } from "react";

/**
 * AnimatedCounter Component
 *
 * Counts up from 0 to the target value with easing animation
 * Triggers when the element is visible in the viewport
 *
 * @param {number} end - Target number to count to
 * @param {number} duration - Animation duration in milliseconds (default: 2000ms)
 * @param {string} suffix - Optional suffix (e.g., '%', '+')
 * @param {string} prefix - Optional prefix (e.g., '$')
 * @param {boolean} separator - Add comma separator for thousands (default: true)
 */
const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = "",
  prefix = "",
  separator = true,
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);
  const hasAnimated = useRef(false);

  // Intersection Observer to trigger animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true);
            hasAnimated.current = true;
          }
        });
      },
      { threshold: 0.3 }, // Trigger when 30% visible
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  // Counter animation with easing
  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = 0;

    // Easing function (ease-out cubic)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing
      const easedProgress = easeOutCubic(progress);
      const currentCount = Math.floor(
        startValue + (end - startValue) * easedProgress,
      );

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end exactly at target
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  // Format number with comma separators
  const formatNumber = (num) => {
    if (!separator) return num.toString();
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <span ref={counterRef}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
