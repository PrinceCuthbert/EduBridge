import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, XCircle, Globe, DollarSign, Image as ImageIcon } from 'lucide-react';
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

  const isNew = id === 'new';

  // Common styles for inputs to ensure consistency
  const inputClassName = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400";
  const labelClassName = "block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

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
      const newId = Math.max(...MOCK_PROGRAMS.map(p => p.id), 0) + 1;
      const newProgram = { ...formData, id: newId };
      MOCK_PROGRAMS.push(newProgram);
      toast.success('Program created successfully');
    } else {
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
    
    const start = field === 'startDate' ? value : newTimeline[index].startDate;
    const end = field === 'endDate' ? value : newTimeline[index].endDate;
    
    if (start || end) {
       newTimeline[index].date = `${start || ''} ~ ${end || ''}`;
    }

    setFormData({ ...formData, timeline: newTimeline });
  };

  const removeTimeline = (index) => {
    const newTimeline = [...formData.timeline];
    newTimeline.splice(index, 1);
    setFormData({ ...formData, timeline: newTimeline });
  };

  if (loading) return <div className="p-12 text-center text-slate-500 text-sm">Loading details...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      
      {/* Header - Responsive Flex */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/programs')}
            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-700 transition-all border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif text-slate-900 tracking-tight">{isNew ? 'New Program' : 'Edit Program'}</h1>
            <p className="text-slate-500 text-sm mt-1">{isNew ? 'Create a new university program' : 'Manage program details and settings'}</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <Save size={16} />
          <span>{isNew ? 'Create Program' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Info Card */}
          <AdminCard title="Basic Information">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="col-span-1 md:col-span-2">
                 <label className={labelClassName}>University Name</label>
                 <input 
                   type="text" 
                   value={formData.universityName} 
                   onChange={(e) => setFormData({...formData, universityName: e.target.value})}
                   className={inputClassName}
                   placeholder="Enter official university name..."
                 />
               </div>
               
               <div>
                  <label className={labelClassName}>Visa Type</label>
                  <div className="relative">
                    <select 
                      value={formData.visaType}
                      onChange={(e) => setFormData({...formData, visaType: e.target.value})}
                      className={`${inputClassName} appearance-none cursor-pointer`}
                    >
                      <option value="D-2">D-2 (Degree)</option>
                      <option value="D-4">D-4 (Language)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 4.5L6 8L9.5 4.5"/></svg>
                    </div>
                  </div>
               </div>
               
               <div>
                 <label className={labelClassName}>Country</label>
                 <div className="relative">
                    <input 
                        type="text" 
                        value={formData.country} 
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className={`${inputClassName} pl-10`}
                        placeholder="Target country..."
                    />
                    <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                 </div>
               </div>
               
               <div className="col-span-1 md:col-span-2">
                 <label className={labelClassName}>Description</label>
                 <textarea 
                   rows="4"
                   value={formData.description} 
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   className={`${inputClassName} resize-none`}
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
                className="text-blue-600 hover:text-blue-700 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Plus size={14} /> Add Step
              </button>
            }
          >
             <div className="space-y-3">
               {formData.timeline.map((item, idx) => (
                 <div key={idx} className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100 flex flex-col xl:flex-row gap-3 items-start xl:items-center">
                   
                   <div className="flex-1 w-full xl:w-auto">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block xl:hidden">Step Name</span>
                     <input 
                       type="text" 
                       placeholder="e.g. Document Reception"
                       value={item.step}
                       onChange={(e) => updateTimeline(idx, 'step', e.target.value)}
                       className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 focus:ring-0 outline-none"
                     />
                   </div>
                   
                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full xl:w-auto">
                     <div className="w-full sm:w-auto">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block xl:hidden">Start</span>
                        <DatePicker 
                            value={item.startDate}
                            onChange={(date) => updateTimeline(idx, 'startDate', date)}
                            placeholder="Start Date"
                            className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                        />
                     </div>
                     <span className="hidden sm:inline text-slate-400 text-xs px-1">to</span>
                     <div className="w-full sm:w-auto">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block xl:hidden">End</span>
                        <DatePicker 
                            value={item.endDate}
                            onChange={(date) => updateTimeline(idx, 'endDate', date)}
                            placeholder="End Date"
                            className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                        />
                     </div>
                   </div>

                   <button 
                     onClick={() => removeTimeline(idx)} 
                     className="self-end xl:self-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                     title="Remove Step"
                   >
                     <Trash2 size={16} />
                   </button>
                 </div>
               ))}
               
               {formData.timeline.length === 0 && (
                 <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium text-sm">No timeline steps configured.</p>
                 </div>
               )}
             </div>
          </AdminCard>

          {/* Departments */}
          <AdminCard title="Departments & Majors">
             <div className="flex flex-col sm:flex-row gap-3 mb-4">
               <input 
                 type="text" 
                 value={departmentInput}
                 onChange={(e) => setDepartmentInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && addDepartment()}
                 placeholder="Add department..."
                 className={inputClassName}
               />
               <button 
                 onClick={addDepartment} 
                 className="px-6 py-2.5 bg-slate-900 text-white font-medium text-sm rounded-xl hover:bg-slate-800 transition-all shrink-0"
               >
                 Add
               </button>
             </div>

             <div className="flex flex-wrap gap-2">
                {formData.departments.map((dept, idx) => (
                   <span key={idx} className="pl-3 pr-2 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2">
                      {dept}
                      <button onClick={() => removeDepartment(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <XCircle size={14} className="fill-current"/>
                      </button>
                   </span>
                ))}
                {formData.departments.length === 0 && (
                  <span className="text-slate-400 text-sm italic">No departments listed yet.</span>
                )}
             </div>
          </AdminCard>

        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">

          {/* Media */}
          <AdminCard title="Media">
             <div className="space-y-4">
               <div>
                 <label className={labelClassName}>Logo URL</label>
                 <input 
                   type="text" 
                   value={formData.logo}
                   onChange={(e) => setFormData({...formData, logo: e.target.value})}
                   className={inputClassName}
                   placeholder="https://..."
                 />
                 {formData.logo && (
                   <div className="mt-3 w-20 h-20 bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                     <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                   </div>
                 )}
               </div>
               
               <div className="border-t border-slate-100 pt-4">
                 <div className="flex items-center justify-between mb-2">
                    <label className={labelClassName.replace('mb-1.5', 'mb-0')}>Gallery Images (URLs)</label>
                    <button 
                      onClick={() => setFormData({...formData, images: [...formData.images, '']})}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Image
                    </button>
                 </div>
                 
                 <div className="space-y-2">
                    {formData.images.map((img, idx) => (
                       <div key={idx} className="flex gap-2">
                          <div className="relative flex-1">
                            <input 
                                type="text"
                                value={img}
                                onChange={(e) => {
                                    const newImages = [...formData.images];
                                    newImages[idx] = e.target.value;
                                    setFormData({...formData, images: newImages});
                                }}
                                className={`${inputClassName} pl-8`}
                                placeholder="Image URL..."
                            />
                            <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>
                          <button 
                             onClick={() => {
                                const newImages = formData.images.filter((_, i) => i !== idx);
                                setFormData({...formData, images: newImages});
                             }}
                             className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          >
                             <Trash2 size={16}/>
                          </button>
                       </div>
                    ))}
                    {formData.images.length === 0 && (
                        <div className="text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                             <span className="text-xs text-slate-400">No gallery images</span>
                        </div>
                    )}
                 </div>
               </div>
             </div>
          </AdminCard>
          
          {/* Settings */}
          <AdminCard title="Settings">
             <div className="space-y-4">
               <div>
                 <label className={labelClassName}>Tuition / Fee</label>
                 <div className="relative">
                    <input 
                        type="text"
                        value={formData.tuition}
                        onChange={(e) => setFormData({...formData, tuition: e.target.value})}
                        className={`${inputClassName} pl-10`}
                        placeholder="e.g. $8,000/year" 
                    />
                    <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                 </div>
               </div>

               <div>
                  <label className={labelClassName}>Tags (Comma separated)</label>
                  <input 
                     type="text" 
                     value={formData.tags.join(', ')}
                     onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})}
                     className={inputClassName}
                     placeholder="Comma separated..."
                  />
               </div>

               <div>
                 <label className={labelClassName}>Status</label>
                 <div className="relative">
                   <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className={`${inputClassName} appearance-none cursor-pointer`}
                   >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                   </select>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 4.5L6 8L9.5 4.5"/></svg>
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