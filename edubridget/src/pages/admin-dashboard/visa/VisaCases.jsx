// ─────────────────────────────────────────────────────────────
//  src/pages/admin/VisaCases.jsx
//
//  WHAT CHANGED vs the original:
//  - Removed all inline getStatusColor() / status logic
//  - Removed all inline useState for cases + loading (now in hook)
//  - Removed fetchCases useEffect (now in hook)
//  - Removed ui-avatars.com image — replaced with initials avatar
//    (no external image request, works offline)
//  - VisaStatusBadge replaces inline status span
//  - useAdminVisaCases provides all CRUD operations
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  Globe,
  MapPin,
  Video,
  Link as LinkIcon,
  FileText,
  Download,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import Modal from "@/components/Modal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatsGrid from "@/components/admin/AdminStatsGrid";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminTable from "@/components/admin/AdminTable";

import { useAdminVisaCases } from "@/hooks/useAdminVisaCases";
import VisaStatusBadge, {
  VISA_STATUS_CONFIG,
} from "@/components/visa/VisaStatusBadge";
import { VISA_TYPES, VISA_COUNTRIES, MEETING_TYPES } from "@/data/mockVisaData";

// ── Initials avatar (replaces ui-avatars.com) ────────────────
// Works offline, no external dependency, matches the app's style.
function InitialsAvatar({ name, size = 36 }) {
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

// ── Blank form state ──────────────────────────────────────────
const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  countryOfOrigin: "",
  destination: "",
  countryCode: "",
  visaType: "",
  preferredDate: "",
  meetingType: "Video Call",
  notes: "",
  status: "New",
  consultationFee: "",
  feeStatus: "Unpaid",
};

