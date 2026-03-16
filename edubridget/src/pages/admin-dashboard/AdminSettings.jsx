// src/pages/admin/AdminSettings.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Mail, Phone, 
  Calendar, MapPin, Edit2, Save, X, Eye, EyeOff, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

// IMPORT THE NEW FUNCTIONS FROM USER SERVICE
import { updatePassword, getUserById, updateUser } from '../../services/userService';

export default function AdminSettings() {
  const { user, updateProfile } = useAuth();
  
  // --- UI & Loading States ---
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // --- Profile Data State ---
  const [profileData, setProfileData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    nationality: '', gender: '', dateOfBirth: '', role: '', status: ''
  });
  const [originalData, setOriginalData] = useState({});

  // --- Fetch Fresh Data from DB on Mount ---
  useEffect(() => {
    let cancelled = false;
    const loadFreshData = async () => {
      if (!user?.id) return;
      try {
        const freshUser = await getUserById(user.id);
        if (cancelled) return;
        const freshData = {
          firstName:   freshUser.identity?.firstName   || '',
          lastName:    freshUser.identity?.lastName    || '',
          email:       freshUser.email                 || '',
          phone:       freshUser.identity?.phone       || '',
          nationality: freshUser.identity?.nationality || '',
          gender:      freshUser.identity?.gender      || '',
          dateOfBirth: freshUser.identity?.date_birth  || '',
          role:        freshUser.role                  || 'student',
          status:      freshUser.status                || 'Active',
        };
        setProfileData(freshData);
        setOriginalData(freshData);
      } catch (error) {
        if (!cancelled) toast.error("Failed to sync latest profile data");
      } finally {
        if (!cancelled) setIsLoadingProfile(false);
      }
    };
    loadFreshData();
    return () => { cancelled = true; };
  }, [user?.id]);

  // --- Password Form State ---
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passwordErrors, setPasswordErrors] = useState({});


  // --- Handlers ---
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // 1. Save to the main Database! 
      // (Your profileData object matches the formData structure updateUser expects perfectly)
      const updatedUserFromDB = await updateUser(user.id, profileData);

      // 2. Sync the Context Session so the Sidebar/Navbar updates instantly
      await updateProfile(updatedUserFromDB); 
      
      setOriginalData({ ...profileData });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({ ...originalData });
    setIsEditing(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (passwordForm.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      await updatePassword(user.id, passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
      setShowPasswordModal(false);
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to change password.');
    } finally {
      setIsSaving(false);
    }
  };



  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/30">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 -m-8 p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account information and preferences</p>
        </div>
        
        <div className="flex gap-3">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-xl hover:bg-[#1E293B] transition-colors">
              <Edit2 size={18} /> Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleCancelEdit} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors disabled:opacity-50">
                <X size={18} /> Cancel
              </button>
              <button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Personal Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50">
            {/* Avatar and Split Name */}
            <div className="flex items-center gap-4 mb-8">
              <img 
                src={user?.avatar || `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=0F172A&color=fff`} 
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                {isEditing ? (
                  <div className="flex gap-3 mb-1">
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="First Name"
                      className="text-xl font-semibold text-slate-900 border-b-2 border-blue-500 focus:outline-none w-full"
                    />
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Last Name"
                      className="text-xl font-semibold text-slate-900 border-b-2 border-blue-500 focus:outline-none w-full"
                    />
                  </div>
                ) : (
                  <h2 className="text-xl font-semibold text-slate-900">{profileData.firstName} {profileData.lastName}</h2>
                )}
                <p className="text-sm text-slate-500 capitalize">Role: {profileData.role}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <InfoRow 
                icon={<Mail size={18} className="text-slate-400 mt-0.5" />} 
                label="Email" 
                value={profileData.email} 
                isStatic 
                hint="Email cannot be changed"
              />
              <InfoRow 
                icon={<Phone size={18} className="text-slate-400 mt-0.5" />} 
                label="Phone" 
                type="tel"
                value={profileData.phone} 
                isEditing={isEditing}
                onChange={(val) => handleInputChange('phone', val)}
              />
              <InfoRow 
                icon={<Calendar size={18} className="text-slate-400 mt-0.5" />} 
                label="Date of Birth" 
                type="date"
                value={profileData.dateOfBirth} 
                isEditing={isEditing}
                onChange={(val) => handleInputChange('dateOfBirth', val)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Demographics & Security */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Demographics</h3>
            <p className="text-sm text-slate-500 mb-6">Your personal background details.</p>

            <div className="space-y-4">
              <InfoRow 
                icon={<MapPin size={18} className="text-slate-400 mt-0.5" />} 
                label="Nationality" 
                value={profileData.nationality} 
                isEditing={isEditing}
                onChange={(val) => handleInputChange('nationality', val)}
              />
              
              <div className="flex items-start gap-3">
                <User size={18} className="text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Gender</p>
                  {isEditing ? (
                    <select 
                      value={profileData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full text-sm text-slate-900 border-b border-slate-300 focus:border-blue-500 focus:outline-none py-1 bg-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-sm text-slate-900">{profileData.gender || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Security Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50 h-fit">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Account Security</h3>
            <p className="text-sm text-slate-500 mb-6">Manage your account security settings.</p>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Change Password</span>
                </div>
                <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 text-sm font-medium text-[#0F172A] bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
                  Update
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <Modal isOpen={showPasswordModal} onClose={() => { setShowPasswordModal(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPasswordErrors({}); }} title="Change Password">
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <PasswordField label="Current Password" value={passwordForm.currentPassword} error={passwordErrors.currentPassword} show={showPass.current} onToggle={() => setShowPass({...showPass, current: !showPass.current})} onChange={(v) => setPasswordForm({...passwordForm, currentPassword: v})} placeholder="Enter current password" />
            <PasswordField label="New Password" value={passwordForm.newPassword} error={passwordErrors.newPassword} show={showPass.new} onToggle={() => setShowPass({...showPass, new: !showPass.new})} onChange={(v) => setPasswordForm({...passwordForm, newPassword: v})} placeholder="Enter new password (min. 8 characters)" />
            <PasswordField label="Confirm New Password" value={passwordForm.confirmPassword} error={passwordErrors.confirmPassword} show={showPass.confirm} onToggle={() => setShowPass({...showPass, confirm: !showPass.confirm})} onChange={(v) => setPasswordForm({...passwordForm, confirmPassword: v})} placeholder="Confirm new password" />
            
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowPasswordModal(false)} disabled={isSaving} className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={isSaving} className="flex-1 px-4 py-3 bg-[#0F172A] text-white rounded-xl hover:bg-[#1E293B] transition-colors font-medium disabled:opacity-50 flex justify-center items-center gap-2">
                {isSaving && <Loader2 size={16} className="animate-spin" />} {isSaving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// --- Sub-components ---
function InfoRow({ icon, label, value, isEditing, isStatic, type = "text", onChange, hint }) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div className="flex-1">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
        {isEditing && !isStatic ? (
          <input type={type} className="w-full text-sm text-slate-900 border-b border-slate-300 focus:border-blue-500 focus:outline-none py-1" value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <>
            <p className="text-sm text-slate-900">{value || 'Not provided'}</p>
            {!isEditing && hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
          </>
        )}
      </div>
    </div>
  );
}

function PasswordField({ label, value, error, show, onToggle, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label} <span className="text-red-500">*</span></label>
      <div className="relative">
        <input type={show ? "text" : "password"} className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-slate-300'}`} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}