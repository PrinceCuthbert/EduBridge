// ─────────────────────────────────────────────────────────────
//  src/components/visa/VisaStatusBadge.jsx
//
//  WHY THIS EXISTS:
//  Mirrors StatusBadge.jsx from the application module.
//  Before this, VisaSummary.jsx and VisaCases.jsx each had their
//  own getStatusColor() and getStatusIcon() functions — identical
//  logic duplicated in two files.
//
//  Now there is ONE badge component. Change a colour here and
//  it updates everywhere: student table, admin table, detail page.
//
//  USAGE:
//    <VisaStatusBadge status="In Progress" />
//    <VisaStatusBadge status="Approved" size="sm" />
// ─────────────────────────────────────────────────────────────

import React from "react";
import {
  Clock,
  AlertCircle,
  Upload,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { VISA_STATUS_CONFIG } from "../../data/mockVisaData";

// Map status → icon component
// Kept here (not in mockVisaData.js) because icons are a React
// concern — the data file should not import React components.
const STATUS_ICONS = {
  New: Clock,
  "In Progress": AlertCircle,
  "Pending Documents": Upload,
  Approved: CheckCircle,
  Rejected: XCircle,
};

/**
 * @param {string}  status  - one of the VISA_STATUS_CONFIG keys
 * @param {"sm"|"md"} size  - controls padding/font (default "md")
 * @param {boolean} showIcon - show leading icon (default true)
 */
export default function VisaStatusBadge({
  status,
  size = "md",
  showIcon = true,
}) {
  // Fallback for unknown / missing status
  const config = VISA_STATUS_CONFIG[status] ?? {
    label: status ?? "Unknown",
    badge: "bg-slate-50 text-slate-600 border-slate-100",
    dot: "bg-slate-400",
  };

  const Icon = STATUS_ICONS[status];

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-xs gap-1"
      : "px-2.5 py-0.5 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium
        ${config.badge} ${sizeClasses}`}
    >
      {showIcon && Icon && <Icon size={12} />}
      {config.label}
    </span>
  );
}

// Named export so admin status buttons can reuse the colour map
// without re-importing mockVisaData — same pattern as StatusBadge.jsx
export { VISA_STATUS_CONFIG };
