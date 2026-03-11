import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Upload,
  Globe,
  UserCheck,
  DollarSign,
  MapPin,
  Eye,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Search,
  Video,
  Link as LinkIcon,
  Download
} from "lucide-react";
import { toast } from "sonner";
import Modal from "../../../components/Modal";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../../components/admin/AdminStatsGrid";
import AdminFilterBar from "../../../components/admin/AdminFilterBar";
import AdminTable from "../../../components/admin/AdminTable";

import { MOCK_VISA_CASES as MOCK_CASES } from "../../../data/adminMockData";

export default function VisaCases() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
    type: "Zoom",
    link: "",
  });
  
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    country: "",
    visaType: "",
    appointmentDate: "",
    appointmentType: "Online",
    consultationFee: "",
    status: "New",
    documents: [],
    notes: "",
  });

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setCases(MOCK_CASES);
      } catch (error) {
        toast.error("Failed to load cases");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const stats = useMemo(() => [
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
      value: cases.filter((c) => c.status === "In Progress" || c.status === "New").length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "4 pending",
    },
    {
      label: "Approved",
      value: cases.filter((c) => c.status === "Approved").length,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "98% rate",
    },
    
  ], [cases]);

  const handleAddCase = () => {
    setEditingCase(null);
    setFormData({
      clientName: "", email: "", phone: "", country: "", visaType: "",
      appointmentDate: "", appointmentType: "Online", consultationFee: "",
      status: "New", documents: [], notes: "",
    });
    setIsModalOpen(true);
  };

  const handleEditCase = (caseItem) => {
    setEditingCase(caseItem);
    setFormData({ ...caseItem });
    setIsModalOpen(true);
  };

  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setScheduleData({
      date: caseItem.appointmentDate || "",
      time: caseItem.appointmentTime || "",
      type: caseItem.meetingType || "Zoom",
      link: caseItem.meetingLink || ""
    });
    setIsDetailsOpen(true);
  };

  const handleSaveSchedule = () => {
    setCases(cases.map((c) =>
      c.id === selectedCase.id
        ? {
            ...c,
            appointmentDate: scheduleData.date,
            appointmentTime: scheduleData.time,
            meetingType: scheduleData.type,
            meetingLink: scheduleData.link,
          }
        : c
    ));
    setSelectedCase((prev) => ({
      ...prev,
      appointmentDate: scheduleData.date,
      appointmentTime: scheduleData.time,
      meetingType: scheduleData.type,
      meetingLink: scheduleData.link,
    }));
    toast.success("Meeting scheduled successfully. Student will see the join link.");
  };

  const handleDeleteCase = (caseItem) => {
    toast(`Delete case for ${caseItem.clientName}?`, {
      action: {
        label: "Delete",
        onClick: () => {
          setCases(cases.filter((c) => c.id !== caseItem.id));
          toast.success("Case deleted");
        },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (editingCase) {
      setCases(cases.map((c) => (c.id === editingCase.id ? { ...c, ...formData } : c)));
      toast.success("Case updated successfully");
    } else {
      const newCase = {
        id: Math.max(...cases.map((c) => c.id), 0) + 1,
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCases([...cases, newCase]);
      toast.success("Case added successfully");
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  const filteredCases = useMemo(() => cases.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  }),[cases,searchQuery,statusFilter]);

  const columns = [
    {
      header: "Client",
      render: (caseItem) => (
        <div className="flex items-center gap-3">
          <img 
            src={`https://ui-avatars.com/api/?name=${caseItem.clientName}&background=f1f5f9&color=6366f1`} 
            className="w-9 h-9 rounded-full border border-slate-200"
            alt={caseItem.clientName}
          />
          <div>
            <p className="text-sm font-medium text-slate-900">{caseItem.clientName}</p>
            <p className="text-xs text-slate-500">{caseItem.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Visa Details",
      render: (caseItem) => (
        <div>
          <p className="text-sm font-medium text-slate-900">{caseItem.visaType}</p>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
             <MapPin size={12} />
             {caseItem.country}
          </div>
        </div>
      )
    },
    {
      header: "Appointment",
      render: (caseItem) => (
        <div>
          <p className="text-sm text-slate-700">{caseItem.appointmentDate}</p>
          <p className="text-xs text-slate-500 mt-0.5">{caseItem.appointmentType}</p>
        </div>
      )
    },
    {
      header: "Fee",
      render: (caseItem) => (
        <span className="text-sm font-medium text-emerald-600">{caseItem.consultationFee}</span>
      )
    },
    {
      header: "Status",
      className: "text-center",
      render: (caseItem) => {
        let styles = "bg-slate-100 text-slate-600 border-slate-200";
        if (caseItem.status === "Approved") styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (caseItem.status === "In Progress") styles = "bg-amber-50 text-amber-700 border-amber-200";
        if (caseItem.status === "Rejected") styles = "bg-red-50 text-red-700 border-red-200";
        
        return (
          <div className="flex justify-center">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}>
              {caseItem.status}
            </span>
          </div>
        );
      }
    },
    {
      header: "Actions",
      className: "text-right",
      render: (caseItem) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleViewDetails(caseItem)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye size={16} />
          </button>
          <button onClick={() => handleEditCase(caseItem)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDeleteCase(caseItem)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="Visa Consultations" 
        subtitle="Manage visa applications and sessions"
        count={filteredCases.length}
        primaryAction={{
          label: "Add Case",
          icon: Plus,
          onClick: handleAddCase,
        }}
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by client or country..."
        filterOptions={["All", "New", "In Progress", "Approved", "Rejected"]}
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
              <h4 className="text-lg font-medium text-slate-900 mb-1">No cases found</h4>
              <p className="text-sm text-slate-500 mb-6 text-center">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button 
                onClick={() => {setSearchQuery(""); setStatusFilter("All");}}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
           )
        }
      />

      {/* EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCase ? "Edit Case" : "Add New Case"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Client Name</label>
                <div className="relative">
                   <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input
                     type="text" required
                     value={formData.clientName}
                     onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                     className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                     placeholder="Full Name"
                   />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                   <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input
                     type="email" required
                     value={formData.email}
                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                     className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                     placeholder="client@email.com"
                   />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Phone</label>
                 <input
                   type="tel" required
                   value={formData.phone}
                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                   className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                   placeholder="+254..."
                 />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Destination</label>
                 <select
                   required
                   value={formData.country}
                   onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                   className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                   <option value="">Select Country</option>
                   <option value="Canada">Canada</option>
                   <option value="USA">USA</option>
                   <option value="UK">United Kingdom</option>
                   <option value="Australia">Australia</option>
                 </select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Visa Type</label>
                 <select
                   required
                   value={formData.visaType}
                   onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                   className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                   <option value="">Select Type</option>
                   <option value="Study Visa">Study Visa</option>
                   <option value="Work Visa">Work Visa</option>
                   <option value="Tourist Visa">Tourist Visa</option>
                 </select>
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Fee ($)</label>
                 <input
                   type="text" required
                   value={formData.consultationFee}
                   onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                   className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                   placeholder="150"
                 />
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700">Status</label>
               <div className="flex flex-wrap gap-2">
                  {["New", "In Progress", "Approved", "Rejected"].map((status) => (
                    <button
                      key={status} type="button"
                      onClick={() => setFormData({ ...formData, status })}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all border ${
                        formData.status === status
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Internal Notes</label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="Add notes..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              {loading ? "Saving..." : (editingCase ? "Save Changes" : "Create Case")}
            </button>
          </div>
        </form>
      </Modal>

      {/* DETAILS MODAL */}
      {selectedCase && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title="Case Details & Management"
          size="lg"
        >
          <div className="space-y-6">
             {/* Header */}
             <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                <img 
                  src={`https://ui-avatars.com/api/?name=${selectedCase.clientName}&background=f1f5f9&color=6366f1`} 
                  className="w-16 h-16 rounded-full border border-slate-200"
                  alt={selectedCase.clientName}
                />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedCase.clientName}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-slate-500">
                     <span className="flex items-center gap-1.5"><Mail size={14} /> {selectedCase.email}</span>
                     <span className="hidden sm:inline">•</span>
                     <span className="flex items-center gap-1.5"><Phone size={14} /> {selectedCase.phone}</span>
                  </div>
                  <div className="mt-3">
                     <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                       {selectedCase.status}
                     </span>
                  </div>
                </div>
             </div>

             {/* Info Grid */}
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                   <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Destination</p>
                   <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                     <Globe size={14} className="text-slate-400" />
                     {selectedCase.country}
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Visa Type</p>
                   <p className="text-sm font-medium text-slate-900">{selectedCase.visaType}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Appointment</p>
                   <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                     <Calendar size={14} className="text-slate-400" />
                     {selectedCase.appointmentDate}
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fee</p>
                   <p className="text-sm font-medium text-emerald-600">{selectedCase.consultationFee}</p>
                </div>
             </div>

             {/* Documents Section */}
             {selectedCase.documents && selectedCase.documents.length > 0 && (
               <div className="space-y-3">
                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted Documents</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {selectedCase.documents.map((doc, idx) => (
                     <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                           <FileText size={16} />
                         </div>
                         <p className="text-sm font-medium text-slate-900 truncate max-w-[120px]">{typeof doc === 'string' ? doc : doc.name || 'Document'}</p>
                       </div>
                       <div className="flex items-center gap-2">
                         <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View"><Eye size={14} /></button>
                         <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded" title="Download"><Download size={14} /></button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* Admin Meeting Scheduler */}
             <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={18} className="text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">Schedule Consultation Meeting</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Date</label>
                    <input 
                      type="date" 
                      value={scheduleData.date}
                      onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Time</label>
                    <input 
                      type="time" 
                      value={scheduleData.time}
                      onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Form of Communication</label>
                    <div className="relative">
                      <Video size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select 
                        value={scheduleData.type}
                        onChange={(e) => setScheduleData({...scheduleData, type: e.target.value})}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Zoom">Zoom Meeting</option>
                        <option value="Google Meet">Google Meet</option>
                        <option value="Microsoft Teams">Microsoft Teams</option>
                        <option value="In Person">In Person (Office)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Meeting Link / Address</label>
                    <div className="relative">
                      <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="url"
                        placeholder="https://..."
                        value={scheduleData.link}
                        onChange={(e) => setScheduleData({...scheduleData, link: e.target.value})}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button 
                    onClick={handleSaveSchedule}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                  >
                    Save & Notify Student
                  </button>
                </div>
             </div>

             <div className="pt-2">
                <button 
                  onClick={() => setIsDetailsOpen(false)} 
                  className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  Close Details
                </button>
             </div>
          </div>
        </Modal>
      )}
    </div>
  );
}