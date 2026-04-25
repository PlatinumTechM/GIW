import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { authAPI } from "@/services/api";
import notify from "@/utils/notifications.jsx";
import { formatFieldValue } from "@/utils/formatters.js";
import {
  User,
  Building2,
  Phone,
  MapPin,
  FileText,
  Shield,
  Edit2,
  Save,
  X,
  CheckCircle,
  Clock,
  Crown,
  Layout,
  Briefcase,
  Lock,
  LogOut,
  Mail,
  ChevronRight,
  Fingerprint,
  Verified,
  Camera,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

const Profile = () => {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    setUser,
    refreshUser,
    logout,
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    gst: "",
    type: [],
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        phone: user.phone || "",
        address: user.address || "",
        gst: user.gst || "",
        type: user.type || [],
      });
    }
    setLoading(authLoading);
  }, [user, authLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatFieldValue(name, value);
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleTypeChange = (typeName) => {
    if (!isEditing) return;
    setFormData((prev) => {
      const currentTypes = [...(prev.type || [])];
      if (currentTypes.includes(typeName)) {
        return { ...prev, type: currentTypes.filter((t) => t !== typeName) };
      } else {
        return { ...prev, type: [...currentTypes, typeName] };
      }
    });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const response = await authAPI.updateProfile({
        name: formData.name.trim(),
        company: formData.company.trim(),
        phone: formData.phone,
        address: formData.address.trim(),
        gst: formData.gst,
        type: formData.type,
      });

      if (response.success) {
        setUser(response.user);
        setIsEditing(false);
        notify.success("Profile Updated", "Your changes have been saved successfully.");
      } else {
        notify.error("Update Failed", response.error || "Unable to save changes.");
      }
    } catch (error) {
      notify.error("Error", "Something went wrong. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notify.error("Validation Error", "New passwords do not match.");
      return;
    }
    
    setPasswordLoading(true);
    try {
      const response = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        notify.success("Success", "Password changed successfully.");
      } else {
        notify.error("Error", response.message || "Failed to change password.");
      }
    } catch (error) {
      notify.error("Error", error.response?.data?.message || "Something went wrong.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const menuItems = [
    { id: "personal", label: "Profile Information", icon: User },
    { id: "business", label: "Business Profile", icon: Briefcase },
    { id: "plan", label: "Plan Details", icon: Crown },
    { id: "security", label: "Account Security", icon: Lock },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-[#64748B]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] p-4">
        <div className="bg-white border border-[#E2E8F0] p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-6 bg-[#F1F5F9] rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#1E3A8A]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Access Denied</h2>
          <p className="text-[#64748B] mb-8 text-sm">Please sign in to access your profile settings and business information.</p>
          <a
            href="/login"
            className="block w-full py-3 bg-[#1E3A8A] text-white font-semibold rounded-lg hover:bg-[#1E40AF] transition-all"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigtion */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden mb-6">
              {/* User Identity Card */}
              <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="relative w-20 h-20 mb-4 mx-auto lg:mx-0">
                  <div className="w-full h-full rounded-2xl bg-[#1E3A8A] flex items-center justify-center text-2xl font-bold text-white shadow-md">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="text-lg font-bold text-[#0F172A] truncate">{user?.name}</h3>
                  <p className="text-xs text-[#64748B] mb-3 truncate">{user?.email}</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E2E8F0] rounded-md text-[10px] font-bold text-[#1E3A8A] uppercase tracking-wider">
                    <Verified className="w-3 h-3" />
                    {user?.role || "Member"}
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsEditing(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all mb-1 ${
                        activeTab === item.id 
                          ? "bg-[#1E3A8A] text-white shadow-sm" 
                          : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[#E2E8F0]">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Section Content */}
                  {activeTab === "personal" && (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-[#0F172A]">Profile Information</h2>
                          <p className="text-sm text-[#64748B]">Update your personal details and contact info.</p>
                        </div>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-bold text-[#475569] hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-4 py-2 text-sm font-bold text-[#64748B] hover:text-[#0F172A]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSave}
                              disabled={saveLoading}
                              className="flex items-center gap-2 px-5 py-2 bg-[#1E3A8A] text-white text-sm font-bold rounded-lg hover:bg-[#1E40AF] transition-all disabled:opacity-50 shadow-sm"
                            >
                              {saveLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                              Save
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-sm focus:bg-white focus:border-[#1E3A8A] outline-none transition-all ${!isEditing && "opacity-70 cursor-not-allowed"}`}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                              type="email"
                              value={formData.email}
                              disabled
                              className="w-full pl-11 pr-4 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-[#64748B] text-sm cursor-not-allowed"
                            />
                          </div>
                          <p className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Verified email cannot be changed
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-sm focus:bg-white focus:border-[#1E3A8A] outline-none transition-all ${!isEditing && "opacity-70 cursor-not-allowed"}`}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Company Name</label>
                          <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-sm focus:bg-white focus:border-[#1E3A8A] outline-none transition-all ${!isEditing && "opacity-70 cursor-not-allowed"}`}
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Business Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-4 w-4 h-4 text-[#94A3B8]" />
                            <textarea
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              rows={3}
                              className={`w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-sm focus:bg-white focus:border-[#1E3A8A] outline-none transition-all resize-none ${!isEditing && "opacity-70 cursor-not-allowed"}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "business" && (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-[#0F172A]">Business Profile</h2>
                          <p className="text-sm text-[#64748B]">Professional credentials and specializations.</p>
                        </div>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-bold text-[#475569] hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                            Update
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsEditing(false)}
                              className="px-4 py-2 text-sm font-bold text-[#64748B] hover:text-[#0F172A]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSave}
                              disabled={saveLoading}
                              className="flex items-center gap-2 px-5 py-2 bg-[#1E3A8A] text-white text-sm font-bold rounded-lg hover:bg-[#1E40AF] transition-all disabled:opacity-50 shadow-sm"
                            >
                              {saveLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                              Save Changes
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">GST Registration Number</label>
                          <div className="relative max-w-md">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                              type="text"
                              name="gst"
                              value={formData.gst}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-sm focus:bg-white focus:border-[#1E3A8A] outline-none transition-all font-mono tracking-widest ${!isEditing && "opacity-70 cursor-not-allowed"}`}
                              placeholder="22AAAAA0000A1Z5"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Business Specialization</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { id: "natural_diamond", label: "Natural Diamond", icon: Crown },
                              { id: "lab_grown_diamond", label: "Lab-grown Diamond", icon: Sparkles },
                              { id: "natural_jewellery", label: "Natural Jewellery", icon: Layout },
                              { id: "lab_grown_jewellery", label: "Lab-grown Jewellery", icon: Briefcase },
                            ].map((type) => {
                              const Icon = type.icon;
                              const isSelected = formData.type?.includes(type.id);
                              return (
                                <button
                                  key={type.id}
                                  onClick={() => handleTypeChange(type.id)}
                                  disabled={!isEditing}
                                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                                    isSelected 
                                      ? "bg-[#1E3A8A]/5 border-[#1E3A8A]" 
                                      : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1]"
                                  } ${!isEditing && "cursor-default opacity-80"}`}
                                >
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isSelected ? "bg-[#1E3A8A] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className={`text-sm font-bold ${isSelected ? "text-[#1E3A8A]" : "text-[#0F172A]"}`}>{type.label}</div>
                                  </div>
                                  {isEditing && (
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[#1E3A8A] border-[#1E3A8A]" : "border-[#CBD5E1]"}`}>
                                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "plan" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-bold text-[#0F172A]">Plan Details</h2>
                        <p className="text-sm text-[#64748B]">View and manage your current subscription plan.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Current Plan Card */}
                        <div className="md:col-span-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4">
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              user?.subscriptionStatus === 'active' 
                                ? "bg-emerald-100 text-emerald-700" 
                                : "bg-rose-100 text-rose-700"
                            }`}>
                              {user?.subscriptionStatus || 'No Plan'}
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-6">
                            <div className="w-16 h-16 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-center shadow-sm">
                              <Crown className="w-8 h-8 text-[#1E3A8A]" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-[#0F172A] mb-1">
                                {user?.planName || "Free Explorer"}
                              </h3>
                              <p className="text-[#64748B] text-sm mb-4">Your current active subscription package.</p>
                              
                              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
                                  <Clock className="w-4 h-4 text-[#1E3A8A]" />
                                  <span className="text-xs font-bold text-[#475569]">
                                    Valid Until: {user?.planExpiry ? new Date(user.planExpiry).toLocaleDateString() : 'Never'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
                                  <Shield className="w-4 h-4 text-emerald-500" />
                                  <span className="text-xs font-bold text-[#475569]">Premium Support Active</span>
                                </div>
                              </div>

                              <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                                <h4 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-3">Plan Benefits</h4>
                                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                  {[
                                    "Bulk Excel Upload",
                                    "Real-time Inventory",
                                    "API Integration",
                                    "Customer Support",
                                    "Daily Analytics",
                                    "Custom Discounts"
                                  ].map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                                      </div>
                                      <span className="text-[11px] font-semibold text-[#64748B]">{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white shadow-lg shadow-[#1E3A8A]/20">
                          <h4 className="text-sm font-bold opacity-80 mb-4 uppercase tracking-wider">Usage Overview</h4>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-[10px] font-bold mb-2">
                                <span>UPLOADED STOCKS</span>
                                <span className="opacity-80">LIMIT: {user?.stockLimit?.toLocaleString() || 0}</span>
                              </div>
                              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-white h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                                  style={{ width: `${Math.min(((user?.usedStock || 0) / (user?.stockLimit || 1)) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-end justify-between">
                              <div className="text-2xl font-black">{user?.usedStock?.toLocaleString() || 0}</div>
                              <div className="text-[10px] opacity-70 pb-1">
                                {Math.round(((user?.usedStock || 0) / (user?.stockLimit || 1)) * 100)}% used
                              </div>
                            </div>
                            <p className="text-[10px] opacity-70 leading-relaxed">
                              {user?.usedStock >= user?.stockLimit 
                                ? "You have reached your upload limit. Please upgrade your plan." 
                                : `You can upload ${((user?.stockLimit || 0) - (user?.usedStock || 0)).toLocaleString()} more stocks.`}
                            </p>
                             <button 
                               onClick={() => notify.info("Subscription", "Contact Admin to upgrade plan")}
                               className="w-full py-2 bg-white text-[#1E3A8A] text-xs font-black rounded-lg hover:bg-[#F1F5F9] transition-all"
                             >
                               UPGRADE NOW
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-bold text-[#0F172A]">Account Security</h2>
                        <p className="text-sm text-[#64748B]">Update your password to keep your account secure.</p>
                      </div>
                      
                      <form onSubmit={handlePasswordSave} className="max-w-md space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Current Password</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                              type={showPasswords.current ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="w-full pl-11 pr-12 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-sm focus:bg-white focus:border-[#1E3A8A] outline-none transition-all"
                              placeholder="••••••••"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                            >
                              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">New Password</label>
                          <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="w-full pl-11 pr-12 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-sm focus:bg-white focus:border-[#1E3A8A] outline-none transition-all"
                              placeholder="••••••••"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                            >
                              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Confirm New Password</label>
                          <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                            <input
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full pl-11 pr-12 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-sm focus:bg-white focus:border-[#1E3A8A] outline-none transition-all"
                              placeholder="••••••••"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                            >
                              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={passwordLoading}
                          className="w-full py-3 bg-[#1E3A8A] text-white font-bold rounded-xl hover:bg-[#1E40AF] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                        >
                          {passwordLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                          Update Password
                        </button>
                      </form>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Profile;
