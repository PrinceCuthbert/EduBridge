import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const InfiniteSlider = ({
  data = [],
  renderItem,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  autoPlaySpeed = 3500,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerView.desktop);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 1. Responsive Logic
  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) setItemsPerPage(itemsPerView.mobile);
      else if (window.innerWidth < 1024) setItemsPerPage(itemsPerView.tablet);
      else setItemsPerPage(itemsPerView.desktop);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [itemsPerView]);

  if (!data || data.length === 0) {
    return (
      <div
        className={`w-full py-12 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 ${className}`}>
        <p className="text-slate-500 font-medium text-sm">No data found</p>
      </div>
    );
  }

  // 2. Loop Logic (Triplicating for seamless infinite effect)
  const extendedData = [...data, ...data, ...data];
  const startOffset = data.length;

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    // Boundary checks to jump back to middle copy instantly
    if (currentIndex >= data.length + startOffset) {
      setCurrentIndex(startOffset);
    } else if (currentIndex < startOffset) {
      setCurrentIndex(startOffset + data.length - 1);
    }
  };

  // 3. Auto-play
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(handleNext, autoPlaySpeed);
      return () => clearInterval(interval);
    }
  }, [isPaused, currentIndex, handleNext, autoPlaySpeed]);

  // Reset to start offset on mount or data change
  useEffect(() => {
    setCurrentIndex(startOffset);
  }, [data.length]);

  const translateValue = -(currentIndex * (100 / itemsPerPage));

  return (
    <div
      className={`relative max-w-7xl mx-auto px-12 md:px-16 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      {/* Navigation: Left */}
      <button
        onClick={handlePrev}
        className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
        disabled={isTransitioning}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Track */}
      <div className="overflow-hidden py-6">
        <div
          className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
          style={{ transform: `translateX(${translateValue}%)` }}
          onTransitionEnd={handleTransitionEnd}>
          {extendedData.map((item, idx) => (
            <div
              key={`${idx}`}
              className="flex-shrink-0 px-4"
              style={{ width: `${100 / itemsPerPage}%` }}>
              {renderItem(item, idx)}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation: Right */}
      <button
        onClick={handleNext}
        className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
        disabled={isTransitioning}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {data.map((_, idx) => (
          <button
            key={idx}
            onClick={() =>
              !isTransitioning && setCurrentIndex(startOffset + idx)
            }
            className={`w-2 h-2 rounded-full transition-all ${
              (currentIndex - startOffset) % data.length === idx
                ? "bg-slate-800 w-6"
                : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default InfiniteSlider;
