import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-slate-200 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-20 h-20 text-primary animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-slate-600 text-lg">
            Oops! The page you're looking for seems to have wandered off.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-lg hover:shadow-xl">
            <Home size={20} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold border-2 border-slate-200">
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/study-abroad"
              className="text-sm text-primary hover:underline">
              Study Abroad
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/scholarships"
              className="text-sm text-primary hover:underline">
              Scholarships
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/visa-consultation"
              className="text-sm text-primary hover:underline">
              Visa Services
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/contactPage"
              className="text-sm text-primary hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
