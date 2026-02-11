import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../../../components/Modal';
import { MOCK_SCHOLARSHIPS } from '../../../data/mockData';
import { useCMSManager } from '@/hooks/useCMSManager'; 
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminTable from "../../../components/admin/AdminTable";
import AdminFilterBar from "../../../components/admin/AdminFilterBar";

export default function CMSScholarships() {
  const {
    items: filteredScholarships,
    // handleSearch, // Not used directly with AdminFilterBar simple binding
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    formData,
    setFormData,
    editingItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit
  } = useCMSManager(
    MOCK_SCHOLARSHIPS,
    { title: '', amount: '', deadline: '', location: '', type: 'Merit-based', description: '', tags: [] },
    ['title', 'location']
  );

  const columns = [
    {
      header: "Scholarship Details",
      render: (item) => (
        <div>
          <div className="font-serif text-[15px] font-bold text-slate-900 mb-0.5">{item.title}</div>
          <div className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">{item.description}</div>
        </div>
      )
    },
    {
      header: "Amount",
      render: (item) => (
        <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
          {item.amount}
        </span>
      )
    },
    {
      header: "Deadline",
      render: (item) => (
        <span className="text-slate-600 font-medium text-sm">
          {item.deadline}
        </span>
      )
    },
    {
      header: "Location",
      render: (item) => (
        <span className="text-slate-700 font-bold text-sm">
          {item.location}
        </span>
      )
    },
    {
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => handleEdit(item)} 
            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => handleDelete(item.id, 'Scholarship')} 
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <AdminPageHeader 
        title="Scholarships Management" 
        subtitle="Manage scholarship opportunities and grant details."
        count={filteredScholarships.length}
        countLabel="Active Grants"
        primaryAction={{
          label: "Add Scholarship",
          icon: Plus,
          onClick: handleAdd
        }}
      />

      <AdminFilterBar 
        searchPlaceholder="Search scholarships by title or location..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AdminTable 
        columns={columns}
        data={filteredScholarships}
        isLoading={false}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Scholarship' : 'Add New Scholarship'}
        size="lg"
        className="rounded-[2.5rem]"
      >
        <form onSubmit={(e) => handleSubmit(e, 'Scholarship')} className="space-y-6 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-serif text-slate-900"
                placeholder="e.g. Global Excellence Award"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Amount</label>
                <input 
                  type="text" 
                  required
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-emerald-600"
                  placeholder="$10,000"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Deadline</label>
                <input 
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Location</label>
                <input 
                  type="text" 
                  required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                  placeholder="e.g. New York, USA"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Type</label>
                <div className="relative">
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none"
                  >
                    <option value="Merit-based">Merit-based</option>
                    <option value="Need-based">Need-based</option>
                    <option value="Diversity">Diversity</option>
                    <option value="Subject-specific">Subject-specific</option>
                    <option value="Regional">Regional</option>
                    <option value="Research">Research</option>
                    <option value="Arts">Arts</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Description</label>
              <textarea 
                rows={3}
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                placeholder="Brief details about the scholarship..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 text-slate-500 hover:text-slate-700 font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              {editingItem ? 'Update Scholarship' : 'Add Scholarship'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
