import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Globe,
  GraduationCap,
  MapPin,
  X,
  Eye,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";

import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import AdminFilterBar from "../../components/admin/AdminFilterBar";
import AdminTable from "../../components/admin/AdminTable";

import { usePrograms } from "../../hooks/usePrograms";

export default function UniversityPrograms({ isReadOnly = false }) {
  const navigate = useNavigate();
  // Use custom hook for data management
  const { programs, loading, deleteProgram } = usePrograms();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    visaType: "All",
    country: "All",
  });

  // Calculate stats - using hook data
  const stats = [
    {
      label: "Total Programs",
      value: programs.length,
      icon: GraduationCap,
      trend: "+12%",
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Active Programs",
      value: programs.filter((p) => p.status === "Active").length,
      icon: Globe,
      trend: "+8%",
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      label: "Partner Countries",
      value: new Set(programs.map((p) => p.country)).size,
      icon: MapPin,
      trend: "Stable",
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      label: "D-2 Visa Programs",
      value: programs.filter((p) => p.visaType === "D-2").length,
      icon: GraduationCap,
      trend: "+5",
      bg: "bg-orange-50",
      color: "text-orange-600",
    },
  ];

  // Filter options
  const filterOptions = [
    {
      name: "status",
      label: "Status",
      options: ["All", "Active", "Inactive", "Draft"],
    },
    {
      name: "visaType",
      label: "Visa Type",
      options: ["All", "D-2", "D-4", "F-1", "J-1"],
    },
    {
      name: "country",
      label: "Country",
      options: ["All", "South Korea", "Japan", "USA", "UK", "Canada"],
    },
  ];

  // Table columns - Updated for standard font weights (font-medium instead of bold)
  const columns = [
    {
      header: "University",
      accessor: "name",
      render: (program) => (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="font-medium text-sm text-slate-900">
              {program.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Visa Type",
      accessor: "visaType",
      render: (program) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
          {program.visaType}
        </span>
      ),
    },
    {
      header: "Country",
      accessor: "country",
      render: (program) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Globe size={14} className="text-slate-400" />
          {program.country}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (program) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            program.status === "Active"
              ? "bg-green-50 text-green-700 border-green-100"
              : program.status === "Inactive"
                ? "bg-red-50 text-red-700 border-red-100"
                : "bg-slate-50 text-slate-600 border-slate-100"
          }`}>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              program.status === "Active"
                ? "bg-green-500"
                : program.status === "Inactive"
                  ? "bg-red-500"
                  : "bg-slate-400"
            }`}
          />
          {program.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (program) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() =>
              navigate(
                isReadOnly
                  ? `/dashboard/programs/${program.id}`
                  : `/admin/programs/view/${program.id}`,
              )
            }
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
            title="Preview Program">
            <Eye size={16} />
          </button>

          {!isReadOnly && (
            <>
              <button
                onClick={() => handleEdit(program)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit Program">
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(program.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete Program">
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Handler functions
  const handleEdit = (program) => {
    navigate(`/admin/programs/${program.id}`);
  };

  const handleDelete = async (id) => {
    // Hook handles confirmation and toast
    await deleteProgram(id);
  };

  const clearFilters = () => {
    setFilters({ status: "All", visaType: "All", country: "All" });
    setSearchQuery("");
  };

  // Filter programs
  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filters.status === "All" || program.status === filters.status;
    const matchesVisaType =
      filters.visaType === "All" || program.visaType === filters.visaType;
    const matchesCountry =
      filters.country === "All" || program.country === filters.country;

    return matchesSearch && matchesStatus && matchesVisaType && matchesCountry;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="University Programs"
        subtitle={
          isReadOnly
            ? "View available university programs"
            : "Manage Study Abroad programs (D-2, D-4)"
        }
        primaryAction={
          isReadOnly
            ? undefined
            : {
                label: "Add Program",
                icon: Plus,
                onClick: () => navigate("/admin/programs/new"),
              }
        }
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search universities..."
        secondaryActions={
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
           {[
        { key: 'status', label: 'All Status', optName: 'status' },
        { key: 'visaType', label: 'All Visas', optName: 'visaType' },
        { key: 'country', label: 'All Countries', optName: 'country' }
         ].map((filter) => (
         <div key={filter.key} className="relative group flex-shrink-0">
          <select
             value={filters[filter.key]}
                    onChange={(e) =>
                setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))
                }
                className="appearance-none pl-3 pr-9 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all cursor-pointer min-w-[120px]"
                >
              {filterOptions
                  .find((f) => f.name === filter.optName)
                        .options.map((opt) => (
                     <option key={opt} value={opt} className="py-2">
                        {opt === "All" ? filter.label : opt}
                     </option>
                    ))}
                 </select>
      
                 {/* Custom Chevron Icon */}
               <ChevronDown 
                   size={14} 
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" 
               />
            </div>
          ))}

  {/* Clear Filters Button */}
  {(filters.status !== "All" ||
    filters.visaType !== "All" ||
    filters.country !== "All") && (
    <button
      onClick={clearFilters}
      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
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
