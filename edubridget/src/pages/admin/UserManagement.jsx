import React, { useState, useEffect } from "react";
import {
  Plus,
  Users,
  UserCheck,
  ShieldCheck,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import Modal from "../../components/Modal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import AdminFilterBar from "../../components/admin/AdminFilterBar";
import AdminTable from "../../components/admin/AdminTable";

// Mock data moved outside component
const MOCK_USERS = [
  {
    id: 1,
    name: "Alice Mutesi",
    email: "alice@example.com",
    role: "Student",
    phone: "+250 788 123 456",
    country: "Rwanda",
    status: "Active",
    joined: "2024-01-15",
  },
  {
    id: 2,
    name: "David Kwizera",
    email: "david@example.com",
    role: "Admin",
    phone: "+250 788 654 321",
    country: "Rwanda",
    status: "Active",
    joined: "2024-01-10",
  },
  {
    id: 3,
    name: "Sarah Uwase",
    email: "sarah@example.com",
    role: "Student",
    phone: "+250 788 987 654",
    country: "Uganda",
    status: "Inactive",
    joined: "2024-01-20",
  },
  {
    id: 4, 
    name: "John Doe",
    email: "john@example.com",
    role: "Student",
    phone: "+250 788 111 222",
    country: "Kenya",
    status: "Active",
    joined: "2024-02-01",
  }
];

export default function UserManagement() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "All",
    status: "All",
    country: "All",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Student",
    phone: "",
    country: "",
    status: "Active",
  });

  // Users state initialized as empty array
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        setUsers(MOCK_USERS);
      } catch (error) {
        toast.error("Failed to load users");
        if (import.meta.env.DEV) {
          console.error("Users fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Stats calculation
  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50/50",
      trend: "Total ecosystem",
    },
    {
      label: "Students",
      value: users.filter((u) => u.role === "Student").length,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50/50",
      trend: "Verified students",
    },
    {
      label: "Admins",
      value: users.filter((u) => u.role === "Admin").length,
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50/50",
      trend: "System administrators",
    },
  ];

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "Student",
      phone: "",
      country: "",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      country: user.country,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)),
      );
      toast.success("User updated successfully");
    } else {
      // Add new user
      const newUser = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        ...formData,
        joined: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
      toast.success("User added successfully");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (user) => {
    toast(`Are you sure you want to delete ${user.name}?`, {
      action: {
        label: "Delete",
        onClick: () => {
          setUsers(users.filter((u) => u.id !== user.id));
          toast.success("User deleted successfully");
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  const handleExport = (format) => {
    toast.info(
      `Export as ${format.toUpperCase()} - Feature available after installing axios and xlsx packages`,
    );
  };

  const clearFilters = () => {
    setFilters({ role: "All", status: "All", country: "All" });
    setSearchQuery("");
  };

  // Table Columns Definition
  const columns = [
    {
      header: "User profile",
      render: (user) => (
        <div className="flex items-center gap-5">
          <img 
            src={`https://ui-avatars.com/api/?name=${user.name}&background=f1f5f9&color=6366f1`} 
            className="w-11 h-11 rounded-2xl border border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-110 duration-500" 
            alt={user.name} 
          />
          <div>
              <p className="text-[17px] font-serif text-[#0F172A] group-hover:text-blue-600 transition-colors antialiased tracking-tight">{user.name}</p>
              <p className="text-xs font-mono font-bold text-slate-400 tracking-wider mt-0.5 lowercase opacity-70">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Type",
      className: "px-8",
      render: (user) => (
        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-widest uppercase border transition-all ${user.role === 'Admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
          {user.role}
        </span>
      )
    },
    {
      header: "Contact",
      className: "px-8",
      render: (user) => (
        <span className="text-sm font-bold text-slate-700 flex items-center gap-3">
          <Phone size={14} className="text-slate-300" />
          {user.phone}
        </span>
      )
    },
    {
      header: "Nationality",
      className: "px-8 text-center",
      render: (user) => (
         <span className="text-sm font-bold text-[#0F172A] tracking-tight flex justify-center">{user.country}</span>
      )
    },
    {
      header: "Status",
      className: "px-8 text-center",
      render: (user) => (
        <div className="flex items-center justify-center gap-3">
          <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
          <span className={`text-xs font-bold uppercase tracking-widest ${user.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>{user.status}</span>
        </div>
      )
    },
    {
      header: "Control",
      className: "px-10 text-right pr-12",
      render: (user) => (
        <div className="flex items-center justify-end gap-3 pr-2">
          <button onClick={(e) => { e.stopPropagation(); handleViewProfile(user); }} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-[1.25rem] transition-all bg-transparent group-hover:bg-white shadow-none" title="View Profile">
              <Eye size={20} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleEditUser(user); }} className="p-3 text-slate-300 hover:text-amber-600 hover:bg-white hover:shadow-md rounded-[1.25rem] transition-all" title="Edit">
              <Edit size={20} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(user); }} className="p-3 text-slate-300 hover:text-red-500 hover:bg-white hover:shadow-md rounded-[1.25rem] transition-all" title="Delete">
              <Trash2 size={20} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <AdminPageHeader 
        title="User Directory" 
        subtitle="Manage student ecosystem and administrative authority."
        count={users.length}
        primaryAction={{
          label: "Add User",
          icon: Plus,
          onClick: handleAddUser,
          rotateIcon: true
        }}
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Query by Principal Name, Correspondence Email, or Nationality..."
        secondaryActions={
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 xl:flex-none flex items-center justify-center gap-3 px-6 py-3 rounded-2xl text-sm font-medium uppercase tracking-widest transition-all ${showFilters ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <Filter size={18} />
                Parameters
                {Object.values(filters).some(v => v !== "All") && <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
            </button>
            <button 
              onClick={() => handleExport('csv')}
              className="flex-1 xl:flex-none flex items-center justify-center gap-3 px-7 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                <Download size={18} className="text-slate-300" />
                Log Export
            </button>
          </div>
        }
      />

      {/* Parameter Panel - Kept local as it's specific */}
      {showFilters && (
        <div className="bg-slate-50/40 p-10 rounded-[2.5rem] border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-top-6 duration-500 shadow-inner">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.25em] px-1">Functional Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full px-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold text-[#0F172A] outline-none focus:border-blue-500 transition-all shadow-sm hover:shadow-md">
              <option value="All">All Classifications</option>
              <option value="Student">Undergraduate/Postgrad</option>
              <option value="Admin">System Executive</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.25em] px-1">Registry Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold text-[#0F172A] outline-none focus:border-blue-500 transition-all shadow-sm hover:shadow-md">
              <option value="All">All Registries</option>
              <option value="Active">Operational</option>
              <option value="Inactive">Deactivated</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.25em] px-1">Regional Presence</label>
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="w-full px-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-[13px] font-bold text-[#0F172A] outline-none focus:border-blue-500 transition-all shadow-sm hover:shadow-md">
              <option value="All">All Regions</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
            </select>
          </div>
          <div className="md:col-span-3 pt-2 text-right">
             <button onClick={clearFilters} className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline px-2">Reset Global Parameters</button>
          </div>
        </div>
      )}

      <AdminTable 
        columns={columns}
        data={users}
        isLoading={loading}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User" : "Add User"}
        size="lg"
        className="">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 md:space-y-10">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] px-1">Username</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 sm:px-8 sm:py-5 bg-slate-50/50 border border-slate-100 rounded-2xl sm:rounded-3xl text-base focus:border-blue-500 focus:bg-white outline-none font-medium text-[#0F172A] transition-all shadow-sm hover:shadow-md"
                placeholder="Full Name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
               <div className="space-y-3">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] px-1">Email</label>
                 <input
                   type="email"
                   required
                   value={formData.email}
                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                   className="w-full px-6 py-4 sm:px-8 sm:py-5 bg-slate-50/50 border border-slate-100 rounded-2xl sm:rounded-3xl text-base focus:border-blue-500 focus:bg-white outline-none font-medium text-[#0F172A] transition-all shadow-sm font-mono lowercase"
                   placeholder="Email Address"
                 />
               </div>
               <div className="space-y-3">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] px-1">Phone Number</label>
                 <input
                   type="tel"
                   required
                   value={formData.phone}
                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                   className="w-full px-6 py-4 sm:px-8 sm:py-5 bg-slate-50/50 border border-slate-100 rounded-2xl sm:rounded-3xl text-base focus:border-blue-500 focus:bg-white outline-none font-medium text-[#0F172A] transition-all shadow-sm"
                   placeholder="Phone ID"
                 />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
               <div className="space-y-3">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] px-1">Role</label>
                 <select
                   required
                   value={formData.role}
                   onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                   className="w-full px-6 py-4 sm:px-8 sm:py-5 bg-slate-50/50 border border-slate-100 rounded-2xl sm:rounded-3xl text-base focus:border-blue-500 focus:bg-white outline-none font-medium text-[#0F172A] transition-all shadow-sm appearance-none">
                   <option value="Student">Student</option>
                   <option value="Admin">Admin</option>
                 </select>
               </div>
               <div className="space-y-3">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] px-1">Nationality</label>
                 <select
                   required
                   value={formData.country}
                   onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                   className="w-full px-6 py-4 sm:px-8 sm:py-5 bg-slate-50/50 border border-slate-100 rounded-2xl sm:rounded-3xl text-base focus:border-blue-500 focus:bg-white outline-none font-medium text-[#0F172A] transition-all shadow-sm appearance-none">
                   <option value="">Select Region</option>
                   <option value="Rwanda">Rwanda Hub</option>
                   <option value="Kenya">Kenya Node</option>
                   <option value="Uganda">Uganda Sector</option>
                   <option value="Tanzania">Tanzania Axis</option>
                 </select>
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] px-1">Status</label>
               <div className="flex gap-3 sm:gap-4 p-2 bg-slate-50/50 border border-slate-100 rounded-2xl sm:rounded-3xl">
                  {['Active', 'Inactive'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, status })}
                      className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm font-medium uppercase tracking-widest transition-all ${formData.status === status ? 'bg-white text-blue-600 shadow-xl border border-blue-50' : 'text-slate-400 hover:text-slate-700'}`}>
                       {status}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-6 pt-6 sm:pt-8 md:pt-10 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 sm:px-8 sm:py-4 text-slate-400 rounded-xl sm:rounded-2xl text-sm font-medium uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 w-full sm:w-auto text-center">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 sm:px-12 sm:py-4 bg-[#0F172A] text-white rounded-xl sm:rounded-2xl text-sm font-medium uppercase tracking-widest shadow-xl hover:bg-[#1E293B] transition-all disabled:opacity-50 active:scale-95 w-full sm:w-auto text-center">
              {loading ? "Processing..." : editingUser ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Profile Modal */}
      {selectedUser && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title="User Profile"
          size="md"
          className="">
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
             <div className="p-8 sm:p-10 md:p-12 rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-br from-blue-500/80 to-indigo-600/80 text-white relative overflow-hidden shadow-2xl shadow-blue-500/10 group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                   <img 
                     src={`https://ui-avatars.com/api/?name=${selectedUser.name}&background=fff&color=2563eb`} 
                     className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/20 shadow-2xl transition-transform duration-700 group-hover:scale-105" 
                     alt={selectedUser.name}
                   />
                   <div>
                      <h3 className="text-2xl sm:text-3xl font-medium tracking-tight">{selectedUser.name}</h3>
                      <p className="text-white/70 text-sm lowercase mt-1.5 font-mono tracking-tight">{selectedUser.email}</p>
                   </div>
                   <span className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-white/10 border border-white/20 backdrop-blur-sm shadow-inner">
                      {selectedUser.role} 
                   </span>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 bg-slate-50/50 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 shadow-inner">
                <div className="space-y-2">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Phone Number</span>
                   <p className="text-base font-medium text-[#0F172A] tracking-tight">{selectedUser.phone}</p>
                </div>
                <div className="space-y-2">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Nationality</span>
                   <p className="text-base font-medium text-[#0F172A] tracking-tight">{selectedUser.country}</p>
                </div>
                <div className="space-y-2">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Status</span>
                   <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${selectedUser.status === 'Active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                      <p className={`text-base font-medium ${selectedUser.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`}>{selectedUser.status}</p>
                   </div>
                </div>
                <div className="space-y-2">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Joined</span>
                   <p className="text-base font-medium text-[#0F172A] tracking-tight">{selectedUser.joined}</p>
                </div>
             </div>

             <div className="pt-4 sm:pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setIsProfileModalOpen(false)} 
                  className="px-8 py-3 sm:px-10 sm:py-4 bg-[#0F172A] text-white rounded-xl sm:rounded-2xl font-medium text-sm uppercase tracking-widest hover:bg-[#1E293B] transition-all active:scale-95 shadow-xl shadow-slate-900/10 w-full sm:w-auto text-center">
                  Close
                </button>
             </div>
          </div>
        </Modal>

      )}
    </div>
  );
}
