import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Eye,
  ArrowLeft,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Upload,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Video
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { getConsultationById, getCountryFlag } from '@/data/mockVisaData';

export default function VisaCaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 6;

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        const foundCase = getConsultationById(id);
        
        if (!foundCase) {
          toast.error("Case not found or access denied");
          navigate('/dashboard/visa-status/summary');
          return;
        }
        
        setCaseData(foundCase);
      } catch (error) {
        toast.error("Failed to load case details");
        navigate('/dashboard/visa-status/summary');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCaseData();
  }, [id, navigate]);

  const handleDeleteDocument = (docId) => {
    toast.warning("Delete this document?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          // Mock delete
          setCaseData(prev => ({
            ...prev,
            documents: prev.documents.filter(d => d.id !== docId)
          }));
          toast.success("Document deleted successfully");
        }
      },
      cancel: { label: "Cancel", onClick: () => {} }
    });
  };

  const handleEditDocument = (docId) => {
    toast.info("Edit document functionality coming soon");
  };

  // Helper function: Get document status styling
  const getDocStatusStyles = (status) => {
    switch(status) {
      case 'Verified': 
        return { 
          badge: "bg-emerald-50 text-emerald-700 border-emerald-100", 
          icon: <CheckCircle size={12} className="mr-1" />
        };
      case 'Received': 
        return { 
          badge: "bg-blue-50 text-blue-700 border-blue-100", 
          icon: <Clock size={12} className="mr-1" />
        };
      default: 
        return { 
          badge: "bg-amber-50 text-amber-700 border-amber-100", 
          icon: <AlertCircle size={12} className="mr-1" />
        };
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

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Clock size={32} className="mx-auto text-slate-300 animate-spin" />
        <p className="text-slate-400 text-sm mt-3">Loading case details...</p>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate('/dashboard/visa-status/summary')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to All Requests
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-serif text-slate-900 tracking-tight">Case Details & Documents</h1>
        <p className="text-slate-500 text-sm">Manage documents and view details for Case #{caseData.id}</p>
      </div>

      {/* Case-Specific Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">
                {getCountryFlag(caseData.countryCode)}
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Destination</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{caseData.destination}</p>
          </CardContent>
        </Card>

        {/* Visa Type */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Briefcase size={20} />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Visa Type</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{caseData.visaType}</p>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Clock size={20} />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</p>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(caseData.status)}`}>
                {caseData.status}
              </span>
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
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                Paid
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fee</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{caseData.fee}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          <Link 
            to={`/dashboard/visa-status/summary/details/${id}`}
            className="pb-3 text-sm font-medium border-b-2 border-slate-900 text-slate-900"
          >
            Case Details & Docs
          </Link>
          <Link 
            to={`/dashboard/visa-status/summary/response/${id}`}
            className="pb-3 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all"
          >
            Admin Response
          </Link>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white text-blue-600 rounded-full shadow-sm border border-blue-100">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Upcoming Appointment</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mt-1">
               <span>{caseData.dateBooked} at {caseData.appointmentTime}</span>
               <span className="text-slate-300 hidden sm:inline">|</span>
               <span className="flex items-center gap-1">
                 <Video size={14} className="text-blue-500" /> {caseData.meetingType || 'Online Session'}
               </span>
               {caseData.meetingLink && (
                 <>
                   <span className="text-slate-300 hidden sm:inline">|</span>
                   <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                     Admin Scheduled
                   </span>
                 </>
               )}
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            size="sm" 
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white h-9"
            onClick={() => {
              if (caseData.meetingLink) {
                window.open(caseData.meetingLink, '_blank');
              } else {
                toast.error("Waiting for admin to verify and start the meeting.");
              }
            }}
          >
            Join Meeting
          </Button>
        </div>
      </div>

      {/* Submitted Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif text-slate-900">Submitted Documents</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                {caseData.documents.length} Files
            </span>
            <Button
              onClick={() => navigate(`/dashboard/visa-status/summary/details/${id}/upload`)}
              className="gap-2 bg-slate-900 text-white hover:bg-slate-800 h-9 rounded-lg text-xs"
              size="sm"
            >
              <Upload size={14} />
              Upload Documents
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const indexOfLastDoc = currentPage * documentsPerPage;
            const indexOfFirstDoc = indexOfLastDoc - documentsPerPage;
            const currentDocs = caseData.documents.slice(indexOfFirstDoc, indexOfLastDoc);
            
            return currentDocs.map((doc) => {
              const { badge, icon } = getDocStatusStyles(doc.status);
              return (
                <div key={doc.id} className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm group-hover:text-blue-700 transition-colors">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{doc.size}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-400">{doc.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${badge}`}>
                      {icon}
                      {doc.status}
                    </span>
                    <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                       <button 
                         className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                         title="Edit"
                         onClick={() => handleEditDocument(doc.id)}
                       >
                         <Edit2 size={16} />
                       </button>
                      <button 
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = doc.url;
                          link.download = doc.name;
                          link.click();
                        }}
                      >
                        <Download size={16} />
                      </button>
                      <button 
                         className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-0.5"
                         title="Delete"
                         onClick={() => handleDeleteDocument(doc.id)}
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
        
        {/* Pagination Controls */}
        {caseData.documents.length > documentsPerPage && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="gap-2 h-8 text-xs border-slate-200"
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.ceil(caseData.documents.length / documentsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8 w-8 rounded-lg text-xs font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(caseData.documents.length / documentsPerPage)))}
              disabled={currentPage === Math.ceil(caseData.documents.length / documentsPerPage)}
              className="gap-2 h-8 text-xs border-slate-200"
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </div>

    </div>
  );
}