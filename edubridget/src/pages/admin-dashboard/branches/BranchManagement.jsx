import React, { useState, useEffect } from "react";
import {
  Plus,
  Building,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import Modal from "../../../components/Modal";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../../components/admin/AdminStatsGrid";
import AdminFilterBar from "../../../components/admin/AdminFilterBar";
import { useBranches } from "../../../hooks/useBranches";
import { Skeleton } from "../../../components/ui/Skeleton";

export default function BranchManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    hours: "",
    staff: 0,
    managerName: "",
    status: "Active",
  });

  const { branches, loading, createBranch, updateBranch, deleteBranch } = useBranches();

  const stats = [
    {
      label: "Active Centers",
      value: branches.filter((b) => b.status === "Active").length,
      icon: Building,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Staff",
      value: branches.reduce((sum, b) => sum + b.staff, 0),
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Regions",
      value: new Set(branches.map((b) => b.location.split(", ")[1])).size,
      icon: MapPin,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const handleAddBranch = () => {
    setEditingBranch(null);
    setFormData({ name: "", location: "", address: "", phone: "", email: "", hours: "", staff: 0, managerName: "", status: "Active" });
    setIsModalOpen(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setFormData({ ...branch });
    setIsModalOpen(true);
  };

  const handleDeleteBranch = (branchId, branchName) => {
    toast.warning(`Delete ${branchName}?`, {
      action: {
        label: "Delete",
        onClick: () => deleteBranch(branchId),
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBranch) {
      updateBranch(editingBranch.id, formData);
    } else {
      createBranch(formData);
    }
    setIsModalOpen(false);
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="Regional Offices" 
        subtitle="Manage branch locations and operational centers"
        count={branches.length}
        primaryAction={{
          label: "Register Branch",
          icon: Plus,
          onClick: handleAddBranch,
        }}
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search branch locations..."
      />

      {/* Branch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
           [...Array(4)].map((_, i) => (
             <Skeleton key={i} className="bg-white p-6 rounded-xl border border-slate-200 h-[280px]" />
           ))
        ) : filteredBranches.map((branch) => (
          // CHANGED: rounded-3xl -> rounded-xl, simplified border/shadow
          <div
            key={branch.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group"
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
               <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                 branch.status === 'Active' 
                   ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                   : 'bg-amber-50 text-amber-700 border-amber-200'
               }`}>
                 {branch.status}
               </span>
            </div>

            {/* Header */}
            <div className="p-6 pb-4">
               <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 flex-shrink-0">
                     <Building size={24} className="text-blue-600" />
                  </div>
                  <div className="pr-16">
                     {/* CHANGED: text-xl font-bold -> text-lg font-bold */}
                     <h3 className="text-lg font-bold text-slate-900 mb-1">{branch.name}</h3>
                     <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                        <MapPin size={14} className="text-slate-400" /> 
                        {branch.location}
                     </div>
                  </div>
               </div>

               {/* Details Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Mail size={14} />
                     </div>
                     <span className="text-sm text-slate-700 truncate">{branch.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Phone size={14} />
                     </div>
                     <span className="text-sm text-slate-700">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Clock size={14} />
                     </div>
                     <span className="text-sm text-slate-700 truncate">{branch.hours}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <Users size={14} />
                     </div>
                     <span className="text-sm text-slate-700">{branch.staff} Staff Members</span>
                  </div>
               </div>
            </div>

            {/* Footer / Manager */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${branch.managerName}&background=f1f5f9&color=6366f1`} 
                    className="w-8 h-8 rounded-full border border-slate-200" 
                    alt={branch.managerName}
                  />
                  <div>
                     <p className="text-xs text-slate-500 font-medium">Manager</p>
                     <p className="text-sm font-semibold text-slate-900">{branch.managerName}</p>
                  </div>
               </div>
               
               <div className="flex gap-2">
                  <button
                    onClick={() => handleEditBranch(branch)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteBranch(branch.id, branch.name)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete">
                    <Trash2 size={16} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBranch ? "Edit Branch" : "Register Branch"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="branch-name" className="text-sm font-medium text-slate-700">Branch Name</label>
              <input
                id="branch-name"
                type="text" required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. EduBridge Kigali"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="branch-location" className="text-sm font-medium text-slate-700">Location</label>
              <input
                id="branch-location"
                type="text" required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="City, Country"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="branch-address" className="text-sm font-medium text-slate-700">Address</label>
              <input
                id="branch-address"
                type="text" required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Building, Street, District"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="branch-phone" className="text-sm font-medium text-slate-700">Phone</label>
              <input
                id="branch-phone"
                type="tel" required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="branch-email" className="text-sm font-medium text-slate-700">Email</label>
              <input
                id="branch-email"
                type="email" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="branch-hours" className="text-sm font-medium text-slate-700">Hours</label>
              <input
                id="branch-hours"
                type="text" required
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Mon-Fri: 8AM-5PM"
              />
            </div>

            <div className="space-y-1.5">
               <label htmlFor="branch-staff" className="text-sm font-medium text-slate-700">Staff Count</label>
               <input
                 id="branch-staff"
                 type="number" required min="0"
                 value={formData.staff}
                 onChange={(e) => setFormData({ ...formData, staff: parseInt(e.target.value) || 0 })}
                 className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
               />
            </div>
            
            <div className="space-y-1.5">
               <label htmlFor="branch-status" className="text-sm font-medium text-slate-700">Status</label>
               <select
                 id="branch-status"
                 required
                 value={formData.status}
                 onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                 className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none">
                 <option value="Active">Active</option>
                 <option value="Coming Soon">Coming Soon</option>
                 <option value="Closed">Closed</option>
               </select>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="branch-manager" className="text-sm font-medium text-slate-700">Branch Manager</label>
              <input
                id="branch-manager"
                type="text" required
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              {editingBranch ? "Save Changes" : "Register Branch"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}