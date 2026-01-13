import React from 'react';
import { ArrowRight, Mail } from 'react-feather';

const CallToAction = () => {
  return (
    <section className="py-24 bg-white px-6">
      <div className="container mx-auto">
        <div className="relative overflow-hidden bg-primary-gradient rounded-[3rem] p-12 md:p-20 text-center shadow-2xl shadow-primary/20">
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
              Ready to Begin Your Learning Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed opacity-90">
              Join thousands of students across Africa who are transforming their
              education with TM EduBridge Online Academy.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="w-full sm:w-auto px-10 py-5 bg-white text-primary font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-slate-50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg">
                Get Started Today
                <ArrowRight size={20} />
              </button>
              
              <button className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg backdrop-blur-sm">
                <Mail size={20} />
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
