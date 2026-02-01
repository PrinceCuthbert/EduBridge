import React, { useEffect } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  MessageSquare
} from "lucide-react";

import { faqs } from "../../data/faqData";
import FAQSection from "../../components/FAQSection";


const socialIconMap = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin
};

function ContactPage() {
  const { t } = useTranslation();
  const [state, handleSubmit] = useForm("mwvvkzkj"); // Keep existing form ID

  // Auto-hide success message after 5 seconds and reset form
  useEffect(() => {
    if (state.succeeded) {
      const timer = setTimeout(() => {
        window.location.reload(); // Reload to reset form and hide message
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [state.succeeded]);

  const regionalOffices = t('contact.regional_offices', { returnObjects: true });
  const socialLinks = t('contact.social_links', { returnObjects: true });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Configure Header Hero Section - Modern & Clean */}
      <section className="bg-primary-gradient py-20 text-center text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-white">{t('contact.hero_title')}</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t('contact.hero_subtitle')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('contact.form_title')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {state.succeeded && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                    <p className="text-green-700 font-medium text-center">
                      {t('contact.form_success')}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('contact.labels.full_name')} *</label>
                    <input
                      name="fullName"
                      type="text"
                      placeholder={t('contact.placeholders.full_name')}
                      required
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                    />
                    <ValidationError prefix="Name" field="fullName" errors={state.errors} className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('contact.labels.email')} *</label>
                    <input
                      name="email"
                      type="email"
                      placeholder={t('contact.placeholders.email')}
                      required
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('contact.labels.phone')}</label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder={t('contact.placeholders.phone')}
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">{t('contact.labels.subject')} *</label>
                    <input
                      name="subject"
                      type="text"
                      placeholder={t('contact.placeholders.subject')}
                      required
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                    />
                     <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('contact.labels.message')} *</label>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder={t('contact.placeholders.message')}
                    required
                    disabled={state.submitting}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all disabled:opacity-50"
                  ></textarea>
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={state.submitting}
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <MessageCircle size={20} />
                  {state.submitting ? t('contact.sending') : t('contact.submit_button')}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Info */}
          <div className="space-y-6">
            
            {/* Get in Touch */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">{t('contact.sidebar.get_in_touch')}</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{t('contact.sidebar.head_office')}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">KG 123 St, Nyarugenge, Kigali, Rwanda</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{t('contact.sidebar.phone')}</p>
                    <a href="tel:+250788123456" className="text-sm text-slate-500 hover:text-primary transition-colors">+250 788 123 456</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{t('contact.sidebar.email')}</p>
                    <a href="mailto:info@edubridge.africa" className="text-sm text-slate-500 hover:text-primary transition-colors">info@edubridge.africa</a>
                  </div>
                </div>

                 <div className="flex gap-4">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{t('contact.sidebar.working_hours')}</p>
                    <p className="text-sm text-slate-500">{t('contact.sidebar.working_hours_details')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Offices */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
               <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">{t('contact.regional_offices_title')}</h3>
               <div className="space-y-4">
                 {regionalOffices && regionalOffices.map((office, idx) => (
                   <div key={idx} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                     <p className="text-sm font-bold text-slate-700">{office.country}</p>
                     <p className="text-xs text-slate-500">{office.phone}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* Follow Us */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">{t('contact.follow_us')}</h3>
              <div className="flex gap-3">
                {socialLinks && socialLinks.map((social, i) => {
                  const Icon = socialIconMap[social.iconKey] || Facebook; 
                  return (
                    <a key={i} href={social.href} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${social.colorClass}`}>
                      <Icon size={18} />
                    </a>
                  )
                })}
              </div>
            </div>

            
           <div className="bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-white">{t('contact.live_chat.title')}</h3>
                <p className="text-white/80 text-sm mb-6 ">
                  {t('contact.live_chat.subtitle')}
                </p>
                <button 
                  onClick={() => window.open('https://wa.me/250798697809', '_blank')}
                  className="px-6 py-2 bg-secondary text-white font-bold rounded-lg text-sm hover:bg-secondary-dark transition-colors shadow-md w-full"
                >
                  {t('contact.live_chat.button')}
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
      
      {/* Bottom CTA */}
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
