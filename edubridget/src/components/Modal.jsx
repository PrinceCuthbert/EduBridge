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
    <div className="fixed inset-0 z-50 overflow-y-auto modern-scrollbar-light">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 md:p-6">
        <div className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl transform transition-all animate-in zoom-in-95 fade-in duration-300 ${className}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6 md:px-10 md:py-8 border-b border-slate-100">
            <h2 className="text-base sm:text-lg md:text-xl font-medium text-[#0F172A] tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 hover:bg-slate-50 rounded-xl transition-all active:scale-95 group"
            >
              <X size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
