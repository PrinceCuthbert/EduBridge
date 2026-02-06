import React from 'react';
import { TrendingUp, Users, Eye, MousePointer, BarChart3 } from 'lucide-react';

export default function Analytics() {
  const stats = [
    { label: 'Total Page Views', value: '45,231', change: '+12%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Unique Visitors', value: '8,492', change: '+8%', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Conversion Rate', value: '3.24%', change: '+2.1%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg. Session', value: '4:32 min', change: '+15%', icon: MousePointer, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Analytics</h2>
        <p className="text-slate-600">Monitor website traffic and user behavior</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <span className="text-xs font-semibold text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Placeholder for Charts */}
      <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
        <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Analytics Dashboard</h3>
        <p className="text-slate-500">Detailed analytics charts coming soon...</p>
      </div>
    </div>
  );
}
