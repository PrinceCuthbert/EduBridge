import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faStar,
  faUniversalAccess,
  faLightbulb,
  faUsers,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

function AboutUsPage() {
  const coreValues = [
    {
      id: 1,
      icon: faGraduationCap,
      title: "Quality Education",
      description: "We are committed to providing the highest quality educational resources and experiences.",
      color: "blue",
    },
    {
      id: 2,
      icon: faStar,
      title: "Excellence",
      description: "We strive for excellence in everything we do — from course content to student support.",
      color: "yellow",
    },
    {
      id: 3,
      icon: faUniversalAccess,
      title: "Accessibility",
      description: "We believe education should be accessible to all, regardless of location or income.",
      color: "green",
    },
    {
      id: 4,
      icon: faLightbulb,
      title: "Innovation",
      description: "We embrace innovative teaching methods and technologies to enhance the learning experience.",
      color: "purple",
    },
    {
      id: 5,
      icon: faUsers,
      title: "Community",
      description: "We foster a supportive learning community where students can connect and grow together.",
      color: "orange",
    },
    {
      id: 6,
      icon: faHeart,
      title: "Empathy",
      description: "We understand the challenges students face and provide compassionate support every step of the way.",
      color: "pink",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Adolphe NIYIGENA",
      role: "Founder & CEO",
      description: "Educational visionary with a passion for making quality education accessible to all African students.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Grace Mutoni",
      role: "Head of Korean Language",
      description: "Korean language expert with years of teaching experience both in Korea and across Africa.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "David Kamau",
      role: "Lead Programming Instructor",
      description: "Software engineer with a passion for teaching coding to the next generation of African developers.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Sarah Okello",
      role: "Academic Director",
      description: "Education specialist with expertise in curriculum development and educational policy.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
  ];

  const getIconColor = (color) => {
    const colors = {
      blue: "text-blue-500",
      yellow: "text-yellow-500",
      green: "text-green-500",
      purple: "text-purple-500",
      orange: "text-orange-500",
      pink: "text-pink-500",
    };
    return colors[color] || "text-primary";
  };

  const getIconBgColor = (color) => {
    const bgColors = {
      blue: "bg-blue-100",
      yellow: "bg-yellow-100",
      green: "bg-green-100",
      purple: "bg-purple-100",
      orange: "bg-orange-100",
      pink: "bg-pink-100",
    };
    return bgColors[color] || "bg-primary/10";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-primary-gradient">
        <div className="absolute top-0 left-0 -translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6 font-serif">
            About TM EduBridge
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Empowering Africa through knowledge, innovation, and accessible education
          </p>
        </div>
      </section>

      {/* Founder's Message Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 font-serif">
              Founder's Message
            </h2>
            <p className="text-slate-600">A personal note from our visionary founder</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Founder Profile */}
              <div className="lg:col-span-1 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                    alt="Adolphe NIYIGENA"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Adolphe NIYIGENA</h3>
                <p className="text-sm text-slate-600 mb-4">Founder & CEO</p>
                
                {/* Social Media Icons */}
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all text-xs font-bold">
                    f
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-all text-xs font-bold">
                    𝕏
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition-all text-xs font-bold">
                    IG
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center transition-all text-xs font-bold">
                    in
                  </a>
                </div>
              </div>

              {/* Message Content */}
              <div className="lg:col-span-3 space-y-4 text-slate-700 leading-relaxed">
                <p className="font-medium">Dear Students, Parents, and Educators,</p>
                
                <p>
                  Welcome to TM EduBridge Online Academy. My journey to establishing this platform began with a simple observation: across Africa, quality educational resources remain inaccessible to many talented students eager to learn and grow. After having personally benefited from the transformative power of education in my own life, I became passionate about creating a solution that could bridge this educational gap. I envisioned a platform where a student in a remote village in Rwanda could have the same quality educational experience as one in an urban center.
                </p>
                
                <p>
                  TM EduBridge was born from this vision — a comprehensive online academy that brings together courses, materials, and resources tailored to the educational needs of African students. From high school materials organized by country and curriculum to specialized courses in Korean language, programming, and university subjects, our platform aims to be a one-stop educational solution. What began as a small initiative has grown into a vibrant learning community with students from across the continent. Our team of dedicated educators shares my passion for accessible education and works tirelessly to create engaging, relevant content that helps students excel.
                </p>
                
                <p>
                  As we continue to grow, our commitment remains unchanged: to empower Africa through knowledge. We believe that education is the most powerful tool for individual and societal transformation, and we are dedicated to making quality education accessible to all. I invite you to join us on this educational journey. Whether you're a student seeking resources, a parent supporting your child's education, or an educator looking to contribute your expertise, there's a place for you in our community.
                </p>
                
                <p className="font-medium">Together, let's build a brighter future through education.</p>
                
                <div className="pt-4">
                  <p className="font-bold">Warm regards,</p>
                  <p className="font-bold">Adolphe NIYIGENA</p>
                  <p className="font-bold text-primary">Founder & CEO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 font-serif">
              Our Core Values
            </h2>
            <p className="text-slate-600">These principles guide everything we do at TM EduBridge</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {coreValues.map((value) => (
              <div
                key={value.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${getIconBgColor(value.color)}`}>
                  <FontAwesomeIcon icon={value.icon} className={`text-2xl ${getIconColor(value.color)}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 font-serif">
              Meet Our Team
            </h2>
            <p className="text-slate-600">Dedicated educators and professionals committed to our mission</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                <div className="h-56 sm:h-64 overflow-hidden bg-slate-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;
