import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Send,
} from "react-feather";
import { useTranslation } from "react-i18next";

// Map string keys from JSON to actual components
const iconMap = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};

const Footer = () => {
  const { t } = useTranslation();

  // Get dynamic data from JSON
  const explore = t("footer.explore", { returnObjects: true });
  const academics = t("footer.academics", { returnObjects: true });
  const socialLinks = t("footer.social_links", { returnObjects: true });

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          {/* Branding Section */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10">
                <img
                  src="/tmlogo.jpg"
                  alt="TM EduBridge Logo"
                  className="w-full h-full rounded-full object-cover ring-2 ring-primary/30"
                />
              </div>
              <h2 className="text-2xl font-bold text-white">TM EduBridge</h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t("footer.brand.description")}
            </p>
            <div className="flex items-center gap-4">
              {socialLinks &&
                socialLinks.map((social, i) => {
                  const Icon = iconMap[social.iconKey] || Facebook;
                  return (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                      <Icon size={20} />
                    </a>
                  );
                })}
            </div>
          </div>

          {/* Two-column grid on mobile for Explore and Academics */}
          <div className="grid grid-cols-2 md:contents gap-8">
            {/* Explore Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider text-sm">
                {t("footer.explore_title")}
              </h3>
              <ul className="space-y-3">
                {explore &&
                  explore.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className="hover:text-primary transition-colors duration-300 flex items-center gap-2 group text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Academics Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider text-sm">
                {t("footer.academics_title")}
              </h3>
              <ul className="space-y-3">
                {academics &&
                  academics.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className="hover:text-primary transition-colors duration-300 flex items-center gap-2 group text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-wider text-sm">
              {t("footer.contact_title")}
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 text-primary">
                  <MapPin size={18} />
                </div>
                <p>{t("footer.contact_info.address")}</p>
              </li>
              <li className="flex items-center gap-4">
                <div className="text-primary">
                  <Phone size={18} />
                </div>
                <p>{t("footer.contact_info.phone")}</p>
              </li>
              <li className="flex items-center gap-4">
                <div className="text-primary">
                  <Mail size={18} />
                </div>
                <p>{t("footer.contact_info.email")}</p>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-8 uppercase tracking-wider text-sm">
              {t("footer.newsletter.title")}
            </h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              {t("footer.newsletter.description")}
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                aria-label={t("footer.newsletter.placeholder")}
                className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary transition-all text-white placeholder:text-slate-500"
              />
              <button
                className="absolute right-2 top-2 bottom-2 bg-primary text-white rounded-xl px-4 hover:bg-primary-dark transition-all"
                aria-label="Subscribe">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
