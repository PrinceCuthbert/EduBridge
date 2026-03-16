// ─────────────────────────────────────────────────────────────
//  src/hooks/useVisaConsultations.js
//
//  WHO USES THIS: student pages only.
//  (VisaSummary.jsx, VisaRequestForm.jsx)
//
//  WHY TWO HOOKS (this one + useAdminVisaCases)?
//  Same reason applicationService strips status on student update:
//  separation stops a student from ever calling admin operations
//  even by mistake. When the backend is live, these two hooks
//  will hit different API endpoints with different JWT roles.
//
//  MIRRORS: useApplications.js — same shape, same naming pattern.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import {
  getVisaRequestsByUserId,
  createVisaRequest,
  updateVisaRequest,
  deleteVisaRequest,
} from "../services/visaService";

/**
 * @param {string} userId - from AuthContext (e.g. "student_01")
 *
 * Returns:
 *   consultations  - array of this student's requests
 *   loading        - true while fetching
 *   error          - error message string or null
 *   fetchConsultations  - manual refetch
 *   submitRequest       - create a new request
 *   editRequest         - update an existing request
 *   cancelRequest       - delete a request
 */
export const useVisaConsultations = (userId) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch ─────────────────────────────────────────────────
  const fetchConsultations = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getVisaRequestsByUserId(userId);
      setConsultations(data);
    } catch (err) {
      setError("Failed to load your consultations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // ── Submit new request ────────────────────────────────────
  const submitRequest = async (formData) => {
    try {
      const created = await createVisaRequest(formData, userId);
      // Optimistic update: add to local state immediately
      setConsultations((prev) => [...prev, created]);
      return created;
    } catch (err) {
      throw new Error("Failed to submit request. Please try again.");
    }
  };

  // ── Edit existing request ─────────────────────────────────
  const editRequest = async (id, formData) => {
    try {
      const updated = await updateVisaRequest(id, formData);
      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
      return updated;
    } catch (err) {
      throw new Error("Failed to update request. Please try again.");
    }
  };

  // ── Cancel / delete request ───────────────────────────────
  const cancelRequest = async (id) => {
    try {
      await deleteVisaRequest(id);
      setConsultations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      throw new Error("Failed to cancel request. Please try again.");
    }
  };

  return {
    consultations,
    loading,
    error,
    fetchConsultations,
    submitRequest,
    editRequest,
    cancelRequest,
  };
};
