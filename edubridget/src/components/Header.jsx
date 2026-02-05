import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, User, LogOut, LayoutDashboard,
  Home, Info, GraduationCap, Globe, BookOpen, 
  Image, Phone, MapPin, Users, Award, Building2,
  Plane, FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

const AuthButtons = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <Link to="/signin">
        <Button size="sm" className="bg-primary hover:bg-primary-dark text-white font-medium text-xs px-4">
          {t('nav.sign_in')}
        </Button>
      </Link>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="relative ml-4">
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <img 
          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`} 
          alt="Profile" 
          className="h-8 w-8 rounded-full border border-slate-200"
        />
        <ChevronDown size={14} className="text-slate-500" />
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 animate-in fade-in slide-in-from-top-2">
           <div className="px-4 py-2 border-b border-slate-50">
             <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
             <p className="text-xs text-slate-500 truncate">{user?.role}</p>
           </div>
           
           <Link 
             to={dashboardLink}
             className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
             onClick={() => setIsProfileOpen(false)}
           >
             <LayoutDashboard size={16} /> Dashboard
           </Link>
           
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
           >
             <LogOut size={16} /> Sign Out
           </button>
        </div>
      )}
    </div>
  );
};

const Navigation = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white/30 shadow-soft sticky top-0 z-[60]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Curved Arc Icon */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  {/* Outer arc */}
                  <path
                    d="M 8 40 Q 24 8, 40 40"
                    fill="none"
                    stroke="url(#gradient1)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Inner arc */}
                  <path
                    d="M 12 38 Q 24 14, 36 38"
                    fill="none"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e40af" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#93c5fd" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Text Content */}
              <div className="flex flex-col -space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[26px] font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight leading-none">
                    EduBridge
                  </span>
                </div>
                {/* <span className="text-[9px] font-semibold text-gray-500 tracking-[0.15em] uppercase">
                  Educational Services
                </span> */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-[2px] w-6 bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                  <span className="text-[10px] font-medium text-primary italic">
                    Bridging Dreams
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/" className="text-sm text-gray-700 hover:text-primary transition-colors font-medium">
              {t('nav.home')}
            </Link>

            <div className="relative group">
              <button className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors font-medium">
                {t('nav.about')} <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <Link to="/aboutUsPage" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('about.about_us')}</Link>
                <Link to="/branches" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('about.branches')}</Link>
                <Link to="/partners" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('about.partners')}</Link>
              </div>
            </div>

            {/* Academics Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors font-medium">
                {t('nav.academics')} <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                {/* Original links - kept for future use */}
                {/* <Link to="/coursesPage" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('academics.high_school')}</Link> */}
                {/* <Link to="/coursesPage?filter=university" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('academics.masters')}</Link> */}
                {/* <Link to="/coursesPage" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('academics.online')}</Link> */}
                
                {/* New Coming Soon links */}
                <Link to="/coming-soon?filter=High School Curriculum" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('academics.high_school')}</Link>
                <Link to="/coming-soon?filter=Master's Programs" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('academics.masters')}</Link>
                <Link to="/coming-soon?filter=Online Learning" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('academics.online')}</Link>
              </div>
            </div>

            {/* Global Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors font-medium">
                {t('nav.global')} <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <Link to="/study-abroad" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('global.study_abroad')}</Link>
                <Link to="/visa-consultation" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('global.visa')}</Link>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors font-medium">
                {t('nav.resources')} <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <Link to="/library" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('resources.library')}</Link>
                <Link to="/scholarships" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('resources.scholarships')}</Link>
              </div>
            </div>

            {/* Media Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors font-medium">
                {t('nav.media')} <ChevronDown className="ml-1 h-3 w-3" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                 <Link to="/blogs" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('media.blogs')}</Link>
                 <Link to="/gallery" className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">{t('media.gallery')}</Link>
              </div>
            </div>

            <Link to="/contactPage" className="text-sm text-gray-700 hover:text-primary transition-colors font-medium">
              {t('nav.contact')}
            </Link>

            {/* ... */}
            {/* Language Switcher */}
             <div className="hidden lg:block">
              <LanguageSwitcher isMobile={false} />
            </div>

            {/* Auth Button / Profile Menu */}
            <AuthButtons />
          </div>
{/* ... */}

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Premium Mobile Navigation Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Darker Backdrop: Ensures the menu captures attention */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* The Drawer: Uses 'fixed' and 'h-screen' to prevent content overflow */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl z-[110] lg:hidden flex flex-col"
            >
              {/* Header: Centered Logo & Brand */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="relative w-10 h-10 flex-shrink-0"
                  >
                    <svg viewBox="0 0 48 48" className="w-full h-full">
                      <path d="M 8 40 Q 24 8, 40 40" fill="none" stroke="url(#gradientMobile1)" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 12 38 Q 24 14, 36 38" fill="none" stroke="url(#gradientMobile2)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                      <defs>
                        <linearGradient id="gradientMobile1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#1e40af" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="gradientMobile2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#93c5fd" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-xl font-extrabold text-primary tracking-tight">EduBridge</span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest italic">Bridging Dreams</span>
                  </div>
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                  <X size={24} className="text-slate-600" />
                </button>
              </div>

              {/* Scrollable Navigation Area with Icons */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <nav className="space-y-2">
                  {/* Home Link */}
                  <Link 
                    to="/" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 text-slate-700 font-semibold rounded-2xl hover:bg-primary/5 hover:text-primary transition-all"
                  >
                    <Home size={20} className="text-primary flex-shrink-0" />
                    <span className="text-base">{t('nav.home')}</span>
                  </Link>

                  {/* About Dropdown */}
                  <div>
                    <button
                      onClick={() => toggleDropdown('About')}
                      className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-700 font-semibold hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Info size={20} className="text-primary flex-shrink-0" />
                        <span className="text-base">{t('nav.about')}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: openDropdown === 'About' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} className="text-slate-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openDropdown === 'About' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 mt-1 ml-4 pl-8 border-l-2 border-slate-100">
                            <Link to="/aboutUsPage" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              <Users size={16} className="flex-shrink-0" />
                              {t('about.about_us')}
                            </Link>
                            <Link to="/branches" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              <MapPin size={16} className="flex-shrink-0" />
                              {t('about.branches')}
                            </Link>
                            <Link to="/partners" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              <Building2 size={16} className="flex-shrink-0" />
                              {t('about.partners')}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Academics Dropdown */}
                  <div>
                    <button
                      onClick={() => toggleDropdown('Academics')}
                      className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-700 font-semibold hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <GraduationCap size={20} className="text-primary flex-shrink-0" />
                        <span className="text-base">{t('nav.academics')}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: openDropdown === 'Academics' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} className="text-slate-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openDropdown === 'Academics' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 mt-1 ml-4 pl-8 border-l-2 border-slate-100">
                            <Link to="/coming-soon?filter=High School Curriculum" onClick={() => setIsOpen(false)} className="block p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              {t('academics.high_school')}
                            </Link>
                            <Link to="/coming-soon?filter=Master's Programs" onClick={() => setIsOpen(false)} className="block p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              {t('academics.masters')}
                            </Link>
                            <Link to="/coming-soon?filter=Online Learning" onClick={() => setIsOpen(false)} className="block p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              {t('academics.online')}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Global Opportunities Dropdown */}
                  <div>
                    <button
                      onClick={() => toggleDropdown('Global')}
                      className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-700 font-semibold hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Globe size={20} className="text-primary flex-shrink-0" />
                        <span className="text-base">{t('nav.global')}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: openDropdown === 'Global' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} className="text-slate-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openDropdown === 'Global' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 mt-1 ml-4 pl-8 border-l-2 border-slate-100">
                            <Link to="/study-abroad" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              <Plane size={16} className="flex-shrink-0" />
                              {t('global.study_abroad')}
                            </Link>
                            <Link to="/visa-consultation" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              <FileCheck size={16} className="flex-shrink-0" />
                              {t('global.visa')}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Resources Dropdown */}
                  <div>
                    <button
                      onClick={() => toggleDropdown('Resources')}
                      className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-700 font-semibold hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <BookOpen size={20} className="text-primary flex-shrink-0" />
                        <span className="text-base">{t('nav.resources')}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: openDropdown === 'Resources' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} className="text-slate-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openDropdown === 'Resources' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 mt-1 ml-4 pl-8 border-l-2 border-slate-100">
                            <Link to="/library" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              <BookOpen size={16} className="flex-shrink-0" />
                              {t('resources.library')}
                            </Link>
                            <Link to="/scholarships" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              <Award size={16} className="flex-shrink-0" />
                              {t('resources.scholarships')}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Media Dropdown */}
                  <div>
                    <button
                      onClick={() => toggleDropdown('Media')}
                      className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-700 font-semibold hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Image size={20} className="text-primary flex-shrink-0" />
                        <span className="text-base">{t('nav.media')}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: openDropdown === 'Media' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} className="text-slate-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openDropdown === 'Media' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-1 mt-1 ml-4 pl-8 border-l-2 border-slate-100">
                            <Link to="/blogs" onClick={() => setIsOpen(false)} className="block p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              {t('media.blogs')}
                            </Link>
                            <Link to="/gallery" onClick={() => setIsOpen(false)} className="block p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                              {t('media.gallery')}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Contact Link */}
                  <Link 
                    to="/contactPage" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 text-slate-700 font-semibold rounded-2xl hover:bg-primary/5 hover:text-primary transition-all"
                  >
                    <Phone size={20} className="text-primary flex-shrink-0" />
                    <span className="text-base">{t('nav.contact')}</span>
                  </Link>
                </nav>
              </div>

              {/* Footer Action: Fixed High-Contrast Buttons */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3 sticky bottom-0">
                <div className="px-2 mb-3">
                  <LanguageSwitcher isMobile={true} />
                </div>
                <Link 
                  to="/signin" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                >
                  <User size={18} /> {t('nav.sign_in')}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default React.memo(Navigation);
