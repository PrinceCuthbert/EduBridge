import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  XCircle,
  Globe,
  DollarSign,
  Image as ImageIcon,
  Upload,
  FileText,
} from "lucide-react";
import { usePrograms, useProgram } from "../../hooks/usePrograms";
import DatePicker from "../../components/ui/DatePicker";
import AdminCard from "../../components/admin/AdminCard";

export default function AdminProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  // Use hooks for data fetching and saving
  const { program: fetchedProgram, loading: fetchLoading } = useProgram(
    isNew ? null : id,
  );
  const {
    addProgram,
    updateProgram,
    loading: saveLoading,
  } = usePrograms(false);

  const [formData, setFormData] = useState({
    name: "",
    visaType: "D-2",
    tags: [],
    country: "",
    location: "",
    description: "",
    logo: "",
    images: [],
    // Structured: { language, degree, major, duration, credits, languageRequirement }
    departments: [],
    // Structured: { stage, registrationStart, registrationEnd, examDate, resultDate }
    timeline: [],
    // New: { level, item, amount }
    tuitionFees: [],
    // Categorized: [{ category, items: [] }]
    requiredDocuments: [],
    status: "Active",
    applicationLink: "",
    applicationFile: null,
  });

  // Common styles for inputs to ensure consistency
  const inputClassName =
    "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400";
  const labelClassName =
    "block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

  // Populate form when editing — safely merge with defaults so new
  // structured fields never end up as `undefined` even if the stored
  // program predates the current schema.
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNew) {
      const created = await addProgram(formData);
      if (created) navigate("/admin/programs");
    } else {
      const ok = await updateProgram(Number(id), formData);
      if (ok) navigate("/admin/programs");
    }
  };

  // ── Departments CRUD ─────────────────────────────────────────────────────
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
    setFormData({
      ...formData,
      departments: formData.departments.filter((_, i) => i !== index),
    });
  };

  // ── Timeline CRUD ─────────────────────────────────────────────────────────
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
    setFormData({
      ...formData,
      timeline: formData.timeline.filter((_, i) => i !== index),
    });
  };

  // ── Tuition Fees CRUD ─────────────────────────────────────────────────────
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
    setFormData({
      ...formData,
      tuitionFees: (formData.tuitionFees || []).filter((_, i) => i !== index),
    });
  };

  // ── Required Documents CRUD ───────────────────────────────────────────────
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
    setFormData({
      ...formData,
      requiredDocuments: formData.requiredDocuments.filter(
        (_, i) => i !== catIdx,
      ),
    });
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

  if (fetchLoading && !isNew) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header - Responsive Flex */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/programs")}
            className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-700 transition-all border border-transparent hover:border-slate-200">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif text-slate-900 tracking-tight">
              {isNew ? "New Program" : "Edit Program"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isNew
                ? "Create a new university program"
                : "Manage program details and settings"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saveLoading}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:pointer-events-none">
          {saveLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          <span>{isNew ? "Create Program" : "Save Changes"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <AdminCard title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className={labelClassName}>University Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputClassName}
                  placeholder="Enter official university name..."
                  required
                />
              </div>

              <div>
                <label className={labelClassName}>Visa Type</label>
                <div className="relative">
                  <select
                    value={formData.visaType}
                    onChange={(e) =>
                      setFormData({ ...formData, visaType: e.target.value })
                    }
                    className={`${inputClassName} appearance-none cursor-pointer`}>
                    <option value="D-2">D-2 (Degree)</option>
                    <option value="D-4">D-4 (Language)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M2.5 4.5L6 8L9.5 4.5" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClassName}>Country</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className={`${inputClassName} pl-10`}
                    placeholder="e.g. South Korea"
                  />
                  <Globe
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className={labelClassName}>Location / City</label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className={inputClassName}
                  placeholder="e.g. Nowon-gu, Seoul"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className={labelClassName}>Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`${inputClassName} resize-none`}
                  placeholder="Detailed academic program description..."
                />
              </div>
            </div>
          </AdminCard>

          {/* ── Application Schedule & Timeline ──────────────────────── */}
          <AdminCard
            title="Application Schedule & Timeline"
            action={
              <button
                onClick={addTimelineStep}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-all">
                <Plus size={14} /> Add Stage
              </button>
            }>
            <div className="space-y-3">
              {formData.timeline.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-3">
                  {/* Row 1: Stage name + delete */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Stage
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Stage 1"
                        value={item.stage}
                        onChange={(e) =>
                          updateTimeline(idx, "stage", e.target.value)
                        }
                        className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                    </div>
                    <button
                      onClick={() => removeTimeline(idx)}
                      className="mt-5 self-end p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {/* Row 2: Registration range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Registration Start
                      </span>
                      <DatePicker
                        value={item.registrationStart}
                        onChange={(d) =>
                          updateTimeline(idx, "registrationStart", d)
                        }
                        placeholder="Start date"
                        className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Registration End
                      </span>
                      <DatePicker
                        value={item.registrationEnd}
                        onChange={(d) =>
                          updateTimeline(idx, "registrationEnd", d)
                        }
                        placeholder="End date"
                        className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                    </div>
                  </div>
                  {/* Row 3: Exam + Result */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Exam / Review Date
                      </span>
                      <DatePicker
                        value={item.examDate}
                        onChange={(d) => updateTimeline(idx, "examDate", d)}
                        placeholder="Exam date"
                        className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Result Announcement
                      </span>
                      <DatePicker
                        value={item.resultDate}
                        onChange={(d) => updateTimeline(idx, "resultDate", d)}
                        placeholder="Result date"
                        className="w-full bg-white px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.timeline.length === 0 && (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium text-sm">
                    No stages added yet. Click "Add Stage" to begin.
                  </p>
                </div>
              )}
            </div>
          </AdminCard>

          {/* ── Departments & Majors ──────────────────────────────────── */}
          <AdminCard
            title="Departments & Majors"
            action={
              <button
                onClick={addDepartment}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-all">
                <Plus size={14} /> Add Row
              </button>
            }>
            <div className="space-y-3">
              {formData.departments.map((dept, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-2">
                  {/* Row 1: Language + Degree + Major + delete */}
                  <div className="grid grid-cols-[110px_90px_1fr_36px] gap-2 items-end">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Language
                      </span>
                      <select
                        value={dept.language}
                        onChange={(e) =>
                          updateDepartment(idx, "language", e.target.value)
                        }
                        className="w-full bg-white px-2 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none">
                        <option>English</option>
                        <option>Korean</option>
                        <option>French</option>
                        <option>Japanese</option>
                        <option>Chinese</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Degree
                      </span>
                      <input
                        type="text"
                        placeholder="B.A."
                        value={dept.degree}
                        onChange={(e) =>
                          updateDepartment(idx, "degree", e.target.value)
                        }
                        className="w-full bg-white px-2 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Major / Program
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={dept.major}
                        onChange={(e) =>
                          updateDepartment(idx, "major", e.target.value)
                        }
                        className="w-full bg-white px-2 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                    </div>
                    <button
                      onClick={() => removeDepartment(idx)}
                      className="self-end p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {/* Row 2: Duration + Lang. Requirement */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Duration — Credits
                      </span>
                      <input
                        type="text"
                        placeholder="4 yrs / 8 sem — 140 cr"
                        value={`${dept.duration}${dept.credits ? " — " + dept.credits : ""}`}
                        onChange={(e) => {
                          const parts = e.target.value.split(" — ");
                          const updated = [...formData.departments];
                          updated[idx] = {
                            ...updated[idx],
                            duration: parts[0] || "",
                            credits: parts[1] || "",
                          };
                          setFormData({ ...formData, departments: updated });
                        }}
                        className="w-full bg-white px-2 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-blue-400 outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1 block">
                        Language Requirement
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. TOEFL / IELTS"
                        value={dept.languageRequirement}
                        onChange={(e) =>
                          updateDepartment(
                            idx,
                            "languageRequirement",
                            e.target.value,
                          )
                        }
                        className="w-full bg-white px-2 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.departments.length === 0 && (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium text-sm">
                    No department rows yet. Click "Add Row" to begin.
                  </p>
                </div>
              )}
            </div>
          </AdminCard>

          {/* ── Required Documents ──────────────────────────────────────── */}
          <AdminCard
            title="Required Documents"
            action={
              <button
                onClick={addDocCategory}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-all">
                <Plus size={14} /> Add Category
              </button>
            }>
            <div className="space-y-4">
              {formData.requiredDocuments.map((cat, catIdx) => (
                <div
                  key={catIdx}
                  className="border border-slate-200 rounded-xl overflow-hidden">
                  {/* Category title row */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200">
                    <input
                      type="text"
                      placeholder="Category name, e.g. All Applicants"
                      value={cat.category}
                      onChange={(e) =>
                        updateDocCategory(catIdx, e.target.value)
                      }
                      className="flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                    />
                    <button
                      onClick={() => removeDocCategory(catIdx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove category">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {/* Items */}
                  <ul className="divide-y divide-slate-50 px-3 py-2 space-y-1">
                    {(cat.items || []).map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-center gap-2 py-1">
                        <span className="text-emerald-500 shrink-0">•</span>
                        <input
                          type="text"
                          placeholder="e.g. Copy of Passport"
                          value={item}
                          onChange={(e) =>
                            updateDocItem(catIdx, itemIdx, e.target.value)
                          }
                          className="flex-1 text-sm text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
                        />
                        <button
                          onClick={() => removeDocItem(catIdx, itemIdx)}
                          className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                          title="Remove item">
                          <XCircle size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="px-3 pb-3">
                    <button
                      onClick={() => addDocItem(catIdx)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
                      <Plus size={12} /> Add item
                    </button>
                  </div>
                </div>
              ))}
              {formData.requiredDocuments.length === 0 && (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium text-sm">
                    No document categories yet. Click "Add Category" to begin.
                  </p>
                </div>
              )}
            </div>
          </AdminCard>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          {/* School Logo */}
          <AdminCard title="School Logo">
            <div className="flex items-center gap-4">
              {/* Preview / initials fallback */}
              <div className="w-20 h-20 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                {formData.logo ? (
                  <img
                    src={formData.logo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  style={{ display: formData.logo ? "none" : "flex" }}
                  className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center">
                  <span className="text-white text-2xl font-bold select-none">
                    {(formData.name || "U")
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((w) => w[0].toUpperCase())
                      .join("")}
                  </span>
                </div>
              </div>

              {/* Upload + remove */}
              <div className="flex-1 space-y-2">
                <label className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm text-slate-500 hover:text-blue-600">
                  <ImageIcon size={15} />
                  <span className="font-medium">
                    {formData.logo ? "Change logo…" : "Upload logo…"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () =>
                        setFormData((prev) => ({
                          ...prev,
                          logo: reader.result,
                        }));
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                {formData.logo && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, logo: "" }))
                    }
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
                    <XCircle size={12} /> Remove logo
                  </button>
                )}
              </div>
            </div>
          </AdminCard>

          {/* ── Tuition Fees ─────────────────────────────────────────── */}
          <AdminCard
            title="Tuition Fees"
            action={
              <button
                onClick={addTuitionFee}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-all">
                <Plus size={14} /> Add Row
              </button>
            }>
            {formData.tuitionFees?.length > 0 && (
              <div className="hidden sm:grid grid-cols-[160px_1fr_160px_80px_40px] gap-2 mb-2 px-1">
                {["Level", "Item", "Amount", "Currency", ""].map((h) => (
                  <span
                    key={h}
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {h}
                  </span>
                ))}
              </div>
            )}
            <div className="space-y-2">
              {(formData.tuitionFees || []).map((fee, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl border border-slate-100 p-3 space-y-2">
                  {/* Level + Item */}
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Level
                      </span>
                      <select
                        value={fee.level}
                        onChange={(e) =>
                          updateTuitionFee(idx, "level", e.target.value)
                        }
                        className="w-full bg-white px-2 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none">
                        {[
                          "Bachelor's",
                          "Master's",
                          "Ph.D",
                          "Th.D",
                          "Th.M",
                          "M.Div",
                          "Certificate",
                        ].map((l) => (
                          <option key={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Fee Item
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Entrance Fee"
                        value={fee.item}
                        onChange={(e) =>
                          updateTuitionFee(idx, "item", e.target.value)
                        }
                        className="w-full bg-white px-2 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                    </div>
                  </div>
                  {/* Amount + Currency + delete */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Amount
                      </span>
                      <input
                        type="number"
                        min={0}
                        placeholder="e.g. 2500000"
                        value={fee.amount}
                        onChange={(e) =>
                          updateTuitionFee(idx, "amount", Number(e.target.value))
                        }
                        className="w-full bg-white px-2 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                      />
                    </div>
                    <div className="w-24">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                        Currency
                      </span>
                      <select
                        value={fee.currency ?? "KRW"}
                        onChange={(e) =>
                          updateTuitionFee(idx, "currency", e.target.value)
                        }
                        className="w-full bg-white px-2 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none">
                        {["KRW", "USD", "EUR", "GBP"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeTuitionFee(idx)}
                      className="mt-5 self-end p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {(!formData.tuitionFees || formData.tuitionFees.length === 0) && (
                <div className="py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium text-sm">
                    No fee rows yet. Click "Add Row".
                  </p>
                </div>
              )}
            </div>

            {/* Tags & Status still here in sidebar? Move them */}
            <div className="border-t border-slate-100 pt-4 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClassName}>Tags (comma separated)</label>
                <input
                  type="text"
                  value={(formData.tags || []).join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  className={inputClassName}
                  placeholder="e.g. ON SALE, BEST, NEW"
                />
              </div>
              <div>
                <label className={labelClassName}>Status</label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className={`${inputClassName} appearance-none cursor-pointer`}>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M2.5 4.5L6 8L9.5 4.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Application Form */}
          <AdminCard title="Application Form">
            <div className="space-y-4">
              {/* Google Form Link */}
              <div>
                <label className={labelClassName}>Google Form Link</label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.applicationLink || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        applicationLink: e.target.value,
                      })
                    }
                    className={`${inputClassName} pl-10`}
                    placeholder="https://forms.google.com/..."
                  />
                  <Globe
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                {formData.applicationLink && (
                  <a
                    href={formData.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors">
                    <Globe size={11} /> Preview link ↗
                  </a>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  or
                </span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* File Upload */}
              <div>
                <label className={labelClassName}>
                  Upload Application Form
                </label>

                {formData.applicationFile ? (
                  // Uploaded file preview
                  <div className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={15} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {formData.applicationFile.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(formData.applicationFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, applicationFile: null })
                      }
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove file">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  // Drop zone
                  <label className="flex flex-col items-center gap-2 px-4 py-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/40 transition-all group">
                    <div className="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center group-hover:border-blue-200 transition-colors shadow-sm">
                      <Upload
                        size={16}
                        className="text-slate-400 group-hover:text-blue-500 transition-colors"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                        Click to upload
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        PDF, DOC, DOCX — max 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          setFormData({ ...formData, applicationFile: file });
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
