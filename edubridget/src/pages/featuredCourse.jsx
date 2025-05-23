import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faClock,
  faCertificate,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import "../css/coursesPage/featuredCourse.css";

function FeaturedCourseCard({
  image,
  title,
  rating,
  duration,
  price,
  instructor,
}) {
  return (
    <div className="featuredCourseCard">
      <img
        src={image}
        alt={title}
        className="featuredCourseImage"
        onError={(e) => (e.target.src = "https://via.placeholder.com/280x160")}
      />
      <div className="featuredCourseInfo">
        <h3>{title}</h3>
        <div className="rating">
          <span>★ {rating}</span>
        </div>
        <p>
          <FontAwesomeIcon icon={faClock} /> {duration} • {price}
        </p>
        <p>By {instructor}</p>
        <button className="viewCourseBtn">View Course</button>
      </div>
    </div>
  );
}

FeaturedCourseCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  duration: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  instructor: PropTypes.string.isRequired,
};

function FeaturedCoursesSection() {
  const [activeCategory, setActiveCategory] = useState("Programming");

  const courseData = [
    {
      icon: faGraduationCap,
      title: "Korean Language",
      description:
        "Learn Korean from beginner to advanced levels with native speakers.",
    },
    {
      icon: faClock,
      title: "Programming",
      description:
        "Master programming languages like Python, Java, and web development.",
    },
    {
      icon: faCertificate,
      title: "University Courses",
      description:
        "Access university-level courses across various disciplines.",
    },
    {
      icon: faUsers,
      title: "Language Courses",
      description:
        "Improve your language skills in English, French, Swahili, and more",
    },
  ];

  const featuredCoursesData = [
    {
      category: "Korean Language",
      courses: [
        {
          image:
            "https://images.pexels.com/photos/5327922/pexels-photo-5327922.jpeg",
          title: "Undergraduate Introduction to Business Management",
          rating: 4.5,
          duration: "15 weeks",
          price: "₵1,567",
          instructor: "Dr. Rachel Mutua",
        },
      ],
    },
    {
      category: "Programming",
      courses: [
        {
          image:
            "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
          title: "Undergraduate Engineering Mechanics",
          rating: 4.7,
          duration: "18 weeks",
          price: "₵983",
          instructor: "Prof. John Agiro",
        },
      ],
    },
    {
      category: "University Courses",
      courses: [
        {
          image:
            "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg",
          title: "Undergraduate Human Anatomy & Physiology",
          rating: 4.8,
          duration: "20 weeks",
          price: "₵1,245",
          instructor: "Dr. Mary Naktha",
        },
      ],
    },
    {
      category: "Language Courses",
      courses: [
        {
          image:
            "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg",
          title: "Advanced Language Skills",
          rating: 4.6,
          duration: "12 weeks",
          price: "₵1,100",
          instructor: "Prof. Emma Kiptoo",
        },
        {
          image:
            "https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg",
          title: "Advanced Language Skills",
          rating: 4.6,
          duration: "12 weeks",
          price: "₵1,100",
          instructor: "Prof. Emma Kiptoo",
        },
      ],
    },
  ];

  const activeFeaturedCourses =
    featuredCoursesData.find((data) => data.category === activeCategory)
      ?.courses || [];

  return (
    <section className="featuredCourses">
      <h2>Featured Courses</h2>
      <p>Browse our most popular courses from each category</p>
      <div className="categoryTabs">
        {courseData.map((category, index) => (
          <button
            key={index}
            className={`categoryTab ${
              activeCategory === category.title ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category.title)}>
            <FontAwesomeIcon icon={category.icon} className="tab-icon" />{" "}
            {category.title}
          </button>
        ))}
      </div>
      <div className="featuredCoursesGrid">
        {activeFeaturedCourses.map((course, index) => (
          <FeaturedCourseCard
            key={course.title}
            image={course.image}
            title={course.title}
            rating={course.rating}
            duration={course.duration}
            price={course.price}
            instructor={course.instructor}
          />
        ))}
      </div>
      <button className="viewAllBtn">View All University Courses</button>
    </section>
  );
}

export default FeaturedCoursesSection;
