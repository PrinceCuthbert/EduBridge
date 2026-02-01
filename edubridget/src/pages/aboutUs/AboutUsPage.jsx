import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faStar,
  faUniversalAccess,
  faLightbulb,
  faUsers,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from 'react-i18next';
// import { Facebook, Twitter, Instagram, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react'; // Recommended replacement for SVG icons

// --- DATA MAPPING HELPER ---
// This ensures we map the icon strings from JSON to actual FontAwesome components
const iconMap = {
  graduation: faGraduationCap,
  star: faStar,
  access: faUniversalAccess,
  lightbulb: faLightbulb,
  users: faUsers,
  heart: faHeart
};

// --- SUB-COMPONENT: Social Link ---
const SocialLink = ({ href, bgClass, label, children }) => (
  <a 
    href={href} 
    aria-label={label}
    className={`w-8 h-8 rounded-full text-white flex items-center justify-center transition-all text-xs font-bold hover:scale-110 ${bgClass}`}
  >
    {children}
  </a>
);

function AboutUsPage() {
  const { t } = useTranslation();

  // 1. DYNAMIC DATA: We now pull the data structure from our translation file using t(..., { returnObjects: true })
  // This allows the array to live in the JSON file, not the JS file.
  const coreValues = t('about.core_values', { returnObjects: true });
  const teamMembers = t('about.team_members', { returnObjects: true });
  const founderMessage = t('about.founder_message_paragraphs', { returnObjects: true });

  const getIconBgColor = (color) => {
    const bgColors = {
      blue: "bg-blue-100 text-blue-500",
      yellow: "bg-yellow-100 text-yellow-500",
      green: "bg-green-100 text-green-500",
      purple: "bg-purple-100 text-purple-500",
      orange: "bg-orange-100 text-orange-500",
      pink: "bg-pink-100 text-pink-500",
    };
    return bgColors[color] || "bg-primary/10 text-primary";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-primary-gradient">
        <div className="absolute top-0 left-0 -translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 font-serif text-white">
            {t('about.hero_title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {t('about.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Founder's Message Section - REFACTORED */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 font-serif">
              {t('about.founder_title')}
            </h2>
            <p className="text-slate-600">{t('about.founder_subtitle')}</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Founder Profile Card */}
              <div className="lg:col-span-1 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                    alt={t('about.founder_name')}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{t('about.founder_name')}</h3>
                <p className="text-sm text-slate-600 mb-4">{t('about.founder_role')}</p>
                
                <div className="flex gap-3">
                  <SocialLink href="#" bgClass="bg-blue-600 hover:bg-blue-700" label="Facebook">f</SocialLink>
                  <SocialLink href="#" bgClass="bg-sky-500 hover:bg-sky-600" label="Twitter">𝕏</SocialLink>
                  <SocialLink href="#" bgClass="bg-pink-600 hover:bg-pink-700" label="Instagram">IG</SocialLink>
                  <SocialLink href="#" bgClass="bg-blue-700 hover:bg-blue-800" label="LinkedIn">in</SocialLink>
                </div>
              </div>

              {/* Message Content - MAPPED */}
              <div className="lg:col-span-3 space-y-4 text-slate-700 leading-relaxed">
                <p className="font-medium">{t('about.founder_greeting')}</p>
                
                {/* Dynamic Paragraph Mapping */}
                {founderMessage && founderMessage.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}

                <p className="font-medium">{t('about.founder_closing')}</p>
                
                <div className="pt-4">
                  <p className="font-bold">{t('about.founder_signoff_warm')}</p>
                  <p className="font-bold">{t('about.founder_name')}</p>
                  <p className="font-bold text-primary">{t('about.founder_role')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 font-serif">
              {t('about.values_title')}
            </h2>
            <p className="text-slate-600">{t('about.values_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {coreValues && coreValues.map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${getIconBgColor(value.color)}`}>
                  {/* We use the map because JSON only stores strings like "graduation", not the object */}
                  <FontAwesomeIcon icon={iconMap[value.iconKey]} className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Slider Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 font-serif">
               {t('about.team_title')}
            </h2>
            <p className="text-slate-600">{t('about.team_subtitle')}</p>
          </div>

          <TeamSlider members={teamMembers} />
        </div>
      </section>
    </div>
  );
}

// Optimized Team Slider
const TeamSlider = ({ members }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3); // Adjusted max items to 3 for better readability
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Safe Guard against empty data
  if (!members || members.length === 0) return null;

  const totalPages = Math.ceil(members.length / itemsPerPage); 
  // NOTE: Simple pagination logic is often better than infinite scrolling for accessibility, 
  // but sticking to your infinite loop logic requires checking boundaries carefully.

  const handleNext = () => {
     setCurrentIndex((prev) => (prev + 1) % members.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? members.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(handleNext, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, members.length]); // Add members.length dependency

  return (
    <div 
      className="relative max-w-7xl mx-auto px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Controls */}
      <button onClick={handlePrev} aria-label="Previous member" className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center text-slate-600 hover:text-primary transition-all hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <div className="overflow-hidden py-4">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            // Logic updated to ensure smooth sliding based on items per page width
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`, 
          }}
        >
          {members.map((member, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 px-4"
              style={{ width: `${100 / itemsPerPage}%` }}
            >
              <div className="flex flex-col items-center text-center group">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-slate-100 shadow-lg group-hover:border-primary/20 transition-all duration-500">
                  <img
                    // Fallback image handling
                    src={member.image || "https://via.placeholder.com/200"}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">{member.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] mx-auto line-clamp-3">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleNext} aria-label="Next member" className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center text-slate-600 hover:text-primary transition-all hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
};

export default AboutUsPage;
