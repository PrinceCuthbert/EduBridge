import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUniversity, faBookOpen, faArrowLeft, faMapMarkerAlt, faUsers, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { findUniversityByName } from "../../../data/universities.js";

function FacultiesDetails() {
  const navigate = useNavigate();
  const { universityName } = useParams();
  const [loading, setLoading] = useState(true);
  const [university, setUniversity] = useState(null);
  const [faculties, setFaculties] = useState([]);

  // Simulate async data loading - Replace with actual API call later
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    const timer = setTimeout(() => {
      // Find university from shared data source
      const foundUniversity = findUniversityByName(universityName);
      
      if (foundUniversity) {
        // Transform faculties array into objects with additional metadata
        const facultiesWithMetadata = foundUniversity.faculties.map((facultyName, index) => ({
          id: index + 1,
          name: facultyName,
          courses: `${Math.floor(Math.random() * 30) + 20} courses`, // Mock data - replace with API
          materials: `${Math.floor(Math.random() * 100) + 100}+ materials`, // Mock data - replace with API
        }));

        setUniversity({
          ...foundUniversity,
          location: `${foundUniversity.location}, ${foundUniversity.country}`,
        });
        setFaculties(facultiesWithMetadata);
      }
      
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [universityName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32">
        <div className="container mx-auto px-6">
          {/* Loading Header */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded-lg w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-1/4"></div>
          </div>

          {/* Loading University Card */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 mb-12 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-6 bg-slate-200 rounded-lg w-1/3 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Loading Faculty Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 animate-pulse">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-6"></div>
                <div className="h-6 bg-slate-200 rounded-lg mb-3 w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded-lg mb-6 w-1/2"></div>
                <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">University not found</h2>
          <Link to="/resourcesPage" className="text-primary hover:underline">
            ← Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Gradient */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-primary-gradient">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white font-serif">
              {university.name} - Faculties
            </h1>
            <Link
              to="/resourcesPage"
              className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-medium transition-all border border-white/20 backdrop-blur-sm flex items-center gap-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Universities
            </Link>
          </div>
          <p className="text-lg text-white/90 max-w-2xl">
            Select a faculty to browse courses and materials
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* University Information Card */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm mb-12 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faUniversity} className="text-3xl text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{university.name}</h3>
                <p className="text-slate-600 flex items-center gap-4 flex-wrap text-sm">
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                    {university.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} className="text-primary" />
                    {university.totalStudents}+ students
                  </span>
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} className="text-primary" />
                    Est. {university.established}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Faculties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculties.map((faculty) => (
              <div
                key={faculty.id}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                  <FontAwesomeIcon icon={faBookOpen} className="text-2xl text-secondary group-hover:text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-secondary transition-colors">
                  Faculty of {faculty.name}
                </h3>
                
                <p className="text-sm text-slate-500 mb-6 flex-grow">
                  {faculty.courses} • {faculty.materials}
                </p>

                <button className="w-full px-6 py-3 bg-primary/5 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-all border border-primary/20 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2">
                  View Courses
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default FacultiesDetails;
