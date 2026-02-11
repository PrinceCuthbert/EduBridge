import React from 'react';
import { Plus, Edit, Trash2, Upload, Link } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../../components/Modal';
import { MOCK_LIBRARY_RESOURCES } from '../../../data/mockData';
import { useCMSManager } from '@/hooks/useCMSManager';
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminTable from "../../../components/admin/AdminTable";
import AdminFilterBar from "../../../components/admin/AdminFilterBar";

export default function CMSLibrary() {
  const {
    items: filteredResources,
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
    MOCK_LIBRARY_RESOURCES,
    { title: '', type: 'E-book', author: '', year: new Date().getFullYear().toString(), pages: '', category: '', link: '', fileUrl: '' },
    ['title', 'category']
  );

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
       // Mock upload
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, fileUrl: fakeUrl });
      toast.success('File uploaded successfully');
    }
  };

  const columns = [
    {
      header: "Resource Details",
      render: (item) => (
        <div>
          <div className="font-serif text-[15px] font-bold text-slate-900 mb-0.5">{item.title}</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.category}</div>
        </div>
      )
    },
    {
      header: "Type",
      render: (item) => (
        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-slate-200">
          {item.type}
        </span>
      )
    },
    {
      header: "Author",
      render: (item) => (
        <span className="text-slate-700 font-bold text-sm">
          {item.author}
        </span>
      )
    },
    {
      header: "Year",
      render: (item) => (
        <span className="text-slate-500 font-medium font-mono text-xs">
          {item.year}
        </span>
      )
    },
    {
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => handleEdit(item)} 
            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => handleDelete(item.id, 'Resource')} 
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <AdminPageHeader 
        title="Digital Library" 
        subtitle="Manage educational resources, e-books, and journals."
        count={filteredResources.length}
        countLabel="Resources"
        primaryAction={{
          label: "Add Resource",
          icon: Plus,
          onClick: handleAdd
        }}
      />

      <AdminFilterBar 
        searchPlaceholder="Search resources by title or category..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AdminTable 
        columns={columns}
        data={filteredResources}
        isLoading={false}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Resource' : 'Add New Resource'}
        size="lg"
        className="rounded-[2.5rem]"
      >
        <form onSubmit={(e) => handleSubmit(e, 'Resource')} className="space-y-6 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-serif text-slate-900"
                placeholder="Resource Title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Type</label>
                 <div className="relative">
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none"
                  >
                    <option value="E-book">E-book</option>
                    <option value="Journal">Journal</option>
                    <option value="Research Paper">Research Paper</option>
                    <option value="Thesis">Thesis</option>
                    <option value="Exam Paper">Exam Paper</option>
                  </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                 </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Category</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Mathematics"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

             {/* Conditional Input based on Type */}
             {formData.type === 'E-book' ? (
               <div>
                 <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1 flex items-center gap-2">
                   <Link size={14} /> Link to Book (URL)
                 </label>
                 <input 
                   type="url"
                   placeholder="https://example.com/book.pdf"
                   value={formData.link}
                   onChange={e => setFormData({...formData, link: e.target.value})}
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all text-blue-600 underline"
                 />
               </div>
            ) : (
               <div>
                 <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1 flex items-center gap-2">
                   <Upload size={14} /> Upload File
                 </label>
                 <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative cursor-pointer group">
                   <input 
                     type="file" 
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                     onChange={handleFileUpload}
                   />
                   <div className="space-y-2 pointer-events-none">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-slate-600 font-bold">Click or drag file to upload</p>
                      {formData.fileUrl && (
                        <p className="text-xs text-emerald-600 mt-2 font-bold bg-emerald-50 py-1 px-2 rounded-lg inline-block">File selected</p>
                      )}
                   </div>
                 </div>
               </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Author</label>
                <input 
                  type="text" 
                  required
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Year</label>
                <input 
                  type="number" 
                  required
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
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
              {editingItem ? 'Update Resource' : 'Add Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
