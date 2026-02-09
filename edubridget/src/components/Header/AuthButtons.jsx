import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../context/AuthContext';

/**
 * Auth Buttons Component
 * Displays sign-in button or user profile dropdown with click-outside handler
 */
const AuthButtons = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isProfileOpen) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileOpen]);

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
    setIsProfileOpen(false);
    navigate('/signin');
  };

  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="relative ml-4" ref={profileRef}>
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full p-1 transition-all"
        aria-expanded={isProfileOpen}
        aria-haspopup="true"
      >
        <img 
          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`} 
          alt="Profile" 
          className="h-8 w-8 rounded-full border border-slate-200"
        />
        <ChevronDown 
          size={14} 
          className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 animate-in fade-in slide-in-from-top-2 z-50">
          <div className="px-4 py-2 border-b border-slate-50">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
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

export default AuthButtons;
