import React, { useState, useEffect } from "react";
import { Eye, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import ReviewModal from "./ReviewModal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminFilterBar from "../../components/admin/AdminFilterBar";
import AdminTable from "../../components/admin/AdminTable";

// Mock applications data - Replace with API calls
const MOCK_APPLICATIONS = [
  {
    id: "APP-2024-001",
    studentName: "Alice Mutesi",
    scholarship: "Global Excellence Scholarship",
    date: "2024-02-01",
    status: "Pending",
    email: "alice@example.com",
    phone: "+250 788 123 456",
    gpa: "3.8",
    documents: ["Passport.pdf", "Transcripts.pdf", "CV.pdf"],
  },
  {
    id: "APP-2024-002",
    studentName: "David Kwizera",
    scholarship: "DAAD Master Studies",
    date: "2024-01-28",
    status: "Reviewing",
    email: "david@example.com",
    phone: "+250 788 654 321",
    gpa: "3.5",
    documents: ["Passport.pdf", "CV.pdf"],
  },
  {
    id: "APP-2024-003",
    studentName: "Sarah Uwase",
    scholarship: "Fullbright Program",
    date: "2024-01-25",
    status: "Needs Changes",
    email: "sarah@example.com",
    phone: "+250 788 987 654",
    gpa: "3.9",
    documents: ["Passport.pdf"],
  },
  {
    id: "APP-2024-004",
    studentName: "John Doe",
    scholarship: "Global Excellence Scholarship",
    date: "2024-02-02",
    status: "Approved",
    email: "john@example.com",
    phone: "+250 788 111 222",
    gpa: "4.0",
    documents: [
      "Passport.pdf",
      "Transcripts.pdf",
      "CV.pdf",
      "Recommendation.pdf",
    ],
  },
];

export default function ApplicationReview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setApplications(MOCK_APPLICATIONS);
      } catch (error) {
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.scholarship.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Needs Changes":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Reviewing":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Rejected":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100"; // Pending
    }
  };

  const handleSaveReview = (e, newStatus, feedback) => {
    if (e) e.preventDefault();
    const updatedApps = applications.map((app) =>
      app.id === selectedApp.id
        ? { ...selectedApp, status: newStatus }
        : app,
    );
    setApplications(updatedApps);
    setSelectedApp(null);
    toast.success(`Application status updated to ${newStatus}`);
  };

  const columns = [
    {
      header: "Applicant Profile",
      render: (app) => (
        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              src={`https://ui-avatars.com/api/?name=${app.studentName}&background=f1f5f9&color=6366f1`} 
              alt={app.studentName}
              className="w-12 h-12 rounded-2xl border border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-110 duration-500"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${app.status === 'Approved' ? 'bg-emerald-500' : 'bg-blue-400'}`} />
          </div>
          <div className="flex flex-col pt-0.5">
            <span className="font-serif text-[#0F172A] group-hover:text-blue-600 transition-colors text-[17px] antialiased tracking-tight">{app.studentName}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1 opacity-70">
                Reference ID: {app.id}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Program Pathway",
      render: (app) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 text-sm tracking-tight group-hover:text-[#0F172A] transition-colors">{app.scholarship}</span>
          <span className="text-[10px] font-mono font-bold text-blue-500/60 uppercase mt-1.5 tracking-wider">{app.email}</span>
        </div>
      )
    },
    {
      header: "Filing Date",
      render: (app) => (
        <div className="flex items-center gap-2.5 text-slate-500 font-bold text-[10px] uppercase tracking-[0.15em] opacity-80">
          <Calendar size={14} className="text-slate-300" />
          {app.date}
        </div>
      )
    },
    {
      header: "Status Registry",
      className: "text-center",
      render: (app) => (
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] border transition-all duration-300 ${getStatusColor(app.status)} shadow-sm`}>
            <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'Approved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : (app.status === 'Needs Changes' ? 'bg-amber-500' : 'bg-blue-500')}`} />
            {app.status}
          </span>
        </div>
      )
    },
    {
      header: "Action Control",
      className: "justify-end pr-12 text-right",
      render: (app) => (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setSelectedApp(app)}
            className="px-6 py-3 bg-[#0F172A] text-white rounded-[1.25rem] font-bold text-[11px] uppercase tracking-widest hover:bg-[#1E293B] hover:shadow-lg transition-all active:scale-95 flex items-center gap-2.5 shadow-md group-hover:translate-x-[-4px]">
            <Eye size={16} />
            Evaluate
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <AdminPageHeader 
        title="Application Review" 
        subtitle="Track, review, and qualify student applications."
        count={filteredApps.length}
      />

      <AdminFilterBar 
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Query by Record ID, Applicant Name, or Institutional Program..."
        filterOptions={["All", "Pending", "Reviewing", "Needs Changes", "Approved"]}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <AdminTable 
        columns={columns}
        data={filteredApps}
        isLoading={loading}
        emptyState={
          !loading && (
             <div className="flex flex-col items-center max-w-sm mx-auto">
              <div className="w-24 h-24 bg-slate-50/50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100">
                <FileText size={40} className="text-slate-200" />
              </div>
              <h4 className="text-xl font-serif text-[#0F172A] mb-2 tracking-tight">Record Entry Absent</h4>
              <p className="text-[13px] font-medium text-slate-400 mb-10 leading-relaxed antialiased">
                The current registry contains no scholarship dossiers matching your defined search parameters.
              </p>
              <button 
                onClick={() => {setSearchTerm(""); setStatusFilter("All");}}
                className="px-8 py-3.5 bg-[#0F172A] text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-xl hover:bg-[#1E293B] transition-all active:scale-95">
                Clear Search Filter
              </button>
            </div>
          )
        }
      />

      {/* Review Modal */}
      {selectedApp && (
        <ReviewModal
          key={selectedApp.id}
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onSave={handleSaveReview}
        />
      )}
    </div>
  );
}
