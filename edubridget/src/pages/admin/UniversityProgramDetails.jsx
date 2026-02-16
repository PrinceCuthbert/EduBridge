import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_PROGRAMS } from "../../data/mockData";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function UniversityProgramDetails({ backPath = "/admin/programs" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      const found = MOCK_PROGRAMS.find((p) => p.id === parseInt(id));
      setProgram(found);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading details...</div>;
  }

  if (!program) {
    return <div className="p-8 text-center text-slate-500">Program not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(backPath)}
          className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-700 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-2xl font-serif text-slate-900 tracking-tight">Program Preview</h1>
           <p className="text-sm text-slate-500">Previewing how students see this program</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Program Header */}
        <div className="p-8 text-center border-b border-slate-200 relative bg-slate-50/50">
           <div className="absolute top-6 right-6">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {program.visaType}
              </Badge>
           </div>
           
           <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-xl p-2 border border-slate-100 shadow-sm">
             <img src={program.logo} alt={program.universityName} className="w-full h-full object-contain" />
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
            {/* Departments */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                Departments and Majors
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:gap-px bg-slate-200">
                  {program.departments.map((dept, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                      {dept}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                Application Schedule Steps & Timeline
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-700">
                        Step
                      </th>
                      <th className="px-4 py-3 font-semibold text-slate-700 w-1/3">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {program.timeline.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600">
                          {item.step}
                        </td>
                        <td className="px-4 py-3 text-slate-900 font-medium">
                          {item.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Required Documents */}
            {program.requiredDocuments && (
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Required Documents
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200">
                    {program.requiredDocuments.map((doc, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 text-sm text-slate-600 flex items-start gap-2">
                        <CheckCircle
                          size={16}
                          className="text-emerald-500 mt-0.5 shrink-0"
                        />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
        </div>
      </div>
    </div>
  );
}
