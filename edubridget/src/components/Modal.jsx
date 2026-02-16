import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', className = '' }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      {/* CHANGED: bg-[#0F172A]/80 -> bg-slate-900/50 (Cleaner standard dark overlay) */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Positioning */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Panel */}
        {/* CHANGED: rounded-[2rem] -> rounded-xl */}
        {/* CHANGED: shadow-2xl -> shadow-xl */}
        <div className={`relative w-full ${sizeClasses[size]} bg-white rounded-xl shadow-xl transform transition-all animate-in zoom-in-95 fade-in duration-200 ${className}`}>
          
          {/* Header */}
          {/* CHANGED: Reduced padding (py-4) and simplified border */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            {/* CHANGED: font-medium -> font-semibold, text-[#0F172A] -> text-slate-900 */}
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              // CHANGED: rounded-xl -> rounded-lg
              className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          {/* CHANGED: Standardized padding to p-6 */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}