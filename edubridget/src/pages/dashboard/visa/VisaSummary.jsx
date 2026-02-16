import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Upload,
  XCircle,
  MapPin,
  Eye,
  Plus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { getCurrentUserConsultations, getCountryFlag } from '@/data/mockVisaData';

export default function VisaSummary() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        const userConsultations = getCurrentUserConsultations();
        setRequests(userConsultations);
      } catch (error) {
        toast.error("Failed to load consultation data");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Helper function: Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "New": return <Clock size={14} className="text-blue-500" />;
      case "In Progress": return <AlertCircle size={14} className="text-yellow-500" />;
      case "Pending Documents": return <Upload size={14} className="text-orange-500" />;
      case "Approved": return <CheckCircle size={14} className="text-emerald-500" />;
      case "Rejected": return <XCircle size={14} className="text-red-500" />;
      default: return <AlertCircle size={14} className="text-slate-400" />;
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

  const handleRowClick = (caseId) => {
    navigate(`/dashboard/visa-status/summary/details/${caseId}`);
  };

  const handleViewClick = (e, caseId) => {
    e.stopPropagation(); 
    navigate(`/dashboard/visa-status/summary/details/${caseId}`);
  };

  const totalRequests = requests.length;
  const latestDestination = requests.length > 0 ? requests[0].destination : "N/A";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-serif text-slate-900 tracking-tight">Visa Consultations</h1>
        <p className="text-slate-500 text-sm">Track your consultation requests, documents, and consultant feedback.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Total Requests */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText size={18} />
              </div>
            </div>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">My Requests</p>
            <p className="text-2xl font-semibold text-slate-900 mt-0.5">{totalRequests}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Total consultation requests created</p>
          </CardContent>
        </Card>

        {/* Card 2: Latest Destination */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <MapPin size={18} />
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal text-[10px] px-1.5 py-0 h-5">Most Recent</Badge>
            </div>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Latest Destination</p>
            <p className="text-2xl font-semibold text-slate-900 mt-0.5">{latestDestination}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Your most recent target country</p>
          </CardContent>
        </Card>
      </div>

      {/* Consultation Requests Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif text-slate-900">Request History</h3>
          <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium h-9">
            <a href="/dashboard/visa-status/request" className="gap-2">
              <Plus size={14} />
              New Request
            </a>
          </Button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Clock size={32} className="mx-auto text-slate-300 animate-spin" />
            <p className="text-slate-400 text-sm mt-3">Loading your consultations...</p>
          </div>
        ) : requests.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Visa Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date Booked</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fee</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((request) => (
                    <tr 
                      key={request.id} 
                      onClick={() => handleRowClick(request.id)}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    >
                      {/* Destination */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getCountryFlag(request.countryCode)}</span>
                          <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                            {request.destination}
                          </span>
                        </div>
                      </td>
                      
                      {/* Visa Type */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{request.visaType}</span>
                      </td>
                      
                      {/* Date Booked */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-600">{request.dateBooked}</span>
                          <span className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wide">
                            {request.meetingType}
                          </span>
                        </div>
                      </td>
                      
                      {/* Fee */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">{request.fee}</span>
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </span>
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => handleViewClick(e, request.id)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200 mb-3 shadow-sm">
              <FileText size={20} className="text-slate-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No Consultation Requests</h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto mt-1">You haven't requested any consultations yet.</p>
            <Button asChild size="sm" className="mt-4 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm text-xs h-8">
              <a href="/dashboard/visa-status/request">
                <Plus size={14} className="mr-1.5" />
                Start Request
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}