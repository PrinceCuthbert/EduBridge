import React, { useEffect } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Send
} from "lucide-react";
import { motion } from 'framer-motion';

import { faqs } from "../../data/faqData";
import FAQSection from "../../components/FAQSection";

function ContactPage() {
  const { t } = useTranslation();
  const [state, handleSubmit] = useForm("mwvvkzkj");

  useEffect(() => {
    if (state.succeeded) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.succeeded]);

  const regionalOffices = t('contact.regional_offices', { returnObjects: true });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Get In Touch Hero Section */}
      <section className="relative py-16 md:py-20 text-center text-white overflow-hidden bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#1A237E]">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-yellow-500 text-2xl">◆</span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('contact.hero_title')}
              </h1>
              <span className="text-yellow-500 text-2xl">◆</span>
            </div>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              {t('contact.hero_subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* How Can We Help? Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("contact.help_title")}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {t("contact.help_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Call Us Card */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
               className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center hover:shadow-xl transition-all"
             >
               <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Phone className="text-[#1A237E]" size={28} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">{t("contact.call_card.title")}</h3>
               <p className="text-sm text-slate-500 mb-4">{t("contact.call_card.desc")}</p>
               <a href="tel:+250788123456" className="text-[#1A237E] font-semibold text-sm hover:underline">
                 + (250) 788 123 456
               </a>
               <button className="mt-4 w-full py-3 bg-gradient-to-r from-[#1A237E] via-[#283593] to-[#1A237E] hover:from-[#283593] hover:to-[#1A237E] text-white font-bold rounded-lg transition-all shadow-md">
                 {t("contact.call_card.button")}
               </button>
             </motion.div>

             {/* Email Us Card */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.1 }}
               className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center hover:shadow-xl transition-all"
             >
               <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Mail className="text-[#1A237E]" size={28} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">{t("contact.email_card.title")}</h3>
               <p className="text-sm text-slate-500 mb-4">{t("contact.email_card.desc")}</p>
               <a href="mailto:info@edubridge.africa" className="text-[#1A237E] font-semibold text-sm hover:underline">
                 info@edubridge.africa
               </a>
               <button className="mt-4 w-full py-3 bg-gradient-to-r from-[#1A237E] via-[#283593] to-[#1A237E] hover:from-[#283593] hover:to-[#1A237E] text-white font-bold rounded-lg transition-all shadow-md">
                 {t("contact.email_card.button")}
               </button>
             </motion.div>

             {/* Live Chat Card */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center hover:shadow-xl transition-all"
             >
               <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <MessageCircle className="text-[#1A237E]" size={28} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">{t("contact.live_chat.title")}</h3>
               <p className="text-sm text-slate-500 mb-4">{t("contact.live_chat.desc")}</p>
               <p className="text-[#1A237E] font-semibold text-sm">
                 {t("contact.live_chat.available")}
               </p>
               <button 
                 onClick={() => window.open('https://wa.me/250798697809', '_blank')}
                 className="mt-4 w-full py-3 bg-gradient-to-r from-[#1A237E] via-[#283593] to-[#1A237E] hover:from-[#283593] hover:to-[#1A237E] text-white font-bold rounded-lg transition-all shadow-md"
               >
                 {t("contact.live_chat.button")}
               </button>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Form and Offices Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
            
            {/* Send Us a Message */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t("contact.form_title")}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {state.succeeded && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                    <p className="text-green-700 font-medium text-center">
                      {t('contact.form_success')}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">{t("contact.labels.full_name")}</label>
                    <input
                      name="fullName"
                      type="text"
                      placeholder={t("contact.placeholders.full_name")}
                      required
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-[#1A237E] outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">{t("contact.labels.email")}</label>
                    <input
                      name="email"
                      type="email"
                      placeholder={t("contact.placeholders.email")}
                      required
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-[#1A237E] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">{t("contact.labels.phone")}</label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder={t("contact.placeholders.phone")}
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-[#1A237E] outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">{t("contact.labels.subject")}</label>
                    <input
                      name="subject"
                      type="text"
                      placeholder={t("contact.placeholders.subject")}
                      required
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1A237E] focus:border-[#1A237E] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">{t("contact.labels.message")}</label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder={t("contact.placeholders.message")}
                    required
                    disabled={state.submitting}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full py-4 bg-gradient-to-r from-[#1A237E] via-[#283593] to-[#1A237E] hover:from-[#283593] hover:to-[#1A237E] text-white font-bold rounded-lg shadow-lg transform transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <Send size={18} />
                  {state.submitting ? t("contact.sending") : t("contact.submit_button")}
                </button>
              </form>
            </div>

            {/* Visit Our Offices */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t("contact.offices.title")}
              </h2>

              <div className="space-y-5">
                {regionalOffices && regionalOffices.map((office, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="text-[#1A237E]" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{office.country}</h3>
                        <p className="text-sm text-slate-500">{office.address}</p>
                      </div>
                    </div>
                    
                    <div className="pl-13 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={16} className="text-slate-400" />
                        <span className="text-slate-600">{office.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-slate-600">{office.hours}</span>
                      </div>
                    </div>
                    
                    <button className="mt-4 w-full py-2.5 border-2 border-[#1A237E] text-[#1A237E] font-bold rounded-lg hover:bg-blue-50 transition-colors">
                      {t("contact.offices.get_directions")}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection 
        faqs={faqs} 
        title={t('contact.faq.title')}
        subtitle={t('contact.faq.subtitle')}
        showContactBtn={false}
      />
    </div>
  );
}

export default ContactPage;
