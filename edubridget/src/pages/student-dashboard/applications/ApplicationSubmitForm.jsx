// src/pages/dashboard/ApplicationSubmitForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { usePrograms } from "../../../hooks/usePrograms";
import { useApplications } from "../../../hooks/useApplications";
import { getApplicationById } from "../../../services/applicationService";
import { useAuth } from "../../../context/AuthContext";
import { Upload, X, FileText, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const inputCls =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400";
const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

export default function ApplicationSubmitForm() {
  const navigate = useNavigate();
  const { id } = useParams();                          // programId (create) | applicationId (edit)
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  const { user } = useAuth();
  const { programs } = usePrograms();
  const { createApplication, updateApplication } = useApplications(user?.id);

  const [form, setForm] = useState({
    programId:      isEditMode ? "" : (id ?? ""),
    departmentName: "",
    firstName:      "",
    lastName:       "",
    phone:          "",
    email:          user?.email ?? "",
    submissionDate: new Date().toISOString().split("T")[0],
  });
  const [existingDocs, setExistingDocs]   = useState([]);
  const [newFiles,     setNewFiles]       = useState([]);
  const [existingApp,  setExistingApp]    = useState(null);
  const [submitting,   setSubmitting]     = useState(false);

  // Load existing application in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const app = getApplicationById(id);
      if (app) {
        setExistingApp(app);
        setForm({
          programId:       app.programId       ?? "",
          departmentName:  app.departmentName  ?? "",
          firstName:       app.firstName       ?? "",
          lastName:        app.lastName        ?? "",
          phone:           app.phone           ?? "",
          email:           app.email           ?? user?.email ?? "",
          submissionDate:  app.submissionDate  ?? new Date().toISOString().split("T")[0],
        });
        setExistingDocs(app.documents ?? []);
      } else {
        toast.error("Application not found.");
        navigate("/dashboard/applications");
      }
    }
  }, [id, isEditMode]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Changing university must clear departmentName to avoid stale selection.
  const handleUniversityChange = (e) => {
    setForm((prev) => ({
      ...prev,
      programId:      e.target.value,
      departmentName: "",
    }));
  };

  // TODO (DB integration): replace this local derivation with a fetch call:
  // GET /api/programs/:id/departments  — returns a departments[] for the selected university.
  // The select logic below stays identical; only the data source changes.
  const selectedUniversityProgram = programs.find(
    (p) => String(p.id) === String(form.programId)
  );
  const availableDepartments = selectedUniversityProgram?.departments ?? [];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter((f) => {
      if (f.size > MAX_FILE_SIZE) {
        toast.error(`${f.name} exceeds the 10 MB limit`);
        return false;
      }
      return true;
    });
    setNewFiles((prev) => [...prev, ...valid]);
    e.target.value = ""; // reset so same file can be re-added after removal
  };

  const removeNewFile      = (idx) => setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  const removeExistingDoc  = (docId) => setExistingDocs((prev) => prev.filter((d) => d.id !== docId));

  // Convert a File object to a persistent Base64 data URL.
  // Unlike URL.createObjectURL(), a data: URL survives page refreshes and
  // works in any browser session — which means the admin can download it too.

  // Trade - off to be aware of: Base64 encoding increases file size by ~33 %. 
  // For a localStorage - based demo this is fine, but in production you'd 
  // upload files directly to S3 / Cloudinary instead and store just the resulting URL.


  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result); // "data:<mime>;base64,<data>"
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.programId) return toast.error("Please select a program");
    setSubmitting(true);

    try {
      const selectedProgram = programs.find((p) => String(p.id) === String(form.programId));

      // Encode every file as Base64 so the URL is a self-contained string
      // that persists in localStorage and is readable by any session (e.g. admin).
      const newDocuments = await Promise.all(
        newFiles.map(async (file) => ({
          id:         `doc-${Date.now()}-${Math.random()}`,
          name:       file.name,
          type:       file.type,
          size:       file.size,
          url:        await fileToBase64(file),
          uploadedAt: new Date().toISOString(),
        }))
      );

      if (isEditMode) {
        await updateApplication(id, {
          ...form,
          documents:      [...existingDocs, ...newDocuments],
          universityName: selectedProgram?.universityName ?? "",
          programName:    form.departmentName,
        });
        toast.success("Application updated successfully");
      } else {
        await createApplication({
          ...form,
          userId:         user?.id,
          universityName: selectedProgram?.universityName ?? "",
          programName:    form.departmentName,
          documents:      newDocuments,
        });
        toast.success("Application submitted successfully");
      }

      navigate("/dashboard/applications");
    } catch (err) {
     const msg = err?.response?.status === 422
    ? "Please check your form fields."
    : "Network error. Please try again.";
  toast.error(msg);
  console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Back nav */}
      <button
        onClick={() => navigate("/dashboard/applications")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Applications
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-slate-100">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {isEditMode ? "Edit Application" : "Application Submission Form"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isEditMode
              ? "Update your application details below."
              : "Complete the form to apply for your chosen program."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {/* Step 1 — University */}
          <div>
            <label className={labelCls}>
              University <span className="text-red-500">*</span>
            </label>
            <select
              value={form.programId}
              onChange={handleUniversityChange}
              required
              className={inputCls}
            >
              <option value="">Select a university…</option>
              {programs.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.universityName}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2 — Department (cascades from university) */}
          {form.programId && (
            <div>
              <label className={labelCls}>
                Department / Program <span className="text-red-500">*</span>
              </label>
              {availableDepartments.length > 0 ? (
                <select
                  value={form.departmentName}
                  onChange={set("departmentName")}
                  required
                  className={inputCls}
                >
                  <option value="">Select a department…</option>
                  {availableDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-slate-400 italic py-2">
                  No programs listed for this university yet.
                </p>
              )}
            </div>
          )}

          {/* Application link (edit read-only) */}
          {isEditMode && existingApp?.applicationLink && (
            <div className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">
                Application Link (provided by admin)
              </p>
              <a
                href={existingApp.applicationLink}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                {existingApp.applicationLink}
              </a>
            </div>
          )}

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>First Name</label>
              <input
                type="text" placeholder="e.g. John"
                value={form.firstName} onChange={set("firstName")} required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Last Name</label>
              <input
                type="text" placeholder="e.g. Doe"
                value={form.lastName} onChange={set("lastName")} required
                className={inputCls}
              />
            </div>
          </div>

          {/* Date & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Submission Date</label>
              <input
                type="date" value={form.submissionDate}
                onChange={set("submissionDate")}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Student Email</label>
              <input
                type="email" value={form.email}
                onChange={set("email")} required
                className={inputCls}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={labelCls}>Phone Number</label>
            <input
            type="tel"
  pattern="^\+?[0-9\s\-]{7,15}$"
  placeholder="e.g. +254 712 345 678"
              value={form.phone} onChange={set("phone")}
              className={inputCls}
            />
          </div>

          {/* Existing documents (edit mode) */}
          {isEditMode && existingDocs.length > 0 && (
            <div>
              <label className={labelCls}>Current Documents</label>
              <div className="space-y-2">
                {existingDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={15} className="text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-700 truncate">{doc.name}</span>
                      <span className="text-xs text-slate-400 shrink-0">
                        ({(doc.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingDoc(doc.id)}
                      className="p-1 hover:text-red-500 text-slate-400 transition-colors ml-2 shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File upload */}
          <div>
            <label className={labelCls}>
              {isEditMode ? "Add More Documents" : "Upload Documents"}
            </label>
            <label className="block border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
              <Upload size={24} className="mx-auto mb-3 text-slate-400" />
              <p className="text-sm text-slate-600">Click to upload or drag &amp; drop</p>
              <p className="text-xs text-slate-400 mt-1">
                PDF, DOCX, ZIP, Images (max 10 MB each)
              </p>
              <input
                type="file" multiple accept={ACCEPTED_TYPES}
                onChange={handleFileChange} className="hidden"
              />
            </label>

            {newFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {newFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={15} className="text-blue-500 shrink-0" />
                      <span className="text-sm text-slate-700 truncate">{file.name}</span>
                      <span className="text-xs text-slate-400 shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="p-1 hover:text-red-500 text-slate-400 transition-colors ml-2 shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-60 mt-2"
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {submitting
              ? newFiles.length > 0 ? "Uploading files…" : "Saving…"
              : isEditMode
              ? "Save Changes"
              : "Submit Application"}
          </button>
          <p className="text-center text-xs text-slate-400">
            By submitting you agree to our Terms &amp; Conditions.
          </p>
        </form>
      </div>
    </div>
  );
}
