import React, { useEffect } from "react";
import { useForm, ValidationError } from "@formspree/react";
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

function ContactPage() {
  const [state, handleSubmit] = useForm("mwvvkzkj");

  // Auto-hide success message after 5 seconds and reset form
  useEffect(() => {
    if (state.succeeded) {
      const timer = setTimeout(() => {
        window.location.reload(); // Reload to reset form and hide message
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [state.succeeded]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Configure Header Hero Section - Modern & Clean */}
      <section className="bg-primary-gradient py-20 text-center text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Contact Us</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {state.succeeded && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                    <p className="text-green-700 font-medium text-center">
                      ✓ Thank you! We'll be in touch shortly.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input
                      name="fullName"
                      type="text"
                      placeholder="Your full name"
                      required
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                    />
                    <ValidationError prefix="Name" field="fullName" errors={state.errors} className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+250 7XX XXX XXX"
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Subject *</label>
                    <input
                      name="subject"
                      type="text"
                      placeholder="Select a subject"
                      required
                      disabled={state.submitting}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                    />
                     <ValidationError prefix="Subject" field="subject" errors={state.errors} className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Tell us how we can help you..."
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
                  {state.submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Info */}
          <div className="space-y-6">
            
            {/* Get in Touch */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Head Office</p>
                    <p className="text-sm text-slate-500 leading-relaxed">KG 123 St, Nyarugenge, Kigali, Rwanda</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Phone</p>
                    <a href="tel:+250788123456" className="text-sm text-slate-500 hover:text-primary transition-colors">+250 788 123 456</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Email</p>
                    <a href="mailto:info@edubridge.africa" className="text-sm text-slate-500 hover:text-primary transition-colors">info@edubridge.africa</a>
                  </div>
                </div>

                 <div className="flex gap-4">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Working Hours</p>
                    <p className="text-sm text-slate-500">Mon - Fri: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Offices */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
               <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Regional Offices</h3>
               <div className="space-y-4">
                 <div className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                   <p className="text-sm font-bold text-slate-700">Rwanda (HQ)</p>
                   <p className="text-xs text-slate-500">+250 788 123 456</p>
                 </div>
                 <div className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                   <p className="text-sm font-bold text-slate-700">Uganda</p>
                   <p className="text-xs text-slate-500">+256 772 123 456</p>
                 </div>
                 <div className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                   <p className="text-sm font-bold text-slate-700">Kenya</p>
                   <p className="text-xs text-slate-500">+254 722 123 456</p>
                 </div>
               </div>
            </div>

            {/* Follow Us */}
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, color: "text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-600" },
                  { icon: Twitter, color: "text-slate-600 bg-slate-100 hover:bg-sky-50 hover:text-sky-500" },
                  { icon: Instagram, color: "text-slate-600 bg-slate-100 hover:bg-pink-50 hover:text-pink-600" },
                  { icon: Linkedin, color: "text-slate-600 bg-slate-100 hover:bg-blue-100 hover:text-blue-700" }
                ].map((social, i) => (
                  <a key={i} href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${social.color}`}>
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            
           <div className="bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Live Chat</h3>
                <p className="text-white/80 text-sm mb-6">
                  Chat with our support team in real-time.
                </p>
                <button 
                  onClick={() => window.open('https://wa.me/250798697809', '_blank')}
                  className="px-6 py-2 bg-secondary text-white font-bold rounded-lg text-sm hover:bg-secondary-dark transition-colors shadow-md w-full"
                >
                  Start Chat
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
      
       {/* Bottom CTA */}
       <div className="py-16 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Looking for Quick Answers?</h2>
          <p className="text-slate-500 text-sm mb-6">Check our frequently asked questions for immediate help.</p>
          <button className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            View FAQs
          </button>
       </div>

    </div>
  );
}

export default ContactPage;
