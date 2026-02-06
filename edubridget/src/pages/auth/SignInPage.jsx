import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faRightToBracket, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { toast } from 'sonner';

function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || "/dashboard";

  const initialFormState = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };
    // Uncomment when ready to implement
    // loadGoogleScript();
    return () => {};
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({
        email: formData.email,
        password: formData.password
      });
      toast.success(`Welcome back, ${user.name}!`);
      
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      toast.info("Google Sign-In integration coming soon!");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      toast.error("Google Sign-In failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setFormData({ ...formData, email: 'admin@edubridge.africa', password: 'admin123' });
    } else {
      setFormData({ ...formData, email: 'student@test.com', password: 'student123' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background Image and Overlaying Form */}
      <div className="relative flex-1 flex items-center lg:items-start lg:pt-20">
        {/* Background Image - Full Width */}
        <img
          src="/Students.png"
          alt="Students studying"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-[#1A237E]/50 to-slate-900/60" />

        {/* Overlaying Form Card - Positioned on Left/Center */}
        <div className="relative z-10 w-full lg:w-1/2 px-6 py-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
              
              {/* Logo */}
              <div className="text-center mb-6">
                <Link to="/" className="inline-flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#1A237E] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">EB</span>
                  </div>
                  <span className="ml-3 text-xl font-bold text-slate-900">EduBridge</span>
                </Link>
                
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
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
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all disabled:opacity-50 text-slate-900"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm font-semibold text-[#1A237E] hover:underline">
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
                      placeholder="••••••••••"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] pr-12 transition-all disabled:opacity-50 text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>
                
                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#1A237E] focus:ring-[#1A237E] border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-700">
                    Remember me for 30 days
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#1A237E] via-[#283593] to-[#1A237E] hover:from-[#283593] hover:to-[#1A237E] text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <FontAwesomeIcon icon={faRightToBracket} />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full py-3.5 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {googleLoading ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[#1A237E]" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </button>
              </form>
              
              {/* Sign Up Link */}
              <div className="mt-6 text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#1A237E] hover:underline font-bold">
                  Sign up for free
                </Link>
              </div>

              {/* Demo Accounts */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">Demo Credentials</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => fillDemo('admin')} 
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-left transition-colors border border-slate-200"
                  >
                    <span className="font-bold block text-slate-800 mb-0.5">Admin</span>
                    <span className="text-slate-500 text-[10px]">admin@edubridge.africa</span>
                  </button>
                  <button 
                    onClick={() => fillDemo('student')}
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-left transition-colors border border-slate-200"
                  >
                    <span className="font-bold block text-slate-800 mb-0.5">Student</span>
                    <span className="text-slate-500 text-[10px]">student@test.com</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Text Overlay on Image (Hidden on Mobile) */}
        <div className="hidden lg:block absolute right-0 bottom-20 pr-16 pb-12 z-10 max-w-md">
          <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">Bridge Your Future</h2>
          <p className="text-lg text-white/90 drop-shadow-md">Join thousands of East African students achieving their educational dreams worldwide.</p>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
