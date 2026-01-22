import React from 'react';
import { BookOpen, Globe, GraduationCap, Award, Users, MapPin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card"; // Assuming we might make this, or I will Inline it. 
// Actually I will inline the Card styles to avoid missing file errors, or create a simple Card component in the same file if it's small.
// The user provided code imported Card. I will just use div with classes to keep it simple and robust.

export default function WhyChoose() {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: 'Expert Instruction',
      description: 'Learn from qualified instructors with years of teaching experience across East African curricula.'
    },
    {
      icon: <Globe className="h-8 w-8 text-secondary" />,
      title: 'Comprehensive Resources',
      description: 'Access our extensive digital library with ebooks, journals, and past papers.'
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: 'Live Classes',
      description: 'Interactive online classes with real-time support and collaborative learning.'
    },
    {
      icon: <Award className="h-8 w-8 text-secondary" />,
      title: 'Certificates',
      description: 'Earn recognized certificates upon course completion.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Community Support',
      description: 'Join a vibrant community of learners and professionals.'
    },
    {
      icon: <MapPin className="h-8 w-8 text-secondary" />,
      title: 'Regional Presence',
      description: 'With offices across East Africa, we\'re close to you.'
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">Why Choose TM EduBridge?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We provide comprehensive education services tailored for East African students pursuing local and international opportunities.
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
