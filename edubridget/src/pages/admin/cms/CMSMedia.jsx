
import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../../components/Modal';
import { MOCK_MEDIA } from '../../../data/mockData';
import { useCMSManager } from '@/hooks/useCMSManager'; // Custom hook

export default function CMSMedia() {
  const {
    items: filteredMedia,
    handleSearch,
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
      toast.success('Image uploaded');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Success Stories (Gallery)</h2>
        <button 
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus size={20} /> Add Story
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredMedia.map(item => (
            <div key={item.id} className="group relative border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
               <div className="aspect-video bg-slate-100 relative overflow-hidden">
                 {item.image ? (
                   <img src={item.image} alt={item.studentName} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300">
                     <ImageIcon size={40} />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleEdit(item)} 
                      className="p-2 bg-white text-slate-900 rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id, 'Story')} 
                      className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                 </div>
               </div>
               <div className="p-4">
                 <h3 className="font-bold text-slate-900 mb-1">{item.studentName}</h3>
                 <p className="text-sm text-primary font-medium mb-2">{item.university}</p>
                 <div className="flex items-center text-xs text-slate-500 gap-2 mb-2">
                   <span className="bg-slate-100 px-2 py-1 rounded">{item.country}</span>
                   <span className="bg-slate-100 px-2 py-1 rounded">{item.program}</span>
                 </div>
                 <p className="text-sm text-slate-600 line-clamp-2 italic">"{item.testimony}"</p>
               </div>
            </div>
          ))}
          {filteredMedia.length === 0 && (
             <div className="col-span-full py-12 text-center text-slate-500">
               No stories found.
             </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Success Story' : 'Add New Success Story'}
      >
        <form onSubmit={(e) => handleSubmit(e, 'Story')} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
              <input 
                type="text" 
                required
                value={formData.studentName}
                onChange={e => setFormData({...formData, studentName: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <input 
                type="text" 
                required
                value={formData.country}
                onChange={e => setFormData({...formData, country: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">University</label>
              <input 
                type="text" 
                required
                value={formData.university}
                onChange={e => setFormData({...formData, university: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
              <input 
                type="text" 
                required
                value={formData.program}
                onChange={e => setFormData({...formData, program: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Student Image</label>
             <div className="flex gap-4 items-start">
                <div className="relative w-24 h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                     <input 
                       type="file" 
                       accept="image/*"
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       onChange={handleFileUpload}
                     />
                     <div className="flex flex-col items-center gap-1">
                        <Upload className="h-5 w-5 text-slate-400" />
                        <span className="text-sm text-slate-600">Click to upload image</span>
                     </div>
                   </div>
                   <input 
                     type="text" 
                     placeholder="Or enter image URL..."
                     value={formData.image}
                     onChange={e => setFormData({...formData, image: e.target.value})}
                     className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                   />
                </div>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Testimony</label>
            <textarea 
              rows={3}
              required
              value={formData.testimony}
              onChange={e => setFormData({...formData, testimony: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary resize-none"
              placeholder="Share the student's success story..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              {editingItem ? 'Update Story' : 'Add Story'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
