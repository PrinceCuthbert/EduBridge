// src/pages/admin/AdminApplicationReview.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, Calendar, Download, Eye, X, Hash,
  GraduationCap, AlertCircle, CheckCircle, XCircle, Clock, Loader2,
} from "lucide-react";
import mammoth from "mammoth";
import { toast } from "sonner";
import StatusBadge from "../../../components/shared/StatusBadge";
import { useApplications } from "../../../hooks/useApplications";
import { useAuth } from "../../../context/AuthContext";
import { formatDateLong } from "../../../utils/formatDate";

const STATUSES = ["Pending", "Reviewing", "Needs Changes", "Approved", "Rejected"];
const TERMINAL_STATUSES = ["Approved", "Rejected"];

const statusIcon = (s) => {
  const cls = "shrink-0";
  switch (s) {
    case "Approved":      return <CheckCircle  size={14} className={cls} />;
    case "Needs Changes": return <AlertCircle  size={14} className={cls} />;
    case "Reviewing":     return <Clock        size={14} className={cls} />;
    case "Rejected":      return <XCircle      size={14} className={cls} />;
    default:              return <Clock        size={14} className={cls} />;
  }
};

function getFileIcon(type = "", name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  if (type?.includes("image") || ["jpeg","jpg","gif","png"].includes(ext))
    return { icon: "🖼️", color: "bg-purple-50 border-purple-100" };
  if (type?.includes("zip") || ["zip","rar"].includes(ext))
    return { icon: "📦", color: "bg-amber-50 border-amber-100" };
  if (type?.includes("word") || type?.includes("document") || ["doc","docx"].includes(ext))
    return { icon: "📝", color: "bg-blue-50 border-blue-100" };
  if (ext === "pdf" || type?.includes("pdf"))
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

export default function AdminApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { hasPermission } = useAuth();

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
    toast.info("This file type can't be previewed — downloading instead.");
    handleDownload(doc);
  };
  const canUpdateStatus = hasPermission("update_app_status");

  const {
    singleApplication: app,
    loading,
    updateStatus,
  } = useApplications({ trackerId: id });

  const [updating, setUpdating] = useState(null);

  const handleStatusChange = async (status) => {
    if (updating || app?.status === status) return;

    if (TERMINAL_STATUSES.includes(app?.status)) {
      toast.warning("This application has already been finalised and cannot be changed.", {
        description: `Status "${app.status}" is a terminal state. Contact a system administrator if a correction is needed.`,
        duration: 5000,
      });
      return;
    }

    setUpdating(status);
    try {
      await updateStatus(id, status);
      toast.success(`Status updated to "${status}"`);
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-500">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Loading application details...</p>
      </div>
    );
  }

  if (!app && !loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-slate-500 mb-4">Application not found.</p>
        <button
          onClick={() => navigate("/admin/applications")}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  const initials = (
    (app.applicant?.firstName?.[0] ?? "") + (app.applicant?.lastName?.[0] ?? "")
  ).toUpperCase() || "?";

  return (
    <>
    <div className="max-w-6xl mx-auto space-y-5 pb-16 animate-in fade-in duration-500">

      {/* ── Back + Breadcrumb ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/admin/applications")}
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
            {app.applicant?.firstName && (
              <>
                <span className="text-slate-300 text-xs">·</span>
                <span className="text-xs text-slate-400">
                  {app.applicant.firstName} {app.applicant.lastName}
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
              Application Review
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {app.applicant?.firstName} {app.applicant?.lastName}
            </p>
          </div>
          <div className="shrink-0">
            <StatusBadge status={app.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Left col ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Applicant Profile */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Applicant Profile
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">{initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {app.applicant?.firstName} {app.applicant?.lastName}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate">{app.applicant?.email || "—"}</span>
                </div>
                {app.applicant?.phone && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    {app.applicant.phone}
                  </div>
                )}
                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Hash size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="font-mono text-[11px] text-slate-500 break-all">
                    {app.trackerId}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Calendar size={14} className="text-slate-400 shrink-0" />
                  {formatDateLong(app.submissionDate)}
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
                    {app.programDetails?.universityName || "—"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {app.programDetails?.majorName || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Documents */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Submitted Documents
            </h2>
            {!app.documents?.length ? (
              <p className="text-sm text-slate-400 italic">No documents uploaded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {app.documents.map((doc) => {
                  const { icon, color } = getFileIcon(doc.type, doc.name);
                  const uploadDate = doc.uploadedAt
                    ? new Date(doc.uploadedAt).toLocaleDateString("en-US", {
                        month: "numeric", day: "numeric", year: "numeric",
                      })
                    : "—";
                  return (
                    <div
                      key={doc.id}
                      className={`flex items-center justify-between border rounded-lg px-3 py-2.5 group hover:border-blue-200 hover:bg-blue-50/30 transition-all ${color}`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg leading-none shrink-0">{icon}</span>
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

        {/* ── Right col — Status Management ── */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status Management
            </h2>
            {!canUpdateStatus ? (
              <p className="text-xs text-slate-400 italic">
                You do not have permission to change the application status.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 mb-3">
                  Current status:{" "}
                  <span className="font-medium text-slate-800">{app.status}</span>
                </p>

                {TERMINAL_STATUSES.includes(app.status) && (
                  <div className={`flex items-start gap-2 p-3 rounded-lg border text-xs mb-3 ${
                    app.status === "Approved"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}>
                    <span className="shrink-0 mt-0.5">{statusIcon(app.status)}</span>
                    <p>
                      This application has been <strong>{app.status.toLowerCase()}</strong> and is now finalised.
                      Status changes are no longer permitted.
                    </p>
                  </div>
                )}

                {STATUSES.map((s) => {
                  const isActive  = app.status === s;
                  const isBusy    = updating === s;
                  const isLocked  = TERMINAL_STATUSES.includes(app.status) && !isActive;
                  return (
                    <button
                      key={s}
                      disabled={isActive || !!updating || isLocked}
                      onClick={() => handleStatusChange(s)}
                      className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium text-left flex items-center gap-3 border transition-all
                        ${isActive
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm cursor-default"
                          : isLocked
                            ? "bg-white text-slate-300 border-slate-100 cursor-not-allowed"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50"
                        }`}>
                      <span className={isActive ? "text-white" : isLocked ? "text-slate-200" : "text-slate-400"}>
                        {isBusy
                          ? <Loader2 size={14} className="animate-spin" />
                          : statusIcon(s)
                        }
                      </span>
                      {s}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
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
