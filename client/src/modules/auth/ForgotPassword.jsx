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

  const icons = {
    email: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
      </svg>
    ),
    password: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  };

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

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl shadow-[#0F172A]/5 p-6 sm:p-10 text-center border border-[#E2E8F0]">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#D1FAE5] to-[#D1FAE5]/50 rounded-full mb-4 sm:mb-6">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-[#10B981]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-2">
              Password Reset Complete
            </h2>

            <p className="text-sm sm:text-base text-[#64748B] mb-6 sm:mb-8">
              Your password has been successfully updated. You can now sign in
              with your new credentials.
            </p>

            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:from-[#1E40AF] hover:to-[#2563EB] text-white font-semibold rounded-xl shadow-lg shadow-[#1E3A8A]/25 hover:shadow-xl transition-all duration-300"
            >
              <span>Continue to Sign In</span>
              <svg
                className="w-5 h-5 ml-2"
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
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-2/5 lg:h-screen relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-slate-950">
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-[2000ms] ease-out ${
              isLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
            }`}
          >
            <div className="relative w-[120%] h-[120%] animate-diamond-breathe">
              <img
                src="/images/Diamond_Web_Background_A_brilliant-cut_diamond_is_presented_against_a_nVuBY9HB (1).png"
                alt="Diamond"
                className="w-full h-full object-cover animate-diamond-prism"
                style={{ transform: "rotateX(15deg) perspective(1000px)" }}
              />
              <div className="absolute inset-0 animate-diamond-shine pointer-events-none" />
            </div>
          </div>

          <div
            className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/90 via-[#1E3A8A]/75 to-[#1E3A8A]/80 animate-gradient"
            style={{ backgroundSize: "200% 200%" }}
          />

          <div
            className={`absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-light-ray transition-all duration-[2500ms] delay-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-300/20 to-transparent animate-light-ray transition-all duration-[2500ms] delay-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ animationDelay: "2s" }}
          />

          <div
            className={`absolute -top-20 -left-16 w-72 h-72 bg-white/8 rounded-full blur-3xl animate-diamond-float transition-all duration-[2500ms] ease-out ${
              isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
            }`}
          />
          <div
            className={`absolute top-1/3 right-[-60px] w-72 h-72 bg-[#3B82F6]/15 rounded-full blur-3xl animate-pulse transition-all duration-[2500ms] delay-300 ease-out ${
              isLoaded ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
            }`}
          />
          <div
            className={`absolute bottom-0 left-1/4 w-80 h-80 bg-[#60A5FA]/10 rounded-full blur-3xl animate-diamond-float transition-all duration-[2500ms] delay-500 ease-out ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
            style={{ animationDelay: "1s" }}
          />
          <div
            className={`absolute top-1/2 left-1/2 w-96 h-96 bg-[#3B82F6]/12 rounded-full blur-3xl animate-pulse transition-all duration-[3000ms] delay-700 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            className={`absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-diamond-sparkle transition-all duration-[2000ms] delay-1000 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute top-1/3 right-1/4 w-3 h-3 bg-blue-200 rounded-full animate-diamond-sparkle transition-all duration-[2000ms] delay-1200 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className={`absolute bottom-1/3 left-1/3 w-2 h-2 bg-white rounded-full animate-diamond-sparkle transition-all duration-[2000ms] delay-1400 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ animationDelay: "1s" }}
          />

          <div
            className={`absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] transition-opacity duration-[2000ms] animate-grid-move ${
              isLoaded ? "opacity-[0.06]" : "opacity-0"
            }`}
          />

          <div
            className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(15,23,42,0.4)_100%)] transition-all duration-[2000ms] ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-12">
          <div
            className={`flex items-center transition-all duration-1000 ease-out ${
              isLoaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
            }`}
          >
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] shadow-lg transition-all duration-500 group-hover:scale-110">
                <svg
                  className="w-6 h-6 text-white"
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
              <h2 className="text-2xl font-bold tracking-tight text-white">
                GIW
              </h2>
            </Link>
          </div>

          <div
            className={`max-w-sm transition-all duration-1000 delay-300 ease-out ${
              isLoaded ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight text-white">
              Account <br />
              <span className="bg-gradient-to-r from-[#60A5FA] via-white to-[#93C5FD] bg-clip-text text-transparent">
                Recovery
              </span>
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Verified password reset for diamond dealers & traders.
            </p>
          </div>

          <div
            className={`flex items-center justify-between border-t border-white/10 pt-4 transition-all duration-1000 delay-700 ease-out ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <p className="text-xs text-[#94A3B8]">2025 GIW</p>
            <div className="flex items-center gap-2 text-xs text-[#CBD5E1]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
              Protected
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Logo */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 px-4 py-3">
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

      {/* Right Side */}
      <div className="w-full lg:w-3/5 min-h-screen lg:h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 lg:pt-0">
        <div className="w-full max-w-md p-5 sm:p-8">
          <div className="lg:hidden text-left mb-5">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              {step === 1
                ? "Enter your email to receive reset instructions"
                : "Create a new secure password"}
            </p>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h1>
            <p className="text-[#64748B]">
              {step === 1
                ? "Enter your email to receive reset instructions"
                : "Create a new secure password"}
            </p>
          </div>

          <div className="flex items-center justify-center lg:justify-start mb-6 sm:mb-8">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-500 ${
                step >= 1
                  ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/30"
                  : "bg-[#E2E8F0] text-[#94A3B8]"
              }`}
            >
              1
            </div>

            <div
              className={`w-16 sm:w-20 h-0.5 mx-2 rounded-full transition-all duration-500 ${
                step >= 2 ? "bg-[#1E3A8A]" : "bg-[#E2E8F0]"
              }`}
            />

            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-500 ${
                step >= 2
                  ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/30"
                  : "bg-[#E2E8F0] text-[#94A3B8]"
              }`}
            >
              2
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-5">
              <div className="w-full">
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Email Address
                </label>
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
                  icon={icons.email}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:from-[#1E40AF] hover:to-[#2563EB] text-white font-semibold rounded-xl shadow-lg shadow-[#1E3A8A]/25 hover:shadow-xl hover:shadow-[#1E3A8A]/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-5">
              <div className="w-full">
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  New Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "password"}
                  required
                  icon={icons.password}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  }
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Confirm Password
                </label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  isFocused={focusedField === "confirmPassword"}
                  required
                  icon={icons.password}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 sm:py-3.5 border-2 border-[#E2E8F0] rounded-xl font-semibold text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-all duration-300"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    formData.password !== formData.confirmPassword ||
                    formData.password.length < 8
                  }
                  className="flex-[2] py-3 sm:py-3.5 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] hover:from-[#1E40AF] hover:to-[#2563EB] text-white font-semibold rounded-xl shadow-lg shadow-[#1E3A8A]/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#E2E8F0] text-center">
            <p className="text-[#64748B] text-sm">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-bold text-[#1E3A8A] hover:text-[#3B82F6] transition-colors"
              >
                Sign in
              </Link>
            </p>

            <p className="text-xs text-[#64748B] mt-6">
              Need help? Contact{" "}
              <a
                href="mailto:support@giw.exchange"
                className="text-[#1E3A8A] hover:text-[#3B82F6] transition-colors"
              >
                support@giw.exchange
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;