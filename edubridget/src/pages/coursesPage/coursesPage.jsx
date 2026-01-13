import React from "react"; // Required for JSX (especially if using hooks or older React versions)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faClock,
  faCertificate,
  faGraduationCap,
  faUsers,
  faTrophy, // achievement
  faPlay, // start
  // faCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import FeaturedCourses from "./featuredCourse.jsx";

import Footer from "../footer/footer.jsx";

function CourseCategory({ icon, title, description, colorClass }) {
  return (
    <div className={`p-8 rounded-[2rem] transition-all duration-300 border border-transparent hover:shadow-xl hover:bg-white hover:border-slate-100 group flex flex-col items-start h-full bg-white/50`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-all duration-300 ${colorClass} group-hover:scale-110`}>
        <FontAwesomeIcon icon={icon} className="text-xl" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
        {description}
      </p>
      <a className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
        Explore courses <span className="text-lg">→</span>
      </a>
    </div>
  );
}

function CoursesPage() {
  // State to manage the active category
  // const [activeCategory, setActiveCategory] = useState("Korean Language");

  const courseCategories = [
    {
      icon: faGraduationCap,
      title: "Korean Language",
      description: "Learn Korean from beginner to advanced levels with native speakers.",
      colorClass: "bg-purple-50 text-purple-600",
    },
    {
      icon: faUsers, // Programming often uses code/users icons
      title: "Programming",
      description: "Master programming languages like Python, Java, and web development.",
      colorClass: "bg-blue-50 text-blue-600",
    },
    {
      icon: faCertificate,
      title: "University Courses",
      description: "Access university-level courses across various disciplines.",
      colorClass: "bg-green-50 text-green-600",
    },
    {
      icon: faUsers,
      title: "Language Courses",
      description: "Improve your language skills in English, French, Swahili, and more",
      colorClass: "bg-orange-50 text-orange-600",
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
    <div className="min-h-screen bg-white">
      {/* Intro Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary-gradient">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left text-white">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-8 font-serif">
                Explore Our Courses
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover a wide range of courses designed to help you achieve
                your educational and career goals.
              </p>
              <button className="px-8 py-4 bg-white text-primary rounded-2xl font-bold shadow-xl shadow-black/10 hover:bg-slate-50 transition-all active:scale-95 text-lg">
                Browse by Category
              </button>
            </div>
            <div className="flex-1 relative w-full max-w-2xl">
              <div className="relative bg-white/20 p-3 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-sm border border-white/30">
                <img
                  src="istockphoto-2094337676-1024x1024.jpg"
                  alt="Empowering Africa"
                  className="rounded-[2rem] w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 font-serif">
              Course Categories
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Explore our diverse course offerings designed to meet a wide range of educational needs
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {courseCategories.map((category, index) => (
              <CourseCategory
                key={index}
                {...category}
              />
            ))}
          </div>
        </div>
      </section>

      <FeaturedCourses />
      <FeaturesList features={features} />
      <BecomeInstructor />
      
    </div>
  );
}
function FeaturesList({ features }) {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-6 font-serif leading-tight">
              Benefits of Our Courses
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-10">
              Our courses provide a comprehensive learning experience that goes
              beyond traditional education. Here is what sets us apart:
            </p>
            
            <div className="space-y-6">
              {features.map((feature) => (
                <div key={feature.id} className="flex gap-4 group">
                  <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="text-xs font-bold text-lg">✓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <img 
                  src="/alexander.jpg" 
                  alt="Student 1" 
                  className="rounded-3xl w-full h-64 object-cover shadow-lg"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/300x400?text=Student+1")}
                />
                <img 
                  src="/vinicius.jpg" 
                  alt="Student 2" 
                  className="rounded-3xl w-full h-48 object-cover shadow-lg"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/300x300?text=Student+2")}
                />
              </div>
              <div className="space-y-4">
                <img 
                  src="/headshot.png" 
                  alt="Student 3" 
                  className="rounded-3xl w-full h-80 object-cover shadow-lg"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/300x500?text=Student+3")}
                />
                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 h-32 flex flex-col justify-center italic text-primary font-medium text-sm">
                  "The most flexible learning platform I've ever used. Highly recommended!"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const BecomeInstructorArray = [
  {
    icon: faTag,
    title: "Make an Impact",
    description:
      "Help shape the future of education in Africa by sharing your expertise with eager students.",
  },
  {
    icon: faUsers,
    title: "Join Our Community",
    description:
      "Become part of a growing network of dedicated educators committed to quality education.",
  },
  {
    icon: faStar,
    title: "Earn While Teaching",
    description: "Receive competitive compensation while doing what you love.",
  },
];

function BecomeInstructor() {
  return (
    <section className="py-24 bg-white px-6">
      <div className="container mx-auto">
        <div className="relative overflow-hidden bg-primary-gradient rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-white">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight font-serif">
                Share Your Knowledge
              </h2>
              <p className="text-xl text-white/90 mb-12 leading-relaxed opacity-90">
                Are you an expert in your field? Join our team of instructors and
                help empower the next generation of African students.
              </p>
              <button className="px-10 py-5 bg-white text-primary font-bold rounded-2xl shadow-xl shadow-black/10 hover:bg-slate-50 transition-all active:scale-95 text-lg">
                Become an Instructor
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {BecomeInstructorArray.map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={item.icon} className="text-xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoursesPage;
