// src/hooks/usePrograms.js
//
// Server-state hooks for programs — React Query for all Firestore reads/writes.
// useProgramForm below is pure local UI state and is unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as programService from "../services/programService";

// ── List hook ─────────────────────────────────────────────────────────────────

export function usePrograms() {
  const queryClient = useQueryClient();

  const {
    data: programs = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["programs"],
    queryFn: programService.getPrograms,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["programs"] });

  const addMutation = useMutation({
    mutationFn: (data) => programService.createProgram(data),
    onSuccess: (created) => {
      invalidate();
      toast.success("Program added successfully");
      return created;
    },
    onError: () => toast.error("Failed to add program"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => programService.updateProgram(id, data),
    onSuccess: () => {
      invalidate();
      toast.success("Program updated successfully");
    },
    onError: () => toast.error("Failed to update program"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => programService.deleteProgram(id),
    onSuccess: () => {
      invalidate();
      toast.success("Program deleted");
    },
    onError: () => toast.error("Failed to delete program"),
  });

  return {
    programs,
    loading,
    error: error?.message ?? null,
    addProgram: (data) => addMutation.mutateAsync(data),
    updateProgram: (id, data) => updateMutation.mutateAsync({ id, data }),
    deleteProgram: (id) => deleteMutation.mutate(id),
    saving: addMutation.isPending || updateMutation.isPending,
  };
}

// ── Single-program hook ───────────────────────────────────────────────────────

export function useProgram(id) {
  const {
    data: program = null,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["programs", id],
    queryFn: () => programService.getProgramById(String(id)),
    enabled: !!id,
  });

  return {
    program,
    loading,
    error: error?.message ?? null,
  };
}

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

  // ── Tuition Fee Groups CRUD (grouped matrix model) ──
  // Shape: [{ groupName, currency, columns: string[], rows: [{ item, amounts: number[] }] }]

  const addFeeGroup = () => {
    setFormData((prev) => ({
      ...prev,
      tuitionFees: [
        ...(prev.tuitionFees || []),
        {
          groupName: "",
          currency: "KRW",
          columns: ["Default track"],
          rows: [],
        },
      ],
    }));
  };

  const removeFeeGroup = (gIdx) => {
    setFormData((prev) => ({
      ...prev,
      tuitionFees: (prev.tuitionFees || []).filter((_, i) => i !== gIdx),
    }));
  };

  const updateFeeGroup = (gIdx, field, value) => {
    const updated = [...(formData.tuitionFees || [])];
    updated[gIdx] = { ...updated[gIdx], [field]: value };
    setFormData({ ...formData, tuitionFees: updated });
  };

  const addFeeColumn = (gIdx) => {
    const updated = [...(formData.tuitionFees || [])];
    const group = { ...updated[gIdx] };
    group.columns = [...group.columns, ""];
    group.rows = group.rows.map((row) => ({
      ...row,
      amounts: [...row.amounts, 0],
    }));
    updated[gIdx] = group;
    setFormData({ ...formData, tuitionFees: updated });
  };

  const removeFeeColumn = (gIdx, cIdx) => {
    const updated = [...(formData.tuitionFees || [])];
    const group = { ...updated[gIdx] };
    group.columns = group.columns.filter((_, i) => i !== cIdx);
    group.rows = group.rows.map((row) => ({
      ...row,
      amounts: row.amounts.filter((_, i) => i !== cIdx),
    }));
    updated[gIdx] = group;
    setFormData({ ...formData, tuitionFees: updated });
  };

  const updateFeeColumn = (gIdx, cIdx, value) => {
    const updated = [...(formData.tuitionFees || [])];
    const group = { ...updated[gIdx] };
    const cols = [...group.columns];
    cols[cIdx] = value;
    group.columns = cols;
    updated[gIdx] = group;
    setFormData({ ...formData, tuitionFees: updated });
  };

  const addFeeRow = (gIdx) => {
    const updated = [...(formData.tuitionFees || [])];
    const group = { ...updated[gIdx] };
    group.rows = [
      ...group.rows,
      { item: "", amounts: new Array(group.columns.length).fill(0) },
    ];
    updated[gIdx] = group;
    setFormData({ ...formData, tuitionFees: updated });
  };

  const removeFeeRow = (gIdx, rIdx) => {
    const updated = [...(formData.tuitionFees || [])];
    const group = { ...updated[gIdx] };
    group.rows = group.rows.filter((_, i) => i !== rIdx);
    updated[gIdx] = group;
    setFormData({ ...formData, tuitionFees: updated });
  };

  const updateFeeRowItem = (gIdx, rIdx, value) => {
    const updated = [...(formData.tuitionFees || [])];
    const group = { ...updated[gIdx] };
    const rows = [...group.rows];
    rows[rIdx] = { ...rows[rIdx], item: value };
    group.rows = rows;
    updated[gIdx] = group;
    setFormData({ ...formData, tuitionFees: updated });
  };

  const updateFeeCell = (gIdx, rIdx, cIdx, value) => {
    const updated = [...(formData.tuitionFees || [])];
    const group = { ...updated[gIdx] };
    const rows = [...group.rows];
    const amounts = [...rows[rIdx].amounts];
    amounts[cIdx] = value;
    rows[rIdx] = { ...rows[rIdx], amounts };
    group.rows = rows;
    updated[gIdx] = group;
    setFormData({ ...formData, tuitionFees: updated });
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
    // NEW MATRIX FUNCTIONS
    addFeeGroup,
    removeFeeGroup,
    updateFeeGroup,
    addFeeColumn,
    removeFeeColumn,
    updateFeeColumn,
    addFeeRow,
    removeFeeRow,
    updateFeeRowItem,
    updateFeeCell,
    // DOCUMENT FUNCTIONS
    addDocCategory,
    updateDocCategory,
    removeDocCategory,
    addDocItem,
    updateDocItem,
    removeDocItem,
  };
}
