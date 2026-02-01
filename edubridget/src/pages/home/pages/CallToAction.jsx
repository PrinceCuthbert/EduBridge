import React from 'react';
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="py-20 bg-primary-gradient text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
          Ready to Begin Your Learning Journey?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of students across East Africa using TM Edubridge to transform their education
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/signin">
            <button className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg">
              Get Started Today
            </button>
          </Link>
          <Link to="/contactPage">
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
