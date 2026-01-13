import React, { useState } from "react";
import HighSchoolTab from "./HighSchoolTab.jsx";
import NationalExams from "./NationalExams.jsx";
import UniversitiesTab from "./UniversitiesTab.jsx";
import FamousBooksTab from "./FamousBook.jsx";
import LiveClassesTab from "./LiveClasses.jsx";
import BlogAndNewsTab from "./blogAndNews.jsx";

const countries = [
  { id: 1, name: "Rwanda", short: "RW" },
  { id: 2, name: "Uganda", short: "UG" },
  { id: 3, name: "Kenya", short: "KE" },
  { id: 4, name: "Tanzania", short: "TZ" },
];

const SchoolCountries = [
  {
    name: "Rwanda",
    flag: "🇷🇼",
    schools: ["FAWE Girls School", "Lycée de Kigali", "Green Hills Academy"],
  },
  {
    name: "Uganda",
    flag: "🇺🇬",
    schools: [
      "Makerere College School",
      "Kampala High School",
      "St. Mary's College",
    ],
  },
  {
    name: "Kenya",
    flag: "🇰🇪",
    schools: [
      "Alliance High School",
      "Kenya High School",
      "Starehe Boys Centre",
    ],
  },
  {
    name: "Tanzania",
    flag: "🇹🇿",
    schools: [
      "Mkwawa High School",
      "Azania Secondary School",
      "St. Francis College",
    ],
  },
];

const subjects = [
  { name: "Mathematics", icon: "📊", materials: 15 },
  { name: "Physics", icon: "⚡", materials: 12 },
  { name: "Chemistry", icon: "🧪", materials: 10 },
  { name: "Biology", icon: "🔬", materials: 14 },
  { name: "English", icon: "📚", materials: 18 },
  { name: "History", icon: "🏛️", materials: 8 },
];

const examData = [
  {
    id: 1,
    name: "Rwanda",
    flag: "🇷🇼",
    levels: [
      {
        name: "PLE",
        subjects: [
          {
            name: "Mathematics",
            years: [
              { year: 2022, link: "/rwanda/ple/math/2022.pdf" },
              { year: 2023, link: "/rwanda/ple/math/2023.pdf" },
            ],
          },
          {
            name: "English",
            years: [{ year: 2022, link: "/rwanda/ple/english/2022.pdf" }],
          },
        ],
      },
      {
        name: "O-Level",
        subjects: [
          {
            name: "Mathematics",
            years: [
              { year: 2022, link: "/rwanda/o-level/math/2022.pdf" },
              { year: 2023, link: "/rwanda/o-level/math/2023.pdf" },
              { year: 2025, link: "/rwanda/o-level/math/2023.pdf" },
            ],
          },
          {
            name: "Biology",
            years: [{ year: 2022, link: "/rwanda/o-level/biology/2022.pdf" }],
          },
        ],
      },
      {
        name: "A-Level",
        subjects: [
          {
            name: "Physics",
            years: [{ year: 2023, link: "/rwanda/a-level/physics/2023.pdf" }],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Kenya",
    flag: "🇰🇪",
    levels: [
      {
        name: "PLE",
        subjects: [
          {
            name: "Mathematics",
            years: [{ year: 2022, link: "/kenya/ple/math/2022.pdf" }],
          },
          {
            name: "English",
            years: [{ year: 2022, link: "/kenya/ple/english/2022.pdf" }],
          },
        ],
      },
      {
        name: "KCSE",
        subjects: [
          {
            name: "Chemistry",
            years: [{ year: 2021, link: "/kenya/kcse/chemistry/2021.pdf" }],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Tanzania",
    flag: "🇹🇿",
    levels: [
      {
        name: "CSEE",
        subjects: [
          {
            name: "Mathematics",
            years: [
              { year: 2022, link: "/tanzania/csee/math/2022.pdf" },
              { year: 2023, link: "/tanzania/csee/math/2023.pdf" },
            ],
          },
          {
            name: "English",
            years: [{ year: 2022, link: "/tanzania/csee/english/2022.pdf" }],
          },
        ],
      },
      {
        name: "ACSEE",
        subjects: [
          {
            name: "Physics",
            years: [{ year: 2023, link: "/tanzania/acsee/physics/2023.pdf" }],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Uganda",
    flag: "🇺🇬",
    levels: [
      {
        name: "UCE",
        subjects: [
          {
            name: "Mathematics",
            years: [
              { year: 2022, link: "/uganda/uce/math/2022.pdf" },
              { year: 2023, link: "/uganda/uce/math/2023.pdf" },
            ],
          },
          {
            name: "Biology",
            years: [{ year: 2022, link: "/uganda/uce/biology/2022.pdf" }],
          },
        ],
      },
      {
        name: "UACE",
        subjects: [
          {
            name: "Physics",
            years: [{ year: 2023, link: "/uganda/uace/physics/2023.pdf" }],
          },
        ],
      },
    ],
  },
];

function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("highschool");

  const tabs = [
    { id: "highschool", label: "School Materials" },
    { id: "national-exams", label: "National Exams" },
    { id: "university", label: "Universities" },
    { id: "books", label: "Famous Books" },
    { id: "live", label: "Live Classes" },
    { id: "blog", label: "Blog & News" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "highschool":
        return (
          <HighSchoolTab
            countries={countries}
            SchoolCountries={SchoolCountries}
            subjects={subjects}
          />
        );
      case "national-exams":
        return (
          <NationalExams
            countries={examData}
            subjects={subjects}
          />
        );
      case "university":
        return <UniversitiesTab />;
      case "books":
        return <FamousBooksTab />;
      case "live":
        return <LiveClassesTab />;
      case "blog":
        return <BlogAndNewsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-primary-gradient">
        <div className="absolute top-0 left-0 -translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 font-serif">
            Educational Resources
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Access comprehensive study materials, live classes, and educational
            content designed to support your academic journey.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="relative">
            {/* Fade indicators on edges for scroll hint */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 hidden md:block" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden md:block" />
            
            {/* Scrollable tabs container */}
            <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory">
              <div className="flex items-center justify-start md:justify-center gap-2 min-w-full md:min-w-0 px-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 snap-center ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Mobile scroll hint */}
            <div className="md:hidden text-center pb-2">
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                {/* <span>←</span>
                <span>Swipe to see more</span>
                <span>→</span> */}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12">
        {renderTabContent()}
      </section>
    </div>
  ); 
}

export default ResourcesPage;
