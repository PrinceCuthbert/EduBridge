import React from 'react';
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileMoneyForm({ amount, onSubmit }) {
  return (
    <div className="space-y-5 mt-4">
      <div className="space-y-3">
        <select defaultValue="" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white">
          <option value="" disabled>Select Provider</option>
          <option value="mtn">MTN Mobile Money</option>
          <option value="airtel">Airtel Money</option>
          <option value="mpesa">M-Pesa</option>
        </select>
        <input
          placeholder="Phone Number (e.g. +256...)"
          type="tel"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <Button onClick={onSubmit} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-10">
        Pay ${amount}
      </Button>

      <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
        <ShieldCheck size={14} />
        Secure payment processing
      </p>
    </div>
  );
}
