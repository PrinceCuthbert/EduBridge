import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Logo Component
 * Reusable logo with tmlogo.jpg image
 */
const Logo = ({ mobile = false, onClick }) => {
  const size = mobile ? "w-10 h-10" : "w-12 h-12";

  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-3 group">
      <motion.div
        initial={mobile ? { scale: 0.8, opacity: 0 } : undefined}
        animate={mobile ? { scale: 1, opacity: 1 } : undefined}
        transition={
          mobile ? { delay: 0.1, type: "spring", stiffness: 200 } : undefined
        }
        className={`relative ${size} flex-shrink-0`}>
        <img
          src="/tmlogo.jpg"
          alt="TM EduBridge Logo"
          className="w-full h-full rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
        />
      </motion.div>
      <div className="flex flex-col">
        <span
          className={`${mobile ? "text-xl" : "text-2xl"} font-extrabold text-primary tracking-tight`}>
          EduBridge
        </span>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest italic">
          Bridging Dreams
        </span>
      </div>
    </Link>
  );
};

export default Logo;
