import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

/**
 * Desktop Menu Item Component
 * Handles both simple links and dropdown menus
 */
const DesktopMenuItem = ({ item }) => {
  const { t } = useTranslation();

  if (item.type === "link") {
    return (
      <Link
        to={item.path}
        className="text-sm text-gray-700 hover:text-primary transition-colors font-medium">
        {t(item.labelKey)}
      </Link>
    );
  }

  if (item.type === "dropdown") {
    return (
      <div className="relative group">
        <button className="flex items-center text-sm text-gray-700 hover:text-primary transition-colors font-medium">
          {t(item.labelKey)}
          <ChevronDown className="ml-1 h-3 w-3" />
        </button>
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 z-50">
          {item.items.map((subItem) => (
            <Link
              key={subItem.path}
              to={subItem.path}
              className="block px-4 py-2 text-xs text-gray-700 hover:bg-slate-50 hover:text-primary">
              {t(subItem.labelKey)}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default DesktopMenuItem;
