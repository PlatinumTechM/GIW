import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
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


  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row overflow-x-hidden">
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

            <div className="rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 text-[11px] font-medium text-[#60A5FA] backdrop-blur-md">
              Verified Network
            </div>
          </div>

          {/* Main Message - Simplified & Animated */}
          <div className={`max-w-sm transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-[#CBD5E1] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#3B82F6] animate-pulse" />
              Trusted by 10K+ professionals
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tight text-white">
              Premium
              <br />
              <span className="bg-gradient-to-r from-[#60A5FA] via-white to-[#93C5FD] bg-clip-text text-transparent">
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
                  <span className="text-[10px] lg:text-xs text-[#E2E8F0]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Info - Animated */}
          <div className={`flex items-center justify-between border-t border-white/10 pt-4 transition-all duration-1000 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-xs text-[#94A3B8]">© 2025 GIW</p>
            <div className="flex items-center gap-2 text-xs text-[#CBD5E1]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
              Secure
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 lg:ml-[40%] min-h-screen lg:h-screen flex items-start lg:items-center justify-center px-10 sm:px-20 lg:p-8 xl:p-12 pt-6 sm:pt-8 lg:pt-0 lg:overflow-auto">
        <div className="w-full max-w-md my-auto">
          {/* Mobile Logo - Clickable to Home */}
          <div className="lg:hidden text-center mb-6 sm:mb-8">
            <Link to="/" className="inline-flex flex-col items-center group cursor-pointer">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-2xl mb-3 sm:mb-4 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
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
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">GIW</h1>
                <svg className="w-5 h-5 text-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p className="text-sm text-[#64748B] mt-1">Click to go home</p>
            </Link>
            <h2 className="text-lg sm:text-xl font-semibold text-[#0F172A] mt-4">Welcome Back</h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-1">Sign in to your account</p>
          </div>


          {/* Desktop Header */}
          <div className="hidden lg:block mb-2 lg:mb-4">
            <h1 className="text-lg lg:text-xl xl:text-2xl font-bold text-[#0F172A] mb-1">Welcome Back</h1>
            <p className="text-xs lg:text-sm text-[#64748B]">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-7">
              {/* Email or Mobile */}
              <div className="w-full">
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Email or Mobile Number
                </label>
                <Input
                  type="text"
                  name="username"
                  placeholder="dealer@company.com or 9876543210"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "username"}
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />
              </div>

              {/* Password */}
              <div className="w-full">
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "password"}
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
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
                  }
                />
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#3B82F6] focus:ring-[#3B82F6] border-[#E2E8F0] rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-[#64748B]"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#1E3A8A] hover:text-[#3B82F6] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 px-6 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:from-[#1E40AF] hover:to-[#2563EB] text-white font-semibold rounded-xl
                  shadow-lg shadow-[#1E3A8A]/25 hover:shadow-xl hover:shadow-[#1E3A8A]/30
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
                <div className="w-full border-t border-[#E2E8F0]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-[#F8FAFC] text-[#94A3B8] text-sm">
                  New to GIW?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <Link
              to="/register"
              className="w-full py-2.5 sm:py-3 px-6 border-2 border-[#E2E8F0] text-[#0F172A] font-semibold rounded-xl
                hover:border-[#3B82F6] hover:bg-[#EFF6FF]
                transition-all duration-300 active:scale-[0.98]
                flex items-center justify-center gap-2 text-sm"
            >
              <span>Create Account</span>
            </Link>

          {/* Trust Badges */}
          <div className="mt-3 sm:mt-4 lg:mt-5 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 text-[#64748B] flex-wrap">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
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
              <span>Bank-grade security</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
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
              <span>256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
