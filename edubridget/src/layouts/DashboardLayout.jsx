import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  ChevronDown,
  Activity,
  BookOpen,
  Globe,
  User,
} from "lucide-react";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // --- UI State ---
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const dropdownRef = useRef(null);

  // --- Dynamic Role Logic ---
  const isAdmin = user?.role === "admin";
  const portalName = isAdmin ? "Admin Portal" : "Student Portal";
  const settingsPath = isAdmin ? "/admin/settings" : "/dashboard/profile";
  const roleLabel = isAdmin ? "Admin Account" : "Student Account";

  // --- Display Name Extraction ---
  const displayName =
    user?.username ||
    (user?.identity?.firstName && user?.identity?.lastName
      ? `${user.identity.firstName} ${user.identity.lastName}`
      : null) ||
    "User";
  const displayEmail = user?.email || "No email provided";

  // --- Navigation Arrays ---
  const adminNavItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Users", path: "/admin/users", icon: Users },
    { label: "Applications", path: "/admin/applications", icon: FileText },
    { label: "App Tracker", path: "/admin/tracker", icon: Activity },
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
  ];

  const studentNavItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    {
      label: "My Applications",
      path: "/dashboard/applications",
      icon: FileText,
    },
    {
      label: "Visa Status",
      path: "/dashboard/visa-status",
      icon: Plane,
      subItems: [
        { label: "Summary", path: "/dashboard/visa-status/summary" },
        {
          label: "Request Consultation",
          path: "/dashboard/visa-status/request",
        },
      ],
    },
    {
      label: "University Programs",
      path: "/dashboard/programs",
      icon: GraduationCap,
    },
    { label: "Library", path: "/dashboard/library", icon: BookOpen },
    {
      label: "Study Resources",
      path: "/dashboard/study-resources",
      icon: Globe,
    },
    { label: "Profile Settings", path: "/dashboard/profile", icon: User },
  ];

  // Dynamically select which array to render
  const currentNavItems = isAdmin ? adminNavItems : studentNavItems;

  // --- Handlers ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleExpand = (path, currentState) => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      setExpandedItems((prev) => ({ ...prev, [path]: true }));
    } else {
      setExpandedItems((prev) => ({ ...prev, [path]: !currentState }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  // --- Reusable NavItem Component ---
  const NavItem = ({ item }) => {
    const isActive =
      location.pathname === item.path ||
      (item.path !== (isAdmin ? "/admin/dashboard" : "/dashboard") &&
        location.pathname.startsWith(item.path));
    const hasSubItems = item.subItems && item.subItems.length > 0;

    const isExpanded =
      !isSidebarCollapsed &&
      (expandedItems[item.path] !== undefined
        ? expandedItems[item.path]
        : isActive);

    if (hasSubItems) {
      return (
        <div className="mb-1">
          <button
            onClick={() => toggleExpand(item.path, isExpanded)}
            className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "justify-between px-3"} py-2.5 rounded-xl transition-all duration-200 group ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            title={isSidebarCollapsed ? item.label : undefined}>
            <div
              className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}>
              <item.icon
                size={18}
                className={
                  isActive
                    ? "text-blue-400"
                    : "text-slate-400 group-hover:text-white transition-colors"
                }
              />
              {!isSidebarCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded && !isSidebarCollapsed ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
            <div className="pl-9 pr-2 space-y-1">
              {item.subItems.map((subItem) => {
                const isSubActive = location.pathname === subItem.path;
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isSubActive ? "text-white bg-blue-600/20" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
                    {subItem.label}
                  </Link>
                );
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
        className={`flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-xl transition-all duration-200 group mb-1 ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
        title={isSidebarCollapsed ? item.label : undefined}>
        <item.icon
          size={18}
          className={
            isActive
              ? "text-white"
              : "text-slate-400 group-hover:text-white transition-colors"
          }
        />
        {!isSidebarCollapsed && (
          <span className="font-medium text-sm">{item.label}</span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0F172A] text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 ease-in-out ${isMobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:translate-x-0"} ${!isMobileOpen && isSidebarCollapsed ? "lg:w-[80px]" : "lg:w-[260px]"}`}>
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-white text-base leading-none">
                  EduBridge
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  {portalName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-3 overflow-y-auto space-y-1 scrollbar-hide">
          {!isSidebarCollapsed && (
            <div className="px-3 mb-2">
              <span className="text-xs font-medium text-slate-500">Menu</span>
            </div>
          )}
          {currentNavItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </div>

        {/* Bottom Sidebar / Settings */}
        <div className="p-4 border-t border-slate-800/50 bg-[#0F172A]">
          <Link
            to={settingsPath}
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-1 ${location.pathname === settingsPath ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"} ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Settings">
            <Settings size={20} className="text-slate-400" />
            {!isSidebarCollapsed && (
              <span className="text-sm font-medium text-slate-300">
                Settings
              </span>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg w-full transition-colors text-sm font-medium`}
            title="Sign Out">
            <LogOut size={20} />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu size={20} />
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:block p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <PanelLeft
                size={20}
                className={isSidebarCollapsed ? "rotate-180" : ""}
              />
            </button>
            <div className="hidden sm:flex flex-col">
              <h2 className="text-slate-900 font-bold text-lg leading-tight">
                {currentNavItems.find((i) => i.path === location.pathname)
                  ?.label || "Dashboard"}
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
                  <span className="text-xs font-medium text-slate-500 leading-none capitalize">
                    {roleLabel}
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
                    <p
                      className="text-sm font-semibold text-slate-900 truncate"
                      title={displayEmail}>
                      {displayEmail}
                    </p>
                    <p className="text-xs text-slate-500">Active Session</p>
                  </div>
                  <div className="px-1 space-y-0.5">
                    <Link
                      to={settingsPath}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
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

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
