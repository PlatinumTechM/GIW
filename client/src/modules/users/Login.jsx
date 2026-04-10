import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Login Data:", formData);
    setIsLoading(false);
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-300 ease-out
    ${
      focusedField === fieldName
        ? "border-slate-400 ring-4 ring-slate-100 bg-white"
        : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
    }
    focus:outline-none focus:border-slate-500
    placeholder:text-slate-400 text-slate-700 text-sm
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col lg:flex-row">
      {/* Left Side - Branding - Animated */}
      <div className="hidden lg:flex lg:w-2/5 relative h-screen lg:fixed lg:left-0 lg:top-0 overflow-hidden">
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
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12 h-full w-full">
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

          {/* Main Message - Simplified & Animated */}
          <div className={`max-w-sm transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md animate-pulse-slow">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Trusted by 10K+ professionals
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tight text-white">
              Premium
              <br />
              <span className="bg-gradient-to-r from-emerald-200 via-white to-slate-400 bg-clip-text text-transparent animate-gradient">
                Diamond Platform
              </span>
            </h1>

            <p className={`mt-3 lg:mt-4 text-xs lg:text-sm leading-5 lg:leading-6 text-slate-300 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              Secure B2B marketplace connecting trusted diamond dealers worldwide.
            </p>

            {/* Stats - Minimal */}
            <div className="mt-4 lg:mt-6 flex flex-wrap gap-2 lg:gap-3">
              {['10K+ Active', '$2B+ Volume', '99.9% Uptime'].map((item, i) => (
                <div
                  key={item}
                  className={`flex items-center gap-1.5 lg:gap-2 rounded-full border border-white/10 bg-white/5 px-2 lg:px-3 py-1 lg:py-1.5 backdrop-blur-sm transition-all duration-700 hover:bg-white/10 hover:scale-105 cursor-default ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${600 + i * 150}ms` }}
                >
                  <span className="text-[10px] lg:text-xs text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Info - Animated */}
          <div className={`flex items-center justify-between border-t border-white/10 pt-4 transition-all duration-1000 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-xs text-slate-500">© 2025 GIW</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Secure
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 lg:ml-[40%] min-h-screen flex items-start lg:items-center justify-center p-3 sm:p-4 lg:p-6 xl:p-8">
        <div className="w-full max-w-md my-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl mb-3 sm:mb-4 shadow-lg">
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
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">Sign in to your account</p>
          </div>


          {/* Desktop Header */}
          <div className="hidden lg:block mb-2 lg:mb-4">
            <h1 className="text-lg lg:text-xl xl:text-2xl font-bold text-slate-900 mb-1">Welcome Back</h1>
            <p className="text-xs lg:text-sm text-slate-500">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 lg:space-y-5">
              {/* Email */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
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

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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

              {/* Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-slate-600"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl
                  shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30
                  transition-all duration-300 hover:-translate-y-0.5
                  active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
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

            {/* Divider */}
            <div className="relative my-3 sm:my-4 lg:my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-slate-400 text-sm">
                  New to GIW?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <Link
              to="/register"
              className="w-full py-2.5 sm:py-3 px-6 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl
                hover:border-slate-400 hover:bg-slate-50
                transition-all duration-300 active:scale-[0.98]
                flex items-center justify-center gap-2 text-sm"
            >
              <span>Create Account</span>
            </Link>

          {/* Trust Badges */}
          <div className="mt-3 sm:mt-4 lg:mt-5 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
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
              <span>Bank-grade security</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
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
              <span>256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
