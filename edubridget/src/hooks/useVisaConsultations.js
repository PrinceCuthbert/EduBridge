// ─────────────────────────────────────────────────────────────
//  src/hooks/useVisaConsultations.js
//
//  WHO USES THIS: student pages only.
//  (VisaSummary.jsx, VisaRequestForm.jsx)
//
//  Migrated from useState/useEffect to React Query.
//  Same public API as before — call sites unchanged.
//
//  Query key: ["visaCases", "user", userId]
// ─────────────────────────────────────────────────────────────

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVisaRequestsByUserId,
  createVisaRequest,
  updateVisaRequest,
  deleteVisaRequest,
} from "../services/visaService";

/**
 * @param {string} userId - Firebase Auth UID from AuthContext
 */
export const useVisaConsultations = (userId) => {
  const queryClient = useQueryClient();
  const queryKey = ["visaCases", "user", userId];

  // ── Fetch student's own cases ─────────────────────────────
  const {
    data: consultations = [],
    isLoading: loading,
    error: queryError,
    refetch: fetchConsultations,
  } = useQuery({
    queryKey,
    queryFn: () => getVisaRequestsByUserId(userId),
    enabled: !!userId,
  });

  const error = queryError ? "Failed to load your consultations. Please try again." : null;

  // ── Submit new request ────────────────────────────────────
  const submitMutation = useMutation({
    mutationFn: (formData) => createVisaRequest(formData, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const submitRequest = async (formData) => {
    try {
      return await submitMutation.mutateAsync(formData);
    } catch {
      throw new Error("Failed to submit request. Please try again.");
    }
  };

  // ── Edit existing request ─────────────────────────────────
  const editMutation = useMutation({
    mutationFn: ({ id, formData }) => updateVisaRequest(id, formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const editRequest = async (id, formData) => {
    try {
      return await editMutation.mutateAsync({ id, formData });
    } catch {
      throw new Error("Failed to update request. Please try again.");
    }
  };

  // ── Cancel / delete request ───────────────────────────────
  const cancelMutation = useMutation({
    mutationFn: (id) => deleteVisaRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const cancelRequest = async (id) => {
    try {
      await cancelMutation.mutateAsync(id);
    } catch {
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
