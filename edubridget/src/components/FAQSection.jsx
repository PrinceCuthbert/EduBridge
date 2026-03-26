import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, CheckCircle, Star } from "lucide-react";

function FAQSection({
  faqs,
  title = "Looking for Quick Answers?",
  subtitle = "Check our frequently asked questions for immediate help.",
  showContactBtn = true,
}) {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">

          {/* ── LEFT COLUMN: FAQ Accordion ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-10">
              <span className="inline-block text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-slate-500 text-base leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Accordion Items */}
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.07 }}
                >
                  <div
                    className={`group rounded-2xl border-2 transition-all duration-300 ${
                      openFAQ === index
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-slate-200 bg-white hover:border-primary/40 hover:shadow-md"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Number badge */}
                        <span
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            openFAQ === index
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-semibold text-base transition-colors ${
                            openFAQ === index ? "text-primary" : "text-slate-800"
                          }`}
                        >
                          {faq.question}
                        </span>
                      </div>

                      {/* Animated chevron */}
                      <motion.div
                        animate={{ rotate: openFAQ === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-colors ${
                            openFAQ === index ? "text-primary" : "text-slate-400"
                          }`}
                        />
                      </motion.div>
                    </button>

                    {/* Answer */}
                    <AnimatePresence initial={false}>
                      {openFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pl-[4.5rem]">
                            <p className="text-slate-600 leading-relaxed text-sm">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            {showContactBtn && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">Still have questions?</p>
                  <p className="text-slate-500 text-xs">Our team is ready to help you</p>
                </div>
                <a
                  href="/contactPage"
                  className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Contact Us
                </a>
              </motion.div>
            )}
          </motion.div>

          {/* ── RIGHT COLUMN: Graduation Image Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex items-center justify-center"
          >
            {/* Dark card — its bg absorbs the image's black background naturally */}
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800">
              {/* Subtle inner glow at the top */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-500/10 to-transparent z-10 pointer-events-none" />

              <img
                src="/graduation.jpeg"
                alt="EduBridge graduates celebrating"
                className="w-full object-cover mix-blend-luminosity opacity-90"
              />

              {/* Bottom gradient so the card fades cleanly */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/70 to-transparent pointer-events-none" />
            </div>

            {/* Floating badge — bottom left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute bottom-5 left-5 z-30 bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-slate-900 font-bold text-sm leading-none">98%</p>
                <p className="text-slate-500 text-xs mt-0.5">Scholarship Guarantee Rate</p>
              </div>
            </motion.div>

            {/* Floating badge — top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, duration: 0.4 }}
              className="absolute top-5 right-5 z-30 bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-100 flex items-center gap-3"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-slate-900 font-bold text-sm leading-none">500+</p>
                <p className="text-slate-500 text-xs mt-0.5">Students Placed Abroad</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default FAQSection;
