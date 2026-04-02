import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="relative py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {/* Background Image - Replace with your actual image */}
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80" 
          alt="Students collaborating" 
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70" />
      </div>

      {/* Decorative gradient accents */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-accent/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Heading */}
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight">
          Ready to Start Your Journey?
        </h2>
        
        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of students across East Africa using EduBridge to unlock their full potential
        </p>
        
        {/* Buttons - Same size, centered */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md mx-auto sm:max-w-none">
          <Link to="/signin" className="w-full sm:w-auto min-h-[48px] flex">
            <button className="group w-full sm:w-auto min-h-[48px] min-w-0 sm:min-w-[200px] px-6 py-3 inline-flex items-center justify-center bg-accent hover:bg-accent-light text-slate-900 rounded-2xl font-bold hover:shadow-glow-amber hover:scale-105 active:scale-95 transition-all shadow-xl text-base">
              Start Learning Today
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          
          <Link to="/contact" className="w-full sm:w-auto min-h-[48px] flex">
            <button className="w-full sm:w-auto min-h-[48px] min-w-0 sm:min-w-[200px] px-6 py-3 inline-flex items-center justify-center bg-white/10 backdrop-blur-md border-2 border-white/40 text-white rounded-2xl font-bold hover:bg-white/20 hover:border-white/60 transition-all text-base">
              Get in Touch
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
