import React, { useState } from 'react';
import { Plus, Building, Users, MapPin, Phone, Mail, Clock, Edit, Trash2, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../components/Modal';

export default function BranchManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    hours: '',
    students: 0,
    staff: 0,
    managerName: '',
    status: 'Active'
  });

  const [branches, setBranches] = useState([
    {
      id: 1,
      name: 'EduBridge Rwanda HQ',
      location: 'Kigali, Rwanda',
      address: 'KG 123 Street, Nyarugenge District',
      phone: '+250 788 123 456',
      email: 'rwanda@edubridge.com',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 8AM-1PM',
      students: 856,
      staff: 12,
      managerName: 'Jean Claude Niyonzima',
      status: 'Active'
    },
    {
      id: 2,
      name: 'EduBridge Kenya',
      location: 'Nairobi, Kenya',
      address: 'Westlands Business Park, Tower A',
      phone: '+254 700 123 456',
      email: 'kenya@edubridge.com',
      hours: 'Mon-Fri: 8AM-6PM',
      students: 623,
      staff: 8,
      managerName: 'Sarah Wanjiku',
      status: 'Active'
    },
    {
      id: 3,
      name: 'EduBridge Uganda',
      location: 'Kampala, Uganda',
      address: 'Plot 24, Nakasero Road',
      phone: '+256 772 123 456',
      email: 'uganda@edubridge.com',
      hours: 'Mon-Fri: 8:30AM-5:30PM',
      students: 445,
      staff: 6,
      managerName: 'David Ochieng',
      status: 'Active'
    },
    {
      id: 4,
      name: 'EduBridge Tanzania',
      location: 'Dar es Salaam, Tanzania',
      address: 'Posta Road, CBD',
      phone: '+255 755 123 456',
      email: 'tanzania@edubridge.com',
      hours: 'Opening Q2 2024',
      students: 0,
      staff: 2,
      managerName: 'Amina Hassan',
      status: 'Coming Soon'
    },
  ]);

  const stats = [
    { label: 'Active Branches', value: branches.filter(b => b.status === 'Active').length, icon: Building, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Students', value: branches.reduce((sum, b) => sum + b.students, 0).toLocaleString(), icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Staff', value: branches.reduce((sum, b) => sum + b.staff, 0), icon: UserCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Countries', value: new Set(branches.map(b => b.location.split(', ')[1])).size, icon: MapPin, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  const handleAddBranch = () => {
    setEditingBranch(null);
    setFormData({ name: '', location: '', address: '', phone: '', email: '', hours: '', students: 0, staff: 0, managerName: '', status: 'Active' });
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
      students: branch.students,
      staff: branch.staff,
      managerName: branch.managerName,
      status: branch.status
    });
    setIsModalOpen(true);
  };

  const handleDeleteBranch = (branchId, branchName) => {
    if (window.confirm(`Are you sure you want to delete "${branchName}"? This action cannot be undone.`)) {
      setBranches(branches.filter(b => b.id !== branchId));
      toast.success(`${branchName} deleted successfully`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBranch) {
      setBranches(branches.map(b => b.id === editingBranch.id ? { ...b, ...formData } : b));
      toast.success(`${formData.name} updated successfully`);
    } else {
      const newBranch = {
        id: Math.max(...branches.map(b => b.id), 0) + 1,
        ...formData
      };
      setBranches([...branches, newBranch]);
      toast.success(`${formData.name} added successfully`);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Branch Management</h2>
          <p className="text-sm md:text-base text-slate-600">Manage regional offices and contact details</p>
        </div>
        <button 
          onClick={handleAddBranch}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          Add Branch
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
              <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center mb-4`}>
                <Icon size={24} className={stat.color} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{branch.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin size={14} /> {branch.location}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(branch.status)}`}>
                {branch.status}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4 text-sm">
              <p className="text-slate-600">{branch.address}</p>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone size={16} className="text-slate-400" />
                <span>{branch.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail size={16} className="text-slate-400" />
                <span>{branch.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock size={16} className="text-slate-400" />
                <span>{branch.hours}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400" />
                  {branch.students} students, {branch.staff} staff
                </span>
              </div>
            </div>

            {/* Manager */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {branch.managerName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{branch.managerName}</p>
                  <p className="text-xs text-slate-500">Branch Manager</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditBranch(branch)}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                >
                  <Edit size={16} className="text-slate-600 group-hover:text-blue-600" />
                </button>
                <button 
                  onClick={() => handleDeleteBranch(branch.id, branch.name)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <Trash2 size={16} className="text-slate-600 group-hover:text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Branch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBranch ? 'Edit Branch' : 'Add New Branch'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Branch Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="EduBridge Kenya"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="Nairobi, Kenya"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Westlands Business Park, Tower A"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="+254 700 123 456"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="kenya@edubridge.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Operating Hours</label>
            <input
              type="text"
              required
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Mon-Fri: 8AM-6PM"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Students</label>
              <input
                type="number"
                required
                min="0"
                value={formData.students}
                onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Staff</label>
              <input
                type="number"
                required
                min="0"
                value={formData.staff}
                onChange={(e) => setFormData({ ...formData, staff: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="Active">Active</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Manager Name</label>
            <input
              type="text"
              required
              value={formData.managerName}
              onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Sarah Wanjiku"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {editingBranch ? 'Update Branch' : 'Add Branch'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
