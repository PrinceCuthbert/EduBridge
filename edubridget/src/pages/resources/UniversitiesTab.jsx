import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FiFileText, FiBookOpen, FiStar } from "react-icons/fi";
import { FaUniversity, FaMapMarkerAlt } from "react-icons/fa";
import "../../css/ResourcesPage/universitiesResources.css";

import { Route, Routes } from "react-router-dom";
// import FacultiesDetails from "../resources/faculties/FacultiesDetails.jsx";

const regions = [
  { name: "East Africa", flag: "🌍", universities: 15 },
  { name: "Korea", flag: "🇰🇷", universities: 12 },
  { name: "Europe", flag: "🇪🇺", universities: 20 },
  { name: "North America", flag: "🇺🇸", universities: 18 },
  { name: "Asia Pacific", flag: "🌏", universities: 22 },
];

const universities = [
  // East Africa
  {
    name: "University of Rwanda",
    location: "Kigali",
    country: "Rwanda",
    region: "East Africa",
    faculties: ["Engineering", "Medicine", "Business", "Sciences", "Arts"],
    totalStudents: "32,000+",
    established: "2013",
  },
  {
    name: "Makerere University",
    location: "Kampala",
    country: "Uganda",
    region: "East Africa",
    faculties: ["Medicine", "Engineering", "Law", "Arts", "Sciences"],
    totalStudents: "40,000+",
    established: "1922",
  },
  {
    name: "University of Nairobi",
    location: "Nairobi",
    country: "Kenya",
    region: "East Africa",
    faculties: ["Medicine", "Engineering", "Business", "Law", "Agriculture"],
    totalStudents: "68,000+",
    established: "1970",
  },
  {
    name: "University of Dar es Salaam",
    location: "Dar es Salaam",
    country: "Tanzania",
    region: "East Africa",
    faculties: ["Medicine", "Engineering", "Law", "Arts", "Sciences"],
    totalStudents: "40,000+",
    established: "1961",
  },

  // Korea
  {
    name: "Seoul National University",
    location: "Seoul",
    country: "South Korea",
    region: "Korea",
    faculties: [
      "Engineering",
      "Medicine",
      "Liberal Arts",
      "Natural Sciences",
      "Business",
    ],
    totalStudents: "28,000+",
    established: "1946",
  },
  {
    name: "KAIST",
    location: "Daejeon",
    country: "South Korea",
    region: "Korea",
    faculties: [
      "Engineering",
      "Natural Sciences",
      "Business",
      "Information Technology",
    ],
    totalStudents: "10,000+",
    established: "1971",
  },
  {
    name: "Yonsei University",
    location: "Seoul",
    country: "South Korea",
    region: "Korea",
    faculties: [
      "Medicine",
      "Engineering",
      "Business",
      "Liberal Arts",
      "Dentistry",
    ],
    totalStudents: "38,000+",
    established: "1885",
  },
  {
    name: "Korea University",
    location: "Seoul",
    country: "South Korea",
    region: "Korea",
    faculties: ["Law", "Business", "Engineering", "Liberal Arts", "Medicine"],
    totalStudents: "37,000+",
    established: "1905",
  },

  // Europe
  {
    name: "University of Oxford",
    location: "Oxford",
    country: "United Kingdom",
    region: "Europe",
    faculties: ["Medicine", "Engineering", "Law", "Philosophy", "Mathematics"],
    totalStudents: "24,000+",
    established: "1096",
  },
  {
    name: "ETH Zurich",
    location: "Zurich",
    country: "Switzerland",
    region: "Europe",
    faculties: [
      "Engineering",
      "Natural Sciences",
      "Mathematics",
      "Computer Science",
    ],
    totalStudents: "22,000+",
    established: "1855",
  },

  // North America
  {
    name: "Harvard University",
    location: "Cambridge",
    country: "United States",
    region: "North America",
    faculties: ["Medicine", "Law", "Business", "Engineering", "Liberal Arts"],
    totalStudents: "23,000+",
    established: "1636",
  },
  {
    name: "MIT",
    location: "Cambridge",
    country: "United States",
    region: "North America",
    faculties: [
      "Engineering",
      "Computer Science",
      "Economics",
      "Physics",
      "Mathematics",
    ],
    totalStudents: "11,000+",
    established: "1861",
  },

  // Asia Pacific
  {
    name: "University of Tokyo",
    location: "Tokyo",
    country: "Japan",
    region: "Asia Pacific",
    faculties: ["Engineering", "Medicine", "Law", "Economics", "Sciences"],
    totalStudents: "28,000+",
    established: "1877",
  },
  {
    name: "National University of Singapore",
    location: "Singapore",
    country: "Singapore",
    region: "Asia Pacific",
    faculties: ["Engineering", "Medicine", "Business", "Law", "Computing"],
    totalStudents: "38,000+",
    established: "1905",
  },
];

