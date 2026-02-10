import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Plane,
  Users,
  LogOut,
  Menu,
  X,
  Settings,
  Bell,
  ScrollText,
  Building2,
  DollarSign,
  BarChart3,
  PanelLeft,
  Search,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Users", path: "/admin/users", icon: Users },
    { label: "Applications", path: "/admin/applications", icon: FileText },
    { label: "Visa Cases", path: "/admin/visa", icon: Plane },
    { label: "University Programs", path: "/admin/programs", icon: GraduationCap },
    { label: 'Content (CMS)', path: '/admin/cms', icon: ScrollText },
    { label: 'Branches', path: '/admin/branches', icon: Building2 },
    { label: 'Financial Reports', path: '/admin/finance', icon: DollarSign },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Communications', path: '/admin/communications', icon: MessageSquare },
  ];

  const settingsItem = { label: 'Settings', path: '/admin/settings', icon: Settings };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col bg-[#0F172A] text-slate-400
          transition-all duration-300 ease-in-out border-r border-white/5
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-[80px]" : "lg:w-[280px]"}
          w-[280px]
        `}>
        {/* Logo Area */}
        <div className={`flex items-center h-20 px-6 border-b border-white/5`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg tracking-tight leading-none">
                  EduBridge
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mt-1">
                  Dashboard
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto modern-scrollbar scrollbar-thin scrollbar-thumb-slate-800">
          {!isCollapsed && (
            <div className="px-3 mb-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Menu</span>
            </div>
          )}
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20 active-nav-shadow"
                      : "hover:bg-white/5 hover:text-white"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? item.label : ""}>
                <Icon
                  size={20}
                  className={`flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"}`}
                />
                {!isCollapsed && (
                  <span className="font-semibold text-sm whitespace-nowrap tracking-wide">
                    {item.label}
                  </span>
                )}
                {isActive && !isCollapsed && (
                   <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Footer Actions */}
        <div className="p-4 bg-black/20 border-t border-white/5">
          {!isCollapsed ? (
            <div className="bg-white/5 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=2563eb&color=fff`}
                    alt="Admin"
                    className="w-10 h-10 rounded-xl border border-white/10"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#1e293b] rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.name || "Administrator"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || "admin@edubridge.com"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
               <div className="relative">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=2563eb&color=fff`}
                  alt="Admin"
                  className="w-10 h-10 rounded-xl border border-white/10"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#1e293b] rounded-full" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to={settingsItem.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                ${location.pathname === settingsItem.path ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}
                ${isCollapsed ? "justify-center" : ""}
              `}
              title={settingsItem.label}>
              <Settings size={20} className={location.pathname === settingsItem.path ? "text-blue-400" : "text-slate-500"} />
              {!isCollapsed && <span className="text-sm font-semibold">Settings</span>}
            </Link>
            
            <button
              onClick={handleLogout}
              className={`
                  flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                  text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all
                  ${isCollapsed ? "justify-center" : ""}
                `}
              title="Sign Out">
              <LogOut size={20} />
              {!isCollapsed && <span className="text-sm font-semibold">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200/60 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 text-slate-600 lg:hidden border border-slate-200">
              <Menu size={20} />
            </button>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 text-slate-600 hidden lg:flex border border-slate-200 transition-all active:scale-95">
              <PanelLeft size={20} className={isCollapsed ? "rotate-180" : ""} />
            </button>
            
            <div className="hidden sm:flex flex-col">
              <h2 className="text-slate-900 font-bold text-lg leading-tight">
                {navItems.find((i) => i.path === location.pathname)?.label || "Dashboard"}
              </h2>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>Edubridge</span>
              </div>
            </div>
          </div>

    

          <div className="flex items-center gap-3">
            {/* Notification bell*/}
            <button className="relative p-3 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all active:scale-95">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all active:scale-95 group">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center overflow-hidden transition-all group-hover:scale-95">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-sm tracking-tighter">
                      {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "AD"}
                    </span>
                  )}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-700 leading-none mb-1 group-hover:text-blue-600 transition-colors">{user?.name || "Admin"}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Super Admin</span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 py-3 animate-in fade-in slide-in-from-top-4 z-50">
                   <div className="px-5 py-3 border-b border-slate-50 mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.email || "admin@edubridge.com"}</p>
                  </div>
                  <div className="px-2 space-y-1">
                    <Link
                      to="/admin/settings"
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all"
                      onClick={() => setIsProfileOpen(false)}>
                      <Settings size={18} className="text-slate-400" /> Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all text-left">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport for Routes */}
        <main className="flex-1 overflow-y-auto modern-scrollbar-light p-6 lg:p-10 bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
