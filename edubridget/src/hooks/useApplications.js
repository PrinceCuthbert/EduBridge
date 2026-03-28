// src/hooks/useApplications.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getApplications,
  getApplicationsByUserId,
  getApplicationById,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  updateTrackerStages,
  deleteApplication,
} from "../services/applicationService";

export function useApplications({ userId = null, trackerId = null } = {}) {
  const queryClient = useQueryClient();

  // ── Queries (3 modes) ───────────────────────────────────────────────────────

  // Mode 1: single application detail (AdminApplicationReview, ApplicationPreview)
  const singleQuery = useQuery({
    queryKey: ["applications", trackerId],
    queryFn: () => getApplicationById(trackerId),
    enabled: !!trackerId,
  });

  // Mode 2: student's own applications list
  const userQuery = useQuery({
    queryKey: ["applications", "user", userId],
    queryFn: () => getApplicationsByUserId(userId),
    enabled: !!userId && !trackerId,
  });

  // Mode 3: all applications (admin list / dashboard)
  const allQuery = useQuery({
    queryKey: ["applications"],
    queryFn: getApplications,
    enabled: !userId && !trackerId,
  });

  // ── Derived state ───────────────────────────────────────────────────────────

  const activeQuery = trackerId ? singleQuery : userId ? userQuery : allQuery;

  const applications = trackerId
    ? singleQuery.data
      ? [singleQuery.data]
      : []
    : (activeQuery.data ?? []);

  const singleApplication = trackerId ? (singleQuery.data ?? null) : null;

  // ── Cache invalidation helper ───────────────────────────────────────────────

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["applications"] });
    if (trackerId)
      queryClient.invalidateQueries({ queryKey: ["applications", trackerId] });
    if (userId)
      queryClient.invalidateQueries({
        queryKey: ["applications", "user", userId],
      });
  };

  // ── Mutations ───────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateApplication(id, data),
    onSuccess: invalidate,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateApplicationStatus(id, status),
    onSuccess: invalidate,
  });

  const updateTrackerStagesMutation = useMutation({
    mutationFn: ({ id, stages }) => updateTrackerStages(id, stages),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: invalidate,
  });

  // ── Public API (identical to previous hook interface) ───────────────────────

  return {
    applications,
    singleApplication,
    loading: activeQuery.isLoading,
    error: activeQuery.error?.message ?? null,
    fetchApplications: invalidate,
    createApplication: (data) => createMutation.mutateAsync(data),
    updateApplication: (id, data) => updateMutation.mutateAsync({ id, data }),
    updateStatus: (id, status) =>
      updateStatusMutation.mutateAsync({ id, status }),
    updateTrackerStages: (id, stages) =>
      updateTrackerStagesMutation.mutateAsync({ id, stages }),
    deleteApplication: (id) => deleteMutation.mutateAsync(id),
  };
}
