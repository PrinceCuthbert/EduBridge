import React from 'react';
import { FileText, Plane, BookOpen, Globe, User, PlusCircle, ArrowRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const stats = [
    { label: "Total Applications", value: "5", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Visa Cases", value: "2", icon: Plane, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Library Loans", value: "3", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Study Abroad Progress", value: "60%", icon: Globe, color: "text-green-600", bg: "bg-green-50" },
  ];

  const quickActions = [
    { label: "Manage Profile", icon: User, path: "/dashboard/profile" },
    { label: "Submit New Application", icon: PlusCircle, path: "/study-abroad" }, // Assuming study abroad listing is where applications start
    { label: "Browse Library", icon: BookOpen, path: "/library" },
    { label: "Track Visa Application", icon: Plane, path: "/dashboard/visa-status" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Dashboard Overview - Stats */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link 
              key={index} 
              to={action.path}
              className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <action.icon size={20} />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{action.label}</span>
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Applications */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800">Recent Applications</h3>
              <Link to="/dashboard/applications" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</Link>
            </div>
            
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <FileText size={32} />
              </div>
              <h4 className="text-slate-900 font-semibold mb-1">No applications yet</h4>
              <p className="text-slate-500 text-sm max-w-xs">Applications will appear here once you apply to a university program.</p>
            </div>
          </div>

          {/* Study Abroad Progress */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800">Study Abroad Progress</h3>
              <Link to="/dashboard/applications" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</Link>
            </div>
             
             {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <BarChart3 size={32} />
              </div>
              <h4 className="text-slate-900 font-semibold mb-1">No progress recorded</h4>
              <p className="text-slate-500 text-sm max-w-xs">Your study abroad application progress will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
