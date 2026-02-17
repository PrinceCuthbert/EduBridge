import { useState, useEffect } from "react";
import { MOCK_APPLICATIONS } from "../data/mockData";

let applicationsStore = [...MOCK_APPLICATIONS];

export function useApplications() {
  const [applications, setApplications] = useState(applicationsStore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setApplications([...applicationsStore]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getApplication = (id) => {
    return applicationsStore.find((app) => app.id === id);
  };

  const addApplication = async (newApplication) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newId = `APP-${new Date().getFullYear()}-${String(applicationsStore.length + 1).padStart(3, '0')}`;
      const appWithId = { ...newApplication, id: newId, status: "Pending" };
      
      applicationsStore = [appWithId, ...applicationsStore];
      setApplications([...applicationsStore]);
      return appWithId;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id, status) => {
      setLoading(true);
      try {
          await new Promise(resolve => setTimeout(resolve, 500));
          applicationsStore = applicationsStore.map(app => 
              app.id === id ? { ...app, status } : app
          );
          setApplications([...applicationsStore]);
      } catch (err) {
          setError(err);
      } finally {
          setLoading(false);
      }
  };

  return {
    applications,
    loading,
    error,
    fetchApplications,
    getApplication,
    addApplication,
    updateApplicationStatus
  };
}
