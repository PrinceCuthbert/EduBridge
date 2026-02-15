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
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // State management
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch consultation requests filtered by current user
  // In production, the API would handle this filtering server-side
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        // Simulating API call - in production: fetch('/api/my-consultation-requests')
        // The API would automatically filter by the authenticated user's ID
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Get only the current user's consultations
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
      case "Approved": return <CheckCircle size={14} className="text-green-500" />;
      case "Rejected": return <XCircle size={14} className="text-red-500" />;
      default: return <AlertCircle size={14} className="text-gray-400" />;
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

  // Handle row click - Navigate to detail page with case ID
  const handleRowClick = (caseId) => {
    navigate(`/dashboard/visa-status/summary/details/${caseId}`);
  };

  // Handle view button click (same as row click, but more explicit)
  const handleViewClick = (e, caseId) => {
    e.stopPropagation(); // Prevent row click from also firing
    navigate(`/dashboard/visa-status/summary/details/${caseId}`);
  };

  // Calculate summary stats from the filtered user data
  const totalRequests = requests.length;
  const latestDestination = requests.length > 0 ? requests[0].destination : "N/A";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Visa Consultations</h1>
        <p className="text-slate-500 text-lg">Track your consultation requests, documents, and consultant feedback.</p>
      </div>

      {/* Summary Cards - Calculated from user's filtered data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Total Requests */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <FileText size={28} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">My Requests</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{totalRequests}</p>
            <p className="text-xs text-slate-400 mt-2">Total consultation requests</p>
          </CardContent>
        </Card>

        {/* Card 2: Latest Destination */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <MapPin size={28} />
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600">Most Recent</Badge>
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Latest Destination</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{latestDestination}</p>
            <p className="text-xs text-slate-400 mt-2">Your most recent request</p>
          </CardContent>
        </Card>
      </div>

      {/* Consultation Requests Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">My Consultation Requests</h3>
          <Button asChild>
            <a href="/dashboard/visa-status/request" className="gap-2">
              <Plus size={16} />
              New Request
            </a>
          </Button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Clock size={48} className="mx-auto text-slate-300 animate-spin" />
            <p className="text-slate-400 mt-4">Loading your consultations...</p>
          </div>
        ) : requests.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {/* Updated headers - removed "Client Name" since this is the user's own dashboard */}
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visa Requested</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Booked</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fee</th>
                    <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((request) => (
                    <tr 
                      key={request.id} 
                      onClick={() => handleRowClick(request.id)}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    >
                      {/* Destination - with flag emoji */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCountryFlag(request.countryCode)}</span>
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {request.destination}
                          </span>
                        </div>
                      </td>
                      
                      {/* Visa Requested */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-700">{request.visaType}</span>
                      </td>
                      
                      {/* Date Booked - combined format: "2024-02-15 • Online" */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{request.dateBooked}</span>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                            {request.meetingType} Meeting
                          </span>
                        </div>
                      </td>
                      
                      {/* Fee */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-emerald-600">{request.fee}</span>
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </span>
                        </div>
                      </td>
                      
                      {/* Details - Eye icon for viewing */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleViewClick(e, request.id)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="py-20 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
              <FileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No Consultation Requests Yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">You haven't requested any consultations yet. Start by submitting a new request.</p>
            <Button asChild className="mt-6">
              <a href="/dashboard/visa-status/request">
                <Plus size={16} className="mr-2" />
                Request New Consultation
              </a>
            </Button>
          </div>
        )}
      </div>

    </div>
  );
}
