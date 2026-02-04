import { useMemo } from "react";

function Slider({ partners, direction = "left", bgColor = "#f8fafc", showEdgeFades = true }) {
  // Triple the partners to create infinite buffer
  const slides = useMemo(() => [...partners, ...partners, ...partners], [partners]);

  // Constants for consistent math
  const imageWidth = 133;
  const gap = 30;
  const totalItemWidth = imageWidth + gap;
  const singleSetWidth = totalItemWidth * partners.length;

  return (
    <>
      <style>{`
        @keyframes scrollInfinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${singleSetWidth}px); }
        }

        .slider-wrapper {
          display: flex;
          width: max-content;
          animation: scrollInfinite 30s linear infinite ${direction === "right" ? "reverse" : "normal"};
        }

        .slider-wrapper:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative w-full overflow-hidden py-10">
        {/* Edge Fades */}
        {showEdgeFades && (
          <>
            <div 
              className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none" 
              style={{ background: `linear-gradient(to right, ${bgColor}, transparent)` }}
            />
            <div 
              className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none" 
              style={{ background: `linear-gradient(to left, ${bgColor}, transparent)` }}
            />
          </>
        )}

        {/* The Animated Track */}
        <div className="slider-wrapper">
          {slides.map((partner, index) => (
            <div
              key={index}
              style={{ width: `${imageWidth}px`, marginRight: `${gap}px` }}
              className="h-[133px] flex-shrink-0 flex items-center justify-center bg-white rounded-full p-5 shadow-md transition-transform duration-300 hover:scale-110 hover:shadow-xl cursor-pointer"
            >
              <img
                src={partner.logo}
                alt={`${partner.name} Logo`}
                className="max-w-full max-h-full object-contain hover:grayscale transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Slider;