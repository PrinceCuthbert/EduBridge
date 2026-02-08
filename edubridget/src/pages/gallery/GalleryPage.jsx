import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, GraduationCap } from 'lucide-react';

import { MOCK_MEDIA as galleryItems } from '@/data/mockData';

export default function GalleryPage() {
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
      document.addEventListener('mousedown', handleClickOutside);
      // ESC key to close
      const handleEscape = (e) => {
        if (e.key === 'Escape') setActiveImage(null);
      };
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [activeImage]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="text-white py-16" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white font-serif">Success Stories</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            See where our students are studying and hear about their journey with EduBridge.
          </p>
        </div>
      </div>

      {/* Masonry Grid Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {galleryItems.map((item) => (
              <motion.div
                key={item.id}
                className="break-inside-avoid mb-6 cursor-pointer group"
                onClick={() => setActiveImage(item)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300">
                  <img 
                    src={item.image} 
                    alt={item.studentName} 
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white font-bold text-xl mb-1">{item.studentName}</h3>
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
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-20 p-3 bg-slate-900/80 hover:bg-slate-900 rounded-full text-white transition-colors backdrop-blur-sm"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="grid md:grid-cols-2">
                {/* Image Section with Watermark */}
                <div className="relative h-[400px] md:h-[600px] bg-slate-100">
                  <img 
                    src={activeImage.image} 
                    alt={activeImage.studentName} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* EduBridge Watermark */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center gap-3">
                      {/* Logo SVG */}
                      <div className="w-10 h-10 flex-shrink-0">
                        <svg viewBox="0 0 48 48" className="w-full h-full">
                          <path d="M 8 40 Q 24 8, 40 40" fill="none" stroke="url(#lightboxGradient1)" strokeWidth="3" strokeLinecap="round" />
                          <path d="M 12 38 Q 24 14, 36 38" fill="none" stroke="url(#lightboxGradient2)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                          <defs>
                            <linearGradient id="lightboxGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#60a5fa" />
                              <stop offset="100%" stopColor="#93c5fd" />
                            </linearGradient>
                            <linearGradient id="lightboxGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#93c5fd" />
                              <stop offset="100%" stopColor="#bfdbfe" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">EduBridge</p>
                        <p className="text-white/80 text-xs italic">Bridging Dreams</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2 font-serif">{activeImage.studentName}</h2>
                    <p className="text-primary font-semibold text-lg mb-2">{activeImage.university}</p>
                    <div className="flex items-center text-slate-500 text-sm gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{activeImage.country}</span>
                    </div>
                  </div>
                  
                  <div className="relative pl-6 mb-6 border-l-4 border-primary/20">
                    <p className="text-slate-600 text-base leading-relaxed italic">
                      "{activeImage.testimony}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Program</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
                      <GraduationCap className="h-5 w-5" />
                      <span className="font-semibold">{activeImage.program}</span>
                    </div>
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
