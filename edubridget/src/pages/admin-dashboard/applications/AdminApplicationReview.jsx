// src/pages/admin/AdminApplicationReview.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, Calendar, FileText, Download, Hash,
  GraduationCap, AlertCircle, CheckCircle, XCircle, Clock, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import AdminCard   from "../../../components/admin/AdminCard";
import StatusBadge from "../../../components/shared/StatusBadge";
import { useApplications } from "../../../hooks/useApplications";
import { useAuth } from "../../../context/AuthContext";
import { formatDateLong } from "../../../utils/formatDate";

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

const getFileIcon = (fileName = "") => {
  const lowerName = fileName.toLowerCase();
  if (lowerName.match(/\.(jpeg|jpg|gif|png)$/)) return "🖼️";
  if (lowerName.match(/\.(zip|rar)$/))   return "📦";
  if (lowerName.match(/\.(doc|docx)$/)) return "📝";
  if (lowerName.match(/\.(pdf)$/)) return "📄";
  return "📄";
};

export default function AdminApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Consume the Hook (Acting as the Controller)
  // Passing 'id' tells the hook to isolate just this application.
  const { hasPermission } = useAuth();
  const canUpdateStatus = hasPermission("update_app_status");

  const {
    singleApplication: app,
    loading,
    updateStatus
  } = useApplications({trackerId: id});

  const [updating, setUpdating] = useState(null);

  // 2. Handle Status Change via the Hook
  const handleStatusChange = async (status) => {
    if (updating || app?.status === status) return;
    setUpdating(status);
    
    try {
      // updateStatus is an async function from our hook
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
         <button onClick={() => navigate("/admin/applications")} className="px-4 py-2 bg-slate-900 text-white rounded-lg">Go Back</button>
      </div>
    );
  }

  // 3. Read data from the nested applicant DTO
  const initials = ((app.applicant?.firstName?.[0] ?? "") + (app.applicant?.lastName?.[0] ?? "")).toUpperCase() || "?";

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
              <span className="font-mono">{app.trackerId}</span>
              <span className="text-slate-300">•</span>
              <span>{app.applicant?.firstName} {app.applicant?.lastName}</span>
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
                    {app.applicant?.firstName} {app.applicant?.lastName}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Mail size={13} /> Email
                    </p>
                    <p className="text-sm font-medium text-slate-900 truncate">{app.applicant?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Phone size={13} /> Phone
                    </p>
                    <p className="text-sm font-medium text-slate-900">{app.applicant?.phone || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Hash size={13} /> Tracker ID
                    </p>
                    <p className="text-sm font-mono text-slate-900">{app.trackerId}</p>
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
                <h3 className="text-base font-bold text-slate-900">{app.programDetails?.universityName}</h3>
                <p className="text-sm text-slate-500">{app.programDetails?.majorName}</p>
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
                        <span className="text-base">{getFileIcon(doc.name)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                        <p className="text-xs text-slate-400">
                          {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : "—"} · {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}
                        </p>
                      </div>
                    </div>
                    <button
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors ml-2 shrink-0"
                      title="Download"
                      onClick={() => {
                        if (doc.url) {
                          const a = document.createElement("a");
                          a.href = doc.url;
                          a.download = doc.name;
                          a.click();
                        } else {
                          toast.error("File data not available.");
                        }
                      }}
                    >
                      <Download size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        {/* ── Right col — Status management ────────────────────────── */}
        <div>
          <AdminCard title="Status Management">
            {!canUpdateStatus ? (
              <p className="text-xs text-slate-400 italic">
                You do not have permission to change the application status.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 mb-3">
                  Current status: <span className="font-medium text-slate-800">{app.status}</span>
                </p>
                {STATUSES.map((s) => {
                  const isActive = app.status === s;
                  const isBusy   = updating === s;
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
                        {isBusy ? <Loader2 size={14} className="animate-spin" /> : statusIcon(s)}
                      </span>
                      {s}
                    </button>
                  );
                })}
              </div>
            )}
          </AdminCard>
        </div>
      </div>
    </div>
  );
}