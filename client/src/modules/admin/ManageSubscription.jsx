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
} from "lucide-react";

const DURATION_OPTIONS = [
  { value: 1, label: "1 Month" },
  { value: 3, label: "3 Months" },
  { value: 6, label: "6 Months" },
  { value: 12, label: "12 Months" },
];

const ManageSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    durationMonth: "",
    price: "",
    stockLimit: "",
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch subscriptions
  useEffect(() => {
    fetchSubscriptions();
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

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.durationMonth?.toString().includes(searchTerm);
    return matchesSearch;
  });

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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Manage Subscription Plans
            </h1>
            <p className="text-[#64748B] mt-1">
              Create and manage subscription plans with pricing
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Add Plan
          </motion.button>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all"
          />
        </div>
      </motion.div>

      {/* Plans Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden"
      >
        {loading ? (
          <div className="p-8 text-center text-[#64748B]">Loading...</div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="p-8 text-center text-[#64748B]">
            <Package className="w-12 h-12 mx-auto mb-3 text-[#CBD5E1]" />
            <p>No plans found</p>
            <p className="text-sm mt-1">
              {searchTerm
                ? "Try adjusting your search"
                : "Create your first plan"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#475569]">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#475569]">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#475569]">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#475569]">
                    Stock Limit
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#475569]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-[#475569]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredSubscriptions.map((sub, index) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#1E3A8A]" />
                        <span className="font-medium text-[#0F172A] capitalize">
                          {sub.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-[#475569]">
                        <Calendar className="w-4 h-4" />
                        <span>{getDurationLabel(sub.durationMonth)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-[#475569]">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">
                          ₹{sub.price?.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-[#475569]">
                        <Hash className="w-4 h-4" />
                        <span>{sub.stockLimit?.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sub.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {sub.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(sub)}
                          className="p-2 text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteConfirm(sub)}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {isEditing ? "Edit Plan" : "Add New Plan"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Plan Name Input */}
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-2">
                    Plan Name *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="e.g., Basic, Pro, Enterprise"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all ${
                        formErrors.name
                          ? "border-[#EF4444]"
                          : "border-[#E2E8F0]"
                      }`}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-[#EF4444]">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Duration Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-2">
                    Duration *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                    <select
                      value={formData.durationMonth}
                      onChange={(e) =>
                        handleInputChange("durationMonth", e.target.value)
                      }
                      disabled={isEditing}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all appearance-none ${
                        formErrors.durationMonth
                          ? "border-[#EF4444]"
                          : "border-[#E2E8F0]"
                      } ${isEditing ? "bg-gray-50 cursor-not-allowed" : ""}`}
                    >
                      <option value="">Select duration</option>
                      {DURATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formErrors.durationMonth && (
                    <p className="mt-1 text-sm text-[#EF4444]">
                      {formErrors.durationMonth}
                    </p>
                  )}
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-2">
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="e.g., 2499"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all ${
                        formErrors.price
                          ? "border-[#EF4444]"
                          : "border-[#E2E8F0]"
                      }`}
                    />
                  </div>
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-[#EF4444]">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                {/* Stock Limit Input */}
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-2">
                    Stock Limit *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                    <input
                      type="number"
                      min="0"
                      value={formData.stockLimit}
                      onChange={(e) =>
                        handleInputChange("stockLimit", e.target.value)
                      }
                      placeholder="e.g., 5000"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all ${
                        formErrors.stockLimit
                          ? "border-[#EF4444]"
                          : "border-[#E2E8F0]"
                      }`}
                    />
                  </div>
                  {formErrors.stockLimit && (
                    <p className="mt-1 text-sm text-[#EF4444]">
                      {formErrors.stockLimit}
                    </p>
                  )}
                </div>

                {/* Active Toggle (only when editing) */}
                {isEditing && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-[#475569]">
                      Status:
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange("isActive", !formData.isActive)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.isActive ? "bg-[#3B82F6]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-[#475569]">
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 text-[#475569] font-medium hover:bg-[#F1F5F9] rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all duration-300"
                  >
                    <Save className="w-4 h-4" />
                    {isEditing ? "Update" : "Create"}
                  </motion.button>
                </div>
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
