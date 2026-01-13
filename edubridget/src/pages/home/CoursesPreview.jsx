import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faClock,
  faCertificate,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { ArrowRight } from 'react-feather';

const CoursesPreview = () => {
  const courseData = [
    {
      icon: faGraduationCap,
      title: "Korean Language",
      description: "Learn Korean from beginner to advanced levels with native speakers.",
      bgColor: "bg-cyan-50",
      accentColor: "text-cyan-600",
      hoverColor: "group-hover:bg-cyan-600",
    },
    {
      icon: faClock,
      title: "Programming",
      description: "Master programming languages like Python, Java, and web development.",
      bgColor: "bg-emerald-50",
      accentColor: "text-emerald-600",
      hoverColor: "group-hover:bg-emerald-600",
    },
    {
      icon: faCertificate,
      title: "University Courses",
      description: "Access university-level courses across various disciplines.",
      bgColor: "bg-orange-50",
      accentColor: "text-orange-600",
      hoverColor: "group-hover:bg-orange-600",
    },
    {
      icon: faUsers,
      title: "Language Courses",
      description: "Improve your language skills in English, French, Swahili, and more",
      bgColor: "bg-purple-50",
      accentColor: "text-purple-600",
      hoverColor: "group-hover:bg-purple-600",
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Explore Our Courses
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Discover a wide range of courses designed to help you achieve your educational goals.
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-primary font-bold rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
            View All Courses
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courseData.map((course, index) => (
            <div 
              key={index} 
              className={`group ${course.bgColor} p-8 rounded-[2.5rem] transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col items-start`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm ${course.accentColor} transition-all duration-300 ${course.hoverColor} group-hover:text-white group-hover:-rotate-6`}>
                <FontAwesomeIcon icon={course.icon} className="text-xl" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {course.title}
              </h3>
              
              <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                {course.description}
              </p>
              
              <a href="#" className={`flex items-center gap-2 font-bold text-sm ${course.accentColor} group-hover:gap-3 transition-all`}>
                Explore Courses
                <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 md:hidden flex justify-center">
          <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20">
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;
