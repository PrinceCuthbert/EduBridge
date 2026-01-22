import React from 'react';
import { BookOpen, GraduationCap, Globe, Award, Users, MapPin } from 'lucide-react';

export default function AcademicServices() {
  const services = [
    {
      title: 'Thesis Writing & Consulting',
      description: 'Expert guidance for your academic research and thesis preparation.',
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: 'Proofreading & Formatting',
      description: 'Professional editing services to perfect your academic documents.',
      icon: <GraduationCap className="h-6 w-6" />
    },
    {
      title: 'Research Papers & Journals',
      description: 'Access to academic journals and assistance with research papers.',
      icon: <Globe className="h-6 w-6" />
    },
    {
      title: 'Scholarships & Travel Support',
      description: 'Complete application support for scholarships and international programs.',
      icon: <Award className="h-6 w-6" />
    },
    {
      title: 'Academic Advisory & Consulting',
      description: 'One-on-one consultations for academic and career planning.',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Scholarship to Study Abroad',
      description: 'Fully funded and partial scholarship opportunities worldwide.',
      icon: <MapPin className="h-6 w-6" />
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">Academic Services Offered</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Comprehensive support for your academic and career journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="border border-slate-200 rounded-lg hover:border-primary hover:shadow-lg transition-all p-6 group">
              <div className="w-12 h-12 bg-primary-gradient rounded-lg flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-slate-900">{service.title}</h3>
              <p className="text-slate-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
