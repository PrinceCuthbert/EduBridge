import { motion } from "framer-motion";
import { BookOpen, Globe, GraduationCap, Award, Users, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const features = [
  { icon: BookOpen,     color: "text-blue-600",   bg: "bg-blue-50",   key: "educators"   },
  { icon: Globe,        color: "text-emerald-600", bg: "bg-emerald-50",key: "resources"   },
  { icon: GraduationCap,color: "text-amber-600",  bg: "bg-amber-50",  key: "classes"     },
  { icon: Award,        color: "text-purple-600",  bg: "bg-purple-50", key: "certificates"},
  { icon: Users,        color: "text-rose-600",    bg: "bg-rose-50",   key: "community"   },
  { icon: MapPin,       color: "text-teal-600",    bg: "bg-teal-50",   key: "excellence"  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function WhyChoose() {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-gradient-to-br from-white via-slate-50 to-emerald-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
            {t("why_choose.badge")}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">
            {t("why_choose.title")}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            {t("why_choose.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm cursor-default transition-colors duration-300 hover:border-blue-100"
            >
              <div className={`${f.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                <f.icon className={`h-7 w-7 ${f.color}`} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{t(`why_choose.features.${f.key}.title`)}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t(`why_choose.features.${f.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
