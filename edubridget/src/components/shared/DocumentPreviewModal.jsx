import React, { useState } from 'react';
import { X, Loader2, Download } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import mammoth from 'mammoth';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';

// Set up the generic worker for PDF.js to decode in the background natively.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Bypasses Firebase CORS locally/Netlify
function toProxyUrl(downloadUrl) {
  try {
    const url = new URL(downloadUrl);
    const match = url.pathname.match(/\/o\/(.+)$/);
    if (!match) return downloadUrl;
    return `/storage-proxy/${match[1]}${url.search}`;
  } catch {
    return downloadUrl;
  }
}

export default function DocumentPreviewModal({ isOpen, onClose, document }) {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [docxHtml, setDocxHtml] = useState(null);

  React.useEffect(() => {
    // Reset states on new document
    if (isOpen) {
      setLoading(true);
      setDocxHtml(null);
      setNumPages(null);
    }
  }, [isOpen, document]);

  const url = document?.url || document?.path || document?.filePath || ''; // support different schemas
  const name = (document?.name || 'document').toLowerCase();
  
  // Try to parse the URL correctly or default.
  // Using proxy url helps bypass storage restriction.
  const proxiedUrl = url.includes('firebasestorage') ? toProxyUrl(url) : url;

  const isPdf = name.endsWith('.pdf');
  const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].some((ext) => name.endsWith(ext));
  const isDocx = name.endsWith('.docx') || name.endsWith('.doc');

  // If it's a docx, convert to HTML securely
  React.useEffect(() => {
    if (isOpen && isDocx) {
      setLoading(true);
      fetch(proxiedUrl)
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => mammoth.convertToHtml({ arrayBuffer }))
        .then(result => {
          setDocxHtml(result.value);
          setLoading(false);
        })
        .catch(err => {
          console.error('Docx preview failed', err);
          setLoading(false);
          toast.error("Could not preview document. Try downloading it instead.");
        });
    } else if (isOpen && (isPdf || isImage)) {
      setLoading(false);
    } else if (isOpen) {
      setLoading(false);
    }
  }, [isOpen, isDocx, proxiedUrl]);

  if (!isOpen || !document) return null;

  const handleDownload = async () => {
    try {
      const res = await fetch(proxiedUrl);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = blobUrl;
      a.download = document.name || 'download';
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-hidden"
      onClick={onClose}>
      <div
        className="bg-slate-100 rounded-xl shadow-2xl w-full max-w-5xl h-[95vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}>
        
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0 select-none z-10 shadow-sm relative">
          <div className="flex items-center gap-3 truncate pr-4">
            <h3 className="font-semibold text-slate-800 truncate">{document.name || 'Preview'}</h3>
            {isPdf && numPages && (
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full font-medium tracking-wide">
                {numPages} {numPages === 1 ? 'Page' : 'Pages'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium">
              <Download size={16} /> Download
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-auto w-full relative flex items-start justify-center p-4 lg:p-8 bg-slate-200/50">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-100">
              <Loader2 size={32} className="animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-500">Loading document preview...</p>
            </div>
          )}

          {!loading && isPdf && (
            <div className="w-full flex justify-center pb-12">
              <Document
                file={proxiedUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(error) => {
                  toast.error("Could not load PDF document.");
                  console.error("PDF load error", error);
                }}
                loading={
                  <div className="flex flex-col items-center mt-12 gap-3 text-slate-500">
                     <Loader2 size={32} className="animate-spin text-blue-500" />
                     Reading PDF...
                  </div>
                }
                className="flex flex-col gap-6 items-center w-full"
              >
                {Array.from(new Array(numPages || 0), (el, index) => (
                  <div key={`page_${index + 1}`} className="shadow-xl overflow-hidden shrink-0 bg-white relative rounded-sm border border-slate-200 max-w-full">
                     <div className="absolute bg-white/90 backdrop-blur-sm backdrop-filter shadow-sm border border-slate-200/50 px-2 py-0.5 select-none top-4 right-4 text-xs text-slate-500 font-mono z-10 rounded shadow-black/5">
                        {index + 1}
                     </div>
                    <Page
                      pageNumber={index + 1}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      width={Math.min(window.innerWidth * 0.9, 900)}
                      className="max-w-full"
                    />
                  </div>
                ))}
              </Document>
            </div>
          )}

          {!loading && isImage && (
            <div className="w-full h-full flex items-center justify-center max-w-4xl mx-auto">
              <img
                src={proxiedUrl} // use proxied to support download securely
                alt={name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-xl bg-white border border-slate-200/60"
              />
            </div>
          )}

          {!loading && isDocx && (
            <div className="w-full h-auto min-h-full flex items-start justify-center max-w-4xl mx-auto">
              <div
                className="prose prose-slate max-w-none w-full bg-white rounded-lg shadow-xl border border-slate-200/60 p-8 lg:p-12 mb-8"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(docxHtml || '<p>Unable to read document.</p>') }}
              />
            </div>
          )}

          {!loading && !isPdf && !isImage && !isDocx && (
            <div className="flex flex-col items-center justify-center gap-4 h-full text-slate-500 w-full mb-20 bg-white shadow-xl border border-slate-200/60 max-w-lg rounded-3xl mx-auto drop-shadow-sm min-h-[300px]">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Download size={32} className="text-slate-400" />
              </div>
              <div className="text-center px-4">
                <h3 className="font-semibold text-slate-800 text-lg">Preview not available</h3>
                <p className="text-sm mt-1 mb-4 leading-relaxed">This system does not have a viewer for <span className="font-mono bg-slate-100 text-slate-700 px-1 rounded">{name.split('.').pop() || 'this file'}</span> files.</p>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors text-sm font-medium shadow-sm">
                  <Download size={16} /> Download to Device
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
