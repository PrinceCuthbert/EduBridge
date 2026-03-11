import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Copy,
  CheckCircle2,
  Phone,
  Globe,
  Hash,
  Landmark,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * PaymentMethodsPage
 * Displays EduBridge's bank details for consultation fee payment.
 * Receives requestPayload from VisaConsultationRequest via router state.
 *
 * Route: /dashboard/visa-status/payment-methods
 */

const BANKS = [
  {
    id: 'bk',
    flag: '🇷🇼',
    country: 'Rwanda',
    bankName: 'Bank of Kigali (BK)',
    color: 'from-blue-600 to-blue-800',
    accent: 'blue',
    fields: [
      { icon: Landmark,  label: 'Bank',              value: 'Bank of Kigali' },
      { icon: MapPin,    label: 'Branch',             value: 'Kigali' },
      { icon: Globe,     label: 'SWIFT Code',         value: 'BKIGRWRWXXX', copy: true },
      { icon: Hash,      label: 'Beneficiary Name',   value: 'TM MONEY GROUP LTD' },
    ],
    subSections: [
      {
        title: 'Payments in Rwandan Francs (RWF)',
        fields: [
          { label: 'Account Number', value: '100085798361 (RWF)', copy: true },
          { label: 'Account Holder', value: 'TM MONEY GROUP LTD' },
        ],
      },
      {
        title: 'Mobile Money',
        fields: [
          { label: 'Phone',  value: '+250 0796 105 200', copy: true },
          { label: 'Holder', value: 'NIYIGENA Adolphe (CEO)' },
        ],
      },
    ],
  },
  {
    id: 'equity',
    flag: '🇷🇼',
    country: 'Rwanda',
    bankName: 'Equity Bank Rwanda',
    color: 'from-emerald-600 to-emerald-800',
    accent: 'emerald',
    fields: [
      { icon: Landmark, label: 'Bank',           value: 'Equity Bank Rwanda' },
      { icon: Globe,    label: 'SWIFT Code',     value: 'EQBLRWRW', copy: true },
      { icon: Hash,     label: 'Currency',       value: 'RWF' },
      { icon: Hash,     label: 'Account Number', value: '4016201022531', copy: true },
      { icon: Hash,     label: 'Account Name',   value: 'NIYIGENA ADOLPHE' },
    ],
    subSections: [],
  },
  {
    id: 'woori',
    flag: '🇰🇷',
    country: 'South Korea',
    bankName: 'Woori Bank',
    color: 'from-violet-600 to-violet-800',
    accent: 'violet',
    fields: [
      { icon: Landmark, label: 'Bank Name',       value: 'Woori Bank' },
      { icon: Hash,     label: 'Account Holder',  value: 'NIYIGENA ADOLPHE' },
      { icon: Hash,     label: 'Account Number',  value: '1002152136111', copy: true },
      { icon: Globe,    label: 'SWIFT / BIC Code',value: 'HVBKKRSE', copy: true },
    ],
    subSections: [
      {
        title: 'Bank Address',
        fields: [
          { label: 'Address', value: 'Woori Bank Head Office, 158, Hoehyeon-dong 1-ga, Jung-gu, Seoul, Republic of Korea' },
        ],
      },
    ],
  },
];

