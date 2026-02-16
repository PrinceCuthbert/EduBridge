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
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader 
        title="Success Stories" 
        subtitle="Manage student testimonies and gallery media"
        count={filteredMedia.length}
        primaryAction={{
          label: "Add Story",
          icon: Plus,
          onClick: handleAdd
        }}
      />

      <AdminFilterBar 
        searchPlaceholder="Search by student or country..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map(item => (
          // CHANGED: rounded-[2rem] -> rounded-xl, simplified shadows/hovers
          <div key={item.id} className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300">
             
             {/* Image Section */}
             <div className="aspect-video bg-slate-100 relative overflow-hidden">
               {item.image ? (
                 <img src={item.image} alt={item.studentName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                   <ImageIcon size={40} />
                 </div>
               )}
               
               {/* Overlay Actions */}
               <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="p-2 bg-white text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, 'Story')} 
                    className="p-2 bg-white text-slate-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
               </div>
               
               {/* Country Badge */}
               <div className="absolute top-3 right-3">
                  <span className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 shadow-sm border border-slate-100/50">
                    {item.country}
                  </span>
               </div>
             </div>
             
             {/* Content Section */}
             <div className="p-5">
               <div className="mb-3">
                 {/* CHANGED: font-serif -> font-sans, text-xl -> text-lg */}
                 <h3 className="text-lg font-bold text-slate-900 leading-tight">{item.studentName}</h3>
                 <p className="text-xs text-blue-600 font-medium mt-1">{item.university}</p>
               </div>
               
               {/* Testimony Bubble */}
               {/* CHANGED: rounded-2xl -> rounded-lg, simplified styles */}
               <div className="bg-slate-50 rounded-lg p-3 mb-3 border border-slate-100">
                  <p className="text-sm text-slate-600 italic line-clamp-3">"{item.testimony}"</p>
               </div>
               
               <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                 <span className="text-xs font-medium text-slate-500">Program</span>
                 <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{item.program}</span>
               </div>
             </div>
          </div>
        ))}
        {filteredMedia.length === 0 && (
           <div className="col-span-full py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
               <ImageIcon size={32} className="text-slate-300" />
             </div>
             <h3 className="text-base font-semibold text-slate-900">No stories found</h3>
             <p className="text-sm text-slate-500 mt-1">Add a new success story to get started.</p>
           </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Story' : 'New Success Story'}
        size="lg"
      >
        <form onSubmit={(e) => handleSubmit(e, 'Story')} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Student Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.studentName}
                  onChange={e => setFormData({...formData, studentName: e.target.value})}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900"
                  placeholder="Full Name"
                />
              </div>
               <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Country</label>
                <input 
                  type="text" 
                  required
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900"
                  placeholder="e.g. Canada"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">University</label>
                <input 
                  type="text" 
                  required
                  value={formData.university}
                  onChange={e => setFormData({...formData, university: e.target.value})}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900"
                  placeholder="University Name"
                />
              </div>
               <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Program</label>
                <input 
                  type="text" 
                  required
                  value={formData.program}
                  onChange={e => setFormData({...formData, program: e.target.value})}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900"
                  placeholder="e.g. Computer Science"
                />
              </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-sm font-medium text-slate-700">Student Photo</label>
               {/* CHANGED: Standardized upload box */}
               <div className="flex gap-4 items-start p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  {/* Preview Box */}
                  <div className="relative w-24 h-24 bg-white rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 group cursor-pointer">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={24} />
                      </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-medium">
                       Change
                       <input 
                         type="file" 
                         accept="image/*"
                         className="hidden"
                         onChange={handleFileUpload}
                       />
                    </label>
                  </div>
                  
                  {/* URL Input */}
                  <div className="flex-1 space-y-2">
                     <p className="text-sm text-slate-600">Upload a photo or paste a URL.</p>
                     <input 
                       type="text" 
                       placeholder="https://example.com/image.jpg"
                       value={formData.image}
                       onChange={e => setFormData({...formData, image: e.target.value})}
                       className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-blue-500 outline-none"
                     />
                  </div>
               </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Testimony</label>
              <textarea 
                rows={3}
                required
                value={formData.testimony}
                onChange={e => setFormData({...formData, testimony: e.target.value})}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 resize-none"
                placeholder="Share the student's experience..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              {editingItem ? 'Update Story' : 'Publish Story'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}