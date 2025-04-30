import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faClock,
  faCertificate,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import "./css/header.css";
import "./css/intropage.css";
import "./css/aboutpage.css";
import "./css/card.css";
import "./css/courses.css";

function App() {
  return (
    <>
      <Header />
      <Intro />
      <About />
      <Courses />
    </>
  );
}

export default App;

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-section">
        <img src="/vite.svg" alt="Logo" className="logo" />
        <h1>EduBridge</h1>
      </div>

      <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <nav className="nav_list">
        <ul className={menuOpen ? "show" : ""}>
          <li>Home</li>
          <li>Course</li>
          <li>Resource</li>
          <li>Membership</li>
          <li>About</li>
          <li>Contact</li>
          <li className="login">Login</li>
          <li className="signup">Sign Up</li>
        </ul>
      </nav>
    </header>
  );
}

function Intro() {
  return (
    <main className="intropage">
      <div className="intro_one">
        <div className="partOne">
          <div className="description">
            <h1>
              Empowering <br /> Africa through <br /> AfricaKnowledge
            </h1>
            <p>
              Access quality education, resources, and expert guidance to
              achieve your academic goals with TM EduBridge Online Academy.
            </p>
          </div>
          <div className="buttons">
            <button className="primary-btn">Explore Courses</button>
            <button className="secondary-btn">Watch Intro</button>
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
    </main>
  );
}

function About() {
  const cardData = [
    {
      icon: faGraduationCap,
      title: "Expert Instructors",
      description:
        "Learn from qualified and experienced educators from around the world, specializing in various subjects.",
    },
    {
      icon: faClock,
      title: "Flexible Learning",
      description:
        "Study at your own pace with flexible schedules and online access to resources anytime.",
    },
    {
      icon: faCertificate,
      title: "Certification",
      description:
        "Get certified upon completion of courses to boost your academic or professional journey.",
    },
    {
      icon: faUsers,
      title: "Community Support",
      description:
        "Join an active student community to collaborate and share knowledge.",
    },
    {
      icon: faUsers,
      title: "Country-Specific Materials",
      description:
        "Study with resources tailored to your country's curriculum and educational standards.",
    },
  ];

  return (
    <main className="main aboutpage">
      <div className="about_title">
        <h1>Why Choose TM EduBridge?</h1>
        <p>
          We offer comprehensive educational resources and courses designed to
          meet the needs of students across Africa.
        </p>
      </div>
      <div className="cardSection">
        {cardData.map((card, index) => (
          <Card
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </main>
  );
}

function Card({ icon, title, description }) {
  return (
    <div className="card">
      <FontAwesomeIcon icon={icon} size="3x" className="icons" />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function Courses() {
  const courseData = [
    {
      icon: faGraduationCap,
      title: "Korean Language",
      description:
        "Learn Korean from beginner to advanced levels with native speakers.",
      bgColor: "#e0f7fa", // light cyan
    },
    {
      icon: faClock,
      title: "Programming",
      description:
        "Master programming languages like Python, Java, and web development.",
      bgColor: "#e8f5e9", // light green
    },
    {
      icon: faCertificate,
      title: "University Courses",
      description:
        "Access university-level courses across various disciplines.",
      bgColor: "#fff3e0", // light orange
    },
    {
      icon: faUsers,
      title: "Language Courses",
      description:
        "Improve your language skills in English, French, Swahili, and more",
      bgColor: "#f3e5f5", // light purple
    },
  ];
  return (
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
    </main>
  );
}

function Course({ icon, title, description, bgColor }) {
  return (
    <div className="card courseCard" style={{ backgroundColor: bgColor }}>
      <FontAwesomeIcon icon={icon} size="3x" className="icons" />
      <h2>{title}</h2>
      <p>{description}</p>
      <a className="link">Explore courses &rarr;</a>
    </div>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