// MapPin workaround — lucide's MapPin used inline
function MapPin(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

const ACCENT_STYLES = {
  blue:    { badge: 'bg-blue-100 text-blue-700',    copy: 'hover:text-blue-600 hover:bg-blue-50',   divider: 'border-blue-100',  subtitleBg: 'bg-blue-50',    subtitleText: 'text-blue-700'   },
  emerald: { badge: 'bg-emerald-100 text-emerald-700', copy: 'hover:text-emerald-600 hover:bg-emerald-50', divider: 'border-emerald-100', subtitleBg: 'bg-emerald-50', subtitleText: 'text-emerald-700' },
  violet:  { badge: 'bg-violet-100 text-violet-700',  copy: 'hover:text-violet-600 hover:bg-violet-50',  divider: 'border-violet-100',  subtitleBg: 'bg-violet-50',  subtitleText: 'text-violet-700'  },
};

function CopyButton({ value, accent }) {
  const [copied, setCopied] = React.useState(false);
  const style = ACCENT_STYLES[accent];

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      toast.success(`Copied: ${value}`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      className={`ml-2 p-1 rounded transition-colors text-slate-300 ${style.copy}`}
    >
      {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
    </button>
  );
}

function BankCard({ bank }) {
  const style = ACCENT_STYLES[bank.accent];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Card header gradient */}
      <div className={`bg-gradient-to-br ${bank.color} p-5`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{bank.flag}</span>
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-widest">{bank.country}</p>
            <h3 className="text-white font-bold text-base leading-tight">{bank.bankName}</h3>
          </div>
        </div>
      </div>

      {/* Main fields */}
      <div className="p-5 space-y-3 flex-1">
        {bank.fields.map((field, i) => {
          const Icon = field.icon;
          return (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={14} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</p>
                <div className="flex items-center">
                  <p className="text-sm font-semibold text-slate-900 break-all">{field.value}</p>
                  {field.copy && <CopyButton value={field.value} accent={bank.accent} />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Sub-sections */}
        {bank.subSections.map((section, si) => (
          <div key={si} className={`mt-4 pt-4 border-t ${style.divider}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 px-2 py-1 rounded-md inline-block ${style.subtitleBg} ${style.subtitleText}`}>
              {section.title}
            </p>
            <div className="space-y-2.5">
              {section.fields.map((field, fi) => (
                <div key={fi}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</p>
                  <div className="flex items-start">
                    <p className="text-sm font-semibold text-slate-900 leading-snug">{field.value}</p>
                    {field.copy && <CopyButton value={field.value} accent={bank.accent} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PaymentMethodsPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const payload   = location.state; // requestPayload from VisaConsultationRequest

  const fee = payload?.fee ?? null;
  const visaType = payload?.visaType ?? null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* ── Top nav ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Bank Details</h1>
          <p className="text-slate-500 text-sm">Transfer your consultation fee to any of the accounts below.</p>
        </div>
      </div>

      {/* ── EduBridge fee notice ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 shadow-xl">
        {/* decorative ring */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-[30px] border-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border-[20px] border-white/5 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* EduBridge Logo placeholder */}
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white font-black text-lg tracking-tight border border-white/20">
              EB
            </div>
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-widest">EduBridge</p>
              <p className="text-white font-bold text-lg leading-tight">Consultation Fee</p>
              {visaType && (
                <p className="text-white/60 text-xs mt-0.5">{visaType} Visa Consultation</p>
              )}
            </div>
          </div>

          {fee !== null ? (
            <div className="text-right">
              <p className="text-white/50 text-xs uppercase tracking-wider font-medium">Amount Due</p>
              <p className="text-3xl font-black text-white">${fee}<span className="text-base font-semibold text-white/60"> USD</span></p>
            </div>
          ) : (
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-center">
              <p className="text-white/70 text-xs uppercase tracking-wider">Fee varies by visa type</p>
              <p className="text-white font-bold text-sm mt-0.5">Student: $150 · Work: $200 · Other: $100</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Important instructions ── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Building2 size={15} className="text-amber-600" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-amber-800">Before Making Your Transfer</p>
            <ul className="text-xs text-amber-700 space-y-1 leading-relaxed list-disc list-inside">
              <li>Use your <strong>full name</strong> as the payment reference / narration.</li>
              <li>Keep your transfer receipt — you'll need to upload it as proof.</li>
              <li>Payments typically reflect within <strong>1–3 business days</strong>.</li>
              <li>Contact support at <strong>support@edubridge.africa</strong> if you face issues.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bank cards ── */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Choose a Payment Option</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {BANKS.map(bank => <BankCard key={bank.id} bank={bank} />)}
        </div>
      </div>

      {/* ── Image fallback — original payment methods image ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Official Payment Reference Sheet</p>
          <a
            href="/paymentMethods.png"
            download="EduBridge-PaymentMethods.png"
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <Download size={13} /> Download
          </a>
        </div>
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <img
            src="/paymentMethods.png"
            alt="EduBridge Payment Bank Details"
            className="w-full h-auto object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <p className="text-center text-xs text-slate-400">
        © 2026 EduBridge. All rights reserved. · support@edubridge.africa
      </p>
    </div>
  );
}
