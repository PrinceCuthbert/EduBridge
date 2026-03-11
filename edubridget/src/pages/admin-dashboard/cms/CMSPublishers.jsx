import React, { useState } from 'react';
import { MOCK_PUBLISHERS } from '../../../data/mockPublishersRoles';
import { toast } from 'sonner';
import { Building2, Plus, Pencil, Trash2, X, Save } from 'lucide-react';



const EMPTY_FORM = { submission_name: '', description: '', contact_email: '', active: true };

function PublisherModal({ publisher, onSave, onClose }) {
  const [form, setForm] = useState(publisher ? { ...publisher } : { ...EMPTY_FORM });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.submission_name.trim()) {
      toast.error('Publisher name is required');
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {publisher ? 'Edit Publisher' : 'Add Publisher'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Publisher Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.submission_name}
              onChange={e => set('submission_name', e.target.value)}
              placeholder="e.g. TM EduBridge"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={form.description || ''}
              onChange={e => set('description', e.target.value)}
              rows={3}
              placeholder="Brief description..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact Email</label>
            <input
              type="email"
              value={form.contact_email || ''}
              onChange={e => set('contact_email', e.target.value)}
              placeholder="contact@publisher.com"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="accent-blue-600 w-4 h-4" />
            <span className="text-sm font-medium text-slate-700">Active</span>
          </label>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors">
            <Save size={15} /> Save Publisher
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CMSPublishers() {
  const [publishers, setPublishers] = useState([...MOCK_PUBLISHERS]);
  const [modal, setModal] = useState(null); // null | 'add' | publisher object

  const handleSave = (form) => {
    if (modal === 'add') {
      const newPub = { ...form, id: Date.now(), created_at: new Date().toISOString().split('T')[0] };
      setPublishers(p => [...p, newPub]);
      toast.success('Publisher added');
    } else {
      setPublishers(p => p.map(pub => pub.id === form.id ? form : pub));
      toast.success('Publisher updated');
    }
    setModal(null);
  };

  const handleDelete = (pub) => {
    toast.warning(`Delete publisher "${pub.submission_name}"?`, {
      action: { label: 'Delete', onClick: () => {
        setPublishers(p => p.filter(x => x.id !== pub.id));
        toast.success('Publisher deleted');
      }},
      cancel: { label: 'Cancel', onClick: () => {} },
      duration: 6000,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Publishers</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage entities that own University Programs.</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add Publisher
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['ID', 'Name', 'Contact Email', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {publishers.length === 0 && (
              <tr><td colSpan={6} className="py-16 text-center text-slate-400 text-sm">No publishers yet. Add one above.</td></tr>
            )}
            {publishers.map(pub => (
              <tr key={pub.id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-5 py-4">
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{pub.id}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Building2 size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{pub.submission_name}</p>
                      {pub.description && <p className="text-xs text-slate-400 truncate max-w-[200px]">{pub.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">{pub.contact_email || '—'}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${pub.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {pub.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-slate-400 font-mono">{pub.created_at}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setModal(pub)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(pub)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <PublisherModal
          publisher={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
