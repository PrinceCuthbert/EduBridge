// src/pages/admin/AdminApplicationReview.jsx
// Admin detail — review a single application and update its status.
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, Calendar, FileText, Download,Hash,
  GraduationCap, AlertCircle, CheckCircle, XCircle, Clock, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import AdminCard   from "../../../components/admin/AdminCard";
import StatusBadge, { STATUS_CONFIG } from "../../../components/shared/StatusBadge";
import { getApplicationById }    from "../../../services/applicationService";
import { useApplications }        from "../../../hooks/useApplications";
// [FIX #5] Uses formatDateLong (full month) from shared utility — src/utils/formatDate.js
import { formatDateLong } from "../../../utils/formatDate";


// The review page is where the admin can review the applications of the students
// and update the status of the applications

const STATUSES = ["Pending", "Reviewing", "Needs Changes", "Approved", "Rejected"];

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

// [FIX #5] formatDate removed — using formatDateLong imported from src/utils/formatDate.js

const getFileIcon = (type = "") => {
  if (type.includes("image")) return "🖼️";
  if (type.includes("zip"))   return "📦";
  if (type.includes("word") || type.includes("document")) return "📝";
  return "📄";
};

export default function AdminApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app,        setApp]        = useState(null);
  const [updating,   setUpdating]   = useState(null); // status string being updated

  const { updateStatus } = useApplications();

  const loadApp = useCallback(() => {
    const data = getApplicationById(id);
    if (!data) {
      toast.error("Application not found.");
      navigate("/admin/applications");
      return;
    }
    setApp(data);
  }, [id, navigate]);

  useEffect(() => { loadApp(); }, [loadApp]);

  const handleStatusChange = async (status) => {
    if (updating || app?.status === status) return;
    setUpdating(status);
    try {
      await updateStatus(id, status);
      // Refresh local state from localStorage so badge updates immediately
      setApp(getApplicationById(id));
      toast.success(`Status updated to "${status}"`);
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  if (!app) return null;

  const initials = ((app.firstName?.[0] ?? "") + (app.lastName?.[0] ?? "")).toUpperCase() || "?";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/applications")}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Application Review
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
              <span className="font-mono">{app.id}</span>
              <span className="text-slate-300">•</span>
              <span>{app.firstName} {app.lastName}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left col ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1 — Applicant Profile */}
          <AdminCard title="Applicant Profile">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <span className="text-xl font-bold">{initials}</span>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {app.firstName} {app.lastName}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Mail size={13} /> Email
                    </p>
                    <p className="text-sm font-medium text-slate-900 truncate">{app.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Phone size={13} /> Phone
                    </p>
                    <p className="text-sm font-medium text-slate-900">{app.phone || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Hash size={13} /> Application ID
                    </p>
                    <p className="text-sm font-mono text-slate-900">{app.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Calendar size={13} /> Submission Date
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {formatDateLong(app.submissionDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Section 2 — Program Details */}
          <AdminCard title="Program Details">
            <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                <GraduationCap size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{app.universityName}</h3>
                <p className="text-sm text-slate-500">{app.programName}</p>
              </div>
            </div>
          </AdminCard>

          {/* Section 3 — Submitted Documents */}
          <AdminCard title="Submitted Documents">
            {!app.documents?.length ? (
              <p className="text-sm text-slate-400 italic">No documents uploaded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {app.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 shrink-0">
                        <span className="text-base">{getFileIcon(doc.type)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                        <p className="text-xs text-slate-400">
                          {(doc.size / 1024).toFixed(1)} KB ·{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {doc.url && (
                      <a
                        href={doc.url}
                        download={doc.name}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors ml-2 shrink-0"
                        title="Download"
                      >
                        <Download size={15} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        {/* ── Right col — Status management ────────────────────────── */}
        <div>
          <AdminCard title="Status Management">
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-3">
                Current status: <span className="font-medium">{app.status}</span>
              </p>
              {STATUSES.map((s) => {
                const isActive  = app.status === s;
                const isBusy    = updating === s;
                return (
                  <button
                    key={s}
                    disabled={isActive || !!updating}
                    onClick={() => handleStatusChange(s)}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium text-left flex items-center gap-3 border transition-all
                      ${isActive
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm cursor-default"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50"
                      }`}
                  >
                    <span className={isActive ? "text-white" : "text-slate-400"}>
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
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
