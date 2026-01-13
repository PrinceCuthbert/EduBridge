import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

function NationalExams({ countries }) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]?.name);
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);

  // Simulate async data loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const countryData = countries.find((c) => c.name === selectedCountry);
      setLevels(countryData?.levels || []);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [selectedCountry, countries]);

  const countryData = countries.find((c) => c.name === selectedCountry);

  return (
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 font-serif">
          National Examination Past Papers
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Access official past papers and marking schemes for national
          examinations across East Africa.
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
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 border text-sm flex items-center gap-2 ${
                isActive
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 -translate-y-1"
                  : "bg-white border-slate-200 text-slate-600 hover:border-primary/30 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg">{country.flag}</span>
              {country.name}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] p-8 border border-slate-100 animate-pulse">
              <div className="h-8 bg-slate-200 rounded-lg mb-4 w-1/3"></div>
              <div className="h-6 bg-slate-200 rounded-lg mb-6 w-2/3"></div>
              <div className="flex gap-2 mb-6">
                <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
              </div>
              <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Level Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {levels.map((level) => {
              // Extract unique years
              const allYears = [
                ...new Set(
                  level.subjects.flatMap(
                    (subject) => subject.years?.map((y) => y.year) || []
                  )
                ),
              ].sort((a, b) => b - a);

              return (
                <div
                  key={level.name}
                  className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:shadow-xl hover:border-secondary/20 transition-all duration-300 group flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                      <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-secondary group-hover:text-white" />
                    </div>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
                      {level.subjects.length} subjects
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-2 group-hover:text-secondary transition-colors">
                    {level.name}
                  </h3>
                  
                  <p className="text-sm text-slate-500 mb-6 flex-grow">
                    End of lower secondary education
                  </p>

                  <div className="mb-6">
                    <p className="text-xs font-medium text-slate-500 mb-2">Available years:</p>
                    <div className="flex flex-wrap gap-2">
                      {allYears.slice(0, 4).map((year) => (
                        <span
                          key={year}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full hover:bg-secondary hover:text-white transition-colors cursor-pointer"
                        >
                          {year}
                        </span>
                      ))}
                      {allYears.length > 4 && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
                          +{allYears.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="w-full px-6 py-3 bg-secondary/5 text-secondary hover:bg-secondary hover:text-white font-bold rounded-xl transition-all border border-secondary/20 hover:shadow-lg hover:shadow-secondary/20">
                    Browse Papers
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-primary mb-2">{levels.length}</p>
              <p className="text-sm font-medium text-slate-600">Exam Levels</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-secondary mb-2">
                {levels.reduce((sum, l) => sum + l.subjects.length, 0)}
              </p>
              <p className="text-sm font-medium text-slate-600">Subjects</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-orange-500 mb-2">
                {levels.reduce(
                  (sum, l) =>
                    sum +
                    l.subjects.reduce(
                      (s, sub) => s + (sub.years?.length || 0),
                      0
                    ),
                  0
                )}
                +
              </p>
              <p className="text-sm font-medium text-slate-600">Past Papers</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <p className="text-4xl font-extrabold text-purple-500 mb-2">200+</p>
              <p className="text-sm font-medium text-slate-600">Solutions</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NationalExams;
