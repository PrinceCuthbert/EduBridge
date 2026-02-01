
import React from 'react';
import { 
  Users, 
  GraduationCap, 
  FileCheck, 
  Plane, 
  ArrowUpRight,
  Clock,
  AlertCircle
} from 'lucide-react';

/**
 * AdminOverview Component
 * 
 * Displays high-level statistics and recent activity suitable for the initial landing page.
 * Uses a grid layout to present key metrics efficiently.
 */
export default function AdminOverview() {
  
  // Dummy Stats Data
  const stats = [
    { 
      title: 'Total Students', 
      value: '2,845', 
      change: '+12% this month', 
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      title: 'Active Applications', 
      value: '142', 
      change: '18 waiting review', 
      icon: FileCheck,
      color: 'bg-emerald-500'
    },
    { 
      title: 'Visa Cases', 
      value: '38', 
      change: '5 urgent attention', 
      icon: Plane,
      color: 'bg-amber-500'
    },
    { 
      title: 'Scholarships', 
      value: '24', 
      change: '3 expiring soon', 
      icon: GraduationCap,
      color: 'bg-purple-500'
    },
  ];

  const recentActions = [
    { id: 1, user: 'Sarah M.', action: 'Submitted application for', target: 'Oxford Scholarship', time: '10 min ago', icon: FileCheck },
    { id: 2, user: 'Jean P.', action: 'Requested consultation for', target: 'Canada Visa', time: '45 min ago', icon: Plane },
    { id: 3, user: 'Davide K.', action: 'Registered new account', target: '', time: '2 hours ago', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                  <Icon size={24} className={`${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                   <ArrowUpRight size={12} className="mr-1" />
                   Live
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <p className="text-xs text-slate-400 mt-2">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-slate-800 text-lg">Recent Activity</h3>
             <button className="text-sm text-primary font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {recentActions.map((item) => (
              <div key={item.id} className="flex items-start gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                 <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-500">
                    <item.icon size={18} />
                 </div>
                 <div>
                    <p className="text-sm text-slate-800">
                      <span className="font-bold">{item.user}</span> {item.action} <span className="font-medium text-primary">{item.target}</span>
                    </p>
                    <p className="text-xs text-slate-400 flex items-center mt-1">
                      <Clock size={12} className="mr-1" /> {item.time}
                    </p>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Alerts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
           <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-slate-800 text-lg">Action Required</h3>
             <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">5 Pending</span>
          </div>
          
          <div className="space-y-3">
             <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 cursor-pointer hover:bg-orange-100 transition-colors">
                <div className="flex gap-3">
                   <AlertCircle size={20} className="text-orange-500 mt-0.5" />
                   <div>
                      <p className="text-sm font-semibold text-orange-900">Review Application #1024</p>
                      <p className="text-xs text-orange-700 mt-1">Missing Passport Scan</p>
                   </div>
                </div>
             </div>
             
             <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                <div className="flex gap-3">
                   <Plane size={20} className="text-blue-500 mt-0.5" />
                   <div>
                      <p className="text-sm font-semibold text-blue-900">Visa Consultation Request</p>
                      <p className="text-xs text-blue-700 mt-1">John Doe - Canada Student Visa</p>
                   </div>
                </div>
             </div>
          </div>
          
           <button className="w-full mt-6 py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm font-medium hover:border-primary hover:text-primary transition-all">
              + Add New Announcement
           </button>
        </div>
      </div>
    </div>
  );
}
