// src/hooks/useBranches.js
// CMS content — state initialised from static data until a headless CMS is integrated.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MOCK_BRANCHES as STATIC_BRANCHES } from "../data/branches";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const fetchBranches = async () => {
  const snapshot = await getDocs(collection(db, "branches"));
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return data;
};

export function useBranches() {
  const queryClient = useQueryClient();

  const { data: branches = [], isLoading, isError, error, status } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
    onError: (err) => {
      console.error("[useBranches] onError", err);
    },
  });

  const createBranchMutation = useMutation({
    mutationFn: (newBranch) => addDoc(collection(db, "branches"), newBranch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success("Branch created");
    },
    onError: (err) => {
      toast.error("Failed to create branch");
      console.error(err);
    },
  });

  const createBranch = (data) => createBranchMutation.mutate(data);

  return {
    branches,
    isLoading,
    isError,
    error,
    createBranch,
  };
}
