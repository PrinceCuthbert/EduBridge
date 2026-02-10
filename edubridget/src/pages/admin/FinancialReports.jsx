import React, { useState } from 'react';
import { DollarSign, FileText, Users, TrendingDown, Download, Filter } from 'lucide-react';
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import AdminCard from "../../components/admin/AdminCard";
import AdminTable from "../../components/admin/AdminTable";
import AdminFilterBar from "../../components/admin/AdminFilterBar";

export default function FinancialReports() {
  const [timeRange, setTimeRange] = useState("This Month");

  const stats = [
    { label: 'Total Revenue', value: '$75,800', change: '+18%', trend: 'Growth', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Transactions', value: '874', change: '+12%', trend: 'Increase', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg. Transaction', value: '$86.72', change: '+8%', trend: 'Uptrend', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Refunds', value: '$1,250', change: '-2%', trend: 'Decrease', icon: TrendingDown, color: 'text-yellow-600', bg: 'bg-yellow-50' },
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

  const serviceRevenue = [
    { service: 'Visa Consultations', revenue: '$28,500', transactions: 190, avg: '$150', percent: 38 },
    { service: 'Scholarship Applications', revenue: '$15,200', transactions: 152, avg: '$100', percent: 20 },
    { service: 'Language Courses', revenue: '$12,400', transactions: 85, avg: '$145', percent: 16 },
    { service: 'Document Translation', revenue: '$8,200', transactions: 205, avg: '$40', percent: 11 },
  ];

  const columns = [
    {
       header: "Service",
       render: (row) => <span className="font-medium text-slate-900">{row.service}</span>
    },
    {
       header: "Revenue",
       className: "text-right",
       render: (row) => <span className="text-green-600 font-semibold">{row.revenue}</span>
    },
    {
       header: "Transactions",
       className: "text-right",
       render: (row) => <span className="text-slate-600">{row.transactions}</span>
    },
    {
       header: "Avg. Value",
       className: "text-right",
       render: (row) => <span className="text-slate-600">{row.avg}</span>
    },
    {
       header: "% of Total",
       className: "text-right",
       render: (row) => (
         <div className="flex items-center justify-end gap-3">
            <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
               <div className="bg-blue-500 h-full rounded-full" style={{ width: `${row.percent}%` }} />
            </div>
            <span className="text-sm font-medium text-slate-900 w-8">{row.percent}%</span>
         </div>
       )
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <AdminPageHeader 
        title="Financial Reports" 
        subtitle="Revenue analytics and payment tracking."
        primaryAction={{
          label: "Export Report",
          icon: Download,
          onClick: () => console.log("Exporting..."),
          rotateIcon: false
        }}
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilterBar 
        searchPlaceholder="Search transaction ID..." // Placeholder, simplified
        secondaryActions={
          <div className="flex items-center gap-3">
             <div className="relative">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
                <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
             </div>
          </div>
        }
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue by Service - Bar Chart */}
        <AdminCard title="Revenue by Service">
          <div className="h-64 flex items-end justify-around gap-4 border-b border-slate-200 pb-4 mb-6">
            {revenueData.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full flex gap-1 items-end justify-center h-48 relative">
                   {/* Tooltip hint */}
                  <div 
                    className="flex-1 bg-blue-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all group-hover:scale-y-105 origin-bottom"
                    style={{ height: `${(month.consultations / 80) * 100}%` }}
                  />
                  <div 
                    className="flex-1 bg-emerald-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all group-hover:scale-y-105 origin-bottom"
                    style={{ height: `${(month.library / 80) * 100}%` }}
                  />
                  <div 
                    className="flex-1 bg-amber-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all group-hover:scale-y-105 origin-bottom"
                    style={{ height: `${(month.courses / 80) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{month.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Library</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Courses</span>
            </div>
          </div>
        </AdminCard>

        {/* Payment Methods - Donut Chart */}
        <AdminCard title="Payment Methods">
          <div className="flex items-center justify-center h-64 mb-6 relative">
            <div className="relative w-48 h-48 group">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 drop-shadow-xl">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" 
                  strokeDasharray="113 251" strokeDashoffset="0" className="hover:opacity-80 transition-opacity cursor-pointer" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12" 
                  strokeDasharray="88 251" strokeDashoffset="-113" className="hover:opacity-80 transition-opacity cursor-pointer" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" 
                  strokeDasharray="38 251" strokeDashoffset="-201" className="hover:opacity-80 transition-opacity cursor-pointer" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="12" 
                  strokeDasharray="13 251" strokeDashoffset="-239" className="hover:opacity-80 transition-opacity cursor-pointer" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-2xl font-bold text-slate-800">Total</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-3 h-3 rounded-full shadow-sm ring-1 ring-white`} style={{ backgroundColor: method.color }} />
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{method.name}</p>
                  <p className="text-sm font-bold text-slate-900">{method.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Service Revenue Table */}
      <div className="space-y-4">
         <div className="px-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Service Revenue Breakdown</h3>
         </div>
         <AdminTable 
           columns={columns}
           data={serviceRevenue}
           isLoading={false}
         />
      </div>
    </div>
  );
}
