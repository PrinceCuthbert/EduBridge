import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, GraduationCap, Globe, Award, Users, MapPin } from 'lucide-react';

export default function AcademicServices() {
  const { t } = useTranslation();
  const services = [
    {
      title: t('services.items.thesis.title'),
      description: t('services.items.thesis.desc'),
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: t('services.items.proofreading.title'),
      description: t('services.items.proofreading.desc'),
      icon: <GraduationCap className="h-6 w-6" />
    },
    {
      title: t('services.items.research.title'),
      description: t('services.items.research.desc'),
      icon: <Globe className="h-6 w-6" />
    },
    {
      title: t('services.items.scholarships.title'),
      description: t('services.items.scholarships.desc'),
      icon: <Award className="h-6 w-6" />
    },
    {
      title: t('services.items.advisory.title'),
      description: t('services.items.advisory.desc'),
      icon: <Users className="h-6 w-6" />
    },
    {
      title: t('services.items.study_abroad.title'),
      description: t('services.items.study_abroad.desc'),
      icon: <MapPin className="h-6 w-6" />
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">{t('services.title')}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
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
