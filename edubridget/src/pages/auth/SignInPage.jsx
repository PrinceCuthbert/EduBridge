import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faRightToBracket,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth(); // Brought in loginWithGoogle

  const from = location.state?.from?.pathname || "/dashboard";

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Call the Controller
      const user = await login({
        identifier: formData.identifier,
        password: formData.password,
      });
      const displayName = user.username || user.identity?.firstName || "User";
      toast.success(`Welcome back, ${displayName}!`);

      // 2. Route based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from === "/admin/dashboard" ? "/dashboard" : from, {
          replace: true,
        });
      }
    } catch (err) {
      setError(
        err.message || "Failed to sign in. Please check your credentials.",
      );
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await loginWithGoogle();
      const displayName = user.username || user.identity?.firstName || "User";
      toast.success(`Welcome back, ${displayName}!`);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      toast.error(
        err.message || "Failed to sign in with Google. Please try again.",
      );
    }
  };

  const fillDemo = (role) => {
    if (!import.meta.env.DEV) return;
    if (role === "admin") {
      setFormData({
        ...formData,
        identifier: "admin@edubridge.africa",
        password: "admin123",
      });
    } else {
      setFormData({
        ...formData,
        identifier: "student@test.com",
        password: "student123",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background Image and Overlaying Form */}
      <div className="relative flex-1 flex items-center lg:items-start lg:pt-20">
        <img
          src="/Students.png"
          alt="Students studying"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-[#1A237E]/50 to-slate-900/60" />

        <div className="relative z-10 w-full lg:w-1/2 px-6 py-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
              {/* Header */}
              <div className="text-center mb-6">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center mb-4">
                  <div className="w-12 h-12">
                    <img
                      src="/tmlogo.jpg"
                      alt="TM EduBridge Logo"
                      className="w-full h-full rounded-full object-cover ring-2 ring-primary/30 shadow-lg"
                    />
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-sm font-semibold text-slate-700 mb-2">
                    Email or Username
                  </label>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all disabled:opacity-50 text-slate-900"
                    placeholder="email@example.com or username"
                  />
                </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#1A237E] via-[#283593] to-[#1A237E] hover:from-[#283593] hover:to-[#1A237E] text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin"
                      />{" "}
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In <FontAwesomeIcon icon={faRightToBracket} />
                    </>
                  )}
                </button>

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

                <div className="w-full">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm">
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    Sign in with Google
                  </button>
                </div>
              </form>

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
