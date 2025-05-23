import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faClock,
  faCertificate,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons"; // Import quote icon
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  faBook,
  faEdit,
  faFileAlt,
  faChalkboardTeacher,
  faLaptop,
  faMoneyCheckAlt,
} from "@fortawesome/free-solid-svg-icons";

import "./css/header.css";
import "./css/intropage.css";
import "./css/aboutSection.css";
import "./css/card.css";
import "./css/courses.css";
import "./css/membership.css";
import "./css/review.css";
import "./css/footer.css";
import "./css/academicService.css";
import "./css/AboutUsPage/AboutUsPage.css";
import "./css/contactPage/contactPage.css";

import MembershipPage from "./pages/MembershipPage";
import ContactPage from "./pages/contactPage";
import AboutUsPage from "./pages/AboutUsPage";
import Footer from "./pages/footer";
import CoursesPage from "./pages/coursesPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Intro />
              <About />
              <AcademicSection />
              <Courses />
              <Membership />
              <ReviewSection />
              <Footer />
            </>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/AboutUsPage" element={<AboutUsPage />}></Route>
        <Route path="/coursesPage" element={<CoursesPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false); // Define state for menu

  useEffect(() => {
    setMenuOpen(false); // close menu on route change
  }, [location]);

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
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/coursesPage"
              className={({ isActive }) => (isActive ? "active" : "")}>
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/resources"
              className={({ isActive }) => (isActive ? "active" : "")}>
              Resources
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/membership"
              className={({ isActive }) => (isActive ? "active" : "")}>
              Membership
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/AboutUsPage"
              className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active" : "")}>
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" className="login">
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/signup" className="signup">
              Sign Up
            </NavLink>
          </li>
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
              Empowering Africa through <br></br>Knowledge
            </h1>
            <p>
              Access quality education, resources, and expert guidance to
              achieve your academic goals with TM EduBridge Online Academy.
            </p>
          </div>
          <div className="buttons">
            <button className="btn btn--primary">Explore Courses</button>
            <button className="btn btn--secondary">Watch Intro</button>
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
    <main className="main aboutsection">
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

// Academic services offered
// Academic services offered

function AcademicSection() {
  const cardData = [
    {
      icon: faBook,
      title: "Thesis Writing Support",
      content: [
        "Guidance with structure, content, and formatting",
        "Assistance at any stage: proposal, draft, or final submission",
      ],
    },
    {
      icon: faEdit,
      title: "Proofreading & Editing",
      content: [
        "Grammar, punctuation, and spelling corrections",
        "Academic style and clarity improvements",
        "Consistency in formatting and references (APA, MLA, IEEE, etc.)",
      ],
    },
    {
      icon: faFileAlt,
      title: "Research Paper & Journal Publication",
      content: [
        "Editing and formatting for journal submission",
        "Plagiarism check and reduction support",
        "Assistance with response to reviewers",
      ],
    },
    {
      icon: faChalkboardTeacher,
      title: "Academic Advisory & Coaching",
      content: [
        "Topic selection and refinement",
        "Research methodology support",
        "Data analysis guidance (qualitative & quantitative)",
      ],
    },
    {
      icon: faLaptop,
      title: "Presentation & Defense Preparation",
      content: [
        "Slide design and content review",
        "Mock defense sessions with feedback",
      ],
    },
    {
      icon: faMoneyCheckAlt,
      title: "Scholarship & Grant Application",
      content: [
        "Statement of purpose (SOP) and personal statement editing",
        "CV and recommendation letter support",
      ],
    },
  ];

  return (
    <div className="academicServices">
      <h1>Academic Services Offered</h1>
      <p>
        Comprehensive academic support to help you succeed in your educational
        journey.
      </p>
      <div className="cardSection">
        {cardData.map((card, index) => (
          <div key={index} className="card academicCard">
            <div className="card-header">
              <FontAwesomeIcon icon={card.icon} size="3x" className="icons" />
              <h2>{card.title}</h2>
            </div>
            <ul>
              {card.content.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
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

function Membership() {
  const plans = [
    {
      planName: "Free Plan",
      description: "Basic access to educational resources",
      price: "$0",
      features: [
        "Limited course previews",
        "Access to basic study materials",
        "Community forum access",
        "Full course access",
        "Certificates",
      ],
      disabledFeatures: ["Full course access", "Certificates"],
      buttonText: "Sign Up Free",
    },
    {
      planName: "Pro Plan",
      description: "Unlock full courses and exclusive content",
      price: "$9.99",
      features: [
        "Unlimited course access",
        "Exclusive webinars",
        "Downloadable materials",
        "Community forum access",
        "Certificates",
      ],
      disabledFeatures: [],
      buttonText: "Get Pro",
    },
    {
      planName: "Premium Plan",
      description: "All features plus 1-on-1 mentorship",
      price: "$19.99",
      features: [
        "All Pro features",
        "1-on-1 Mentorship",
        "Live support",
        "Career advice",
        "Priority certificates",
      ],
      disabledFeatures: [],
      buttonText: "Go Premium",
    },
  ];

  return (
    <div className="membershipSection">
      <div className="member_title">
        <h1>Membership Plans</h1>
        <p>
          Choose the plan that best suits your educational needs and budget.
        </p>
      </div>
      <div className="membership-cards-wrapper">
        {plans.map((plan, idx) => (
          <MembershipCard key={idx} {...plan} />
        ))}
      </div>
    </div>
  );
}

function MembershipCard({
  planName,
  description,
  price,
  features,
  buttonText,
  disabledFeatures,
}) {
  return (
    <div className="membership-card">
      <div className="membership-header">
        <p className="plan-name">{planName}</p>
        <p className="plan-desc">{description}</p>
        <p className="plan-price">
          <span className="price-amount">{price}</span> /month
        </p>
        <hr />
      </div>
      <div className="membership-body">
        <ul className="features">
          {features.map((feature, index) => (
            <li
              key={index}
              className={disabledFeatures.includes(feature) ? "disabled" : ""}>
              {feature}
            </li>
          ))}
        </ul>
        <button className="signup-btn">{buttonText}</button>
      </div>
    </div>
  );
}

function ReviewSection() {
  const reviews = [
    {
      icon: faQuoteLeft,
      title: "Jane M., Kenya",
      description:
        "TM EduBridge transformed my learning experience. I passed my national exams with flying colors!",
      image: "./headshot.png", // Placeholder for image
    },
    {
      icon: faQuoteLeft,
      title: "Samuel O., Nigeria",
      description:
        "As a working professional, the flexible learning options helped me earn a certification in my own time.",

      image: "./cuthbert.jpg", // Placeholder for image
    },
    {
      icon: faQuoteLeft,
      title: "Ms. Amina B., Tanzania",
      description:
        "As an educator, I’ve found their resources aligned with our curriculum and easy to implement.",
      image: "./zino.jpg", // Placeholder for image
    },
  ];

  return (
    <main className="main reviewpage">
      <div className="review_title">
        <h1>What Our Learners Say</h1>
        <p>
          Hear from students and educators across Africa who have benefited from
          TM EduBridge.
        </p>
      </div>
      <div className="cardSection">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-icon">
              <i className={`fa ${review.icon}`} />
            </div>
            <div className="review-content">
              {review.image && (
                <img
                  src={review.image}
                  alt={review.title}
                  className="review-image"
                />
              )}
              <h3 className="review-title">{review.title}</h3>
              <p className="review-description">{review.description}</p>
              <blockquote className="review-description">
                {review.description}
              </blockquote>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
