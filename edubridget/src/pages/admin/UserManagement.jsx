import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Users,
  UserCircle,
  Shield,
  Edit,
  Trash2,
  Eye,
  X,
  ChevronDown,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import Modal from "../../components/Modal";

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
        // TODO: Replace with actual API call when backend is ready
        // const response = await userAPI.getAll();
        // setUsers(response.data);

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
      bg: "bg-blue-50",
    },
    {
      label: "Students",
      value: users.filter((u) => u.role === "Student").length,
      icon: UserCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Admins",
      value: users.filter((u) => u.role === "Admin").length,
      icon: Shield,
      color: "text-purple-600",
      bg: "bg-purple-50",
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

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-700";
  };

  const getRoleBadgeColor = (role) => {
    return role === "Admin"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          User Management
        </h2>
        <p className="text-slate-600">Manage students and staff accounts</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-slate-200">
              <div
                className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center mb-4`}>
                <Icon size={24} className={stat.color} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200">
        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
              <Filter size={18} />
              Filters
              {(filters.role !== "All" ||
                filters.status !== "All" ||
                filters.country !== "All") && (
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              )}
            </button>
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm group">
                <Download size={18} />
                Export
                <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">
                  Export as Excel
                </button>
                <button
                  onClick={() => handleExport("api")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">
                  Export All (API)
                </button>
              </div>
            </div>
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
              <Plus size={18} />
              Add User
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={filters.role}
                  onChange={(e) =>
                    setFilters({ ...filters, role: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                  <option value="All">All Roles</option>
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                </select>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <select
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({ ...filters, country: e.target.value })
                  }
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                  <option value="All">All Countries</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Burundi">Burundi</option>
                </select>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary-dark font-medium">
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500">Loading users...</p>
            </div>
          </div>
        ) : users && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Users size={36} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">No users found</p>
            <p className="text-sm text-slate-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto modern-scrollbar-light">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-6 text-sm font-semibold text-slate-600 uppercase">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">
                      Country
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">
                      Joined
                    </th>
                    <th className="text-right py-3 px-6 text-sm font-semibold text-slate-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-sm">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-slate-600">
                          {user.phone}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {user.country}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {user.joined}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewProfile(user)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                            title="View Profile">
                            <Eye
                              size={16}
                              className="text-slate-400 group-hover:text-blue-600"
                            />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                            <Edit
                              size={16}
                              className="text-slate-400 group-hover:text-blue-600"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                            <Trash2
                              size={16}
                              className="text-slate-400 group-hover:text-red-600"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User" : "Add New User"}
        size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="+250 788 123 456"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Country
              </label>
              <select
                required
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                <option value="">Select Country</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Burundi">Burundi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Role
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? "Saving..." : editingUser ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Profile View Modal */}
      {selectedUser && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title="User Profile"
          size="md">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-2xl">
                  {selectedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedUser.name}
                </h3>
                <p className="text-slate-600">{selectedUser.email}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Phone</p>
                <p className="font-medium text-slate-900">
                  {selectedUser.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Country</p>
                <p className="font-medium text-slate-900">
                  {selectedUser.country}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedUser.status)}`}>
                  {selectedUser.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Joined</p>
                <p className="font-medium text-slate-900">
                  {selectedUser.joined}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
