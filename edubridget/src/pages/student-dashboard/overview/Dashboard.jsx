import React, { useMemo } from 'react';
import { FileText, Plane, BookOpen, Globe, User, PlusCircle, ArrowRight, BarChart3, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useApplications } from '../../../hooks/useApplications';
import StatusBadge from '../../../components/shared/StatusBadge';
import { formatDate } from '../../../utils/formatDate';

export default function Dashboard() {
  const { user } = useAuth();
  const { applications } = useApplications({ userId: user?.id });

  const pendingCount  = useMemo(() => applications.filter(a => a.status === 'Pending').length, [applications]);
  const approvedCount = useMemo(() => applications.filter(a => a.status === 'Approved').length, [applications]);

  const recentApplications = useMemo(() =>
    [...applications]
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
      .slice(0, 4),
  [applications]);

  const stats = [
    { label: "Total Applications", value: applications.length, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Review",     value: pendingCount,        icon: Plane,    color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Approved",           value: approvedCount,       icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Study Abroad Ready", value: approvedCount > 0 ? "✓" : "—", icon: Globe, color: "text-green-600", bg: "bg-green-50" },
  ];

  const quickActions = [
    { label: "Manage Profile", icon: User, path: "/dashboard/profile" },
    { label: "Submit New Application", icon: PlusCircle, path: "/dashboard/programs" },
    { label: "Browse Library", icon: BookOpen, path: "/dashboard/library" },
    { label: "Track Visa Application", icon: Plane, path: "/dashboard/visa-status" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      
      {/* Dashboard Overview - Stats */}
      <div>
        <h2 className="text-lg font-serif text-slate-900 mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={20} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                    {stat.label.includes('Progress') ? 'Active' : 'Update'}
                  </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-serif text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link 
              key={index} 
              to={action.path}
              className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <action.icon size={18} />
                </div>
                <span className="font-medium text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{action.label}</span>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-serif text-slate-900 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Applications */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-slate-900">Recent Applications</h3>
              <Link to="/dashboard/applications" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">View All</Link>
            </div>
            
            {recentApplications.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center border-t border-dashed border-slate-100">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 text-slate-300">
                  <FileText size={24} />
                </div>
                <h4 className="text-slate-900 font-medium text-sm mb-1">No applications yet</h4>
                <p className="text-slate-500 text-xs max-w-xs leading-relaxed">Applications will appear here once you start applying to university programs.</p>
                <Link to="/dashboard/programs" className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors">
                  Start Application
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border-t border-slate-100">
                {recentApplications.map((app) => (
                  <Link
                    key={app.trackerId}
                    to={`/dashboard/applications/${app.trackerId}`}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                        {app.programDetails?.universityName}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> {formatDate(app.submissionDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} />
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Study Abroad Progress */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-slate-900">Study Abroad Progress</h3>
              <Link to="/dashboard/applications" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">View All</Link>
            </div>
             
             {/* Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center border-t border-dashed border-slate-100">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 text-slate-300">
                <BarChart3 size={24} />
              </div>
              <h4 className="text-slate-900 font-medium text-sm mb-1">No progress recorded</h4>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed">Your study abroad application milestones will be tracked here automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}