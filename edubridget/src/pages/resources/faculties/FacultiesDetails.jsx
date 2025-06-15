import React from "react";

import "../../css/ResourcesPage/facultyDetails.css";

const faculties = [
  {
    name: "Faculty of Engineering",
    courses: "5+ Courses",
    materials: "200+ Materials",
  },
  {
    name: "Faculty of Medicine",
    courses: "5+ Courses",
    materials: "200+ Materials",
  },
  {
    name: "Faculty of Business",
    courses: "5+ Courses",
    materials: "200+ Materials",
  },
  {
    name: "Faculty of Sciences",
    courses: "5+ Courses",
    materials: "200+ Materials",
  },
  {
    name: "Faculty of Arts",
    courses: "5+ Courses",
    materials: "200+ Materials",
  },
];

function FacultiesDetails() {
  return (
    <div className="university-details-page">
      <button className="back-button">← Back to Universities</button>

      <h2>University of Rwanda - Faculties</h2>
      <p>Select a faculty to browse courses and materials</p>

      {/* University Info Card */}
      <div className="university-info-card">
        <div className="uni-icon">
          <img src="/your-path/university-icon.png" alt="University Icon" />
        </div>
        <div>
          <h3>University of Rwanda</h3>
          <p className="uni-meta">
            Kigali, Rwanda • 32,000+ students • Est. 2013
          </p>
        </div>
      </div>

      {/* Faculties Grid */}
      <div className="faculties-grid">
        {faculties.map((faculty, index) => (
          <div className="faculty-card" key={index}>
            <div className="faculty-icon">
              <img src="/your-path/book-icon.png" alt="Book Icon" />
            </div>
            <h4>{faculty.name}</h4>
            <p>
              {faculty.courses} • {faculty.materials}
            </p>
            <button className="view-courses-btn">View Courses →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacultiesDetails;
