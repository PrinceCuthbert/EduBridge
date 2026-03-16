import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCountryFlag } from "@/data/mockVisaData";
import {
  getVisaRequestById,
  addDocumentsToVisaRequest,
} from "@/services/visaService";

// Convert a File object to a base64 data URL (same helper as ApplicationSubmitForm)
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });

export default function UploadCaseDocuments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 400));

        const foundCase = await getVisaRequestById(id);

        if (!foundCase) {
          toast.error("Case not found or access denied");
          navigate("/dashboard/visa-status/summary");
          return;
        }

        setCaseData(foundCase);
      } catch (error) {
        toast.error("Failed to load case details");
        navigate("/dashboard/visa-status/summary");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [id, navigate]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          `${file.name} is not a valid file type. Only PDF, JPG, and PNG are allowed.`,
        );
        return false;
      }

      // Keep files small enough to fit in localStorage (base64 adds ~33% overhead).
      // 2MB raw → ~2.7MB base64 — safe for most sessions.
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum file size is 2MB.`, {
          description: "Files are stored in your browser — keep them small.",
        });
        return false;
      }

      return true;
    });

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    try {
      setUploading(true);

      // Encode every file as a base64 data URL so it persists in localStorage
      // and is readable by any session (e.g. admin) — same pattern as ApplicationSubmitForm.
      const newDocuments = await Promise.all(
        selectedFiles.map(async (file) => ({
          id: `vdoc-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: await fileToBase64(file),
          uploadedAt: new Date().toISOString(),
          status: "Received",
        })),
      );

      await addDocumentsToVisaRequest(id, newDocuments);

      toast.success(
        `Successfully uploaded ${newDocuments.length} document${newDocuments.length > 1 ? "s" : ""}!`,
        { description: "Your documents have been submitted for review." },
      );

      navigate(`/dashboard/visa-status/summary/details/${id}`);
    } catch (error) {
      toast.error("Failed to upload documents", {
        description:
          error?.message ||
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Upload size={32} className="mx-auto text-slate-300 animate-pulse" />
        <p className="text-slate-400 text-sm mt-3">Loading upload form...</p>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      {/* Back Button */}
      <div>
        <button
          onClick={() =>
            navigate(`/dashboard/visa-status/summary/details/${id}`)
          }
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} />
          Back to Case Details
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-serif text-slate-900 tracking-tight">
          Upload Documents
        </h1>
        <p className="text-slate-500 text-sm">
          Submit required documents for {caseData.destination}{" "}
          {caseData.visaType} (Case #{caseData.id})
        </p>
      </div>

      {/* Case Info Card */}
      <Card className="border-blue-100 bg-blue-50/30 rounded-xl shadow-none">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="text-3xl">
              {getCountryFlag(caseData.countryCode)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {caseData.destination} - {caseData.visaType}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Appointment: {caseData.dateBooked} at {caseData.appointmentTime}
              </p>
            </div>
            <div className="ml-auto">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-medium">
                {caseData.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="rounded-xl border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* File Upload Area */}
              <div>
                <Label
                  htmlFor="documents"
                  className="text-sm font-semibold text-slate-900">
                  Select Documents
                </Label>
                <p className="text-xs text-slate-500 mb-3 mt-1">
                  Upload PDF, JPG, or PNG files (max 2MB each)
                </p>

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-slate-50 transition-all cursor-pointer group">
                  <input
                    type="file"
                    id="documents"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="documents" className="cursor-pointer block">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors text-slate-400">
                      <Upload size={24} />
                    </div>
                    <p className="text-slate-900 font-medium text-sm mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-400">
                      PDF, JPG, PNG up to 2MB
                    </p>
                  </label>
                </div>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-slate-900">
                      Selected Files ({selectedFiles.length})
                    </Label>
                    <button
                      type="button"
                      onClick={() => setSelectedFiles([])}
                      className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline">
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle
                    size={18}
                    className="text-amber-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="font-semibold text-amber-900 text-xs uppercase tracking-wider mb-1">
                      Important Guidelines
                    </h4>
                    <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                      <li>Ensure all documents are clear and legible</li>
                      <li>Files should be in color for passports and photos</li>
                      <li>All text must be readable without zooming</li>
                      <li>Do not upload password-protected files</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate(`/dashboard/visa-status/summary/details/${id}`)
            }
            disabled={uploading}
            className="text-slate-600 border-slate-200 hover:bg-slate-50">
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={uploading || selectedFiles.length === 0}
            className="gap-2 min-w-[140px] bg-slate-900 hover:bg-slate-800 text-white">
            {uploading ? (
              <>
                <Upload size={14} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle size={14} />
                Upload Files
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
