import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faEdit,
  faFileAlt,
  faChalkboardTeacher,
  faLaptop,
  faMoneyCheckAlt,
} from "@fortawesome/free-solid-svg-icons";

const AcademicServices = () => {
  const cardData = [
    {
      icon: faBook,
      title: "Thesis Writing Support",
      content: [
        "Guidance with structure, content, and formatting",
        "Assistance at any stage: proposal, draft, or final submission",
      ],
      color: "blue",
    },
    {
      icon: faEdit,
      title: "Proofreading & Editing",
      content: [
        "Grammar, punctuation, and spelling corrections",
        "Academic style and clarity improvements",
        "Consistency in formatting and references (APA, MLA, IEEE, etc.)",
      ],
      color: "indigo",
    },
    {
      icon: faFileAlt,
      title: "Research Paper & Journal Publication",
      content: [
        "Editing and formatting for journal submission",
        "Plagiarism check and reduction support",
        "Assistance with response to reviewers",
      ],
      color: "purple",
    },
    {
      icon: faChalkboardTeacher,
      title: "Academic Advisory & Coaching",
      content: [
        "Topic selection and refinement",
        "Research methodology support",
        "Data analysis guidance (qualitative & quantitative)",
      ],
      color: "teal",
    },
    {
      icon: faLaptop,
      title: "Presentation & Defense Preparation",
      content: [
        "Slide design and content review",
        "Mock defense sessions with feedback",
      ],
      color: "emerald",
    },
    {
      icon: faMoneyCheckAlt,
      title: "Scholarship & Grant Application",
      content: [
        "Statement of purpose (SOP) and personal statement editing",
        "CV and recommendation letter support",
      ],
      color: "blue",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "text-primary bg-blue-50",
      indigo: "text-indigo-600 bg-indigo-50",
      purple: "text-purple-600 bg-purple-50",
      teal: "text-secondary bg-green-50",
      emerald: "text-secondary-dark bg-green-100",
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 lg:px-12 xl:px-16 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Academic Services Offered
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Comprehensive academic support to help you succeed in your educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardData.map((card, index) => (
            <div 
              key={index} 
              className="flex flex-col h-full p-8 rounded-3xl border border-slate-200 hover:border-primary/30 shadow-md hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 bg-white group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${getColorClasses(card.color)}`}>
                  <FontAwesomeIcon icon={card.icon} className="text-xl" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
              </div>
              
              <ul className="space-y-3 mt-auto">
                {card.content.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcademicServices;
