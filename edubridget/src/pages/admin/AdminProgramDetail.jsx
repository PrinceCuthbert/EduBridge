import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Upload, Image as ImageIcon, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_PROGRAMS } from '../../data/mockData';
import DatePicker from '../../components/ui/DatePicker';

export default function AdminProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    universityName: '',
    visaType: 'D-2',
    tags: [],
    country: '',
    description: '',
    tuition: '',
    logo: '',
    images: [],
    departments: [],
    timeline: [],
    requiredDocuments: [],
    status: 'Active'
  });

  const [departmentInput, setDepartmentInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const isNew = id === 'new';

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }

    // Simulate Fetch
    setTimeout(() => {
      const program = MOCK_PROGRAMS.find(p => p.id === parseInt(id));
      if (program) {
        setFormData(program);
      }
      setLoading(false);
    }, 500);
  }, [id, isNew]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isNew) {
      // Create new program
      const newId = Math.max(...MOCK_PROGRAMS.map(p => p.id), 0) + 1;
      const newProgram = { ...formData, id: newId };
      MOCK_PROGRAMS.push(newProgram);
      toast.success('Program created successfully');
    } else {
      // Update existing
      const index = MOCK_PROGRAMS.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        MOCK_PROGRAMS[index] = { ...MOCK_PROGRAMS[index], ...formData };
        toast.success('Program updated successfully');
      }
    }
    
    navigate('/admin/programs');
  };

  const addDepartment = () => {
    if (departmentInput.trim()) {
      setFormData({ ...formData, departments: [...formData.departments, departmentInput.trim()] });
      setDepartmentInput('');
    }
  };

  const removeDepartment = (index) => {
    const newDepts = [...formData.departments];
    newDepts.splice(index, 1);
    setFormData({ ...formData, departments: newDepts });
  };

  const addTimelineStep = () => {
    setFormData({
      ...formData,
      timeline: [...formData.timeline, { step: '', date: '' }]
    });
  };

  const updateTimeline = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][field] = value;
    
    // Auto-generate display string for frontend compatibility
    // If either startDate or endDate is updated, reconstruct the 'date' string
    const start = field === 'startDate' ? value : newTimeline[index].startDate;
    const end = field === 'endDate' ? value : newTimeline[index].endDate;
    
    if (start || end) {
       // Format: YYYY-MM-DD ~ YYYY-MM-DD
       newTimeline[index].date = `${start || ''} ~ ${end || ''}`;
    }

    setFormData({ ...formData, timeline: newTimeline });
  };

  const removeTimeline = (index) => {
    const newTimeline = [...formData.timeline];
    newTimeline.splice(index, 1);
    setFormData({ ...formData, timeline: newTimeline });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/programs')}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{isNew ? 'New Program' : 'Edit Program'}</h1>
            <p className="text-slate-500 text-sm">{isNew ? 'Create a new university program' : 'Update university program details'}</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Save size={20} />
          {isNew ? 'Create Program' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
             <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Basic Information</h2>
             <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">University Name</label>
                 <input 
                   type="text" 
                   value={formData.universityName} 
                   onChange={(e) => setFormData({...formData, universityName: e.target.value})}
                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary/20 focus:border-primary outline-none"
                 />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Visa Type</label>
                  <select 
                    value={formData.visaType}
                    onChange={(e) => setFormData({...formData, visaType: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="D-2">D-2 (Degree)</option>
                    <option value="D-4">D-4 (Language)</option>
                  </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                 <input 
                   type="text" 
                   value={formData.country} 
                   onChange={(e) => setFormData({...formData, country: e.target.value})}
                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary/20 focus:border-primary outline-none"
                 />
               </div>
               <div className="col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                 <textarea 
                   rows="4"
                   value={formData.description} 
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary/20 focus:border-primary outline-none resize-none"
                 />
               </div>
             </div>
          </div>

          {/* Timeline & Steps */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
             <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                <h2 className="text-lg font-bold text-slate-800">Application Timeline</h2>
                <button onClick={addTimelineStep} className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
                  <Plus size={16} /> Add Step
                </button>
             </div>
             
             <div className="space-y-3">
               {formData.timeline.map((item, idx) => (
                 <div key={idx} className="flex gap-3 items-start">
                   <div className="flex-1">
                     <input 
                       type="text" 
                       placeholder="Step Name (e.g. Document Reception)"
                       value={item.step}
                       onChange={(e) => updateTimeline(idx, 'step', e.target.value)}
                       className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                     />
                   </div>
                   <div className="flex-1">

                     <div className="flex items-center gap-2">
                       <div className="flex-1">
                         <DatePicker 
                           value={item.startDate}
                           onChange={(date) => updateTimeline(idx, 'startDate', date)}
                           placeholder="Start Date"
                         />
                       </div>
                       <span className="text-slate-400 text-xs">to</span>
                       <div className="flex-1">
                         <DatePicker 
                           value={item.endDate}
                           onChange={(date) => updateTimeline(idx, 'endDate', date)}
                           placeholder="End Date"
                         />
                       </div>
                     </div>

                   </div>
                   <button onClick={() => removeTimeline(idx)} className="p-2 text-slate-400 hover:text-red-500">
                     <Trash2 size={18} />
                   </button>
                 </div>
               ))}
               {formData.timeline.length === 0 && <p className="text-slate-500 italic text-sm">No timeline steps added.</p>}
             </div>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
             <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Departments & Majors</h2>
             
             <div className="flex gap-2 mb-4">
               <input 
                 type="text" 
                 value={departmentInput}
                 onChange={(e) => setDepartmentInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && addDepartment()}
                 placeholder="Add department..."
                 className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
               />
               <button onClick={addDepartment} className="px-4 py-2 bg-slate-100 font-medium text-slate-700 rounded-lg hover:bg-slate-200">
                 Add
               </button>
             </div>

             <div className="flex flex-wrap gap-2">
                {formData.departments.map((dept, idx) => (
                   <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2">
                      {dept}
                      <button onClick={() => removeDepartment(idx)} className="hover:text-blue-900"><XCircle size={14}/></button>
                   </span>
                ))}
             </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Media */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
             <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Media</h2>
             
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={formData.logo}
                   onChange={(e) => setFormData({...formData, logo: e.target.value})}
                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                 />
               </div>
               {formData.logo && (
                 <div className="mt-2 w-20 h-20 border border-slate-200 rounded p-1">
                   <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                 </div>
               )}
             </div>
             
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Gallery Images (URLs)</label>
               <div className="space-y-2">
                  {formData.images.map((img, idx) => (
                     <div key={idx} className="flex gap-2">
                        <input 
                          type="text"
                          value={img}
                          onChange={(e) => {
                             const newImages = [...formData.images];
                             newImages[idx] = e.target.value;
                             setFormData({...formData, images: newImages});
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                        <button 
                           onClick={() => {
                             const newImages = formData.images.filter((_, i) => i !== idx);
                             setFormData({...formData, images: newImages});
                           }}
                           className="text-red-500"
                        ><Trash2 size={16}/></button>
                     </div>
                  ))}
                  <button 
                    onClick={() => setFormData({...formData, images: [...formData.images, '']})}
                    className="text-sm text-primary font-medium flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Image
                  </button>
               </div>
             </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
             <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Settings</h2>
             
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Tuition / Fee</label>
               <input 
                 type="text"
                 value={formData.tuition}
                 onChange={(e) => setFormData({...formData, tuition: e.target.value})}
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" 
               />
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (Comma separated)</label>
                <input 
                   type="text" 
                   value={formData.tags.join(', ')}
                   onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                   value={formData.status}
                   onChange={(e) => setFormData({...formData, status: e.target.value})}
                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                   <option value="Active">Active</option>
                   <option value="Draft">Draft</option>
                   <option value="Archived">Archived</option>
                </select>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
