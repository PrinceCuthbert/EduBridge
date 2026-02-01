import React, { useState } from "react"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from 'react-i18next';
import {
  faTag,
  faClock,
  faCertificate,
  faGraduationCap,
  faUsers,
  faTrophy, 
  faPlay, 
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import FeaturedCourses from "./featuredCourse.jsx";
// import Footer from "../footer/footer.jsx"; // Removed as requested by user pattern? Or kept? The user said "scaling to rest of app". I'll assume Footer is used in App.jsx layout, not here. But wait, it was imported. I should verify if App.jsx handles Footer globally. 
// Looking at App.jsx earlier, it seemed to have Footer globally. But let's check. 
// Actually, in step 237, viewed_file App.jsx showed Footer inside Router. So I might not need it here if it's already in the layout.
// However, the original file had it. I'll leave it out if it simplifies, but to be safe, I'll check if I should remove it. 
// Ah, the original code had `import Footer from "../footer/footer.jsx";`. I should probably keep it if it's used, but usually Footer is global.
// Let's assume standard refactor: simple replacement.

// Icon mapping
const iconMap = {
  graduation: faGraduationCap,
  users: faUsers,
  certificate: faCertificate,
  tag: faTag,
  star: faStar,
  clock: faClock,
  trophy: faTrophy,
  play: faPlay
};

function CourseCategory({ iconKey, title, description, colorClass }) {
  const Icon = iconMap[iconKey] || faGraduationCap;
  
  return (
    <div className={`p-8 rounded-[2rem] transition-all duration-300 border border-slate-200 hover:shadow-2xl hover:bg-white hover:border-primary/30 group flex flex-col items-start h-full bg-white shadow-md`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-all duration-300 ${colorClass} group-hover:scale-110`}>
        <FontAwesomeIcon icon={Icon} className="text-xl" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
        {description}
      </p>
      <a className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
        Explore courses <span className="text-lg">→</span>
      </a>
    </div>
  );
}

function CoursesPage() {
  const { t } = useTranslation();
  
  const courseCategories = t('courses.categories', { returnObjects: true });
  const features = t('courses.features', { returnObjects: true });
  const instructorBenefits = t('courses.instructor_benefits', { returnObjects: true });

  return (
    <div className="min-h-screen bg-white">
      {/* Intro Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary-gradient">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left text-white">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-8 font-serif text-white">
                {t('courses.hero_title')}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t('courses.hero_subtitle')}
              </p>
              <button className="px-8 py-4 bg-white text-primary rounded-2xl font-bold shadow-xl shadow-black/10 hover:bg-slate-50 transition-all active:scale-95 text-lg">
                {t('courses.hero_button')}
              </button>
            </div>
            <div className="flex-1 relative w-full max-w-2xl">
              <div className="relative bg-white/20 p-3 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-sm border border-white/30">
                <img
                  src="istockphoto-2094337676-1024x1024.jpg"
                  alt="Empowering Africa"
                  className="rounded-[2rem] w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 font-serif">
              {t('courses.categories_title')}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t('courses.categories_subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {courseCategories && courseCategories.map((category, index) => (
              <CourseCategory
                key={index}
                {...category}
              />
            ))}
          </div>
        </div>
      </section>

      <FeaturedCourses />
      
      {/* Features List */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-6 font-serif leading-tight">
                {t('courses.features_title')}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-10">
                {t('courses.features_subtitle')}
              </p>
              
              <div className="space-y-6">
                {features && features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <span className="text-xs font-bold text-lg">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{feature.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <img 
                    src="/alexander.jpg" 
                    alt="Student 1" 
                    className="rounded-3xl w-full h-64 object-cover shadow-lg"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/300x400?text=Student+1")}
                  />
                  <img 
                    src="/vinicius.jpg" 
                    alt="Student 2" 
                    className="rounded-3xl w-full h-48 object-cover shadow-lg"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/300x300?text=Student+2")}
                  />
                </div>
                <div className="space-y-4">
                  <img 
                    src="/headshot.png" 
                    alt="Student 3" 
                    className="rounded-3xl w-full h-80 object-cover shadow-lg"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/300x500?text=Student+3")}
                  />
                  <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 h-32 flex flex-col justify-center italic text-primary font-medium text-sm">
                    "{t('courses.testimonial_quote')}"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become Instructor */}
      <section className="py-24 bg-white px-6">
        <div className="container mx-auto">
          <div className="relative overflow-hidden bg-primary-gradient rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 lg:p-20 shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center text-white">
              <div>
                <h2 className="text-2xl md:text-5xl font-extrabold mb-4 md:mb-8 leading-tight font-serif text-white">
                  {t('courses.instructor_title')}
                </h2>
                <p className="text-sm md:text-xl text-white/90 mb-6 md:mb-12 leading-relaxed opacity-90">
                  {t('courses.instructor_subtitle')}
                </p>
                <button className="w-full md:w-auto px-6 py-3 md:px-10 md:py-5 bg-white text-primary font-bold rounded-xl md:rounded-2xl shadow-xl shadow-black/10 hover:bg-slate-50 transition-all active:scale-95 text-sm md:text-lg">
                  {t('courses.instructor_button')}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {instructorBenefits && instructorBenefits.map((item, idx) => {
                   const Icon = iconMap[item.iconKey] || faStar;
                   return (
                    <div key={idx} className="flex items-start md:items-center gap-4 md:gap-6 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all group">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <FontAwesomeIcon icon={Icon} className="text-lg md:text-xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-bold mb-1 text-white">{item.title}</h3>
                        <p className="text-white/80 text-xs md:text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}

export default CoursesPage;
