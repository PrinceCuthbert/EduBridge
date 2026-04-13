import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, GraduationCap } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { mediaService } from "@/services/cmsService";

export default function GalleryPage() {
  const { t } = useTranslation();

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: mediaService.getAll,
    staleTime: 0,
  });

  const [activeImage, setActiveImage] = useState(null);
  const modalRef = useRef(null);

  // Outside-click detection
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setActiveImage(null);
      }
    };

    if (activeImage) {
      document.addEventListener("mousedown", handleClickOutside);
      // ESC key to close
      const handleEscape = (e) => {
        if (e.key === "Escape") setActiveImage(null);
      };
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [activeImage]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="text-white py-16" style={{ backgroundColor: "#1e3a8a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white font-serif">
            {t("gallery_page.hero_title")}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t("gallery_page.hero_subtitle")}
          </p>
        </div>
      </div>

      {/* Masonry Grid Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading skeleton */}
          {isLoading && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="break-inside-avoid mb-6">
                  <div className="rounded-2xl bg-slate-200 animate-pulse" style={{ height: i % 2 === 0 ? '260px' : '340px' }} />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && galleryItems.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No stories yet</p>
              <p className="text-sm mt-1">Add student success stories from the admin CMS.</p>
            </div>
          )}

          {/* Gallery grid */}
          {!isLoading && galleryItems.length > 0 && (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {galleryItems.map((item) => (
              <motion.div
                key={item.id}
                className="break-inside-avoid mb-6 cursor-pointer group"
                onClick={() => setActiveImage(item)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}>
                <div className="relative overflow-hidden rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300">
                  <OptimizedImage
                    src={item.image}
                    alt={item.studentName}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    showSkeleton={true}
                  />

                  {/* Overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white font-bold text-xl mb-1">
                      {item.studentName}
                    </h3>
                    <p className="text-white/90 text-sm flex items-center mb-2">
                      <MapPin className="h-4 w-4 mr-1" /> {item.country}
                    </p>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <GraduationCap className="h-4 w-4" />
                      <span>{item.program}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Isolated Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            {/* Modal Content */}
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-[92vw] md:w-[85vw] max-w-5xl h-[85vh] md:h-[80vh] bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
              {/* Close Button */}
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-20 p-2 md:p-3 bg-slate-900/60 hover:bg-slate-900/90 md:bg-slate-100 md:hover:bg-slate-200 rounded-full text-white md:text-slate-600 md:hover:text-slate-900 transition-all backdrop-blur-md border border-white/20 md:border-transparent cursor-pointer">
                <X className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              {/* Image Section with Watermark */}
              <div className="relative w-full md:w-1/2 h-[45%] md:h-full bg-slate-100 flex-shrink-0">
                  <img
                    src={activeImage.image}
                    alt={activeImage.studentName}
                    className="w-full h-full object-cover"
                  />

                  {/* EduBridge Watermark */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center gap-3">
                      {/* Logo Image */}
                      <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-white/10 p-0.5">
                        <img 
                          src="/tmlogo.jpg" 
                          alt="EduBridge Logo" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">
                          EduBridge
                        </p>
                        <p className="text-white/80 text-xs italic">
                          {t("gallery_page.slogan")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white overflow-y-auto">
                  <div className="mb-6 pt-2 md:pt-0">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 font-serif leading-tight">
                      {activeImage.studentName}
                    </h2>
                    <p className="text-primary font-semibold text-base md:text-lg mb-2">
                      {activeImage.university}
                    </p>
                    <div className="flex items-center text-slate-500 text-sm gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{activeImage.country}</span>
                    </div>
                  </div>

                  <div className="relative pl-5 md:pl-6 mb-6 border-l-4 border-primary/20">
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed italic">
                      "{activeImage.testimony}"
                    </p>
                  </div>

                  <div className="space-y-3 mt-auto md:mt-0">
                    <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wide font-bold">
                      {t("gallery_page.program_label")}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
                      <GraduationCap className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="font-semibold text-sm md:text-base">
                        {activeImage.program}
                      </span>
                    </div>
                  </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
