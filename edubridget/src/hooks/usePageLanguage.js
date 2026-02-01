import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to manage the document's language and direction attributes.
 * Updates the <html> tag's 'lang' and 'dir' attributes accessible to screen readers.
 */
const usePageLanguage = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Get current language (default to 'en' if undefined)
    const currentLang = i18n.language || 'en';
    
    // Update the HTML lang attribute
    document.documentElement.lang = currentLang;
    
    // Update the direction (ltr/rtl) based on language
    document.documentElement.dir = i18n.dir(currentLang);
    
  }, [i18n.language]);
};

export default usePageLanguage;
