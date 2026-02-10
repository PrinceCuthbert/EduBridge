import React, { useState } from 'react';
import { User, Lock, Bell, Shield, UserCircle, Settings as SettingsIcon, ChevronRight, Smartphone, Mail, Trash2 } from 'lucide-react';
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Premium Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Account Configuration</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            Manage your administrative profile and security protocols.
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-600 font-bold uppercase tracking-wider text-[10px]">Active Session Verified</span>
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-slate-900">
        
        {/* Communication Control */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-2xl shadow-slate-200/20 overflow-hidden flex flex-col">
          <div className="p-10 border-b border-slate-100 flex items-center gap-6 bg-slate-50/30">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-white transition-transform duration-500 hover:scale-105">
              <Bell size={28} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-serif text-[#0F172A] tracking-tight antialiased">Notifications</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">Automated Alerts & Logic</p>
            </div>
          </div>
          <div className="p-10 space-y-8 flex-1">
            {[
              { id: 'email', label: 'Email Correspondence', desc: 'Critical system and account updates', icon: Mail },
              { id: 'push', label: 'Real-time Alerts', desc: 'Direct browser and OS notifications', icon: Smartphone },
              { id: 'sms', label: 'Mobile Synchronization', desc: 'Direct tele-communication alerts', icon: Smartphone },
              { id: 'marketing', label: 'Institutional Updates', desc: 'Educational news and developments', icon: Bell }
            ].map((pref) => (
              <div key={pref.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-all duration-500 group-hover:bg-blue-50">
                      <pref.icon size={20} />
                   </div>
                   <div>
                     <p className="text-[15px] font-bold text-slate-700 group-hover:text-[#0F172A] transition-colors">{pref.label}</p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-70">{pref.desc}</p>
                   </div>
                </div>
                <button
                  onClick={() => setNotifications({...notifications, [pref.id]: !notifications[pref.id]})}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500 ${
                    notifications[pref.id] ? 'bg-blue-600 shadow-lg' : 'bg-slate-200 shadow-inner'
                  }`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-500 ${
                    notifications[pref.id] ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {/* Security Protocols */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-2xl shadow-slate-200/20 overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex items-center gap-6 bg-slate-50/30">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-white">
                <Shield size={28} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-[#0F172A] tracking-tight antialiased">Security</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">Protection Metrics</p>
              </div>
            </div>
            <div className="p-8 space-y-4">
              {[
                { label: 'Credential Update', desc: 'Modify access authentication', icon: Lock },
                { label: 'Multi-Factor Verification', desc: 'Secondary security layering', icon: Shield },
                { label: 'Authorization Logs', desc: 'Audit active system sessions', icon: SettingsIcon }
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-6 rounded-[1.5rem] bg-slate-50/20 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-all duration-500 group-hover:rotate-6">
                       <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-700 group-hover:text-[#0F172A] transition-colors">{item.label}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1.5 opacity-70">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Identity & Access */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-2xl shadow-slate-200/20 overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex items-center gap-6 bg-slate-50/30">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-white">
                <UserCircle size={28} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-[#0F172A] tracking-tight antialiased">Identity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">Executive Credentials</p>
              </div>
            </div>
            <div className="p-8 space-y-5">
              <div className="p-8 bg-[#0F172A] rounded-[2rem] shadow-2xl flex items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                   <Lock size={64} className="text-white" />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] leading-none mb-2">Verified Identity</p>
                  <p className="text-[17px] font-serif text-white antialiased">{user?.email || 'Unauthorized Entity'}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10 backdrop-blur-md">
                   <Lock size={18} className="text-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]" />
                </div>
              </div>
              
              <button className="w-full flex items-center justify-between p-6 rounded-[1.5rem] bg-slate-50/20 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-slate-300 group-hover:text-blue-600 transition-all duration-500">
                     <User size={20} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-slate-700 group-hover:text-[#0F172A] transition-colors">Dossier Access</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1.5 opacity-70">Modify administrative profile</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1.5 transition-all" />
              </button>
              
              <button className="w-full flex items-center justify-between p-6 rounded-[1.5rem] bg-rose-50/10 border border-transparent hover:border-rose-100 hover:bg-white hover:shadow-xl hover:shadow-rose-500/5 transition-all text-left group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-rose-200 group-hover:text-rose-500 transition-all duration-500">
                     <Trash2 size={20} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-rose-600">Decommission Registry</p>
                    <p className="text-[10px] font-bold text-rose-300 uppercase tracking-widest leading-none mt-1.5 opacity-70">Permanent entity removal</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-rose-200 group-hover:text-rose-500 group-hover:translate-x-1.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
