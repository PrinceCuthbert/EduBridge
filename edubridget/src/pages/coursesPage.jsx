import React from "react"; // Required for JSX (especially if using hooks or older React versions)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faClock,
  faCertificate,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import FeaturedCoursesSection from "./featuredCourse";

import "../css/coursesPage/coursesPage.css"; // Adjust path if your CSS is elsewhere

function Course({ icon, title, description, bgColor }) {
  return (
    <div className="card courseCard" style={{ backgroundColor: bgColor }}>
      <FontAwesomeIcon icon={icon} size="3x" className="icons" />
      <h2>{title}</h2>
      <p>{description}</p>
      <a className="link">Explore courses →</a>
    </div>
  );
}

function CoursesPage() {
  // State to manage the active category
  // const [activeCategory, setActiveCategory] = useState("Korean Language");

  const courseData = [
    {
      icon: faGraduationCap,
      title: "Korean Language",
      description:
        "Learn Korean from beginner to advanced levels with native speakers.",
      bgColor: "#e0f7fa",
    },
    {
      icon: faClock,
      title: "Programming",
      description:
        "Master programming languages like Python, Java, and web development.",
      bgColor: "#e8f5e9",
    },
    {
      icon: faCertificate,
      title: "University Courses",
      description:
        "Access university-level courses across various disciplines.",
      bgColor: "#fff3e0",
    },
    {
      icon: faUsers,
      title: "Language Courses",
      description:
        "Improve your language skills in English, French, Swahili, and more",
      bgColor: "#f3e5f5",
    },
  ];

  return (
    <>
      {/* Intro Section */}
      <section className="intropage">
        <div className="intro_one">
          <div className="partOne">
            <div className="description">
              <h1>Explore Our Courses</h1>
              <p>
                Discover a wide range of courses designed to help you achieve
                your educational and career goals.
              </p>
            </div>
            <div className="buttons">
              <button className="btn btn--primary">Browse by Category</button>
            </div>
          </div>
          <div className="partTwo">
            <div className="image-border">
              <img
                src="istockphoto-2094337676-1024x1024.jpg"
                alt="Empowering Africa"
                className="intro-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Course Cards */}
      <main className="course">
        <div className="course_title">
          <h1>Explore Our Courses</h1>
          <p>
            Discover a wide range of courses designed to help you achieve your
            educational goals.
          </p>
        </div>
        <div className="cardSection">
          {courseData.map((card, index) => (
            <Course
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              bgColor={card.bgColor}
            />
          ))}
        </div>
        <button className="coursebtn">View all courses</button>
        <FeaturedCoursesSection />
      </main>
    </>
  );
}

export default CoursesPage;
