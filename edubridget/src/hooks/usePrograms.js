import { useState, useEffect, useCallback } from 'react';
import { MOCK_PROGRAMS } from '../data/mockData';
import { toast } from 'sonner';

/**
 * Hook to manage the list of programs (fetch, delete, etc.)
 */
export function usePrograms(fetchOnMount = true) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState(null);

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // Return a copy to avoid mutation by reference issues during render
      setPrograms([...MOCK_PROGRAMS]);
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError(err);
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchOnMount) fetchPrograms();
  }, [fetchOnMount, fetchPrograms]);

  const deleteProgram = useCallback(async (id) => {
    if (!id) return;
    try {
      // Find and remove from mock data source (persistence simulation)
      const index = MOCK_PROGRAMS.findIndex(p => p.id === id);
      if (index > -1) {
        MOCK_PROGRAMS.splice(index, 1);
        
        // Update local state
        setPrograms(prev => prev.filter(p => p.id !== id));
        toast.success("Program deleted successfully");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete program");
      return false;
    }
  }, []);

  const updateProgram = useCallback(async (id, data) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = MOCK_PROGRAMS.findIndex(p => p.id === id);
      if (index > -1) {
        MOCK_PROGRAMS[index] = { ...MOCK_PROGRAMS[index], ...data };
        setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
        toast.success("Program updated successfully");
        return true;
      }
      throw new Error("Program not found");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update program");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProgram = useCallback(async (data) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newId = Math.max(...MOCK_PROGRAMS.map(p => p.id), 0) + 1;
      const newProgram = { id: newId, ...data, status: 'Active', createdAt: new Date().toISOString() };
      
      MOCK_PROGRAMS.push(newProgram);
      setPrograms(prev => [...prev, newProgram]);
      toast.success("Program added successfully");
      return newProgram;
    } catch (err) {
      console.error("Add error:", err);
      toast.error("Failed to add program");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    programs, 
    loading, 
    error, 
    refresh: fetchPrograms, 
    deleteProgram,
    updateProgram,
    addProgram
  };
}

/**
 * Hook to manage a single program details
 * @param {string|number} id - The ID of the program
 */
export function useProgram(id) {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProgram = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const found = MOCK_PROGRAMS.find(p => p.id === parseInt(id));
        
        if (found) {
          setProgram(found);
          setError(null);
        } else {
          setProgram(null);
          setError(new Error("Program not found"));
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching program:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  return { program, loading, error };
}
