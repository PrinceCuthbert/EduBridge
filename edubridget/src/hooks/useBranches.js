// src/hooks/useBranches.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

const fetchBranches = async () => {
  const snapshot = await getDocs(collection(db, "branches"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export function useBranches() {
  const queryClient = useQueryClient();

  const { data: branches = [], isLoading, isError, error } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["branches"] });

  const createBranchMutation = useMutation({
    mutationFn: (newBranch) => addDoc(collection(db, "branches"), newBranch),
    onSuccess: () => invalidate(),
  });

  const updateBranchMutation = useMutation({
    mutationFn: ({ id, data }) => updateDoc(doc(db, "branches", id), data),
    onSuccess: () => invalidate(),
  });

  const deleteBranchMutation = useMutation({
    mutationFn: (id) => deleteDoc(doc(db, "branches", id)),
    onSuccess: () => invalidate(),
  });

  const createBranch = (data) => {
    const savePromise = createBranchMutation.mutateAsync(data);
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: 'Branch created successfully!',
      error: 'Failed to create branch.',
      position: 'top-center',
    });
    return savePromise;
  };
  
  const updateBranch = (id, data) => {
    const savePromise = updateBranchMutation.mutateAsync({ id, data });
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: 'Branch updated successfully!',
      error: 'Failed to update branch.',
      position: 'top-center',
    });
    return savePromise;
  };
  
  const deleteBranch = (id) => {
    const deletePromise = deleteBranchMutation.mutateAsync(id);
    toast.promise(deletePromise, {
      loading: 'Deleting branch...',
      success: 'Branch deleted successfully!',
      error: 'Failed to delete branch.',
      position: 'top-center',
    });
    return deletePromise;
  };


  return {
    branches,
    isLoading,
    isError,
    error,
    submitting: createBranchMutation.isPending || updateBranchMutation.isPending,
    createBranch,
    updateBranch,
    deleteBranch,
  };
}
