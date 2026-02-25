import React from 'react';

export default function PaymentSummaryCard({ requestData }) {
  const {
    clientName,
    destination,
    visaType,
    appointmentType,
    appointmentDate,
    fee
  } = requestData;

  const serviceFee = 10;
  const total = fee + serviceFee;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-lg font-serif text-slate-900">Consultation Summary</h2>
      
      <div className="space-y-3 text-sm">
        <Row label="Client Name" value={clientName || 'N/A'} />
        <Row label="Destination" value={destination || 'N/A'} />
        <Row label="Visa Type" value={visaType || 'N/A'} />
        <Row label="Meeting Type" value={appointmentType || 'N/A'} />
        <Row label="Appointment Date" value={appointmentDate || 'N/A'} />
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
        <Row label="Consultation Fee" value={`$${fee || 0}`} />
        <Row label="Service Fee" value={`$${serviceFee}`} />

        <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-slate-700">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
