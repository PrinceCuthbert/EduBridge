import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Globe,
  Award,
  Users,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { FeatureGrid, FeatureCard } from "../../../components/ui/card";

export default function AcademicServices() {
  const { t } = useTranslation();

  const iconMap = {
    writing: BookOpen,
    proofreading: GraduationCap,
    research: Globe,
    scholarship: Award,
    advisory: Users,
    global: MapPin,
  };

  const services = [
    { key: "writing", icon: BookOpen },
    { key: "proofreading", icon: GraduationCap },
    { key: "research", icon: Globe },
    { key: "scholarship", icon: Award },
    { key: "advisory", icon: Users },
    { key: "global", icon: MapPin },
  ];

  return (
    <section className="relative py-16 bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t("home_page.services.title")}
          </h2>
          <p className="text-lg text-slate-600">
            {t("home_page.services.subtitle")}
          </p>
        </div>

        <FeatureGrid
          items={services} // Corrected plural name
          renderItem={(
            service,
            index, // Use () for implicit return
          ) => (
            <FeatureCard
              key={index}
              // Use the key to fetch translations
              title={t(`home_page.services.items.${service.key}.title`)}
              description={t(`home_page.services.items.${service.key}.desc`)}
              // Pass the Icon component directly
              icon={<service.icon className="h-8 w-8 text-primary" />}
            />
          )}
        />
      </div>
    </section>
  );
}
