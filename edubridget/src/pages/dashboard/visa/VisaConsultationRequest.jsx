import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  ChevronRight,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Select } from '@/components/ui/select'; // Assuming this exists or using standard for now
import { Label } from '@/components/ui/label';

export default function VisaConsultationRequest() {
  const [formData, setFormData] = useState({
      clientName: '',
      email: '',
      phone: '',
      destination: '',
      visaType: '',
      appointmentDate: '',
      appointmentType: 'Video Call',
      notes: ''
  });

  const countries = [
    { value: 'Canada', label: 'Canada' },
    { value: 'USA', label: 'USA' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'Australia', label: 'Australia' },
  ];

  const visaTypes = [
    { value: 'Student', label: 'Student Visa' },
    { value: 'Tourist', label: 'Tourist Visa' },
    { value: 'Work', label: 'Work Visa' },
  ];

  const appointmentTypes = [
    { value: 'Select Appointment Type', label: 'Select Appointment Type' },
    { value: 'Phone Call', label: 'Phone Call' },
    { value: 'Video Call', label: 'Video Call' },
    { value: 'In Person', label: 'In Person' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
         <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText size={24} />
         </div>
         <div>
            <h1 className="text-2xl font-bold text-slate-800">Visa Consultation Request</h1>
            <p className="text-slate-500 text-sm">Please fill out the form below to request a visa consultation.</p>
         </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-2.5 text-slate-400" />
                <Input 
                   id="clientName" 
                   name="clientName" 
                   placeholder="John Doe" 
                   className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-2.5 text-slate-400" />
                <Input 
                   id="email" 
                   name="email" 
                   type="email" 
                   placeholder="john.doe@example.com" 
                   className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-2.5 text-slate-400" />
                <Input 
                   id="phone" 
                   name="phone" 
                   type="tel" 
                   placeholder="+1 (555) 000-0000" 
                   className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Destination Country */}
            <div className="space-y-2">
              <Label htmlFor="destination">Destination Country</Label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-2.5 text-slate-400 z-10" />
                <select 
                   id="destination" 
                   name="destination" 
                   className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-white h-10 appearance-none"
                >
                   <option value="" disabled selected>Select Country</option>
                   {countries.map((country) => (
                     <option key={country.value} value={country.value}>
                       {country.label}
                     </option>
                   ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                    <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>

             {/* Visa Type */}
             <div className="space-y-2">
              <Label htmlFor="visaType">Visa Type</Label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-2.5 text-slate-400 z-10" />
                <select 
                   id="visaType" 
                   name="visaType" 
                   className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-white h-10 appearance-none"
                >
                   <option value="" disabled selected>Select Visa Type</option>
                   {visaTypes.map((visaType) => (
                     <option key={visaType.value} value={visaType.value}>
                       {visaType.label}
                     </option>
                   ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                    <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>

             {/* Appointment Date */}
             <div className="space-y-2">
              <Label htmlFor="appointmentDate">Appointment Date</Label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-2.5 text-slate-400" />
                <Input 
                   id="appointmentDate" 
                   name="appointmentDate" 
                   type="date"
                   className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>
            </div>
             
             {/* Appointment Type */}
             <div className="space-y-2">
              <Label htmlFor="appointmentType">Appointment Type</Label>
              <div className="relative">
                <select 
                   id="appointmentType" 
                   name="appointmentType" 
                   className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-white h-10 appearance-none"
                >
                   {appointmentTypes.map((appointmentType) => (
                     <option key={appointmentType.value} value={appointmentType.value}>
                       {appointmentType.label}
                     </option>
                   ))}
                </select>
                 <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                    <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Specific Requests</Label>
            <textarea 
                id="notes" 
                name="notes" 
                rows={4}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-white transition-colors"
                placeholder="Add any additional notes or specific questions..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
             <Button variant="outline" type="button" className="w-32">Cancel</Button>
             <Button type="submit" className="w-40 bg-slate-900 hover:bg-slate-800">Submit Request</Button>
          </div>

        </form>
      </div>
      
      <p className="text-center text-xs text-slate-400">© 2026 EduBridge. All rights reserved.</p>

    </div>
  );
}
