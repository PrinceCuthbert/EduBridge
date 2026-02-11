import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const TimelineItem = ({ milestone, index, isLeft }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 0 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative">
      {/* Mobile Layout - vertical with content on right */}
      <div className="md:hidden flex items-start">
        {/* Timeline node - left side */}
        <div className="absolute left-6 -translate-x-1/2 z-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
            className="w-5 h-5 rounded-full bg-yellow-500 border-4 border-white shadow-lg"
          />
        </div>

        {/* Content card - right side */}
        <div className="ml-16 flex-1">
          <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-3 py-1 bg-[#1A237E] text-white font-bold rounded-full text-xs">
                {milestone.year}
              </span>
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-yellow-500 text-lg"
              />
            </div>
            <h3
              className="text-base font-bold text-[#1A237E] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {milestone.title}
            </h3>
            <p
              className="text-slate-600 text-sm leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              {milestone.description}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout - alternating left/right */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-0 items-center">
        {/* Left side content for even indices (0, 2, 4) */}
        {isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="pr-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-slate-200 hover:border-[#1A237E]">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block px-3 py-1.5 bg-[#1A237E] text-white font-bold rounded-full text-sm">
                  {milestone.year}
                </span>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-yellow-500 text-xl"
                />
              </div>
              <h3
                className="text-lg font-bold text-[#1A237E] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {milestone.title}
              </h3>
              <p
                className="text-slate-600 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {milestone.description}
              </p>
            </div>
          </motion.div>
        ) : (
          <div></div>
        )}

        {/* Center node */}
        <div className="relative z-20 flex-shrink-0 mx-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
            className="w-5 h-5 rounded-full bg-yellow-500 border-4 border-white shadow-lg"
          />
        </div>

        {/* Right side content for odd indices (1, 3, 5) */}
        {!isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="pl-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-slate-200 hover:border-[#1A237E]">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block px-3 py-1.5 bg-[#1A237E] text-white font-bold rounded-full text-sm">
                  {milestone.year}
                </span>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-yellow-500 text-xl"
                />
              </div>
              <h3
                className="text-lg font-bold text-[#1A237E] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {milestone.title}
              </h3>
              <p
                className="text-slate-600 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {milestone.description}
              </p>
            </div>
          </motion.div>
        ) : (
          <div></div>
        )}
      </div>
    </motion.div>
  );
};

export default TimelineItem;
