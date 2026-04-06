import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Globe, TrendingUp, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const STATS = [
  { icon: Users,      value: 10000, suffix: "+", labelKey: "stats_bar.students_enrolled", color: "text-blue-600",   bg: "bg-blue-50"   },
  { icon: Globe,      value: 25,    suffix: "+", labelKey: "stats_bar.countries_reached", color: "text-emerald-600",bg: "bg-emerald-50"},
  { icon: TrendingUp, value: 98,    suffix: "%", labelKey: "stats_bar.visa_success_rate", color: "text-amber-600",  bg: "bg-amber-50"  },
  { icon: Award,      value: 10,    suffix: "+", labelKey: "stats_bar.years_experience",  color: "text-purple-600", bg: "bg-purple-50" },
];

function CountUp({ target, suffix, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame;
    const duration = 1800;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return (
    <span>
      {target >= 1000 ? `${(count / 1000).toFixed(count >= target ? 0 : 1)}k` : count}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {STATS.map(({ icon: Icon, value, suffix, labelKey, color, bg }, i) => (
            <motion.div
              key={labelKey}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-3 sm:p-6 rounded-xl sm:rounded-2xl hover:shadow-md transition-shadow duration-300 group min-w-0"
            >
              <div className={`p-2 sm:p-3 ${bg} rounded-lg sm:rounded-xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} />
              </div>
              <p className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold ${color} mb-1 tabular-nums`}>
                <CountUp target={value} suffix={suffix} inView={inView} />
              </p>
              <p className="text-[11px] xs:text-xs sm:text-sm text-slate-500 font-medium leading-snug px-0.5">{t(labelKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
