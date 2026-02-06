import React, { useState } from 'react';
import { User, Lock, Bell, Shield, UserCircle, Settings as SettingsIcon, ChevronRight, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Settings</h2>
        <p className="text-slate-600">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        
        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Bell size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Notifications</h3>
              <p className="text-sm text-slate-500">Manage how you receive notifications</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Email Notifications</p>
                <p className="text-sm text-slate-500">Receive updates via email</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, email: !notifications.email})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Push Notifications</p>
                <p className="text-sm text-slate-500">Receive push notifications in browser</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, push: !notifications.push})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.push ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.push ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            {/* SMS Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">SMS Notifications</p>
                <p className="text-sm text-slate-500">Receive important updates via SMS</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.sms ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.sms ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            {/* Marketing Emails */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Marketing Emails</p>
                <p className="text-sm text-slate-500">Receive news and promotional content</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, marketing: !notifications.marketing})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.marketing ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Security</h3>
              <p className="text-sm text-slate-500">Manage your security preferences</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {/* Change Password */}
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left">
              <div>
                <p className="font-medium text-slate-900">Change Password</p>
                <p className="text-sm text-slate-500">Update your account password</p>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>
            
            {/* Two-Factor Authentication */}
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left">
              <div>
                <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                <p className="text-sm text-slate-500">Add an extra layer of security</p>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>
            
            {/* Active Sessions */}
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left">
              <div>
                <p className="font-medium text-slate-900">Active Sessions</p>
                <p className="text-sm text-slate-500">Manage devices where you're logged in</p>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <UserCircle size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Account</h3>
              <p className="text-sm text-slate-500">Manage your account settings</p>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {/* Signed in as */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-500 mb-1">Signed in as</p>
              <p className="font-semibold text-slate-900">{user?.email || 'Not signed in'}</p>
            </div>
            
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left">
              <div>
                <p className="font-medium text-slate-900">Profile Settings</p>
                <p className="text-sm text-slate-500">Update your personal information</p>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors text-left">
              <div>
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-600">Permanently delete your account and data</p>
              </div>
              <ChevronRight size={20} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
