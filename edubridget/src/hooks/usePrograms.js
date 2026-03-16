// src/hooks/usePrograms.js
//
// Controller layer for programs — delegates all storage to programService.js.
// Mirrors useApplications.js / useVisaConsultations.js.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import * as programService from "../services/programService";

// ── List hook (admin list page + apply form) ──────────────────────────────────

export function usePrograms(fetchOnMount = true) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await programService.getPrograms();
      setPrograms(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchOnMount) fetchPrograms();
  }, [fetchOnMount, fetchPrograms]);

  const addProgram = useCallback(
    async (data) => {
      try {
        setLoading(true);
        const created = await programService.createProgram(data);
        await fetchPrograms(); // re-sync list
        toast.success("Program added successfully");
        return created;
      } catch (err) {
        toast.error("Failed to add program");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchPrograms]
  );

  const updateProgram = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        await programService.updateProgram(id, data);
        await fetchPrograms();
        toast.success("Program updated successfully");
        return true;
      } catch (err) {
        toast.error("Failed to update program");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchPrograms]
  );

  const deleteProgram = useCallback(
    async (id) => {
      try {
        await programService.deleteProgram(id);
        setPrograms((prev) => prev.filter((p) => p.id !== id));
        toast.success("Program deleted successfully");
        return true;
      } catch (err) {
        toast.error("Failed to delete program");
        return false;
      }
    },
    []
  );

  return {
    programs,
    loading,
    error,
    refresh: fetchPrograms,
    addProgram,
    updateProgram,
    deleteProgram,
  };
}

// ── Single-program hook (detail / view pages) ─────────────────────────────────

export function useProgram(id) {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const found = await programService.getProgramById(id);
        if (cancelled) return;
        if (found) {
          setProgram(found);
        } else {
          setError(new Error("Program not found"));
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { program, loading, error };
}
