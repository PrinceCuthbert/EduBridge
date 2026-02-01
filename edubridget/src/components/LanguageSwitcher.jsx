import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'sw', label: 'Kiswahili', flag: '🇰🇪' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group">
      <button 
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary transition-colors font-medium rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Change Language"
        aria-haspopup="true"
      >
        <Globe size={18} />
        <span className="uppercase">{i18n.language?.split('-')[0] || 'EN'}</span>
      </button>

      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors ${
              i18n.language === lang.code ? 'text-primary font-bold bg-slate-50' : 'text-gray-700'
            }`}
             aria-current={i18n.language === lang.code ? 'true' : undefined}
          >
            <span className="text-lg" aria-hidden="true">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
