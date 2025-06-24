import React, { useState } from "react";
import "../../../css/ResourcesPage/universityDetails/facultyDetails.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUniversity, FaBookOpen } from "react-icons/fa";

function FacultiesDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const university = location.state?.university;
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  if (!university) return <p>University not found.</p>;

  // Handle courses view (optional extension)
  if (selectedFaculty) {
    return (
      <div className="university-details-page">
        <div className="header-row">
          <div>
            <h2>
              {selectedFaculty.name} - {university.name}
            </h2>
            <p>Available courses and materials</p>
          </div>
          <button
            className="back-button"
            onClick={() => navigate("/resources/universities")}>
            ← Back to Universities
          </button>
        </div>

        {/* University Info Card */}
        <div className="university-info-card">
          <div className="uni-icon">
            <FaUniversity size={28} />
          </div>
          <div className="uni-details">
            <h3>{university.name}</h3>
            <p className="uni-meta">
              {university.city}, {university.country} • {university.students}{" "}
              students • Est. {university.established}
            </p>
          </div>
        </div>

        <div className="course-placeholder">
          {/* Replace with actual course data */}
          <p>Courses for {selectedFaculty.name} will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="university-details-page">
      <div className="header-row">
        <div>
          <h2>{university.name} - Faculties</h2>
          <p>Select a faculty to browse courses and materials</p>
        </div>
        {/* <button
          className="back-button"
          onClick={() => navigate("/resources/universities")}>
          ← Back to Universities
        </button> */}
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to University
        </button>
      </div>

      {/* University Info Card */}
      <div className="university-info-card">
        <div className="uni-icon">
          <FaUniversity size={28} />
        </div>
        <div className="uni-details">
          <h3>{university.name}</h3>
          <p className="uni-meta">
            {university.city}, {university.country} • {university.students}{" "}
            students • Est. {university.established}
          </p>
        </div>
      </div>

      {/* Faculties Grid */}
      <div className="faculties-grid">
        {university.faculties.map((faculty, index) => (
          <div className="faculty-card" key={index}>
            <div className="faculty-icon">
              <FaBookOpen size={40} />
            </div>
            <h3>Faculty of {faculty.name}</h3>
            <p className="faculty-meta">
              {faculty.courses} • {faculty.materials}
            </p>
            <button
              className="view-courses-btn"
              onClick={() => setSelectedFaculty(faculty)}>
              View Courses →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacultiesDetails;
