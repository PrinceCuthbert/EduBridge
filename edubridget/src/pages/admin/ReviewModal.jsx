import React, { useState } from "react";
// ReviewModal Component - Premium Styling & Read-Only Application Data
import {
  X,
  FileText,
  Mail,
  PhoneCall,
  CheckCircle,
  Download,
  Save,
  MessageSquare,
  AlertCircle,
  Send,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function ReviewModal({ application, onClose, onSave }) {
  const [adminNote, setAdminNote] = useState("");
  const [studentFeedback, setStudentFeedback] = useState("");
  const [activeTab, setActiveTab] = useState("review");
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionMessage, setCorrectionMessage] = useState("");

  const handleRequestCorrection = () => {
    if (!correctionMessage.trim()) {
      toast.error("Please specify what needs to be fixed");
      return;
    }
    onSave(null, "Needs Changes", correctionMessage);
    setShowCorrectionModal(false);
  };

  const handleMarkQualified = () => {
    const message = studentFeedback.trim() || "Approved. Final processing starts now.";
    onSave(null, "Approved", message);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden relative z-10 animate-in zoom-in-95 duration-700 border border-white/20">
        
        {/* Header - Serif Typography */}
        <div className="px-12 py-10 border-b border-slate-100 flex items-center justify-between bg-white relative">
          <div className="flex items-center gap-6">
             <div className="relative group">
               <img 
                 src={`https://ui-avatars.com/api/?name=${application.studentName}&background=f1f5f9&color=6366f1`} 
                 className="w-16 h-16 rounded-2xl border border-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-105" 
                 alt={application.studentName}
               />
               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
               </div>
             </div>
             <div>
                <div className="flex items-center gap-4">
                   <h2 className="text-3xl font-serif text-[#0F172A] tracking-tight antialiased">{application.studentName}</h2>
                   <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-blue-100/50">
                      {application.id}
                   </span>
                </div>
                <div className="flex items-center gap-6 mt-2.5">
                   <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2 lowercase tracking-wide">
                      <Mail size={14} className="text-slate-300" />
                      {application.email}
                   </span>
                   <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2 tracking-wide">
                      <PhoneCall size={14} className="text-slate-300" />
                      {application.phone}
                   </span>
                </div>
             </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-4 hover:bg-slate-50 text-slate-300 hover:text-[#0F172A] rounded-2xl transition-all active:scale-90 group">
            <X size={28} className="transition-transform group-hover:rotate-90 duration-300" />
          </button>
        </div>

        {/* Dynamic Navigation */}
        <div className="bg-slate-50/40 px-12 border-b border-slate-100 flex items-center h-20 gap-12">
           <button
             onClick={() => setActiveTab("review")}
             className={`h-full px-1 text-[11px] font-bold uppercase tracking-[0.2em] relative transition-all ${activeTab === "review" ? "text-blue-600" : "text-slate-400 hover:text-slate-900"}`}>
             Application Data
             {activeTab === "review" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full animate-in slide-in-from-left duration-300" />
             )}
           </button>
           <button
             onClick={() => setActiveTab("documents")}
             className={`h-full px-1 text-[11px] font-bold uppercase tracking-[0.2em] relative transition-all ${activeTab === "documents" ? "text-blue-600" : "text-slate-400 hover:text-slate-900"}`}>
             Supporting Evidence
             <span className={`ml-3 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'documents' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>{application.documents.length}</span>
             {activeTab === "documents" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full animate-in slide-in-from-left duration-300" />
             )}
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
          
          <div className="flex-1 overflow-y-auto p-12 scrollbar-primary">
            {activeTab === "review" ? (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Form Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] px-1">Applicant Formal Name</label>
                    <div className="relative group">
                       <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <div className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-100 rounded-[2rem] text-[15px] font-bold text-[#0F172A] shadow-sm">
                          {application.studentName}
                       </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] px-1">Verified GPA Record</label>
                    <div className="relative group">
                       <div className="w-full px-8 py-5 bg-slate-50/50 border border-slate-100 rounded-[2rem] text-[15px] font-bold text-[#0F172A] shadow-sm font-mono flex items-center justify-between">
                          <span>{application.gpa}</span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Fixed Entry</span>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] px-1">Digital Correspondence</label>
                    <div className="relative group">
                       <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <div className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-100 rounded-[2rem] text-[15px] font-bold text-[#0F172A] shadow-sm font-mono lowercase">
                          {application.email}
                       </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] px-1">Direct Tele-Contact</label>
                    <div className="relative group">
                       <PhoneCall size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <div className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-100 rounded-[2rem] text-[15px] font-bold text-[#0F172A] shadow-sm">
                          {application.phone}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] px-1">Selected Scholarship Program</label>
                  <div className="px-8 py-6 bg-slate-50/80 border border-slate-100 rounded-[2rem] text-sm text-[#0F172A] font-bold flex items-center justify-between shadow-sm">
                     <span>{application.scholarship}</span>
                     <span className="text-[9px] px-3 py-1.5 bg-slate-200/50 text-slate-500 rounded-xl font-bold uppercase tracking-[0.15em] border border-slate-200/50">LOCKED RECORD</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {application.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group flex items-start gap-6 cursor-default">
                    <div className="w-16 h-16 bg-blue-50/50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-blue-50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <FileText size={32} />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="font-bold text-[#0F172A] text-base truncate mb-1.5 transition-colors group-hover:text-blue-600">
                        {doc}
                      </p>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official PDF</span>
                         <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                         <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle size={10} />
                            Verified
                         </span>
                      </div>
                    </div>
                    <button className="p-3.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-95 shadow-sm hover:shadow-md">
                      <Download size={24} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Sidebar - Premium Look */}
          <div className="w-full lg:w-[460px] flex flex-col bg-slate-50/40 border-l border-slate-100 shadow-inner">
             <div className="flex-1 overflow-y-auto p-12 space-y-12">
                {/* Ledger Notes */}
                <div className="space-y-5">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2.5">
                         <Save size={16} className="text-blue-500" />
                         Case Ledger Notes
                      </span>
                      <span className="px-2.5 py-1 bg-blue-50/80 text-blue-600 rounded-lg font-bold text-[8px] uppercase tracking-widest border border-blue-100/50">CONFIDENTIAL</span>
                   </div>
                   <textarea
                     className="w-full h-44 px-6 py-5 bg-white border border-slate-100 rounded-3xl text-[14px] font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 resize-none shadow-sm placeholder:text-slate-300 transition-all scrollbar-thin"
                     placeholder="Enter internal administrative notes..."
                     value={adminNote}
                     onChange={(e) => setAdminNote(e.target.value)}
                   />
                </div>

                {/* Feedback Transmission */}
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2.5">
                         <MessageSquare size={16} className="text-[#0F172A]" />
                         Feedback Transmission
                      </span>
                   </div>
                   <textarea
                     className="w-full h-52 px-6 py-5 bg-white border border-slate-100 rounded-3xl text-[14px] font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 resize-none shadow-sm placeholder:text-slate-300 transition-all scrollbar-thin"
                     placeholder="Instructions or feedback for the applicant..."
                     value={studentFeedback}
                     onChange={(e) => setStudentFeedback(e.target.value)}
                   />
                </div>
             </div>

             {/* Sticky Actions */}
             <div className="p-12 bg-white border-t border-slate-100 space-y-5">
                <button
                  onClick={handleMarkQualified}
                  className="w-full py-6 flex items-center justify-center gap-4 bg-[#0F172A] text-white rounded-[1.5rem] font-bold text-sm shadow-[0_20px_40px_-12px_rgba(15,23,42,0.3)] hover:bg-[#1E293B] hover:translate-y-[-2px] transition-all active:scale-95 group overflow-hidden relative">
                  <CheckCircle size={22} className="relative z-10 transition-transform group-hover:scale-110" />
                  <span className="relative z-10">Approve Application</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/5 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
                
                <button
                  onClick={() => setShowCorrectionModal(true)}
                  className="w-full py-5 flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-[#0F172A] rounded-[1.5rem] font-bold text-xs hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95 group">
                  <AlertCircle size={18} className="group-hover:rotate-12 transition-transform" />
                  Request Correction
                </button>
             </div>
          </div>
        </div>

        {/* Correction Feedback Sub-modal */}
        {showCorrectionModal && (
          <div className="absolute inset-0 z-[70] flex items-center justify-center p-12 bg-[#0F172A]/90 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl p-16 animate-in zoom-in-95 duration-700 border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10">
                  <button onClick={() => setShowCorrectionModal(false)} className="p-4 text-slate-300 hover:text-[#0F172A] hover:bg-slate-50 rounded-2xl transition-all">
                     <X size={28} />
                  </button>
               </div>
               
               <div className="w-20 h-20 rounded-[2rem] bg-amber-50 text-amber-500 flex items-center justify-center shadow-sm border border-amber-100 mb-10 mx-auto">
                  <AlertCircle size={40} className="animate-pulse" />
               </div>
               
               <div className="text-center space-y-3 mb-10">
                  <h3 className="text-3xl font-serif text-[#0F172A] tracking-tight antialiased">Action Required</h3>
                  <p className="text-[15px] font-bold text-slate-400 leading-relaxed max-w-sm mx-auto">The applicant will be formally notified to modify specific parameters of their submission.</p>
               </div>
               
               <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] block text-center">Correction Instructions</label>
                    <textarea
                      className="w-full h-44 px-8 py-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] text-[14px] font-bold text-slate-700 focus:outline-none focus:border-amber-400 focus:bg-white resize-none shadow-inner transition-all placeholder:text-slate-300"
                      placeholder="List specific items requiring modification..."
                      value={correctionMessage}
                      onChange={(e) => setCorrectionMessage(e.target.value)}
                    />
                  </div>
                  
                  <button
                    onClick={handleRequestCorrection}
                    className="w-full py-6 bg-amber-500 text-white rounded-[1.5rem] font-bold text-sm shadow-[0_20px_40px_-12px_rgba(245,158,11,0.3)] hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center gap-4 group">
                    <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Transmit Instructions
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
