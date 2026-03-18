import { motion } from "framer-motion";
import {
  BookOpen, GraduationCap, Globe, Award, Users, MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const services = [
  { key: "writing",      icon: BookOpen,      color: "text-blue-600",   bg: "bg-blue-50"   },
  { key: "proofreading", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
  { key: "research",     icon: Globe,         color: "text-emerald-600",bg: "bg-emerald-50"},
  { key: "scholarship",  icon: Award,         color: "text-amber-600",  bg: "bg-amber-50"  },
  { key: "advisory",     icon: Users,         color: "text-rose-600",   bg: "bg-rose-50"   },
  { key: "global",       icon: MapPin,        color: "text-teal-600",   bg: "bg-teal-50"   },
];

export default function AcademicServices() {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t("home_page.services.title")}
          </h2>
          <p className="text-lg text-slate-600">
            {t("home_page.services.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:border-blue-100 transition-colors duration-300 cursor-default"
            >
              <div className={`${s.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}>
                <s.icon className={`h-7 w-7 ${s.color}`} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t(`home_page.services.items.${s.key}.title`)}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {t(`home_page.services.items.${s.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
