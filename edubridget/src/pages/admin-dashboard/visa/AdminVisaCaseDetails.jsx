import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Calendar,
  Briefcase,
  DollarSign,
  Mail,
  Phone,
  Globe,
  Video,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { getCountryFlag } from "@/data/mockVisaData";
import { getVisaRequestById } from "@/services/visaService";
import VisaStatusBadge from "@/components/visa/VisaStatusBadge";

// ── Proxy URL helper ───────────────────────────────────────
function toProxyUrl(downloadUrl) {
  try {
    const url = new URL(downloadUrl);
    const match = url.pathname.match(/\/o\/(.+)$/);
    if (!match) return downloadUrl;
    return `/storage-proxy/${match[1]}${url.search}`;
  } catch {
    return downloadUrl;
  }
}

// ── Initials avatar ───────────────────────────────────────────
function InitialsAvatar({ name, size = 48 }) {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center font-medium shrink-0 select-none">
      {initials}
    </div>
  );
}

// ── Document status badge styles ──────────────────────────────
const getDocStatusStyles = (status) => {
  switch (status) {
    case "Verified":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
        icon: <CheckCircle size={12} className="mr-1" />,
      };
    case "Received":
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-100",
        icon: <Clock size={12} className="mr-1" />,
      };
    default:
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-100",
        icon: <AlertCircle size={12} className="mr-1" />,
      };
  }
};

export default function AdminVisaCaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 6;

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const found = await getVisaRequestById(id);
        if (!found) {
          toast.error("Case not found");
          navigate("/admin/visa");
          return;
        }
        setCaseData(found);
      } catch {
        toast.error("Failed to load case");
        navigate("/admin/visa");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id, navigate]);

  // Preview: open file through the storage proxy in a new tab.
  const handlePreview = (doc) => {
    window.open(toProxyUrl(doc.url), "_blank", "noopener,noreferrer");
  };

  // Download: fetch blob via proxy → force local save.
  const handleDownload = async (doc) => {
    try {
      const res = await fetch(toProxyUrl(doc.url));
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
      window.open(toProxyUrl(doc.url), "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Clock size={32} className="mx-auto text-slate-300 animate-spin" />
        <p className="text-slate-400 text-sm mt-3">Loading case details...</p>
      </div>
    );
  }

  if (!caseData) return null;

  const allDocs = caseData.documents ?? [];
  const totalPages = Math.ceil(allDocs.length / documentsPerPage);
  const currentDocs = allDocs.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      {/* Back */}
      <div>
        <button
          onClick={() => navigate("/admin/visa")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} />
          Back to Visa Cases
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-serif text-slate-900 tracking-tight">
          Case Details
        </h1>
        <p className="text-slate-500 text-sm">
          Reviewing case #{caseData.id} — read only view
        </p>
      </div>

      {/* Student Info Card */}
      <Card className="border-slate-200 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <InitialsAvatar name={caseData.fullName} size={56} />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-slate-900">
                {caseData.fullName}
              </h2>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} />
                  {caseData.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={14} />
                  {caseData.phone}
                </span>
                {caseData.countryOfOrigin && (
                  <span className="flex items-center gap-1.5">
                    <Globe size={14} />
                    {caseData.countryOfOrigin}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <VisaStatusBadge status={caseData.status} />
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                Submitted
              </p>
              <p className="text-sm font-medium text-slate-700 mt-1">
                {caseData.submissionDate ?? "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-5">
            <div className="text-3xl mb-3">
              {getCountryFlag(caseData.countryCode)}
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Destination
            </p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {caseData.destination}
            </p>
          </CardContent>
        </Card>

        {/* Visa Type */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-5">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg w-fit mb-3">
              <Briefcase size={20} />
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Visa Type
            </p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {caseData.visaType}
            </p>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg w-fit mb-3">
              <Clock size={20} />
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status
            </p>
            <div className="mt-1">
              <VisaStatusBadge status={caseData.status} />
            </div>
          </CardContent>
        </Card>

        {/* Fee */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <DollarSign size={20} />
              </div>
              {caseData.feeStatus && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                    caseData.feeStatus === "Paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}>
                  {caseData.feeStatus}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Fee
            </p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {caseData.consultationFee || "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Section */}
      <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white text-blue-600 rounded-full shadow-sm border border-blue-100">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Scheduled Appointment
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mt-1">
              <span>
                {caseData.appointmentDate || caseData.preferredDate || "Not yet scheduled"}
                {caseData.appointmentTime ? ` at ${caseData.appointmentTime}` : ""}
              </span>
              {caseData.meetingType && (
                <>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <span className="flex items-center gap-1">
                    <Video size={14} className="text-blue-500" />
                    {caseData.meetingType}
                  </span>
                </>
              )}
            </div>
            {caseData.meetingLink && (
              <a
                href={
                  /^https?:\/\//i.test(caseData.meetingLink)
                    ? caseData.meetingLink
                    : `https://${caseData.meetingLink}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                {caseData.meetingLink}
              </a>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
            Preferred Date
          </p>
          <p className="text-sm font-medium text-slate-700 mt-1">
            {caseData.preferredDate || "—"}
          </p>
        </div>
      </div>

      {/* Notes */}
      {caseData.notes && (
        <Card className="border-slate-200 shadow-sm rounded-xl">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Student Notes
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {caseData.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif text-slate-900">
            Submitted Documents
          </h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            {allDocs.length} {allDocs.length === 1 ? "File" : "Files"}
          </span>
        </div>

        {allDocs.length === 0 ? (
          <div className="flex flex-col items-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <FileText size={32} className="text-slate-300 mb-3" />
            <p className="text-sm text-slate-400">No documents uploaded yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentDocs.map((doc) => {
                const { badge, icon } = getDocStatusStyles(doc.status);
                return (
                  <div
                    key={doc.id}
                    className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="p-2.5 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 text-sm group-hover:text-blue-700 transition-colors truncate">
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">
                            {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : "—"}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400">
                            {doc.uploadedAt
                              ? new Date(doc.uploadedAt).toLocaleDateString()
                              : (doc.date ?? "—")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${badge}`}>
                        {icon}
                        {doc.status}
                      </span>
                      <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                        <button
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Preview"
                          onClick={() => handlePreview(doc)}>
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download"
                          onClick={() => handleDownload(doc)}>
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="gap-2 h-8 text-xs border-slate-200">
                  <ChevronLeft size={14} />
                  Previous
                </Button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-8 w-8 rounded-lg text-xs font-medium transition-all ${
                        currentPage === i + 1
                          ? "bg-slate-900 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}>
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="gap-2 h-8 text-xs border-slate-200">
                  Next
                  <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
