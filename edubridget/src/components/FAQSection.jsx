import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, MessageCircle, Sparkles } from "lucide-react";

function FAQSection({
  faqs,
  title = "Looking for Quick Answers?",
  subtitle = "Check our frequently asked questions for immediate help.",
  showContactBtn = true,
}) {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header with Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-md text-slate-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}>
              <div
                className={`group bg-white rounded-2xl border-2 transition-all duration-300 ${
                  openFAQ === index
                    ? "border-primary shadow-xl shadow-primary/10"
                    : "border-slate-200 hover:border-primary/30 hover:shadow-lg"
                }`}>
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 md:px-8 py-6 flex items-start justify-between text-left gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        openFAQ === index
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                      }`}>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span
                      className={`font-semibold text-lg transition-colors ${
                        openFAQ === index ? "text-primary" : "text-slate-900"
                      }`}>
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0">
                    <ChevronDown
                      className={`w-6 h-6 transition-colors ${
                        openFAQ === index ? "text-primary" : "text-slate-400"
                      }`}
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden">
                      <div className="px-6 md:px-8 pb-6 pt-0 pl-20">
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="prose prose-slate max-w-none">
                          <p className="text-slate-600 leading-relaxed text-base">
                            {faq.answer}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        {showContactBtn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12">
            <div className="inline-block bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
              <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-primary" />
              </div>
              <p className="text-slate-900 font-semibold text-lg mb-2">
                Still have questions?
              </p>
              <p className="text-slate-600 mb-6">
                Our support team is here to help you
              </p>
              <a
                href="/contactPage"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                <MessageCircle className="w-5 h-5" />
                Contact Support Team
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default FAQSection;
