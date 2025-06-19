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

  // Get university name from location.state or fallback to default
  const universityName =
    location.state?.university?.name || "University of Rwanda";
  // Find the university object
  const university =
    universities.find((u) => u.name === universityName) || universities[0];

  return (
    <div className="university-details-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Universities
      </button>

      <h2>{university.name} - Faculties</h2>
      <p>Select a faculty to browse courses and materials</p>

      {/* University Info Card */}
      <div className="university-info-card">
        <div className="uni-icon">
          <img src={university.image} alt="University Icon" />
        </div>
        <div>
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
