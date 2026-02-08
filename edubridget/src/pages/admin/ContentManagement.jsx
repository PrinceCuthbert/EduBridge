
import React from 'react';
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Award, BookOpen, FileText, Image, LayoutGrid } from 'lucide-react';

export default function ContentManagement() {
  const location = useLocation();

  const tabs = [
    { name: 'Scholarships', path: 'scholarships', icon: Award },
    { name: 'Library', path: 'library', icon: BookOpen },
    { name: 'Blog Posts', path: 'posts', icon: FileText },
    { name: 'Media', path: 'media', icon: Image },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Content Management System</h1>
        <p className="text-slate-500 text-sm">Manage website content, resources, and media from a single dashboard.</p>
      </div>

      {/* Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`
              }
            >
              <tab.icon size={18} />
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
}
