import React, { useState, useEffect } from "react";
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
  ArrowRight,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import Modal from "../../components/Modal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import AdminFilterBar from "../../components/admin/AdminFilterBar";
import AdminTable from "../../components/admin/AdminTable";

// Mock data moved outside component
const MOCK_CASES = [
  {
    id: 1,
    clientName: "John Kariuki",
    email: "john.k@email.com",
    phone: "+254 700 123 456",
    country: "Canada",
    visaType: "Study Visa",
    appointmentDate: "2024-02-15",
    appointmentType: "Online",
    consultationFee: "$150",
    status: "In Progress",
    documents: ["Passport", "Admission Letter", "Bank Statement"],
    notes: "All documents submitted",
    createdAt: "2024-02-01",
  },
  {
    id: 2,
    clientName: "Sarah Wanjiku",
    email: "sarah.w@email.com",
    phone: "+254 722 456 789",
    country: "UK",
    visaType: "Work Visa",
    appointmentDate: "2024-02-18",
    appointmentType: "Offline",
    consultationFee: "$200",
    status: "Approved",
    documents: ["Passport", "Job Offer", "Police Clearance"],
    notes: "Visa approved",
    createdAt: "2024-01-25",
  },
  {
    id: 3,
    clientName: "David Omondi",
    email: "david.o@email.com",
    phone: "+254 711 987 654",
    country: "USA",
    visaType: "General Visit",
    appointmentDate: "2024-02-20",
    appointmentType: "Online",
    consultationFee: "$100",
    status: "Pending Documents",
    documents: ["Passport"],
    notes: "Missing bank statement",
    createdAt: "2024-02-05",
  },
  {
    id: 4,
    clientName: "Grace Mutua",
    email: "grace.m@email.com",
    phone: "+254 733 456 789",
    country: "USA",
    visaType: "Business Visa",
    appointmentDate: "2024-02-12",
    appointmentType: "Offline",
    consultationFee: "$250",
    status: "Rejected",
    documents: ["Passport", "Business License", "Tax Returns"],
    notes: "Resubmission recommended",
    createdAt: "2024-01-20",
  },
];

