import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faClock,
  faCertificate,
  faUsers,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function FeaturedCourseCard({
  image,
  title,
  rating,
  duration,
  students,
  instructor,
  level,
}) {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group h-full">
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => (e.target.src = "https://via.placeholder.com/400x250?text=Course+Image")}
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
            {level}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-orange-400">
            <FontAwesomeIcon icon={faStar} className="text-xs" />
            <span className="text-xs font-bold text-slate-700">{rating}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>
        
        <div className="flex items-center gap-4 text-slate-500 text-xs mb-6 mt-auto">
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faClock} className="text-primary/60" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faUsers} className="text-primary/60" />
            <span>{students}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
          <span className="text-xs font-medium text-slate-600">By <span className="text-slate-900 font-bold">{instructor}</span></span>
          <button className="px-4 py-2 bg-slate-50 text-slate-700 hover:bg-primary hover:text-white text-xs font-bold rounded-xl transition-all border border-slate-100">
            View Course
          </button>
        </div>
      </div>
    </div>
  );
}

FeaturedCourseCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  duration: PropTypes.string.isRequired,
  students: PropTypes.string.isRequired,
  instructor: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
};

function FeaturedCoursesSection() {
  const [activeCategory, setActiveCategory] = useState("Korean Language");

  const categories = [
    { id: "korean", title: "Korean Language", icon: faGraduationCap, color: "text-purple-600 bg-purple-50" },
    { id: "programming", title: "Programming", icon: faUsers, color: "text-blue-600 bg-blue-50" },
    { id: "university", title: "University Courses", icon: faCertificate, color: "text-green-600 bg-green-50" },
    { id: "language", title: "Language Courses", icon: faUsers, color: "text-orange-600 bg-orange-50" },
  ];

  const featuredCoursesData = [
    {
      category: "Korean Language",
      courses: [
        {
          image: "https://images.pexels.com/photos/5327922/pexels-photo-5327922.jpeg",
          title: "Korean for Beginners",
          rating: 4.8,
          duration: "12 weeks",
          students: "1,745",
          instructor: "Grace Mutua",
          level: "Beginner"
        },
        {
          image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
          title: "Intermediate Korean",
          rating: 4.7,
          duration: "15 weeks",
          students: "845",
          instructor: "Park Min-ji",
          level: "Intermediate"
        },
        {
          image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg",
          title: "Advanced Korean & TOPIK Preparation",
          rating: 4.9,
          duration: "18 weeks",
          students: "532",
          instructor: "Kim Sung-ho",
          level: "Advanced"
        },
      ],
    },
    {
      category: "Programming",
      courses: [
        {
          image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
          title: "Introduction to Python Programming",
          rating: 4.9,
          duration: "10 weeks",
          students: "3,210",
          instructor: "Prof. John Agiro",
          level: "Beginner"
        },
      ],
    },
    // Add other categories as needed...
  ];

  const activeFeaturedCourses =
    featuredCoursesData.find((data) => data.category === activeCategory)
      ?.courses || [];

  return (
    <section className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 font-serif">
            Featured Courses
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Browse our most popular courses from each category
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const isActive = activeCategory === category.title;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.title)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-300 border ${
                  isActive 
                    ? `bg-white border-primary/20 text-primary shadow-lg shadow-primary/5 -translate-y-1` 
                    : "bg-white/50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? category.color : "bg-slate-100 text-slate-400"}`}>
                  <FontAwesomeIcon icon={category.icon} className="text-sm" />
                </div>
                <span className="text-sm whitespace-nowrap">{category.title}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {activeFeaturedCourses.map((course) => (
            <FeaturedCourseCard
              key={course.title}
              {...course}
            />
          ))}
          {activeFeaturedCourses.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 font-medium italic">
              New courses coming soon for this category!
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark hover:-translate-y-1 transition-all active:scale-95 text-sm uppercase tracking-wider">
            View All {activeCategory} Courses
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCoursesSection;
