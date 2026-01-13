import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUniversity, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { universities } from "../../data/universities.js";

const regions = [
  { id: 1, name: "East Africa", flag: "🌍", count: 4 },
  { id: 2, name: "Korea", flag: "🇰🇷", count: 4 },
  { id: 3, name: "Europe", flag: "🇪🇺", count: 2 },
  { id: 4, name: "North America", flag: "🇺🇸", count: 2 },
  { id: 5, name: "Asia Pacific", flag: "🌏", count: 2 },
];

function UniversitiesTab() {
  const [selectedRegion, setSelectedRegion] = useState("East Africa");
  const [loading, setLoading] = useState(true);
  const [filteredUniversities, setFilteredUniversities] = useState([]);

  // Simulate async data loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = universities.filter((uni) => uni.region === selectedRegion);
      setFilteredUniversities(filtered);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [selectedRegion]);

  // Calculate stats
  const totalUniversities = filteredUniversities.length;
  const totalFaculties = filteredUniversities.reduce((sum, uni) => sum + uni.faculties.length, 0);
  const totalCourses = totalFaculties * 3; // Estimate
  const totalResources = totalCourses * 5; // Estimate

  return (
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 font-serif">
          University Resources
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Access comprehensive university materials from top institutions across East Africa, Korea, and worldwide.
        </p>
      </div>

      {/* Region Filter Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {regions.map((region) => {
          const isActive = selectedRegion === region.name;
          return (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.name)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 border text-sm flex items-center gap-2 ${
                isActive
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 -translate-y-1"
                  : "bg-white border-slate-200 text-slate-600 hover:border-primary/30 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg">{region.flag}</span>
              {region.name}
              <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-slate-100"}`}>
                {region.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 animate-pulse">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-6"></div>
              <div className="h-6 bg-slate-200 rounded-lg mb-3 w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded-lg mb-2 w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded-lg mb-6 w-full"></div>
              <div className="flex gap-2 mb-6">
                <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
              </div>
              <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* University Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredUniversities.map((uni) => (
              <div
                key={uni.id}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <FontAwesomeIcon icon={faUniversity} className="text-2xl text-primary group-hover:text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                  {uni.name}
                </h3>
                
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                  {uni.location}, {uni.country}
                </p>

                <p className="text-xs text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
                  <span>{uni.faculties.length} Faculties</span>
                  <span className="text-slate-300">•</span>
                  <span>{uni.totalStudents}</span>
                  <span className="text-slate-300">•</span>
                  <span>Est. {uni.established}</span>
                </p>

                <div className="flex flex-wrap gap-2 mb-6 flex-grow">
                  {uni.faculties.slice(0, 3).map((faculty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                    >
                      {faculty}
                    </span>
                  ))}
                  {uni.faculties.length > 3 && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
                      +{uni.faculties.length - 3} more
                    </span>
                  )}
                </div>

                <Link
                  to={`/resources/${encodeURIComponent(uni.name.replace(/\s+/g, '-'))}/faculties`}
                  state={{ university: uni, fromUniversity: true }}
                  className="w-full"
                >
                  <button className="w-full px-6 py-3 bg-primary/5 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-all border border-primary/20 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2">
                    View Faculties
                    <span>→</span>
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-primary mb-2">{totalUniversities}</p>
              <p className="text-sm font-medium text-slate-600">Universities</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-secondary mb-2">{totalFaculties}</p>
              <p className="text-sm font-medium text-slate-600">Faculties</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-orange-500 mb-2">{totalCourses.toLocaleString()}+</p>
              <p className="text-sm font-medium text-slate-600">Courses</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-purple-500 mb-2">{totalResources.toLocaleString()}+</p>
              <p className="text-sm font-medium text-slate-600">Resources</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UniversitiesTab;
