import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

function SignInPage() {

  const initialFormState = {
  email: "",
  password: "",
  };

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState(initialFormState);

 const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign in:", formData);
    
    // 2. Reset the data
    setFormData(initialFormState);
    
    // 3. Optional: Reset password visibility too?
    setShowPassword(false); 
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">TM</span>
            </div>
            <span className="ml-2 text-2xl font-bold text-slate-900">EduBridge</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Sign in to your account
          </h1>
          <p className="text-slate-600">
            Or{" "}
            <Link to="/signup" className="text-primary hover:text-primary-dark font-medium">
              create a new account
            </Link>
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-sm text-slate-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-900 mb-2">
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
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark">
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faRightToBracket} />
              Sign in
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm font-bold text-slate-900 mb-2">Demo Accounts:</p>
            <div className="text-xs space-y-1">
              <p>
                <span className="font-bold text-blue-700">Admin:</span>{" "}
                <span className="text-slate-600">admin@edubridge.com / admin123</span>
              </p>
              <p>
                <span className="font-bold text-blue-700">Student:</span>{" "}
                <span className="text-slate-600">student@edubridge.com / student123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
