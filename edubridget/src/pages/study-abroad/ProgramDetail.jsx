import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useProgram } from "../../hooks/usePrograms";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Share2,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { ProgramDepartments, ProgramTimeline, ProgramRequirements, ProgramApplication, ProgramTuitionFees } from "../../components/program/ProgramSections";

export default function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { program, loading, error } = useProgram(id);
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("details");

  /* 
    Unified apply handler
    - type: 'link' | 'file' | 'default'
    - payload: URL string or File object
  */
  const handleApply = async (type = 'default', payload = null) => {

    // We must check before because the uesr can see this page even before being authenticated too at /study-abroad/{id}


    // 1. Check Authentication FIRST
    if (!isAuthenticated) {
      toast.error("Please login to continue with your application");
      navigate("/signin", { state: { from: location } });
      return;
    }

    // 2. Helper to handle download/navigation
    const performAction = () => {
      if (type === 'link' || (type === 'default' && program.applicationLink)) {
        const url = type === 'link' ? payload : program.applicationLink;
        window.open(url, '_blank', 'noopener,noreferrer');
        toast.success("Opening application form...");
        return;
      }

      if (type === 'file' || (type === 'default' && program.applicationFile)) {
        const file = type === 'file' ? payload : program.applicationFile;
        // Handle file download logic
        const link = document.createElement('a');
        if (typeof file === 'string') {
           link.href = file;
           link.download = file.split('/').pop();
        } else if (file instanceof File || file instanceof Blob) {
           link.href = URL.createObjectURL(file);
           link.download = file.name;
        } else {
           console.error("Unknown file type", file);
           toast.error("Error accessing file");
           return;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Downloading application form...");
        return;
      }

      if (type === 'submit') {
          navigate(`/dashboard/applications/submit/${id}`, { 
             state: { 
                 programId: id,
                 prefilledFile: payload // Pass file metadata 
             } 
          });
          return;
      }

      // 3. Fallback / Default application flow (Mock)
      // Only runs if type is 'default' and no link/file exists
      simulateDefaultApplication();
    };

    performAction();
  };

  const simulateDefaultApplication = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Application started successfully! (Demo)");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to apply");
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Program Not Found
        </h2>
        <Button onClick={() => navigate("/study-abroad")}>
          Back to Programs
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-slate-500 mb-8">
          <span
            className="cursor-pointer hover:text-slate-900"
            onClick={() => navigate("/")}>
            Home
          </span>
          <ChevronRight size={14} className="mx-2" />
          <span
            className="cursor-pointer hover:text-slate-900"
            onClick={() => navigate("/study-abroad")}>
            Study Abroad
          </span>
          <ChevronRight size={14} className="mx-2" />
          <span className="font-semibold text-slate-900 line-clamp-1">
            {program.universityName}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center relative overflow-hidden shadow-sm">
              <div className="absolute top-4 right-4">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {program.visaType}
                </Badge>
              </div>

              <div className="w-32 h-32 mx-auto mb-6 relative flex items-center justify-center">
                <img
                  src={program.logo}
                  alt={program.universityName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                {program.universityName}
              </h1>
              {program.location && (
                <p className="text-sm text-slate-500 mb-3">{program.location} · {program.country}</p>
              )}
              <div className="flex items-center justify-center gap-2 mb-4">
                {program.tags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant="outline"
                    className="font-bold text-slate-600 border-slate-200 bg-slate-50">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {program.description}
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === "details" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500 hover:bg-slate-50"}`}>
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("qa")}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === "qa" ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500 hover:bg-slate-50"}`}>
                  Q&A (0)
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-10">
                {activeTab === "details" ? (
                  <>
                    <ProgramDepartments departments={program.departments} />
                    <ProgramTimeline timeline={program.timeline} />
                    <ProgramTuitionFees tuitionFees={program.tuitionFees} />
                    <ProgramRequirements documents={program.requiredDocuments} />
                    <ProgramApplication
                      applicationLink={program.applicationLink}
                      applicationFile={program.applicationFile}
                      onApply={handleApply}
                    />
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <p>No questions yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Application CTA card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{program.universityName}</h2>
                  {program.location && (
                    <p className="text-sm text-slate-500">{program.location} · {program.country}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                    {program.visaType}
                  </span>
                  {program.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>

                <div className="pt-2 space-y-3">
                  <Button
                    onClick={() => handleApply('default')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base shadow-sm"
                  >
                    Apply Now
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full border-slate-200" onClick={() => handleApply('file')}>
                      Download Form
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2 text-slate-600 border-slate-200"
                      onClick={() => handleApply('link')}
                    >
                      <Share2 size={18} /> Share
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">Share this program</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="border-slate-200 text-slate-600">
                    <Share2 size={18} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => window.print()} className="border-slate-200 text-slate-600">
                    <Printer size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
