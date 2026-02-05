import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSwitcher = ({ isMobile = false }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'sw', label: 'Kiswahili', flag: '🇰🇪' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLang = languages.find(lang => lang.code === i18n.language?.split('-')[0]) || languages[0];

  return (
    <div className="relative">
      {/* Language Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 text-sm text-slate-700 hover:text-primary transition-colors font-medium rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          isMobile 
            ? 'justify-between w-full px-4 py-3 border border-slate-200' 
            : 'px-3 py-2'
        }`}
        aria-label="Change Language"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-primary" />
          <span className="font-semibold">{currentLang.label}</span>
        </div>
        {isMobile ? (
          <span className="text-xl">{currentLang.flag}</span>
        ) : (
          <ChevronDown size={16} className="text-slate-400" />
        )}
      </button>

      {/* Language Popup - Upward for mobile, Downward for desktop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - only for mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 lg:hidden"
                onClick={() => setIsOpen(false)}
              />
            )}
            
            {/* Language Stack */}
            <motion.div
              initial={{ opacity: 0, y: isMobile ? 20 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: isMobile ? 20 : -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 ${
                isMobile 
                  ? 'bottom-full mb-2' 
                  : 'top-full mt-2 min-w-[180px]'
              }`}
              onMouseLeave={() => !isMobile && setIsOpen(false)}
            >
              <div className="p-2 space-y-1">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, y: isMobile ? 10 : 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: isMobile ? index * 0.05 : 0, duration: 0.2 }}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between rounded-lg transition-all ${
                      i18n.language?.split('-')[0] === lang.code 
                        ? 'bg-primary text-white font-bold shadow-md' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    aria-current={i18n.language?.split('-')[0] === lang.code ? 'true' : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl" aria-hidden="true">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                    </div>
                    {i18n.language?.split('-')[0] === lang.code && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-xs"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
