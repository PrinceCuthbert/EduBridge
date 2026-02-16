import React from 'react';
import { CheckCircle } from 'lucide-react';

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
