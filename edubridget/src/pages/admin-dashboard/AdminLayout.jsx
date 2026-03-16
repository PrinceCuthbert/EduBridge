import React, { useState, useEffect, useRef } from "react";
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
  Settings,
  ScrollText,
  Building2,
  DollarSign,
  BarChart3,
  PanelLeft,
  MessageSquare,
  ChevronDown,
  Activity,
} from "lucide-react";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const displayName =
    user?.name ||
    [user?.identity?.firstName, user?.identity?.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Admin";
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Ref for the profile dropdown to detect outside clicks
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Users", path: "/admin/users", icon: Users },
    // { label: "Roles",             path: "/admin/roles",        icon: ShieldCheck },    // Priority 9
    { label: "Applications", path: "/admin/applications", icon: FileText },
    { label: "App Tracker", path: "/admin/tracker", icon: Activity }, // Priority 4
    { label: "Visa Cases", path: "/admin/visa", icon: Plane },
    {
      label: "University Programs",
      path: "/admin/programs",
      icon: GraduationCap,
    },
    { label: "Content (CMS)", path: "/admin/cms", icon: ScrollText },
    { label: "Branches", path: "/admin/branches", icon: Building2 },
    { label: "Financial Reports", path: "/admin/finance", icon: DollarSign },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    // { label: 'Communications',    path: '/admin/communications',icon: MessageSquare },
  ];

  const settingsItem = {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col bg-[#0F172A] text-slate-400
          transition-all duration-300 ease-in-out border-r border-slate-800
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-[80px]" : "lg:w-[260px]"}
          w-[260px]
        `}>
        {/* Logo Area */}
        <div
          className={`flex items-center h-16 px-6 border-b border-slate-800`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                {/* CHANGED: Removed tracking-tight/uppercase */}
                <span className="font-bold text-white text-base leading-none">
                  EduBridge
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Admin Portal
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
          {!isCollapsed && (
            <div className="px-3 mb-2">
              <span className="text-xs font-medium text-slate-500">Menu</span>
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
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "hover:bg-slate-800 hover:text-white"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? item.label : ""}>
                <Icon
                  size={20}
                  className={`flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                />
                {!isCollapsed && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0F172A]">
          <div className="space-y-1">
            <Link
              to={settingsItem.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                ${location.pathname === settingsItem.path ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"}
                ${isCollapsed ? "justify-center" : ""}
              `}
              title={settingsItem.label}>
              <Settings size={20} className="text-slate-400" />
              {!isCollapsed && (
                <span className="text-sm font-medium">Settings</span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className={`
                  flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
                  text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all
                  ${isCollapsed ? "justify-center" : ""}
                `}
              title="Sign Out">
              <LogOut size={20} />
              {!isCollapsed && (
                <span className="text-sm font-medium">Sign Out</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 bg-white hover:bg-slate-100 rounded-lg text-slate-600 lg:hidden border border-slate-200">
              <Menu size={20} />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg hidden lg:flex transition-colors">
              <PanelLeft
                size={20}
                className={isCollapsed ? "rotate-180" : ""}
              />
            </button>

            <div className="hidden sm:flex flex-col">
              <h2 className="text-slate-900 font-bold text-lg leading-tight">
                {navItems.find((i) => i.path === location.pathname)?.label ||
                  "Dashboard"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-1 pr-2 py-1 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-xs">
                      {displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </span>
                  )}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-sm font-semibold text-slate-700 leading-none mb-0.5">
                    {displayName}
                  </span>
                  <span className="text-xs font-medium text-slate-500 leading-none">
                    Admin Account
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-100 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user?.email || "admin@edubridge.com"}
                    </p>
                    <p className="text-xs text-slate-500">Active Session</p>
                  </div>
                  <div className="px-1 space-y-0.5">
                    <Link
                      to="/admin/settings"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      onClick={() => setIsProfileOpen(false)}>
                      <Settings size={16} /> Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport for Routes */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
