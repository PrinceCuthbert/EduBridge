import { useTranslation } from "react-i18next";
import React, { useRef, useMemo,useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OptimizedImage from "@/components/OptimizedImage";
import { toast } from "sonner";
import { usePrograms } from "../../hooks/usePrograms";
import { DESTINATIONS } from "../../data/mockData"; // Keep as fallback type or initial state shape reference if needed, but we will fetch

import DestinationCard from "@/components/studyAbroad/DestinationCard";
import ApplicationProcess from "@/components/studyAbroad/ApplicationProcess";

import UniversityCard from "./UniversityCard";

const LOADING_PROP = "lazy";

// The university study abroad page,  where we see the scroll list of a scholarships available, and each visa type per scholership.

const UniversitySection = React.memo(
  ({ title, visaType, universities, subtitle, loading }) => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
      if (scrollContainerRef.current) {
        const scrollAmount = 300;
        scrollContainerRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    if (loading) {
      return (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 w-32 bg-slate-200 animate-pulse rounded"></div>
          </div>
          <p className="h-4 w-64 bg-slate-100 animate-pulse rounded mb-6"></p>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-48 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-slate-200 animate-pulse mb-4"></div>
                <div className="h-4 w-32 bg-slate-200 animate-pulse rounded mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      // Header of the visa types available.
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {title}
            <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
              {visaType}
            </span>
          </h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">{subtitle}</p>

        <div className="relative group/section">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll("left")}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-8 h-8 items-center justify-center bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all opacity-0 group-hover/section:opacity-100 disabled:opacity-0"
            aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-8 h-8 items-center justify-center bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all opacity-0 group-hover/section:opacity-100"
            aria-label="Scroll right">
            <ChevronRight size={16} />
          </button>

          {/* List */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {universities.map((uni, i) => (
              <UniversityCard key={i} university={uni} />
            ))}
            {universities.length === 0 && (
              <div className="w-full text-center py-8 text-slate-500 text-sm">
                No programs available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default function StudyAbroadPage() {
  const { t } = useTranslation();

  // 1. Use the exact same hook the Admin page uses!
  const { programs, loading } = usePrograms();

  // 2. Dynamically group Active programs by their visaType
  const programsByVisa = useMemo(() => {
    const grouped = {};

    // Only show active programs to the public
    const activePrograms = programs.filter((p) => p.status === "Active");

    activePrograms.forEach((program) => {
      // Fallback if an admin forgets to set a visa type
      const visa = program.visaType || "Other";
      if (!grouped[visa]) {
        grouped[visa] = [];
      }
      grouped[visa].push(program);
    });

    // Optional: Sort the keys so they appear in a consistent order (e.g., D-2 then D-4)
    return Object.keys(grouped)
      .sort()
      .reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {});
  }, [programs]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="text-white py-16 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
            {t("study_abroad_page.hero_title")}
          </h1>
          <p className="text-xl text-white/90">
            {t("study_abroad_page.hero_subtitle")}
          </p>
        </div>
      </div>

      {/* Available Universities Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Show skeleton loaders while data is being fetched */}
          {loading ? (
            [1, 2].map((i) => (
              <UniversitySection
                key={i}
                title=""
                visaType=""
                subtitle=""
                universities={[]}
                loading={true}
              />
            ))
          ) : Object.entries(programsByVisa).length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              {t("study_abroad_page.universities.no_programs")}
            </div>
          ) : (
            Object.entries(programsByVisa).map(([visa, unis], index, array) => (
              <React.Fragment key={visa}>
                <UniversitySection
                  title={visa}
                  visaType={t("study_abroad_page.universities.visa_label")}
                  subtitle={
                    visa === "D-2"
                      ? t("study_abroad_page.universities.d2_subtitle")
                      : visa === "D-4"
                        ? t("study_abroad_page.universities.d4_subtitle")
                        : `Available Universities offering ${visa} programs`
                  }
                  universities={unis}
                  loading={false}
                />
                {index < array.length - 1 && (
                  <div className="w-full h-px bg-slate-100 my-8"></div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </section>

      {/* Study Destinations */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              {t("study_abroad_page.destinations.title")}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {t("study_abroad_page.destinations.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DESTINATIONS.map((destination, index) => (
              <DestinationCard key={index} destination={destination} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <ApplicationProcess t={t} />
    </div>
  );
}