const materialTypes = [
  {
    type: "Lecture Notes",
    icon: FiFileText,
    color: "text-eduBlue",
    count: 120,
  },
  {
    type: "Research Papers",
    icon: FiBookOpen,
    color: "text-eduGreen",
    count: 85,
  },
  { type: "Past Exams", icon: FiStar, color: "text-orange-500", count: 45 },
];

function UniversitiesTab() {
  const location = useLocation();
  const university = location.state?.university;

  const [selectedRegion, setSelectedRegion] = useState(regions[0].name);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Filter universities by selected region
  const filteredUniversities = universities.filter(
    (uni) => uni.region === selectedRegion
  );

  // Get faculties for selected university
  const faculties =
    selectedUniversity &&
    universities.find((u) => u.name === selectedUniversity)?.faculties;

  // Get courses for selected faculty
  // const courses = selectedFaculty ? facultyCourses[selectedFaculty] : [];
  return (
    <div className="university-container">
      <div className="university-header">
        <h1>University Resources</h1>
        <p>
          Access comprehensive university materials from top institutions across
          East Africa, Korea, and worldwide.
        </p>
      </div>

      {/* Region Tabs */}
      <div className="regions-tabs">
        {regions.map((region) => (
          <button
            key={region.name}
            className={`region-tab${
              selectedRegion === region.name ? " active" : ""
            }`}
            onClick={() => {
              setSelectedRegion(region.name);
              setSelectedUniversity(null);
              setSelectedFaculty(null);
            }}>
            <span className="region-flag">{region.flag}</span>
            {region.name}{" "}
            <span className="region-count">({region.universities})</span>
          </button>
        ))}
      </div>

      {/* Universities List */}
      <div className="universities-list">
        {filteredUniversities.map((uni) => (
          <div
            className="university-card-box"
            onClick={() => {
              setSelectedUniversity(uni.name);
              setSelectedFaculty(null);
            }}>
            <div className="university-icon">
              <FaUniversity className="uniIcon" aria-label="University Icon" />
            </div>
            <h3 className="university-name">{uni.name}</h3>
            <p className="university-location">
              <FaMapMarkerAlt /> {uni.location}, {uni.country}
            </p>
            <div className="university-meta">
              <span>{uni.faculties.length} Faculties</span>
              <span>• {uni.totalStudents}</span>
              <span>• Est. {uni.established}</span>
            </div>
            <div className="faculty-tags">
              {uni.faculties.slice(0, 3).map((f, index) => (
                <span key={index} className="faculty-tag">
                  {f}
                </span>
              ))}
              {uni.faculties.length > 3 && (
                <span className="faculty-tag">
                  +{uni.faculties.length - 3} more
                </span>
              )}
            </div>
            <Link to="/FacultiesDetails" state={{ university: uni }}>
              <button className="view-faculties-btn">View Faculties</button>
            </Link>
          </div>
        ))}
      </div>

      {/* Faculties List */}
      {/* {selectedUniversity && faculties && (
        <div className="faculties-list">
          <h3>Faculties at {selectedUniversity}</h3>
          <div className="faculty-buttons">
            {faculties.map((faculty) => (
              <button
                key={faculty}
                className={`faculty-btn${
                  selectedFaculty === faculty ? " active" : ""
                }`}
                onClick={() => setSelectedFaculty(faculty)}>
                {faculty}
              </button>
            ))}
          </div>
        </div>
      )} */}

      {/* Courses List */}
      {/* {selectedFaculty && (
        <div className="courses-list">
          <h4>Courses in {selectedFaculty}</h4>
          <ul>
            {courses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </div>
      )} */}

      {/* Material Types */}
      <div className="materials-section">
        <h3>Available Materials</h3>
        <div className="materials-list">
          {materialTypes.map((material) => (
            <div
              key={material.type}
              className={`material-card ${material.color}`}>
              <span className="material-icon">
                {material.icon && React.createElement(material.icon)}
              </span>
              <span className="material-type">{material.type}</span>
              <span className="material-count">{material.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UniversitiesTab;
