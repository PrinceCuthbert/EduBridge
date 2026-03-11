import React, { useState } from 'react';
import { Activity, CheckCircle2, Clock, XCircle, ChevronDown, Search, Edit2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../../components/Modal';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import AdminStatsGrid from '../../../components/admin/AdminStatsGrid';
import { formatDate } from '../../../utils/formatDate';

// IMPORT THE HOOK
import { useApplications } from '../../../hooks/useApplications';

const STATUS_STYLES = {
  Pending:        'bg-amber-50 text-amber-700 border-amber-200',
  Reviewing:      'bg-blue-50 text-blue-700 border-blue-200',
  'Needs Changes':'bg-orange-50 text-orange-700 border-orange-200',
  Approved:       'bg-green-50 text-green-700 border-green-200',
  Rejected:       'bg-red-50 text-red-700 border-red-200',
};

function TrackerProgress({ stages }) {
  if (!stages) return null;
  const total = stages.length;
  const done  = stages.filter(s => s.completed).length;
  const pct   = Math.round((done / total) * 100) || 0;
  return (
    <div className="flex items-center gap-3 min-w-[160px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{done}/{total}</span>
    </div>
  );
}

export default function AppTracker() {
  // --- USE THE HOOK INSTEAD OF LOCAL STATE ---
  const { applications, loading, updateStatus, updateTrackerStages } = useApplications();
  
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('All');
  const [isSaving, setIsSaving]   = useState(false); // Add saving state

  // Modal / Edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp]   = useState(null);
  const [editStatus, setEditStatus]   = useState('');
  const [editStages, setEditStages]   = useState([]);

  // Update filter logic to match DTO structure
  const filtered = applications.filter(app => {
    const searchString = `${app.applicant?.firstName} ${app.applicant?.lastName}`.toLowerCase();
    const matchSearch = !search || 
      searchString.includes(search.toLowerCase()) ||
      app.trackerId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'Total Tracked',  value: applications.length,                                          icon: Activity,      color: 'text-blue-600',   bg: 'bg-blue-50'  },
    { label: 'Approved',       value: applications.filter(a => a.status === 'Approved').length,      icon: CheckCircle2,  color: 'text-green-600',  bg: 'bg-green-50'  },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'Pending').length,       icon: Clock,         color: 'text-amber-600',  bg: 'bg-amber-50'  },
    { label: 'Needs Action',   value: applications.filter(a => a.status === 'Needs Changes').length, icon: XCircle,       color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const handleEditClick = (app) => {
    setEditingApp(app);
    setEditStatus(app.status);
    // Clone stages deeply for the modal
    setEditStages(app.trackerStages ? app.trackerStages.map(s => ({...s})) : []);
    setIsModalOpen(true);
  };

  const handleToggleStage = (index) => {
    const newStages = [...editStages];
    newStages[index].completed = !newStages[index].completed;
    // Auto-fill date if just completed
    if (newStages[index].completed) {
      newStages[index].date = new Date().toISOString().split('T')[0];
    } else {
       newStages[index].date = null;
    }
    setEditStages(newStages);
  };

  const handleSaveApp = async () => {
    setIsSaving(true);
    try {
      // Use the hook methods to save to localStorage/DB
      if (editStatus !== editingApp.status) {
        await updateStatus(editingApp.trackerId, editStatus);
      }
      await updateTrackerStages(editingApp.trackerId, editStages);
      
      toast.success(`Tracker for ${editingApp.trackerId} updated successfully`);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to update tracker");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <AdminPageHeader
        title="Application Tracker"
        subtitle="EDUC_BRIDGE_APP_TRACKER — monitor every application's stage progression."
      />

      <AdminStatsGrid stats={stats} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {['All','Pending','Reviewing','Needs Changes','Approved','Rejected'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Tracker Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['App ID', 'Student', 'First Submitted', 'Tracker Progress', 'Current Stage', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr><td colSpan={7} className="text-center py-16 text-slate-400"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-slate-400 text-sm">No applications match your filter.</td></tr>
              ) : (
                filtered.map(app => {
                  const stages        = app.trackerStages || []; // Using DTO key 'trackerStages'
                  const currentStage  = [...stages].reverse().find(s => s.completed);
                  const nextStage     = stages.find(s => !s.completed);

                  return (
                    <tr key={app.trackerId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{app.trackerId?.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">{app.applicant?.firstName} {app.applicant?.lastName}</p>
                        <p className="text-xs text-slate-400">{app.applicant?.email}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 font-mono">
                        {app.submissionDate ? formatDate(app.submissionDate) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <TrackerProgress stages={stages} />
                      </td>
                      <td className="px-5 py-4">
                        {currentStage ? (
                          <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
                            {currentStage.stage}
                          </span>
                        ) : <span className="text-xs text-slate-400">Not started</span>}
                        {nextStage && !nextStage.completed && (
                          <p className="text-[10px] text-slate-400 mt-1">Next: {nextStage.stage}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[app.status] || 'bg-slate-50 text-slate-700'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                         <button
                           onClick={() => handleEditClick(app)}
                           className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                           title="Update Tracker"
                         >
                           <Edit2 size={16} />
                         </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editing Modal */}
      {editingApp && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update App Tracker" size="md">
           <div className="space-y-6">
              
              {/* Header Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                   <p className="text-xs text-slate-500 font-mono mb-1">{editingApp.trackerId}</p>
                   <p className="text-sm font-bold text-slate-900">{editingApp.applicant?.firstName} {editingApp.applicant?.lastName}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                   <select
                     value={editStatus}
                     onChange={(e) => setEditStatus(e.target.value)}
                     className="text-sm bg-white border border-slate-300 text-slate-800 rounded-lg px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     {['Pending','Reviewing','Needs Changes','Approved','Rejected'].map(s => (
                       <option key={s} value={s}>{s}</option>
                     ))}
                   </select>
                </div>
              </div>

              {/* Tracker Stages Toggle */}
              <div>
                 <h4 className="text-sm font-bold text-slate-900 mb-3">Tracker Stages Progression</h4>
                 <div className="space-y-2 border border-slate-200 rounded-xl p-2 bg-white">
                    {editStages.map((stage, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleToggleStage(idx)}
                        className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border outline-none 
                          ${stage.completed ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-white border-transparent hover:bg-slate-50'}
                        `}
                      >
                         <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors
                               ${stage.completed ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-300 text-transparent'}
                            `}>
                               <CheckCircle2 size={12} strokeWidth={3} className="text-current" />
                            </div>
                            <span className={`text-sm font-medium transition-colors ${stage.completed ? 'text-blue-900' : 'text-slate-600'}`}>
                               {stage.stage}
                            </span>
                         </div>
                         <span className="text-xs text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                           Toggle
                         </span>
                      </div>
                    ))}
                 </div>
                 <p className="text-[10px] text-slate-500 mt-2 ml-1 text-center">Click a stage to mark it as completed or incomplete.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   disabled={isSaving}
                   className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleSaveApp}
                   disabled={isSaving}
                   className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70"
                 >
                   {isSaving && <Loader2 size={14} className="animate-spin" />}
                   Save Changes
                 </button>
              </div>
           </div>
        </Modal>
      )}

    </div>
  );
}