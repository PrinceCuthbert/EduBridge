import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Plane,
  BookOpen,
  Globe,
  User,
  LogOut,
  Menu,
  GraduationCap,
  ChevronDown,
  PanelLeft,
  Settings,
} from "lucide-react";

export default function StudentDashboardLayout() {
  const { user, logout } = useAuth();
  const displayName =
    user?.name ||
    [user?.identity?.firstName, user?.identity?.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Student";
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
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
  }, [dropdownRef]);

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

  const navItems = [
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

  const NavItem = ({
    item,
    location,
    expandedItems,
    toggleExpand,
    setIsMobileOpen,
    isSidebarCollapsed,
  }) => {
    const isActive =
      location.pathname === item.path ||
      (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
    const hasSubItems = item.subItems && item.subItems.length > 0;

    // Auto-expand if active, unless explicitly toggled by user (only when not collapsed)
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
            className={`
              w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "justify-between px-3"} py-2.5 rounded-xl transition-all duration-200 group
              ${isActive ? "text-white bg-white/10" : "text-slate-400 hover:bg-white/5 hover:text-white"}
            `}
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

          {/* Sub-items - only visible if not collapsed and expanded */}
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
                    className={`
                       block px-3 py-2 rounded-lg text-sm font-medium transition-colors
                       ${isSubActive ? "text-white bg-blue-600/20" : "text-slate-500 hover:text-white hover:bg-white/5"}
                     `}>
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
        className={`
          flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-xl transition-all duration-200 group mb-1
          ${
            isActive
              ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }
        `}
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
          bg-[#0F172A] text-slate-300
          flex flex-col border-r border-slate-800
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full lg:translate-x-0"}
          ${!isMobileOpen && isSidebarCollapsed ? "lg:w-[70px]" : "lg:w-[260px]"}
        `}>
        {/* Logo */}
        <div
          className={`h-16 flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "px-6"} border-b border-slate-800/50 transition-all`}>
          <GraduationCap size={28} className="text-white shrink-0" />
          <span
            className={`text-white font-bold text-base tracking-tight ml-3 transition-opacity duration-200 ${isSidebarCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"}`}>
            EduBridge Student
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 overflow-y-auto space-y-1 scrollbar-hide">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              location={location}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              setIsMobileOpen={setIsMobileOpen}
              isSidebarCollapsed={isSidebarCollapsed}
            />
          ))}
        </div>

        {/* User Profile & Logout (Bottom Sidebar) */}
        <div className="p-4 border-t border-slate-800/50 bg-[#0F172A]">
          <div
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} px-2 py-2 mb-2`}>
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`
              }
              alt="User"
              className="w-8 h-8 rounded-full border border-slate-600 shrink-0"
            />
            {!isSidebarCollapsed && (
              <div className="overflow-hidden transition-all duration-200">
                <p className="text-sm font-medium text-white truncate">
                  {displayName}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || "student@edubridge.com"}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"} px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg w-full transition-colors text-sm font-medium`}
            title={isSidebarCollapsed ? "Sign Out" : undefined}>
            <LogOut size={16} />
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
              className="hidden lg:block p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              title={
                isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"
              }>
              <PanelLeft size={20} />
            </button>

            {/* Search Bar */}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
               <Bell size={18} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button> */}
            {/* <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
               <MessageSquare size={18} />
            </button> */}
            {/* <div className="w-px h-6 bg-slate-200 mx-2"></div> */}
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
                  <span className="text-xs font-medium text-slate-500 leading-none text-right">
                    Student Account
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
                      {displayName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email || "student@edubridge.com"}
                    </p>
                  </div>
                  <div className="px-1 space-y-0.5">
                    <Link
                      to="/dashboard/profile"
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

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
