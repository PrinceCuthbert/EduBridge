import React from "react";

export default function AdminPageHeader({
  title,
  subtitle,
  count,
  countLabel = "Records",
  primaryAction,
  secondaryAction,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div className="space-y-1">
        {/* CHANGED: Added tracking-tight for cleaner heading */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>

        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <span>{subtitle}</span>

          {count !== undefined && (
            <div className="flex items-center gap-2">
              {/* Divider Dot */}
              <span className="w-1 h-1 rounded-full bg-slate-300" />

              {/* CHANGED: Pill badge style instead of uppercase text */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                {count} {countLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {secondaryAction && secondaryAction}

        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm active:scale-95 group"
          >
            {primaryAction.icon && (
              <primaryAction.icon
                size={16}
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
