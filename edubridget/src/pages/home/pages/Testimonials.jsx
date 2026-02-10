import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();
  const reviews = [
    {
      name: "Jane M.",
      location: "Kenya",
      text: "TM EduBridge transformed my learning experience. I passed my national exams with flying colors!",
      image: "https://i.pravatar.cc/150?img=32",
    },
    {
      name: "Samuel O.",
      location: "Nigeria",
      text: "As a working professional, the flexible learning options helped me earn a certification in my own time.",
      image: "https://i.pravatar.cc/150?img=11",
    },
    {
      name: "Ms. Amina B.",
      location: "Tanzania",
      text: "As an educator, I’ve found their resources aligned with our curriculum and easy to implement.",
      image: "https://i.pravatar.cc/150?img=5",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative quotes in background */}
      <div className="absolute top-10 left-10 text-slate-200 opacity-20 pointer-events-none">
        <FontAwesomeIcon icon={faQuoteLeft} className="text-[10rem]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-primary">
            {t('home_page.testimonials.title')}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t('home_page.testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group"
            >
              <div className="mb-4 text-primary/20 group-hover:text-primary transition-colors duration-500">
                <FontAwesomeIcon icon={faQuoteLeft} className="text-2xl" />
              </div>
              
              <blockquote className="text-slate-700 leading-relaxed mb-6 flex-grow italic text-base">
                "{review.text}"
              </blockquote>
              
              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <p className="text-sm text-slate-500">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
