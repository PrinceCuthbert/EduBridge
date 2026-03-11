import React, { useState } from 'react';
import { MOCK_ROLES } from '../../../data/mockPublishersRoles';
import { toast } from 'sonner';
import { Shield, Plus, Pencil, Trash2, X, Save, Users } from 'lucide-react';

/**
 * RoleManagement — ROLES entity management (Priority 9)
 * Schema: ROLES { id, name }
 *
 * Admin can view, add, edit, and delete roles.
 * These roles are used by AuthContext to assign roleId on login.
 *
 * Backend: GET/POST/PUT/DELETE /api/roles
 *          PATCH /api/users/:id/role { role_id }
 */

const ROLE_COLORS = {
  admin:   { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: 'text-purple-600' },
  student: { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   icon: 'text-blue-600'   },
  staff:   { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   icon: 'text-teal-600'   },
};

function RoleModal({ role, onSave, onClose }) {
  const [form, setForm] = useState(role ? { ...role } : { name: '', description: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Role name is required'); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{role ? 'Edit Role' : 'Add Role'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Role Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
              placeholder="e.g. student, admin, staff"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-xs text-slate-400 mt-1">Use lowercase, no spaces (underscores ok)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={form.description || ''}
              onChange={e => set('description', e.target.value)}
              rows={3}
              placeholder="What permissions does this role have?"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors">
            <Save size={15} /> Save Role
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RoleManagement() {
  const [roles, setRoles] = useState([...MOCK_ROLES]);
  const [modal, setModal] = useState(null); // null | 'add' | role object

  const SYSTEM_ROLES = ['admin', 'student']; // cannot be deleted

  const handleSave = (form) => {
    if (modal === 'add') {
      const exists = roles.some(r => r.name === form.name);
      if (exists) { toast.error(`Role "${form.name}" already exists`); return; }
      setRoles(p => [...p, { ...form, id: Date.now() }]);
      toast.success('Role created');
    } else {
      setRoles(p => p.map(r => r.id === form.id ? form : r));
      toast.success('Role updated');
    }
    setModal(null);
  };

  const handleDelete = (role) => {
    if (SYSTEM_ROLES.includes(role.name)) {
      toast.error(`Cannot delete system role "${role.name}"`);
      return;
    }
    toast.warning(`Delete role "${role.name}"?`, {
      description: 'Users with this role will lose access.',
      action: { label: 'Delete', onClick: () => { setRoles(p => p.filter(r => r.id !== role.id)); toast.success('Role deleted'); } },
      cancel: { label: 'Cancel', onClick: () => {} },
      duration: 8000,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Role Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage system roles for access control. Roles are assigned to users at login.</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Role
        </button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roles.map(role => {
          const style = ROLE_COLORS[role.name] || ROLE_COLORS.staff;
          const isSystem = SYSTEM_ROLES.includes(role.name);
          return (
            <div key={role.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${style.bg} flex items-center justify-center`}>
                  <Shield size={20} className={style.icon} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setModal(role)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(role)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <span className={`font-bold text-base ${style.text} font-mono`}>{role.name}</span>
                {isSystem && (
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wide">System</span>
                )}
              </div>

              <p className="text-sm text-slate-500 leading-relaxed">{role.description}</p>

              <div className={`mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5`}>
                <Users size={13} className="text-slate-400" />
                <span className="text-xs text-slate-400">Role ID: {role.id}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note on AuthContext */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Shield size={18} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-1">Backend Integration Note</p>
            <p className="text-sm text-blue-700 leading-relaxed">
              On login, <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">AuthContext</code> now attaches a{' '}
              <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">roleId</code> by looking up the user's role name
              against this table. When a real backend is connected, replace this with{' '}
              <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">GET /api/roles</code> and{' '}
              <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">PATCH /api/users/:id/role</code>.
            </p>
          </div>
        </div>
      </div>

      {modal !== null && <RoleModal role={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
