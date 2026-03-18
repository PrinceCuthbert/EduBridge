import { motion } from "framer-motion";
import { BookOpen, Globe, GraduationCap, Award, Users, MapPin } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "Learn from East Africa's Top Educators",
    description: "Expert instruction from proven academics and industry leaders",
  },
  {
    icon: Globe,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "World-Class Digital Resources",
    description: "Access cutting-edge learning materials anytime, anywhere",
  },
  {
    icon: GraduationCap,
    color: "text-amber-600",
    bg: "bg-amber-50",
    title: "Live Interactive Classes",
    description: "Real-time engagement with instructors and peers across the continent",
  },
  {
    icon: Award,
    color: "text-purple-600",
    bg: "bg-purple-50",
    title: "Globally Recognized Certificates",
    description: "Credentials that open doors to opportunities worldwide",
  },
  {
    icon: Users,
    color: "text-rose-600",
    bg: "bg-rose-50",
    title: "Vibrant Student Community",
    description: "Join thousands of ambitious learners building Africa's future",
  },
  {
    icon: MapPin,
    color: "text-teal-600",
    bg: "bg-teal-50",
    title: "East African Excellence",
    description: "Tailored curriculum addressing regional opportunities and challenges",
  },
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
            Why EduBridge
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">
            Why Choose EduBridge?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Experience education designed for the modern African learner
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
              <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
