import React from 'react';
import { Plus, Edit, Trash2, FileText, Calendar } from 'lucide-react';
import Modal from '../../../components/Modal';
import { MOCK_BLOGS } from '../../../data/mockData';
import { useCMSManager } from '@/hooks/useCMSManager';
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminTable from "../../../components/admin/AdminTable";
import AdminFilterBar from "../../../components/admin/AdminFilterBar";

export default function CMSPosts() {
  const {
    items: filteredPosts,
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
    MOCK_BLOGS,
    { title: '', date: new Date().toISOString().split('T')[0], category: 'News', excerpt: '', content: '' },
    ['title', 'category']
  );

  const columns = [
    {
      header: "Post Details",
      render: (item) => (
        <div>
          <div className="font-serif text-[15px] font-bold text-slate-900 mb-0.5">{item.title}</div>
          <div className="text-xs text-slate-500 font-medium line-clamp-1 max-w-[250px]">{item.excerpt}</div>
        </div>
      )
    },
    {
      header: "Category",
      render: (item) => (
        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-slate-200">
          {item.category}
        </span>
      )
    },
    {
      header: "Published Date",
      render: (item) => (
        <span className="text-slate-500 font-medium text-xs flex items-center gap-2">
           <Calendar size={14} className="text-slate-400" />
           {item.date}
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
            onClick={() => handleDelete(item.id, 'Post')} 
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
        title="Blog & News" 
        subtitle="Manage articles, updates, and announcements."
        count={filteredPosts.length}
        countLabel="Published Posts"
        primaryAction={{
          label: "Create New Post",
          icon: Plus,
          onClick: handleAdd
        }}
      />

      <AdminFilterBar 
        searchPlaceholder="Search posts by title or category..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AdminTable 
        columns={columns}
        data={filteredPosts}
        isLoading={false}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Post' : 'Create New Post'}
        size="lg"
        className="rounded-[2.5rem]"
      >
        <form onSubmit={(e) => handleSubmit(e, 'Post')} className="space-y-6 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-serif text-slate-900"
                placeholder="Article Headline"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Category</label>
                <div className="relative">
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none"
                  >
                    <option value="News">News</option>
                    <option value="Events">Events</option>
                    <option value="Guides">Guides</option>
                    <option value="Stories">Stories</option>
                  </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
               <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Excerpt</label>
              <textarea 
                rows={2}
                required
                value={formData.excerpt}
                onChange={e => setFormData({...formData, excerpt: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                placeholder="Brief summary for listing..."
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5 px-1">Content (Markdown)</label>
              <textarea 
                rows={8}
                required
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all resize-none font-mono text-sm leading-relaxed"
                placeholder="# Write your article here..."
              />
               <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider text-right">Markdown Supported</p>
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
              {editingItem ? 'Publish Post' : 'Save Draft'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
