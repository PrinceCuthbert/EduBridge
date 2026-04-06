// ─────────────────────────────────────────────────────────────
//  src/hooks/useAdminVisaCases.js
//
//  WHO USES THIS: admin pages only.
//  (VisaCases.jsx)
//
//  Migrated from useState/useEffect to React Query.
//  Same public API as before — call sites unchanged.
//
//  Query key: ["visaCases"]
// ─────────────────────────────────────────────────────────────

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVisaRequests,
  createVisaRequest,
  updateVisaStatus,
  updateVisaFee,
  updateVisaSchedule,
  deleteVisaRequest,
} from "../services/visaService";

export const useAdminVisaCases = () => {
  const queryClient = useQueryClient();
  const queryKey = ["visaCases"];

  // ── Fetch all cases ───────────────────────────────────────
  const {
    data: cases = [],
    isLoading: loading,
    error: queryError,
    refetch: fetchCases,
  } = useQuery({
    queryKey,
    queryFn: getVisaRequests,
  });

  const error = queryError ? "Failed to load cases." : null;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
    // Invalidate financial analytics derived from Visa Cases
    queryClient.invalidateQueries({ queryKey: ["financialStats"] });
    queryClient.invalidateQueries({ queryKey: ["revenueByMonth"] });
  };

  // ── Admin creates a case manually ─────────────────────────
  const addCaseMutation = useMutation({
    mutationFn: (formData) =>
      createVisaRequest(formData, formData.userId ?? "admin_created"),
    onSuccess: invalidate,
  });

  const addCase = async (formData) => {
    try {
      return await addCaseMutation.mutateAsync(formData);
    } catch {
      throw new Error("Failed to add case.");
    }
  };

  // ── Update status only ────────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateVisaStatus(id, status),
    onSuccess: invalidate,
  });

  const setStatus = async (id, status) => {
    try {
      return await statusMutation.mutateAsync({ id, status });
    } catch {
      throw new Error("Failed to update status.");
    }
  };

  // ── Record fee ────────────────────────────────────────────
  const feeMutation = useMutation({
    mutationFn: ({ id, consultationFee, feeStatus }) =>
      updateVisaFee(id, consultationFee, feeStatus),
    onSuccess: invalidate,
  });

  const setFee = async (id, consultationFee, feeStatus) => {
    try {
      return await feeMutation.mutateAsync({ id, consultationFee, feeStatus });
    } catch {
      throw new Error("Failed to update fee.");
    }
  };

  // ── Schedule meeting ──────────────────────────────────────
  const scheduleMutation = useMutation({
    mutationFn: ({ id, schedule }) => updateVisaSchedule(id, schedule),
    onSuccess: invalidate,
  });

  const setSchedule = async (id, schedule) => {
    try {
      return await scheduleMutation.mutateAsync({ id, schedule });
    } catch {
      throw new Error("Failed to save schedule.");
    }
  };

  // ── Delete case ───────────────────────────────────────────
  const removeMutation = useMutation({
    mutationFn: (id) => deleteVisaRequest(id),
    onSuccess: invalidate,
  });

  const removeCase = async (id) => {
    try {
      await removeMutation.mutateAsync(id);
    } catch {
      throw new Error("Failed to delete case.");
    }
  };

  return {
    cases,
    loading,
    error,
    fetchCases,
    addCase,
    setStatus,
    setFee,
    setSchedule,
    removeCase,
  };
};
