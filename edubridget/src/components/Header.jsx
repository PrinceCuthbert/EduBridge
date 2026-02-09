import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import AuthButtons from './Header/AuthButtons';
import DesktopMenuItem from './Header/DesktopMenuItem';
import MobileMenuItem from './Header/MobileMenuItem';
import Logo from './Header/Logo';
import { menuConfig } from '../config/menuConfig';

/**
 * Main Navigation Component - Refactored and Modular
 * Reduced from 554 lines to ~150 lines by extracting components
 * 
 * Features:
 * - Centralized menu configuration
 * - Click-outside handler for profile dropdown (in AuthButtons)
 * - Modular desktop and mobile menu items
 * - Keyboard navigation (Escape key support)
 * - Responsive design with mobile drawer
 */
const Navigation = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white/30 shadow-soft sticky top-0 z-[60]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {menuConfig.map((item) => (
              <DesktopMenuItem key={item.id} item={item} />
            ))}

            {/* Language Switcher */}
            <div className="hidden lg:block">
              <LanguageSwitcher isMobile={false} />
            </div>

            {/* Auth Button / Profile Menu with click-outside handler */}
            <AuthButtons />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
              onClick={closeMenu}
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl z-[110] lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
                <Logo mobile onClick={closeMenu} />
                <button 
                  onClick={closeMenu} 
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-slate-600" />
                </button>
              </div>

              {/* Scrollable Navigation */}
              <div className="flex-1 overflow-y-auto modern-scrollbar-light px-4 py-6">
                <nav className="space-y-2">
                  {menuConfig.map((item) => (
                    <MobileMenuItem
                      key={item.id}
                      item={item}
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      closeMenu={closeMenu}
                    />
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3 sticky bottom-0">
                <div className="px-2 mb-3">
                  <LanguageSwitcher isMobile={true} />
                </div>
                <Link 
                  to="/signin" 
                  onClick={closeMenu}
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
};

export default React.memo(Navigation);
