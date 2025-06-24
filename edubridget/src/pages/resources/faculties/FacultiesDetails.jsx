import React from "react";
import "../../../css/ResourcesPage/universityDetails/facultyDetails.css";
import { useLocation, useNavigate } from "react-router-dom";

// Example universities data
const universities = [
  {
    name: "University of Rwanda",
    city: "Kigali",
    country: "Rwanda",
    students: "32,000+",
    established: "2013",
    image: "./public/alexander.jpg",
    faculties: [
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
    ],
  },
  {
    name: "Kigali Independent University",
    city: "Kigali",
    country: "Rwanda",
    students: "15,000+",
    established: "1996",
    image: "./public/otheruni.jpg",
    faculties: [
      {
        name: "Faculty of Law",
        courses: "3+ Courses",
        materials: "100+ Materials",
      },
      {
        name: "Faculty of IT",
        courses: "4+ Courses",
        materials: "150+ Materials",
      },
    ],
  },
];

function FacultiesDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const university = location.state?.university;

  return (
    <div className="university-details-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Universities
      </button>

      {/* <button
        className="back-button"
        onClick={() => navigate("/resources/universities")}>
        ← Back to Universities
      </button> */}

      <h2>{university.name} - Faculties</h2>
      <p>Select a faculty to browse courses and materials</p>

      {/* University Info Card */}
      {university && (
        <div className="university-info-card">
          <div className="uni-icon">
            {/* You can add an icon or image here if available */}
          </div>
          <div>
            <h3>{university.name}</h3>
            <p className="uni-meta">
              {university.location}, {university.country} •{" "}
              {university.totalStudents} students • Est.{" "}
              {university.established}
            </p>
          </div>
        </div>
      )}

      <div className="faculties-grid">
        {university.faculties.map((faculty, index) => (
          <div className="faculty-card" key={index}>
            <h4>{faculty}</h4>
            {/* Add more faculty info if available */}
            <button className="view-courses-btn">View Courses →</button>
          </div>
        ))}
      </div>

      {/* Faculties Grid */}
      <div className="faculties-grid">
        {university.faculties.map((faculty, index) => (
          <div className="faculty-card" key={index}>
            <div className="faculty-icon"></div>
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
