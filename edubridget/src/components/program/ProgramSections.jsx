import React from 'react';
import { CheckCircle, Download, ExternalLink, FileText } from 'lucide-react'; // Added icons

export function ProgramDepartments({ departments }) {
  if (!departments || departments.length === 0) return null;
  
  return (
    <section>
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        Departments and Majors
      </h3>
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:gap-px bg-slate-200">
          {departments.map((dept, idx) => (
            <div
              key={idx}
              className="bg-white p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              {dept}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProgramTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <section>
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        Application Schedule Steps & Timeline
      </h3>
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-700">Step</th>
              <th className="px-4 py-3 font-semibold text-slate-700 w-1/3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {timeline.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-600">{item.step}</td>
                <td className="px-4 py-3 text-slate-900 font-medium">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ProgramRequirements({ documents }) {
  if (!documents || documents.length === 0) return null;

  return (
    <section>
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        Required Documents
      </h3>
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200">
          {documents.map((doc, idx) => (
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
  );
}

export function ProgramApplication({ applicationLink, applicationFile, onApply }) {
  if (!applicationLink && !applicationFile) return null;

  return (
    <section className="bg-blue-50/50 rounded-xl border border-blue-100 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Application Method
      </h3>
      <p className="text-slate-600 text-sm mb-4">
        Please review the application requirements above before proceeding.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {applicationLink && (
          <button
            onClick={() => onApply('link', applicationLink)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm active:scale-95"
          >
            <ExternalLink size={18} />
            <span>Apply Online</span>
          </button>
        )}

        {applicationFile && (
          <>
            <button
              onClick={() => onApply('file', applicationFile)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium rounded-lg transition-colors shadow-sm active:scale-95"
            >
              <Download size={18} className="text-blue-600" />
              <span>Download Application Form</span>
            </button>
            
            <button
              onClick={() => onApply('submit', applicationFile)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-sm active:scale-95"
            >
              <FileText size={18} />
              <span>Submit Documents</span>
            </button>
          </>
        )}
      </div>
      
      {applicationFile && (
         <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <FileText size={14} />
            <span>
               File available: {applicationFile.name || 'Application Form'} 
               {applicationFile.size ? ` (${(applicationFile.size / 1024).toFixed(1)} KB)` : ''}
            </span>
         </div>
      )}
    </section>
  );
}



