import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import notify from "../../utils/notifications.jsx";
import { formatFieldValue } from "../../utils/formatters.js";
import api from "@/services/api";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    gst: "",
    password: "",
    confirmPassword: "",
    upload: null,
    type: [], // Multi-select array
    role: "Buyer", // Default role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setIsLoaded(true);
    // Get role from URL query params
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && (roleParam === 'Buyer' || roleParam === 'Seller')) {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }

    let formattedValue = formatFieldValue(name, value);

    if (["email", "city", "country"].includes(name)) {
      formattedValue = value.toLowerCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleTypeChange = (typeName) => {
    setFormData(prev => {
      const currentTypes = [...prev.type];
      if (currentTypes.includes(typeName)) {
        return { ...prev, type: currentTypes.filter(t => t !== typeName) };
      } else {
        return { ...prev, type: [...currentTypes, typeName] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      // Trim name and company, others are already handled in handleChange
      submitData.append("name", formData.name.trim());
      submitData.append("email", formData.email.toLowerCase());
      submitData.append("company", formData.company.trim());
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      submitData.append("city", formData.city.toLowerCase());
      submitData.append("country", formData.country.toLowerCase());
      submitData.append("gst", formData.gst);
      submitData.append("password", formData.password);
      submitData.append("confirmPassword", formData.confirmPassword);

      if (formData.upload) {
        submitData.append("upload", formData.upload);
      }

      submitData.append("type", JSON.stringify(formData.type));
      submitData.append("role", formData.role);

      const response = await api.post(`/auth/register`, submitData);
      const data = response.data;


      if (data.success === false) {
        notify.error("Registration Failed", data.error || "Please try again");
        throw new Error(data.error || "Registration failed");
      }

      notify.success("Registration Successful", "Your account has been created!");
      setSuccess("Registration successful! Redirecting to login...");

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        address: "",
        city: "",
        country: "",
        phone: "",
        gst: "",
        password: "",
        confirmPassword: "",
        upload: null,
        type: [],
        role: "Buyer",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      notify.error("Registration Failed", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden w-full max-w-full">
      {/* Left Side - Branding - Animated 3D Diamond */}
      <div className="hidden lg:flex lg:w-2/5 relative h-screen lg:fixed lg:left-0 lg:top-0 overflow-hidden">
        {/* Animated Background with 3D Diamond */}
        <div className="absolute inset-0 bg-slate-950">
          {/* Base Diamond Image with 3D Animations */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-[2000ms] ease-out ${isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}>
            <div className="relative w-[120%] h-[120%] animate-diamond-breathe">
              <img
                src="/images/Diamond_Web_Background_A_brilliant-cut_diamond_is_presented_against_a_nVuBY9HB (1).png"
                alt="Diamond"
                className="w-full h-full object-cover animate-diamond-prism"
                style={{ transform: 'rotateX(15deg) perspective(1000px)' }}
              />
              {/* Diamond Shine Overlay */}
              <div className="absolute inset-0 animate-diamond-shine pointer-events-none" />
            </div>
          </div>

          {/* Dark Luxury Overlay with Gradient Animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/90 via-[#1E3A8A]/75 to-[#1E3A8A]/80 animate-gradient" style={{ backgroundSize: '200% 200%' }} />

          {/* Light Ray Effects */}
          <div className={`absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-light-ray transition-all duration-[2500ms] delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-300/20 to-transparent animate-light-ray transition-all duration-[2500ms] delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '2s' }} />

          {/* Animated Floating Orbs with Enhanced Effects */}
          <div className={`absolute -top-20 -left-16 w-72 h-72 bg-white/8 rounded-full blur-3xl animate-diamond-float transition-all duration-[2500ms] ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`} />
          <div className={`absolute top-1/3 right-[-60px] w-72 h-72 bg-[#3B82F6]/15 rounded-full blur-3xl animate-pulse transition-all duration-[2500ms] delay-300 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`} />
          <div className={`absolute bottom-0 left-1/4 w-80 h-80 bg-[#60A5FA]/10 rounded-full blur-3xl animate-diamond-float transition-all duration-[2500ms] delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ animationDelay: '1s' }} />
          <div className={`absolute top-1/2 left-1/2 w-96 h-96 bg-[#3B82F6]/12 rounded-full blur-3xl animate-pulse transition-all duration-[3000ms] delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />

          {/* Sparkle Effects */}
          <div className={`absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-diamond-sparkle transition-all duration-[2000ms] delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute top-1/3 right-1/4 w-3 h-3 bg-blue-200 rounded-full animate-diamond-sparkle transition-all duration-[2000ms] delay-1200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }} />
          <div className={`absolute bottom-1/3 left-1/3 w-2 h-2 bg-white rounded-full animate-diamond-sparkle transition-all duration-[2000ms] delay-1400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1s' }} />
          <div className={`absolute top-1/2 right-1/3 w-4 h-4 bg-blue-100 rounded-full animate-diamond-sparkle transition-all duration-[2000ms] delay-1600 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1.5s' }} />

          {/* Animated Grid */}
          <div className={`absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] transition-opacity duration-[2000ms] animate-grid-move ${isLoaded ? 'opacity-[0.06]' : 'opacity-0'}`} />

          {/* Radial Glow Effect */}
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(15,23,42,0.4)_100%)] transition-all duration-[2000ms] ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-12">
          {/* Top Logo - Only Logo and GIW */}
          <div className={`flex items-center transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] shadow-lg transition-all duration-500 group-hover:scale-110">
                <svg
                  className="relative z-10 h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">GIW</h2>
            </Link>
          </div>

          {/* Middle Hero Content - Simplified & Animated */}
          <div className={`max-w-sm transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-[#CBD5E1] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#3B82F6] animate-pulse" />
              Trusted by 500+ professionals
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight text-white">
              Join the
              <br />
              <span className="bg-gradient-to-r from-[#60A5FA] via-white to-[#93C5FD] bg-clip-text text-transparent">
                Elite Network
              </span>
            </h1>

            <p className={`mt-4 text-sm leading-6 text-slate-300 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              Premium ecosystem for verified diamond dealers & traders worldwide.
            </p>

            {/* Feature Points - Minimal */}
            <div className="mt-6 flex flex-wrap gap-3">
              {['Verified', 'Premium', 'Secure'].map((item, i) => (
                <div
                  key={item}
                  className={`flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm transition-all duration-700 hover:bg-white/10 hover:scale-105 cursor-default ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${600 + i * 150}ms` }}
                >
                  <svg className="h-3 w-3 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-[#E2E8F0]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Card - Animated */}
          <div className={`space-y-4 transition-all duration-1000 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex gap-4">
              {[
                { value: '500+', label: 'Dealers' },
                { value: '24/7', label: 'Access' },
                { value: 'Global', label: 'Reach' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:border-white/20"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <p className="text-xs text-[#94A3B8]"> 2025 GIW</p>
              <div className="flex items-center gap-2 text-xs text-[#CBD5E1]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                Secure
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      {/* Mobile Logo */}
      <div className="lg:hidden px-4 py-3">
        <Link to="/" className="inline-flex items-center gap-2 group cursor-pointer">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-lg shadow-md transition-all duration-300 group-hover:scale-105">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <span className="text-base font-bold text-[#0F172A]">GIW</span>
        </Link>
      </div>

      <div className="w-full lg:w-3/5 lg:ml-[40%] lg:h-screen lg:overflow-y-auto flex items-start justify-center px-3 sm:px-6 lg:px-8 xl:p-12 pt-14 sm:pt-16 lg:pt-8">
        <div className="w-full max-w-2xl mx-auto py-6 sm:py-8 lg:py-8 px-0 sm:px-0">
          {/* Mobile Welcome Text - Only shows below header */}
          <div className="lg:hidden text-left mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base sm:text-lg font-semibold text-[#0F172A]">Create Account</h2>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                formData.role === "Buyer"
                  ? "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20"
                  : "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20"
              }`}>
                {formData.role}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">Register your diamond business</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-4 lg:mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-[#0F172A]">Create Account</h1>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                formData.role === "Buyer"
                  ? "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20"
                  : "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20"
              }`}>
                {formData.role}
              </div>
            </div>
            <p className="text-sm lg:text-base text-[#64748B]">Register your diamond business with GIW</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 min-w-0">
              <div className="min-w-0">
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="min-w-0">
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="dealer@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Company & Mobile Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 min-w-0">
              <div className="min-w-0">
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Company Name {formData.role === "Seller" && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="Diamond Traders Ltd"
                  value={formData.company}
                  onChange={handleChange}
                  className="input-field"
                  required={formData.role === "Seller"}
                />
              </div>

              <div className="min-w-0">
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Business Address {formData.role === "Seller" && <span className="text-red-500">*</span>}
              </label>
              <textarea
                name="address"
                placeholder="Enter your full business address..."
                rows="2"
                value={formData.address}
                onChange={handleChange}
                className="input-field resize-none"
                required={formData.role === "Seller"}
              />
            </div>

            {/* City & Country Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 min-w-0">
              <div className="min-w-0">
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Surat"
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="min-w-0">
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder="India"
                  value={formData.country}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Business Type Selection */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-[#0F172A] mb-3">
                Business Specialization
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'natural_diamond', label: 'Natural Diamond' },
                  { id: 'lab_grown_diamond', label: 'Lab-grown Diamond' },
                  { id: 'natural_jewellery', label: 'Natural Jewellery' },
                  { id: 'lab_grown_jewellery', label: 'Lab-grown Jewellery' },
                  { id: 'rough', label: 'Rough' },
                  { id: 'gemstone', label: 'GemStone' }
                ].map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${formData.type.includes(type.id)
                        ? "border-[#1E3A8A] bg-[#1E3A8A]/5 shadow-sm"
                        : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${formData.type.includes(type.id)
                        ? "bg-[#1E3A8A] border-[#1E3A8A]"
                        : "bg-white border-slate-300"
                      }`}>
                      {formData.type.includes(type.id) && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-bold ${formData.type.includes(type.id) ? "text-[#1E3A8A]" : "text-slate-600"
                      }`}>
                      {type.label}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.type.includes(type.id)}
                      onChange={() => handleTypeChange(type.id)}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* GST */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                GST Number {formData.role === "Seller" && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="gst"
                placeholder="22AAAAA0000A1Z5"
                value={formData.gst}
                onChange={handleChange}
                className="input-field"
                required={formData.role === "Seller"}
              />
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 min-w-0">
              <div className="min-w-0">
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.574-2.675m2.617-2.617A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.037 3.324M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.574-2.675m2.617-2.617A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.037 3.324M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-[#0F172A] mb-2">
                Business Document Upload
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-3 sm:p-5 text-center transition-all duration-300 cursor-pointer min-w-0 ${formData.upload
                    ? "border-[#3B82F6] bg-[#DBEAFE]/30"
                    : "border-[#E2E8F0] hover:border-[#3B82F6]/50 hover:bg-[#F1F5F9]"
                  }`}
              >
                <input
                  type="file"
                  name="upload"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.jpg,.jpeg,.png"
                />

                {formData.upload ? (
                  <div className="flex items-center justify-center gap-2 text-[#1E3A8A] min-w-0">
                    <svg
                      className="w-5 h-5 text-[#10B981] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-xs">{formData.upload.name}</span>
                  </div>
                ) : (
                  <div className="space-y-2 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#DBEAFE] rounded-full flex items-center justify-center mx-auto flex-shrink-0">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B82F6]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm text-[#0F172A] font-medium px-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-[#64748B]">PDF, JPG or PNG (max 10MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 min-w-0">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 mt-0.5 text-[#3B82F6] focus:ring-[#3B82F6] border-[#E2E8F0] rounded"
                required
              />
              <label htmlFor="terms" className="text-sm text-[#64748B]">
                I agree to the{" "}
                <Link to="#" className="font-medium text-[#1E3A8A] hover:text-[#3B82F6] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="font-medium text-[#1E3A8A] hover:text-[#3B82F6] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:from-[#1E40AF] hover:to-[#2563EB] text-white font-semibold rounded-xl
              shadow-lg shadow-[#1E3A8A]/25 hover:shadow-xl hover:shadow-[#1E3A8A]/30
              transition-all duration-300 hover:-translate-y-0.5
              active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0
              flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-[#64748B] text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#1E3A8A] hover:text-[#3B82F6] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[#64748B]">
            <div className="flex items-center gap-2 text-xs">
              <svg
                className="w-4 h-4 text-[#3B82F6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Verified Business Only</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <svg
                className="w-4 h-4 text-[#3B82F6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Secure Registration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
