import React, { useState } from 'react';
import { User, Lock, Bell, Shield, Mail, Phone, Calendar, MapPin, Edit2, Save, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

export default function AdminSettings() {
  const { user, updateProfile } = useAuth();
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Toggle states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Editable profile data (initialize from user or mock data)
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    studentId: user?.role === 'admin' ? 'ADM-001' : 'EB-SM-7890',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1998-07-21',
    currentAddress: {
      line1: '123 University Drive, Apt 4B',
      line2: 'Campusville, CA 90210'
    },
    permanentAddress: {
      line1: '456 Home Street, Townsville',
      line2: 'TX 75001'
    }
  });

  // Store original data to revert on cancel
  const [originalData, setOriginalData] = useState({ ...profileData });

  // Handle input change
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested address change
  const handleAddressChange = (addressType, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value
      }
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/profile/update', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(profileData)
      // });
      // const data = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update auth context with new name if changed
      if (profileData.name !== user?.name) {
        updateProfile({ name: profileData.name });
      }
      
      setOriginalData({ ...profileData });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setProfileData({ ...originalData });
    setIsEditing(false);
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     currentPassword: passwordForm.currentPassword,
      //     newPassword: passwordForm.newPassword
      //   })
      // });
      // const data = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({});
      setShowPasswordModal(false);
      
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password. Please check your current password.');
      console.error('Password change error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle toggle 2FA
  const handleToggle2FA = async () => {
    const newValue = !twoFactorEnabled;
    
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/security/2fa', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ enabled: newValue })
      // });
      
      setTwoFactorEnabled(newValue);
      toast.success(newValue ? '2FA Enabled' : '2FA Disabled');
    } catch (error) {
      toast.error('Failed to update 2FA settings');
    }
  };



  return (
    <div className="min-h-screen bg-slate-50/30 -m-8 p-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account information and preferences</p>
        </div>
        
        {/* Edit/Save/Cancel Buttons */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-xl hover:bg-[#1E293B] transition-colors"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors disabled:opacity-50"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4 mb-8">
              <img 
                src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin+User&background=0F172A&color=fff'} 
                alt={profileData.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-xl font-semibold text-slate-900 border-b-2 border-blue-500 focus:outline-none w-full"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-slate-900">{profileData.name}</h2>
                )}
                <p className="text-sm text-slate-500">ID: {profileData.studentId}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Email</p>
                  <p className="text-sm text-slate-900">{user?.email || 'sophia.miller@example.com'}</p>
                  {!isEditing && <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="text-sm text-slate-900 border-b border-slate-300 focus:border-blue-500 focus:outline-none w-full py-1"
                    />
                  ) : (
                    <p className="text-sm text-slate-900">{profileData.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-0.5">Date of Birth</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="text-sm text-slate-900 border-b border-slate-300 focus:border-blue-500 focus:outline-none w-full py-1"
                    />
                  ) : (
                    <p className="text-sm text-slate-900">{profileData.dateOfBirth}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Security Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Account Security</h3>
            <p className="text-sm text-slate-500 mb-6">Manage your account security settings.</p>

            <div className="space-y-5">
              {/* Change Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Change Password</span>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 text-sm font-medium text-[#0F172A] bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                >
                  Update
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Two-Factor Authentication</span>
                </div>
                <button
                  onClick={handleToggle2FA}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    twoFactorEnabled ? 'bg-[#0F172A]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Address Information Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/50">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Address Information</h3>
            <p className="text-sm text-slate-500 mb-6">Your registered addresses.</p>

            <div className="space-y-6">
              {/* Current Address */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-slate-400" />
                  <h4 className="text-sm font-semibold text-slate-700">Current Address</h4>
                </div>
                {isEditing ? (
                  <div className="space-y-2 pl-6">
                    <input
                      type="text"
                      value={profileData.currentAddress.line1}
                      onChange={(e) => handleAddressChange('currentAddress', 'line1', e.target.value)}
                      placeholder="Street address, Apt/Unit"
                      className="w-full text-sm text-slate-600 border-b border-slate-300 focus:border-blue-500 focus:outline-none py-1"
                    />
                    <input
                      type="text"
                      value={profileData.currentAddress.line2}
                      onChange={(e) => handleAddressChange('currentAddress', 'line2', e.target.value)}
                      placeholder="City, State ZIP"
                      className="w-full text-sm text-slate-600 border-b border-slate-300 focus:border-blue-500 focus:outline-none py-1"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed pl-6">
                    {profileData.currentAddress.line1}
                    <br />
                    {profileData.currentAddress.line2}
                  </p>
                )}
              </div>

              {/* Permanent Address */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-slate-400" />
                  <h4 className="text-sm font-semibold text-slate-700">Permanent Address</h4>
                </div>
                {isEditing ? (
                  <div className="space-y-2 pl-6">
                    <input
                      type="text"
                      value={profileData.permanentAddress.line1}
                      onChange={(e) => handleAddressChange('permanentAddress', 'line1', e.target.value)}
                      placeholder="Street address"
                      className="w-full text-sm text-slate-600 border-b border-slate-300 focus:border-blue-500 focus:outline-none py-1"
                    />
                    <input
                      type="text"
                      value={profileData.permanentAddress.line2}
                      onChange={(e) => handleAddressChange('permanentAddress', 'line2', e.target.value)}
                      placeholder="City, State ZIP"
                      className="w-full text-sm text-slate-600 border-b border-slate-300 focus:border-blue-500 focus:outline-none py-1"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed pl-6">
                    {profileData.permanentAddress.line1}
                    <br />
                    {profileData.permanentAddress.line2}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Communication Preferences Card */}
         
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <Modal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordErrors({});
          }}
          title="Change Password"
        >
          <form onSubmit={handlePasswordChange} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.currentPassword ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.newPassword ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter new password (min. 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordErrors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordErrors({});
                }}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-[#0F172A] text-white rounded-xl hover:bg-[#1E293B] transition-colors font-medium disabled:opacity-50"
              >
                {isSaving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
