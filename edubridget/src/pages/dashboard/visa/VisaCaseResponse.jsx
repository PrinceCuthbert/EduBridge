import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MessageSquare,
  AlertCircle,
  Clock,
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { getConsultationById, getCountryFlag } from '@/data/mockVisaData';

export default function VisaCaseResponse() {
  // Extract case ID from URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch case-specific feedback based on ID
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
        toast.error("Failed to load case feedback");
        navigate('/dashboard/visa-status/summary');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCaseData();
  }, [id, navigate]);

  // Helper function: Format timestamp for feedback
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
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
        <p className="text-slate-400 mt-4">Loading admin feedback...</p>
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
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Response & Feedback</h1>
        <p className="text-slate-500 text-lg">Consultant messages and updates for Case #{caseData.id}</p>
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
            className="pb-4 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all duration-200"
          >
            Case Details & Docs
          </Link>
          <Link 
            to={`/dashboard/visa-status/summary/response/${id}`}
            className="pb-4 text-sm font-medium border-b-2 border-primary text-primary"
          >
            Admin Response
          </Link>
        </div>
      </div>

      {/* Admin Feedback Feed - Only for this specific case */}
      <div className="space-y-6">
        {caseData.adminFeedback && caseData.adminFeedback.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Message History ({caseData.adminFeedback.length})</h3>
            {caseData.adminFeedback.map((item) => (
              <div 
                key={item.id} 
                className={`p-6 rounded-xl border-2 ${
                  item.status === 'Action Required' 
                    ? 'bg-amber-50/50 border-amber-200' 
                    : 'bg-blue-50/50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge 
                    className={`${
                      item.status === 'Action Required' 
                        ? 'bg-amber-100 text-amber-800 border-amber-300' 
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    } border`}
                  >
                    {item.status === 'Action Required' ? <AlertCircle size={14} className="mr-1.5" /> : <MessageSquare size={14} className="mr-1.5" />}
                    {item.status}
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">{formatTimestamp(item.timestamp)}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{item.message}</p>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="py-20 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
              <MessageSquare size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No Consultant Feedback Yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              Our consultants are currently reviewing your case. Check back soon for updates and responses.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
