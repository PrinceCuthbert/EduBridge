// src/hooks/useApplications.js
import { useState, useCallback, useEffect } from "react";
import * as appService from "../services/applicationService";

export function useApplications({ userId = null, trackerId = null } = {}) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      // 1. If we provided a trackerId, fetch just that one application
      if (trackerId) {
        const app = await appService.getApplicationById(trackerId);
        data = app ? [app] : [];
      }
      // 2. If we provided a userId, fetch all applications for that student
      else if (userId) {
        data = await appService.getApplicationsByUserId(userId);
      }
      // 3. Otherwise, fetch all applications (for Admin List/Tracker views)
      else {
        data = await appService.getApplications();
      }
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, trackerId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const createApplication = useCallback(
    async (data) => {
      const newApp = await appService.createApplication(data);
      await fetchApplications();
      return newApp;
    },
    [fetchApplications],
  );

  const updateApplication = useCallback(
    async (id, data) => {
      const updated = await appService.updateApplication(id, data);
      await fetchApplications();
      return updated;
    },
    [fetchApplications],
  );

  const updateStatus = useCallback(
    async (id, status) => {
      const updated = await appService.updateApplicationStatus(id, status);
      await fetchApplications();
      return updated;
    },
    [fetchApplications],
  );

  const updateTrackerStages = useCallback(
    async (id, stages) => {
      const updated = await appService.updateTrackerStages(id, stages);
      await fetchApplications();
      return updated;
    },
    [fetchApplications],
  );

  const deleteApplication = useCallback(
    async (id) => {
      await appService.deleteApplication(id);
      await fetchApplications();
    },
    [fetchApplications],
  );

  // Derived state: Extract the single item for detail pages
  const singleApplication = applications.length > 0 ? applications[0] : null;

  return {
    applications,
    singleApplication,
    loading,
    error,
    fetchApplications,
    createApplication,
    updateApplication,
    updateStatus,
    updateTrackerStages,
    deleteApplication,
  };
}
