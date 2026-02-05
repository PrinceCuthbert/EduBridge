import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Globe, Award, Users, MapPin } from 'lucide-react';

export default function AcademicServices() {
  const services = [
    {
      title: "Academic Writing Excellence",
      description: "Professional thesis and research paper support from East Africa's top academic experts",
      icon: BookOpen
    },
    {
      title: "Expert Proofreading",
      description: "Polish your work with our meticulous editing and quality assurance services",
      icon: GraduationCap
    },
    {
      title: "Research Guidance",
      description: "Navigate complex research projects with dedicated mentorship and resources",
      icon: Globe
    },
    {
      title: "Scholarship Opportunities",
      description: "Unlock funding for your dreams with personalized scholarship matching",
      icon: Award
    },
    {
      title: "Career Advisory",
      description: "Strategic guidance from industry professionals shaping East Africa's future",
      icon: Users
    },
    {
      title: "Your Pathway to Global Campuses",
      description: "Seamless study abroad support—from applications to visa success",
      icon: MapPin
    }
  ];

  return (
    <section className="relative py-16 bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our Academic Services
          </h2>
          <p className="text-lg text-slate-600">
            Your one-stop solution for academic excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-2xl shadow-soft hover:shadow-lift hover:-translate-y-2 transition-all duration-300 border border-slate-200"
              style={{ backgroundColor: '#EDF2F7' }}
            >
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">{service.title}</h3>
              <p className="text-slate-700 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
