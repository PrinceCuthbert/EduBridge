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
} from "lucide-react";

/**
 * AdminLayout Component
 *
 * Provides the shell for the Admin Dashboard.
 * Includes a responsive sidebar navigation and a top header area.
 * Handles the "Power User" density requested by using a compact, data-focused layout.
 */
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Navigation Items
  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Users", path: "/admin/users", icon: Users },
    { label: "Applications", path: "/admin/applications", icon: FileText },
    { label: "Visa Cases", path: "/admin/visa", icon: Plane },
    { label: "Scholarships", path: "/admin/scholarships", icon: GraduationCap },
    // { label: 'Content (CMS)', path: '/admin/cms', icon: ScrollText },
    // { label: 'Branches', path: '/admin/branches', icon: Building2 },
    // { label: 'Financial Reports', path: '/admin/finance', icon: DollarSign },
    // { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    // { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          flex flex-col bg-slate-900 text-slate-300
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}>
        {/* Logo Area */}
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between px-4"} h-16 border-b border-slate-800/50 transition-all`}>
          <div
            className={`flex items-center gap-3 ${isCollapsed ? "justify-center w-full" : ""}`}>
            {!isCollapsed ? (
              // Expanded State: Logo + Text + Toggle
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                    <GraduationCap className="text-white w-5 h-5" />
                  </div>
                  <span className="font-bold text-white text-base tracking-wide whitespace-nowrap">
                    EduBridge Admin
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <X size={20} />
                </button>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <PanelLeft size={18} />
                </button>
              </>
            ) : (
              // Collapsed State: Just the Toggle Button (acting as expander) or Logo?
              // Using Logo as expander is common, or keeping the button.
              // Let's keep the Logo for identity, and maybe make it clickable or add the small icon?
              // User said "move that icon beside the words".
              // If I click the logo area when collapsed, it should expand.
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors"
                title="Expand Sidebar">
                <GraduationCap className="text-white w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "hover:bg-slate-800 hover:text-white"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? item.label : ""}>
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
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

        {/* User Profile & Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          {/* Collapse Toggle Removed from here */}

          {/* User Info */}
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-2">
              <img
                src={user?.avatar || "https://ui-avatars.com/api/?name=Admin"}
                alt="Admin"
                className="w-10 h-10 rounded-full border-2 border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <img
                src={user?.avatar || "https://ui-avatars.com/api/?name=Admin"}
                alt="Admin"
                className="w-8 h-8 rounded-full border-2 border-slate-700"
              />
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`
                flex items-center gap-3 w-full px-3 py-2 rounded-lg
                hover:bg-red-500/10 hover:text-red-400 transition-colors
                ${isCollapsed ? "justify-center" : ""}
              `}
            title="Sign Out">
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium text-sm">Sign Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 lg:hidden">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
              {navItems.find((i) => i.path === location.pathname)?.label ||
                "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <button className="p-2 mr-4 text-slate-400 hover:text-primary transition-colors relative">
                <Bell size={24} />
                <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Profile Section */}
              <div className="flex items-center pl-6 border-l border-slate-200 h-10">
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-4 focus:outline-none group">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                        {user?.name || "Admin User"}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {user?.role || "Administrator"}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-primary text-white shadow-md shadow-primary/20 flex items-center justify-center overflow-hidden ring-4 ring-transparent group-hover:ring-primary/10 transition-all">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-sm">
                          {user?.name
                            ? user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()
                            : "AD"}
                        </span>
                      )}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-50 sm:hidden">
                        <p className="text-sm font-bold text-slate-800">
                          {user?.name || "Admin User"}
                        </p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>

                      <div className="p-1">
                        <Link
                          to="/admin/settings"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                          onClick={() => setIsProfileOpen(false)}>
                          <Settings size={16} /> Profile Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport for Routes */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
