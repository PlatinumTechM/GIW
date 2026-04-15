import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/services/api";
import notify from "@/utils/notifications.jsx";
import { formatFieldValue } from "@/utils/formatters.js";
import {
  Diamond,
  Gem,
  Sparkles,
  Heart,
  User,
  Building2,
  Phone,
  MapPin,
  FileText,
  ChevronRight,
  Award,
  Shield,
  Edit2,
  Save,
  X,
  CheckCircle,
} from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, loading: authLoading, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    gst: "",
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        phone: user.phone || "",
        address: user.address || "",
        gst: user.gst || "",
      });
    }
    setLoading(authLoading);
  }, [user, authLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatFieldValue(name, value);
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: "", text: "" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        phone: user.phone || "",
        address: user.address || "",
        gst: user.gst || "",
      });
    }
    setMessage({ type: "", text: "" });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await authAPI.updateProfile({
        name: formData.name.trim(),
        company: formData.company.trim(),
        phone: formData.phone,
        address: formData.address.trim(),
        gst: formData.gst,
      });

      if (response.success) {
        setUser(response.user);
        // Only store role in localStorage, not full user object
        localStorage.setItem("role", response.user.role || "user");
        setIsEditing(false);
        notify.success(
          "Profile Updated",
          "Your changes have been saved successfully",
        );
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        notify.error("Save Failed", "Unable to save changes. Please try again");
        setMessage({
          type: "error",
          text: response.error || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Update profile error:", error);
      notify.error("Save Failed", "Unable to save changes. Please try again");
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFBFC] via-[#F8FAFC] to-[#E8D5B7]/20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFBFC] via-[#F8FAFC] to-[#E8D5B7]/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-3xl shadow-2xl shadow-[#0F172A]/10 border border-[#E2E8F0] p-12 max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#1E3A8A]/20">
            <Diamond className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
            Welcome to GIW
          </h2>
          <p className="text-[#64748B] mb-6">
            Please sign in to access your exclusive profile
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Sign In
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFBFC] via-[#F8FAFC] to-[#E8D5B7]/10 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Luxury Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4"
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-[#0F172A]/5 border border-[#E2E8F0] overflow-hidden">
              {/* Gold accent header */}
              <div className="h-20 sm:h-24 bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#1E3A8A] relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10"></div>
                <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#B8860B] p-1 shadow-lg shadow-[#FFD700]/30">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] bg-clip-text text-transparent">
                        {user?.name?.charAt(0)?.toUpperCase() ||
                          user?.email?.charAt(0)?.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-14 sm:pt-16 pb-4 sm:pb-6 px-4 sm:px-6 text-center">
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-1 truncate px-2">
                  {user?.name || "Valued Customer"}
                </h2>
                <p className="text-[#64748B] text-xs sm:text-sm mb-4 truncate px-2">
                  {user?.email}
                </p>

                {/* Role Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700]/30 rounded-full">
                  <Award className="w-4 h-4 text-[#B8860B]" />
                  <span className="text-sm font-semibold text-[#8B6914] capitalize">
                    {user?.role || "Member"}
                  </span>
                </div>

                {/* Stats */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#E2E8F0]">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-[#F8FAFC] to-white rounded-xl">
                      <Gem className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-[#1E3A8A]" />
                      <span className="text-base sm:text-lg font-bold text-[#0F172A]">
                        0
                      </span>
                      <p className="text-xs text-[#64748B]">Orders</p>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-[#F8FAFC] to-white rounded-xl">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-rose-500" />
                      <span className="text-base sm:text-lg font-bold text-[#0F172A]">
                        0
                      </span>
                      <p className="text-xs text-[#64748B]">Wishlist</p>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-left">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm p-2 sm:p-3 bg-[#F8FAFC] rounded-xl">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1E3A8A]" />
                    </div>
                    <span className="text-[#475569] truncate">
                      {user?.company || "No company"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm p-2 sm:p-3 bg-[#F8FAFC] rounded-xl">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1E3A8A]" />
                    </div>
                    <span className="text-[#475569]">
                      {user?.phone || "No phone"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Luxury Profile Form - Editable */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-[#0F172A]/5 border border-[#E2E8F0] overflow-hidden">
              {/* Form Header */}
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFC] to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#1E3A8A]/20 flex-shrink-0">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                        Profile Information
                      </h3>
                      <p className="text-xs text-[#64748B] hidden sm:block">
                        Your personal details are secure with us
                      </p>
                    </div>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all duration-300 w-full sm:w-auto"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleCancel}
                        disabled={saveLoading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#F1F5F9] text-[#475569] text-sm font-medium rounded-lg hover:bg-[#E2E8F0] transition-all duration-300 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saveLoading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all duration-300 disabled:opacity-50"
                      >
                        {saveLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">Saving...</span>
                            <span className="sm:hidden">Save</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {/* Message Alert */}
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                      message.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{message.text}</span>
                  </motion.div>
                )}

                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#475569] mb-1.5 sm:mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A]/10 to-[#3B82F6]/10 flex items-center justify-center">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E3A8A]" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full pl-14 sm:pl-16 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl border text-sm sm:text-base ${
                            isEditing
                              ? "border-[#1E3A8A] bg-white focus:ring-2 focus:ring-[#1E3A8A]/20"
                              : "border-[#F1F5F9] bg-[#F8FAFC]"
                          } text-[#475569] outline-none transition-all`}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#475569] mb-1.5 sm:mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-[#94A3B8]"
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
                          value={formData.email}
                          disabled
                          className="w-full pl-14 sm:pl-16 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] text-[#64748B] cursor-not-allowed text-sm sm:text-base"
                        />
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1.5 sm:mt-2 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span className="hidden sm:inline">
                          Email address cannot be changed
                        </span>
                        <span className="sm:hidden">
                          Email cannot be changed
                        </span>
                      </p>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#475569] mb-1.5 sm:mb-2">
                        Company Name
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A]/10 to-[#3B82F6]/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E3A8A]" />
                        </div>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full pl-14 sm:pl-16 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl border text-sm sm:text-base ${
                            isEditing
                              ? "border-[#1E3A8A] bg-white focus:ring-2 focus:ring-[#1E3A8A]/20"
                              : "border-[#F1F5F9] bg-[#F8FAFC]"
                          } text-[#475569] outline-none transition-all`}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#475569] mb-1.5 sm:mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A]/10 to-[#3B82F6]/10 flex items-center justify-center">
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E3A8A]" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`w-full pl-14 sm:pl-16 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl border text-sm sm:text-base ${
                            isEditing
                              ? "border-[#1E3A8A] bg-white focus:ring-2 focus:ring-[#1E3A8A]/20"
                              : "border-[#F1F5F9] bg-[#F8FAFC]"
                          } text-[#475569] outline-none transition-all`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#475569] mb-1.5 sm:mb-2">
                      Business Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 sm:left-4 top-3 sm:top-4 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A]/10 to-[#3B82F6]/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E3A8A]" />
                      </div>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                        className={`w-full pl-14 sm:pl-16 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl border text-sm sm:text-base ${
                          isEditing
                            ? "border-[#1E3A8A] bg-white focus:ring-2 focus:ring-[#1E3A8A]/20"
                            : "border-[#F1F5F9] bg-[#F8FAFC]"
                        } text-[#475569] resize-none outline-none transition-all`}
                      />
                    </div>
                  </div>

                  {/* GST */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#475569] mb-1.5 sm:mb-2">
                      GST Registration Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 flex items-center justify-center">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#B8860B]" />
                      </div>
                      <input
                        type="text"
                        name="gst"
                        value={formData.gst}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-14 sm:pl-16 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl border text-sm sm:text-base ${
                          isEditing
                            ? "border-[#1E3A8A] bg-white focus:ring-2 focus:ring-[#1E3A8A]/20"
                            : "border-[#F1F5F9] bg-[#F8FAFC]"
                        } text-[#475569] font-mono tracking-wide outline-none transition-all`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
