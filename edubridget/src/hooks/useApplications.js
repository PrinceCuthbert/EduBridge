// src/hooks/useApplications.js
import { useState, useCallback, useEffect } from "react";
import * as appService from "../services/applicationService";

/**
 * @param {string|null} userId  Pass a userId to get only that user's apps.
 *                              Omit (or pass null) for admin — gets all apps.
 */
export function useApplications(userId = null) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  // [FIX #1] fetchApplications is wrapped in useCallback so its reference stays
  // stable across renders and is safe to use as a useEffect dependency.
  const fetchApplications = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const data = userId
        ? appService.getApplicationsByUserId(userId)
        : appService.getApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // [FIX #1] Auto-fetch on mount and whenever userId changes.
  // Consumers no longer need their own useEffect(() => { fetchApplications() }).
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // [FIX #6] All mutation functions are wrapped in useCallback so they get stable
  // references and don't trigger unnecessary re-renders in consuming components
  // when passed as props or listed as effect dependencies.

  const createApplication = useCallback(async (data) => {
    const newApp = appService.createApplication(data);
    fetchApplications(); // Refresh list after create
    return newApp;
  }, [fetchApplications]);

  const updateApplication = useCallback(async (id, data) => {
    const updated = appService.updateApplication(id, data);
    fetchApplications(); // Refresh list after update
    return updated;
  }, [fetchApplications]);

  const updateStatus = useCallback(async (id, status) => {
    const updated = appService.updateApplicationStatus(id, status);
    fetchApplications(); // Refresh list after status change
    return updated;
  }, [fetchApplications]);

  const deleteApplication = useCallback(async (id) => {
    appService.deleteApplication(id);
    fetchApplications(); // Refresh list after delete
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    createApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
  };
}
