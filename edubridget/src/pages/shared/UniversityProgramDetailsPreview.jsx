import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProgram } from "../../hooks/usePrograms";
import { ArrowLeft } from "lucide-react";
import { ProgramDepartments, ProgramTimeline, ProgramRequirements, ProgramApplication, ProgramTuitionFees } from "../../components/program/ProgramSections";
import { getProgramMajors } from "../../data/mockMajors";

export default function UniversityProgramDetailsPreview({ backPath = "/admin/programs" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { program, loading, error } = useProgram(id);

  const handleApply = (type, payload) => {
     if (type === 'link') {
       window.open(payload, '_blank');
     } else if (type === 'file') {
       const link = document.createElement('a');
       // If it's a URL string (e.g. from DB)
       if (typeof payload === 'string') {
          link.href = payload;
          link.download = payload.split('/').pop();
       } else if (payload instanceof File || payload instanceof Blob) {
          // If it's a File object (e.g. newly uploaded in preview)
          link.href = URL.createObjectURL(payload);
          link.download = payload.name;
       } else {
          console.error("Unknown payload type", payload);
          return;
       }
       
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
     } else if (type === 'submit') {
          // payload here is the applicationFile object from the button click
          navigate(`/dashboard/applications/submit/${id}`, { 
            state: { 
               programId: id,
               prefilledFile: payload // Pass file metadata 
            } 
          });
      }
  };

  if (loading) {
    return (
        <div className="flex h-64 items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (error || !program) {
    return (
        <div className="flex flex-col h-64 items-center justify-center gap-4">
            <p className="text-slate-500">Program not found or failed to load.</p>
            <button
              onClick={() => navigate(backPath)}
              className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Go Back
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(backPath)}
          className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-700 transition-all border border-transparent hover:border-slate-200"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-2xl font-serif text-slate-900 tracking-tight">Program Preview</h1>
           <p className="text-sm text-slate-500">Previewing how students see this program</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Program Hero */}
        <div className="relative overflow-hidden border-b border-slate-200">
          {/* Subtle gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 pointer-events-none" />

          <div className="relative p-8 text-center">
            {/* Visa badge — top right */}
            <div className="absolute top-5 right-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm shadow-blue-200">
                {program.visaType}
              </span>
            </div>

            {/* Logo */}
            <div className="w-24 h-24 mx-auto mb-5 bg-white rounded-2xl p-2.5 border border-slate-100 shadow-md flex items-center justify-center">
              <img
                src={program.logo || 'https://placehold.co/80x80?text=Logo'}
                alt={program.universityName}
                className="max-w-full max-h-full object-contain"
                onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=Logo'; }}
              />
            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{program.universityName}</h2>

            {/* Location + Country pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
              {program.location && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1116 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {program.location}
                </span>
              )}
              {program.country && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  {program.country}
                </span>
              )}
            </div>

            {/* Tags */}
            {program.tags && program.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {program.tags.map((tag) => (
                  <span key={tag} className="text-xs font-semibold text-blue-700 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-sm">
              {program.description}
            </p>
          </div>
        </div>

        {/* Content Tables */}
        <div className="p-6 sm:p-8 space-y-10">
            <ProgramDepartments departments={
              program.departments?.length
                ? program.departments
                : getProgramMajors(program.id)
            } />
            <ProgramTimeline timeline={program.timeline} />
            <ProgramTuitionFees tuitionFees={program.tuitionFees} />
            <ProgramRequirements documents={program.requiredDocuments} />

            <ProgramApplication 
               applicationLink={program.applicationLink} 
               applicationFile={program.applicationFile}
               onApply={handleApply}
            />
        </div>
      </div>
    </div>
  );
}
