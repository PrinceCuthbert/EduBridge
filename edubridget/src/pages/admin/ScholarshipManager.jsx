import React, { useState } from 'react';
import { Plus, Edit, Trash2, FileText, Globe, Calendar, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { MOCK_SCHOLARSHIPS } from '../../data/mockData';
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import AdminFilterBar from "../../components/admin/AdminFilterBar";
import AdminTable from "../../components/admin/AdminTable";

export default function ScholarshipManager() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  // Scholarships Data
  const [scholarships, setScholarships] = useState(MOCK_SCHOLARSHIPS);

  const handleDelete = (id, title) => {
    toast.promise(
      new Promise((resolve, reject) => {
        if (window.confirm(`Remove scholarship for ${title}?`)) {
          setScholarships(scholarships.filter(s => s.id !== id));
          // Remove from MOCK_SCHOLARSHIPS for session persistence
          const idx = MOCK_SCHOLARSHIPS.findIndex(s => s.id === id);
          if (idx !== -1) MOCK_SCHOLARSHIPS.splice(idx, 1);
          resolve();
        } else {
          reject();
        }
      }),
      {
        loading: 'Processing deletion...',
        success: 'Scholarship removed from database',
        error: 'Action cancelled',
      }
    );
  };

  const filteredScholarships = scholarships.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Volume', value: scholarships.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Grants', value: scholarships.filter(s => s.status === 'Active').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Expiring Soon', value: '3', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Global Partners', value: '12', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  const columns = [
    {
      header: "Scholarship Dossier",
      render: (item) => (
        <div className="flex flex-col pt-0.5">
          <span className="font-serif text-[#0F172A] group-hover:text-blue-600 transition-colors text-[17px] antialiased tracking-tight">{item.title}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1 opacity-70 line-clamp-1">
              {item.description}
          </span>
        </div>
      )
    },
    {
      header: "Grant Allocation",
      render: (item) => (
        <span className="font-bold text-emerald-600 text-sm tracking-tight">{item.amount}</span>
      )
    },
    {
      header: "Deadline Date",
      render: (item) => (
        <div className="flex items-center gap-2.5 text-slate-500 font-bold text-[10px] uppercase tracking-[0.15em] opacity-80">
          <Calendar size={14} className="text-slate-300" />
          {item.deadline}
        </div>
      )
    },
    {
      header: "Target Region",
      render: (item) => (
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-tight">
          <Globe size={14} className="text-slate-300" />
          {item.location}
        </div>
      )
    },
    {
      header: "Action Control",
      className: "text-right pr-12",
      render: (item) => (
        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={() => navigate(`/admin/programs/${item.id}`)}
            className="px-6 py-3 bg-[#0F172A] text-white rounded-[1.25rem] font-bold text-[11px] uppercase tracking-widest hover:bg-[#1E293B] hover:shadow-lg transition-all active:scale-95 flex items-center gap-2.5 shadow-md group-hover:translate-x-[-4px]"
          >
            <Edit size={16} />
            Edit
          </button>
          <button 
            onClick={() => handleDelete(item.id, item.title)}
            className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <AdminPageHeader 
        title="University Grants" 
        subtitle="Manage global scholarship programs and partner university offerings."
        count={filteredScholarships.length}
        countLabel="active programs"
        primaryAction={{
          label: "New Scholarship",
          icon: Plus,
          onClick: () => navigate('/admin/programs/new'),
          rotateIcon: true
        }}
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilterBar 
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search scholarships..."
        filterOptions={['All', 'Active', 'Draft', 'Archived']}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <AdminTable 
        columns={columns}
        data={filteredScholarships}
        isLoading={false}
        emptyState={
           <div className="flex flex-col items-center max-w-sm mx-auto">
              <div className="w-24 h-24 bg-slate-50/50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100">
                <FileText size={40} className="text-slate-200" />
              </div>
              <h4 className="text-xl font-serif text-[#0F172A] mb-2 tracking-tight">No Scholarships Found</h4>
              <p className="text-[13px] font-medium text-slate-400 mb-6 leading-relaxed antialiased">
                No scholarship programs match your current search criteria.
              </p>
           </div>
        }
      />
    </div>
  );
}
