import React from 'react';
import { DollarSign, FileText, Users, TrendingDown, Download, ChevronDown } from 'lucide-react';

export default function FinancialReports() {
  const stats = [
    { label: 'Total Revenue', value: '$75,800', change: '↑ +18%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Transactions', value: '874', change: '↑ +12%', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg. Transaction', value: '$86.72', change: '↑ +8%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Refunds', value: '$1,250', change: '↓ -2%', icon: TrendingDown, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  const revenueData = [
    { month: 'Jan', consultations: 45, library: 25, courses: 15 },
    { month: 'Feb', consultations: 52, library: 18, courses: 28 },
    { month: 'Mar', consultations: 48, library: 20, courses: 25 },
    { month: 'Apr', consultations: 60, library: 28, courses: 30 },
    { month: 'May', consultations: 55, library: 32, courses: 28 },
    { month: 'Jun', consultations: 72, library: 38, courses: 38 },
  ];

  const paymentMethods = [
    { name: 'Mobile Money', percentage: '45%', color: '#3b82f6' },
    { name: 'Card Payments', percentage: '35%', color: '#10b981' },
    { name: 'Bank Transfer', percentage: '15%', color: '#f59e0b' },
    { name: 'Cash', percentage: '5%', color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Financial Reports</h2>
          <p className="text-slate-600">Revenue analytics and payment tracking</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isNegative = stat.change.startsWith('↓');
          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <span className={`text-xs font-semibold ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Service - Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 mb-1">Revenue by Service</h3>
            <p className="text-sm text-slate-500">Monthly breakdown by service type</p>
          </div>
          <div className="h-64 flex items-end justify-around gap-4 border-b border-slate-200 pb-4">
            {revenueData.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end justify-center h-48">
                  <div 
                    className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                    style={{ height: `${(month.consultations / 80) * 100}%` }}
                    title={`Consultations: $${month.consultations * 100}`}
                  />
                  <div 
                    className="flex-1 bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                    style={{ height: `${(month.library / 80) * 100}%` }}
                    title={`Library: $${month.library * 100}`}
                  />
                  <div 
                    className="flex-1 bg-yellow-500 rounded-t hover:bg-yellow-600 transition-colors"
                    style={{ height: `${(month.courses / 80) * 100}%` }}
                    title={`Courses: $${month.courses * 100}`}
                  />
                </div>
                <span className="text-xs text-slate-600 font-medium">{month.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-xs text-slate-600">Consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-xs text-slate-600">Library</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded" />
              <span className="text-xs text-slate-600">Courses</span>
            </div>
          </div>
        </div>

        {/* Payment Methods - Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 mb-1">Payment Methods</h3>
            <p className="text-sm text-slate-500">Distribution by type</p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              {/* Simple donut chart representation */}
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" 
                  strokeDasharray="113 251" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" 
                  strokeDasharray="88 251" strokeDashoffset="-113" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" 
                  strokeDasharray="38 251" strokeDashoffset="-201" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="20" 
                  strokeDasharray="13 251" strokeDashoffset="-239" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: method.color }} />
                <div className="flex-1">
                  <p className="text-xs text-slate-600">{method.name}</p>
                  <p className="text-sm font-semibold text-slate-900">{method.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Revenue Table */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 mb-1">Service Revenue Breakdown</h3>
          <p className="text-sm text-slate-500">Detailed view of revenue by service</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600 uppercase">Service</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Transactions</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Avg. Value</th>
                <th className="text-right py-3 px-6 text-sm font-semibold text-slate-600 uppercase">% of Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">Visa Consultations</td>
                <td className="py-4 px-4 text-right text-green-600 font-semibold">$28,500</td>
                <td className="py-4 px-4 text-right text-slate-600">190</td>
                <td className="py-4 px-4 text-right text-slate-600">$150</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="flex-1 max-w-[100px] bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '38%' }} />
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-12">38%</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">Scholarship Applications</td>
                <td className="py-4 px-4 text-right text-green-600 font-semibold">$15,200</td>
                <td className="py-4 px-4 text-right text-slate-600">152</td>
                <td className="py-4 px-4 text-right text-slate-600">$100</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="flex-1 max-w-[100px] bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }} />
                    </div>
                    <span className="text-sm font-medium text-slate-900 w-12">20%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
