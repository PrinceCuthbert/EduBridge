import { useTranslation } from "react-i18next";
import React, { useState, useRef, useEffect, useMemo } from "react";
// import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OptimizedImage from "@/components/OptimizedImage";
import { BASE_URL } from "../../config/api";
import { toast } from "sonner";
import { MOCK_PROGRAMS } from "../../data/mockData"; // Keep as fallback type or initial state shape reference if needed, but we will fetch
import DestinationCard from "@/components/studyAbroad/DestinationCard";
import ApplicationProcess from "@/components/studyAbroad/ApplicationProcess";

import UniversityCard from "./UniversityCard";

const DESTINATIONS = [
  {
    name: "Australia",
    description: "World-class education with work opportunities",
    tuition: "$20,000 - $45,000/year",
    living: "$18,000 - $24,000/year",
    features: [
      "Post-study work visa",
      "High quality of life",
      "Multicultural environment",
    ],
    image:
      "https://images.unsplash.com/photo-1540448051910-09cfadd5df61?auto=format&fit=crop&w=600&q=80", // Sydney Opera House
  },
  {
    name: "United States",
    description: "Top-ranked universities and research opportunities",
    tuition: "$25,000 - $55,000/year",
    living: "$15,000 - $25,000/year",
    features: [
      "Flexible education system",
      "Diverse programs",
      "Innovation hub",
    ],
    image:
      "https://images.unsplash.com/photo-1543783207-c13fad267277?q=80&w=1470&auto=format&fit=crop", // Statue of Liberty
  },
  {
    name: "Canada",
    description: "Affordable education with immigration pathways",
    tuition: "$15,000 - $35,000/year",
    living: "$12,000 - $18,000/year",
    features: [
      "Post-graduation work permit",
      "Safe and welcoming",
      "Quality education",
    ],
    image:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=600&q=80", // CN Tower
  },
  {
    name: "Europe",
    description: "Affordable/free education with cultural diversity",
    tuition: "€0 - €20,000/year",
    living: "€8,000 - €15,000/year",
    features: [
      "Many programs in English",
      "Cultural experience",
      "Travel opportunities",
    ],
    image:
      "https://images.unsplash.com/photo-1511739001486-9608275626ba?auto=format&fit=crop&w=600&q=80", // Eiffel Tower
  },
  {
    name: "South Korea",
    description: "Advanced technology with scholarship opportunities",
    tuition: "$3,000 - $10,000/year",
    living: "$8,000 - $12,000/year",
    features: ["KGSP scholarships", "Tech industry", "Dynamic culture"],
    image:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=600&q=80", // Gyeongbokgung Palace
  },
  {
    name: "Japan",
    description: "Cutting-edge technology and traditional culture",
    tuition: "$5,000 - $12,000/year",
    living: "$10,000 - $15,000/year",
    features: ["MEXT scholarships", "Advanced technology", "Safe environment"],
    image:
      "https://images.unsplash.com/photo-1490806843928-2666d632c318?auto=format&fit=crop&w=600&q=80", // Mt Fuji
  },
];

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
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all opacity-0 group-hover/section:opacity-100 disabled:opacity-0"
            aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all opacity-0 group-hover/section:opacity-100"
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
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        // FETCH DATA WHEN PAGE LOADS
        const res = await fetch(`${BASE_URL}/programs`);

        if (!res.ok) {
          throw new Error("Failed to fetch programs");
        }

        const data = await res.json();
        setPrograms(data);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError(err.message);
        toast.error("Failed to load programs");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []); // Empty dependency array = run once on mount

  const d2Programs = useMemo(
    () => programs.filter((p) => p.visaType === "D-2"),
    [programs],
  );
  const d4Programs = useMemo(
    () => programs.filter((p) => p.visaType === "D-4"),
    [programs],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="text-white py-16" style={{ backgroundColor: "#1e3a8a" }}>
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
          <UniversitySection
            title="D-2"
            visaType={t("study_abroad_page.universities.visa_label")}
            subtitle={t("study_abroad_page.universities.d2_subtitle")}
            universities={d2Programs}
            loading={loading}
          />

          <div className="w-full h-px bg-slate-100 my-8"></div>

          <UniversitySection
            title="D-4"
            visaType={t("study_abroad_page.universities.visa_label")}
            subtitle={t("study_abroad_page.universities.d4_subtitle")}
            universities={d4Programs}
            loading={loading}
          />
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
