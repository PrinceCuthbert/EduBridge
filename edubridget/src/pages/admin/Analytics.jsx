import React, { useState } from 'react';
import { TrendingUp, Users, FileText, DollarSign, Download, Calendar, BarChart3 } from 'lucide-react';
// TODO: Uncomment when axios is installed
// import { analyticsAPI } from '../../api/services';
import { useFetch } from '../../hooks/useApi';
import { toast } from 'sonner';

export default function Analytics() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // TODO: Uncomment when axios is installed
  // Fetch analytics data
  // const { data: appStats, loading: appLoading } = useFetch(() => analyticsAPI.getApplicationStats(dateRange), dateRange, [dateRange]);
  // const { data: visaStats, loading: visaLoading } = useFetch(() => analyticsAPI.getVisaStats(dateRange), dateRange, [dateRange]);
  // const { data: demographics } = useFetch(() => analyticsAPI.getDemographics(dateRange), dateRange, [dateRange]);

  // Mock Data
  const appStats = { total: '1,245', approvalRate: '85%', revenue: '45,200', active: 856 };
  const visaStats = { total: '840', successRate: '92%', pending: 45, rejected: 8 };
  const demographics = { topCountries: ['Rwanda', 'Kenya', 'Uganda'], gender: { male: 55, female: 45 } };
  const appLoading = false;
  const visaLoading = false;

  const stats = [
    { label: 'Total Applications', value: appStats?.total || '0', change: '+12%', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Visa Cases', value: visaStats?.total || '0', change: '+8%', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Approval Rate', value: appStats?.approvalRate || '0%', change: '+3%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Revenue', value: `$${appStats?.revenue || '0'}`, change: '+18%', icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  const handleExport = (type) => {
    toast.info(`Export as ${type.toUpperCase()} - Feature available after installing axios package`);
  };

  const loading = appLoading || visaLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-500 text-sm">Performance metrics and insights</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-white">
            <Calendar size={18} className="text-slate-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="text-sm border-none focus:outline-none"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="text-sm border-none focus:outline-none"
            />
          </div>

          <button 
            onClick={() => handleExport('full')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download size={18} />
            Export
          </button>
        </div>
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

      {/* Charts Section */}
      {loading ? (
        <div className="bg-white p-16 rounded-xl border border-slate-200 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading analytics...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Trends */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Application Trends</h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
              <BarChart3 size={48} className="text-slate-300" />
            </div>
          </div>

          {/* Demographics */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Student Demographics</h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
              <BarChart3 size={48} className="text-slate-300" />
            </div>
          </div>
        </div>
      )}

      {/* Note about charts */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Install <code className="px-2 py-1 bg-blue-100 rounded">recharts</code> or <code className="px-2 py-1 bg-blue-100 rounded">chart.js</code> for visual charts. API integration ready.
        </p>
      </div>
    </div>
  );
}

