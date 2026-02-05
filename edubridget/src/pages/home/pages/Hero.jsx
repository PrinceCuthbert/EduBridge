import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { t } = useTranslation();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/Students.png"
          >
            <source src="/education-background.mp4" type="video/mp4" />
            {/* Fallback: If video doesn't load, gradient shows */}
          </video>
          
          {/* Dark overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
          
          {/* Fallback gradient background if video fails */}
          <div className="absolute inset-0 bg-primary-gradient opacity-90" style={{ mixBlendMode: 'multiply' }} />
        </div>

        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Content side */}
            <div className="flex-1 text-center lg:text-left">
              {/* Live Badge with improved styling */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white backdrop-blur-md rounded-full text-sm font-semibold mb-6 border border-white/20">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
                <span className="text-accent font-bold">● LIVE</span>
                <span>2,400+ Students Online Now</span>
              </div>
              
              {/* Heading with updated micro-copy */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 font-serif">
                Learn from the Best{' '}
                <span className="block mt-2 bg-gradient-to-r from-accent via-accent-light to-secondary bg-clip-text text-transparent">
                  in East Africa
                </span>
              </h1>
              
              {/* Subheading with regional context */}
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Access world-class education, resources, and expert guidance to achieve your academic goals—right here in Kigali, Nairobi, and beyond.
              </p>
              
              {/* CTAs with amber primary button */}
              <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                <Link to="/coursesPage">
                  <button className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-light text-slate-900 rounded-2xl font-bold shadow-glow-amber hover:shadow-glow-amber hover:scale-105 active:scale-95 transition-all text-lg">
                    Start Learning Today
                    <ArrowRight className="inline-block ml-2 h-5 w-5" />
                  </button>
                </Link>
                
                <button 
                  onClick={() => setIsVideoOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-3 text-white font-semibold hover:bg-white/10 border-2 border-white/30 rounded-2xl backdrop-blur-sm transition-all group text-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all">
                    <Play size={18} className="fill-white ml-0.5" />
                  </div>
                  Watch Intro
                </button>
              </div>
              
              {/* Student avatars with organic shapes */}
              <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-12 h-12 border-2 border-white/50 bg-white/20 backdrop-blur-sm overflow-hidden shadow-md hover:scale-110 hover:z-10 transition-all" 
                      style={{
                        borderRadius: i % 2 === 0 
                          ? '40% 60% 60% 40% / 60% 40% 60% 40%' 
                          : '60% 40% 40% 60% / 40% 60% 40% 60%',
                        transform: `rotate(${i * 12}deg)`
                      }}
                    >
                      <img 
                        src={`https://i.pravatar.cc/48?img=${i+10}`} 
                        alt={`Student ${i}`} 
                        className="w-full h-full object-cover"
                        style={{ transform: `rotate(-${i * 12}deg)` }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/90 font-medium">
                  <strong className="text-white text-lg">10k+</strong> Students joined this month
                </p>
              </div>
            </div>

            {/* Image side with glassmorphic card */}
            <div className="flex-1 relative w-full max-w-2xl">
              <div className="relative z-10 group">
                {/* Glow effect */}
                <div className="absolute -inset-6 bg-gradient-to-r from-accent/30 via-primary/20 to-secondary/30 rounded-[3rem] blur-2xl opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Main image container */}
                <div className="relative bg-white/10 p-4 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md border border-white/20">
                  <img 
                    src="/Students.png" 
                    alt="Students celebrating graduation" 
                    className="rounded-2xl w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Floating certified badge */}
                <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lift animate-bounce-gentle hover:scale-105 transition-transform cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Certified</p>
                      <p className="text-sm font-bold text-slate-900">Expert Courses</p>
                    </div>
                  </div>
                </div>
                
                {/* Success rate badge */}
                <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-accent to-accent-light p-6 rounded-2xl shadow-lift hover:scale-105 transition-transform cursor-default">
                  <p className="text-3xl font-bold text-slate-900 mb-1">98%</p>
                  <p className="text-sm text-slate-700 font-semibold">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsVideoOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsVideoOpen(false)} 
              className="absolute top-4 right-4 z-[110] p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-sm hover:scale-110"
            >
              <X size={24} />
            </button>

            {/* Video Player */}
            <video 
              className="w-full h-full object-contain"
              controls 
              autoPlay
              playsInline
              src="/CEO_Welcome_Video_2021(1080p).mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
