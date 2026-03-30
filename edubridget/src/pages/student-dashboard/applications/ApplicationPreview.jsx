// src/pages/student-dashboard/applications/ApplicationPreview.jsx
// Student read-only view of a single application

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Eye,
  X,
  Loader2,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Hash,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import mammoth from "mammoth";
import { toast } from "sonner";
import { useApplications } from "../../../hooks/useApplications";
import StatusBadge from "../../../components/shared/StatusBadge";

// ─── Tracker Stage Progress ───────────────────────────────────────────────────

function TrackerProgress({ stages = [] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-5">
        Application Progress
      </h2>
      <div className="flex items-start gap-0">
        {stages.map((stage, idx) => {
          const isLast = idx === stages.length - 1;
          const isCompleted = stage.completed;
          const isActive =
            !isCompleted && idx > 0 && stages[idx - 1]?.completed;

          return (
            <React.Fragment key={stage.stage}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors
                    ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : isActive
                          ? "bg-white border-blue-500 text-blue-500"
                          : "bg-white border-slate-200 text-slate-300"
                    }
                  `}>
                  {isCompleted ? (
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                  ) : isActive ? (
                    <Clock size={14} strokeWidth={2.5} />
                  ) : (
                    <Circle size={14} strokeWidth={1.5} />
                  )}
                </div>
                <p
                  className={`mt-2 text-xs text-center leading-tight font-medium px-1 truncate w-full
                    ${
                      isCompleted
                        ? "text-emerald-600"
                        : isActive
                          ? "text-blue-600"
                          : "text-slate-400"
                    }
                  `}>
                  {stage.stage}
                </p>
                {stage.date && (
                  <p className="mt-0.5 text-[10px] text-slate-400 text-center">
                    {new Date(stage.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mt-4 max-w-[40px]">
                  <div
                    className={`h-0.5 w-full transition-colors ${
                      isCompleted && stages[idx + 1]?.completed
                        ? "bg-emerald-400"
                        : isCompleted
                          ? "bg-blue-300"
                          : "bg-slate-200"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ─── File Icon ────────────────────────────────────────────────────────────────

function getFileIcon(type = "", name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  if (type.includes("image"))
    return { icon: "🖼️", color: "bg-purple-50 border-purple-100" };
  if (type.includes("zip") || ext === "zip" || ext === "rar")
    return { icon: "📦", color: "bg-amber-50 border-amber-100" };
  if (
    type.includes("word") ||
    type.includes("document") ||
    ext === "docx" ||
    ext === "doc"
  )
    return { icon: "📝", color: "bg-blue-50 border-blue-100" };
  if (ext === "pdf" || type.includes("pdf"))
    return { icon: "📄", color: "bg-red-50 border-red-100" };
  return { icon: "📄", color: "bg-slate-50 border-slate-200" };
}

function formatFileSize(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const DIRECT_PREVIEW = [".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ApplicationPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { singleApplication: app, loading } = useApplications({ trackerId: id });

  const [docxPreview, setDocxPreview] = useState({ open: false, html: "", name: "", loading: false });

  const handleDownload = async (doc) => {
    try {
      const res = await fetch(doc.url);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // CORS fallback — opens in new tab; browser auto-downloads non-renderable types
      window.open(doc.url, "_blank", "noopener,noreferrer");
    }
  };

  const handlePreview = async (doc) => {
    const name = doc.name?.toLowerCase() ?? "";
    if (DIRECT_PREVIEW.some((ext) => name.endsWith(ext))) {
      window.open(doc.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (name.endsWith(".docx") || name.endsWith(".doc")) {
      setDocxPreview({ open: true, html: "", name: doc.name, loading: true });
      try {
        const res = await fetch(doc.url);
        const arrayBuffer = await res.arrayBuffer();
        const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
        setDocxPreview({ open: true, html, name: doc.name, loading: false });
      } catch {
        setDocxPreview({ open: false, html: "", name: "", loading: false });
        toast.error("Could not preview — downloading instead.");
        handleDownload(doc);
      }
      return;
    }
    // All other types — just download
    toast.info("This file type can't be previewed — downloading instead.");
    handleDownload(doc);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-5 pb-16">
        <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-64 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-40 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-40 animate-pulse" />
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-40 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500">Application not found.</p>
        <button
          onClick={() => navigate("/dashboard/applications")}
          className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors">
          Back to Applications
        </button>
      </div>
    );
  }

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  const { applicant = {}, programDetails = {}, trackerStages = [] } = app;

  // Initials for avatar
  const initials =
    (applicant.firstName?.[0] ?? "") + (applicant.lastName?.[0] ?? "");

  return (
    <>
    <div className="max-w-3xl mx-auto space-y-5 pb-16 animate-in fade-in duration-500">
      {/* ── Back + Breadcrumb ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/dashboard/applications")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={15} />
          Back to Applications
        </button>
        {app.trackerId && (
          <>
            <span className="text-slate-300 text-xs">·</span>
            <span className="text-xs font-mono text-slate-400 truncate max-w-[180px]">
              {app.trackerId}
            </span>
            {applicant.firstName && (
              <>
                <span className="text-slate-300 text-xs">·</span>
                <span className="text-xs text-slate-400">
                  {applicant.firstName} {applicant.lastName}
                </span>
              </>
            )}
          </>
        )}
      </div>

      {/* ── Header Card ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-mono text-slate-400 mb-1 truncate">
              {app.trackerId}
            </p>
            <h1 className="text-lg font-bold text-slate-900 leading-snug">
              {programDetails.universityName || "—"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {programDetails.majorName || "—"}
            </p>
          </div>
          <div className="shrink-0">
            <StatusBadge status={app.status} />
          </div>
        </div>
      </div>

      {/* ── Tracker Stage Progress ── */}
      {trackerStages.length > 0 && <TrackerProgress stages={trackerStages} />}

      {/* ── Two-column: Applicant + Program ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Applicant Profile */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Applicant Profile
          </h2>
          <div className="space-y-3">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-white">
                  {initials || "?"}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {applicant.firstName} {applicant.lastName}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2.5">
              {/* Email */}
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{applicant.email || "—"}</span>
              </div>

              {/* Phone */}
              {applicant.phone && (
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  {applicant.phone}
                </div>
              )}

              {/* Tracker ID */}
              <div className="flex items-start gap-2.5 text-sm text-slate-600">
                <Hash size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="font-mono text-[11px] text-slate-500 break-all">
                  {app.trackerId}
                </span>
              </div>

              {/* Submission Date — correct field: app.submissionDate */}
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                {formatDate(app.submissionDate)}
              </div>
            </div>
          </div>
        </div>

        {/* Program Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Program Details
          </h2>
          <div className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                <GraduationCap size={16} className="text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  {programDetails.universityName || "—"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {programDetails.majorName || "—"}
                </p>
              </div>
            </div>

            {/* Fee info if present */}
            {app.fee?.amount && (
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">Application fee</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    app.fee.status === "Paid"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}>
                  {app.fee.currency} {app.fee.amount} · {app.fee.status}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Submitted Documents ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Submitted Documents
        </h2>
        {!app.documents?.length ? (
          <p className="text-sm text-slate-400 italic">
            No documents uploaded.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {app.documents.map((doc) => {
              const { icon, color } = getFileIcon(doc.type, doc.name);
              const uploadDate = doc.uploadedAt
                ? new Date(doc.uploadedAt).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  })
                : new Date(app.submissionDate).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  });

              return (
                <div
                  key={doc.id}
                  className={`flex items-center justify-between border rounded-lg px-3 py-2.5 group hover:border-blue-200 hover:bg-blue-50/30 transition-all ${color}`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg leading-none shrink-0">
                      {icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-700 font-medium truncate">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatFileSize(doc.size)} · {uploadDate}
                      </p>
                    </div>
                  </div>
                  {doc.url ? (
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handlePreview(doc)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                        title="Preview">
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(doc)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                        title="Download">
                        <Download size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="ml-2 p-1.5 text-slate-200 shrink-0 cursor-not-allowed">
                      <Download size={14} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>

    {/* Docx Preview Modal */}
    {docxPreview.open && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        onClick={() => setDocxPreview({ open: false, html: "", name: "", loading: false })}>
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
            <p className="font-semibold text-slate-900 truncate pr-4">{docxPreview.name}</p>
            <button
              onClick={() => setDocxPreview({ open: false, html: "", name: "", loading: false })}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
              <X size={18} className="text-slate-500" />
            </button>
          </div>
          <div className="overflow-y-auto p-6">
            {docxPreview.loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={32} className="animate-spin text-slate-400" />
              </div>
            ) : (
              <div
                className="prose prose-slate max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: docxPreview.html }}
              />
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
