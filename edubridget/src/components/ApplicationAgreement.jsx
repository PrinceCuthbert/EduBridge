import React, { useState } from 'react';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * ApplicationAgreement — Priority 6 / APPLICATION_AGREEMENT entity
 * Schema: APPLICATION_AGREEMENT { id, application_id, pg (page/section agreed to) }
 *
 * This component renders a terms & conditions acknowledgment step
 * in the application submission form. When the student checks all boxes,
 * `onAgreementComplete(true)` is called to unlock the submit button.
 *
 * Backend: POST /api/applications/:id/agreement { agreed_sections: ['terms', 'accuracy', 'documents'] }
 *
 * Usage:
 *   <ApplicationAgreement onAgreementComplete={(agreed) => setCanSubmit(agreed)} />
 */
export default function ApplicationAgreement({ onAgreementComplete }) {
  const AGREEMENT_SECTIONS = [
    {
      id: 'terms',
      pg: 'terms-and-conditions',        // APPLICATION_AGREEMENT.pg
      label: 'Terms & Conditions',
      text: 'I have read and agree to EduBridge\'s Terms and Conditions, including the application processing policy and privacy statement.',
    },
    {
      id: 'accuracy',
      pg: 'information-accuracy',
      label: 'Information Accuracy',
      text: 'I confirm that all information provided in this application is accurate and complete. I understand that false information may result in disqualification.',
    },
    {
      id: 'documents',
      pg: 'document-authenticity',
      label: 'Document Authenticity',
      text: 'I certify that all documents submitted are authentic originals or certified copies. I accept that fraudulent documents will lead to immediate rejection.',
    },
  ];

  const [agreed, setAgreed] = useState({});

  const toggle = (id) => {
    const updated = { ...agreed, [id]: !agreed[id] };
    setAgreed(updated);
    const allAgreed = AGREEMENT_SECTIONS.every(s => updated[s.id]);
    onAgreementComplete?.(allAgreed);
  };

  const allAgreed = AGREEMENT_SECTIONS.every(s => agreed[s.id]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <FileText size={18} className="text-blue-600" />
        <h3 className="text-base font-semibold text-slate-900">Application Agreement</h3>
      </div>
      <p className="text-sm text-slate-500 -mt-2">
        Please read and accept all sections before submitting your application.
      </p>

      {/* Agreement checkboxes — each maps to APPLICATION_AGREEMENT.pg */}
      <div className="space-y-3">
        {AGREEMENT_SECTIONS.map((section) => (
          <label
            key={section.id}
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              agreed[section.id]
                ? 'bg-blue-50 border-blue-200'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="checkbox"
              checked={!!agreed[section.id]}
              onChange={() => toggle(section.id)}
              className="mt-0.5 accent-blue-600 w-4 h-4 shrink-0"
            />
            <div>
              <p className={`text-sm font-semibold mb-0.5 ${agreed[section.id] ? 'text-blue-800' : 'text-slate-700'}`}>
                {section.label}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">{section.text}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Status indicator */}
      <div className={`flex items-center gap-2 text-sm font-medium p-3 rounded-lg ${
        allAgreed ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
      }`}>
        {allAgreed
          ? <><CheckCircle2 size={16} /> All agreements accepted — you may submit</>
          : <><AlertCircle size={16} /> Please accept all agreements to continue</>}
      </div>
    </div>
  );
}
