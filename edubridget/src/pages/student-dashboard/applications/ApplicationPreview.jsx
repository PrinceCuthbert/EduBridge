// src/pages/dashboard/ApplicationPreview.jsx
// Student read-only view of a single application


import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, Mail, Phone, Calendar } from "lucide-react";
import { getApplicationById } from "../../../services/applicationService";
import StatusBadge from "../../../components/shared/StatusBadge";

export default function ApplicationPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = getApplicationById(id);

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500">Application not found.</p>
        <button
          onClick={() => navigate("/dashboard/applications")}
          className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });

  const getFileIcon = (type = "") => {
    if (type.includes("image")) return "🖼️";
    if (type.includes("zip"))   return "📦";
    if (type.includes("word") || type.includes("document")) return "📝";
    return "📄";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Back */}
      <button
        onClick={() => navigate("/dashboard/applications")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Applications
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-slate-400 mb-1">{app.id}</p>
            <h1 className="text-xl font-bold text-slate-900">{app.universityName}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{app.programName}</p>
          </div>
          <StatusBadge status={app.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applicant info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Applicant Details
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <span className="font-bold text-xs text-slate-700">
                  {(app.firstName?.[0] ?? "") + (app.lastName?.[0] ?? "")}
                </span>
              </div>
              <span className="font-medium text-slate-900">
                {app.firstName} {app.lastName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail size={15} className="text-slate-400 shrink-0" />
              {app.email}
            </div>
            {app.phone && (
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={15} className="text-slate-400 shrink-0" />
                {app.phone}
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Calendar size={15} className="text-slate-400 shrink-0" />
              Submitted {formatDate(app.submissionDate)}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
            Uploaded Documents
          </h2>
          {!app.documents?.length ? (
            <p className="text-sm text-slate-400 italic">No documents uploaded.</p>
          ) : (
            <div className="space-y-2">
              {app.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 group hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{getFileIcon(doc.type)}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-700 font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-slate-400">
                        {(doc.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      download={doc.name}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors ml-2 shrink-0"
                      title="Download"
                    >
                      <Download size={15} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
