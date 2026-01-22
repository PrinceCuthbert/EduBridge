import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Building2, GraduationCap, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Mock Data for Universities
const d2Universities = [
  { name: 'Kyungsung University', enName: 'Kyungsung University', logo: 'https://images.unsplash.com/photo-1592280771800-b6c9af522372?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-2' },
  { name: 'Geoje University', enName: 'Geoje University', logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-2' },
  { name: 'Seoul Theological', enName: 'Seoul Theological Univ', logo: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-2' },
  { name: 'Gangseo University', enName: 'Gangseo University', logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-2' },
  { name: 'Indu University', enName: 'Indu University', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-2' },
  { name: 'Calvin University', enName: 'Calvin University', logo: 'https://images.unsplash.com/photo-1607237138186-73a68600c0d9?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-2' },
  { name: 'Daejin University', enName: 'Daejin University', logo: 'https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?w=100&h=100&fit=crop', badge: 'BEST', type: 'D-2' },
  { name: 'Soongsil University', enName: 'Soongsil University', logo: 'https://images.unsplash.com/photo-1535982330050-f1c2fb970584?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-2' },
];

const d4Universities = [
  { name: 'Tongwon University', enName: 'Tongwon University', logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-4-1' },
  { name: 'Seoul Theological', enName: 'STU - VIET NAM', logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-4-1' },
  { name: 'Chungbuk Health', enName: 'Chungbuk Health Science', logo: 'https://images.unsplash.com/photo-1558021284-833085ea78c7?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-4-1' },
  { name: 'Seoul Theological', enName: 'STU', logo: 'https://images.unsplash.com/photo-1560523160-754a9e25c68f?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-4-1' },
  { name: 'Seoul Women Univ', enName: 'Seoul Women\'s Univ', logo: 'https://images.unsplash.com/photo-1621640786029-22ad31da5218?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-4-1' },
  { name: 'Kwang Woon', enName: 'Kwang Woon Univ', logo: 'https://images.unsplash.com/photo-1548102268-1af9a502cf8d?w=100&h=100&fit=crop', badge: 'NEW', type: 'D-4-1' },
];

// Custom Slider Component
const UniversitySlider = ({ items, title }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  const nextSlide = () => {
    setStartIndex((prev) => 
      prev + 1 >= items.length - itemsPerPage + 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) => 
      prev - 1 < 0 ? items.length - itemsPerPage : prev - 1
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
          disabled={startIndex === 0}
        >
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
                className="min-w-[200px] flex-1"
              >
                <div className="flex flex-col items-center group/item cursor-pointer">
                  <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
                    <img 
                      src={uni.logo} 
                      alt={uni.name} 
                      className="w-24 h-24 object-contain rounded-full bg-slate-50 p-2 group-hover/item:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute top-0 right-0">
                      <span className="text-[10px] font-bold text-blue-600 border border-blue-600 rounded px-1">{uni.type}</span>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-slate-800 text-sm">{uni.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{uni.enName}</p>
                    
                    {uni.badge && (
                      <span className={`inline-block text-[10px] font-bold text-white px-2 py-0.5 rounded mt-2 ${
                        uni.badge === 'BEST' ? 'bg-red-400' : 'bg-emerald-500'
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
          disabled={startIndex + itemsPerPage >= items.length}
        >
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
              { icon: BookOpen, label: 'Language Training', color: 'bg-emerald-100 text-emerald-600' },
              { icon: Building2, label: 'University', color: 'bg-orange-100 text-orange-600' },
              { icon: GraduationCap, label: 'Graduate school', color: 'bg-blue-100 text-blue-600' },
              { icon: FileText, label: 'Required documents', color: 'bg-purple-100 text-purple-600' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 group cursor-pointer">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  <item.icon size={28} />
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sliders Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <UniversitySlider items={d2Universities} title="Available Universities (D-2)" />
          <UniversitySlider items={d4Universities} title="Available Universities (D-4-1)" />
        </div>
      </section>
    </div>
  );
}
