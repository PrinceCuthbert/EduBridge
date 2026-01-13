import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faLock, faCheck } from "@fortawesome/free-solid-svg-icons";
import { books } from "../../data/books.js";

function FamousBooksTab() {
  const [loading, setLoading] = useState(true);

  // Simulate async data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Famous Books & Solutions
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Access renowned textbooks with comprehensive solutions and explanations.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-12">
          {[1, 2].map((section) => (
            <div key={section}>
              <div className="h-8 bg-slate-200 rounded-lg w-48 mb-6 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 animate-pulse">
                    <div className="h-6 bg-slate-200 rounded-lg mb-3 w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded-lg mb-4 w-1/2"></div>
                    <div className="h-4 bg-slate-200 rounded-lg mb-6 w-2/3"></div>
                    <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {books.map((section, index) => (
            <div key={index}>
              {/* Category Title */}
              <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif">
                {section.category}
              </h3>

              {/* Books Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-[2rem] p-6 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col relative"
                  >
                    {/* Premium Lock Badge */}
                    {book.premium && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faLock} className="text-orange-500 text-sm" />
                      </div>
                    )}

                    {/* Book Title */}
                    <h4 className="text-lg font-bold text-slate-900 mb-2 pr-8 group-hover:text-primary transition-colors">
                      {book.title}
                    </h4>

                    {/* Author */}
                    <p className="text-sm text-slate-500 mb-4">
                      by {book.author}
                    </p>

                    {/* Solutions Available */}
                    {book.solutionsAvailable && (
                      <div className="flex items-center gap-2 mb-6 flex-grow">
                        <div className="w-5 h-5 bg-secondary/10 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faCheck} className="text-secondary text-xs" />
                        </div>
                        <span className="text-sm text-slate-600">Solutions Available</span>
                      </div>
                    )}

                    {/* Action Button */}
                    {book.premium ? (
                      <button
                        disabled
                        className="w-full px-6 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl transition-all border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <FontAwesomeIcon icon={faLock} className="text-sm" />
                        Premium Required
                      </button>
                    ) : (
                      <a
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-6 py-3 bg-primary/5 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-all border border-primary/20 hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 no-underline"
                      >
                        <FontAwesomeIcon icon={faBook} className="text-sm" />
                        Access Book
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FamousBooksTab;
