import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProgram } from "../../hooks/usePrograms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProgramDepartments, ProgramTimeline, ProgramRequirements } from "../../components/program/ProgramSections";

export default function UniversityProgramDetails({ backPath = "/admin/programs" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { program, loading, error } = useProgram(id);

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
             <Button variant="outline" onClick={() => navigate(backPath)}>
                Go Back
             </Button>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(backPath)}
          className="text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
           <h1 className="text-2xl font-serif text-slate-900 tracking-tight">Program Preview</h1>
           <p className="text-sm text-slate-500">Previewing how students see this program</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Program Header */}
        <div className="p-8 text-center border-b border-slate-200 relative bg-slate-50/50">
           <div className="absolute top-6 right-6">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                {program.visaType}
              </Badge>
           </div>
           
           <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-xl p-2 border border-slate-100 shadow-sm flex items-center justify-center">
             <img src={program.logo} alt={program.universityName} className="max-w-full max-h-full object-contain" />
           </div>
           
           <h2 className="text-2xl font-bold text-slate-900 mb-2">{program.universityName}</h2>
           <p className="text-emerald-600 font-bold mb-4">{program.tuition}</p>
           
           <div className="flex flex-wrap justify-center gap-2 mb-6">
              {program.tags.map((tag) => (
                <span key={tag} className="text-xs font-bold text-slate-600 px-2 py-1 bg-white border border-slate-200 rounded-full">
                  {tag}
                </span>
              ))}
           </div>
           
           <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-sm">
             {program.description}
           </p>
        </div>

        {/* Content Tables */}
        <div className="p-6 sm:p-8 space-y-10">
            <ProgramDepartments departments={program.departments} />
            <ProgramTimeline timeline={program.timeline} />
            <ProgramRequirements documents={program.requiredDocuments} />
        </div>
      </div>
    </div>
  );
}
