import { Plus, Edit, Trash2, FileText, Calendar, Image as ImageIcon, Loader2 } from 'lucide-react';
import Modal from '../../../components/Modal';
import { blogService } from '../../../services/cmsService';
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminTable from "../../../components/admin/AdminTable";
import AdminFilterBar from "../../../components/admin/AdminFilterBar";
import { useCMSManager } from '../../../hooks/useCMSManager';

const EMPTY = { title: '', date: new Date().toISOString().split('T')[0], category: 'News', excerpt: '', content: '', image: '' };

export default function CMSPosts() {
  const {
    items: posts,
    isLoading,
    isPending,
    searchQuery, setSearchQuery,
    isModalOpen, setIsModalOpen,
    formData, setFormData,
    editingItem,
    handleAdd, handleEdit, handleDelete, handleSubmit,
  } = useCMSManager(blogService, 'blogs', EMPTY, ['title', 'category']);

  const fd = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    fd("image", file);
  };

  const columns = [
    {
      header: "Post Details",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 flex-shrink-0">
            <FileText size={20} className="text-slate-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900 mb-0.5 line-clamp-1">{item.title}</div>
            <div className="text-xs text-slate-500 line-clamp-1 max-w-[300px]">{item.excerpt}</div>
          </div>
        </div>
      )
    },
    {
      header: "Category",
      render: (item) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">{item.category}</span>
      )
    },
    {
      header: "Date",
      render: (item) => (
        <span className="text-slate-500 font-medium text-sm flex items-center gap-2">
          <Calendar size={14} className="text-slate-400" />{item.date}
        </span>
      )
    },
    {
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
          <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AdminPageHeader
        title="Blog & News"
        subtitle="Manage articles and announcements"
        count={posts.length}
        primaryAction={{ label: "Create Post", icon: Plus, onClick: handleAdd }}
      />
      <AdminFilterBar searchPlaceholder="Search posts by title or category..." searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <AdminTable columns={columns} data={posts} isLoading={isLoading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Post' : 'Create New Post'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Title</label>
              <input type="text" required value={formData.title} onChange={e => fd('title', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                placeholder="Article Headline" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <div className="relative">
                  <select value={formData.category} onChange={e => fd('category', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-slate-900">
                    {['News','Events','Guides','Stories','Visa Guide','Scholarships','Student Life','Exam Prep','Study Destinations','Travel Guide','Application Tips','Education'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Date</label>
                <input type="date" required value={formData.date} onChange={e => fd('date', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Cover Image</label>
              <div className="flex gap-4 items-start p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="relative w-24 h-24 bg-white rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 group cursor-pointer">
                  {formData.image ? (
                    <img
                      src={formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
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
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-slate-600">
                    Upload a photo or paste a URL.
                  </p>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image instanceof File ? formData.image.name : (formData.image || '')}
                    onChange={(e) => fd("image", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Author</label>
              <input type="text" value={formData.author || ''} onChange={e => fd('author', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900"
                placeholder="Author name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Excerpt</label>
              <textarea rows={2} required value={formData.excerpt} onChange={e => fd('excerpt', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-slate-900"
                placeholder="Brief summary for listing..." />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Content</label>
                <span className="text-xs text-slate-400 font-medium">Markdown Supported</span>
              </div>
              <textarea rows={8} value={formData.content || ''} onChange={e => fd('content', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none font-mono text-slate-800 leading-relaxed"
                placeholder="# Write your article here..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            <button 
              type="submit" 
              disabled={isPending} 
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px]">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : editingItem ? (
                'Update Post'
              ) : (
                'Publish Post'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
