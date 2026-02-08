
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../../components/Modal';
import { MOCK_BLOGS } from '../../../data/mockData';

export default function CMSPosts() {
  const [posts, setPosts] = useState(MOCK_BLOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    author: '',
    excerpt: '',
    image: '',
    content: ''
  });

  const filteredPosts = posts.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: 'Admin',
      excerpt: '',
      image: '',
      content: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      date: item.date,
      author: item.author,
      excerpt: item.excerpt,
      image: item.image,
      content: item.content || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const updated = posts.filter(p => p.id !== id);
      setPosts(updated);
      const index = MOCK_BLOGS.findIndex(p => p.id === id);
      if (index !== -1) MOCK_BLOGS.splice(index, 1);
      toast.success('Post deleted');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      const updated = posts.map(p => 
        p.id === editingItem.id ? { ...p, ...formData } : p
      );
      setPosts(updated);
      const index = MOCK_BLOGS.findIndex(p => p.id === editingItem.id);
      if (index !== -1) {
        MOCK_BLOGS[index] = { ...MOCK_BLOGS[index], ...formData };
      }
      toast.success('Post updated');
    } else {
      const newItem = {
        id: Math.max(...posts.map(p => p.id), 0) + 1,
        ...formData
      };
      setPosts([...posts, newItem]);
      MOCK_BLOGS.push(newItem);
      toast.success('Post added');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Blog Posts</h2>
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
                <th className="px-6 py-4 font-semibold text-slate-700">Post</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Author</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <img src={item.image} alt="" className="w-10 h-10 rounded object-cover bg-slate-100" />
                       <div>
                         <div className="font-medium text-slate-900 line-clamp-1">{item.title}</div>
                         <div className="text-sm text-slate-500 line-clamp-1">{item.excerpt}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.author}</td>
                  <td className="px-6 py-4 text-slate-600">{item.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50">
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
        title={editingItem ? 'Edit Post' : 'New Blog Post'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
               <input 
                 type="text" 
                 required
                 value={formData.category}
                 onChange={e => setFormData({...formData, category: e.target.value})}
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
               <input 
                 type="text" 
                 value={formData.author}
                 onChange={e => setFormData({...formData, author: e.target.value})}
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
               />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
               <input 
                 type="text" 
                 placeholder="Jan 15, 2024"
                 value={formData.date}
                 onChange={e => setFormData({...formData, date: e.target.value})}
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
               />
            </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
               <input 
                 type="text" 
                 value={formData.image}
                 onChange={e => setFormData({...formData, image: e.target.value})}
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Content (HTML allowed)</label>
            <textarea 
              rows={5}
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
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
              {editingItem ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
