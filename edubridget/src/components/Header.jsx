import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold bg-primary-gradient bg-clip-text text-transparent">
                EDUBRIDGE
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
              <LanguageSwitcher />
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

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-primary hover:bg-slate-50" onClick={() => setIsOpen(false)}>Home</Link>
            
            {/* Mobile Dropdowns */}
            {['About', 'Academics', 'Global Opportunities', 'Resources', 'Media'].map((section) => (
              <div key={section}>
                <button
                  onClick={() => toggleDropdown(section)}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base text-gray-700 hover:text-primary hover:bg-slate-50"
                >
                  {section === 'About' && t('nav.about')}
                  {section === 'Academics' && t('nav.academics')}
                  {section === 'Global Opportunities' && t('nav.global')}
                  {section === 'Resources' && t('nav.resources')}
                  {section === 'Media' && t('nav.media')}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === section ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === section && (
                  <div className="pl-4 space-y-1 bg-slate-50 rounded-md">
                    {section === 'About' && (
                      <>
                        <Link to="/aboutUsPage" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('about.about_us')}</Link>
                        <Link to="/branches" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('about.branches')}</Link>
                        <Link to="/partners" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('about.partners')}</Link>
                      </>
                    )}
                    {section === 'Academics' && (
                      <>
                        {/* Original links - kept for future use */}
                        {/* <Link to="/coursesPage" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('academics.high_school')}</Link> */}
                        {/* <Link to="/coursesPage?filter=university" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('academics.masters')}</Link> */}
                        {/* <Link to="/coursesPage" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('academics.online')}</Link> */}
                        
                        {/* New Coming Soon links */}
                        <Link to="/coming-soon?filter=High School Curriculum" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('academics.high_school')}</Link>
                        <Link to="/coming-soon?filter=Master's Programs" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('academics.masters')}</Link>
                        <Link to="/coming-soon?filter=Online Learning" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('academics.online')}</Link>
                      </>
                    )}
                    {section === 'Global Opportunities' && (
                      <>
                        <Link to="/study-abroad" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('global.study_abroad')}</Link>
                        <Link to="/visa-consultation" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('global.visa')}</Link>
                      </>
                    )}
                    {section === 'Resources' && (
                      <>
                        <Link to="/library" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('resources.library')}</Link>
                        <Link to="/scholarships" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('resources.scholarships')}</Link>
                      </>
                    )}
                     {section === 'Media' && (
                      <>
                        <Link to="/blogs" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('media.blogs')}</Link>
                        <Link to="/gallery" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>{t('media.gallery')}</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            <Link to="/contactPage" className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-primary hover:bg-slate-50" onClick={() => setIsOpen(false)}>{t('nav.contact')}</Link>
            
             <div className="px-3 py-2">
                 <LanguageSwitcher />
             </div>

            <div className="pt-4 pb-2">
              <Link to="/signin" className="block w-full text-center px-3 py-2 rounded-md text-base bg-primary text-white hover:bg-primary-dark" onClick={() => setIsOpen(false)}>
                {t('nav.sign_in')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default React.memo(Navigation);
