import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Calendar,
  MapPin,
  MoreHorizontal
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function VisaSummary() {
  const [activeTab, setActiveTab] = useState('details');

  const documents = [
    { name: "Passport Scan.pdf", status: "Verified", date: "2024-01-10" },
    { name: "Admission Letter.pdf", status: "Verified", date: "2024-01-12" },
    { name: "Bank Statement.pdf", status: "Received", date: "2024-01-15" },
    { name: "Medical Report.pdf", status: "Pending", date: "-" },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Verified': return <CheckCircle size={16} className="text-green-600" />;
      case 'Received': return <Clock size={16} className="text-orange-600" />;
      default: return <AlertCircle size={16} className="text-slate-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Verified': return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Verified</Badge>;
      case 'Received': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0">Received</Badge>;
      default: return <Badge variant="outline" className="text-slate-500">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Visa Case Status</h1>
        <Button variant="outline" className="gap-2">
            <Download size={16} /> Download Summary
        </Button>
      </div>

      {/* Case Summary Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-700">Visa Case Summary</h2>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</p>
                <p className="font-bold text-slate-800 text-lg">Canada</p>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Visa Type</p>
                <p className="font-bold text-slate-800 text-lg">Study Visa</p>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</p>
                <Badge className="bg-yellow-100 text-yellow-800 border-0 hover:bg-yellow-200">In Progress</Badge>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Consultation Fee</p>
                <Badge className="bg-green-100 text-green-800 border-0 hover:bg-green-200">Paid</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-8">
            <button 
                onClick={() => setActiveTab('details')}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Case Details & Documents
            </button>
            <button 
                onClick={() => setActiveTab('timeline')}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                Admin Messages & Timeline
            </button>
        </div>
      </div>

      {activeTab === 'details' ? (
        <div className="space-y-6">
            {/* Appointment Details */}
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Calendar size={24} />
                </div>
                <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-slate-800">Appointment: 2024-02-15 (Online)</h3>
                    <div className="flex flex-wrap text-sm text-slate-500 gap-4">
                        <span className="flex items-center gap-1"><Clock size={14} /> 10:00 AM PST</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> Video Call Link</span>
                    </div>
                </div>
                <Button variant="outline" size="sm">Reschedule</Button>
            </div>

            {/* Documents List */}
            <div>
                <h3 className="font-bold text-slate-800 mb-4">Submitted Documents (3)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-200 transition-colors group">
                           <div className="flex items-center gap-3">
                               <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                   <FileText size={20} />
                               </div>
                               <span className="font-medium text-slate-700 text-sm">{doc.name}</span>
                           </div>
                           <div className="flex items-center gap-3">
                               {getStatusBadge(doc.status)}
                               <button className="text-slate-300 hover:text-slate-600">
                                   <MoreHorizontal size={16} />
                               </button>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      ) : (
          <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p>Timeline & Messages feature coming soon.</p>
          </div>
      )}

    </div>
  );
}
