import { Plus, Edit, Trash2, MapPin, Calendar, DollarSign } from 'lucide-react';
import Modal from '../../../components/Modal';
import { scholarshipService } from '../../../services/cmsService';
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminTable from "../../../components/admin/AdminTable";
import AdminFilterBar from "../../../components/admin/AdminFilterBar";
import { useCMSManager } from '../../../hooks/useCMSManager';

const EMPTY = { title: '', amount: '', deadline: '', location: '', type: 'Merit-based', description: '', tags: [] };

export default function CMSScholarships() {
  const {
    items: scholarships,
    isLoading,
    isPending,
    searchQuery, setSearchQuery,
    isModalOpen, setIsModalOpen,
    formData, setFormData,
    editingItem,
    handleAdd, handleEdit, handleDelete, handleSubmit,
  } = useCMSManager(scholarshipService, 'scholarships', EMPTY, ['title', 'location']);

  const fd = (k, v) => setFormData((p) => ({ ...p, [k]: v }));


  const columns = [
    {
      header: "Scholarship",
      render: (item) => (
        <div>
          <div className="text-sm font-medium text-slate-900 mb-0.5 line-clamp-1">{item.title}</div>
          <div className="text-xs text-slate-500 line-clamp-1 max-w-[250px]">{item.description}</div>
        </div>
      )
    },
    {
      header: "Amount",
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
          {item.amount}
        </span>
      )
    },
    {
      header: "Deadline",
      render: (item) => (
        <span className="text-slate-500 font-medium text-sm flex items-center gap-2">
          <Calendar size={14} className="text-slate-400" />{item.deadline}
        </span>
      )
    },
    {
      header: "Location",
      render: (item) => (
        <span className="text-slate-700 font-medium text-sm flex items-center gap-2">
          <MapPin size={14} className="text-slate-400" />{item.location}
        </span>
      )
    },
    {
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
          <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader
        title="Scholarships"
        subtitle="Manage grants and opportunities"
        count={scholarships.length}
        primaryAction={{ label: "Add Scholarship", icon: Plus, onClick: handleAdd }}
      />
      <AdminFilterBar searchPlaceholder="Search by title or location..." searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <AdminTable columns={columns} data={scholarships} isLoading={isLoading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Scholarship' : 'Add New Scholarship'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <input type="text" required value={formData.title} onChange={e => fd('title', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                placeholder="e.g. Global Excellence Award" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Amount</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" required value={formData.amount} onChange={e => fd('amount', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium"
                    placeholder="10,000" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Deadline</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="date" value={formData.deadline} onChange={e => fd('deadline', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" required value={formData.location} onChange={e => fd('location', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900"
                    placeholder="e.g. New York, USA" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Type</label>
                <div className="relative">
                  <select value={formData.type} onChange={e => fd('type', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-slate-900">
                    {['Merit-based','Need-based','Diversity','Subject-specific','Regional','Research','Arts'].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea rows={3} required value={formData.description} onChange={e => fd('description', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-slate-900"
                placeholder="Brief details about the scholarship..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">{isPending ? 'Saving…' : editingItem ? 'Update Scholarship' : 'Add Scholarship'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
