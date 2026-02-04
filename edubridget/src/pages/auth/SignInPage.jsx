import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faRightToBracket, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { toast } from 'sonner';

function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Navigate back to where they came from or default
  const from = location.state?.from?.pathname || "/dashboard";

  const initialFormState = {
    email: "",
    password: "",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(formData);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Intelligent redirection based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/admin/dashboard' ? '/dashboard' : from);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to sign in. Please check your credentials.");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Helper to pre-fill demo data
  const fillDemo = (role) => {
    if (role === 'admin') {
      setFormData({ email: 'admin@edubridge.africa', password: 'admin123' });
    } else {
      setFormData({ email: 'student@test.com', password: 'student123' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">EB</span>
              </div>
              <span className="ml-2 text-lg font-bold text-slate-900">EduBridge</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-sm">
              Sign in to continue your educational journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-dark">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-700">
                  Remember me for 30 days
                </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <FontAwesomeIcon icon={faRightToBracket} className="ml-1" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-600">
             Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:text-primary-dark font-bold">
              Sign up for free
            </Link>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">Demo Credentials (Click to Fill)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button 
                onClick={() => fillDemo('admin')} 
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] text-left transition-colors border border-slate-200"
              >
                 <span className="font-bold block text-slate-800 mb-0.5">Admin</span>
                 <span className="text-slate-500">admin@edubridge.africa</span>
                 <span className="block text-slate-500">admin123</span>
              </button>
              <button 
                onClick={() => fillDemo('student')}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] text-left transition-colors border border-slate-200"
              >
                 <span className="font-bold block text-slate-800 mb-0.5">Student</span>
                 <span className="text-slate-500">student@test.com</span>
                 <span className="block text-slate-500">student123</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/Students.png"
          alt="Students studying nicely"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/40 mix-blend-multiply"></div>
         
         <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">
            <h2 className="text-4xl font-bold mb-4 text-white">Bridge Your Future</h2>
            <p className="text-lg text-white/90 max-w-md">Join thousands of East African students achieving their educational dreams worldwide.</p>
         </div>
      </div>
    </div>
  );
}

export default SignInPage;
