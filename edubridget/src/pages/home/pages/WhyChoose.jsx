import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Globe, GraduationCap, Award, Users, MapPin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"; // Assuming we might make this, or I will Inline it. 
// Actually I will inline the Card styles to avoid missing file errors, or create a simple Card component in the same file if it's small.
// The user provided code imported Card. I will just use div with classes to keep it simple and robust.

export default function WhyChoose() {
  const { t } = useTranslation();
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: t('why_choose.features.expert.title'),
      description: t('why_choose.features.expert.desc')
    },
    {
      icon: <Globe className="h-8 w-8 text-secondary" />,
      title: t('why_choose.features.resources.title'),
      description: t('why_choose.features.resources.desc')
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: t('why_choose.features.live.title'),
      description: t('why_choose.features.live.desc')
    },
    {
      icon: <Award className="h-8 w-8 text-secondary" />,
      title: t('why_choose.features.certs.title'),
      description: t('why_choose.features.certs.desc')
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t('why_choose.features.community.title'),
      description: t('why_choose.features.community.desc')
    },
    {
      icon: <MapPin className="h-8 w-8 text-secondary" />,
      title: t('why_choose.features.regional.title'),
      description: t('why_choose.features.regional.desc')
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">{t('why_choose.title')}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {t('why_choose.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow p-6 border border-slate-100">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-xl mb-2 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
