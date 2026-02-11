import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faStar,
  faUniversalAccess,
  faLightbulb,
  faUsers,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import InfiniteSlider from "../../components/InfiniteSlider";
import TimelineItem from "../../components/TimelineItem";
import { FeatureGrid } from "../../components/ui/card";
// --- DATA MAPPING HELPER ---
const iconMap = {
  graduation: faGraduationCap,
  star: faStar,
  access: faUniversalAccess,
  lightbulb: faLightbulb,
  users: faUsers,
  heart: faHeart,
};

// --- SUB-COMPONENT: Social Link ---
const SocialLink = ({ href, bgClass, label, children }) => (
  <a
    href={href}
    aria-label={label}
    className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition-all text-sm font-bold hover:scale-110 hover:shadow-lg ${bgClass}`}>
    {children}
  </a>
);

function AboutUsPage() {
  const { t } = useTranslation();

  const coreValues = t("about.core_values", { returnObjects: true });
  const teamMembers = t("about.team_members", { returnObjects: true });

  // Journey timeline data
  const journeyMilestones = t("about.journey_milestones", {
    returnObjects: true,
  });

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Hero Section - Enhanced with gradient overlay */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#1A237E]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold leading-tight mb-4 text-white"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
            }}>
            {t("about.hero_title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-white/95 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            {t("about.hero_subtitle")}
          </motion.p>
        </div>
      </section>

      {/* Founder's Message Section - Redesigned with soft-rectangular mask */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-yellow-50/30 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-12">
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A237E] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("about.founder_title")}
            </h2>
            <p
              className="text-slate-600 text-sm md:text-base"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              {t("about.founder_subtitle")}
            </p>
          </motion.div>

          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Founder Profile Card - Circular on all screens */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-4 flex flex-col items-center">
                {/* Circular Image with 3D Hover Effect */}
                <motion.div
                  className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-6"
                  whileHover={{ rotate: 2, scale: 1.05 }}
                  transition={{ duration: 0.3 }}>
                  <div className="w-full h-full overflow-hidden shadow-2xl rounded-full border-4 border-white/80">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
                      alt={t("about.founder_name")}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </motion.div>

                {/* Founder Info Card */}
                <div className="text-center">
                  <h3
                    className="text-2xl md:text-3xl font-bold text-[#1A237E] mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t("about.founder_name")}
                  </h3>
                  <p
                    className="text-sm md:text-base font-semibold text-yellow-600 mb-4 uppercase tracking-wide"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t("about.founder_role")}
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-3 justify-center mt-4">
                    <SocialLink
                      href="#"
                      bgClass="bg-blue-600 hover:bg-blue-700"
                      label="Facebook">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </SocialLink>
                    <SocialLink
                      href="#"
                      bgClass="bg-sky-500 hover:bg-sky-600"
                      label="Twitter">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </SocialLink>
                    <SocialLink
                      href="#"
                      bgClass="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                      label="Instagram">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                      </svg>
                    </SocialLink>
                    <SocialLink
                      href="#"
                      bgClass="bg-blue-700 hover:bg-blue-800"
                      label="LinkedIn">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </SocialLink>
                  </div>
                </div>
              </motion.div>

              {/* Message Content - Concise and impactful */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-8 space-y-4 text-slate-700 text-sm md:text-base leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                <p className="text-base md:text-lg font-semibold text-[#1A237E]">
                  {t("about.ceo_message.dear")}
                </p>

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.ceo_message.p1"),
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.ceo_message.p2"),
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.ceo_message.p3"),
                  }}
                />

                <div className="pt-5 border-t border-slate-200">
                  <p className="font-semibold text-base md:text-lg text-[#1A237E]">
                    {t("about.ceo_message.commitment")}
                  </p>
                  <p
                    className="font-bold text-lg md:text-xl mt-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t("about.founder_name")}
                  </p>
                  <p className="text-yellow-600 font-semibold uppercase tracking-wide text-sm">
                    {t("about.founder_role")}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section - Bento Grid / Asymmetrical Layout with Glassmorphism */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-12">
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A237E] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("about.values_title")}
            </h2>
            <p
              className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              {t("about.values_subtitle")}
            </p>
          </motion.div>

          {/* 3×2 Grid - Uniform Card Sizes on Large Screens */}
          <FeatureGrid
            items={coreValues || []}
            columns="grid-cols-1 md:grid-cols-3"
            gap="gap-5 md:gap-6"
            className="max-w-[1400px] mx-auto"
            renderItem={(value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl md:rounded-[32px] p-6 md:p-7 lg:p-8 flex flex-col justify-between transition-all duration-300"
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow:
                    "0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                }}>
                {/* Enhanced glassmorphism overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1A237E] group-hover:text-white ${
                      value.color === "yellow"
                        ? "bg-yellow-100 text-yellow-600"
                        : value.color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : value.color === "green"
                            ? "bg-green-100 text-green-600"
                            : value.color === "purple"
                              ? "bg-purple-100 text-purple-600"
                              : value.color === "orange"
                                ? "bg-orange-100 text-orange-600"
                                : value.color === "pink"
                                  ? "bg-pink-100 text-pink-600"
                                  : "bg-indigo-100 text-indigo-600"
                    }`}>
                    <FontAwesomeIcon
                      icon={iconMap[value.iconKey]}
                      className="text-2xl"
                    />
                  </div>
                  <h3
                    className="text-xl md:text-2xl font-bold text-[#1A237E] mb-3 group-hover:text-yellow-600 transition-colors duration-300"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {value.title}
                  </h3>
                  <p
                    className="text-slate-600 text-base md:text-lg leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    {value.description}
                  </p>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-300/20 rounded-full blur-2xl group-hover:bg-yellow-400/30 transition-colors" />
              </motion.div>
            )}
          />
        </div>
      </section>

      {/* Our Journey - Vertical Timeline with Framer Motion */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-12">
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A237E] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("about.journey_title")}
            </h2>
            <p
              className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              {t("about.journey_subtitle")}
            </p>
          </motion.div>

          <div className="max-w-[1400px] mx-auto relative">
            {/* Vertical line - only on mobile */}
            <div className="absolute left-6 md:hidden top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1A237E] via-yellow-500 to-[#1A237E]" />

            {/* Center vertical line for desktop */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1A237E] via-yellow-500 to-[#1A237E]" />

            <div className="space-y-8 md:space-y-10">
              {journeyMilestones.map((milestone, idx) => (
                <TimelineItem
                  key={idx}
                  milestone={milestone}
                  index={idx}
                  isLeft={idx % 2 === 0}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Slider Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-[#1A237E] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("about.team_title")}
            </h2>
            <p
              className="text-slate-600 text-sm md:text-base"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              {t("about.team_subtitle")}
            </p>
          </motion.div>
          <InfiniteSlider
            data={teamMembers}
            autoPlaySpeed={3000}
            itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
            renderItem={(member) => <TeamMemberCard member={member} />}
          />
        </div>
      </section>
    </div>
  );
}

const TeamMemberCard = ({ member }) => (
  <motion.div whileHover={{ y: -10 }} className="flex flex-col items-center">
    <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl">
      <img
        src={member.image || "https://via.placeholder.com/150"}
        alt={member.name}
        className="w-full h-full object-cover"
      />
    </div>
    <h3 className="mt-4 font-bold text-xl text-[#1A237E]">{member.name}</h3>
    <p className="text-yellow-600 uppercase text-xs font-bold tracking-wider">
      {member.role}
    </p>
    <p className="text-slate-600 text-sm mt-2 text-center max-w-[200px]">
      {member.description}
    </p>
  </motion.div>
);
// Usage:

export default AboutUsPage;
