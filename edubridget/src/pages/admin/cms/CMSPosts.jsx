
import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit, FileText } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../../components/Modal';
import { MOCK_BLOGS } from '../../../data/mockData';
import { useCMSManager } from '@/hooks/useCMSManager'; // Custom hook

export default function CMSPosts() {
  const {
    items: filteredPosts,
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
    MOCK_BLOGS,
    { title: '', date: new Date().toISOString().split('T')[0], category: 'News', excerpt: '', content: '' },
    ['title', 'category']
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Blog Posts & News</h2>
        <button 
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus size={20} /> New Post
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Title</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <div className="text-sm text-slate-500 line-clamp-1">{item.excerpt}</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id, 'Post')} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPosts.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No posts found.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Post' : 'New Post'}
        size="lg"
      >
        <form onSubmit={(e) => handleSubmit(e, 'Post')} className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="News">News</option>
                <option value="Events">Events</option>
                <option value="Guides">Guides</option>
                <option value="Stories">Stories</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
            <textarea 
              rows={2}
              required
              value={formData.excerpt}
              onChange={e => setFormData({...formData, excerpt: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea 
              rows={8}
              required
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary resize-none font-mono text-sm"
              placeholder="# Markdown content supported..."
            />
            <p className="text-xs text-slate-500 mt-1">Supports basic markdown formatting</p>
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
              {editingItem ? 'Publish Post' : 'Save Draft'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
