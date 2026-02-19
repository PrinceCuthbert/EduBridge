// src/components/shared/StatusBadge.jsx
// Single source of truth for application status colours — used in both student and admin views.

export const STATUS_CONFIG = {
  Pending:          { dot: "bg-slate-400",   badge: "bg-slate-50 text-slate-600 border-slate-200" },
  Reviewing:        { dot: "bg-blue-500",    badge: "bg-blue-50 text-blue-700 border-blue-200" },
  "Needs Changes":  { dot: "bg-amber-500",   badge: "bg-amber-50 text-amber-700 border-amber-200" },
  Approved:         { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Rejected:         { dot: "bg-red-500",     badge: "bg-red-50 text-red-700 border-red-200" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG["Pending"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
