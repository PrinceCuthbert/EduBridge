import React, { useState } from 'react';
import { Eye, MoreHorizontal, Filter, ChevronDown, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MyApplications() {
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [sortOrder, setSortOrder] = useState("Newest First");

  // Mock Data matching the screenshot
  const applications = [
    {
      id: "CAM001234",
      university: "University of Cambridge",
      program: "MPhil in Advanced Computer Science",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg/1200px-Coat_of_Arms_of_the_University_of_Cambridge.svg.png",
      date: "2023-01-15",
      status: "Accepted",
      statusColor: "bg-green-100 text-green-700 hover:bg-green-200",
    },
    {
      id: "OXF005678",
      university: "University of Oxford",
      program: "MSc in Financial Economics",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Coat_of_arms_of_the_University_of_Oxford.svg/1200px-Coat_of_arms_of_the_University_of_Oxford.svg.png",
      date: "2023-02-20",
      status: "Under Review",
      statusColor: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    },
    {
      id: "LSE009012",
      university: "London School of Economics",
      program: "MSc in International Relations",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/42/LSE_Coat_of_Arms.svg/1200px-LSE_Coat_of_Arms.svg.png",
      date: "2023-03-10",
      status: "Under Review",
      statusColor: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    },
    {
      id: "IMP003456",
      university: "Imperial College London",
      program: "MEng Aeronautical Engineering",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shield_of_Imperial_College_London.svg/1200px-Shield_of_Imperial_College_London.svg.png",
      date: "2023-04-01",
      status: "Declined",
      statusColor: "bg-red-100 text-red-700 hover:bg-red-200",
    },
    {
      id: "UCL007890",
      university: "University College London",
      program: "BSc Computer Science",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/University_College_London_coat_of_arms.svg/1200px-University_College_London_coat_of_arms.svg.png",
      date: "2023-04-25",
      status: "Under Review",
      statusColor: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    },
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Accepted': return 'default'; // Or custom green
      case 'Declined': return 'destructive';
      default: return 'secondary'; // Orange/Yellow usually
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">My University Applications</h1>
        
        <div className="flex items-center gap-3">
           {/* Status Filter */}
           <div className="relative">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
               <span>{filterStatus}</span>
               <ChevronDown size={14} />
             </button>
           </div>

           {/* Sort Order */}
           <div className="relative">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
               <span>{sortOrder}</span>
               <ChevronDown size={14} />
             </button>
           </div>
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">University & Program</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Application ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Submission Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Review</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 p-2 flex items-center justify-center shadow-sm">
                        <img src={app.logo} alt={app.university} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{app.university}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{app.program}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded-md">{app.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Clock size={14} />
                      <span>{app.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`${app.statusColor} border-0 px-3 py-1`}>
                      {app.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block" title="View Admin Review">
                      <Eye size={18} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors inline-block">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
