import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MessageSquare,
  AlertCircle,
  Clock,
  ArrowLeft,
  Briefcase,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { getCountryFlag } from '@/data/mockVisaData';
import { getVisaRequestById } from '@/services/visaService';
import VisaStatusBadge from '@/components/visa/VisaStatusBadge';

export default function VisaCaseResponse() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        const foundCase = await getVisaRequestById(id);
        
        if (!foundCase) {
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

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Clock size={32} className="mx-auto text-slate-300 animate-spin" />
        <p className="text-slate-400 text-sm mt-3">Loading admin feedback...</p>
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
        <h1 className="text-2xl font-serif text-slate-900 tracking-tight">Admin Response & Feedback</h1>
        <p className="text-slate-500 text-sm">Consultant messages and updates for Case #{caseData.id}</p>
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
            className="pb-3 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all"
          >
            Case Details & Docs
          </Link>
          <Link 
            to={`/dashboard/visa-status/summary/response/${id}`}
            className="pb-3 text-sm font-medium border-b-2 border-slate-900 text-slate-900"
          >
            Admin Response
          </Link>
        </div>
      </div>

      {/* Admin Feedback Feed */}
      <div className="space-y-4">
        {caseData.adminFeedback && caseData.adminFeedback.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-slate-900">Message History ({caseData.adminFeedback.length})</h3>
            {caseData.adminFeedback.map((item) => (
              <div 
                key={item.id} 
                className={`p-5 rounded-xl border ${
                  item.status === 'Action Required' 
                    ? 'bg-amber-50/50 border-amber-200' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                     <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${
                        item.status === 'Action Required' 
                        ? 'bg-amber-100 text-amber-800 border-amber-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                     }`}>
                        {item.status === 'Action Required' ? <AlertCircle size={12} /> : <MessageSquare size={12} />}
                        {item.status}
                     </span>
                     <span className="text-xs text-slate-400">|</span>
                     <span className="text-xs text-slate-500 font-medium">Admin Response</span>
                  </div>
                  <span className="text-xs text-slate-400">{formatTimestamp(item.timestamp)}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed pl-1">{item.message}</p>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200 mb-3 shadow-sm">
              <MessageSquare size={20} className="text-slate-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No Consultant Feedback Yet</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1">
              Our consultants are currently reviewing your case. Check back soon for updates.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}