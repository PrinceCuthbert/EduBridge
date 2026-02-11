import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Building2,
  GraduationCap,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import OptimizedImage from "@/components/OptimizedImage";
import { BASE_URL } from "@/config/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import Partners from "../../components/partners/Partners";

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
  const { t } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/partners`);
        if (!res.ok) throw new Error("Failed to load partners");
        const data = await res.json();
        setPartners(data);
      } catch (error) {
        console.error("Error loading partners:", error);
        toast.error("Failed to load partners");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const d2Universities = partners.filter((p) => p.type === "D-2");
  const d4Universities = partners.filter((p) => p.type === "D-4-1");

  return (
    <div className="min-h-screen bg-white">
      {/* Top Categories */}
      <section className="pt-32 pb-12 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between gap-8 md:gap-12 max-w-4xl mx-auto">
            {[
              {
                icon: BookOpen,
                label: t("partners_page.categories.language_training"),
                color: "bg-emerald-100 text-emerald-600",
              },
              {
                icon: Building2,
                label: t("partners_page.categories.university"),
                color: "bg-orange-100 text-orange-600",
              },
              {
                icon: GraduationCap,
                label: t("partners_page.categories.graduate_school"),
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: FileText,
                label: t("partners_page.categories.required_documents"),
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
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <UniversitySlider
                items={d2Universities}
                title={t("partners_page.sliders.d2_title")}
              />
              <UniversitySlider
                items={d4Universities}
                title={t("partners_page.sliders.d4_title")}
              />

              {/* <Partners /> */}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
