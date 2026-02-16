import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, FileText, Download, User, Award, GraduationCap, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import AdminCard from '../../components/admin/AdminCard';

// Mock data
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

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    // Simulate API fetch
    const fetchApplication = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const app = MOCK_APPLICATIONS.find(a => a.id === id);
        if (app) {
          setApplication(app);
          setNewStatus(app.status);
        } else {
          toast.error('Application not found');
          navigate('/admin/applications');
        }
      } catch (error) {
        toast.error('Failed to load application');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, navigate]);

  const handleSave = () => {
    // Save changes (API call would go here)
    toast.success(`Application status updated to ${newStatus}`);
    navigate('/admin/applications');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Needs Changes":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Reviewing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={14} />;
      case "Needs Changes":
        return <AlertCircle size={14} />;
      case "Reviewing":
        return <Clock size={14} />;
      case "Rejected":
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        Loading application details...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-12 text-center text-slate-500">
        Application not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/applications')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-all border border-transparent"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            {/* CHANGED: font-serif -> font-sans, tracking-tight */}
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Application Review
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
              <span className="font-mono">{application.id}</span>
              <span className="text-slate-300">•</span>
              <span>{application.studentName}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleSave}
          // CHANGED: Standard primary button style
          className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 shadow-sm transition-all active:scale-95"
        >
          Save Decision
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Student Profile Card */}
          <AdminCard title="Applicant Profile">
            <div className="flex items-start gap-5">
              <img 
                src={`https://ui-avatars.com/api/?name=${application.studentName}&background=f1f5f9&color=6366f1&size=120`} 
                alt={application.studentName}
                // CHANGED: rounded-3xl -> rounded-lg
                className="w-20 h-20 rounded-lg border border-slate-200"
              />
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {application.studentName}
                  </h2>
                  <div className="mt-2">
                    {/* CHANGED: Pill badge style */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      {application.status}
                    </span>
                  </div>
                </div>

                {/* Contact Grid - Simplified */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Mail size={14} /> Email
                    </p>
                    <p className="text-sm font-medium text-slate-900 truncate">{application.email}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Phone size={14} /> Phone
                    </p>
                    <p className="text-sm font-medium text-slate-900">{application.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Calendar size={14} /> Applied On
                    </p>
                    <p className="text-sm font-medium text-slate-900">{application.date}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Award size={14} /> GPA
                    </p>
                    <p className="text-sm font-bold text-slate-900">{application.gpa} / 4.0</p>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Scholarship Details */}
          <AdminCard title="Scholarship Program">
            {/* CHANGED: Removed gradient, used clean slate background */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                <GraduationCap size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {application.scholarship}
                </h3>
                <p className="text-sm text-slate-500">
                  Full scholarship application with academic merit evaluation
                </p>
              </div>
            </div>
          </AdminCard>

          {/* Documents */}
          <AdminCard title="Supporting Documents">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {application.documents.map((doc, index) => (
                <div
                  key={index}
                  // CHANGED: rounded-2xl -> rounded-lg, simplified hover
                  className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 text-blue-600 rounded-lg flex items-center justify-center border border-slate-100">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{doc}</p>
                      <p className="text-xs text-slate-500">PDF Document</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-blue-600 rounded-md transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Review Feedback */}
          <AdminCard title="Administrative Feedback">
            <textarea
              rows="6"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              // CHANGED: rounded-[1.5rem] -> rounded-lg
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 resize-none"
              placeholder="Provide detailed feedback for the applicant about their submission..."
            />
          </AdminCard>
        </div>

        {/* Sidebar - Decision Panel */}
        <div className="space-y-6">
          <AdminCard title="Review Decision">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-3">
                  Change Status
                </label>
                <div className="space-y-2">
                  {["Pending", "Reviewing", "Needs Changes", "Approved", "Rejected"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setNewStatus(status)}
                      // CHANGED: rounded-2xl -> rounded-lg, removed uppercase tracking
                      className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium text-left flex items-center gap-3 border transition-all ${
                        newStatus === status
                          ? `bg-slate-900 text-white border-slate-900 shadow-sm`
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className={newStatus === status ? "text-white" : "text-slate-400"}>
                         {getStatusIcon(status)}
                      </span>
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Quick Stats */}
         <AdminCard title="Quick Stats">
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-0.5">Academic Performance</p>
                {/* CHANGED: text-xl -> text-lg */}
                <p className="text-lg font-bold text-slate-900">{application.gpa} GPA</p>
              </div>
    
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-0.5">Documents Submitted</p>
                {/* CHANGED: text-xl -> text-lg */}
                <p className="text-lg font-bold text-slate-900">{application.documents.length} Files</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-0.5">Time Elapsed</p>
                {/* CHANGED: text-xl -> text-lg */}
                <p className="text-lg font-bold text-slate-900">
                  {Math.floor((new Date() - new Date(application.date)) / (1000 * 60 * 60 * 24))} Days
                </p>
              </div>
            </div>
          </AdminCard>  
        </div>
      </div>
    </div>
  );
}