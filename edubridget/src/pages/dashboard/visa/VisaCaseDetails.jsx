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
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { getConsultationById, getCountryFlag } from '@/data/mockVisaData';

export default function VisaCaseDetails() {
  // Extract case ID from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination state for documents
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 6; // Show 6 documents per page

  // Fetch case-specific data based on ID
  // Security: Only returns data if it belongs to the current user
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        // Simulating API call - in production: fetch(`/api/my-consultations/${id}`)
        // The API would verify the case belongs to the authenticated user
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        // Get the specific case (with security check)
        const foundCase = getConsultationById(id);
        
        if (!foundCase) {
          // Case not found or doesn't belong to current user
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

  // Helper function: Get document status styling
  const getDocStatusStyles = (status) => {
    switch(status) {
      case 'Verified': 
        return { 
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100", 
          icon: <CheckCircle size={16} className="text-emerald-600" />
        };
      case 'Received': 
        return { 
          badge: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", 
          icon: <Clock size={16} className="text-blue-600" />
        };
      default: 
        return { 
          badge: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100", 
          icon: <AlertCircle size={16} className="text-amber-600" />
        };
    }
  };

  // Helper function: Get status color
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
        <Clock size={48} className="mx-auto text-slate-300 animate-spin" />
        <p className="text-slate-400 mt-4">Loading case details...</p>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      
      {/* Back Button */}
      <div>
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/visa-status/summary')}
          className="gap-2 border-slate-300"
        >
          <ArrowLeft size={16} />
          Back to All Requests
        </Button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Case Details & Documents</h1>
        <p className="text-slate-500 text-lg">Manage documents and view details for Case #{caseData.id}</p>
      </div>

      {/* Case-Specific Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Destination */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl text-3xl">
                {getCountryFlag(caseData.countryCode)}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Destination</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{caseData.destination}</p>
          </CardContent>
        </Card>

        {/* Visa Type */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Briefcase size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Visa Type</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{caseData.visaType}</p>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Clock size={24} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Status</p>
            <Badge className={`mt-2 ${getStatusColor(caseData.status)} border`}>
              {caseData.status}
            </Badge>
          </CardContent>
        </Card>

        {/* Fee */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <DollarSign size={24} />
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Paid</Badge>
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Fee</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{caseData.fee}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex gap-8">
          <Link 
            to={`/dashboard/visa-status/summary/details/${id}`}
            className="pb-4 text-sm font-medium border-b-2 border-primary text-primary"
          >
            Case Details & Docs
          </Link>
          <Link 
            to={`/dashboard/visa-status/summary/response/${id}`}
            className="pb-4 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all duration-200"
          >
            Admin Response
          </Link>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-white text-blue-600 rounded-full shadow-sm">
            <Calendar size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-lg">Upcoming Appointment</h3>
            <p className="text-slate-600 font-medium">{caseData.dateBooked} at {caseData.appointmentTime}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {caseData.meetingType} Meeting
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {caseData.duration}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-blue-200 text-blue-700 hover:bg-blue-100 bg-white">
            Reschedule
          </Button>
          <Button className="flex-1 md:flex-none shadow-md">Join Meeting</Button>
        </div>
      </div>

      {/* Submitted Documents - Only for this specific case */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Submitted Documents</h3>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-slate-500">{caseData.documents.length} Files</Badge>
            <Button
              onClick={() => navigate(`/dashboard/visa-status/summary/details/${id}/upload`)}
              className="gap-2"
              size="sm"
            >
              <Upload size={16} />
              Upload Documents
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Calculate pagination */}
          {(() => {
            const indexOfLastDoc = currentPage * documentsPerPage;
            const indexOfFirstDoc = indexOfLastDoc - documentsPerPage;
            const currentDocs = caseData.documents.slice(indexOfFirstDoc, indexOfLastDoc);
            const totalPages = Math.ceil(caseData.documents.length / documentsPerPage);
            
            return (
              <>
                {currentDocs.map((doc) => {
            const { badge, icon } = getDocStatusStyles(doc.status);
            return (
              <div key={doc.id} className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{doc.size}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400">{doc.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`gap-1.5 px-2.5 py-0.5 ${badge}`}>
                    {icon}
                    {doc.status}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = doc.url;
                        link.download = doc.name;
                        link.click();
                      }}
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                </div>
              </div>
                );
              })}
              </>
            );
          })()}
        </div>
        
        {/* Pagination Controls */}
        {caseData.documents.length > documentsPerPage && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.ceil(caseData.documents.length / documentsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
              className="gap-2"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

    </div>
  );
}
