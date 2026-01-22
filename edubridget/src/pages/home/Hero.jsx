import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary-gradient">
        {/* Background Decorative Elements - Adjusted for dark background */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Content side */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white backdrop-blur-sm rounded-full text-sm font-semibold mb-6 animate-fade-in border border-white/20">
                <span className="flex h-2 w-2 rounded-full bg-secondary-light animate-pulse" />
                Empowering Africa's Future
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6 font-serif">
                Empowering Africa through 
                <span className="block mt-2">Knowledge</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Access quality education, resources, and expert guidance to achieve your academic goals with TM EduBridge Online Academy.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-primary rounded-2xl font-bold shadow-xl shadow-black/10 hover:bg-slate-50 hover:shadow-2xl transition-all active:scale-95 text-lg">
                  Explore Courses
                </button>
                
                <button 
                  onClick={() => setIsVideoOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2 text-white font-bold hover:bg-white/10 border border-white/30 rounded-2xl transition-all group text-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Play size={20} className="fill-white ml-1" />
                  </div>
                  Watch Intro
                </button>
              </div>
              
              <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white/50 bg-white/20 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/40?img=${i+10}`} alt={`Student ${i}`} />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/80 font-medium">
                  <strong className="text-white">10k+</strong> Students joined this month
                </p>
              </div>
            </div>

            {/* Image side */}
            <div className="flex-1 relative w-full max-w-2xl">
              <div className="relative z-10 group">
                <div className="absolute -inset-4 bg-white/10 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-white/20 p-3 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-sm border border-white/30">
                  <img 
                    src="/Students.png" 
                    alt="Students holding diplomas" 
                    className="rounded-[2rem] w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce duration-[3000ms]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary-light/10 rounded-xl flex items-center justify-center text-secondary">
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
                
                <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-2xl shadow-xl animate-pulse">
                  <p className="text-2xl font-bold text-slate-900 mb-1">98%</p>
                  <p className="text-xs text-slate-500 font-medium">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsVideoOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsVideoOpen(false)} 
              className="absolute top-4 right-4 z-[110] p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm"
            >
              <X size={24} />
            </button>

            {/* Native Video Player for better local file support */}
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
