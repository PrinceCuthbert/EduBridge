import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faComments,
  faQuestionCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import FAQSection from "../../components/FAQSection";
import { faqs } from "../../data/faqData";

function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-primary-gradient">
        <div className="absolute top-0 left-0 -translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 font-serif">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Have questions or need assistance? We're here to help you on your educational journey.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Phone Card */}
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faPhone} className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Phone</h3>
              <a href="tel:+250123456789" className="text-primary hover:text-primary-dark font-medium block mb-2">
                +250 12 345 6789
              </a>
              <p className="text-sm text-slate-600">Monday to Friday, 9am to 5pm EAT</p>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
              <a href="mailto:info@edubridge.com" className="text-primary hover:text-primary-dark font-medium block mb-2">
                info@edubridge.com
              </a>
              <p className="text-sm text-slate-600">We'll respond within 24 hours</p>
            </div>

            {/* Office Card */}
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Office</h3>
              <p className="text-primary font-medium mb-2">123 Education Street, Kigali, Rwanda</p>
              <p className="text-sm text-slate-600">Come say hello at our headquarters</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Support Options */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Message Form */}
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 font-serif">Send Us a Message</h2>
              <p className="text-slate-600 mb-8">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <textarea
                  placeholder="Your message..."
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Support Options */}
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 font-serif">Support Options</h2>
              <p className="text-slate-600 mb-8">
                We offer multiple ways to get the support you need for a smooth learning experience.
              </p>

              <div className="space-y-6">
                {/* Live Chat */}
                <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faComments} className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Live Chat</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Chat with our support team in real-time for immediate assistance.
                    </p>
                    <a href="#" className="text-primary hover:text-primary-dark font-medium text-sm">
                      Start a chat →
                    </a>
                  </div>
                </div>

                {/* Help Center */}
                <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faQuestionCircle} className="text-xl text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Help Center</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Browse our comprehensive knowledge base for tutorials and guides.
                    </p>
                    <a href="#" className="text-secondary hover:text-secondary-dark font-medium text-sm">
                      Visit help center →
                    </a>
                  </div>
                </div>

                {/* Scheduled Call */}
                <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faClock} className="text-xl text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Scheduled Call</h4>
                    <p className="text-sm text-slate-600 mb-3">
                      Book a call with our support team at your convenient time.
                    </p>
                    <a href="#" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                      Schedule a call →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 font-serif">
              Find Us
            </h2>
            <p className="text-slate-600">Visit our headquarters in Kigali, Rwanda</p>
          </div>

          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5160815956!2d30.058480315!3d-1.9440726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4258ed8e797%3A0xe9b1d4d3b1d4d3b1!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
