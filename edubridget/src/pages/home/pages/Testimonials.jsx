import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

const reviews = [
  {
    name: "Jane M.",
    location: "Kenya",
    text: "TM EduBridge transformed my learning experience. I passed my national exams with flying colors!",
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Samuel O.",
    location: "Nigeria",
    text: "As a working professional, the flexible learning options helped me earn a certification in my own time.",
    image: "https://i.pravatar.cc/150?img=11",
  },
  {
    name: "Ms. Amina B.",
    location: "Tanzania",
    text: "As an educator, I've found their resources aligned with our curriculum and easy to implement.",
    image: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "David K.",
    location: "Uganda",
    text: "The visa guidance was exceptional. EduBridge made my dream of studying abroad a reality.",
    image: "https://i.pravatar.cc/150?img=15",
  },
  {
    name: "Grace N.",
    location: "Rwanda",
    text: "From application to arrival, every step was handled with care. I'm now studying in Seoul!",
    image: "https://i.pravatar.cc/150?img=47",
  },
];

const INTERVAL = 4000;

export default function Testimonials() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = () => setCurrent((p) => (p + 1) % reviews.length);
  const prev = () => setCurrent((p) => (p - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [paused, current]);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase backdrop-blur-sm">
            Student Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("home_page.testimonials.title")}
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            {t("home_page.testimonials.subtitle")}
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 text-center"
            >
              <Quote className="h-10 w-10 text-amber-400 mx-auto mb-6 opacity-80" />
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto italic">
                "{reviews[current].text}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={reviews[current].image}
                  alt={reviews[current].name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-white/30"
                />
                <div className="text-left">
                  <p className="font-bold text-white">{reviews[current].name}</p>
                  <p className="text-sm text-white/60">{reviews[current].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-full text-white transition-all hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-full text-white transition-all hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot indicators with progress */}
        <div className="flex justify-center gap-3 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-amber-400" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
