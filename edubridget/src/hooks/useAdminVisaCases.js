// ─────────────────────────────────────────────────────────────
//  src/hooks/useAdminVisaCases.js
//
//  WHO USES THIS: admin pages only.
//  (VisaCases.jsx, VisaCaseDetail.jsx)
//
//  This hook exposes every admin operation.
//  Student hook (useVisaConsultations) does NOT have these.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import {
  getVisaRequests,
  createVisaRequest,
  updateVisaStatus,
  updateVisaFee,
  updateVisaSchedule,
  deleteVisaRequest,
} from "../services/visaService";

/**
 * Returns:
 *   cases            - all visa requests across all students
 *   loading          - true while fetching
 *   error            - error string or null
 *   fetchCases       - manual refetch
 *   addCase          - admin creates a case manually
 *   setStatus        - update status only
 *   setFee           - record fee + payment status
 *   setSchedule      - set appointment date/time/link
 *   removeCase       - delete a case
 */
export const useAdminVisaCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch all ─────────────────────────────────────────────
  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVisaRequests();
      setCases(data);
    } catch (err) {
      setError("Failed to load cases.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // ── Admin creates a case manually ─────────────────────────
  const addCase = async (formData) => {
    try {
      const created = await createVisaRequest(formData, formData.userId ?? "admin_created");
      setCases((prev) => [...prev, created]);
      return created;
    } catch (err) {
      throw new Error("Failed to add case.");
    }
  };

  // ── Update status only ────────────────────────────────────
  const setStatus = async (id, status) => {
    try {
      const updated = await updateVisaStatus(id, status);
      setCases((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err) {
      throw new Error("Failed to update status.");
    }
  };

  // ── Record fee ────────────────────────────────────────────
  const setFee = async (id, consultationFee, feeStatus) => {
    try {
      const updated = await updateVisaFee(id, consultationFee, feeStatus);
      setCases((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err) {
      throw new Error("Failed to update fee.");
    }
  };

  // ── Schedule meeting ──────────────────────────────────────
  const setSchedule = async (id, schedule) => {
    try {
      const updated = await updateVisaSchedule(id, schedule);
      setCases((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    } catch (err) {
      throw new Error("Failed to save schedule.");
    }
  };

  // ── Delete case ───────────────────────────────────────────
  const removeCase = async (id) => {
    try {
      await deleteVisaRequest(id);
      setCases((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
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
