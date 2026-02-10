import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Globe, GraduationCap, Award, Users, MapPin } from 'lucide-react';

export default function WhyChoose() {
  const { t } = useTranslation();
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Learn from East Africa's Top Educators",
      description: "Expert instruction from proven academics and industry leaders",
      isLive: false
    },
    {
      icon: <Globe className="h-8 w-8 text-secondary" />,
      title: "World-Class Digital Resources",
      description: "Access cutting-edge learning materials anytime, anywhere",
      isLive: false
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-accent" />,
      title: "Live Interactive Classes",
      description: "Real-time engagement with instructors and peers across the continent",
      isLive: true
    },
    {
      icon: <Award className="h-8 w-8 text-secondary" />,
      title: "Globally Recognized Certificates",
      description: "Credentials that open doors to opportunities worldwide",
      isLive: false
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Vibrant Student Community",
      description: "Join thousands of ambitious learners building Africa's future",
      isLive: false
    },
    {
      icon: <MapPin className="h-8 w-8 text-accent" />,
      title: "East African Excellence",
      description: "Tailored curriculum addressing regional opportunities and challenges",
      isLive: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-slate-50 to-emerald-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">
            Why Choose EduBridge?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Experience education designed for the modern African learner
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="rounded-2xl shadow-soft hover:shadow-lift hover:-translate-y-1 transition-all duration-300 p-8 border border-slate-200 group cursor-pointer"
              style={{ backgroundColor: '#EDF2F7' }}
            >
              {/* Icon container */}
              <div className="mb-5 group-hover:scale-110 transition-transform duration-300">
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="font-bold text-xl mb-3 text-slate-800">
                {feature.title}
              </h3>
              
              <p className="text-slate-700 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