export default function VisaCases() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewingDocument, setViewingDocument] = useState(null);

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

  // Cases state initialized as empty array
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        // Simulating API call
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

  const stats = [
    {
      label: "Global Cases",
      value: cases.length,
      icon: Globe,
      color: "text-blue-600",
      bg: "bg-blue-50/50",
      trend: "+12% this month",
    },
    {
      label: "Active Review",
      value: cases.filter((c) => c.status === "In Progress" || c.status === "New").length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50/50",
      trend: "4 pending docs",
    },
    {
      label: "Visa Approvals",
      value: cases.filter((c) => c.status === "Approved").length,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50/50",
      trend: "98% success rate",
    },
    {
      label: "Visa Revenue",
      value: `$${cases.reduce((sum, c) => sum + parseInt(c.consultationFee.replace("$", "") || 0), 0)}`,
      icon: DollarSign,
      color: "text-indigo-600",
      bg: "bg-indigo-50/50",
      trend: "Direct transactions",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "New": return <Clock size={14} className="text-blue-500" />;
      case "In Progress": return <AlertCircle size={14} className="text-yellow-500" />;
      case "Pending Documents": return <Upload size={14} className="text-orange-500" />;
      case "Approved": return <CheckCircle size={14} className="text-green-500" />;
      case "Rejected": return <XCircle size={14} className="text-red-500" />;
      default: return <AlertCircle size={14} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "bg-blue-50 text-blue-700 border-blue-100";
      case "In Progress": return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "Pending Documents": return "bg-orange-50 text-orange-700 border-orange-100";
      case "Approved": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Rejected": return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const handleAddCase = () => {
    setEditingCase(null);
    setFormData({
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
    setIsModalOpen(true);
  };

  const handleEditCase = (caseItem) => {
    setEditingCase(caseItem);
    setFormData({ ...caseItem });
    setIsModalOpen(true);
  };

  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setIsDetailsOpen(true);
  };

  const handleDeleteCase = (caseItem) => {
    toast(`Are you sure you want to delete case for ${caseItem.clientName}?`, {
      action: {
        label: "Delete",
        onClick: () => {
          setCases(cases.filter((c) => c.id !== caseItem.id));
          toast.success(`Case for ${caseItem.clientName} deleted successfully`);
        },
      },
      cancel: { label: "Cancel" },
      duration: 5000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (editingCase) {
      setCases(cases.map((c) => (c.id === editingCase.id ? { ...c, ...formData } : c)));
      toast.success(`Case for ${formData.clientName} updated successfully`);
    } else {
      const newCase = {
        id: Math.max(...cases.map((c) => c.id), 0) + 1,
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCases([...cases, newCase]);
      toast.success(`Case for ${formData.clientName} added successfully`);
    }

    setLoading(false);
    setIsModalOpen(false);
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: "Client Profile",
      render: (caseItem) => (
        <div className="flex items-center gap-4">
          <img 
            src={`https://ui-avatars.com/api/?name=${caseItem.clientName}&background=f1f5f9&color=6366f1`} 
            className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm"
            alt={caseItem.clientName}
          />
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">{caseItem.clientName}</span>
            <span className="text-[10px] font-bold text-slate-400 mt-0.5">{caseItem.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "Visa Category",
      render: (caseItem) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">{caseItem.visaType}</span>
          <span className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1.5 uppercase">
             <MapPin size={10} className="text-slate-300" />
             {caseItem.country}
          </span>
        </div>
      )
    },
    {
      header: "Appointment",
      render: (caseItem) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">{caseItem.appointmentDate}</span>
          <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{caseItem.appointmentType} Meeting</span>
        </div>
      )
    },
    {
      header: "Fee",
      render: (caseItem) => (
        <span className="text-sm font-bold text-emerald-600">{caseItem.consultationFee}</span>
      )
    },
    {
      header: "Status",
      className: "text-center",
      render: (caseItem) => (
        <div className="flex justify-center">
          <span
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${getStatusColor(caseItem.status)}`}>
            {getStatusIcon(caseItem.status)}
            {caseItem.status}
          </span>
        </div>
      )
    },
    {
      header: "Actions",
      className: "text-right",
      render: (caseItem) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleViewDetails(caseItem)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            title="View Details">
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEditCase(caseItem)}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            title="Edit">
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteCase(caseItem)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <AdminPageHeader 
        title="Visa Consultations" 
        subtitle="Manage visa applications and student consultation sessions."
        count={filteredCases.length}
        countLabel="Active Cases"
        primaryAction={{
          label: "Add New Case",
          icon: Plus,
          onClick: handleAddCase,
          rotateIcon: true
        }}
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, ID, or country..."
        filterOptions={["All", "New", "In Progress", "Approved", "Rejected"]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <AdminTable 
        columns={columns}
        data={filteredCases}
        isLoading={loading}
        emptyState={
           <div className="flex flex-col items-center max-w-sm mx-auto">
              <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6 ring-8 ring-slate-50/50 border border-white">
                <Search size={32} className="text-slate-200" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">No Records Found</h4>
              <p className="text-sm font-bold text-slate-400 leading-relaxed mb-8">
                No migration cases match your active filters.
              </p>
              <button 
                onClick={() => {setSearchQuery(""); setStatusFilter("All");}}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all active:scale-95">
                RESET DISCOVERY
              </button>
            </div>
        }
      />

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCase ? "Edit Visa Case" : "Add New Visa Case"}
        size="lg"
        className="rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Client Name</label>
              <div className="relative group">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none font-medium text-slate-800 transition-all shadow-sm"
                  placeholder="Full Name"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Email Address</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none font-medium text-slate-800 transition-all shadow-sm"
                  placeholder="Email"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Phone Number</label>
              <div className="relative group">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none font-medium text-slate-800 transition-all shadow-sm"
                  placeholder="Phone"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Destination Country</label>
              <div className="relative group">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors z-10" />
                <select
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm appearance-none">
                  <option value="">Select Destination</option>
                  <option value="Canada">Canada</option>
                  <option value="USA">USA</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Visa Category</label>
              <select
                required
                value={formData.visaType}
                onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm">
                <option value="">Select Category</option>
                <option value="Study Visa">Study Visa</option>
                <option value="Work Visa">Work Visa</option>
                <option value="Tourist Visa">Tourist Visa</option>
                <option value="Business Visa">Business Visa</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Consultation Fee</label>
              <div className="relative group">
                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm"
                  placeholder="$0.00"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Appointment Date</label>
              <div className="relative group">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="date"
                  required
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Meeting Type</label>
              <select
                required
                value={formData.appointmentType}
                onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm">
                <option value="Online">Online Meeting</option>
                <option value="Offline">In-Person Meeting</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Case Status</label>
            <div className="flex flex-wrap gap-2 p-1 bg-slate-50 border border-slate-100 rounded-xl">
              {["New", "In Progress", "Pending Documents", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, status })}
                  className={`flex-1 px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    formData.status === status
                      ? "bg-white text-blue-600 shadow-sm border border-blue-50"
                      : "text-slate-400 hover:text-slate-600"
                  }`}>
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none font-medium text-slate-800 transition-all shadow-sm resize-none"
              placeholder="Administrative notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-slate-500 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all active:scale-95">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 active:scale-95">
              {loading ? "Saving..." : (editingCase ? "Save Changes" : "Add Case")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      {selectedCase && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title="Case Details"
          size="lg"
          className="rounded-3xl">
          <div className="space-y-8 p-4">
            {/* Profile Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
               <div className="flex flex-col md:flex-row items-center gap-6">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${selectedCase.clientName}&background=fff&color=6366f1`} 
                    className="w-16 h-16 rounded-xl border-2 border-white/20 shadow-xl shrink-0" 
                    alt={selectedCase.clientName}
                  />
                  <div className="flex-1 text-center md:text-left">
                     <h3 className="text-xl font-bold tracking-tight mb-1">{selectedCase.clientName}</h3>
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <span className="text-xs font-medium opacity-90 flex items-center gap-1.5">
                           <Mail size={14} /> {selectedCase.email}
                        </span>
                        <span className="text-xs font-medium opacity-90 flex items-center gap-1.5">
                           <Phone size={14} /> {selectedCase.phone}
                        </span>
                     </div>
                  </div>
                  <div className="shrink-0">
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/20 flex items-center gap-2`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {selectedCase.status}
                     </span>
                  </div>
               </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                     <Globe size={14} className="text-blue-500" />
                     Consultation Details
                  </h4>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-xs font-bold text-slate-400">Country</span>
                        <span className="text-xs font-bold text-slate-900">{selectedCase.country}</span>
                     </div>
                     <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-xs font-bold text-slate-400">Visa Category</span>
                        <span className="text-xs font-bold text-slate-900">{selectedCase.visaType}</span>
                     </div>
                  </div>
               </div>
               <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                     <Calendar size={14} className="text-blue-500" />
                     Session Schedule
                  </h4>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-xs font-bold text-slate-400">Date</span>
                        <span className="text-xs font-bold text-slate-900">{selectedCase.appointmentDate}</span>
                     </div>
                     <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-xs font-bold text-slate-400">Type</span>
                        <span className="text-xs font-bold text-slate-900">{selectedCase.appointmentType}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Documents */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText size={14} className="text-blue-500" />
                  Files & Documents ({selectedCase.documents.length})
               </h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCase.documents.map((doc, index) => (
                    <button
                      key={index}
                      onClick={() => setViewingDocument(doc)}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <FileText size={16} />
                         </div>
                         <span className="text-xs font-bold text-slate-700">{doc}</span>
                      </div>
                      <ArrowRight size={14} className="text-slate-300" />
                    </button>
                  ))}
               </div>
            </div>

            {/* Admin Notes */}
            {selectedCase.notes && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Internal Notes</h4>
                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                   <p className="text-sm font-medium text-amber-900/80 leading-relaxed">{selectedCase.notes}</p>
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-slate-100 flex justify-end">
               <button 
                  onClick={() => setIsDetailsOpen(false)}
                  className="px-6 py-2 bg-slate-50 text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all active:scale-95">
                  Close
               </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
