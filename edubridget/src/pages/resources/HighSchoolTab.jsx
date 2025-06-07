// In src/pages/resources/HighSchoolTab.jsx
import React, { useState, useEffect } from "react";

// Animated Counter Component
const AnimatedCounter = ({ target, color }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16); // ~60 FPS

    const step = () => {
      start += increment;
      if (start < target) {
        setCount(Math.floor(start));
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(step);
  }, [target]);

  return <p className={`stat-number ${color}`}>{count}</p>;
};

function HighSchoolTab({ countries, SchoolCountries, subjects }) {
  const [selectedCountry, setSelectedCountry] = useState("Rwanda");

  const selectedData = SchoolCountries.find((c) => c.name === selectedCountry);
  const selectedSubjects = subjects.filter(
    (s) => s.country === selectedCountry
  );
  const totalSchools = selectedData?.schools.length || 0;
  const totalMaterials = selectedSubjects.reduce(
    (sum, s) => sum + s.materials,
    0
  );
  const totalSubjects = selectedSubjects.length;
  const gradeLevels = 6; // You can later adjust if different per country

  return (
    <div className="highschool-container">
      {/* Header */}
      <div className="highschool-header">
        <h1> High School Study Materials</h1>
        <p>
          Choose your country and school to view organized resources by grade
          level and subject.
        </p>
      </div>

      {/* Tabs */}
      <div className="country-tabs">
        {countries.map((country) => (
          <button
            key={country.id}
            onClick={() => setSelectedCountry(country.name)}
            className={`country-button ${
              selectedCountry === country.name ? "active" : ""
            }`}>
            <span>{country.short}</span> - {country.name}
          </button>
        ))}
      </div>

      {/* School Cards */}
      <div className="school-grid">
        {selectedData?.schools.map((school) => (
          <div key={school} className="school-card">
            <div className="text-4xl mb-4">🏫</div>
            <h3 className="text-lg font-semibold mb-1">{school}</h3>
            <p className="text-sm text-gray-500 mb-2">
              {selectedData.flag} {selectedCountry}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              O-Level & A-Level • 100+ Materials
            </p>
            <button>View Materials →</button>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-box">
          <AnimatedCounter target={totalSchools} color="blue" />
          <p className="stat-label">Schools</p>
        </div>
        <div className="stat-box">
          <AnimatedCounter target={gradeLevels} color="green" />
          <p className="stat-label">Grade Levels</p>
        </div>
        {/* <div className="stat-box">
          <AnimatedCounter target={totalMaterials} color="orange" />
          <p className="stat-label">Materials</p>
        </div> */}
        {/* <div className="stat-box">
          <AnimatedCounter target={totalSubjects} color="purple" />
          <p className="stat-label">Subjects</p>
        </div> */}
      </div>
    </div>
  );
}

export default HighSchoolTab;
