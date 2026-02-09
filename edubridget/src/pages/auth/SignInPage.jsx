import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faRightToBracket,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({
        email: formData.email,
        password: formData.password,
      });
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(from === "/admin/dashboard" ? "/dashboard" : from);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to sign in. Please check your credentials.",
      );
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Decode Google JWT token to get user info
      const decoded = jwtDecode(credentialResponse.credential);

      if (import.meta.env.DEV) {
        console.log("📝 Google user data:", {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        });
      }

      // TODO: Send to your backend API for verification and session creation
      // const response = await authAPI.googleSignIn({
      //   token: credentialResponse.credential,
      // });
      // localStorage.setItem('token', response.token);
      // localStorage.setItem('user', JSON.stringify(response.user));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock login - store user data from Google
      // TODO: Backend should determine user role from database
      // Check if email is in admin emails list from environment
      const adminEmails =
        import.meta.env.VITE_ADMIN_EMAILS?.split(",").map((e) => e.trim()) ||
        [];
      const isAdmin = adminEmails.includes(decoded.email);

      const mockUser = {
        id: decoded.sub || `google_${Date.now()}`,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture,
        role: isAdmin ? "admin" : "student",
      };

      // Use the same localStorage key as AuthContext
      localStorage.setItem("edubridge_user", JSON.stringify(mockUser));

      toast.success(`Welcome back, ${decoded.name}!`);

      // Use window.location to force full page reload and sync AuthContext state
      if (mockUser.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href =
          from === "/admin/dashboard" ? "/dashboard" : from;
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Google Sign-In Error:", err);
      }
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In was cancelled or failed");
  };

  const fillDemo = (role) => {
    if (role === "admin") {
      setFormData({
        ...formData,
        email: "admin@edubridge.africa",
        password: "admin123",
      });
    } else {
      setFormData({
        ...formData,
        email: "student@test.com",
        password: "student123",
      });
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
                <Link
                  to="/"
                  className="inline-flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#1A237E] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">EB</span>
                  </div>
                  <span className="ml-3 text-xl font-bold text-slate-900">
                    EduBridge
                  </span>
                </Link>

                <h1
                  className="text-2xl md:text-3xl font-bold text-slate-900 mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 mb-2">
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
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-[#1A237E] hover:underline">
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
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
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-slate-700">
                    Remember me for 30 days
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#1A237E] via-[#283593] to-[#1A237E] hover:from-[#283593] hover:to-[#1A237E] text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin"
                      />
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
                    <span className="px-4 bg-white text-slate-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signin_with"
                    shape="rectangular"
                    size="large"
                    logo_alignment="left"
                    auto_select={false}
                    use_fedcm_for_prompt={false}
                  />
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#1A237E] hover:underline font-bold">
                  Sign up for free
                </Link>
              </div>

              {/* Demo Accounts */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
                  Demo Credentials
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => fillDemo("admin")}
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-left transition-colors border border-slate-200">
                    <span className="font-bold block text-slate-800 mb-0.5">
                      Admin
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      admin@edubridge.africa
                    </span>
                  </button>
                  <button
                    onClick={() => fillDemo("student")}
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-left transition-colors border border-slate-200">
                    <span className="font-bold block text-slate-800 mb-0.5">
                      Student
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      student@test.com
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Text Overlay on Image (Hidden on Mobile) */}
        <div className="hidden lg:block absolute right-0 bottom-20 pr-16 pb-12 z-10 max-w-md">
          <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
            Bridge Your Future
          </h2>
          <p className="text-lg text-white/90 drop-shadow-md">
            Join thousands of East African students achieving their educational
            dreams worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
