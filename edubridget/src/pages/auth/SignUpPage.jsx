import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUserPlus,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { GoogleLogin } from "@react-oauth/google";

import { toast } from "sonner";

import { validateSignUpForm } from "../utils/validation";


const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  country: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
};

function SignUpPage() {
  const navigate = useNavigate();
  const { signUp,loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const validationError = validateSignUpForm(formData);

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);

    const registrationData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim(),
      country: formData.country,
      password: formData.password,
    };

    try {
      await signUp(registrationData);

      toast.success("Account created successfully! Welcome to EduBridge.");

      setFormData(initialFormState);
      navigate("/dashboard", { replace: true });

    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create account";

      setError(errorMessage);
      toast.error(errorMessage);

    } finally {
      setLoading(false);
    }
  };

 const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const user = await loginWithGoogle(credentialResponse.credential);

    toast.success(`Welcome, ${user.name}!`);

    navigate(
      user.role === "admin"
        ? "/admin/dashboard"
        : "/dashboard",
      { replace: true }
    );
  } catch (err) {
    toast.error(err.message);
  }
};


  const handleGoogleError = () => {
    toast.error("Google Sign-Up was cancelled or failed");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background Image and Overlaying Form */}
      <div className="relative flex-1 flex items-center lg:items-start lg:pt-12">
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
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
              {/* Logo */}
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
                  Create Your Account
                </h1>
                <p className="text-slate-600 text-sm">
                  Join EduBridge and start your educational journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Email */}
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
                    className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all disabled:opacity-50"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+250 788 123 456"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all disabled:opacity-50"
                  />
                </div>

                {/* Country */}
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-semibold text-slate-700 mb-2">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] disabled:opacity-50">
                    <option value="">Select</option>
                    <option>Rwanda</option>
                    <option>Uganda</option>
                    <option>Kenya</option>
                    <option>Tanzania</option>
                    <option>Burundi</option>
                  </select>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
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
                        className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] pr-12 transition-all disabled:opacity-50"
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
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••••"
                        disabled={loading}
                        className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] pr-12 transition-all disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Password must be at least 8 characters with a number and
                  symbol
                </p>

                {/* Terms */}
                <div className="flex items-start">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 text-[#1A237E] focus:ring-[#1A237E] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="ml-2 block text-sm text-slate-700">
                    I agree to EduBridge's{" "}
                    <Link
                      to="/terms"
                      className="text-[#1A237E] hover:underline font-semibold">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-[#1A237E] hover:underline font-semibold">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <FontAwesomeIcon icon={faUserPlus} />
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

                {/* Google Sign-Up Button */}
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signup_with"
                    shape="rectangular"
                    size="large"
                    logo_alignment="left"
                    auto_select={false}
                    useOneTap={false}
                    use_fedcm_for_prompt={false}
                  />
                </div>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-[#1A237E] hover:underline font-bold">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Text Overlay on Image (Hidden on Mobile) */}
        <div className="hidden lg:block absolute right-0 bottom-20 pr-16 pb-12 z-10 max-w-md">
          <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">
            Start Your Journey Today
          </h2>
          <p className="text-lg text-white/90 drop-shadow-md">
            Create your free account and unlock access to scholarships, online
            courses, and study abroad opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
