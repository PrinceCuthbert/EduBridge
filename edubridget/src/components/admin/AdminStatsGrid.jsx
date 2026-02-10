import React from "react";

export default function AdminStatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white p-8 rounded-[2rem] border border-slate-200/50 shadow-xl shadow-slate-200/20 group hover:border-blue-100/50 hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg || 'bg-slate-50'} ${stat.color || 'text-slate-600'} flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-500 border border-black/5`}>
                <Icon size={24} />
              </div>
              {stat.trend && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">
                  {stat.trend}
                </span>
              )}
            </div>
            
            <h3 className="text-3xl font-serif text-[#0F172A] mb-1.5 tracking-tight antialiased relative z-10">
              {stat.value}
            </h3>
            
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest relative z-10 pl-0.5">
              {stat.label}
            </p>

            {/* Subtle background decoration */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl" />
          </div>
        );
      })}
    </div>
  );
}
