import React, { useState, useEffect } from 'react';
import { Send, Mail, MessageSquare, Bell, Users, Search, X } from 'lucide-react';
// TODO: Uncomment when axios is installed
// import { communicationAPI, userAPI } from '../../api/services';
import { useAsyncAction, usePaginatedFetch, useDebounce } from '../../hooks/useApi';
import { toast } from 'sonner';
import Modal from '../../components/Modal';

export default function Communications() {
  const [activeTab, setActiveTab] = useState('bulk');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notificationData, setNotificationData] = useState({
    subject: '',
    message: '',
    type: 'email', // email, sms, or both
  });
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // TODO: Uncomment when axios is installed
  // const debouncedSearch = useDebounce(searchQuery, 500);
  // const { execute, loading: sending } = useAsyncAction();
  // const { data: users, loading: usersLoading } = usePaginatedFetch(
  //   userAPI.getAll,
  //   { search: debouncedSearch }
  // );

  // Mock Data
  const sending = false;
  const usersLoading = false;
  const users = [
    { id: 1, name: 'Alice Mutesi', email: 'alice@example.com' },
    { id: 2, name: 'David Kwizera', email: 'david@example.com' },
    { id: 3, name: 'Sarah Uwase', email: 'sarah@example.com' },
    { id: 4, name: 'John Doe', email: 'john@example.com' },
    { id: 5, name: 'Jane Smith', email: 'jane@example.com' },
  ].filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  // Message templates
  const templates = [
    {
      name: 'Application Received',
      subject: 'Application Received - EduBridge',
      message: 'Dear {name},\n\nThank you for submitting your application. We have received your documents and will review them within 5-7 business days.\n\nBest regards,\nEduBridge Team'
    },
    {
      name: 'Document Required',
      subject: 'Additional Documents Required',
      message: 'Dear {name},\n\nWe need additional documents to process your application. Please upload the missing documents at your earliest convenience.\n\nBest regards,\nEduBridge Team'
    },
    {
      name: 'Consultation Scheduled',
      subject: 'Visa Consultation Scheduled',
      message: 'Dear {name},\n\nYour visa consultation has been scheduled. Please check your dashboard for details.\n\nBest regards,\nEduBridge Team'
    },
  ];

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users?.map(u => u.id) || []);
    }
  };

  const handleUseTemplate = (template) => {
    setNotificationData({
      ...notificationData,
      subject: template.subject,
      message: template.message,
    });
    setShowTemplateModal(false);
  };

  const handleSendBulkNotification = (e) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    // Mock sending
    setTimeout(() => {
      toast.success(`Notification sent to ${selectedUsers.length} users`);
      setNotificationData({ subject: '', message: '', type: 'email' });
      setSelectedUsers([]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Communications</h1>
        <p className="text-slate-500 text-sm">Send notifications and messages to students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <Mail size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">245</h3>
              <p className="text-sm text-slate-500">Emails Sent</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <MessageSquare size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">156</h3>
              <p className="text-sm text-slate-500">SMS Sent</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <Bell size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">89</h3>
              <p className="text-sm text-slate-500">Notifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-slate-200">
        {/* Tabs */}
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-8 -mb-px">
            <button
              onClick={() => setActiveTab('bulk')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'bulk'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Bulk Notifications
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'bulk' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Selection */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Select Recipients</h3>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    {selectedUsers.length === users?.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-lg focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>

                <div className="border border-slate-200 rounded-lg max-h-96 overflow-y-auto modern-scrollbar-light">
                  {usersLoading ? (
                    <div className="p-8 text-center text-slate-500">Loading...</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {users?.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="w-4 h-4 text-primary rounded focus:ring-primary/20"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  {selectedUsers.length} user(s) selected
                </div>
              </div>

              {/* Message Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSendBulkNotification} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Compose Message</h3>
                    <button
                      type="button"
                      onClick={() => setShowTemplateModal(true)}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      Use Template
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Notification Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="email"
                          checked={notificationData.type === 'email'}
                          onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value })}
                          className="w-4 h-4 text-primary focus:ring-primary/20"
                        />
                        <span className="text-sm">Email</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="sms"
                          checked={notificationData.type === 'sms'}
                          onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value })}
                          className="w-4 h-4 text-primary focus:ring-primary/20"
                        />
                        <span className="text-sm">SMS</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="both"
                          checked={notificationData.type === 'both'}
                          onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value })}
                          className="w-4 h-4 text-primary focus:ring-primary/20"
                        />
                        <span className="text-sm">Both</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      value={notificationData.subject}
                      onChange={(e) => setNotificationData({ ...notificationData, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="Enter subject..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                    <textarea
                      required
                      rows="10"
                      value={notificationData.message}
                      onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none modern-scrollbar-light"
                      placeholder="Enter your message..."
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Use {'{name}'} to personalize with recipient's name
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={sending || selectedUsers.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={18} />
                    {sending ? 'Sending...' : `Send to ${selectedUsers.length} User(s)`}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <Bell size={48} className="mx-auto mb-4 text-slate-300" />
              <p>Notification history will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <Modal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          title="Select Template"
          size="md"
        >
          <div className="space-y-3">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => handleUseTemplate(template)}
                className="w-full text-left p-4 border border-slate-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <h4 className="font-semibold text-slate-900 mb-1">{template.name}</h4>
                <p className="text-sm text-slate-600 line-clamp-2">{template.message}</p>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
