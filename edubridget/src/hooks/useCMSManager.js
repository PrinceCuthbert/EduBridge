import { useState, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * A reusable hook to manage CRUD operations for any CMS data type.
 * 
 * @param {Array} initialData - The starting data (e.g., MOCK_SCHOLARSHIPS)
 * @param {Object} defaultFormData - The structure of empty form data for new items
 * @param {Array} searchKeys - The object keys to filter by (e.g., ['title', 'location'])
 * @returns {Object} - Complete state and handlers for the CMS page
 */
export function useCMSManager(initialData, defaultFormData, searchKeys = ['title']) {
  // State for the list of items
  const [items, setItems] = useState(initialData);
  
  // State for search/filter
  const [searchQuery, setSearchQuery] = useState('');

  // State for Modal and Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  // Memoized Filter Logic
  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    // Check if ANY of the searchKeys match the query
    return searchKeys.some(key => {
      const value = item[key];
      return value && value.toString().toLowerCase().includes(query);
    });
  });

  // Handler: Open Modal for Adding New Item
  const handleAdd = useCallback(() => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  }, [defaultFormData]);

  // Handler: Open Modal for Editing Existing Item
  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    // Flatten arrays if necessary (e.g., tags) for form inputs
    const formValues = { ...item };
    if (Array.isArray(formValues.tags)) {
      formValues.tags = formValues.tags.join(', ');
    }
    setFormData(formValues);
    setIsModalOpen(true);
  }, []);

  // Handler: Delete Item
  const handleDelete = useCallback((id, itemName = 'Item') => {
    if (window.confirm(`Are you sure you want to delete this ${itemName}?`)) {
      setItems(prev => prev.filter(i => i.id !== id));
      
      // Sync Mock Data (Simulated Persistence)
      const index = initialData.findIndex(i => i.id === id);
      if (index !== -1) initialData.splice(index, 1);
      
      toast.success(`${itemName} deleted successfully`);
    }
  }, [initialData]);

  // Handler: Submit Form (Add or Update)
  const handleSubmit = useCallback((e, itemName = 'Item') => {
    e.preventDefault();

    // Process form data specific to certain types (e.g. tags)
    const processedData = { ...formData };
    if (typeof processedData.tags === 'string') {
        processedData.tags = processedData.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    
    if (editingItem) {
      // Update Logic
      const updatedList = items.map(i => 
        i.id === editingItem.id ? { ...i, ...processedData } : i
      );
      setItems(updatedList);
      
      // Update Mock Data
      const index = initialData.findIndex(i => i.id === editingItem.id);
      if (index !== -1) {
        initialData[index] = { ...initialData[index], ...processedData };
      }
      toast.success(`${itemName} updated successfully`);
    } else {
      // Create Logic
      const newItem = {
        id: Math.max(...items.map(i => i.id), 0) + 1,
        ...processedData,
        // Default fallbacks
        status: processedData.status || 'Active',
        createdAt: new Date().toISOString()
      };
      
      setItems(prev => [...prev, newItem]);
      initialData.push(newItem);
      toast.success(`${itemName} created successfully`);
    }
    
    setIsModalOpen(false);
  }, [formData, editingItem, items, initialData]);

  // Return everything needed by the component
  return {
    items: filteredItems,       // The filtered list to display
    searchQuery, setSearchQuery,// Search state
    isModalOpen, setIsModalOpen,// Modal visibility
    formData, setFormData,      // Form state
    editingItem,                // Currently editing item (or null)
    handleAdd,                  // Function to start adding
    handleEdit,                 // Function to start editing
    handleDelete,               // Function to delete
    handleSubmit                // Function to submit form
  };
}
