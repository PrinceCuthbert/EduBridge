import { useState, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Centralises all CRUD state and handlers for admin CMS pages.
 *
 * @param {Array}  initialData     - Seed data (e.g. MOCK_SCHOLARSHIPS)
 * @param {Object} defaultFormData - Empty-form shape for new items
 * @param {Array}  searchKeys      - Fields to filter by (default: ['title'])
 */
export function useCMSManager(initialData, defaultFormData, searchKeys = ['title']) {
  const [items, setItems] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return searchKeys.some(key => item[key]?.toString().toLowerCase().includes(q));
  });

  const handleAdd = useCallback(() => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  }, [defaultFormData]);

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    const formValues = { ...item };
    if (Array.isArray(formValues.tags)) {
      formValues.tags = formValues.tags.join(', ');
    }
    setFormData(formValues);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id) => {
    toast('Delete this item?', {
      action: {
        label: 'Delete',
        onClick: () => {
          setItems(prev => prev.filter(i => i.id !== id));
          toast.success('Item deleted');
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const processedData = { ...formData };
    if (typeof processedData.tags === 'string') {
      processedData.tags = processedData.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...processedData } : i));
      toast.success('Item updated');
    } else {
      setItems(prev => [...prev, { ...processedData, id: Date.now() }]);
      toast.success('Item created');
    }
    setIsModalOpen(false);
  }, [formData, editingItem]);

  return {
    items: filteredItems,
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
    handleSubmit,
  };
}
