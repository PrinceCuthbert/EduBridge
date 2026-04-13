import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Centralises all CRUD state and handlers for admin CMS pages.
 * Data is fetched from / written to Firestore via the provided service.
 *
 * @param {Object} service          - A cmsService instance (getAll/create/update/delete)
 * @param {string} collectionKey    - Unique React Query cache key (e.g. 'scholarships')
 * @param {Object} defaultFormData  - Empty-form shape for new items
 * @param {Array}  searchKeys       - Fields to filter by (default: ['title'])
 */
export function useCMSManager(service, collectionKey, defaultFormData, searchKeys = ['title']) {
  const queryClient = useQueryClient();

  // ── Remote data ─────────────────────────────────────────────────────────────
  const { data: items = [], isLoading } = useQuery({
    queryKey: [collectionKey],
    queryFn: service.getAll,
  });

  // ── Local UI state ───────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);

  // ── Mutations ────────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionKey] });
      toast.success('Created successfully');
      setIsModalOpen(false);
    },
    onError: (err) => {
      console.error('[useCMSManager] create failed:', err);
      toast.error('Failed to create item');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionKey] });
      toast.success('Updated successfully');
      setIsModalOpen(false);
    },
    onError: (err) => {
      console.error('[useCMSManager] update failed:', err);
      toast.error('Failed to update item');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: service.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [collectionKey] });
      toast.success('Deleted successfully');
    },
    onError: (err) => {
      console.error('[useCMSManager] delete failed:', err);
      toast.error('Failed to delete item');
    },
  });

  // ── Derived state ────────────────────────────────────────────────────────────
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return searchKeys.some((key) => item[key]?.toString().toLowerCase().includes(q));
  });

  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // ── Handlers ─────────────────────────────────────────────────────────────────
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

  const handleDelete = useCallback(
    (id) => {
      toast('Delete this item?', {
        action: {
          label: 'Delete',
          onClick: () => deleteMutation.mutate(id),
        },
        cancel: { label: 'Cancel', onClick: () => {} },
      });
    },
    [deleteMutation]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const processedData = { ...formData };
      if (typeof processedData.tags === 'string') {
        processedData.tags = processedData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }

      // if (editingItem) {
      //   await updateMutation.mutateAsync({ id: editingItem.id, data: processedData });
      // } else {
      //   await createMutation.mutateAsync(processedData);
      // }
      // Define the operation
    const savePromise = editingItem 
      ? updateMutation.mutateAsync({ id: editingItem.id, data: processedData })
      : createMutation.mutateAsync(processedData);

    // Trigger the loading toast with a spinner
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: 'Changes saved successfully!',
      error: 'Failed to save changes.',
      position: 'top-center', // Centers it at the top
    });
      return savePromise;
    },
    [formData, editingItem, updateMutation, createMutation]
  );

  return {
    items: filteredItems,
    isLoading,
    isPending,
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
