import React, { useState } from "react";
import "../css/ResourcesPage/resourcePage.css";
import "../css/ResourcesPage/highSchoolMaterial.css";

// In src/pages/resources/HighSchoolTab.jsx
import HighSchoolTab from "./resources/HighSchoolTab";

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

function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("highschool");

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
      case "books":
        return <FamousBooksTab />;
      case "live":
        return <LiveClassesTab />;
      case "blog":
        return <BlogNewsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="resources-page">
      <section className="resources-intro">
        <h1 className="resources-intro-title">Educational Resources</h1>
        <p className="description">
          Access comprehensive study materials, live classes, and educational
          content designed to support your academic journey.
        </p>
      </section>
      <section className="resources-type">
        <div className="search-nav">
          <a
            className={activeTab === "highschool" ? "active" : ""}
            onClick={() => setActiveTab("highschool")}>
            High School Materials
          </a>
          <a
            className={activeTab === "national-exams" ? "active" : ""}
            onClick={() => setActiveTab("national-exams")}>
            National Exams
          </a>
          <a
            className={activeTab === "university" ? "active" : ""}
            onClick={() => setActiveTab("university")}>
            Universities
          </a>
          <a
            className={activeTab === "books" ? "active" : ""}
            onClick={() => setActiveTab("books")}>
            Famous Books
          </a>
          <a
            className={activeTab === "live" ? "active" : ""}
            onClick={() => setActiveTab("live")}>
            Live Classes
          </a>
          <a
            className={activeTab === "blog" ? "active" : ""}
            onClick={() => setActiveTab("blog")}>
            Blog & News
          </a>
        </div>
        <div>{renderTabContent()}</div>
      </section>
      {/* <HighSchoolTab /> */}
    </div>
  );
}

// function NationaExams() {
//   return <div></div>;
// }

function FamousBooksTab() {
  return (
    <div>
      <h1>Famous Books</h1>
      <p>
        Explore a curated list of famous books to enhance your knowledge and
        understanding.
      </p>
    </div>
  );
}

function LiveClassesTab() {
  return (
    <div>
      <h1>Live Classes</h1>
      <p>Join interactive live classes conducted by expert educators.</p>
    </div>
  );
}

function BlogNewsTab() {
  return (
    <div>
      <h1>Blog & News</h1>
      <p>
        Stay updated with the latest blogs and news in the education sector.
      </p>
    </div>
  );
}

export default ResourcesPage;
