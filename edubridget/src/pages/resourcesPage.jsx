// import React from "react";
import "../css/ResourcesPage/resourcePage.css";
import "../css/ResourcesPage/highSchoolMaterial.css";
import React, { useState } from "react";

const countries = [
  { id: 1, name: "Rwanda", short: "RW" },
  { id: 2, name: "Uganda", short: "UG" },
  { id: 3, name: "Kenya", short: "KE" },
  { id: 4, name: "Tanzania", short: "TZ" },
];

function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("highschool");

  const renderTabContent = () => {
    switch (activeTab) {
      case "highschool":
        return <HighSchoolTab />;
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
            Blog&News
          </a>
        </div>
        <div>{renderTabContent()}</div>
      </section>
    </div>
  );
}

function HighSchoolTab() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <>
      <div className="introduction">
        <h1>High School Materials</h1>
        <p>
          Access comprehensive study materials organized by country, school, and
          subject.
        </p>
      </div>

      <div className="countriesButton">
        {countries.map((country) => (
          <button
            key={country.id}
            className={`country-btn${
              selectedCountry === country.name ? " active" : ""
            }`}
            onClick={() => setSelectedCountry(country.name)}>
            <span className="country-short">{country.short}</span>
            <span className="country-name">{country.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}

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
