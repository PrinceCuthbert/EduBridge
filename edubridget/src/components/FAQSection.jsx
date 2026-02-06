import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

function FAQSection({ faqs, title = "Frequently Asked Questions", subtitle = "Find quick answers to common questions about our platform and services", showContactBtn = true }) {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h2>
          {subtitle && <p className="text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden hover:border-[#1A237E]/20 hover:shadow-md transition-all"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <span className="font-semibold text-slate-900 pr-4 text-base">{faq.question}</span>
                <FontAwesomeIcon
                  icon={openFAQ === index ? faChevronUp : faChevronDown}
                  className="text-slate-400 flex-shrink-0 transition-transform"
                />
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-5 pt-0">
                  <p className="text-slate-600 leading-relaxed text-sm">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {showContactBtn && (
          <div className="text-center mt-8">
            <p className="text-slate-600 mb-4">Still have questions?</p>
            <a
              href="/contactPage"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Contact Support Team
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export default FAQSection;
