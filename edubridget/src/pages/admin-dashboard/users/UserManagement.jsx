// src/pages/admin/UserManagement.jsx
import React, { useState } from "react";
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
  MapPin,
  ArrowDown,
  Calendar,
  Loader2,
} from "lucide-react";
import Modal from "../../../components/Modal";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminStatsGrid from "../../../components/admin/AdminStatsGrid";
import AdminFilterBar from "../../../components/admin/AdminFilterBar";
import AdminTable from "../../../components/admin/AdminTable";

// IMPORT THE HOOK
import { useUsers } from "../../../hooks/useUsers";

const INITIAL_FORM_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "student",
  phone: "",
  nationality: "",
  gender: "",
  dateOfBirth: "",
  status: "Active",
};

export default function UserManagement() {
  // 1. Hook provides all data AND logic states. No more local useEffect needed!
  const { users, loading, submitting, saveUser, deleteUser } = useUsers();

  // 2. UI States (Only modals and forms)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: "All",
    status: "All",
    nationality: "All",
  });

  // 3. Derived Stats
  const stats = React.useMemo(
    () => [
      {
        label: "Total Users",
        value: users.length,
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Students",
        value: users.filter((u) => u.role === "student").length,
        icon: UserCheck,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        label: "Admins",
        value: users.filter((u) => u.role === "admin").length,
        icon: ShieldCheck,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
    ],
    [users],
  );

  // --- ACTIONS ---

  // Unified Add/Edit Modal Opener
  const openUserModal = (user = null) => {
    setEditingUser(user);
    setFormData(
      user
        ? {
            firstName: user.identity?.firstName || "",
            lastName: user.identity?.lastName || "",
            email: user.email || "",
            role: user.role || "student",
            phone: user.identity?.phone || "",
            nationality: user.identity?.nationality || "",
            gender: user.identity?.gender || "",
            dateOfBirth: user.identity?.dob || "",
            status: user.status || "Active",
            password: "", // Leave blank for security when editing
          }
        : INITIAL_FORM_DATA,
    );
    setIsModalOpen(true);
  };

  // Ultra-thin Submit Handler (Hook does the try/catch)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveUser(editingUser?.id, formData);
    if (success) setIsModalOpen(false);
  };

  // View Profile Opener
  const openProfile = (user) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  const clearFilters = () => {
    setFilters({ role: "All", status: "All", nationality: "All" });
    setSearchQuery("");
  };

  // --- Filtering ---
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const searchStr =
        `${user.identity?.firstName} ${user.identity?.lastName} ${user.email} ${user.identity?.nationality}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchQuery.toLowerCase());

      const matchesRole = filters.role === "All" || user.role === filters.role;
      const matchesStatus =
        filters.status === "All" || user.status === filters.status;
      const matchesCountry =
        filters.nationality === "All" ||
        user.identity?.nationality === filters.nationality;

      return matchesSearch && matchesRole && matchesStatus && matchesCountry;
    });
  }, [users, searchQuery, filters]);

  // --- Columns ---
  const columns = [
    {
      header: "User",
      render: (user) => (
        <div className="flex items-center gap-3">
          <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${user.identity?.firstName}+${user.identity?.lastName}&background=f1f5f9&color=6366f1`
            }
            className="w-9 h-9 rounded-full border border-slate-200"
            alt={user.identity?.firstName}
          />
          <div>
            <p className="text-sm font-medium text-slate-900">
              {user.identity?.firstName} {user.identity?.lastName}
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      className: "px-6",
      render: (user) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border uppercase ${
            user.role === "admin"
              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
              : "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      header: "Phone",
      className: "px-6",
      render: (user) => (
        <span className="text-sm text-slate-600 font-medium flex items-center gap-2">
          {user.identity?.phone || "—"}
        </span>
      ),
    },
    {
      header: "Country",
      className: "px-6 text-center",
      render: (user) => (
        <span className="text-sm text-slate-700">
          {user.identity?.nationality || "—"}
        </span>
      ),
    },
    {
      header: "Status",
      className: "px-6 text-center",
      render: (user) => (
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              user.status === "Active" || !user.status
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" || !user.status ? "bg-emerald-500" : "bg-slate-400"}`}
            />
            {user.status || "Active"}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      className: "px-4 text-right",
      render: (user) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProfile(user);
            }}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openUserModal(user);
            }}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteUser(user);
            }}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <AdminPageHeader
        title="User Directory"
        subtitle="Manage students and administrators"
        count={users.length}
        primaryAction={{
          label: "Add User",
          icon: Plus,
          onClick: () => openUserModal(),
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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${showFilters ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
            >
              <Filter size={16} /> Filters <ArrowDown size={16} />
            </button>
          </div>
        }
      />

      {showFilters && (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              <option value="All">All Roles</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <AdminTable columns={columns} data={filteredUsers} isLoading={loading} />

      {/* ADD/EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User" : "Add New User"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                  placeholder="John"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                  placeholder="+250..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Role
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Nationality
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) =>
                    setFormData({ ...formData, nationality: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. Rwanda"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {!editingUser && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Temporary Password
                </label>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Set initial password"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Account Status
              </label>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                {["Active", "Inactive"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, status })}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${formData.status === status ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
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
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-70 flex items-center gap-2"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {editingUser ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* PROFILE MODAL */}
      {selectedUser && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title="User Profile"
          size="md"
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center pt-2 pb-6 border-b border-slate-100">
              <img
                src={
                  selectedUser.avatar ||
                  `https://ui-avatars.com/api/?name=${selectedUser.identity?.firstName}+${selectedUser.identity?.lastName}`
                }
                className="w-20 h-20 rounded-full border-4 border-slate-50 mb-4"
                alt={selectedUser.identity?.firstName}
              />
              <h3 className="text-xl font-semibold text-slate-900">
                {selectedUser.identity?.firstName}{" "}
                {selectedUser.identity?.lastName}
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                {selectedUser.email}
              </p>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 uppercase">
                {selectedUser.role}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                  <Phone size={14} /> Phone
                </div>
                <p className="text-sm font-medium text-slate-900">
                  {selectedUser.identity?.phone || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                  <MapPin size={14} /> Nationality
                </div>
                <p className="text-sm font-medium text-slate-900">
                  {selectedUser.identity?.nationality || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                  <Calendar size={14} /> DOB
                </div>
                <p className="text-sm font-medium text-slate-900">
                  {selectedUser.identity?.dob || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase">
                  <Users size={14} /> Gender
                </div>
                <p className="text-sm font-medium text-slate-900">
                  {selectedUser.identity?.gender || "—"}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
