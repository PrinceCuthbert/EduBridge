import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUserPlus } from "@fortawesome/free-solid-svg-icons";

function SignUpPage() {
  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    // console.log("Sign up:", formData);
    
    // Reset the form
    setFormData(initialFormState);
    
    // Reset password visibility
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
              Create Your Account
            </h1>
            <p className="text-slate-600 text-sm">
              Join EduBridge and start your educational journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-xs font-semibold text-slate-700 mb-1">
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
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-semibold text-slate-700 mb-1">
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
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

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
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

             {/* Phone Number Field - New */}
             <div>
              <label htmlFor="phoneNumber" className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="flex bg-white border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                  <div className="flex items-center px-3 border-r border-slate-300 bg-slate-50 text-slate-500">
                     <FontAwesomeIcon icon={["fas", "phone"]} /> 
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+250 788 123 456"
                    className="w-full px-3 py-2 text-sm border-none focus:ring-0"
                    // Add state handling if we add this field to initialFormState
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Country dummy dropdown */}
                <div>
                   <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                   <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                      <option>Select</option>
                      <option>Rwanda</option>
                      <option>Uganda</option>
                      <option>Kenya</option>
                      <option>Tanzania</option>
                      <option>Burundi</option>
                   </select>
                </div>
                 {/* Role dummy dropdown */}
                 <div>
                   <label className="block text-xs font-semibold text-slate-700 mb-1">I am a</label>
                   <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                      <option>Select</option>
                      <option>Student</option>
                      <option>Teacher</option>
                      <option>Parent</option>
                   </select>
                </div>
            </div>


            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1">
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
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs" />
                </button>
              </div>
              <p className="mt-1 text-[10px] text-slate-500">Must be at least 8 characters with a number and symbol</p>
            </div>

            {/* Terms */}
             <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="mt-0.5 h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-xs text-slate-700">
                  I agree to EduBridge's <Link to="/terms" className="text-primary hover:text-primary-dark">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:text-primary-dark">Privacy Policy</Link>
                </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Create Account
              <FontAwesomeIcon icon={faUserPlus} className="ml-1" />
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:text-primary-dark font-bold">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-primary">
         <img
          src="/Students.png"
          alt="Students celebrating"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-green-600 opacity-90"></div>
         
         <img
          src="/Students.png"
          alt="Students celebrating"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
        />

        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white text-center">
            <h2 className="text-4xl font-bold mb-6 drop-shadow-md">Start Your Journey Today</h2>
            <p className="text-lg text-white/90 mb-12 max-w-xl mx-auto font-light leading-relaxed">
                Create your free account and unlock access to scholarships, online courses, and study abroad opportunities.
            </p>
            
            <div className="flex justify-center gap-4 font-bold text-2xl text-white/50">
                <span className="hover:text-white transition-colors cursor-default">RW</span>
                <span className="hover:text-white transition-colors cursor-default">UG</span>
                <span className="hover:text-white transition-colors cursor-default">KE</span>
                <span className="hover:text-white transition-colors cursor-default">TZ</span>
                <span className="hover:text-white transition-colors cursor-default">BI</span>
            </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
