import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ComingSoonPage = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "This section";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden px-4">
      <div className="relative">
        
        {/* 1. The Thinking Bubble */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4, type: "spring" }}
          className="absolute -top-12 -right-4 md:-top-20 md:right-0 md:left-1/2 md:-translate-x-1/2 lg:-top-28 lg:left-auto lg:translate-x-0 lg:right-8 bg-white border-2 border-primary p-3 md:p-4 rounded-3xl shadow-xl z-20 max-w-[180px] md:max-w-xs"
        >
          <p className="text-gray-800 font-bold text-xs md:text-sm lg:text-base">
            {filter} is coming soon! 🚀
          </p>
          {/* Bubble Tail */}
          <div className="absolute -bottom-3 left-10 w-6 h-6 bg-white border-b-2 border-r-2 border-primary rotate-45"></div>
        </motion.div>

        {/* 2. The Character / Cartoon */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            duration: 0.6 
          }}
          className="w-64 h-64 md:w-80 md:h-80 bg-primary/10 rounded-full flex items-center justify-center relative"
        >
          {/* Character emoji */}
          <span className="text-8xl md:text-9xl">👨‍💻</span> 
          
          {/* Decorative background pulse */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.1, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-primary rounded-full -z-10"
          />
        </motion.div>
      </div>

      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12 text-xl md:text-2xl font-semibold text-gray-600 italic text-center"
      >
        We are building something great for you.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-4 text-gray-500 text-center max-w-md"
      >
        Our team is working hard to bring you an amazing learning experience. Check back soon!
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="mt-8"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ComingSoonPage;
