import React, { useState } from 'react';
import { Search, Plus, Award, BookOpen, FileText, Image, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../components/Modal';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('Scholarships');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    status: 'Draft',
    deadline: '',
    description: ''
  });

  const [scholarships, setScholarships] = useState([
    { id: 1, title: 'Canadian Government Scholarship 2024', status: 'Published', deadline: '2024-03-15', applications: 45, views: '1,234', description: 'Full scholarship for graduate students' },
    { id: 2, title: 'MIT Full Scholarship Program', status: 'Draft', deadline: '2024-04-01', applications: 0, views: '0', description: 'Engineering scholarship' },
    { id: 3, title: 'UK Chevening Scholarship', status: 'Published', deadline: '2024-02-28', applications: 67, views: '2,345', description: 'Master\'s degree scholarship' },
    { id: 4, title: 'Australia Awards Africa', status: 'Expired', deadline: '2024-01-15', applications: 89, views: '3,456', description: 'African students scholarship' },
  ]);

  const stats = [
    { label: 'Scholarships', value: scholarships.length, icon: Award, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Library Items', value: '156', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Blog Posts', value: '48', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Media Files', value: '234', icon: Image, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  const handleAddContent = () => {
    setEditingItem(null);
    setFormData({ title: '', status: 'Draft', deadline: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEditContent = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      status: item.status,
      deadline: item.deadline,
      description: item.description
    });
    setIsModalOpen(true);
  };

  const handleDeleteContent = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      setScholarships(scholarships.filter(s => s.id !== item.id));
      toast.success(`${item.title} deleted successfully`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setScholarships(scholarships.map(s => s.id === editingItem.id ? { ...s, ...formData } : s));
      toast.success(`${formData.title} updated successfully`);
    } else {
      const newItem = {
        id: Math.max(...scholarships.map(s => s.id), 0) + 1,
        ...formData,
        applications: 0,
        views: '0'
      };
      setScholarships([...scholarships, newItem]);
      toast.success(`${formData.title} added successfully`);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-700';
      case 'Draft': return 'bg-yellow-100 text-yellow-700';
      case 'Expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredScholarships = scholarships.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Content Management</h2>
        <p className="text-sm md:text-base text-slate-600">Manage scholarships, library, blog posts, and media</p>
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

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="border-b border-slate-200 px-6 overflow-x-auto">
          <div className="flex gap-8 -mb-px">
            {['Scholarships', 'Library', 'Blog Posts', 'Media'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            <button 
              onClick={handleAddContent}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add {activeTab === 'Scholarships' ? 'Scholarship' : 'Content'}</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Deadline</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Applications</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Views</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredScholarships.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-slate-900">{item.title}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">{item.deadline}</td>
                    <td className="py-4 px-4 text-sm text-slate-900 font-medium">{item.applications}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{item.views}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditContent(item)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        >
                          <Edit size={16} className="text-slate-400 group-hover:text-blue-600" />
                        </button>
                        <button 
                          onClick={() => handleDeleteContent(item)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        >
                          <Trash2 size={16} className="text-slate-400 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Scholarship' : 'Add New Scholarship'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Canadian Government Scholarship 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              required
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Brief description..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Deadline</label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
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
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
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
              {editingItem ? 'Update' : 'Add'} Scholarship
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
