import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Globe, GraduationCap, MapPin, X, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_PROGRAMS } from '../../data/mockData';

import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatsGrid from '../../components/admin/AdminStatsGrid';
import AdminFilterBar from '../../components/admin/AdminFilterBar';
import AdminTable from '../../components/admin/AdminTable';



export default function UniversityPrograms({ isReadOnly = false }) {
  const navigate = useNavigate();
  // ... existing state ...
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    visaType: 'All',
    country: 'All'
  });

  // Fetch programs on mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      setPrograms(MOCK_PROGRAMS);
    } catch (error) {
      toast.error('Failed to load programs');
      console.error('Fetch programs error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats - Using Set to count unique occurrences
  const stats = [
    {
      label: 'Total Programs',
      value: programs.length,
      icon: GraduationCap,
      trend: '+12%',
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    },
    {
      label: 'Active Programs',
      value: programs.filter(p => p.status === 'Active').length,
      icon: Globe,
      trend: '+8%',
      bg: 'bg-green-50',
      color: 'text-green-600'
    },
    {
      label: 'Partner Countries',
      // We map to get country names, then use Set to count unique ones
      value: new Set(programs.map(p => p.country)).size,
      icon: MapPin,
      trend: 'Stable',
      bg: 'bg-purple-50',
      color: 'text-purple-600'
    },
    {
      label: 'D-2 Visa Programs',
      value: programs.filter(p => p.visaType === 'D-2').length,
      icon: GraduationCap,
      trend: '+5',
      bg: 'bg-orange-50',
      color: 'text-orange-600'
    }
  ];

  // Filter options
  const filterOptions = [
    {
      name: 'status',
      label: 'Status',
      options: ['All', 'Active', 'Inactive', 'Draft']
    },
    {
      name: 'visaType',
      label: 'Visa Type',
      options: ['All', 'D-2', 'D-4', 'F-1', 'J-1']
    },
    {
      name: 'country',
      label: 'Country',
      options: ['All', 'South Korea', 'Japan', 'USA', 'UK', 'Canada']
    }
  ];

  // Table columns - Updated for standard font weights (font-medium instead of bold)
  const columns = [
    {
      header: 'University',
      accessor: 'universityName',
      render: (program) => (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            {/* Standardized: font-medium text-sm text-slate-900 */}
            <div className="font-medium text-sm text-slate-900">{program.universityName}</div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {program.tags.map((tag, idx) => (
                <span
                  key={idx}
                  /* Standardized: font-medium (not bold), smaller text */
                  className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${
                    tag === 'BEST' ? 'bg-yellow-100 text-yellow-700' :
                    tag === 'NEW' ? 'bg-green-100 text-green-700' :
                    tag === 'ON SALE' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Visa Type',
      accessor: 'visaType',
      render: (program) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
          {program.visaType}
        </span>
      )
    },
    {
      header: 'Country',
      accessor: 'country',
      render: (program) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Globe size={14} className="text-slate-400" />
          {program.country}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (program) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
          program.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
          program.status === 'Inactive' ? 'bg-red-50 text-red-700 border-red-100' :
          'bg-slate-50 text-slate-600 border-slate-100'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            program.status === 'Active' ? 'bg-green-500' :
            program.status === 'Inactive' ? 'bg-red-500' :
            'bg-slate-400'
          }`} />
          {program.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (program) => (
        <div className="flex items-center justify-end gap-2">

          {/* Is readonly is true for student user so that they can' edit the program detais. only view button will be visible */}
          <button
            onClick={() => navigate(isReadOnly ? `/dashboard/programs/${program.id}` : `/admin/programs/view/${program.id}`)}
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
            title="Preview Program"
          >
            <Eye size={16} />
          </button>
          
          {/* Is readonly is true for student user so that they can' edit the program detais. only view button will be visible */}
          {!isReadOnly && (
            <>
              <button
                onClick={() => handleEdit(program)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit Program"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(program.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete Program"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  // Handler functions
  const handleEdit = (program) => {
    navigate(`/admin/programs/${program.id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) {
      return;
    }

    try {
      setPrograms(programs.filter(p => p.id !== id));
      toast.success('Program deleted successfully');
    } catch (error) {
      toast.error('Failed to delete program');
      console.error('Delete error:', error);
    }
  };

  const clearFilters = () => {
    setFilters({ status: 'All', visaType: 'All', country: 'All' });
    setSearchQuery('');
  };

  // Filter programs
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = 
      program.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filters.status === 'All' || program.status === filters.status;
    const matchesVisaType = filters.visaType === 'All' || program.visaType === filters.visaType;
    const matchesCountry = filters.country === 'All' || program.country === filters.country;
    
    return matchesSearch && matchesStatus && matchesVisaType && matchesCountry;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="University Programs"
        description={isReadOnly ? "View available university programs" : "Manage Study Abroad programs (D-2, D-4)"}
        actionLabel={isReadOnly ? null : "Add Program"}
        actionIcon={isReadOnly ? null : Plus}
        onAction={isReadOnly ? undefined : () => navigate('/admin/programs/new')}
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search universities..."
        secondaryActions={
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-300 transition-colors cursor-pointer"
            >
              {filterOptions.find(f => f.name === 'status').options.map(opt => (
                <option key={opt} value={opt}>{opt === 'All' ? 'All Status' : opt}</option>
              ))}
            </select>

            {/* Visa Type Filter */}
            <select
              value={filters.visaType}
              onChange={(e) => setFilters(prev => ({ ...prev, visaType: e.target.value }))}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-300 transition-colors cursor-pointer"
            >
              {filterOptions.find(f => f.name === 'visaType').options.map(opt => (
                <option key={opt} value={opt}>{opt === 'All' ? 'All Visas' : opt}</option>
              ))}
            </select>

            {/* Country Filter */}
            <select
              value={filters.country}
              onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-300 transition-colors cursor-pointer"
            >
              {filterOptions.find(f => f.name === 'country').options.map(opt => (
                <option key={opt} value={opt}>{opt === 'All' ? 'All Countries' : opt}</option>
              ))}
            </select>

            {/* Clear Filters Button */}
            {(filters.status !== 'All' || filters.visaType !== 'All' || filters.country !== 'All') && (
              <button
                onClick={clearFilters}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Clear Filters"
              >
                <X size={18} />
              </button>
            )}
          </div>
        }
      />

      <AdminTable 
        columns={columns}
        data={filteredPrograms}
        isLoading={loading}
      />
    </div>
  );
}