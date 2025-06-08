import React, { useState } from "react";
import "../../css/ResourcesPage/nationalExams.css";

function NationalExams({ countries }) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]?.name);

  const countryData = countries.find((c) => c.name === selectedCountry);
  const levels = countryData?.levels || [];

  return (
    <div className="national-exams">
      <h1 className="title">National Examination Past Papers</h1>
      <p className="subtitle">
        Access official past papers and marking schemes for national
        examinations across East Africa.
      </p>

      {/* Country Tabs */}
      <div className="country-tabs">
        {countries.map((country) => (
          <button
            key={country.id}
            className={`country-tab ${
              selectedCountry === country.name ? "active" : ""
            }`}
            onClick={() => setSelectedCountry(country.name)}>
            {country.code} {country.name}
          </button>
        ))}
      </div>

      {/* Level Cards */}
      <div className="level-cards">
        {levels.map((level) => (
          <div key={level.name} className="level-card">
            <div className="level-header">
              <h2>{level.shortName}</h2>
              <span className="badge">{level.subjects.length} subjects</span>
            </div>
            <h3 className="level-title">{level.name}</h3>
            <p className="level-desc">{level.description}</p>
            <div className="years">
              <span>Available years:</span>
              {(() => {
                // Flatten and extract unique years from all subjects
                const allYears = [
                  ...new Set(
                    level.subjects.flatMap(
                      (subject) => subject.years?.map((y) => y.year) || []
                    )
                  ),
                ];

                return (
                  <>
                    {allYears.slice(0, 3).map((year) => (
                      <span key={year} className="year-pill">
                        {year}
                      </span>
                    ))}
                    {allYears.length > 3 && (
                      <span className="year-pill more">
                        +{allYears.length - 3} more
                      </span>
                    )}
                  </>
                );
              })()}
            </div>

            <a href="#" className="browse-btn">
              Browse Papers
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NationalExams;
