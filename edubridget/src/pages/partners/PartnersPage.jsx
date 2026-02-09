import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Building2,
  GraduationCap,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import OptimizedImage from "@/components/OptimizedImage";

// Mock Data for Universities
const d2Universities = [
  {
    name: "Kyungsung University",
    enName: "Kyungsung University",
    logo: "https://ui-avatars.com/api/?name=Kyungsung+University&background=1e40af&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    name: "Geoje University",
    enName: "Geoje University",
    logo: "https://ui-avatars.com/api/?name=Geoje+University&background=2563eb&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    name: "Seoul Theological",
    enName: "Seoul Theological Univ",
    logo: "https://ui-avatars.com/api/?name=Seoul+Theological&background=7c3aed&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    name: "Gangseo University",
    enName: "Gangseo University",
    logo: "https://ui-avatars.com/api/?name=Gangseo+University&background=dc2626&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    name: "Indu University",
    enName: "Indu University",
    logo: "https://ui-avatars.com/api/?name=Indu+University&background=059669&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    name: "Calvin University",
    enName: "Calvin University",
    logo: "https://ui-avatars.com/api/?name=Calvin+University&background=ea580c&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    name: "Daejin University",
    enName: "Daejin University",
    logo: "https://ui-avatars.com/api/?name=Daejin+University&background=0891b2&color=fff&size=128&bold=true",
    badge: "BEST",
    type: "D-2",
  },
  {
    name: "Soongsil University",
    enName: "Soongsil University",
    logo: "https://ui-avatars.com/api/?name=Soongsil+University&background=be123c&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
];

const d4Universities = [
  {
    name: "Tongwon University",
    enName: "Tongwon University",
    logo: "https://ui-avatars.com/api/?name=Tongwon+University&background=4f46e5&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
  {
    name: "Seoul Theological",
    enName: "STU - VIET NAM",
    logo: "https://ui-avatars.com/api/?name=STU+VIETNAM&background=16a34a&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
  {
    name: "Chungbuk Health",
    enName: "Chungbuk Health Science",
    logo: "https://ui-avatars.com/api/?name=Chungbuk+Health&background=0369a1&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
  {
    name: "Seoul Theological",
    enName: "STU",
    logo: "https://ui-avatars.com/api/?name=Seoul+Theological&background=7c3aed&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
  {
    name: "Seoul Women Univ",
    enName: "Seoul Women's Univ",
    logo: "https://ui-avatars.com/api/?name=Seoul+Women&background=db2777&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
  {
    name: "Kwang Woon",
    enName: "Kwang Woon Univ",
    logo: "https://ui-avatars.com/api/?name=Kwang+Woon&background=0d9488&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
];

// Custom Slider Component
const UniversitySlider = ({ items, title }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + 1 >= items.length - itemsPerPage + 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - 1 < 0 ? items.length - itemsPerPage : prev - 1,
    );
  };

  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);
  // Handle wrapping for infinite-like feel if needed, but simple slice is safer for now
  // To keep it simple and robust without valid infinite loops, we just show a window

  return (
    <div className="py-12 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-8 bg-gray-300" />
        <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
      </div>

      <div className="relative group px-4">
        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary transition-all disabled:opacity-50"
          disabled={startIndex === 0}>
          <ChevronLeft size={24} />
        </button>

        {/* Slider Track */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            initial={false}
            animate={{ x: 0 }} // We aren't doing complex drag, just windowing
          >
            {visibleItems.map((uni, idx) => (
              <motion.div
                key={`${uni.name}-${idx}`}
                layoutId={`${uni.name}-${idx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="min-w-[200px] flex-1">
                <div className="flex flex-col items-center group/item cursor-pointer">
                  <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                    <div className="w-24 h-24 bg-slate-50 p-2 rounded-full">
                      <OptimizedImage
                        src={uni.logo}
                        alt={uni.name}
                        className="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-300"
                        rounded={true}
                        showSkeleton={true}
                      />
                    </div>
                    <div className="absolute top-0 right-0">
                      <span className="text-[10px] font-bold text-blue-600 border border-blue-600 rounded px-1">
                        {uni.type}
                      </span>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-slate-800 text-sm">
                      {uni.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {uni.enName}
                    </p>

                    {uni.badge && (
                      <span
                        className={`inline-block text-[10px] font-bold text-white px-2 py-0.5 rounded mt-2 ${
                          uni.badge === "BEST" ? "bg-red-400" : "bg-emerald-500"
                        }`}>
                        {uni.badge}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary transition-all disabled:opacity-50"
          disabled={startIndex + itemsPerPage >= items.length}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Categories */}
      <section className="pt-32 pb-12 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between gap-8 md:gap-12 max-w-4xl mx-auto">
            {[
              {
                icon: BookOpen,
                label: "Language Training",
                color: "bg-emerald-100 text-emerald-600",
              },
              {
                icon: Building2,
                label: "University",
                color: "bg-orange-100 text-orange-600",
              },
              {
                icon: GraduationCap,
                label: "Graduate school",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: FileText,
                label: "Required documents",
                color: "bg-purple-100 text-purple-600",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-3 group cursor-pointer">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  <item.icon size={28} />
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sliders Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <UniversitySlider
            items={d2Universities}
            title="Available Universities (D-2)"
          />
          <UniversitySlider
            items={d4Universities}
            title="Available Universities (D-4-1)"
          />
        </div>
      </section>
    </div>
  );
}
