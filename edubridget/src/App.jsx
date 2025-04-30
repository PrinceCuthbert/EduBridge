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
import "./css/membership.css";
import "./css/review.css";
import "./css/footer.css";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons"; // Import quote icon

function App() {
  return (
    <>
      <Header />
      <Intro />
      <About />
      <Courses />
      <Membership />
      <ReviewSection />
      <Footer />
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

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* TM EduBridge Branding Section */}
        <div className="footer-branding">
          <h2>TM EduBridge</h2>
          <p>
            Empowering Africa through Knowledge. We provide quality education
            and resources to help students achieve their academic goals.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#">Courses</a>
            </li>
            <li>
              <a href="#">High School Materials</a>
            </li>
            <li>
              <a href="#">Famous Books</a>
            </li>
            <li>
              <a href="#">Membership Plans</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Contact Information Section */}
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>123 Education Street, Kigali, Rwanda</p>
          <p>+250 12 345 6789</p>
          <p>info@edubridge.com</p>
        </div>

        {/* Newsletter Subscription Section */}
        <div className="footer-newsletter">
          <h3>Newsletter</h3>
          <p>
            Subscribe to our newsletter for updates on new courses and
            educational resources.
          </p>
          <input type="email" placeholder="Enter your email" />
          <button className="subscribe-btn">Subscribe</button>
        </div>
      </div>
    </footer>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
