import React from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Globe,
  GraduationCap,
  Award,
  Users,
  MapPin,
} from "lucide-react";

// Import your reusable components
import { FeatureGrid, FeatureCard } from "../../../components/ui/card";

export default function WhyChoose() {
  const { t } = useTranslation();
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Learn from East Africa's Top Educators",
      description:
        "Expert instruction from proven academics and industry leaders",
    },
    {
      icon: <Globe className="h-8 w-8 text-secondary" />,
      title: "World-Class Digital Resources",
      description: "Access cutting-edge learning materials anytime, anywhere",
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-accent" />,
      title: "Live Interactive Classes",
      description:
        "Real-time engagement with instructors and peers across the continent",
    },
    {
      icon: <Award className="h-8 w-8 text-secondary" />,
      title: "Globally Recognized Certificates",
      description: "Credentials that open doors to opportunities worldwide",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Vibrant Student Community",
      description:
        "Join thousands of ambitious learners building Africa's future",
    },
    {
      icon: <MapPin className="h-8 w-8 text-accent" />,
      title: "East African Excellence",
      description:
        "Tailored curriculum addressing regional opportunities and challenges",
    },
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

        {/* Use the reusable Grid */}
        <FeatureGrid
          items={features}
          renderItem={(feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              bgColor="#EDF2F7" // Matching your specific style
              icon={<div className={feature.iconColor}>{feature.icon}</div>}
              iconBgColor={feature.iconBg}
              className={feature.className}
            />
          )}
        />
      </div>
    </section>
  );
}
