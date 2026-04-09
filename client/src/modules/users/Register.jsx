import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    address: "",
    mobileNo: "",
    gst: "",
    password: "",
    confirmPassword: "",
    upload: null,
  });

  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Register Data:", formData);
    setIsLoading(false);
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-3.5 pl-11 rounded-xl border-2 transition-all duration-300 ease-out
    ${
      focusedField === fieldName
        ? "border-slate-400 ring-4 ring-slate-100 bg-white"
        : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
    }
    focus:outline-none focus:border-slate-500
    placeholder:text-slate-400 text-slate-700 text-sm
  `;

  const icons = {
    name: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
      </svg>
    ),
    companyName: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    mobileNo: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    address: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gst: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    password: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  };

return (
  <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex overflow-hidden">
    {/* Left Side - Branding - Animated */}
    <div className="hidden lg:flex lg:w-2/5 relative h-screen sticky top-0 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-slate-950">
        <img
          src="/images/Diamond_Web_Background_A_brilliant-cut_diamond_is_presented_against_a_nVuBY9HB (1).png"
          alt="Diamond"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-out ${isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
        />

        {/* Dark Luxury Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-slate-900/85" />

        {/* Animated Floating Orbs */}
        <div className={`absolute -top-20 -left-16 w-72 h-72 bg-white/5 rounded-full blur-3xl transition-all duration-[2500ms] ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`} />
        <div className={`absolute top-1/3 right-[-60px] w-72 h-72 bg-slate-400/10 rounded-full blur-3xl transition-all duration-[2500ms] delay-300 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`} />
        <div className={`absolute bottom-0 left-1/4 w-80 h-80 bg-slate-500/10 rounded-full blur-3xl transition-all duration-[2500ms] delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} />
        <div className={`absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse transition-all duration-[3000ms] delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />

        {/* Animated Grid */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] transition-opacity duration-[2000ms] ${isLoaded ? 'opacity-[0.06]' : 'opacity-0'}`} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-12">
        {/* Top Logo - Animated */}
        <div className={`flex items-start justify-between transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <Link to="/" className="group inline-flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-[0_10px_40px_rgba(255,255,255,0.08)] transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20 group-hover:shadow-[0_10px_60px_rgba(255,255,255,0.15)] animate-float">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent animate-shimmer" />
              <svg
                className="relative z-10 h-7 w-7 text-white"
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

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">GIW</h2>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.28em] text-slate-400">
                Diamond Exchange
              </p>
            </div>
          </Link>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-md animate-glow">
            Verified Network
          </div>
        </div>

        {/* Middle Hero Content - Simplified & Animated */}
        <div className={`max-w-sm transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md animate-pulse-slow">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Trusted by 500+ professionals
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight text-white">
            Join the
            <br />
            <span className="bg-gradient-to-r from-emerald-200 via-white to-slate-400 bg-clip-text text-transparent animate-gradient">
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
                <svg className="h-3 w-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-slate-200">{item}</span>
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
            <p className="text-xs text-slate-500">© 2025 GIW</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Secure
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Right Side - Form - Scrollable */}
    <div className="w-full lg:w-3/5 h-screen overflow-y-auto p-4 sm:p-8 lg:p-12">
      <div className="w-full max-w-2xl mx-auto py-8">
        {/* Mobile Logo */}
        <div className="lg:hidden text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl mb-4 shadow-lg">
            <svg
              className="w-7 h-7 text-white"
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
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-1">Register your diamond business</p>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500">Register your diamond business with GIW</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email Row */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {icons.name}
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses("name")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {icons.email}
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="dealer@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses("email")}
                  required
                />
              </div>
            </div>
          </div>

          {/* Company & Mobile Row */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {icons.companyName}
                </div>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Diamond Traders Ltd"
                  value={formData.companyName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("companyName")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses("companyName")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {icons.mobileNo}
                </div>
                <input
                  type="tel"
                  name="mobileNo"
                  placeholder="+91 98765 43210"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("mobileNo")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses("mobileNo")}
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Business Address
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3.5 text-slate-400">
                {icons.address}
              </div>
              <textarea
                name="address"
                placeholder="Enter your full business address..."
                rows="2"
                value={formData.address}
                onChange={handleChange}
                onFocus={() => setFocusedField("address")}
                onBlur={() => setFocusedField(null)}
                className={`${inputClasses("address")} resize-none pt-3`}
                required
              />
            </div>
          </div>

          {/* GST */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              GST Number
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                {icons.gst}
              </div>
              <input
                type="text"
                name="gst"
                placeholder="22AAAAA0000A1Z5"
                value={formData.gst}
                onChange={handleChange}
                onFocus={() => setFocusedField("gst")}
                onBlur={() => setFocusedField(null)}
                className={inputClasses("gst")}
                required
              />
            </div>
          </div>

          {/* Password Row */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {icons.password}
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`${inputClasses("password")} pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.574-2.675m2.617-2.617A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.037 3.324M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3l18 18"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {icons.password}
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  className={`${inputClasses("confirmPassword")} pr-12`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.574-2.675m2.617-2.617A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.037 3.324M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3l18 18"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Business Document Upload
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-300 cursor-pointer ${
                formData.upload
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/50"
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
                <div className="flex items-center justify-center gap-2 text-emerald-600">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">{formData.upload.name}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6 text-slate-400"
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
                  <p className="text-sm text-slate-600 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">PDF, JPG or PNG (max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 mt-0.5 text-slate-900 focus:ring-slate-900 border-slate-300 rounded"
              required
            />
            <label htmlFor="terms" className="text-sm text-slate-600">
              I agree to the{" "}
              <Link to="#" className="font-medium text-slate-900 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="#" className="font-medium text-slate-900 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl
              shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30
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
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-slate-400">
          <div className="flex items-center gap-2 text-xs">
            <svg
              className="w-4 h-4"
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
              className="w-4 h-4"
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
