import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Mobile Menu Item Component
 * Handles both simple links and expandable dropdowns with icons
 */
const MobileMenuItem = ({ item, openDropdown, toggleDropdown, closeMenu }) => {
  const { t } = useTranslation();
  const Icon = item.icon;

  if (item.type === "link") {
    return (
      <Link
        to={item.path}
        onClick={closeMenu}
        className="flex items-center gap-4 p-4 text-slate-700 font-semibold rounded-2xl hover:bg-primary/5 hover:text-primary transition-all">
        {Icon && <Icon size={20} className="text-primary flex-shrink-0" />}
        <span className="text-base">{t(item.labelKey)}</span>
      </Link>
    );
  }

  if (item.type === "dropdown") {
    const isOpen = openDropdown === item.id;

    return (
      <div>
        <button
          onClick={() => toggleDropdown(item.id)}
          className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-700 font-semibold hover:bg-primary/5 hover:text-primary transition-all">
          <div className="flex items-center gap-4">
            {Icon && <Icon size={20} className="text-primary flex-shrink-0" />}
            <span className="text-base">{t(item.labelKey)}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}>
            <ChevronDown size={16} className="text-slate-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden">
              <div className="space-y-1 mt-1 ml-4 pl-8 border-l-2 border-slate-100">
                {item.items.map((subItem) => {
                  const SubIcon = subItem.icon;
                  return (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      onClick={closeMenu}
                      className="flex items-center gap-3 p-3 text-sm text-slate-600 hover:text-primary transition-colors rounded-xl hover:bg-slate-50">
                      {SubIcon && (
                        <SubIcon size={16} className="flex-shrink-0" />
                      )}
                      {t(subItem.labelKey)}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
};

export default MobileMenuItem;
