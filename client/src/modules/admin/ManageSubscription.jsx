import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI } from "../../services/api";
import notify from "../../utils/notifications.jsx";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Package,
  Calendar,
  Hash,
  Tag,
  Search,
  AlertTriangle,
  DollarSign,
  Diamond,
  Gem,
  FileText,
  Check,
  Crown,
  TrendingUp,
  Sparkles,
  Clock,
} from "lucide-react";

const DURATION_OPTIONS = [
  { value: 1, label: "1 Month" },
  { value: 3, label: "3 Months" },
  { value: 6, label: "6 Months" },
  { value: 12, label: "12 Months" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

const shimmerVariants = {
  shimmer: {
    x: ["-100%", "100%"],
    transition: { repeat: Infinity, duration: 1.5, ease: "linear" },
  },
};

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

const formFieldVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const ManageSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Subscription buyers state
  const [buyers, setBuyers] = useState([]);
  const [buyersLoading, setBuyersLoading] = useState(true);
  const [buyersSearchTerm, setBuyersSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    durationMonth: "",
    price: "",
    stockLimit: "",
    hasDiamonds: false,
    hasJewellery: false,
    description: "",
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch subscriptions and buyers
  useEffect(() => {
    fetchSubscriptions();
    fetchSubscriptionBuyers();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getSubscriptions();
      if (response.success) {
        setSubscriptions(response.subscriptions || []);
      } else {
        notify.error("Error", "Failed to fetch subscriptions");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      notify.error("Error", "Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription buyers
  const fetchSubscriptionBuyers = async () => {
    try {
      setBuyersLoading(true);
      const response = await authAPI.getSubscriptionBuyers();
      if (response.success) {
        setBuyers(response.buyers || []);
      } else {
        notify.error("Error", "Failed to fetch subscription buyers");
      }
    } catch (error) {
      console.error("Fetch buyers error:", error);
      notify.error("Error", "Failed to fetch subscription buyers");
    } finally {
      setBuyersLoading(false);
    }
  };

  // Filter buyers
  const filteredBuyers = buyers.filter((buyer) => {
    const searchLower = buyersSearchTerm.toLowerCase();
    return (
      buyer.userName?.toLowerCase().includes(searchLower) ||
      buyer.userEmail?.toLowerCase().includes(searchLower) ||
      buyer.userCompany?.toLowerCase().includes(searchLower) ||
      buyer.planName?.toLowerCase().includes(searchLower) ||
      buyer.userPhone?.includes(buyersSearchTerm)
    );
  });

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.durationMonth?.toString().includes(searchTerm);
    return matchesSearch;
  });

  // Calculate buyers per plan (excluding cancelled subscriptions)
  const getBuyersCountForPlan = (planId) => {
    return buyers.filter(
      (buyer) => buyer.planId === planId && buyer.status?.toLowerCase() !== "cancelled"
    ).length;
  };

  // Group subscriptions by name for display
  const groupedByName = filteredSubscriptions.reduce((acc, sub) => {
    if (!acc[sub.name]) {
      acc[sub.name] = [];
    }
    acc[sub.name].push(sub);
    return acc;
  }, {});

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      durationMonth: "",
      price: "",
      stockLimit: "",
      hasDiamonds: false,
      hasJewellery: false,
      description: "",
      isActive: true,
    });
    setFormErrors({});
    setIsEditing(false);
  };

  // Open modal for new subscription
  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (subscription) => {
    setFormData({
      id: subscription.id,
      name: subscription.name,
      durationMonth: subscription.durationMonth?.toString() || "",
      price: subscription.price?.toString() || "",
      stockLimit: subscription.stockLimit?.toString() || "",
      hasDiamonds: subscription.hasDiamonds ?? false,
      hasJewellery: subscription.hasJewellery ?? false,
      description: subscription.description || "",
      isActive: subscription.isActive ?? true,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Plan name is required";
    }

    if (!formData.durationMonth) {
      errors.durationMonth = "Duration is required";
    }

    if (formData.price === "" || parseFloat(formData.price) < 0) {
      errors.price = "Price must be 0 or greater";
    }

    if (formData.stockLimit === "" || parseInt(formData.stockLimit) < 0) {
      errors.stockLimit = "Stock limit must be 0 or greater";
    }

    if (!formData.hasDiamonds && !formData.hasJewellery) {
      errors.planType = "Select at least one plan type (Diamonds or Jewellery)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        durationMonth: parseInt(formData.durationMonth),
        price: parseFloat(formData.price),
        stockLimit: parseInt(formData.stockLimit),
        hasDiamonds: formData.hasDiamonds,
        hasJewellery: formData.hasJewellery,
        description: formData.description.trim() || null,
        isActive: formData.isActive,
      };

      let response;
      if (isEditing) {
        response = await authAPI.updateSubscription(formData.id, payload);
      } else {
        response = await authAPI.createSubscription(payload);
      }

      if (response.success) {
        notify.success(
          isEditing ? "Updated" : "Created",
          `Plan ${isEditing ? "updated" : "created"} successfully`,
        );
        fetchSubscriptions();
        setShowModal(false);
        resetForm();
      } else {
        notify.error("Error", response.message || "Operation failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      notify.error(
        "Error",
        error.response?.data?.message || "Failed to save plan",
      );
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await authAPI.deleteSubscription(id);
      if (response.success) {
        notify.success("Deleted", "Plan deleted successfully");
        fetchSubscriptions();
        setDeleteConfirm(null);
      } else {
        notify.error("Error", response.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      notify.error(
        "Error",
        error.response?.data?.message || "Failed to delete plan",
      );
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Format duration label
  const getDurationLabel = (months) => {
    return (
      DURATION_OPTIONS.find((opt) => opt.value === months)?.label ||
      `${months} Months`
    );
  };

  // Calculate stats
  const stats = {
    totalPlans: subscriptions.length,
    activePlans: subscriptions.filter((s) => s.isActive).length,
    diamondPlans: subscriptions.filter((s) => s.hasDiamonds).length,
    jewelleryPlans: subscriptions.filter((s) => s.hasJewellery).length,
  };

  const statCards = [
    {
      title: "Total Plans",
      value: stats.totalPlans,
      icon: Crown,
      color: "from-[#1E3A8A] to-[#3B82F6]",
      bgColor: "bg-[#DBEAFE]",
    },
    {
      title: "Active Plans",
      value: stats.activePlans,
      icon: TrendingUp,
      color: "from-[#10B981] to-[#34D399]",
      bgColor: "bg-[#D1FAE5]",
    },
    {
      title: "Diamond Plans",
      value: stats.diamondPlans,
      icon: Diamond,
      color: "from-[#3B82F6] to-[#60A5FA]",
      bgColor: "bg-[#DBEAFE]",
    },
    {
      title: "Jewellery Plans",
      value: stats.jewelleryPlans,
      icon: Gem,
      color: "from-[#8B5CF6] to-[#A78BFA]",
      bgColor: "bg-[#EDE9FE]",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6 flex justify-between"
      >
        <div className="input-with-icon">
          <Search className="icon w-5 h-5" />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 40px -10px rgba(30, 58, 138, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white font-medium rounded-xl shadow-lg shadow-[#1E3A8A]/20 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Plan
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Plans Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0]"
      >
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#E2E8F0] relative overflow-hidden">
                  <motion.div
                    variants={shimmerVariants}
                    animate="shimmer"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 bg-[#E2E8F0] rounded relative overflow-hidden">
                    <motion.div
                      variants={shimmerVariants}
                      animate="shimmer"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    />
                  </div>
                  <div className="h-3 w-1/3 bg-[#E2E8F0] rounded relative overflow-hidden">
                    <motion.div
                      variants={shimmerVariants}
                      animate="shimmer"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-12 text-center"
          >
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] flex items-center justify-center"
            >
              <Package className="w-10 h-10 text-[#1E3A8A]" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-medium text-[#0F172A]"
            >
              No plans found
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-[#64748B] mt-1"
            >
              {searchTerm
                ? "Try adjusting your search"
                : "Create your first plan to get started"}
            </motion.p>
            {!searchTerm && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddNew}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Plan
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] sticky top-0 z-10">
                <tr className="h-12">
                  <th className="w-[18%] px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap align-top">
                    Plan
                  </th>
                  <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap align-top">
                    Type
                  </th>
                  <th className="w-[14%] px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap align-top">
                    Duration
                  </th>
                  <th className="w-[12%] px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap align-top">
                    Price
                  </th>
                  <th className="w-[14%] px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap align-top">
                    Stock Limit
                  </th>
                  <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap align-top">
                    Active Users
                  </th>
                  <th className="w-[12%] px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap align-top">
                    Status
                  </th>
                  <th className="w-[12%] px-4 py-3 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap align-top">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredSubscriptions.map((sub, index) => (
                  <motion.tr
                    key={sub.id}
                    custom={index}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.8)" }}
                    className="transition-colors group"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" />
                        <span className="font-medium text-[#0F172A] capitalize">
                          {sub.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {sub.hasDiamonds && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              delay: 0.1,
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                          >
                            <Diamond className="w-3 h-3" />
                            Diamonds
                          </motion.span>
                        )}
                        {sub.hasJewellery && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              delay: 0.15,
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                          >
                            <Gem className="w-3 h-3" />
                            Jewellery
                          </motion.span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[#475569]">
                        <Calendar className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                        <span className="text-sm">
                          {getDurationLabel(sub.durationMonth)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[#475569]">
                        <DollarSign className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                        <span className="text-sm font-semibold text-[#0F172A]">
                          ₹{sub.price?.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[#475569]">
                        <Hash className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                        <span className="text-sm">
                          {sub.stockLimit?.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                        <span className="text-sm font-semibold text-[#0F172A]">
                          {getBuyersCountForPlan(sub.id)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          delay: 0.2,
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          sub.isActive
                            ? "bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]"
                            : "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sub.isActive ? "bg-[#10B981]" : "bg-[#94A3B8]"}`}
                        />
                        {sub.isActive ? "Active" : "Inactive"}
                      </motion.span>
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <motion.button
                          whileHover={{
                            scale: 1.15,
                            backgroundColor: "rgba(59, 130, 246, 0.15)",
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(sub);
                          }}
                          className="p-2 text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{
                            scale: 1.15,
                            backgroundColor: "rgba(239, 68, 68, 0.15)",
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(sub);
                          }}
                          className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 max-h-[calc(100vh-2rem)] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0] bg-gradient-to-r from-white to-[#F8FAFC]">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${isEditing ? "bg-[#DBEAFE]" : "bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6]"}`}
                  >
                    {isEditing ? (
                      <Edit2 className="w-5 h-5 text-[#1E3A8A]" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {isEditing ? "Edit Plan" : "Add New Plan"}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Plan Name Input */}
                <motion.div
                  custom={0}
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-sm font-medium text-[#475569] mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Basic, Pro, Enterprise"
                    icon={<Tag className="w-5 h-5" />}
                    className={`${formErrors.name ? "border-[#EF4444]" : "border-[#E2E8F0]"} input-field`}
                  />
                  {formErrors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-[#EF4444]"
                    >
                      {formErrors.name}
                    </motion.p>
                  )}
                </motion.div>

                {/* Plan Type Checkboxes */}
                <motion.div
                  custom={1}
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-sm font-medium text-[#475569] mb-3">
                    Plan Type *
                  </label>
                  <div className="flex gap-4">
                    {/* Diamonds Checkbox */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleInputChange("hasDiamonds", !formData.hasDiamonds)
                      }
                      className={`flex-1 flex items-center gap-3 p-3 border-2 rounded-xl transition-all ${
                        formData.hasDiamonds
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          formData.hasDiamonds
                            ? "bg-blue-500"
                            : "border-2 border-gray-300"
                        }`}
                      >
                        {formData.hasDiamonds && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <Diamond
                        className={`w-5 h-5 ${
                          formData.hasDiamonds
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          formData.hasDiamonds
                            ? "text-blue-700"
                            : "text-gray-600"
                        }`}
                      >
                        Diamonds
                      </span>
                    </motion.button>

                    {/* Jewellery Checkbox */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleInputChange(
                          "hasJewellery",
                          !formData.hasJewellery,
                        )
                      }
                      className={`flex-1 flex items-center gap-3 p-3 border-2 rounded-xl transition-all ${
                        formData.hasJewellery
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          formData.hasJewellery
                            ? "bg-blue-500"
                            : "border-2 border-gray-300"
                        }`}
                      >
                        {formData.hasJewellery && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <Gem
                        className={`w-5 h-5 ${
                          formData.hasJewellery
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          formData.hasJewellery
                            ? "text-blue-700"
                            : "text-gray-600"
                        }`}
                      >
                        Jewellery
                      </span>
                    </motion.button>
                  </div>
                  {formErrors.planType && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-[#EF4444]"
                    >
                      {formErrors.planType}
                    </motion.p>
                  )}
                </motion.div>

                {/* Duration Dropdown */}
                <motion.div
                  custom={2}
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-sm font-medium text-[#475569] mb-2">
                    Duration (Months) *
                  </label>
                  <div className="relative input-with-icon">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                    <select
                      value={formData.durationMonth}
                      onChange={(e) =>
                        handleInputChange("durationMonth", e.target.value)
                      }
                      disabled={isEditing}
                      className={`w-full input-field ${
                        formErrors.durationMonth
                          ? "border-[#EF4444]"
                          : "border-gray-200"
                      } ${isEditing ? "bg-gray-50 cursor-not-allowed" : ""}`}
                    >
                      <option value="">Select months</option>
                      {DURATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formErrors.durationMonth && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-[#EF4444]"
                    >
                      {formErrors.durationMonth}
                    </motion.p>
                  )}
                </motion.div>

                {/* Price & Stock Limit Row */}
                <motion.div
                  custom={3}
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Price Input */}
                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="e.g., 2499"
                      icon={<DollarSign className="w-5 h-5" />}
                      className={`${formErrors.price ? "border-[#EF4444]" : "border-[#E2E8F0]"} input-field`}
                    />
                    {formErrors.price && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-[#EF4444]"
                      >
                        {formErrors.price}
                      </motion.p>
                    )}
                  </div>

                  {/* Stock Limit Input */}
                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-2">
                      Stock Limit *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stockLimit}
                      onChange={(e) =>
                        handleInputChange("stockLimit", e.target.value)
                      }
                      placeholder="e.g., 5000"
                      icon={<Hash className="w-5 h-5" />}
                      className={`${formErrors.stockLimit ? "border-[#EF4444]" : "border-[#E2E8F0]"} input-field`}
                    />
                    {formErrors.stockLimit && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-[#EF4444]"
                      >
                        {formErrors.stockLimit}
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* Description Input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-sm font-medium text-[#475569] mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-[#94A3B8]" />
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Enter plan description (optional)"
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-md text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all resize-none"
                    />
                  </div>
                </motion.div>

                {/* Active Toggle (only when editing) */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <label className="text-sm font-medium text-[#475569]">
                      Status:
                    </label>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleInputChange("isActive", !formData.isActive)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.isActive ? "bg-[#3B82F6]" : "bg-gray-300"
                      }`}
                    >
                      <motion.span
                        layout
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                          formData.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </motion.button>
                    <span className="text-sm text-[#475569]">
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </motion.div>
                )}

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]"
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 text-[#475569] font-medium hover:bg-[#F1F5F9] rounded-xl transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all duration-300"
                  >
                    <Save className="w-4 h-4" />
                    {isEditing ? "Update Plan" : "Create Plan"}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Delete Plan
                </h3>
              </div>
              <p className="text-[#64748B] mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium text-[#0F172A]">
                  {deleteConfirm.name} (
                  {getDurationLabel(deleteConfirm.durationMonth)})
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2.5 text-[#475569] font-medium hover:bg-[#F1F5F9] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EF4444] text-white font-medium rounded-xl hover:bg-[#DC2626] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageSubscription;
