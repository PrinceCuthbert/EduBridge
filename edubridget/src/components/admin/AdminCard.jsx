import React from "react";

export default function AdminCard({ title, children, className = "", action }) {
  return (
    <div className={`bg-white rounded-[2rem] border border-slate-100 p-10 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-8">
           {title && <h2 className="text-xl font-serif text-[#0F172A]">{title}</h2>}
           {action}
        </div>
      )}
      {children}
    </div>
  );
}
