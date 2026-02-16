import React from "react";

export default function AdminStatsGrid({ stats }) {
  return (
    // CHANGED: gap-8 -> gap-6
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            // CHANGED: rounded-[2rem] -> rounded-xl
            // CHANGED: p-8 -> p-6
            // CHANGED: Shadow and border styles to be cleaner/lighter
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              {/* CHANGED: w-14 h-14 -> w-10 h-10 (Standard Icon Box) */}
              {/* CHANGED: rounded-2xl -> rounded-lg */}
              <div className={`w-10 h-10 rounded-lg ${stat.bg || 'bg-slate-50'} ${stat.color || 'text-slate-600'} flex items-center justify-center border border-black/5`}>
                <Icon size={20} />
              </div>
              
              {stat.trend && (
                // CHANGED: Removed uppercase, tracking-[0.2em]
                // ADDED: font-medium, rounded-full pill shape
                <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                  {stat.trend}
                </span>
              )}
            </div>
            
            <div className="space-y-1">
                {/* CHANGED: text-3xl font-serif -> text-2xl font-bold font-sans */}
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </h3>
                
                {/* CHANGED: Removed uppercase, tracking-widest */}
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}