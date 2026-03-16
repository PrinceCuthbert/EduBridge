// ─────────────────────────────────────────────────────────────
//  src/pages/dashboard/VisaRequestForm.jsx
//
//  WHY THIS FILE EXISTS:
//  Mirrors ApplicationSubmitForm.jsx.
//  Uses useVisaConsultations hook to submit a new request.
// ─────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ChevronDown,
  Video,
  ArrowLeft,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useVisaConsultations } from "@/hooks/useVisaConsultations";
import { VISA_TYPES, VISA_COUNTRIES, MEETING_TYPES } from "@/data/mockVisaData";
import { useAuth } from "@/context/AuthContext";

export default function VisaRequestForm() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { submitRequest } = useVisaConsultations(user?.id);

  const [formData, setFormData] = useState({
    fullName: user?.identity ? `${user.identity.firstName} ${user.identity.lastName}` : "",
    email: user?.email || "",
    phone: user?.identity?.phone || "",
    countryOfOrigin: user?.identity?.nationality || "",
    destination: "",
    countryCode: "",
    visaType: "",
    preferredDate: "",
    meetingType: "Video Call",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "destination") {
      const country = VISA_COUNTRIES.find((c) => c.name === value);
      setFormData((prev) => ({
        ...prev,
        destination: value,
        countryCode: country?.code ?? "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitRequest(formData);
      toast.success("Consultation request submitted! Please complete your payment.");
      navigate("/dashboard/visa-status/payment-methods", {
        state: { visaType: formData.visaType },
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Standard input styles for consistency
  const inputClassName = "w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400";
  const selectClassName = "w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer";
  const labelClassName = "block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5 ml-1";
  const iconClassName = "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400";

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex items-center gap-4">
         <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-all"
         >
            <ArrowLeft size={20} />
         </button>
         <div>
            <h1 className="text-2xl font-serif text-slate-900 tracking-tight">Request Consultation</h1>
            <p className="text-slate-500 text-sm">Schedule a session with our visa experts.</p>
         </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="fullName" className={labelClassName}>Full Name</label>
              <div className="relative">
                <User size={16} className={iconClassName} />
                <input 
                   id="fullName" 
                   name="fullName" 
                   value={formData.fullName}
                   onChange={handleChange}
                   placeholder="John Doe" 
                   className={inputClassName}
                   required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className={labelClassName}>Email Address</label>
              <div className="relative">
                <Mail size={16} className={iconClassName} />
                <input 
                   id="email" 
                   name="email" 
                   type="email" 
                   value={formData.email}
                   onChange={handleChange}
                   placeholder="john@example.com" 
                   className={inputClassName}
                   required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label htmlFor="phone" className={labelClassName}>Phone Number</label>
              <div className="relative">
                <Phone size={16} className={iconClassName} />
                <input 
                   id="phone" 
                   name="phone" 
                   type="tel" 
                   value={formData.phone}
                   onChange={handleChange}
                   placeholder="+254..." 
                   className={inputClassName}
                />
              </div>
            </div>

            {/* Country of Origin */}
            <div className="space-y-1">
              <label htmlFor="countryOfOrigin" className={labelClassName}>Country of Origin</label>
              <div className="relative">
                <Globe size={16} className={iconClassName} />
                <input 
                   id="countryOfOrigin" 
                   name="countryOfOrigin" 
                   value={formData.countryOfOrigin}
                   onChange={handleChange}
                   placeholder="e.g. Kenya" 
                   className={inputClassName}
                   required
                />
              </div>
            </div>

            {/* Destination Country */}
            <div className="space-y-1">
              <label htmlFor="destination" className={labelClassName}>Destination</label>
              <div className="relative">
                <MapPin size={16} className={iconClassName} />
                <select 
                   id="destination" 
                   name="destination" 
                   value={formData.destination}
                   onChange={handleChange}
                   className={selectClassName}
                   required
                >
                   <option value="" disabled>Select Country</option>
                   {VISA_COUNTRIES.map((c) => (
                     <option key={c.code} value={c.name}>
                       {c.name}
                     </option>
                   ))}
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>

             {/* Visa Type */}
             <div className="space-y-1">
              <label htmlFor="visaType" className={labelClassName}>Visa Type</label>
              <div className="relative">
                <FileText size={16} className={iconClassName} />
                <select 
                   id="visaType" 
                   name="visaType" 
                   value={formData.visaType}
                   onChange={handleChange}
                   className={selectClassName}
                   required
                >
                   <option value="" disabled>Select Visa Type</option>
                   {VISA_TYPES.map((t) => (
                     <option key={t} value={t}>
                       {t}
                     </option>
                   ))}
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>

             {/* Preferred Date */}
             <div className="space-y-1">
              <label htmlFor="preferredDate" className={labelClassName}>Preferred Date</label>
              <div className="relative">
                <Calendar size={16} className={iconClassName} />
                <input 
                   id="preferredDate" 
                   name="preferredDate" 
                   type="date"
                   value={formData.preferredDate}
                   onChange={handleChange}
                   className={inputClassName}
                   required
                />
              </div>
            </div>
             
             {/* Meeting Format */}
             <div className="space-y-1">
              <label htmlFor="meetingType" className={labelClassName}>Meeting Format</label>
              <div className="relative">
                <Video size={16} className={iconClassName} />
                <select 
                   id="meetingType" 
                   name="meetingType" 
                   value={formData.meetingType}
                   onChange={handleChange}
                   className={selectClassName}
                >
                   {MEETING_TYPES.map((type) => (
                     <option key={type} value={type}>
                       {type}
                     </option>
                   ))}
                </select>
                 <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label htmlFor="notes" className={labelClassName}>Specific Questions / Notes</label>
            <textarea 
                id="notes" 
                name="notes" 
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none"
                placeholder="Describe your current situation or specific questions..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
             <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 h-auto text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-lg text-sm font-medium"
             >
                Cancel
             </Button>
             <Button 
                type="submit" 
                className="px-6 py-2.5 h-auto bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium shadow-sm"
             >
                Submit Request
             </Button>
          </div>

        </form>
      </div>
      
      <p className="text-center text-xs text-slate-400">© 2026 EduBridge. All rights reserved.</p>

    </div>
  );
}
