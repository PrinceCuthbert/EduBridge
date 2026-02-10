import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Upload, Image as ImageIcon, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_PROGRAMS } from '../../data/mockData';
import DatePicker from '../../components/ui/DatePicker';
import AdminCard from '../../components/admin/AdminCard';

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
      timeline: [...formData.timeline, { step: '', startDate: '', endDate: '', date: '' }]
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

  if (loading) return <div className="p-12 text-center text-slate-500 font-serif">Loading program details...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin/programs')}
            className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-all active:scale-95 border border-transparent hover:border-slate-100"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-3xl font-serif text-[#0F172A] tracking-tight">{isNew ? 'New Program' : 'Edit Program'}</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium tracking-wide">{isNew ? 'Create a new university program' : 'Update university program details'}</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2.5 px-8 py-3.5 bg-[#0F172A] text-white rounded-[1.25rem] font-bold text-xs uppercase tracking-widest hover:bg-[#1E293B] shadow-xl hover:shadow-2xl hover:translate-y-[-2px] transition-all active:scale-95"
        >
          <Save size={18} />
          {isNew ? 'Create Program' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info Card */}
          <AdminCard title="Basic Information">
             <div className="grid grid-cols-2 gap-8">
               <div className="col-span-2">
                 <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">University Name</label>
                 <input 
                   type="text" 
                   value={formData.universityName} 
                   onChange={(e) => setFormData({...formData, universityName: e.target.value})}
                   className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-[#0F172A] font-medium focus:bg-white focus:border-slate-300 focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                   placeholder="Enter official university name..."
                 />
               </div>
               <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Visa Type</label>
                  <div className="relative">
                    <select 
                      value={formData.visaType}
                      onChange={(e) => setFormData({...formData, visaType: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-[#0F172A] font-medium focus:bg-white focus:border-slate-300 focus:ring-0 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="D-2">D-2 (Degree)</option>
                      <option value="D-4">D-4 (Language)</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
               </div>
               <div>
                 <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Country</label>
                 <input 
                   type="text" 
                   value={formData.country} 
                   onChange={(e) => setFormData({...formData, country: e.target.value})}
                   className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-[#0F172A] font-medium focus:bg-white focus:border-slate-300 focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                   placeholder="Target country..."
                 />
               </div>
               <div className="col-span-2">
                 <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Description</label>
                 <textarea 
                   rows="4"
                   value={formData.description} 
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-[#0F172A] font-medium focus:bg-white focus:border-slate-300 focus:ring-0 outline-none transition-all placeholder:text-slate-300 resize-none leading-relaxed"
                   placeholder="Detailed academic program description..."
                 />
               </div>
             </div>
          </AdminCard>

          {/* Timeline & Steps */}
          <AdminCard 
            title="Application Timeline"
            action={
              <button 
                onClick={addTimelineStep} 
                className="text-blue-600 hover:text-blue-700 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 px-4 py-2 hover:bg-blue-50 rounded-xl transition-all"
              >
                <Plus size={14} /> Add Step
              </button>
            }
          >
             <div className="space-y-4">
               {formData.timeline.map((item, idx) => (
                 <div key={idx} className="flex flex-col md:flex-row gap-4 items-start group">
                   <div className="flex-1 w-full">
                     <input 
                       type="text" 
                       placeholder="Step Name (e.g. Document Reception)"
                       value={item.step}
                       onChange={(e) => updateTimeline(idx, 'step', e.target.value)}
                       className="w-full px-5 py-3.5 border border-slate-200 rounded-[1.25rem] text-sm font-medium focus:border-blue-400 focus:ring-0 outline-none transition-all"
                     />
                   </div>
                   <div className="flex-1 w-full">
                     <div className="flex items-center gap-3">
                       <div className="flex-1">
                         <DatePicker 
                           value={item.startDate}
                           onChange={(date) => updateTimeline(idx, 'startDate', date)}
                           placeholder="Start Date"
                           className="w-full px-5 py-3.5 border border-slate-200 rounded-[1.25rem] text-sm focus:border-blue-400 outline-none"
                         />
                       </div>
                       <span className="text-slate-300 text-[10px] font-bold uppercase">to</span>
                       <div className="flex-1">
                         <DatePicker 
                           value={item.endDate}
                           onChange={(date) => updateTimeline(idx, 'endDate', date)}
                           placeholder="End Date"
                           className="w-full px-5 py-3.5 border border-slate-200 rounded-[1.25rem] text-sm focus:border-blue-400 outline-none"
                         />
                       </div>
                     </div>
                   </div>
                   <button 
                     onClick={() => removeTimeline(idx)} 
                     className="p-3.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
               ))}
               {formData.timeline.length === 0 && (
                 <div className="py-8 text-center bg-slate-50/50 rounded-[1.5rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium text-sm">No timeline steps configured.</p>
                 </div>
               )}
             </div>
          </AdminCard>

          {/* Departments */}
          <AdminCard title="Departments & Majors">
             <div className="flex gap-4 mb-6">
               <input 
                 type="text" 
                 value={departmentInput}
                 onChange={(e) => setDepartmentInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && addDepartment()}
                 placeholder="Enter department name..."
                 className="flex-1 px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] text-[#0F172A] font-medium focus:bg-white focus:border-slate-300 focus:ring-0 outline-none transition-all placeholder:text-slate-300"
               />
               <button 
                 onClick={addDepartment} 
                 className="px-8 py-4 bg-[#0F172A] text-white font-bold text-xs uppercase tracking-widest rounded-[1.5rem] hover:bg-[#1E293B] shadow-lg hover:translate-y-[-1px] transition-all active:scale-95"
               >
                 Add
               </button>
             </div>

             <div className="flex flex-wrap gap-3">
                {formData.departments.map((dept, idx) => (
                   <span key={idx} className="pl-5 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-sm">
                      {dept}
                      <button onClick={() => removeDepartment(idx)} className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                        <XCircle size={16}/>
                      </button>
                   </span>
                ))}
                {formData.departments.length === 0 && (
                  <span className="text-slate-400 text-sm italic py-2">No departments listed yet.</span>
                )}
             </div>
          </AdminCard>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Media */}
          <AdminCard title="Media">
             <div className="space-y-6">
               <div>
                 <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Logo URL</label>
                 <input 
                   type="text" 
                   value={formData.logo}
                   onChange={(e) => setFormData({...formData, logo: e.target.value})}
                   className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] text-sm font-medium focus:bg-white focus:border-blue-200 outline-none transition-all"
                   placeholder="https://..."
                 />
                 {formData.logo && (
                   <div className="mt-4 w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl p-2 flex items-center justify-center shadow-sm">
                     <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                   </div>
                 )}
               </div>
               
               <div>
                 <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Gallery Images</label>
                 <div className="space-y-3">
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
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-200 outline-none transition-all"
                            placeholder="Image URL..."
                          />
                          <button 
                             onClick={() => {
                               const newImages = formData.images.filter((_, i) => i !== idx);
                               setFormData({...formData, images: newImages});
                             }}
                             className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          ><Trash2 size={16}/></button>
                       </div>
                    ))}
                    <button 
                      onClick={() => setFormData({...formData, images: [...formData.images, '']})}
                      className="text-[11px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-2 px-2 py-1"
                    >
                      <Plus size={14} /> Add Image
                    </button>
                 </div>
               </div>
             </div>
          </AdminCard>

          {/* Settings */}
          <AdminCard title="Settings">
             <div className="space-y-6">
               <div>
                 <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Tuition / Fee</label>
                 <input 
                   type="text"
                   value={formData.tuition}
                   onChange={(e) => setFormData({...formData, tuition: e.target.value})}
                   className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] text-sm font-medium focus:bg-white focus:border-blue-200 outline-none transition-all"
                   placeholder="$..." 
                 />
               </div>

               <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Tags (Comma separated)</label>
                  <input 
                     type="text" 
                     value={formData.tags.join(', ')}
                     onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                     className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] text-sm font-medium focus:bg-white focus:border-blue-200 outline-none transition-all"
                     placeholder="e.g. BESTSELLER, NEW"
                  />
               </div>

               <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Status</label>
                  <div className="relative">
                    <select 
                       value={formData.status}
                       onChange={(e) => setFormData({...formData, status: e.target.value})}
                       className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] text-sm font-medium focus:bg-white focus:border-blue-200 outline-none transition-all appearance-none cursor-pointer"
                    >
                       <option value="Active">Active</option>
                       <option value="Draft">Draft</option>
                       <option value="Archived">Archived</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
               </div>
             </div>
          </AdminCard>

        </div>
      </div>
    </div>
  );
}
