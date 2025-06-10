import React from "react"; // Required for JSX (especially if using hooks or older React versions)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faClock,
  faCertificate,
  faUsers,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import "../css/coursesPage/coursesPage.css"; // Adjust path if your CSS is elsewhere

import "../css/coursesPage/courseBenefits.css";

import FeaturedCourses from "./coursesPage/featuredCourse";

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

  const features = [
    {
      id: 1,
      icon: "✓", // or you can use an icon component like <FontAwesomeIcon icon={faCheck} />
      title: "Expert Instructors",
      description:
        "Learn from qualified educators with real-world experience in their fields.",
    },
    {
      id: 2,
      icon: "✓",
      title: "Practical Learning",
      description:
        "Hands-on projects and real-world applications that reinforce your learning.",
    },
    {
      id: 3,
      icon: "✓",
      title: "Flexible Learning",
      description:
        "Study at your own pace with 24/7 access to course materials.",
    },
    {
      id: 4,
      icon: "✓",
      title: "Recognized Certificates",
      description:
        "Earn certificates that enhance your resume and professional profile.",
    },
    {
      id: 5,
      icon: "✓",
      title: "Community Support",
      description:
        "Join a community of learners and receive guidance from peers and instructors.",
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
        <FeaturedCourses />
        <FeaturesList features={features} />
      </main>
    </>
  );
}
function FeaturesList({ features }) {
  return (
    <section className="features-section">
      <div className="features-header">
        <h2>Benefits of Our Courses</h2>
        <p>
          Our courses provide a comprehensive learning experience that goes
          beyond traditional education. Here is what sets us apart:
        </p>
        <div className="features-content-row">
          <div className="features-list">
            {features.map((feature) => (
              <div key={feature.id} className="feature-item">
                <span className="feature-icon">{feature.icon}</span>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="testimonial-images">
        <div className="first-image">
          <img
            src="./public/alexander.jpg"
            alt="Smiling student in a classroom setting, appearing confident and engaged. Bright, welcoming environment with other students in the background. Positive and inspiring mood."
            className="testimonial-img"
          />
        </div>

        <div className="student-image">
          <img
            src="./public/alexander.jpg"
            alt="Smiling student in a classroom setting, appearing confident and engaged. Bright, welcoming environment with other students in the background. Positive and inspiring mood."
            className="testimonial-img"
          />
          <img
            src="./public/alexander.jpg"
            alt="Smiling student in a classroom setting, appearing confident and engaged. Bright, welcoming environment with other students in the background. Positive and inspiring mood."
            className="testimonial-img"
          />
        </div>
      </div>
    </section>
  );
}

export default CoursesPage;
