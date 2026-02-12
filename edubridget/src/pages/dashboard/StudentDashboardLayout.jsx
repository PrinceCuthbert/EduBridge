import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Plane, 
  BookOpen, 
  Globe, 
  User, 
  LogOut, 
  Menu, 
  Bell, 
  Search, 
  MessageSquare,
  ChevronDown,
  X 
} from 'lucide-react';

export default function StudentDashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (path, currentState) => {
    setExpandedItems(prev => ({ ...prev, [path]: !currentState }));
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "My Applications", path: "/dashboard/applications", icon: FileText },
    { 
      label: "Visa Status", 
      path: "/dashboard/visa-status", 
      icon: Plane,
      subItems: [
        { label: "Summary", path: "/dashboard/visa-status/summary" },
        { label: "Request Consultation", path: "/dashboard/visa-status/request" },
      ]
    },
    { label: "Library", path: "/library", icon: BookOpen },
    { label: "Study Resources", path: "/dashboard/resources", icon: Globe },
    { label: "Profile Settings", path: "/dashboard/profile", icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
    const hasSubItems = item.subItems && item.subItems.length > 0;
    
    // Auto-expand if active, unless explicitly toggled by user
    const isExpanded = expandedItems[item.path] !== undefined 
      ? expandedItems[item.path] 
      : isActive;

    if (hasSubItems) {
      return (
        <div className="mb-1">
          <button
            onClick={() => toggleExpand(item.path, isExpanded)}
            className={`
              w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group
              ${isActive ? "text-white bg-white/5" : "text-slate-400 hover:bg-white/5 hover:text-white"}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className={isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white transition-colors"} />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
          </button>
          
          {/* Sub-items */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
            <div className="pl-10 pr-2 space-y-1">
              {item.subItems.map((subItem) => {
                 const isSubActive = location.pathname === subItem.path;
                 return (
                   <Link
                     key={subItem.path}
                     to={subItem.path}
                     onClick={() => setIsMobileOpen(false)}
                     className={`
                       block px-3 py-2 rounded-lg text-sm font-medium transition-colors
                       ${isSubActive ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:text-white hover:bg-white/5"}
                     `}
                   >
                     {subItem.label}
                   </Link>
                 )
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        to={item.path}
        onClick={() => setIsMobileOpen(false)}
        className={`
          flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group mb-1
          ${isActive 
            ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
            : "text-slate-400 hover:bg-white/5 hover:text-white"
          }
        `}
      >
        <item.icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"} />
        <span className="font-medium text-sm">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] bg-[#0F172A] text-slate-300
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
           <div className="w-8 h-8 bg-white rounded-lg mr-3 flex items-center justify-center">
              {/* Simple Logo Icon Placeholder */}
              <div className="w-4 h-4 bg-[#0F172A] rounded-sm" />
           </div>
           <span className="text-white font-bold text-lg tracking-tight">EduBridge Student</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 overflow-y-auto space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* User Profile & Logout (Bottom Sidebar) */}
        <div className="p-4 border-t border-slate-800/50 bg-[#0F172A]">
          <div className="bg-slate-800/50 rounded-xl p-3 mb-3 flex items-center gap-3">
             <img 
               src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Student'}&background=random`} 
               alt="User" 
               className="w-10 h-10 rounded-full border border-slate-600"
             />
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-white truncate">{user?.name || 'Alex Johnson'}</p>
               <p className="text-xs text-slate-400 truncate">{user?.email || 'alex.johnson@edubridge.com'}</p>
             </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg w-full transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            
            {/* Search Bar - Hidden on small mobile */}
            <div className="hidden sm:flex items-center max-w-md w-full relative">
               <Search className="absolute left-3 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search for applications, resources, etc." 
                 className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-600 placeholder:text-slate-400"
               />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
               <MessageSquare size={20} />
            </button>
            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-50 rounded-xl transition-colors">
               <img 
                 src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Student'}`} 
                 alt="Profile" 
                 className="w-9 h-9 rounded-full border border-slate-200"
               />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
