import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faClock,
  faCertificate,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const WhyChoose = () => {
  const cardData = [
    {
      icon: faGraduationCap,
      title: "Expert Instructors",
      description: "Learn from qualified and experienced educators from around the world, specializing in various subjects.",
      color: "blue",
    },
    {
      icon: faClock, // Using clock for resources/time mentioned in image
      title: "Comprehensive Resources",
      description: "Access a vast library of educational materials, from high school notes to university textbooks.",
      color: "green",
    },
    {
      icon: faUsers,
      title: "Live Classes",
      description: "Participate in interactive live sessions with real-time feedback and personalized attention.",
      color: "orange",
    },
    {
      icon: faUsers,
      title: "Country-Specific Materials",
      description: "Study with resources tailored to your country's curriculum and educational standards.",
      color: "purple",
    },
    {
      icon: faCertificate,
      title: "Certificates",
      description: "Earn recognized certificates upon completion of courses to boost your resume.",
      color: "red",
    },
    {
      icon: faUsers,
      title: "Community Support",
      description: "Join a community of learners, share knowledge, and grow together with peer support.",
      color: "cyan",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 group-hover:bg-primary group-hover:text-white",
      green: "bg-green-50 text-green-600 group-hover:bg-secondary group-hover:text-white",
      orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
      purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
      red: "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white",
      cyan: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white",
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12 xl:px-16 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Why Choose TM EduBridge?
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We offer comprehensive educational resources and courses designed to
            meet the needs of students across Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardData.map((card, index) => (
            <div 
              key={index} 
              className="group bg-white p-10 rounded-3xl transition-all duration-300 border border-slate-200 hover:bg-white shadow-md hover:shadow-2xl hover:border-primary/30 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 ${getColorClasses(card.color)} shadow-sm group-hover:shadow-md`}>
                <FontAwesomeIcon icon={card.icon} className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
