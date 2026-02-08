
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Award, DollarSign, Calendar, Globe } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../../components/Modal';
import { MOCK_SCHOLARSHIPS } from '../../../data/mockData';

export default function CMSScholarships() {
  const [scholarships, setScholarships] = useState(MOCK_SCHOLARSHIPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    deadline: '',
    location: '',
    type: 'Merit-based',
    description: '',
    tags: ''
  });

  const filteredScholarships = scholarships.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      amount: '',
      deadline: '',
      location: '',
      type: 'Merit-based',
      description: '',
      tags: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      amount: item.amount,
      deadline: item.deadline,
      location: item.location,
      type: item.type,
      description: item.description,
      tags: item.tags.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      const updated = scholarships.filter(s => s.id !== id);
      setScholarships(updated);
      // Update MOCK
      const index = MOCK_SCHOLARSHIPS.findIndex(s => s.id === id);
      if (index !== -1) MOCK_SCHOLARSHIPS.splice(index, 1);
      toast.success('Scholarship deleted');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    
    if (editingItem) {
      const updated = scholarships.map(s => 
        s.id === editingItem.id ? { ...s, ...formData, tags: tagsArray } : s
      );
      setScholarships(updated);
      // Update MOCK
      const index = MOCK_SCHOLARSHIPS.findIndex(s => s.id === editingItem.id);
      if (index !== -1) {
        MOCK_SCHOLARSHIPS[index] = { ...MOCK_SCHOLARSHIPS[index], ...formData, tags: tagsArray };
      }
      toast.success('Scholarship updated');
    } else {
      const newItem = {
        id: Math.max(...scholarships.map(s => s.id), 0) + 1,
        ...formData,
        tags: tagsArray,
        status: 'Active'
      };
      setScholarships([...scholarships, newItem]);
      MOCK_SCHOLARSHIPS.push(newItem);
      toast.success('Scholarship added');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Scholarships</h2>
        <button 
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus size={20} /> Add Scholarship
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search scholarships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Scholarship</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Deadline</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Location</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScholarships.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <div className="text-sm text-slate-500 line-clamp-1">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 text-emerald-600 font-medium">{item.amount}</td>
                  <td className="px-6 py-4 text-slate-600">{item.deadline}</td>
                  <td className="px-6 py-4 text-slate-600">{item.location}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredScholarships.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No scholarships found matching your search.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Scholarship' : 'Add New Scholarship'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
              <input 
                type="text" 
                required
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
              <input 
                type="date" // Using native date input for simplicity as requested "modern" only for timeline earlier
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input 
                type="text" 
                required
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="Merit-based">Merit-based</option>
                <option value="Need-based">Need-based</option>
                <option value="Diversity">Diversity</option>
                <option value="Subject-specific">Subject-specific</option>
                <option value="Regional">Regional</option>
                <option value="Research">Research</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              rows={3}
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
            <input 
              type="text" 
              placeholder="Undergraduate, Computer Science"
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              {editingItem ? 'Update Scholarship' : 'Add Scholarship'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
