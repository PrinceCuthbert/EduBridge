import { useState, useCallback, useEffect } from "react";
import { MOCK_BRANCHES } from "../data/adminMockData";

// Simulate network latency
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Simple mock store to keep state across renders and hook uses
let localBranches = [...MOCK_BRANCHES];

export function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await delay(800);
      setBranches(localBranches);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const createBranch = useCallback(async (data) => {
    await delay();
    const newBranch = { 
      id: Math.max(0, ...localBranches.map((b) => b.id)) + 1, 
      ...data 
    };
    localBranches = [...localBranches, newBranch];
    await fetchBranches();
    return newBranch;
  }, [fetchBranches]);

  const updateBranch = useCallback(async (id, data) => {
    await delay();
    localBranches = localBranches.map((b) => b.id === id ? { ...b, ...data } : b);
    await fetchBranches();
  }, [fetchBranches]);

  const deleteBranch = useCallback(async (id) => {
    await delay();
    localBranches = localBranches.filter((b) => b.id !== id);
    await fetchBranches();
  }, [fetchBranches]);

  return {
    branches,
    loading,
    error,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch
  };
}