export default function VisaCases() {
  // ── Data — all logic lives in the hook ───────────────────
  const {
    cases,
    loading,
    addCase,
    setStatus,
    setFee,
    setSchedule,
    removeCase,
  } = useAdminVisaCases();

  // ── Local UI state (modal open/close, form, filters) ─────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [scheduleData, setScheduleData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    meetingType: "Zoom",
    meetingLink: "",
  });
  const [savingStatus, setSavingStatus] = useState(null);

  // ── Stats (derived from cases, not stored in state) ──────
  const stats = useMemo(
    () => [
      {
        label: "Total Cases",
        value: cases.length,
        icon: Globe,
        color: "text-blue-600",
        bg: "bg-blue-50",
        trend: "+12%",
      },
      {
        label: "Active Review",
        value: cases.filter(
          (c) => c.status === "In Progress" || c.status === "New",
        ).length,
        icon: Search,
        color: "text-amber-600",
        bg: "bg-amber-50",
        trend: `${cases.filter((c) => c.status === "New").length} new`,
      },
      {
        label: "Approved",
        value: cases.filter((c) => c.status === "Approved").length,
        icon: Globe,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        trend: "98% rate",
      },
    ],
    [cases],
  );

  // ── Filtering (computed, not stored) ─────────────────────
  const filteredCases = useMemo(
    () =>
      cases.filter((c) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          c.fullName?.toLowerCase().includes(q) ||
          c.destination?.toLowerCase().includes(q);
        const matchesStatus =
          statusFilter === "All" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [cases, searchQuery, statusFilter],
  );

  // ── Handlers ─────────────────────────────────────────────

  const handleOpenAdd = () => {
    setEditingCase(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (caseItem) => {
    setEditingCase(caseItem);
    setFormData({ ...caseItem });
    setIsModalOpen(true);
  };

  const handleOpenDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setScheduleData({
      appointmentDate: caseItem.appointmentDate ?? "",
      appointmentTime: caseItem.appointmentTime ?? "",
      meetingType: caseItem.meetingType ?? "Zoom",
      meetingLink: caseItem.meetingLink ?? "",
    });
    setIsDetailsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCase) {
        // For editing, update status + fee separately (hook enforces separation)
        await setStatus(editingCase.id, formData.status);
        await setFee(
          editingCase.id,
          formData.consultationFee,
          formData.feeStatus,
        );
        toast.success("Case updated successfully");
      } else {
        await addCase(formData);
        toast.success("Case added successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    setSavingStatus(status);
    try {
      await setStatus(id, status);
      // Refresh selected case in detail modal
      setSelectedCase((prev) => (prev ? { ...prev, status } : prev));
      toast.success(`Status updated to "${status}"`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingStatus(null);
    }
  };

  const handleSaveSchedule = async () => {
    if (!selectedCase) return;
    try {
      const updated = await setSchedule(selectedCase.id, scheduleData);
      setSelectedCase(updated);
      toast.success("Meeting scheduled. Student will see the join link.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = (caseItem) => {
    toast.warning(`Delete case for ${caseItem.fullName}?`, {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await removeCase(caseItem.id);
            toast.success("Case deleted");
          } catch (err) {
            toast.error(err.message);
          }
        },
      },
      cancel: { label: "Cancel" },
      duration: 8000,
    });
  };

  // ── Table columns ─────────────────────────────────────────
  const columns = [
    {
      header: "Client",
      render: (c) => (
        <div className="flex items-center gap-3">
          <InitialsAvatar name={c.fullName} />
          <div>
            <p className="text-sm font-medium text-slate-900">{c.fullName}</p>
            <p className="text-xs text-slate-500">{c.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Visa Details",
      render: (c) => (
        <div>
          <p className="text-sm font-medium text-slate-900">{c.visaType}</p>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MapPin size={12} />
            {c.destination}
          </div>
        </div>
      ),
    },
    {
      header: "Appointment",
      render: (c) => (
        <div>
          <p className="text-sm text-slate-700">
            {c.appointmentDate || c.preferredDate || "—"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{c.meetingType}</p>
        </div>
      ),
    },
    {
      header: "Fee",
      render: (c) => (
        <div>
          <span className="text-sm font-medium text-emerald-600">
            {c.consultationFee || "—"}
          </span>
          {c.feeStatus && (
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
              {c.feeStatus}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      className: "text-center",
      render: (c) => (
        <div className="flex justify-center">
          {/* VisaStatusBadge — no inline colour logic needed */}
          <VisaStatusBadge status={c.status} />
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (c) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenDetails(c)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleOpenEdit(c)}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(c)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader
        title="Visa Consultations"
        subtitle="Manage visa applications and sessions"
        count={filteredCases.length}
        primaryAction={{
          label: "Add Case",
          icon: Plus,
          onClick: handleOpenAdd,
        }}
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by client or country..."
        filterOptions={["All", ...Object.keys(VISA_STATUS_CONFIG)]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <AdminTable
        columns={columns}
        data={filteredCases}
        isLoading={loading}
        emptyState={
          !loading && (
            <div className="flex flex-col items-center max-w-sm mx-auto py-12">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <Search size={32} className="text-slate-300" />
              </div>
              <h4 className="text-lg font-medium text-slate-900 mb-1">
                No cases found
              </h4>
              <p className="text-sm text-slate-500 mb-6 text-center">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                Clear Filters
              </button>
            </div>
          )
        }
      />

      {/* ── ADD / EDIT MODAL ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCase ? "Edit Case" : "Add New Case"}
        size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Client Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  placeholder="Full Name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  placeholder="client@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                placeholder="+254..."
              />
            </div>

            {/* Destination */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Destination
              </label>
              <select
                required
                value={formData.destination}
                onChange={(e) => {
                  const country = VISA_COUNTRIES.find(
                    (c) => c.name === e.target.value,
                  );
                  setFormData({
                    ...formData,
                    destination: e.target.value,
                    countryCode: country?.code ?? "",
                  });
                }}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                <option value="">Select Country</option>
                {VISA_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Visa type */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Visa Type
              </label>
              <select
                required
                value={formData.visaType}
                onChange={(e) =>
                  setFormData({ ...formData, visaType: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                <option value="">Select Type</option>
                {VISA_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Fee (admin only field) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Consultation Fee
              </label>
              <input
                type="text"
                value={formData.consultationFee}
                onChange={(e) =>
                  setFormData({ ...formData, consultationFee: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                placeholder="$150"
              />
            </div>
          </div>

          {/* Status buttons */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(VISA_STATUS_CONFIG).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s })}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                    formData.status === s
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-sm">
              {loading
                ? "Saving..."
                : editingCase
                  ? "Save Changes"
                  : "Create Case"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── DETAIL MODAL ── */}
      {selectedCase && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title="Case Details & Management"
          size="lg">
          <div className="space-y-6">
            {/* Client header */}
            <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
              <InitialsAvatar name={selectedCase.fullName} size={56} />
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {selectedCase.fullName}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} /> {selectedCase.email}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} /> {selectedCase.phone}
                  </span>
                </div>
                <div className="mt-2">
                  <VisaStatusBadge status={selectedCase.status} />
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Destination",
                  value: selectedCase.destination,
                  icon: Globe,
                },
                { label: "Visa Type", value: selectedCase.visaType },
                {
                  label: "Preferred Date",
                  value: selectedCase.preferredDate,
                  icon: Calendar,
                },
                {
                  label: "Fee",
                  value: selectedCase.consultationFee || "Not set",
                  className: "text-emerald-600",
                },
              ].map(({ label, value, icon: Icon, className }) => (
                <div key={label} className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {label}
                  </p>
                  <p
                    className={`text-sm font-medium text-slate-900 flex items-center gap-2 ${className ?? ""}`}>
                    {Icon && <Icon size={14} className="text-slate-400" />}
                    {value}
                  </p>
                </div>
              ))}
              {selectedCase.notes && (
                <div className="col-span-2 space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Notes
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedCase.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Status management */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(VISA_STATUS_CONFIG).map((s) => (
                  <button
                    key={s}
                    disabled={savingStatus === s}
                    onClick={() => handleStatusChange(selectedCase.id, s)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                      selectedCase.status === s
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}>
                    {savingStatus === s ? "Saving..." : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheduler */}
            <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Schedule Consultation Meeting
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduleData.appointmentDate}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        appointmentDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleData.appointmentTime}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        appointmentTime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Format
                  </label>
                  <div className="relative">
                    <Video
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      value={scheduleData.meetingType}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          meetingType: e.target.value,
                        })
                      }
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500">
                      {[
                        "Zoom",
                        "Google Meet",
                        "Microsoft Teams",
                        "In Person",
                      ].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Meeting Link / Address
                  </label>
                  <div className="relative">
                    <LinkIcon
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={scheduleData.meetingLink}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          meetingLink: e.target.value,
                        })
                      }
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveSchedule}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                  Save &amp; Notify Student
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsDetailsOpen(false)}
              className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
