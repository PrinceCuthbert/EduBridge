import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";

function HighSchoolTab({ countries, SchoolCountries, subjects }) {
  const [selectedCountry, setSelectedCountry] = useState("Rwanda");
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);

  // Simulate async data loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const selectedData = SchoolCountries.find((c) => c.name === selectedCountry);
      setSchools(selectedData?.schools || []);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedCountry, SchoolCountries]);

  const selectedData = SchoolCountries.find((c) => c.name === selectedCountry);
  const totalSchools = selectedData?.schools.length || 0;
  const totalMaterials = 500; // Placeholder

  return (
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 font-serif">
          School Materials
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Select a country and school to access comprehensive study materials organized by grade level and subject.
        </p>
      </div>

      {/* Country Filter Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {countries.map((country) => {
          const isActive = selectedCountry === country.name;
          return (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country.name)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 border text-sm ${
                isActive
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 -translate-y-1"
                  : "bg-white border-slate-200 text-slate-600 hover:border-primary/30 hover:bg-slate-50"
              }`}
            >
              <span className="font-mono font-bold">{country.short}</span> {country.name}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 animate-pulse">
              <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-6"></div>
              <div className="h-6 bg-slate-200 rounded-lg mb-3 w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded-lg mb-2 w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded-lg mb-6 w-full"></div>
              <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* School Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {schools.map((school, index) => (
              <div
                key={index}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-2xl text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                  {school}
                </h3>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-2">
                  <span className="text-lg">{selectedData.flag}</span>
                  {selectedCountry}
                </p>
                <p className="text-sm text-slate-400 mb-6 flex-grow">
                  O-Level & A-Level • 100+ Materials
                </p>
                <button className="w-full px-6 py-3 bg-primary/5 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-all border border-primary/20 hover:shadow-lg hover:shadow-primary/20">
                  View Materials
                </button>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-primary mb-2">{totalSchools}</p>
              <p className="text-sm font-medium text-slate-600">Schools</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-secondary mb-2">6</p>
              <p className="text-sm font-medium text-slate-600">Grade Levels</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-orange-500 mb-2">{totalMaterials}+</p>
              <p className="text-sm font-medium text-slate-600">Study Materials</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-purple-500 mb-2">25+</p>
              <p className="text-sm font-medium text-slate-600">Subjects</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HighSchoolTab;
