import React, { useState } from 'react';
import { X, Send, FileText, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackModal({ isOpen, onClose, application, onSubmit }) {
  const [feedback, setFeedback] = useState({
    message: '',
    sendEmail: true,
    requestDocuments: false,
    documents: [],
  });

  const templates = [
    {
      name: 'Request Additional Info',
      message: 'Thank you for your application. We need some additional information to process your request. Please provide the following documents:\n\n1. \n2. \n3. '
    },
    {
      name: 'Application Approved',
      message: 'Congratulations! Your application has been approved. We will contact you shortly with the next steps.'
    },
    {
      name: 'Application Under Review',
      message: 'Your application is currently under review. We will notify you of any updates within the next 5-7 business days.'
    },
    {
      name: 'Request Clarification',
      message: 'We have reviewed your application and need some clarification on the following:\n\n'
    },
  ];

  const handleTemplateSelect = (template) => {
    setFeedback({ ...feedback, message: template.message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.message.trim()) {
      toast.error('Please enter a feedback message');
      return;
    }

    await onSubmit(feedback);
    setFeedback({ message: '', sendEmail: true, requestDocuments: false, documents: [] });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto modern-scrollbar-light">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Send Feedback</h2>
              <p className="text-sm text-slate-500 mt-1">
                {application?.studentName} - {application?.scholarship}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Quick Templates */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Quick Templates</label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTemplateSelect(template)}
                    className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-primary/5 hover:border-primary hover:text-primary transition-colors text-left"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Message */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Feedback Message</label>
              <textarea
                required
                rows="8"
                value={feedback.message}
                onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none modern-scrollbar-light"
                placeholder="Enter your feedback message..."
              />
              <p className="text-xs text-slate-500 mt-1">
                {feedback.message.length} characters
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={feedback.sendEmail}
                  onChange={(e) => setFeedback({ ...feedback, sendEmail: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-primary/20"
                />
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-slate-400 group-hover:text-primary" />
                  <span className="text-sm font-medium text-slate-700">Send email notification to student</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={feedback.requestDocuments}
                  onChange={(e) => setFeedback({ ...feedback, requestDocuments: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-primary/20"
                />
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-slate-400 group-hover:text-primary" />
                  <span className="text-sm font-medium text-slate-700">Request additional documents</span>
                </div>
              </label>
            </div>

            {/* Preview */}
            {feedback.sendEmail && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Email Preview</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p><strong>To:</strong> {application?.email}</p>
                  <p><strong>Subject:</strong> Update on Your {application?.scholarship} Application</p>
                  <div className="mt-3 p-3 bg-white rounded border border-slate-200 max-h-32 overflow-y-auto modern-scrollbar-light">
                    <p className="whitespace-pre-wrap">{feedback.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Send size={18} />
                Send Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
