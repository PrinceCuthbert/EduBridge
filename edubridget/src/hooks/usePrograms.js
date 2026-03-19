// src/hooks/usePrograms.js
//
// Controller layer for programs — delegates all storage to programService.js.
// Mirrors useApplications.js / useVisaConsultations.js.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import * as programService from "../services/programService";

// ── List hook (admin list page + apply form) ──────────────────────────────────
// usePrograms - Server State to save changes for the databaseFunctions like updateProgram or deleteProgram
// actually make the API call (or in this case, call programService.js).
// When the Admin clicks the main "Save Changes" button, the updateProgram
// function takes the entire finalized Local State and permanently saves it to the database.

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
    [fetchPrograms],
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
    [fetchPrograms],
  );

  const deleteProgram = useCallback(async (id) => {
    try {
      await programService.deleteProgram(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      toast.success("Program deleted successfully");
      return true;
    } catch (err) {
      toast.error("Failed to delete program");
      return false;
    }
  }, []);

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

// ── Form State Hook (Extracts UI logic into the Controller) Local State):
// Functions like updateDepartment or removeTimeline ONLY modify
// the data currently sitting in the user's browser
// memory while they are typing. If the Admin clicks "Remove Row",
// the row disappears from the screen, but nothing has happened in the database yet.
// If they refresh the page, the row comes back.───────────────────

export function useProgramForm(fetchedProgram) {
  const [formData, setFormData] = useState({
    name: "",
    visaType: "D-2",
    tags: [],
    country: "",
    location: "",
    description: "",
    logo: "",
    images: [],
    departments: [],
    timeline: [],
    tuitionFees: [],
    requiredDocuments: [],
    status: "Active",
    applicationLink: "",
    applicationFile: null,
  });

  // Populate form when editing
  useEffect(() => {
    if (!fetchedProgram) return;
    setFormData({
      name: fetchedProgram.name ?? "",
      visaType: fetchedProgram.visaType ?? "D-2",
      country: fetchedProgram.country ?? "",
      location: fetchedProgram.location ?? "",
      description: fetchedProgram.description ?? "",
      logo: fetchedProgram.logo ?? "",
      images: Array.isArray(fetchedProgram.images) ? fetchedProgram.images : [],
      tags: Array.isArray(fetchedProgram.tags) ? fetchedProgram.tags : [],
      departments: Array.isArray(fetchedProgram.departments)
        ? fetchedProgram.departments
        : [],
      timeline: Array.isArray(fetchedProgram.timeline)
        ? fetchedProgram.timeline
        : [],
      tuitionFees: Array.isArray(fetchedProgram.tuitionFees)
        ? fetchedProgram.tuitionFees
        : [],
      requiredDocuments: Array.isArray(fetchedProgram.requiredDocuments)
        ? fetchedProgram.requiredDocuments
        : [],
      status: fetchedProgram.status ?? "Active",
      applicationLink: fetchedProgram.applicationLink ?? "",
      applicationFile: fetchedProgram.applicationFile ?? null,
    });
  }, [fetchedProgram]);

  // ── Departments CRUD ──
  const addDepartment = () => {
    setFormData((prev) => ({
      ...prev,
      departments: [
        ...prev.departments,
        {
          language: "English",
          degree: "",
          major: "",
          duration: "",
          credits: "",
          languageRequirement: "",
        },
      ],
    }));
  };
  const updateDepartment = (index, field, value) => {
    const updated = [...formData.departments];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, departments: updated });
  };
  const removeDepartment = (index) => {
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.filter((_, i) => i !== index),
    }));
  };

  // ── Timeline CRUD ──
  const addTimelineStep = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        {
          stage: "",
          registrationStart: "",
          registrationEnd: "",
          examDate: "",
          resultDate: "",
        },
      ],
    }));
  };
  const updateTimeline = (index, field, value) => {
    const updated = [...formData.timeline];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, timeline: updated });
  };
  const removeTimeline = (index) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  // ── Tuition Fees CRUD ──
  const addTuitionFee = () => {
    setFormData((prev) => ({
      ...prev,
      tuitionFees: [
        ...(prev.tuitionFees || []),
        { level: "Bachelor's", item: "", amount: 0, currency: "KRW" },
      ],
    }));
  };
  const updateTuitionFee = (index, field, value) => {
    const updated = [...(formData.tuitionFees || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, tuitionFees: updated });
  };
  const removeTuitionFee = (index) => {
    setFormData((prev) => ({
      ...prev,
      tuitionFees: (prev.tuitionFees || []).filter((_, i) => i !== index),
    }));
  };

  // ── Required Documents CRUD ──
  const addDocCategory = () => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: [
        ...prev.requiredDocuments,
        { category: "", items: [""] },
      ],
    }));
  };
  const updateDocCategory = (catIdx, value) => {
    const updated = [...formData.requiredDocuments];
    updated[catIdx] = { ...updated[catIdx], category: value };
    setFormData({ ...formData, requiredDocuments: updated });
  };
  const removeDocCategory = (catIdx) => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((_, i) => i !== catIdx),
    }));
  };
  const addDocItem = (catIdx) => {
    const updated = [...formData.requiredDocuments];
    updated[catIdx] = {
      ...updated[catIdx],
      items: [...updated[catIdx].items, ""],
    };
    setFormData({ ...formData, requiredDocuments: updated });
  };
  const updateDocItem = (catIdx, itemIdx, value) => {
    const updated = [...formData.requiredDocuments];
    const items = [...updated[catIdx].items];
    items[itemIdx] = value;
    updated[catIdx] = { ...updated[catIdx], items };
    setFormData({ ...formData, requiredDocuments: updated });
  };
  const removeDocItem = (catIdx, itemIdx) => {
    const updated = [...formData.requiredDocuments];
    updated[catIdx] = {
      ...updated[catIdx],
      items: updated[catIdx].items.filter((_, i) => i !== itemIdx),
    };
    setFormData({ ...formData, requiredDocuments: updated });
  };

  return {
    formData,
    setFormData,
    addDepartment,
    updateDepartment,
    removeDepartment,
    addTimelineStep,
    updateTimeline,
    removeTimeline,
    addTuitionFee,
    updateTuitionFee,
    removeTuitionFee,
    addDocCategory,
    updateDocCategory,
    removeDocCategory,
    addDocItem,
    updateDocItem,
    removeDocItem,
  };
}
