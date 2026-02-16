import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Award, BookOpen, FileText, Image } from 'lucide-react';

export default function ContentManagement() {
  const tabs = [
    { name: 'Scholarships', path: 'scholarships', icon: Award },
    { name: 'Library', path: 'library', icon: BookOpen },
    { name: 'Blog Posts', path: 'posts', icon: FileText },
    { name: 'Media', path: 'media', icon: Image },
  ];

  return (
    // ADDED: Animation to match other pages
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header - Visually matched to AdminPageHeader */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content Management System</h1>
        <p className="text-slate-500">Manage website content, resources, and media from a single dashboard.</p>
      </div>

      {/* Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                // CHANGED: border-primary -> border-blue-600
                // CHANGED: text-primary -> text-blue-600
                // ADDED: transition-all for smoother hover effects
                `flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
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