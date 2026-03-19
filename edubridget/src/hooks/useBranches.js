// src/hooks/useBranches.js
// CMS content — state initialised from static data until a headless CMS is integrated.
import { useState } from "react";
import { toast } from "sonner";
import { MOCK_BRANCHES as STATIC_BRANCHES } from "../data/branches";

export function useBranches() {
  const [branches, setBranches] = useState(STATIC_BRANCHES);

  const createBranch = (data) => {
    const branch = { ...data, id: Date.now() };
    setBranches((p) => [...p, branch]);
    toast.success("Branch registered");
    return branch;
  };

  const updateBranch = (id, data) => {
    setBranches((p) => p.map((b) => (b.id === id ? { ...b, ...data } : b)));
    toast.success("Branch updated");
  };

  const deleteBranch = (id) => {
    setBranches((p) => p.filter((b) => b.id !== id));
    toast.success("Branch deleted");
  };

  return {
    branches,
    loading: false,
    error: null,
    createBranch,
    updateBranch,
    deleteBranch,
  };
}
