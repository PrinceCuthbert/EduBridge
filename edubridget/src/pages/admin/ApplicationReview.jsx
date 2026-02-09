import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  MessageSquare,
  Save,
  X,
  Send,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

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
    status: "Under Review",
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
    status: "Correction Needed",
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
    status: "Qualified",
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

/**
 * ApplicationReview Component
 *
 * The central hub for processing student applications.
 * Features:
 * 1. Master Table: List of all submissions with status filters.
 * 2. Review Modal: Detailed view of a single application allows:
 *    - Viewing/Editing student data (Fixing typos etc.).
 *    - Viewing uploaded documents.
 *    - Adding Admin Notes (Internal).
 *    - Sending Student Feedback (External).
 *    - Updating Status (Accept, Reject, Request Changes).
 */
export default function ApplicationReview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null); // Controls Modal

  // Initialize state as empty - ready for API and CRUD operations
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications on mount - Replace with actual API call
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await applicationAPI.getAll();
        // setApplications(response.data);

        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setApplications(MOCK_APPLICATIONS);
      } catch (error) {
        toast.error("Failed to load applications");
        if (import.meta.env.DEV) {
          console.error("Applications fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Derived state for filtered list
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.scholarship.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Qualified":
        return "bg-green-100 text-green-700 border-green-200";
      case "Correction Needed":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Under Review":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"; // Pending
    }
  };

  // --- Modal Logic ---
  const handleSaveReview = (e, newStatus, feedback) => {
    e.preventDefault();
    // Update local state
    const updatedApps = applications.map((app) =>
      app.id === selectedApp.id
        ? { ...selectedApp, status: newStatus } // In real app, would also save feedback/notes
        : app,
    );
    setApplications(updatedApps);
    setSelectedApp(null);
    toast.success(`Application updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Application Review
        </h1>
        <p className="text-slate-500">
          Track, review, and qualify student applications.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by student or scholarship..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {[
            "All",
            "Pending",
            "Under Review",
            "Correction Needed",
            "Qualified",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}>
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto modern-scrollbar-light">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                <th className="px-6 py-4">Application ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Scholarship</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {app.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">
                      {app.studentName}
                    </div>
                    <div className="text-xs text-slate-500">{app.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {app.scholarship}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {app.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-primary hover:text-primary-dark font-medium text-sm flex items-center justify-end gap-1 ml-auto">
                      <Eye size={16} />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <FileText size={24} className="text-slate-400" />
                      </div>
                      <p className="font-medium">No applications found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <ReviewModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onSave={handleSaveReview}
        />
      )}
    </div>
  );
}

/**
 * ReviewModal Component
 *
 * Separated for cleanliness. Handles the logic for reviewing a single application.
 */
function ReviewModal({ application, onClose, onSave }) {
  // Local state for edits within the modal
  const [formData, setFormData] = useState({ ...application });
  const [adminNote, setAdminNote] = useState("");
  const [studentFeedback, setStudentFeedback] = useState("");
  const [activeTab, setActiveTab] = useState("review"); // 'review' or 'documents'
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionMessage, setCorrectionMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestCorrection = () => {
    if (!correctionMessage.trim()) {
      toast.error("Please enter a correction message");
      return;
    }
    onSave(null, "Correction Needed", correctionMessage);
    toast.success("Correction request sent to student");
    setShowCorrectionModal(false);
  };

  const handleMarkQualified = () => {
    const message =
      studentFeedback.trim() ||
      "Congratulations! Your application has been approved.";
    onSave(null, "Qualified", message);
    toast.success("Application marked as qualified");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Review Application
              <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                {application.id}
              </span>
            </h2>
            <p className="text-sm text-slate-500">
              Submitted by{" "}
              <span className="font-semibold text-primary">
                {application.studentName}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body - Two Columns */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left Column: Student Data (Scrollable) */}
          <div className="flex-1 overflow-y-auto modern-scrollbar-light p-6 bg-slate-50/50 border-r border-slate-200">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setActiveTab("review")}
                className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === "review" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
                Application Data
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === "documents" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
                Documents ({application.documents.length})
              </button>
            </div>

            {activeTab === "review" ? (
              <div className="space-y-6">
                {/* Editable Fields Tip */}
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-2 items-start text-xs text-blue-700">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <p>
                    You can edit student details directly here to correct typos
                    before checking documents.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      GPA / Grades
                    </label>
                    <input
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Email
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Scholarship Applied For
                  </label>
                  <input
                    disabled
                    value={application.scholarship}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {application.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                        <FileText size={20} />
                      </div>
                      <button className="text-slate-400 group-hover:text-primary transition-colors">
                        <Download size={18} />
                      </button>
                    </div>
                    <p className="font-bold text-slate-800 text-sm truncate">
                      {doc}
                    </p>
                    <p className="text-xs text-slate-500">PDF • 2.4 MB</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Action Panel */}
          <div className="w-full lg:w-96 p-6 bg-gradient-to-br from-slate-50 to-white flex flex-col h-full border-l border-slate-200">
            <div className="flex-1 space-y-6 overflow-y-auto scrollbar-primary mb-4">
              {/* Internal Notes */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                  <Save size={16} className="text-slate-500" />
                  Admin Internal Notes
                </label>
                <textarea
                  className="w-full h-24 px-4 py-3 bg-yellow-50/70 border-2 border-yellow-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 resize-none placeholder-slate-400 transition-all"
                  placeholder="Private notes for other admins..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}></textarea>
              </div>

              {/* Student Feedback */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                  <MessageSquare size={16} className="text-primary" />
                  Message to Student
                </label>
                <textarea
                  className="w-full h-32 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none placeholder-slate-400 transition-all"
                  placeholder="e.g. Please re-upload your passport in a clearer format."
                  value={studentFeedback}
                  onChange={(e) =>
                    setStudentFeedback(e.target.value)
                  }></textarea>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <Clock size={12} />
                  <p>This message will be visible in the student dashboard.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t-2 border-slate-200 space-y-3 mt-auto">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 text-xs text-blue-800">
                <p className="font-bold mb-1 flex items-center gap-2">
                  <AlertCircle size={14} />
                  Consultancy Review
                </p>
                <p className="text-blue-700">
                  Verify that all documents are present, clear, and meet the
                  scholarship requirements before marking as qualified.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handleMarkQualified}
                  className="group flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-0.5">
                  <CheckCircle
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  Mark Documents as Qualified
                </button>

                <button
                  onClick={() => setShowCorrectionModal(true)}
                  className="group flex items-center justify-center gap-2 px-5 py-3.5 bg-white border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  <AlertCircle
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  Request Corrections
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Correction Request Modal */}
        {showCorrectionModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 transform transition-all">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="text-orange-600" size={24} />
                  Request Corrections
                </h3>
                <button
                  onClick={() => setShowCorrectionModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-slate-600 bg-orange-50 border border-orange-100 p-3 rounded-lg">
                Enter the specific corrections needed. This message will be sent
                directly to the applicant's dashboard.
              </p>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Correction Message *
                </label>
                <textarea
                  className="w-full h-40 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 resize-none placeholder-slate-400 transition-all"
                  placeholder="Example: Please re-upload your passport in a clearer format. The current document is not readable."
                  value={correctionMessage}
                  onChange={(e) =>
                    setCorrectionMessage(e.target.value)
                  }></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCorrectionModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleRequestCorrection}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-200 hover:shadow-xl flex items-center justify-center gap-2">
                  <Send size={18} />
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
