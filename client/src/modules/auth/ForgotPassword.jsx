import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep(2);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Password Reset Data:", formData);
    setIsLoading(false);
    setIsSuccess(true);
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl shadow-[#0F172A]/5 p-10 text-center border border-[#E2E8F0]">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D1FAE5] to-[#D1FAE5]/50 rounded-full mb-6">
              <svg className="w-10 h-10 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Password Reset Complete</h2>
            <p className="text-[#64748B] mb-8">Your password has been successfully updated. You can now sign in with your new credentials.</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-4 px-6 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:from-[#1E40AF] hover:to-[#2563EB] text-white font-semibold rounded-xl
                shadow-lg shadow-[#1E3A8A]/25 hover:shadow-xl transition-all duration-300"
            >
              <span>Continue to Sign In</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Added overflow-hidden to keep page fixed on desktop
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col lg:flex-row overflow-hidden">
      
      {/* Left Side - Branding - Fixed 40% Width on Desktop */}
      <div className="hidden lg:flex lg:w-2/5 relative h-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-slate-950">
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-[2000ms] ease-out ${isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}>
            <div className="relative w-[120%] h-[120%] animate-diamond-breathe">
              <img
                src="/images/Diamond_Web_Background_A_brilliant-cut_diamond_is_presented_against_a_nVuBY9HB (1).png"
                alt="Diamond"
                className="w-full h-full object-cover animate-diamond-prism"
                style={{ transform: 'rotateX(15deg) perspective(1000px)' }}
              />
              <div className="absolute inset-0 animate-diamond-shine pointer-events-none" />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/90 via-[#1E3A8A]/75 to-[#1E3A8A]/80 animate-gradient" style={{ backgroundSize: '200% 200%' }} />

          {/* Light Ray Effects */}
          <div className={`absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-light-ray transition-all duration-[2500ms] delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-300/20 to-transparent animate-light-ray transition-all duration-[2500ms] delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '2s' }} />

          {/* Animated Floating Orbs */}
          <div className={`absolute -top-20 -left-16 w-72 h-72 bg-white/8 rounded-full blur-3xl animate-diamond-float transition-all duration-[2500ms] ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`} />
          <div className={`absolute top-1/3 right-[-60px] w-72 h-72 bg-[#3B82F6]/15 rounded-full blur-3xl animate-pulse transition-all duration-[2500ms] delay-300 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`} />
          <div className={`absolute bottom-0 left-1/4 w-80 h-80 bg-[#60A5FA]/10 rounded-full blur-3xl animate-diamond-float transition-all duration-[2500ms] delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ animationDelay: '1s' }} />
          <div className={`absolute top-1/2 left-1/2 w-96 h-96 bg-[#3B82F6]/12 rounded-full blur-3xl animate-pulse transition-all duration-[3000ms] delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />

          {/* Sparkle Effects */}
          <div className={`absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-diamond-sparkle transition-all duration-[2000ms] delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute top-1/3 right-1/4 w-3 h-3 bg-blue-200 rounded-full animate-diamond-sparkle transition-all duration-[2000ms] delay-1200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }} />
          <div className={`absolute bottom-1/3 left-1/3 w-2 h-2 bg-white rounded-full animate-diamond-sparkle transition-all duration-[2000ms] delay-1400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1s' }} />

          {/* Animated Grid */}
          <div className={`absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] transition-opacity duration-[2000ms] animate-grid-move ${isLoaded ? 'opacity-[0.06]' : 'opacity-0'}`} />

          {/* Radial Glow Effect */}
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(15,23,42,0.4)_100%)] transition-all duration-[2000ms] ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />

        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-12">
          <div className={`flex items-start justify-between transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <Link to="/" className="group inline-flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md shadow-[0_10px_40px_rgba(255,255,255,0.08)] animate-float">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">GIW</h2>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.28em] text-slate-400">Diamond Exchange</p>
              </div>
            </Link>
            <div className="rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 text-[11px] font-medium text-[#60A5FA] backdrop-blur-md">Secure Reset</div>
          </div>

          <div className={`max-w-sm transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight text-white">
              Account <br />
              <span className="bg-gradient-to-r from-[#60A5FA] via-white to-[#93C5FD] bg-clip-text text-transparent">Recovery</span>
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">Verified password reset for diamond dealers & traders.</p>
          </div>

          <div className={`flex items-center justify-between border-t border-white/10 pt-4 transition-all duration-1000 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-xs text-[#94A3B8]">© 2025 GIW</p>
            <div className="flex items-center gap-2 text-xs text-[#CBD5E1]"><span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] animate-pulse" /> Protected</div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section - Responsive Scroll for Mobile, Fixed for Web */}
      <div className="flex-1 h-full flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto scrollbar-hide shrink-0">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex flex-col items-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-2xl mb-3 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-[#0F172A]">GIW</h1>
            </Link>
          </div>

          {/* Titles */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-2">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h1>
            <p className="text-[#64748B]">
              {step === 1 ? "Enter your email to receive reset instructions" : "Create a new secure password"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-500 ${step >= 1 ? "bg-[#1E3A8A] text-white shadow-lg" : "bg-[#E2E8F0] text-[#94A3B8]"}`}>1</div>
            <div className={`w-16 sm:w-20 h-1 mx-3 rounded-full transition-all duration-500 ${step >= 2 ? "bg-[#1E3A8A]" : "bg-[#E2E8F0]"}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-500 ${step >= 2 ? "bg-[#1E3A8A] text-white shadow-lg" : "bg-[#E2E8F0] text-[#94A3B8]"}`}>2</div>
          </div>

          {/* Forms */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="dealer@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "email"}
                  required
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
                />
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white font-semibold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                {isLoading ? "Sending..." : "Continue"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">New Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  rightElement={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#94A3B8] mr-2">{showPassword ? "Hide" : "Show"}</button>}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Confirm Password</label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 border-2 border-[#E2E8F0] rounded-xl font-semibold">Back</button>
                <button type="submit" disabled={isLoading || formData.password !== formData.confirmPassword || formData.password.length < 8} className="flex-[2] py-3.5 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white font-semibold rounded-xl shadow-lg">Reset Password</button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center">
            <p className="text-[#64748B] text-sm">
              Remember your password? <Link to="/login" className="font-semibold text-[#1E3A8A] hover:text-[#3B82F6]">Sign in</Link>
            </p>
            <p className="text-xs text-[#64748B] mt-6">Need help? Contact support@giw.exchange</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;