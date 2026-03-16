import React from 'react';
import { CheckCircle, Download, ExternalLink, FileText, GraduationCap, CalendarDays, Banknote, ClipboardList } from 'lucide-react';

// ─── Utility ─────────────────────────────────────────────────────────────────
const fmt = (d) => {
  if (!d || d === '—' || d === '-') return '—';
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2.5 mb-1">
      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-blue-600" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
    </div>
    {subtitle && (
      <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase ml-9">{subtitle}</p>
    )}
  </div>
);

// ─── Departments & Majors ────────────────────────────────────────────────────
export function ProgramDepartments({ departments }) {
  if (!departments || departments.length === 0) return null;

  return (
    <section>
      <SectionHeader
        icon={GraduationCap}
        title="Departments and Majors"
        subtitle="Language Track · Degree · Major · Duration & Credits · Language Requirement"
      />

      {/* Desktop table */}
      <div className="hidden md:block border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-28">Language</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-20">Degree</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Major / Program</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-48">Duration</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-44">Lang. Req.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departments.map((dept, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    dept.language === 'Korean'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : dept.language === 'French'
                      ? 'bg-purple-50 text-purple-700 border border-purple-100'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {dept.language}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm font-semibold text-slate-700">{dept.degree}</td>
                <td className="px-4 py-3.5 text-sm font-medium text-slate-900">{dept.major ?? dept.name}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500 leading-snug">
                  {dept.duration}
                  {dept.credits && <span className="block text-xs text-slate-400 mt-0.5">{dept.credits}</span>}
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-600">{dept.languageRequirement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card stack */}
      <div className="md:hidden space-y-3">
        {departments.map((dept, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${
                dept.language === 'Korean' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
              }`}>{dept.language}</span>
              <span className="text-xs font-semibold text-slate-500">{dept.degree}</span>
            </div>
            <p className="font-semibold text-slate-900">{dept.major ?? dept.name}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
              <div>
                <span className="block font-medium text-slate-400 uppercase tracking-wider text-[10px] mb-0.5">Duration</span>
                {dept.duration}{dept.credits ? ` — ${dept.credits}` : ''}
              </div>
              <div>
                <span className="block font-medium text-slate-400 uppercase tracking-wider text-[10px] mb-0.5">Language</span>
                {dept.languageRequirement}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Application Schedule & Timeline ────────────────────────────────────────
export function ProgramTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <section>
      <SectionHeader
        icon={CalendarDays}
        title="Application Schedule & Timeline"
        subtitle="Stage · Registration Period · Exam / Review · Result Announcement"
      />

      {/* Desktop */}
      <div className="hidden md:block border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-32">Stage</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Registration Period</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-36">Exam / Review</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-36">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {timeline.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-800">{item.stage}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-600">
                  {item.registrationStart || item.registrationEnd ? (
                    <span>
                      {fmt(item.registrationStart)}
                      {item.registrationEnd && item.registrationStart !== item.registrationEnd && (
                        <> &rarr; {fmt(item.registrationEnd)}</>
                      )}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-600">{fmt(item.examDate)}</td>
                <td className="px-4 py-3.5 text-sm font-semibold text-slate-900">{fmt(item.resultDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {timeline.map((item, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-900">{item.stage}</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs uppercase font-medium tracking-wider self-center">Registration</span>
                <span className="text-slate-700 font-medium text-right">
                  {fmt(item.registrationStart)}{item.registrationEnd ? ` → ${fmt(item.registrationEnd)}` : ''}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-400 text-xs uppercase font-medium tracking-wider self-center">Exam</span>
                <span className="text-slate-700 font-medium">{fmt(item.examDate)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-400 text-xs uppercase font-medium tracking-wider self-center">Result</span>
                <span className="text-slate-900 font-bold">{fmt(item.resultDate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Tuition Fees ────────────────────────────────────────────────────────────
export function ProgramTuitionFees({ tuitionFees }) {
  if (!tuitionFees || tuitionFees.length === 0) return null;

  // Group by level
  const grouped = tuitionFees.reduce((acc, row) => {
    if (!acc[row.level]) acc[row.level] = [];
    acc[row.level].push(row);
    return acc;
  }, {});

  return (
    <section>
      <SectionHeader icon={Banknote} title="Tuition Fees" />

      <div className="space-y-3">
        {Object.entries(grouped).map(([level, rows]) => (
          <div key={level} className="border border-slate-200 rounded-xl overflow-hidden">
            {/* Level badge header */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <GraduationCap size={12} className="text-blue-500" />
                {level}
              </span>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-600">{row.item}</td>
                    <td className="px-4 py-3 text-slate-900 font-bold text-right tabular-nums">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Required Documents ───────────────────────────────────────────────────────
export function ProgramRequirements({ documents }) {
  if (!documents || documents.length === 0) return null;

  return (
    <section>
      <SectionHeader icon={ClipboardList} title="Required Documents" />

      <div className="space-y-3">
        {documents.map((group, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
            {/* Category header */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {group.category || 'General'}
              </span>
            </div>
            {/* Items */}
            <ul className="divide-y divide-slate-50">
              {(group.items || []).map((doc, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50/60 transition-colors"
                >
                  <CheckCircle size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Application Method ───────────────────────────────────────────────────────
export function ProgramApplication({ applicationLink, applicationFile, onApply }) {
  if (!applicationLink && !applicationFile) return null;

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100 p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
          <FileText size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Application Method</h3>
          <p className="text-slate-500 text-sm mt-0.5">
            Please review all requirements above before submitting your application.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {applicationLink && (
          <button
            onClick={() => onApply('link', applicationLink)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-blue-200 active:scale-95"
          >
            <ExternalLink size={16} />
            Apply Online
          </button>
        )}

        {applicationFile && (
          <>
            <button
              onClick={() => onApply('file', applicationFile)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200 rounded-lg transition-colors shadow-sm active:scale-95"
            >
              <Download size={16} className="text-blue-600" />
              Download Form
            </button>

            <button
              onClick={() => onApply('submit', applicationFile)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-emerald-200 active:scale-95"
            >
              <FileText size={16} />
              Submit Documents
            </button>
          </>
        )}
      </div>
    </section>
  );
}
