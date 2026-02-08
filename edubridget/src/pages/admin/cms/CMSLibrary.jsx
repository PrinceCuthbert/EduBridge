
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, BookOpen, FileText, Upload, Link } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '../../../components/Modal';
import { MOCK_LIBRARY_RESOURCES } from '../../../data/mockData';

export default function CMSLibrary() {
  const [resources, setResources] = useState(MOCK_LIBRARY_RESOURCES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'E-book',
    author: '',
    year: '',
    pages: '',
    category: '',
    link: '',
    fileUrl: ''
  });

  const filteredResources = resources.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      type: 'E-book',
      author: '',
      year: new Date().getFullYear().toString(),
      pages: '',
      category: '',
      link: '',
      fileUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      author: item.author,
      year: item.year,
      pages: item.pages,
      category: item.category,
      link: item.link || '',
      fileUrl: item.fileUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      const updated = resources.filter(r => r.id !== id);
      setResources(updated);
      const index = MOCK_LIBRARY_RESOURCES.findIndex(r => r.id === id);
      if (index !== -1) MOCK_LIBRARY_RESOURCES.splice(index, 1);
      toast.success('Resource deleted');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate upload
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, fileUrl: fakeUrl });
      toast.success('File uploaded successfully');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      const updated = resources.map(r => 
        r.id === editingItem.id ? { ...r, ...formData } : r
      );
      setResources(updated);
      const index = MOCK_LIBRARY_RESOURCES.findIndex(r => r.id === editingItem.id);
      if (index !== -1) {
        MOCK_LIBRARY_RESOURCES[index] = { ...MOCK_LIBRARY_RESOURCES[index], ...formData };
      }
      toast.success('Resource updated');
    } else {
      const newItem = {
        id: Math.max(...resources.map(r => r.id), 0) + 1,
        ...formData
      };
      setResources([...resources, newItem]);
      MOCK_LIBRARY_RESOURCES.push(newItem);
      toast.success('Resource added');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Digital Library</h2>
        <button 
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus size={20} /> Add Resource
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search resources..."
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
                <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Author</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Year</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResources.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <div className="text-sm text-slate-500">{item.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.author}</td>
                  <td className="px-6 py-4 text-slate-600">{item.year}</td>
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
          {filteredResources.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No resources found.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Resource' : 'Add New Resource'}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="E-book">E-book</option>
                <option value="Journal">Journal</option>
                <option value="Research Paper">Research Paper</option>
                <option value="Thesis">Thesis</option>
                <option value="Exam Paper">Exam Paper</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Mathematics"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          
          {/* Conditional Input based on Type */}
          {formData.type === 'E-book' ? (
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                 <Link size={16} /> Link to Book (URL)
               </label>
               <input 
                 type="url"
                 placeholder="https://example.com/book.pdf"
                 value={formData.link}
                 onChange={e => setFormData({...formData, link: e.target.value})}
                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
               />
             </div>
          ) : (
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                 <Upload size={16} /> Upload File
               </label>
               <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                 <input 
                   type="file" 
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   onChange={handleFileUpload}
                 />
                 <div className="space-y-1 pointe-events-none">
                    <Upload className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="text-sm text-slate-600 font-medium">Click or drag file to upload</p>
                    {formData.fileUrl && (
                      <p className="text-xs text-emerald-600 mt-2 font-semibold">File uploaded successfully!</p>
                    )}
                 </div>
               </div>
             </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
              <input 
                type="text" 
                required
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
              <input 
                type="number" 
                required
                value={formData.year}
                onChange={e => setFormData({...formData, year: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pages</label>
              <input 
                type="number" 
                value={formData.pages}
                onChange={e => setFormData({...formData, pages: e.target.value})}
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
              {editingItem ? 'Update Resource' : 'Add Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
