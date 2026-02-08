import React, { useState } from 'react';
import { X, Download, FileText, Image as ImageIcon, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DocumentViewer({ documents, isOpen, onClose, currentIndex = 0 }) {
  const [index, setIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !documents || documents.length === 0) return null;

  const currentDoc = documents[index];
  const isPDF = currentDoc?.type?.includes('pdf') || currentDoc?.name?.endsWith('.pdf');
  const isImage = currentDoc?.type?.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(currentDoc?.name);

  const handleNext = () => {
    if (index < documents.length - 1) {
      setIndex(index + 1);
      setZoom(100);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setZoom(100);
    }
  };

  const handleDownload = () => {
    // Create download link
    const link = document.createElement('a');
    link.href = currentDoc.url;
    link.download = currentDoc.name;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto modern-scrollbar-light">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{currentDoc?.name}</h3>
              <p className="text-sm text-slate-500">
                Document {index + 1} of {documents.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              {isImage && (
                <div className="flex items-center gap-2 mr-4">
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 25))}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <span className="text-sm font-medium text-slate-700 min-w-[60px] text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <ZoomIn size={18} />
                  </button>
                </div>
              )}
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Download size={18} />
                Download
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <X size={20} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Document Display */}
          <div className="p-6 bg-slate-100 min-h-[500px] max-h-[70vh] overflow-auto modern-scrollbar-light">
            <div className="flex items-center justify-center">
              {isPDF ? (
                <iframe
                  src={currentDoc.url}
                  className="w-full h-[600px] bg-white rounded-lg shadow-sm"
                  title={currentDoc.name}
                />
              ) : isImage ? (
                <img
                  src={currentDoc.url}
                  alt={currentDoc.name}
                  className="max-w-full h-auto rounded-lg shadow-sm transition-transform"
                  style={{ transform: `scale(${zoom / 100})` }}
                />
              ) : (
                <div className="text-center py-16">
                  <FileText size={64} className="text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">Preview not available for this file type</p>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Download to View
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Footer */}
          {documents.length > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200">
              <button
                onClick={handlePrev}
                disabled={index === 0}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <div className="flex gap-2">
                {documents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setIndex(i); setZoom(100); }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === index ? 'bg-primary' : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={index === documents.length - 1}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
