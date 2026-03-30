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
    onSuccess: () => { invalidate(); toast.success("Branch created"); },
    onError: () => toast.error("Failed to create branch"),
  });

  const updateBranchMutation = useMutation({
    mutationFn: ({ id, data }) => updateDoc(doc(db, "branches", id), data),
    onSuccess: () => { invalidate(); toast.success("Branch updated"); },
    onError: () => toast.error("Failed to update branch"),
  });

  const deleteBranchMutation = useMutation({
    mutationFn: (id) => deleteDoc(doc(db, "branches", id)),
    onSuccess: () => { invalidate(); toast.success("Branch deleted"); },
    onError: () => toast.error("Failed to delete branch"),
  });

  const createBranch = (data) => createBranchMutation.mutate(data);
  const updateBranch = (id, data) => updateBranchMutation.mutate({ id, data });
  const deleteBranch = (id) => deleteBranchMutation.mutate(id);

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
