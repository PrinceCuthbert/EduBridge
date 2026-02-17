import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useApplications } from "../../../hooks/useApplications";
import { usePrograms } from "../../../hooks/usePrograms";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, UploadCloud, FileText, X, CheckCircle2 } from "lucide-react";

export default function ApplicationSubmission() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { programs } = usePrograms();
  const { addApplication } = useApplications(); // Use the hook
  const { programId } = useParams();

  // State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    programId: "",
    paperTitle: "",
    description: "",
    submissionDate: new Date().toISOString().split("T")[0],
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        studentId: user.studentId || "", // Assuming this exists on user object
      }));
    }
  }, [user]);

  // Pre-fill program if valid ID passed via props/url or location state
  useEffect(() => {
    const preselectedId = programId || location.state?.programId;
    const prefilledFile = location.state?.prefilledFile;

    if (preselectedId) {
        setFormData(prev => ({ 
            ...prev, 
            programId: preselectedId.toString(),
            // If we have a file name, maybe prepopulate title or description?
            paperTitle: prefilledFile?.name ? `Application for ${preselectedId} - ${prefilledFile.name}` : prev.paperTitle
        }));
    }
  }, [programId, location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Simple validation
    const validFiles = selectedFiles.filter(
      (file) => file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Some files were skipped (Max 10MB each)");
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateProgress = () => {
    // Simulate progress of form completion
    let filled = 0;
    const required = ['firstName', 'lastName', 'email', 'programId', 'paperTitle', 'description'];
    required.forEach(field => {
        if(formData[field]) filled++;
    });
    if(files.length > 0) filled++;
    return Math.round((filled / (required.length + 1)) * 100);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.programId) {
        toast.error("Please select a program");
        setIsSubmitting(false);
        return;
    }
    
    if (files.length === 0) {
        toast.error("Please upload at least one document");
        setIsSubmitting(false);
        return;
    }

    try {
      // Find selected program name
      const selectedProgram = programs.find(p => p.id.toString() === formData.programId);
      
      const newApplication = {
          ...formData,
          studentName: `${formData.firstName} ${formData.lastName}`,
          scholarship: selectedProgram ? selectedProgram.universityName : "Unknown Program", // Mapping for display
          date: new Date().toISOString().split('T')[0],
          documents: files.map(f => f.name), // In real app, upload first then store URL
          // Store file objects if needed for simulation, but simpler to just store names for mock list
      };

      await addApplication(newApplication);

      toast.success("Application submitted successfully!");
      // Navigate to success page or dashboard
      navigate("/dashboard/applications");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <FileText className="text-white" size={24} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Paper Submission Form
        </h1>
        <p className="text-slate-500">
          Complete the academic requirements for your specific program and
          university.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full">
            <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out" 
                style={{ width: `${calculateProgress()}%` }}
            />
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* University & Program Selection */}
          <div className="space-y-2">
            <Label htmlFor="programId" className="text-slate-700 font-semibold flex items-center gap-2">
                University & Program <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.programId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, programId: value }))
              }
            >
              <SelectTrigger className="bg-slate-50 border-slate-200 focus:bg-white transition-colors h-11">
                <SelectValue placeholder="Select your academic program..." />
              </SelectTrigger>
              <SelectContent>
                {programs.map((prog) => (
                  <SelectItem key={prog.id} value={prog.id.toString()}>
                    {prog.universityName} - {prog.visaType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Personal Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-slate-700 font-semibold">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="e.g. John"
                value={formData.firstName}
                onChange={handleInputChange}
                className="bg-slate-50 border-slate-200 focus:bg-white h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-slate-700 font-semibold">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="e.g. Doe"
                value={formData.lastName}
                onChange={handleInputChange}
                className="bg-slate-50 border-slate-200 focus:bg-white h-11"
                required
              />
            </div>
          </div>

          {/* Date & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="submissionDate" className="text-slate-700 font-semibold">Submission Date</Label>
              <div className="relative">
                <Input
                  id="submissionDate"
                  name="submissionDate"
                  type="date"
                  value={formData.submissionDate}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200 focus:bg-white h-11"
                  readOnly
                />
                <Calendar className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Student Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@university.edu"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-slate-50 border-slate-200 focus:bg-white h-11"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-slate-700 font-semibold flex items-center gap-2">
                Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="e.g. +1 234 567 8900"
              value={formData.phoneNumber || ""}
              onChange={handleInputChange}
              className="bg-slate-50 border-slate-200 focus:bg-white h-11"
            />
          </div>

          {/* Paper Title */}
          <div className="space-y-2">
            <Label htmlFor="paperTitle" className="text-slate-700 font-semibold">Paper Title</Label>
            <Input
              id="paperTitle"
              name="paperTitle"
              placeholder="Enter the full title of your research paper"
              value={formData.paperTitle}
              onChange={handleInputChange}
              className="bg-slate-50 border-slate-200 focus:bg-white h-11"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 font-semibold">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief summary of your submission..."
              value={formData.description}
              onChange={handleInputChange}
              className="bg-slate-50 border-slate-200 focus:bg-white min-h-[120px] resize-none"
              required
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
             <Label className="text-slate-700 font-semibold">Upload Files</Label>
             <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors p-8 text-center relative group">
                <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                        <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">
                        PDF, DOCX up to 10MB
                    </p>
                </div>
             </div>

             {/* File List */}
             {files.length > 0 && (
                <div className="space-y-2 mt-4">
                    {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg animate-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 bg-white border border-slate-200 rounded flex items-center justify-center shrink-0">
                                    <FileText size={16} className="text-blue-600" />
                                </div>
                                <div className="truncate">
                                    <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
             )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
             <Button 
                type="submit" 
                className="w-full h-12 text-base bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 shadow-lg shadow-slate-900/20"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        <span>Submit Application</span>
                    </div>
                )}
             </Button>
          </div>
          
          <div className="text-center">
             <p className="text-xs text-slate-400">
                By clicking submit, you agree to our Terms and Conditions.
             </p>
          </div>
        </form>
      </div>
    </div>
  );
}
