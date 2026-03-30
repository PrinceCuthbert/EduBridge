import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
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
import {
  usePrograms,
  useProgram,
  useProgramForm,
} from "../../hooks/usePrograms";
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
    saving: saveLoading,
  } = usePrograms();

  // Use Form hook for local state management
  const {
    formData,
    setFormData,
    addDepartment,
    updateDepartment,
    removeDepartment,
    addTimelineStep,
    updateTimeline,
    removeTimeline,
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
    addDocCategory,
    updateDocCategory,
    removeDocCategory,
    addDocItem,
    updateDocItem,
    removeDocItem,
  } = useProgramForm(fetchedProgram);

  // Common styles for inputs to ensure consistency
  const inputClassName =
    "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400";
  const labelClassName =
    "block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

  const handleSubmit = async (e) => {
    e.preventDefault();

    let applicationFileUrl = formData.applicationFile;

    // If the admin picked a new File (not already a URL string), upload it first
    if (formData.applicationFile instanceof File) {
      const fileRef = ref(
        storage,
        `programs/application-forms/${Date.now()}_${formData.applicationFile.name}`,
      );
      const snapshot = await uploadBytes(fileRef, formData.applicationFile, {
        contentDisposition: `attachment; filename="${formData.applicationFile.name}"`,
      });
      applicationFileUrl = await getDownloadURL(snapshot.ref);
    }

    const sanitizedData = {
      ...formData,
      visaType: formData.visaType.trim().toUpperCase(),
      applicationFile: applicationFileUrl ?? null,
    };

    console.log("Submitting Program Payload:", sanitizedData);

    if (isNew) {
      const created = await addProgram(sanitizedData);
      if (created) navigate("/admin/programs");
    } else {
      const ok = await updateProgram(String(id), sanitizedData);
      if (ok) navigate("/admin/programs");
    }
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
                  <input
                    list="visa-options"
                    value={formData.visaType}
                    onChange={(e) =>
                      setFormData({ ...formData, visaType: e.target.value })
                    }
                    className={inputClassName}
                    placeholder="Type or select a visa type..."
                  />
                  <datalist id="visa-options">
                    <option value="D-2">D-2 (Degree)</option>
                    <option value="D-4">D-4 (Language) </option>
                    <option value="D-4-1">D-4-1 (Language)</option>
                    <option value="F-1">F-1 (Student)</option>
                    <option value="J-1">J-1 (Exchange)</option>
                  </datalist>
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

      {/* ── Tuition Fees — full width below the grid ──────────────────────── */}
      <AdminCard
        title="Tuition Fees"
        subtitle="Build fee tables — grouped, named, and comparison-ready"
        action={
          <button
            type="button"
            onClick={addFeeGroup}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-blue-700">
            <Plus size={14} /> Add Fee Group
          </button>
        }>
        <div className="space-y-8">
          {(formData.tuitionFees || []).length === 0 && (
            <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium text-sm">
                No fee groups yet. Click "Add Fee Group" to start.
              </p>
            </div>
          )}
          {(formData.tuitionFees || []).map((group, gIdx) => (
            <div
              key={gIdx}
              className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-6">
              {/* Group Header */}
              <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-slate-100 pb-4">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Fee Group Name
                  </label>

                  <input
                    value={group.groupName}
                    onChange={(e) =>
                      updateFeeGroup(gIdx, "groupName", e.target.value)
                    }
                    className="w-full text-lg font-bold bg-transparent outline-none border-b border-transparent focus:border-blue-500 transition-colors"
                    placeholder="e.g. Master's Programs"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="w-28">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Currency
                    </label>
                    <select
                      value={group.currency}
                      onChange={(e) =>
                        updateFeeGroup(gIdx, "currency", e.target.value)
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                      {["KRW", "USD", "EUR", "GBP"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeeGroup(gIdx)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mb-0.5"
                    title="Remove group">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Column Tags */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                  Degree Tracks / Columns
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {(group.columns || []).map((col, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center gap-1 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                      <input
                        value={col}
                        onChange={(e) =>
                          updateFeeColumn(gIdx, cIdx, e.target.value)
                        }
                        className="bg-transparent text-xs font-semibold text-blue-700 w-24 outline-none"
                        placeholder="Track name"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeeColumn(gIdx, cIdx)}
                        className="text-blue-300 hover:text-red-500 transition-colors ml-1">
                        <XCircle size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addFeeColumn(gIdx)}
                    className="text-xs border-2 border-dashed border-slate-200 px-3 py-1 rounded-full text-slate-400 hover:border-blue-400 hover:text-blue-500 flex items-center gap-1 transition-colors">
                    <Plus size={12} /> Add Column
                  </button>
                </div>
              </div>

              {/* Matrix Table */}
              {group.columns.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="p-3 text-[10px] font-bold text-slate-500 uppercase rounded-l-lg border-y border-l w-1/3">
                          Fee Item
                        </th>
                        {group.columns.map((col, cIdx) => (
                          <th
                            key={cIdx}
                            className="p-3 text-[10px] font-bold text-slate-500 uppercase border-y text-center whitespace-nowrap">
                            {col || `Column ${cIdx + 1}`}
                          </th>
                        ))}
                        <th className="p-3 border-y border-r rounded-r-lg w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(group.rows || []).map((row, rIdx) => (
                        <tr key={rIdx}>
                          <td className="p-2">
                            <input
                              value={row.item}
                              onChange={(e) =>
                                updateFeeRowItem(gIdx, rIdx, e.target.value)
                              }
                              className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:border-blue-400 outline-none"
                              placeholder="e.g. Admission Fee"
                            />
                          </td>
                          {(row.amounts || []).map((amt, cIdx) => (
                            <td key={cIdx} className="p-2">
                              <input
                                type="number"
                                min={0}
                                value={amt}
                                onChange={(e) =>
                                  updateFeeCell(
                                    gIdx,
                                    rIdx,
                                    cIdx,
                                    Number(e.target.value),
                                  )
                                }
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm text-right font-mono focus:border-blue-400 outline-none"
                              />
                            </td>
                          ))}
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeFeeRow(gIdx, rIdx)}
                              className="text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() => addFeeRow(gIdx)}
                    className="mt-3 text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    <Plus size={13} /> Add Row
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
