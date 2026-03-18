import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, GraduationCap } from "lucide-react";
import { MOCK_MEDIA } from "@/data/mockData";

const preview = MOCK_MEDIA.slice(0, 6);

export default function GalleryTeaser() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
              Success Stories
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Students Who Made It
            </h2>
            <p className="text-slate-500 mt-2 text-lg max-w-xl">
              Real students. Real destinations. Real success.
            </p>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors shrink-0 group"
          >
            View All Stories
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {preview.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="break-inside-avoid mb-5 group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-400">
                <img
                  src={item.image}
                  alt={item.studentName}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <h3 className="text-white font-bold text-base mb-1">
                    {item.studentName}
                  </h3>
                  <p className="text-white/80 text-xs flex items-center gap-1 mb-1">
                    <MapPin className="h-3 w-3" /> {item.country}
                  </p>
                  <p className="text-white/70 text-xs flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" /> {item.program}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
