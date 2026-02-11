import React from 'react';
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../../components/Modal';
import { MOCK_MEDIA } from '../../../data/mockData';
import { useCMSManager } from '@/hooks/useCMSManager';
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminFilterBar from "../../../components/admin/AdminFilterBar";

export default function CMSMedia() {
  const {
    items: filteredMedia,
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
    MOCK_MEDIA,
    { studentName: '', university: '', country: '', program: '', testimony: '', image: '' },
    ['studentName', 'country']
  );

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: fakeUrl });
      toast.success('Image uploaded successfully');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <AdminPageHeader 
        title="Success Stories" 
        subtitle="Manage student testimonies and gallery media."
        count={filteredMedia.length}
        countLabel="Stories"
        primaryAction={{
          label: "Add New Story",
          icon: Plus,
          onClick: handleAdd
        }}
      />

      <AdminFilterBar 
        searchPlaceholder="Search stories by student or country..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMedia.map(item => (
          <div key={item.id} className="group relative bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:translate-y-[-5px] transition-all duration-500">
             <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
               {item.image ? (
                 <img src={item.image} alt={item.studentName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                   <ImageIcon size={48} />
                 </div>
               )}
               
               {/* Overlay Actions */}
               <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-lg transform hover:scale-110"
                    title="Edit Story"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, 'Story')} 
                    className="p-3 bg-white text-red-600 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg transform hover:scale-110"
                    title="Delete Story"
                  >
                    <Trash2 size={20} />
                  </button>
               </div>
               
               {/* Badge */}
               <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-lg">
                    {item.country}
                  </span>
               </div>
             </div>
             
             <div className="p-6 relative">
                {/* Connector Line */}
                <div className="absolute -top-6 left-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-slate-50 z-10">
                   <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
                
               <div className="pt-2">
                 <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">{item.studentName}</h3>
                 <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4">{item.university}</p>
                 
                 <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                    <p className="text-sm text-slate-600 italic leading-relaxed text-center">"{item.testimony}"</p>
                 </div>
                 
                 <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program</span>
                   <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">{item.program}</span>
                 </div>
               </div>
             </div>
          </div>
        ))}
        {filteredMedia.length === 0 && (
           <div className="col-span-full py-20 text-center">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <ImageIcon size={40} className="text-slate-300" />
             </div>
             <h3 className="text-lg font-serif text-slate-900 mb-2">No Stories Found</h3>
             <p className="text-slate-500 text-sm">Add a new success story to get started.</p>
           </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Success Story' : 'New Success Story'}
        size="lg"
        className="rounded-[2.5rem]"
      >
        <form onSubmit={(e) => handleSubmit(e, 'Story')} className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Student Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.studentName}
                  onChange={e => setFormData({...formData, studentName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-serif text-slate-900"
                  placeholder="Full Name"
                />
              </div>
               <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Country</label>
                <input 
                  type="text" 
                  required
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                  placeholder="e.g. Canada"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">University</label>
                <input 
                  type="text" 
                  required
                  value={formData.university}
                  onChange={e => setFormData({...formData, university: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                  placeholder="University Name"
                />
              </div>
               <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Program</label>
                <input 
                  type="text" 
                  required
                  value={formData.program}
                  onChange={e => setFormData({...formData, program: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>

            <div>
               <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Student Photo</label>
               <div className="flex gap-6 items-start p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="relative w-28 h-28 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 group cursor-pointer">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-bold">
                       Change
                       <input 
                         type="file" 
                         accept="image/*"
                         className="hidden"
                         onChange={handleFileUpload}
                       />
                    </label>
                  </div>
                  <div className="flex-1 space-y-3">
                     <p className="text-sm text-slate-600 font-medium">Upload a high-quality photo of the student.</p>
                     <div className="relative">
                       <input 
                         type="text" 
                         placeholder="Paste image URL here..."
                         value={formData.image}
                         onChange={e => setFormData({...formData, image: e.target.value})}
                         className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
                       />
                     </div>
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Testimony</label>
              <textarea 
                rows={3}
                required
                value={formData.testimony}
                onChange={e => setFormData({...formData, testimony: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all resize-none italic"
                placeholder="The student's experience..."
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
              {editingItem ? 'Update Story' : 'Publish Story'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
