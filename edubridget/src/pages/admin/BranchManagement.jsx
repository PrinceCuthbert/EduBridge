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
import Modal from "../../components/Modal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import AdminFilterBar from "../../components/admin/AdminFilterBar";

// Mock data - Replace with API calls
const MOCK_BRANCHES = [
  {
    id: 1,
    name: "EduBridge Rwanda HQ",
    location: "Kigali, Rwanda",
    address: "KG 123 Street, Nyarugenge District",
    phone: "+250 788 123 456",
    email: "rwanda@edubridge.com",
    hours: "Mon-Fri: 8AM-6PM, Sat: 8AM-1PM",
    staff: 12,
    managerName: "Jean Claude Niyonzima",
    status: "Active",
  },
  {
    id: 2,
    name: "EduBridge Kenya",
    location: "Nairobi, Kenya",
    address: "Westlands Business Park, Tower A",
    phone: "+254 700 123 456",
    email: "kenya@edubridge.com",
    hours: "Mon-Fri: 8AM-6PM",
    staff: 8,
    managerName: "Sarah Wanjiku",
    status: "Active",
  },
  {
    id: 3,
    name: "EduBridge Uganda",
    location: "Kampala, Uganda",
    address: "Plot 24, Nakasero Road",
    phone: "+256 772 123 456",
    email: "uganda@edubridge.com",
    hours: "Mon-Fri: 8:30AM-5:30PM",
    staff: 6,
    managerName: "David Ochieng",
    status: "Active",
  },
  {
    id: 4,
    name: "EduBridge Tanzania",
    location: "Dar es Salaam, Tanzania",
    address: "Posta Road, CBD",
    phone: "+255 755 123 456",
    email: "tanzania@edubridge.com",
    hours: "Opening Q2 2024",
    staff: 2,
    managerName: "Amina Hassan",
    status: "Coming Soon",
  },
];

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

  // Initialize state as empty - ready for API
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch branches on mount - Replace with actual API call
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setBranches(MOCK_BRANCHES);
      } catch (error) {
        toast.error("Failed to load branches");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const stats = [
    {
      label: "Active Centers",
      value: branches.filter((b) => b.status === "Active").length,
      icon: Building,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Team Members",
      value: branches.reduce((sum, b) => sum + b.staff, 0),
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Regional Presence",
      value: new Set(branches.map((b) => b.location.split(", ")[1])).size,
      icon: MapPin,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const handleAddBranch = () => {
    setEditingBranch(null);
    setFormData({
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
    setIsModalOpen(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      location: branch.location,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      hours: branch.hours,
      staff: branch.staff,
      managerName: branch.managerName,
      status: branch.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteBranch = (branchId, branchName) => {
    toast.promise(
      new Promise((resolve, reject) => {
        if (window.confirm(`Delete ${branchName} permanently?`)) {
          setBranches(branches.filter((b) => b.id !== branchId));
          resolve();
        } else {
          reject();
        }
      }),
      {
        loading: 'Processing deletion...',
        success: `${branchName} removed successfully`,
        error: 'Deletion cancelled',
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBranch) {
      setBranches(
        branches.map((b) =>
          b.id === editingBranch.id ? { ...b, ...formData } : b,
        ),
      );
      toast.success(`${formData.name} updated successfully`);
    } else {
      const newBranch = {
        id: Math.max(...branches.map((b) => b.id), 0) + 1,
        ...formData,
      };
      setBranches([...branches, newBranch]);
      toast.success(`${formData.name} registered successfully`);
    }
    setIsModalOpen(false);
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AdminPageHeader 
        title="Regional Offices" 
        subtitle="Manage EduBridge branch locations and operational centers."
        count={branches.length}
        countLabel="Active Nodes"
        primaryAction={{
          label: "Register Branch",
          icon: Plus,
          onClick: handleAddBranch,
          rotateIcon: true
        }}
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search branch locations..."
      />

      {/* Branch Grid - Custom Implementation per Page Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
           [...Array(4)].map((_, i) => (
             <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200/60 animate-pulse h-[300px]" />
           ))
        ) : filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="group bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
            
            {/* Status Indicator */}
            <div className="absolute top-6 right-6">
               <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${branch.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'}`}>
                  {branch.status}
               </span>
            </div>

            {/* Branch Details */}
            <div className="flex items-start gap-6 mb-8">
               <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md">
                  <Building size={28} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
               </div>
               <div className="pt-1 pr-20">
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{branch.name}</h3>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <MapPin size={14} className="text-blue-400" /> 
                    {branch.location}
                  </p>
               </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 px-1">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                       <Mail size={14} />
                    </div>
                    <span className="text-[11px] font-bold lowercase tracking-tight font-mono">{branch.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                       <Phone size={14} />
                    </div>
                    <span className="text-[11px] font-bold tracking-tight">{branch.phone}</span>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                       <Clock size={14} />
                    </div>
                    <span className="text-[11px] font-bold tracking-tight">{branch.hours}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                       <Users size={14} />
                    </div>
                    <span className="text-[10px] font-bold mr-1 uppercase tracking-widest leading-none pt-0.5">{branch.staff} Team Members</span>
                  </div>
               </div>
            </div>

            {/* Manager Info */}
            <div className="flex items-center justify-between p-5 bg-slate-50/80 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
              <div className="flex items-center gap-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${branch.managerName}&background=f1f5f9&color=6366f1`} 
                  className="w-12 h-12 rounded-xl border border-white shadow-sm" 
                  alt={branch.managerName}
                />
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lead Manager</p>
                  <p className="text-sm font-bold text-slate-900 tracking-tight">
                    {branch.managerName}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditBranch(branch)}
                  className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow active:scale-90"
                  title="Modify Branch">
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteBranch(branch.id, branch.name)}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow active:scale-90"
                  title="Remove Branch">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBranch ? "Modify Branch Details" : "Register New Office"}
        size="lg"
        className="rounded-[2.5rem] shadow-2xl border-0 overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-8 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Branch Identity</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm"
                placeholder="e.g. EduBridge Kigali"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Regional Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm"
                placeholder="City, Country"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Detailed Physical Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm"
                placeholder="Building, Street, District"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Hotline Contact</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm"
                placeholder="+250..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Operational Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm"
                placeholder="branch@edubridge.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Opening Hours</label>
              <input
                type="text"
                required
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm"
                placeholder="e.g. Mon-Fri: 8AM-5PM"
              />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Assigned Personnel</label>
               <input
                 type="number"
                 required
                 min="0"
                 value={formData.staff}
                 onChange={(e) => setFormData({ ...formData, staff: parseInt(e.target.value) || 0 })}
                 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm font-mono"
                 placeholder="Total Staff Count"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Current Status</label>
               <select
                 required
                 value={formData.status}
                 onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm appearance-none">
                 <option value="Active">Active Operations</option>
                 <option value="Coming Soon">In Development</option>
                 <option value="Closed">Inactive</option>
               </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Assigned Branch Manager</label>
              <input
                type="text"
                required
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-800 transition-all shadow-sm"
                placeholder="Manager full name"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-8 py-4 border border-slate-200 text-slate-400 rounded-2xl text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition-all">
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-xl hover:bg-blue-600 transition-all active:scale-95">
              {editingBranch ? "Save Changes" : "Register Branch"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
