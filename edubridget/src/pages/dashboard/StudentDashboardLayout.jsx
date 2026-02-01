
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, ChevronLeft, User, LogOut } from 'lucide-react';

export default function StudentDashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Student Dashboard Header */}
      <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Side: Back & Title */}
        <div className="flex items-center gap-4">
           {/* Optional: Add logic to go back if needed, or just link to home */}
           <Link to="/" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Back to Home">
             <ChevronLeft size={20} />
           </Link>
           <h1 className="text-xl font-bold text-slate-800">Student Dashboard</h1>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors relative">
             <Bell size={20} />
             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
             <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-slate-800">{user?.name || 'Student'}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
             </div>
             <div className="relative group">
                <img 
                  src={user?.avatar || "https://ui-avatars.com/api/?name=Student"} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full border border-slate-200 cursor-pointer" 
                />
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                   <div className="p-2">
                      <Link to="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors">
                        <User size={16} /> Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
         <Outlet />
      </main>
    </div>
  );
}
