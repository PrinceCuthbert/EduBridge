import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUserPlus,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { validateSignUpForm } from "../../utils/validation";

// 1. Added dateOfBirth to initial state
const initialFormState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phoneNumber: "",
  nationality: "",
  gender: "",
  dateOfBirth: "", // <--- New Field
  password: "",
  confirmPassword: "",
};

function SignUpPage() {
  const navigate = useNavigate();
  const { signUp, loginWithGoogle } = useAuth();

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

    // 2. Added dateOfBirth to the registration payload
    const registrationData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      phoneNumber: formData.phoneNumber.trim(),
      nationality: formData.nationality.trim(),
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth, // <--- New Field Passed to Controller
      password: formData.password,
    };

    try {
      const newUser = await signUp(registrationData);
      toast.success(
        `Account created successfully! Welcome ${newUser.identity?.firstName}.`,
      );
      setFormData(initialFormState);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const errorMessage = err.message || "Failed to create account";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const user = await loginWithGoogle();
      toast.success(`Welcome, ${user.identity?.firstName || "User"}!`);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard", {
        replace: true,
      });
    } catch (err) {
      toast.error(err.message || "Google Sign-Up failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative flex-1 flex items-center lg:items-start lg:pt-12">
        <img
          src="/Students.png"
          alt="Students studying"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-[#1A237E]/50 to-slate-900/60" />

        <div className="relative z-10 w-full lg:w-1/2 px-6 py-12 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
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

                {/* Row 1: Name */}
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

                {/* Row 2: Account Credentials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-semibold text-slate-700 mb-2">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe99"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all disabled:opacity-50"
                    />
                  </div>
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
                </div>

                {/* Row 3: Contact & Nationality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <label
                      htmlFor="nationality"
                      className="block text-sm font-semibold text-slate-700 mb-2">
                      Nationality
                    </label>
                    <input
                      id="nationality"
                      name="nationality"
                      type="text"
                      required
                      value={formData.nationality}
                      onChange={handleChange}
                      placeholder="e.g. Rwandan"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Row 4: Demographics (DOB & Gender) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-semibold text-slate-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] transition-all disabled:opacity-50 text-slate-700"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-semibold text-slate-700 mb-2">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A237E] disabled:opacity-50 text-slate-900 cursor-pointer">
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Row 5: Passwords */}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#1A237E] via-[#283593] to-[#1A237E] hover:from-[#283593] hover:to-[#1A237E] text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="animate-spin"
                      />{" "}
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account <FontAwesomeIcon icon={faUserPlus} />
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
                    onClick={handleGoogleSignUp}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Sign up with Google
                  </button>
                </div>
              </form>

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
