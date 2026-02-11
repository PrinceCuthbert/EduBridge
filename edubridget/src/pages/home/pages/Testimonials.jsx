import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "react-i18next";

// Import your reusable tools
import { FeatureGrid } from "../../../components/ui/card";
import { TestimonialCard } from "../../../components/TestimonialCard";

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
      {/* Background Decoration */}
      <div className="absolute top-10 left-10 text-slate-200 opacity-20 pointer-events-none">
        <FontAwesomeIcon icon={faQuoteLeft} className="text-[10rem]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-primary">
            {t("home_page.testimonials.title")}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t("home_page.testimonials.subtitle")}
          </p>
        </div>

        {/* Using the reusable Grid and Testimonial Card */}
        <FeatureGrid
          items={reviews}
          renderItem={(review, index) => (
            <TestimonialCard
              key={index}
              {...review} // Automatically maps name, location, text, image
            />
          )}
        />
      </div>
    </section>
  );
};

export default Testimonials;
