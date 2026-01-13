import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'react-feather';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/coursesPage' },
    { name: 'Resources', path: '/resourcesPage' },
    { name: 'Membership', path: '/membershipPage' },
    { name: 'About', path: '/AboutUsPage' },
    { name: 'Contact', path: '/contactPage' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <img src="/vite.svg" alt="Logo" className="w-6 h-6 invert brightness-0" />
          </div>
          <h1 className={`text-2xl font-extrabold bg-clip-text text-transparent ${
            scrolled ? 'bg-primary-gradient' : 'bg-white'
          }`}>
            EduBridge
          </h1>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-8 font-medium">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                   className={({ isActive }) =>
                    `relative transition-colors duration-300 ${
                      scrolled 
                        ? (isActive ? 'text-primary' : 'text-gray-600 hover:text-primary') 
                        : (isActive ? 'text-white' : 'text-white/80 hover:text-white')
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${
                          scrolled ? 'bg-primary' : 'bg-white'
                        }`} />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4 ml-4">
            <NavLink 
              to="/signin" 
              className={`px-5 py-2 font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-white/80'
              }`}
            >
              Login
            </NavLink>
            <NavLink 
              to="/signup" 
              className={`px-6 py-2 rounded-full font-medium transition-all active:scale-95 shadow-md ${
                scrolled 
                  ? 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark hover:shadow-lg' 
                  : 'bg-white text-primary shadow-black/10 hover:bg-slate-50 hover:shadow-xl'
              }`}
            >
              Sign Up
            </NavLink>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 bg-gradient-to-br from-primary via-primary-dark to-secondary transform transition-transform duration-500 ease-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col h-full pt-24 px-8 overflow-y-auto">
          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <li 
                  key={link.path}
                  className={`transform transition-all duration-500 ${
                    menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-lg transition-all ${
                        isActive 
                          ? 'bg-white text-primary shadow-lg' 
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`w-2 h-2 rounded-full transition-all ${
                          isActive ? 'bg-primary scale-100' : 'bg-white/40 scale-0'
                        }`} />
                        {link.name}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Auth Buttons */}
          <div 
            className={`mt-8 mb-8 flex flex-col gap-4 transform transition-all duration-500 ${
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <NavLink 
              to="/signin" 
              className="w-full py-4 text-center text-white font-bold border-2 border-white/30 rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all active:scale-95"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
            <NavLink 
              to="/signup" 
              className="w-full py-4 text-center bg-white text-primary font-bold rounded-2xl shadow-2xl shadow-black/20 hover:shadow-3xl hover:scale-105 transition-all active:scale-95"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
