// src/pages/student-dashboard/settings/StudentSettings.jsx
import React, { useState, useEffect } from 'react';
import {
  Lock, Mail, Phone, Calendar, Globe,
  Edit2, Save, X, Eye, EyeOff, Loader2, User, MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/Modal';
import { getUserById, updateUser, updatePassword, uploadUserAvatar } from '../../../services/userService';

export default function StudentSettings() {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing]             = useState(false);
  const [isSaving, setIsSaving]               = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // --- Profile Data — maps 1:1 to USER + IDENTITY tables ---
  const EMPTY = {
    firstName: '', lastName: '', email: '',
    phone: '', nationality: '', gender: '',
    dateOfBirth: '', language: '',
    role: 'student', status: 'Active',
  };
  const [profileData, setProfileData] = useState(EMPTY);
  const [originalData, setOriginalData] = useState(EMPTY);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // --- Fetch from DB on mount ---
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const fresh = await getUserById(user.id);
        const mapped = {
          firstName:   fresh.identity?.firstName   || '',
          lastName:    fresh.identity?.lastName    || '',
          email:       fresh.email                 || '',
          phone:       fresh.identity?.phone       || '',
          nationality: fresh.identity?.nationality || '',
          gender:      fresh.identity?.gender      || '',
          dateOfBirth: fresh.identity?.dob  || '',
          language:    fresh.identity?.language    || '',
          role:        fresh.role                  || 'student',
          status:      fresh.status                || 'Active',
        };
        setProfileData(mapped);
        setOriginalData(mapped);
      } catch {
        toast.error('Failed to load profile data');
      } finally {
        setIsLoadingProfile(false);
      }
    })();
  }, [user?.id]);

  const set = (field, value) => setProfileData(prev => ({ ...prev, [field]: value }));

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updatedFromDB = await updateUser(user.id, profileData);
      await updateProfile(updatedFromDB);
      setOriginalData({ ...profileData });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const newUrl = await uploadUserAvatar(user.id, file);
      await updateProfile({ ...profileData, avatar: newUrl }); 
      toast.success("Profile photo updated!");
    } catch (error) {
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (passwordForm.newPassword.length < 8) errors.newPassword = 'Must be at least 8 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (Object.keys(errors).length > 0) { setPasswordErrors(errors); return; }

    setIsSaving(true);
    try {
      await updatePassword(user.id, passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
      setShowPasswordModal(false);
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 -m-8 p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account information and security</p>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-xl hover:bg-[#1E293B] transition-colors">
              <Edit2 size={18} /> Edit Profile
            </button>
          ) : (
            <>
              <button onClick={() => { setProfileData({ ...originalData }); setIsEditing(false); }} disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors disabled:opacity-50">
                <X size={18} /> Cancel
              </button>
              <button onClick={handleSaveProfile} disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── LEFT: Identity Info ── */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50">

          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative group shrink-0">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=0F172A&color=fff`}
                alt="Profile" 
                className={`w-16 h-16 rounded-full object-cover transition-opacity ${isUploadingAvatar ? 'opacity-50' : 'group-hover:opacity-90'}`}
              />
              
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-blue-600" />
                </div>
              )}

              {isEditing && !isUploadingAvatar && (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  <span className="text-white text-[9px] uppercase font-bold tracking-wider text-center pt-1">Edit</span>
                </label>
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="flex gap-3 mb-1">
                  <input value={profileData.firstName} onChange={e => set('firstName', e.target.value)} placeholder="First Name"
                    className="text-xl font-semibold text-slate-900 border-b-2 border-blue-500 focus:outline-none w-full" />
                  <input value={profileData.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Last Name"
                    className="text-xl font-semibold text-slate-900 border-b-2 border-blue-500 focus:outline-none w-full" />
                </div>
              ) : (
                <h2 className="text-xl font-semibold text-slate-900">{profileData.firstName} {profileData.lastName}</h2>
              )}
              <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 uppercase">
                {profileData.role}
              </span>
            </div>
          </div>

          {/* Identity Fields */}
          <div className="space-y-4">
            {/* Email — read only */}
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Email</p>
                <p className="text-sm text-slate-900">{profileData.email}</p>
                {!isEditing && <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>}
              </div>
            </div>

            <InfoRow icon={<Phone size={18} className="text-slate-400 mt-0.5" />}    label="Phone"         value={profileData.phone}       isEditing={isEditing} type="tel"  onChange={v => set('phone', v)} />
            <InfoRow icon={<Calendar size={18} className="text-slate-400 mt-0.5" />} label="Date of Birth" value={profileData.dateOfBirth}  isEditing={isEditing} type="date" onChange={v => set('dateOfBirth', v)} />
            <InfoRow icon={<MapPin size={18} className="text-slate-400 mt-0.5" />}   label="Nationality"   value={profileData.nationality}  isEditing={isEditing}              onChange={v => set('nationality', v)} />

            {/* Gender */}
            <div className="flex items-start gap-3">
              <User size={18} className="text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Gender</p>
                {isEditing ? (
                  <select value={profileData.gender} onChange={e => set('gender', e.target.value)}
                    className="w-full text-sm text-slate-900 border-b border-slate-300 focus:border-blue-500 focus:outline-none py-1 bg-transparent">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="text-sm text-slate-900">{profileData.gender || <span className="text-slate-400 italic">Not specified</span>}</p>
                )}
              </div>
            </div>

            {/* Language — IDENTITY.language */}
            <div className="flex items-start gap-3">
              <Globe size={18} className="text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Preferred Language</p>
                {isEditing ? (
                  <select value={profileData.language} onChange={e => set('language', e.target.value)}
                    className="w-full text-sm text-slate-900 border-b border-slate-300 focus:border-blue-500 focus:outline-none py-1 bg-transparent">
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Korean">Korean</option>
                    <option value="Chinese">Chinese (Mandarin)</option>
                    <option value="Swahili">Swahili</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-sm text-slate-900">{profileData.language || <span className="text-slate-400 italic">Not specified</span>}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Account Security ── */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50 h-fit">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Account Security</h3>
          <p className="text-sm text-slate-500 mb-6">Manage your account security settings.</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Change Password</span>
            </div>
            <button onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 text-sm font-medium text-[#0F172A] bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <Modal isOpen={showPasswordModal}
          onClose={() => { setShowPasswordModal(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPasswordErrors({}); }}
          title="Change Password">
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <PwField label="Current Password"    value={passwordForm.currentPassword} error={passwordErrors.currentPassword} show={showPass.current} onToggle={() => setShowPass(p => ({ ...p, current: !p.current }))} onChange={v => setPasswordForm(p => ({ ...p, currentPassword: v }))}    placeholder="Enter current password" />
            <PwField label="New Password"         value={passwordForm.newPassword}     error={passwordErrors.newPassword}     show={showPass.new}     onToggle={() => setShowPass(p => ({ ...p, new: !p.new }))}              onChange={v => setPasswordForm(p => ({ ...p, newPassword: v }))}        placeholder="Min. 8 characters" />
            <PwField label="Confirm New Password" value={passwordForm.confirmPassword} error={passwordErrors.confirmPassword} show={showPass.confirm} onToggle={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}    onChange={v => setPasswordForm(p => ({ ...p, confirmPassword: v }))} placeholder="Confirm new password" />
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowPasswordModal(false)} disabled={isSaving}
                className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-medium disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0F172A] text-white rounded-xl hover:bg-[#1E293B] font-medium disabled:opacity-50">
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {isSaving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, isEditing, type = 'text', onChange }) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div className="flex-1">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">{label}</p>
        {isEditing
          ? <input type={type} value={value} onChange={e => onChange(e.target.value)}
              className="w-full text-sm text-slate-900 border-b border-slate-300 focus:border-blue-500 focus:outline-none py-1" />
          : <p className="text-sm text-slate-900">{value || <span className="text-slate-400 italic">Not provided</span>}</p>}
      </div>
    </div>
  );
}

function PwField({ label, value, error, show, onToggle, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label} <span className="text-red-500">*</span></label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-slate-300'}`} />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
