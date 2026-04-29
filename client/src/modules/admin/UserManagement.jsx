import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../components/ui/Input";
import { authAPI } from "../../services/api";
import notify from "../../utils/notifications.jsx";
import {
  Users,
  Search,
  Phone,
  Lock,
  Info,
  Eye,
  EyeOff,
  X,
  CheckCircle,
  XCircle,
  Shield,
  Calendar,
  Building,
  FileText,
  MapPin,
  CreditCard,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  Edit2,
  Save,
  Package,
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // Debounce search term to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordUser, setPasswordUser] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [revealedPassword, setRevealedPassword] = useState(null);
  const itemsPerPage = 10;

  // Plan update modal states
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planUser, setPlanUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [updatingPlan, setUpdatingPlan] = useState(false);

  // Sorting function
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Handle sort click
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Sort indicator icon
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg
          className="w-3 h-3 text-[#94A3B8]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortConfig.direction === "asc" ? (
      <svg
        className="w-3 h-3 text-[#1E3A8A]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-3 h-3 text-[#1E3A8A]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  // Handle password view
  const handleViewPassword = (user) => {
    setPasswordUser(user);
    setShowPasswordModal(true);
    setAdminPassword("");
  };

  // Verify admin password and show user password
  const verifyAndShowPassword = async () => {
    try {
      // Get current admin user from API (cookie-based auth)
      const currentUser = await authAPI.getCurrentUser();
      if (!currentUser.email) {
        notify.error("Error", "Admin session not found");
        return;
      }

      // Verify admin password via dedicated API (only password needed)
      const response = await authAPI.verifyAdminPassword(adminPassword);
      if (response.success) {
        setRevealedPassword(passwordUser.id);
        setShowPasswordModal(false);
        setAdminPassword("");
        notify.success("Access Granted", "User password is now visible");
      } else {
        notify.error(
          "Access Denied",
          response.message || "Incorrect admin password",
        );
      }
    } catch (error) {
      console.error("Password verification error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Incorrect admin password";
      notify.error("Access Denied", errorMessage);
    }
  };

  // Handle plan update modal open
  const handleUpdatePlan = async (user) => {
    setPlanUser(user);
    setShowPlanModal(true);
    setSelectedPlanId(user.planName ? "" : "");
    setSelectedDuration(1);

    // Fetch available subscriptions
    try {
      const response = await authAPI.getSubscriptions();
      if (response.success) {
        setSubscriptions(response.subscriptions.filter(s => s.isActive));
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      notify.error("Error", "Failed to fetch subscription plans");
    }
  };

  // Handle plan update submit
  const handlePlanUpdateSubmit = async () => {
    if (!planUser) return;

    try {
      setUpdatingPlan(true);

      const response = await authAPI.updateUserPlan(
        planUser.id,
        selectedPlanId || null,
        selectedDuration
      );

      if (response.success) {
        notify.success("Plan Updated", `User plan has been updated successfully`);
        // Save planUser ID before clearing state
        const updatedUserId = planUser?.id;
        setShowPlanModal(false);
        setPlanUser(null);
        setSelectedPlanId("");
        // Refresh users list
        await fetchUsers(searchTerm);
        // Update selectedUser to reflect new plan data immediately
        const updatedUserData = response.user;
        if (updatedUserData && selectedUser && selectedUser.id === updatedUserId) {
          setSelectedUser({
            ...selectedUser,
            planName: updatedUserData.planName || null,
            planExpiry: updatedUserData.planExpiry
              ? new Date(updatedUserData.planExpiry).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              : null,
            hasActivePlan: !!updatedUserData.planName && !!updatedUserData.planExpiry && new Date(updatedUserData.planExpiry) > new Date(),
          });
        }
      } else {
        notify.error("Error", response.message || "Failed to update user plan");
      }
    } catch (error) {
      console.error("Plan update error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user plan";
      notify.error("Error", errorMessage);
    } finally {
      setUpdatingPlan(false);
    }
  };

  // Fetch users from database
  useEffect(() => {
    fetchUsers(searchTerm);
  }, [searchTerm]);

  const fetchUsers = async (search = "") => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const response = await authAPI.getAllUsers(params);
      if (response.success) {
        // Format users for display - filter out admin users (only show users with role 'user')
        const formattedUsers = response.users
          .map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            company: user.company,
            address: user.address,
            gst: user.gst,
            document: user.document,
            type: user.type || [],
            role: user.role,
            status: user.isActive ? "active" : "inactive",
            joined: new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            avatar:
              user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U",
            planName: user.planName || null,
            planExpiry: user.planExpiry
              ? new Date(user.planExpiry).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null,
            stockCount: user.stockCount || 0,
            stockLimit: user.stockLimit || 0,
            hasActivePlan: !!user.planName && !!user.planExpiry && new Date(user.planExpiry) > new Date(),
          }));
        setUsers(formattedUsers);
      } else {
        console.error("Failed to load users:", response.message);
        notify.error("Failed to Load", "Could not fetch users from database");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      notify.error("Error", "Failed to load users from database");
    } finally {
      setLoading(false);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const toggleUserStatus = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const currentIsActive = user.status === "active";
    const newIsActive = !currentIsActive;

    try {
      const response = await authAPI.updateUserStatus(userId, newIsActive);
      if (response.success) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === userId) {
              return {
                ...u,
                status: newIsActive ? "active" : "inactive"
              };
            }
            return u;
          }),
        );
        notify.success(
          "Status Updated",
          `User ${user.name} is now ${newIsActive ? "active" : "inactive"}`,
        );
      } else {
        notify.error("Error", response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      notify.error(
        "Error",
        error.response?.data?.message || "Failed to update user status",
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0]"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form autoComplete="off" className="w-full">
            <div className="input-with-icon w-full">
              <Search className="icon w-5 h-5 text-[#1E3A8A]" />
              <input
                type="text"
                placeholder="Search by Name, Email or Company..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full input-field"
              />
            </div>
          </form>


        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[600px]"
      >
        <div className="overflow-x-auto flex-1">
          <table className="w-full min-w-[750px]">
            <thead className="bg-gradient-to-r from-[#DBEAFE] to-[#DBEAFE]/50 sticky top-0 z-10">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-4 py-4 text-left text-xs font-bold text-[#1E3A8A] uppercase tracking-wider cursor-pointer hover:bg-[#DBEAFE] transition-colors sticky top-0 group"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#1E3A8A]" />
                    <span>Name</span>
                    <SortIcon columnKey="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("role")}
                  className="px-4 py-4 text-left text-xs font-bold text-[#1E3A8A] uppercase tracking-wider cursor-pointer hover:bg-[#DBEAFE] transition-colors sticky top-0 group"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#1E3A8A]" />
                    <span>Role</span>
                    <SortIcon columnKey="role" />
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-[#1E3A8A] uppercase tracking-wider sticky top-0">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#F59E0B]" />
                    <span>Phone</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort("stockCount")}
                  className="px-4 py-4 text-center text-xs font-bold text-[#1E3A8A] uppercase tracking-wider cursor-pointer hover:bg-[#DBEAFE] transition-colors sticky top-0 group"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Package className="w-4 h-4 text-[#1E3A8A]" />
                    <span>Stock</span>
                    <SortIcon columnKey="stockCount" />
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-[#1E3A8A] uppercase tracking-wider sticky top-0">
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4 text-[#1E3A8A]" />
                    <span>Password</span>
                  </div>
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="px-4 py-4 text-center text-xs font-bold text-[#1E3A8A] uppercase tracking-wider cursor-pointer hover:bg-[#DBEAFE] transition-colors sticky top-0 group"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#F59E0B]" />
                    <span>Status</span>
                    <SortIcon columnKey="status" />
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-[#1E3A8A] uppercase tracking-wider sticky top-0">
                  <div className="flex items-center justify-center gap-2">
                    <Info className="w-4 h-4 text-[#F59E0B]" />
                    <span>Details</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 text-[#1E3A8A] animate-spin" />
                      <p className="text-[#64748B] font-medium">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                        <Search className="w-8 h-8 text-[#1E3A8A]" />
                      </div>
                      <p className="text-[#64748B] font-medium">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                  >
                    {/* Name */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#1E3A8A]/70 flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-[#DBEAFE] flex-shrink-0">
                          {user.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1E3A8A] truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#64748B] truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'Seller' ? 'bg-[#DBEAFE] text-[#1E3A8A]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
                        {user.role}
                      </span>
                    </td>
                    {/* Phone */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#F59E0B]" />
                        <p className="text-sm text-[#64748B]">
                          {user.phone || "N/A"}
                        </p>
                      </div>
                    </td>
                    {/* Stock Count */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
                          <Package className="w-3.5 h-3.5 text-[#1E3A8A]" />
                          <span className="text-sm font-semibold text-[#1E3A8A]">
                            {user.stockCount}
                          </span>
                          <span className="text-xs text-[#64748B]">
                            / {user.stockLimit || 0}
                          </span>
                        </div>
                        {user.stockLimit > 0 && (
                          <div className="w-16 h-1 mt-1 bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${user.stockCount >= user.stockLimit ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'}`}
                              style={{ width: `${Math.min((user.stockCount / user.stockLimit) * 100, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Password */}
                    <td className="px-4 py-4 text-center">
                      {revealedPassword === user.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <code className="px-2 py-1 bg-[#FBBF24]/20 text-[#1E3A8A] rounded text-xs font-mono border border-[#FBBF24]/30">
                            {user.password || "N/A"}
                          </code>
                          <button
                            onClick={() => setRevealedPassword(null)}
                            className="p-1 text-[#94A3B8] hover:text-[#1E3A8A]"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleViewPassword(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/80 text-white text-xs font-medium rounded-lg hover:from-[#1E3A8A]/90 hover:to-[#1E3A8A]/70 transition-all shadow-sm shadow-[#DBEAFE]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    {/* Details */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white text-sm font-medium rounded-lg hover:from-[#F59E0B] hover:to-[#D97706] transition-all shadow-md shadow-[#FBBF24]/30"
                        >
                          <Info className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats & Pagination */}
        <div className="px-4 sm:px-6 py-4 border-t border-[#E2E8F0] bg-gradient-to-r from-[#DBEAFE]/30 to-transparent">
          {/* Stats Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-[#F59E0B]">
                <CheckCircle className="w-4 h-4" />
                <strong>{users.filter((u) => u.status === "active").length}</strong> Active
              </span>
              <span className="flex items-center gap-1.5 text-[#1E3A8A]">
                <XCircle className="w-4 h-4" />
                <strong>{users.filter((u) => u.status === "inactive").length}</strong> Inactive
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#1E3A8A]/60">
              Showing {sortedUsers.length > 0 ? startIndex + 1 : 0} -{" "}
              {Math.min(startIndex + itemsPerPage, sortedUsers.length)} of{" "}
              {sortedUsers.length} users
            </p>
          </div>

          {/* Pagination - Mobile: Simple, Desktop: Full */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            {/* Mobile: Previous/Next only with page indicator */}
            <div className="flex items-center gap-2 sm:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Prev
              </motion.button>
              <span className="text-sm font-medium text-[#1E3A8A]/80 min-w-[60px] text-center">
                {currentPage} / {totalPages || 1}
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-2 text-sm font-medium text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </motion.button>
            </div>

            {/* Desktop: Full pagination with page numbers */}
            <div className="hidden sm:flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </motion.button>
              <div className="flex items-center gap-1">
                {totalPages <= 7 ? (
                  // Show all pages if 7 or less
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${currentPage === page
                          ? "bg-[#1E3A8A] text-white"
                          : "text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50"
                          }`}
                      >
                        {page}
                      </motion.button>
                    ),
                  )
                ) : (
                  // Show truncated pagination for many pages
                  <>
                    {/* First page */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(1)}
                      className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${currentPage === 1
                        ? "bg-[#1E3A8A] text-white"
                        : "text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50"
                        }`}
                    >
                      1
                    </motion.button>
                    {/* Ellipsis or second page */}
                    {currentPage > 3 && (
                      <span className="px-1 text-[#1E3A8A]/50">...</span>
                    )}
                    {/* Pages around current */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page !== 1 &&
                          page !== totalPages &&
                          page >= currentPage - 1 &&
                          page <= currentPage + 1,
                      )
                      .map((page) => (
                        <motion.button
                          key={page}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${currentPage === page
                            ? "bg-[#1E3A8A] text-white"
                            : "text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50"
                            }`}
                        >
                          {page}
                        </motion.button>
                      ))}
                    {/* Ellipsis before last */}
                    {currentPage < totalPages - 2 && (
                      <span className="px-1 text-[#1E3A8A]/50">...</span>
                    )}
                    {/* Last page */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${currentPage === totalPages
                        ? "bg-[#1E3A8A] text-white"
                        : "text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50"
                        }`}
                    >
                      {totalPages}
                    </motion.button>
                  </>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 text-sm font-medium text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-28 bg-gradient-to-r from-[#1E3A8A] via-[#1E3A8A]/90 to-[#1E3A8A]/80">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUserModal(false)}
                  className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </motion.button>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* User Info */}
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-6 flex justify-between items-end">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#FBBF24] flex items-center justify-center text-white text-2xl font-bold shadow-2xl border-4 border-white ring-4 ring-[#DBEAFE]"
                  >
                    {selectedUser.avatar}
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      toggleUserStatus(selectedUser.id);
                      setSelectedUser({
                        ...selectedUser,
                        status:
                          selectedUser.status === "active"
                            ? "inactive"
                            : "active",
                      });
                    }}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg ${selectedUser.status === "active"
                      ? "bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white shadow-[#FBBF24]/30 hover:from-[#F59E0B] hover:to-[#D97706]"
                      : "bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/80 text-white shadow-[#DBEAFE] hover:from-[#1E3A8A]/90 hover:to-[#1E3A8A]/70"
                      }`}
                  >
                    {selectedUser.status === "active"
                      ? "Deactivate"
                      : "Activate"}
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6"
                >
                  <h2 className="text-2xl font-bold text-[#1E3A8A]">
                    {selectedUser.name}
                  </h2>
                  <p className="text-[#64748B] mt-1">{selectedUser.email}</p>
                </motion.div>

                {/* User Details Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Phone */}
                  <div className="bg-[#DBEAFE]/30 rounded-xl p-4 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A]">
                        <Phone className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        Phone
                      </p>
                    </div>
                    <p className="font-semibold text-[#1E3A8A]">
                      {selectedUser.phone || "N/A"}
                    </p>
                  </div>

                  {/* Company */}
                  <div className="bg-[#FBBF24]/10 rounded-xl p-4 border border-[#FBBF24]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/20 flex items-center justify-center text-[#F59E0B]">
                        <Building className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        Company
                      </p>
                    </div>
                    <p className="font-semibold text-[#1E3A8A]">
                      {selectedUser.company || "N/A"}
                    </p>
                  </div>

                  {/* GST Number */}
                  <div className="bg-[#DBEAFE]/30 rounded-xl p-4 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/20 flex items-center justify-center text-[#F59E0B]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        GST Number
                      </p>
                    </div>
                    <p className="font-semibold text-[#1E3A8A]">
                      {selectedUser.gst || "N/A"}
                    </p>
                  </div>

                  {/* Joined Date */}
                  <div className="bg-[#FBBF24]/10 rounded-xl p-4 border border-[#FBBF24]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A]">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        Joined Date
                      </p>
                    </div>
                    <p className="font-semibold text-[#1E3A8A]">
                      {selectedUser.joined}
                    </p>
                  </div>
                  {/* Status */}
                  <div className="bg-[#DBEAFE]/30 rounded-xl p-4 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg ${selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} flex items-center justify-center`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        Account Status
                      </p>
                    </div>
                    <p className={`font-semibold uppercase ${selectedUser.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedUser.status}
                    </p>
                  </div>

                  {/* Plan */}
                  <div className="bg-[#DBEAFE]/30 rounded-xl p-4 border border-[#E2E8F0] relative group">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedUser.planName ? "bg-[#1E3A8A]/10 text-[#1E3A8A]" : "bg-[#E2E8F0] text-[#94A3B8]"}`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        Plan
                      </p>
                      {/* Edit Icon */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUpdatePlan(selectedUser)}
                        className="ml-auto p-1.5 rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A] hover:bg-[#1E3A8A]/20 transition-colors"
                        title="Update Plan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                    <p className={`font-semibold ${selectedUser.planName ? "text-[#1E3A8A]" : "text-[#94A3B8]"}`}>
                      {selectedUser.planName || "No Plan"}
                    </p>
                  </div>

                  {/* Plan Expiry */}
                  <div className="bg-[#FBBF24]/10 rounded-xl p-4 border border-[#FBBF24]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedUser.planExpiry ? (selectedUser.hasActivePlan ? "bg-[#FBBF24]/20 text-[#F59E0B]" : "bg-[#1E3A8A]/10 text-[#1E3A8A]") : "bg-[#E2E8F0] text-[#94A3B8]"}`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        Expiry
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className={`font-semibold ${selectedUser.planExpiry ? "text-[#1E3A8A]" : "text-[#94A3B8]"}`}>
                        {selectedUser.planExpiry || "N/A"}
                      </p>
                      {selectedUser.planExpiry && (
                        <span className={`text-[10px] font-medium ${selectedUser.hasActivePlan ? "text-[#F59E0B]" : "text-[#1E3A8A]"}`}>
                          {selectedUser.hasActivePlan ? "Active" : "Expired"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-[#DBEAFE]/30 rounded-xl p-4 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedUser.status === "active" ? "bg-[#FBBF24]/20 text-[#F59E0B]" : "bg-[#1E3A8A]/10 text-[#1E3A8A]"}`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        Status
                      </p>
                    </div>
                    <p className={`font-semibold ${selectedUser.status === "active" ? "text-[#F59E0B]" : "text-[#1E3A8A]"}`}>
                      {selectedUser.status === "active" ? "Active" : "Inactive"}
                    </p>
                  </div>

                  {/* Business Specialization - Full Width */}
                  <div className="col-span-2 bg-[#F1F5F9]/50 rounded-xl p-4 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A]">
                        <Shield className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        Business Specialization
                      </p>
                    </div>
                    {selectedUser.type && selectedUser.type.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.type.map((t) => (
                          <span key={t} className="px-3 py-1 bg-white border border-[#E2E8F0] text-[#1E3A8A] text-xs font-bold rounded-lg shadow-sm">
                            {t.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#94A3B8] italic">No specialization specified</p>
                    )}
                  </div>

                  {/* Address - Full Width */}
                  <div className="col-span-2 bg-[#FBBF24]/10 rounded-xl p-4 border border-[#FBBF24]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        Address
                      </p>
                    </div>
                    <p className="font-semibold text-[#1E3A8A] break-words">
                      {selectedUser.address || "N/A"}
                    </p>
                  </div>

                  {/* Stock Usage - Detail Card */}
                  <div className="col-span-2 sm:col-span-1 bg-[#F1F5F9]/50 rounded-xl p-4 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#1E3A8A]">
                        <Package className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        Stock Usage
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <p className="text-xl font-bold text-[#1E3A8A]">
                        {selectedUser.stockCount}
                      </p>
                      <p className="text-sm text-[#64748B] mb-1">
                        / {selectedUser.stockLimit || 0} items
                      </p>
                    </div>
                    <div className="mt-2 h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((selectedUser.stockCount / (selectedUser.stockLimit || 1)) * 100, 100)}%`
                        }}
                        className={`h-full rounded-full ${selectedUser.stockCount >= selectedUser.stockLimit ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'}`}
                      />
                    </div>
                  </div>

                  {/* Document - Full Width */}
                  <div className="col-span-2 bg-[#DBEAFE]/30 rounded-xl p-4 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedUser.document ? "bg-[#FBBF24]/20 text-[#F59E0B]" : "bg-[#E2E8F0] text-[#94A3B8]"}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-medium text-[#64748B] uppercase">
                        Document
                      </p>
                    </div>
                    {selectedUser.document ? (
                      <a
                        href={`${import.meta.env.VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')}${selectedUser.document}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white text-sm font-medium rounded-lg hover:from-[#F59E0B] hover:to-[#D97706] transition-all shadow-md shadow-[#FBBF24]/30"
                      >
                        <Eye className="w-4 h-4" />
                        View Document
                      </a>
                    ) : (
                      <p className="font-semibold text-[#94A3B8]">No Document</p>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Verification Modal */}
      <AnimatePresence>
        {showPasswordModal && passwordUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] flex items-center justify-center shadow-md shadow-[#FBBF24]/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E3A8A]">
                    Admin Verification
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    Enter your admin password to view user password
                  </p>
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2">
                  Admin Password
                </label>
                <div className="relative input-with-icon">
                  <Lock className="icon absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && verifyAndShowPassword()
                    }
                    placeholder="Enter your admin password"
                    className="input-field"
                    autoFocus
                    autoComplete="off"
                  />
                </div>
                <p className="text-xs text-[#F59E0B] mt-2 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Your admin password is required for security
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-[#64748B] bg-[#F1F5F9] rounded-xl hover:bg-[#E2E8F0] transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={verifyAndShowPassword}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/80 rounded-xl hover:from-[#1E3A8A]/90 hover:to-[#1E3A8A]/70 transition-all shadow-lg shadow-[#DBEAFE]"
                >
                  Verify & View
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan Update Modal */}
      <AnimatePresence>
        {showPlanModal && planUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPlanModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#1E3A8A]/70 flex items-center justify-center shadow-md shadow-[#DBEAFE]">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E3A8A]">
                    Update User Plan
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    Update plan for {planUser.name}
                  </p>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1E3A8A] mb-2">
                  Select Plan
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] text-[#1E3A8A] bg-white"
                >
                  <option value="">No Plan (Remove)</option>
                  {subscriptions.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} - ₹{sub.price} ({sub.durationMonth} months)
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Selection */}
              {selectedPlanId && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <label className="block text-sm font-medium text-[#1E3A8A] mb-2">
                    Duration
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] text-[#1E3A8A] bg-white"
                  >
                    <option value={1}>1 Month</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                  </select>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-[#64748B] bg-[#F1F5F9] rounded-xl hover:bg-[#E2E8F0] transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlanUpdateSubmit}
                  disabled={updatingPlan}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/80 rounded-xl hover:from-[#1E3A8A]/90 hover:to-[#1E3A8A]/70 transition-all shadow-lg shadow-[#DBEAFE] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updatingPlan ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Plan
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;