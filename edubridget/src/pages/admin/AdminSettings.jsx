import React, { useState } from 'react';
import { User, Lock, Mail, Camera, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@edubridge.com',
    role: user?.role || 'Administrator',
    avatar: user?.avatar || null
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>

      {/* Two Column Layout for Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden mb-4 relative">
                   {profileData.avatar ? (
                     <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400">
                       <User size={40} />
                     </div>
                   )}
                </div>
                <label className="absolute bottom-4 right-0 bg-white p-1.5 rounded-full shadow-lg border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                  <Camera size={14} className="text-primary" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
              
              <h2 className="font-bold text-lg text-slate-800">{profileData.name}</h2>
              <p className="text-sm text-slate-500 mb-2">{profileData.role}</p>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
                Active
              </span>
           </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Details Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
               <User className="text-primary" size={20} />
               <h3 className="font-bold text-slate-800">Profile Information</h3>
             </div>
             <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name} 
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email} 
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                   <input 
                      type="text" 
                      value={profileData.role} 
                      disabled
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                </div>
                <div className="flex justify-end pt-2">
                   <button 
                     type="submit" 
                     disabled={isLoading}
                     className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                   >
                     {isLoading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                   </button>
                </div>
             </form>
          </div>

          {/* Security Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
               <Lock className="text-primary" size={20} />
               <h3 className="font-bold text-slate-800">Security & Password</h3>
             </div>
             <form onSubmit={handlePasswordReset} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Current Password</label>
                  <input 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                 <div className="flex items-start gap-3 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
                   <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                   <p>Ensure your password is at least 8 characters long and includes a mix of numbers and special characters for better security.</p>
                 </div>
                <div className="flex justify-end pt-2">
                   <button 
                     type="submit" 
                     disabled={isLoading}
                     className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                   >
                     {isLoading ? 'Updating...' : 'Update Password'}
                   </button>
                </div>
             </form>
          </div>

        </div>
      </div>
    </div>
  );
}
