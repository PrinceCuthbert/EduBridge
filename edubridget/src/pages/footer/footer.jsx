import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Send } from 'react-feather';

const Footer = () => {
  const quickLinks = [
    { name: "Courses", path: "/coursesPage" },
    { name: "Resources", path: "/resourcesPage" },
    { name: "Membership Plans", path: "/membershipPage" },
    { name: "About Us", path: "/AboutUsPage" },
    { name: "Contact Us", path: "/contactPage" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Branding Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <img src="/vite.svg" alt="Logo" className="w-6 h-6 invert brightness-0" />
              </div>
              <h2 className="text-2xl font-bold text-white">TM EduBridge</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empowering Africa through Knowledge. We provide quality education
              and resources to help students achieve their academic goals.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Facebook size={20} />, href: "#" },
                { icon: <Twitter size={20} />, href: "#" },
                { icon: <Instagram size={20} />, href: "https://www.instagram.com/tmedubridge/" },
                { icon: <Linkedin size={20} />, href: "#" },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 text-primary"><MapPin size={18} /></div>
                <p>123 Education Street, Kigali, Rwanda</p>
              </li>
              <li className="flex items-center gap-4">
                <div className="text-primary"><Phone size={18} /></div>
                <p>+250 12 345 6789</p>
              </li>
              <li className="flex items-center gap-4">
                <div className="text-primary"><Mail size={18} /></div>
                <p>info@edubridge.com</p>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-wider text-sm">Newsletter</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Subscribe to our newsletter for updates on new courses and resources.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-white placeholder:text-slate-500"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-primary text-white rounded-xl px-4 hover:bg-primary-dark transition-all">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} TM EduBridge. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
