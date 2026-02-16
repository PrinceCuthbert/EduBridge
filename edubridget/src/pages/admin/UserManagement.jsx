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
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import Modal from "../../components/Modal";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import AdminFilterBar from "../../components/admin/AdminFilterBar";
import AdminTable from "../../components/admin/AdminTable";

// Mock data
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

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setUsers(MOCK_USERS);
      } catch (error) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Students",
      value: users.filter((u) => u.role === "Student").length,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Admins",
      value: users.filter((u) => u.role === "Admin").length,
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "Student", phone: "", country: "", status: "Active" });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
      toast.success("User updated successfully");
    } else {
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
    toast(`Delete ${user.name}?`, {
      action: {
        label: "Delete",
        onClick: () => {
          setUsers(users.filter((u) => u.id !== user.id));
          toast.success("User deleted");
        },
      },
    });
  };

  const clearFilters = () => {
    setFilters({ role: "All", status: "All", country: "All" });
    setSearchQuery("");
  };

  // Filter users based on search query and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filters.role === "All" || user.role === filters.role;
    const matchesStatus = filters.status === "All" || user.status === filters.status;
    const matchesCountry = filters.country === "All" || user.country === filters.country;
    
    return matchesSearch && matchesRole && matchesStatus && matchesCountry;
  });

  // --- UPDATED COLUMNS ---
  const columns = [
    {
      header: "User",
      render: (user) => (
        <div className="flex items-center gap-3">
          <img 
            src={`https://ui-avatars.com/api/?name=${user.name}&background=f1f5f9&color=6366f1`} 
            className="w-9 h-9 rounded-full border border-slate-200" 
            alt={user.name} 
          />
          <div>
            {/* CHANGED: Removed font-serif, text-[17px]. Added text-sm font-medium */}
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Role",
      className: "px-6",
      render: (user) => (
        // CHANGED: Removed uppercase, tracking-widest. Added rounded-full, font-medium
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
          user.role === 'Admin' 
            ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
            : 'bg-slate-50 text-slate-600 border-slate-200'
        }`}>
          {user.role}
        </span>
      )
    },
    {
      header: "Phone",
      className: "px-6",
      render: (user) => (
        <span className="text-sm text-slate-600 font-medium flex items-center gap-2">
          {user.phone}
        </span>
      )
    },
    {
      header: "Country",
      className: "px-6 text-center",
      render: (user) => (
         <span className="text-sm text-slate-700">{user.country}</span>
      )
    },
    {
      header: "Status",
      className: "px-6 text-center",
      render: (user) => (
        <div className="flex justify-center">
            {/* CHANGED: Standard badge style */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                user.status === 'Active' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            {user.status}
            </span>
        </div>
      )
    },
    {
      header: "Actions",
      className: "px-6 text-right",
      render: (user) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={(e) => { e.stopPropagation(); handleViewProfile(user); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Eye size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleEditUser(user); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
              <Edit size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(user); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="User Directory" 
        subtitle="Manage students and administrators"
        count={users.length}
        primaryAction={{
          label: "Add User",
          icon: Plus,
          onClick: handleAddUser,
        }}
      />

      <AdminStatsGrid stats={stats} />

      <AdminFilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, email, or country..."
        secondaryActions={
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              // CHANGED: Standard button styles
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                showFilters 
                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}>
                <Filter size={16} />
                Filters
            </button>
            <button 
              onClick={() => toast.info("Exporting CSV...")}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Download size={16} className="text-slate-400" />
                Export
            </button>
          </div>
        }
      />

      {/* Expanded Filter Panel */}
      {showFilters && (
        // CHANGED: Reduced padding, rounded corners, font sizes
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Country</label>
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
              <option value="All">All Countries</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end">
             <button onClick={clearFilters} className="text-sm font-medium text-blue-600 hover:text-blue-700">Reset Filters</button>
          </div>
        </div>
      )}

      <AdminTable 
        columns={columns}
        data={filteredUsers}
        isLoading={loading}
      />

      {/* ADD/EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User" : "Add New User"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                // CHANGED: Standard input styles (py-2.5, px-3, rounded-lg)
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Alice Mutesi"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Email Address</label>
                 <input
                   type="email"
                   required
                   value={formData.email}
                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                   className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                   placeholder="alice@example.com"
                 />
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Phone Number</label>
                 <input
                   type="tel"
                   required
                   value={formData.phone}
                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                   className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                   placeholder="+250..."
                 />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Role</label>
                 <select
                   required
                   value={formData.role}
                   onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                   className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                   <option value="Student">Student</option>
                   <option value="Admin">Admin</option>
                 </select>
               </div>
               <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">Country</label>
                 <select
                   required
                   value={formData.country}
                   onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                   className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                   <option value="">Select Country</option>
                   <option value="Rwanda">Rwanda</option>
                   <option value="Kenya">Kenya</option>
                   <option value="Uganda">Uganda</option>
                 </select>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Account Status</label>
               <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                  {['Active', 'Inactive'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, status })}
                      className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${
                          formData.status === status 
                          ? 'bg-white text-blue-700 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}>
                      {status}
                    </button>
                  ))}
               </div>
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
              disabled={loading}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              {editingUser ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* PROFILE MODAL (Simplified) */}
      {selectedUser && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title="User Profile"
          size="md"
        >
          <div className="space-y-6">
             {/* Header */}
             <div className="flex flex-col items-center pt-2 pb-6 border-b border-slate-100">
                <img 
                  src={`https://ui-avatars.com/api/?name=${selectedUser.name}&background=f1f5f9&color=6366f1`} 
                  className="w-20 h-20 rounded-full border-4 border-slate-50 mb-4" 
                  alt={selectedUser.name}
                />
                <h3 className="text-xl font-semibold text-slate-900">{selectedUser.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{selectedUser.email}</p>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {selectedUser.role}
                </span>
             </div>

             {/* Details Grid */}
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      <Phone size={14} /> Phone
                   </div>
                   <p className="text-sm font-medium text-slate-900">{selectedUser.phone}</p>
                </div>
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      <MapPin size={14} /> Country
                   </div>
                   <p className="text-sm font-medium text-slate-900">{selectedUser.country}</p>
                </div>
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      <ShieldCheck size={14} /> Status
                   </div>
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedUser.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <p className="text-sm font-medium text-slate-900">{selectedUser.status}</p>
                   </div>
                </div>
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      <Calendar size={14} /> Joined
                   </div>
                   <p className="text-sm font-medium text-slate-900">{selectedUser.joined}</p>
                </div>
             </div>

             <div className="pt-6">
                <button 
                  onClick={() => setIsProfileModalOpen(false)} 
                  className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  Close
                </button>
             </div>
          </div>
        </Modal>
      )}
    </div>
  );
}