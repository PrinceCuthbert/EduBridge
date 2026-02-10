import React from "react";
import { Plus } from "lucide-react";

export default function AdminPageHeader({ 
  title, 
  subtitle, 
  count, 
  countLabel = "Active Records",
  primaryAction,
  secondaryAction
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          {subtitle}
          {count !== undefined && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse ml-1" />
              <span className="text-blue-600 font-bold uppercase tracking-wider text-[10px]">
                {count} {countLabel}
              </span>
            </>
          )}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {secondaryAction && secondaryAction}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="px-8 py-3.5 bg-[#0F172A] text-white rounded-[1.25rem] text-[11px] font-bold shadow-[0_12px_24px_-8px_rgba(15,23,42,0.3)] hover:bg-[#1E293B] hover:translate-y-[-1px] transition-all flex items-center gap-3 active:scale-95 group"
          >
            {primaryAction.icon && (
              <primaryAction.icon 
                size={18} 
                className={`transition-transform ${primaryAction.rotateIcon ? "group-hover:rotate-90" : ""}`} 
              />
            )}
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
