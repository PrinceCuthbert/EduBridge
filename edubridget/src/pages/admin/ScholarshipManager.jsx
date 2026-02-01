import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, XCircle, FileText, Globe, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import DatePicker from '../../components/ui/DatePicker';

export default function ScholarshipManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Dummy Data
  const [scholarships, setScholarships] = useState([
    {
      id: 1,
      title: 'Global Excellence Scholarship',
      country: 'UK',
      deadline: new Date('2024-05-15'),
      type: 'External',
      status: 'Active',
      applicants: 45,
      link: 'https://example.com/scholarship'
    },
    {
      id: 2,
      title: 'EduBridge Merit Award',
      country: 'Canada',
      deadline: new Date('2024-06-30'),
      type: 'Internal',
      status: 'Active',
      applicants: 12,
      requiredDocs: ['Passport', 'Transcripts']
    },
    {
      id: 3,
      title: 'Future Leaders Grant',
      country: 'USA',
      deadline: new Date('2024-04-01'),
      type: 'External',
      status: 'Expired',
      applicants: 89,
      link: 'https://example.com/grant'
    }
  ]);

  const [newScholarship, setNewScholarship] = useState({
    title: '',
    country: '',
    deadline: '',
    type: 'External',
    link: '',
    description: '',
    requiredDocs: ['Passport', 'Transcripts']
  });

  const availableDocs = [
    { id: 'Passport', label: 'Valid Passport' },
    { id: 'Transcripts', label: 'Academic Transcripts' },
    { id: 'CV', label: 'Curriculum Vitae (CV)' },
    { id: 'Recommendation', label: 'Recommendation Letter' },
    { id: 'Statement', label: 'Statement of Purpose' },
    { id: 'EnglishTest', label: 'English Proficiency Test' }
  ];

  const resetForm = () => {
    setNewScholarship({
      title: '',
      country: '',
      deadline: '',
      type: 'External',
      link: '',
      description: '',
      requiredDocs: ['Passport', 'Transcripts']
    });
    setEditingId(null);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setScholarships(scholarships.map(s => 
        s.id === editingId ? { ...s, ...newScholarship, deadline: newScholarship.deadline || s.deadline } : s
      ));
      toast.success('Scholarship updated successfully');
    } else {
      const newEntry = {
        id: scholarships.length + 1,
        ...newScholarship,
        status: 'Active',
        applicants: 0
      };
      setScholarships([newEntry, ...scholarships]);
      toast.success('Scholarship created successfully');
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    toast("Are you sure you want to delete this?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setScholarships((prev) => prev.filter((s) => s.id !== id));
          toast.success("Scholarship deleted successfully");
        },
      },
      cancel: {
        label: "Cancel",
      },
      duration: 5000,
    });
  };

  const handleEdit = (scholarship) => {
    setEditingId(scholarship.id);
    setNewScholarship({
      title: scholarship.title,
      country: scholarship.country,
      deadline: scholarship.deadline,
      type: scholarship.type,
      link: scholarship.link || '',
      description: scholarship.description || '',
      requiredDocs: scholarship.requiredDocs || ['Passport', 'Transcripts']
    });
    setIsModalOpen(true);
  };

  const toggleDoc = (docId) => {
    setNewScholarship(prev => {
      const docs = prev.requiredDocs.includes(docId)
        ? prev.requiredDocs.filter(d => d !== docId)
        : [...prev.requiredDocs, docId];
      return { ...prev, requiredDocs: docs };
    });
  };

  const filteredScholarships = scholarships.filter(s => 
    (statusFilter === 'All' || s.status === statusFilter) &&
    (s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search scholarships..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-medium transition-colors">
            <Filter size={20} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Scholarship</span>
          </button>
        </div>
      </div>

      {/* Scholarships List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Scholarship Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScholarships.map((scholarship) => (
                <tr key={scholarship.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {scholarship.country.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{scholarship.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <MapPin size={12} /> {scholarship.country}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      scholarship.type === 'Internal' 
                        ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                        : 'bg-orange-50 text-orange-700 border border-orange-100'
                    }`}>
                      {scholarship.type === 'Internal' ? <FileText size={12} /> : <Globe size={12} />}
                      {scholarship.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(scholarship.deadline).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      scholarship.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {scholarship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(scholarship)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(scholarship.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <form onSubmit={handleCreate}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingId ? 'Edit Scholarship' : 'Add New Scholarship'}
                </h2>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Scholarship Title</label>
                   <input 
                     type="text" 
                     required
                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                     placeholder="e.g. British Council Merit Scholarship"
                     value={newScholarship.title}
                     onChange={(e) => setNewScholarship({...newScholarship, title: e.target.value})}
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Country</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="e.g. UK"
                      value={newScholarship.country}
                      onChange={(e) => setNewScholarship({...newScholarship, country: e.target.value})}
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Deadline</label>
                    <DatePicker 
                        value={newScholarship.deadline}
                        onChange={(date) => setNewScholarship({...newScholarship, deadline: date})} 
                    />
                  </div>
                </div>

                {/* Application Type Logic */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                   <p className="text-sm font-bold text-slate-700">Application Method</p>
                   <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="appType" 
                          className="text-primary focus:ring-primary"
                          checked={newScholarship.type === 'External'}
                          onChange={() => setNewScholarship({...newScholarship, type: 'External'})}
                        />
                        <span className="text-sm text-slate-700">External Link</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="appType" 
                          className="text-primary focus:ring-primary"
                          checked={newScholarship.type === 'Internal'}
                          onChange={() => setNewScholarship({...newScholarship, type: 'Internal'})}
                        />
                        <span className="text-sm text-slate-700">Internal Form</span>
                      </label>
                   </div>

                   {newScholarship.type === 'External' ? (
                     <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">External Application Link</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="url" 
                            placeholder="https://..."
                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                            value={newScholarship.link}
                            onChange={(e) => setNewScholarship({...newScholarship, link: e.target.value})}
                          />
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                       <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                         <p className="font-bold mb-1">Configure Internal Application</p>
                         Select the documents students must provide for this scholarship.
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2">
                          {availableDocs.map(doc => (
                              <label key={doc.id} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                                  <input 
                                      type="checkbox" 
                                      className="text-primary rounded focus:ring-primary"
                                      checked={newScholarship.requiredDocs.includes(doc.id)}
                                      onChange={() => toggleDoc(doc.id)}
                                  />
                                  <span className="text-xs font-medium text-slate-700">{doc.label}</span>
                              </label>
                          ))}
                       </div>
                     </div>
                   )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Description (Optional)</label>
                  <textarea 
                    rows="3"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    placeholder="Key requirements, eligibility, etc."
                    value={newScholarship.description}
                    onChange={(e) => setNewScholarship({...newScholarship, description: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  {editingId ? 'Update Scholarship' : 'Create Scholarship'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
