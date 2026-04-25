import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  X,
  Trash2,
  CheckCircle,
  User,
  CreditCard,
  AlertCircle,
  Search,
  Filter,
  Diamond,
  Clock,
  MailOpen,
  Mail,
  Sparkles,
  Send,
  Edit3,
  Inbox,
} from "lucide-react";
import { notificationAPI } from "../../services/api.js";
import { showSuccess, showError } from "@/utils/notifications.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

const NotificationPage = () => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterRead, setFilterRead] = useState("all");
  const [filterSentBy, setFilterSentBy] = useState("all");

  const notificationTypes = [
    { value: "all", label: "All Types" },
    { value: "natural-diamonds", label: "Natural Diamonds" },
    { value: "lab-grown-diamonds", label: "Lab Grown Diamonds" },
    { value: "jewelry", label: "Jewelry" },
    { value: "lab-grown-jewelry", label: "Lab Grown Jewelry" },
  ];

  const fetchNotifications = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await notificationAPI.getAllNotifications(filters);
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showError("Failed to load notifications", "Please try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filters = {
      search: searchQuery || undefined,
      type: filterType !== 'all' ? filterType : undefined,
      is_read: filterRead !== 'all' ? filterRead : undefined,
      sent_by: filterSentBy !== 'all' ? filterSentBy : undefined,
    };
    fetchNotifications(filters);
  }, [searchQuery, filterType, filterRead, filterSentBy]);

  const handleCreateNotification = async (e) => {
    e.preventDefault();

    try {
      if (!newNotification.title || !newNotification.message) {
        showError("Title and message are required", "Please fill in all required fields");
        return;
      }

      if (!newNotification.type) {
        showError("Type is required", "Please select a notification type");
        return;
      }

      await notificationAPI.createNotification(newNotification);
      showSuccess("Notification sent", "Your notification has been created successfully");

      setNewNotification({
        title: "",
        message: "",
        type: "",
      });
      setShowCreateForm(false);
      fetchNotifications();
    } catch (error) {
      console.error("Error creating notification:", error);
      showError(
        "Failed to send notification",
        error.response?.data?.error || "Please try again later"
      );
    }
  };

  const handleEditNotification = async (e) => {
    e.preventDefault();

    try {
      if (!editingNotification.title || !editingNotification.message) {
        showError("Title and message are required", "Please fill in all required fields");
        return;
      }

      await notificationAPI.updateNotification(editingNotification.id, {
        title: editingNotification.title,
        message: editingNotification.message,
        type: editingNotification.type,
      });

      showSuccess("Notification updated", "Your changes have been saved successfully");
      setShowEditForm(false);
      setEditingNotification(null);
      fetchNotifications({});
    } catch (error) {
      console.error("Error updating notification:", error);
      showError(
        "Failed to update notification",
        error.response?.data?.error || "Please try again later"
      );
    }
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const deleteNotification = async () => {
    try {
      await notificationAPI.deleteNotification(deletingId);

      setNotifications((prev) => prev.filter((n) => n.id !== deletingId));
      showSuccess("Notification deleted", "The notification has been removed");

      setShowDeleteModal(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      showError("Failed to delete notification", "Please try again later");
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );

      showSuccess("Marked as read", "Notification has been marked as read");
    } catch (error) {
      console.error("Error marking as read:", error);
      showError("Failed to mark as read", "Please try again later");
    }
  };

  
  const openEditForm = (notification) => {
    setEditingNotification(notification);
    setShowEditForm(true);
  };

  const openCreateForm = () => {
    setShowCreateForm(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterRead("all");
    setFilterSentBy("all");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const getIcon = (type) => {
    const base =
      "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300";

    switch (type) {
      case "user":
        return (
          <div className={`${base} bg-[#dbeafe] border border-[#93c5fd]`}>
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e40af]" />
          </div>
        );

      case "subscription":
        return (
          <div className={`${base} bg-[#d1fae5] border border-[#6ee7b7]`}>
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-[#065f46]" />
          </div>
        );

      case "alert":
      case "warning":
        return (
          <div className={`${base} bg-[#fef3c7] border border-[#fcd34d]`}>
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#92400e]" />
          </div>
        );

      case "success":
        return (
          <div className={`${base} bg-[#d1fae5] border border-[#6ee7b7]`}>
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#065f46]" />
          </div>
        );

      case "natural-diamonds":
      case "lab-grown-diamonds":
        return (
          <div className={`${base} bg-[#dbeafe] border border-[#93c5fd]`}>
            <Diamond className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e40af]" />
          </div>
        );

      case "jewelry":
      case "lab-grown-jewelry":
        return (
          <div className={`${base} bg-[#fce7f3] border border-[#f9a8d4]`}>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#be185d]" />
          </div>
        );

      default:
        return (
          <div className={`${base} bg-[#f1f5f9] border border-[#cbd5e1]`}>
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#64748b]" />
          </div>
        );
    }
  };

  
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const readCount = notifications.filter((n) => n.is_read).length;
  const sentByMeCount = notifications.filter(
    (n) => Number(n.sender_id) === Number(user?.id)
  ).length;

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 180, damping: 22 },
    },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#E2E8F0] px-3 py-4 sm:px-6 sm:py-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Search / Filters */}
        <motion.div
          variants={cardVariants}
          className="mt-5 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-lg shadow-slate-200/60 backdrop-blur-xl sm:p-5"
        >
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_200px_160px_160px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, message or sender..."
                className="input-field !pl-12"
              />
            </div>

            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
              >
                {notificationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>

            <select
              value={filterSentBy}
              onChange={(e) => setFilterSentBy(e.target.value)}
              className="input-field"
            >
              <option value="all">Sent by</option>
              <option value="me">Sent by Me</option>
              <option value="others">Others</option>
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3 text-sm font-bold text-[#475569] transition-all hover:bg-[#EEF2FF] hover:text-[#2563EB]"
            >
              Clear
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className="mt-4 flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B82F6] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-[#2563EB] sm:px-6"
          >
            <Plus className="h-5 w-5" />
            Create Notification
          </motion.button>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          variants={cardVariants}
          className="mt-5 overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xl shadow-slate-200/70 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-2 border-b border-[#E2E8F0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F172A]">
                All Notifications
              </h2>
              <p className="text-sm font-medium text-[#64748B]">
                Showing {notifications.length}
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              <Clock className="h-3.5 w-3.5" />
              Latest first
            </div>
          </div>

          {loading ? (
            <div className="divide-y divide-[#E2E8F0]">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-6"
                >
                  <div className="shrink-0">
                    <div className="h-11 w-11 rounded-2xl bg-slate-200 sm:h-12 sm:w-12" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-40 rounded bg-slate-200 sm:w-56" />
                          <div className="h-5 w-10 rounded-full bg-slate-200" />
                        </div>
                        <div className="h-4 w-24 rounded bg-slate-200" />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-8 w-20 rounded-xl bg-slate-200" />
                        <div className="h-9 w-9 rounded-xl bg-slate-200" />
                        <div className="h-9 w-9 rounded-xl bg-slate-200" />
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="h-4 w-full rounded bg-slate-200" />
                      <div className="h-4 w-3/4 rounded bg-slate-200" />
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-6 w-24 rounded-full bg-slate-200" />
                      <div className="h-6 w-28 rounded-full bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-5 py-20 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F1F5F9]"
              >
                <Bell className="h-10 w-10 text-[#64748B]" />
              </motion.div>

              <p className="text-lg font-bold text-[#0F172A]">No notifications yet</p>
              <p className="mt-2 text-sm font-medium text-[#94A3B8]">
                Click “Create Notification” to send one
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-5 py-20 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F1F5F9]">
                <Search className="h-10 w-10 text-[#64748B]" />
              </div>

              <p className="text-lg font-bold text-[#0F172A]">No matching results</p>
              <p className="mt-2 text-sm font-medium text-[#94A3B8]">
                Try clearing your search or filters
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              <AnimatePresence>
                {notifications.map((notification, index) => {
                  const isMine = Number(notification.sender_id) === Number(user?.id);

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 18 }}
                      transition={{ delay: index * 0.035 }}
                      whileHover={{ backgroundColor: "#F8FAFC" }}
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                      className={`group relative p-4 transition-all sm:p-6 cursor-pointer ${
                        !notification.is_read
                          ? "bg-blue-50/50 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-500"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <motion.div
                          whileHover={{ scale: 1.08, rotate: 5 }}
                          whileTap={{ scale: 0.92 }}
                          className="shrink-0"
                        >
                          {getIcon(notification.type)}
                        </motion.div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3
                                  className={`break-words text-base font-extrabold sm:text-lg ${
                                    !notification.is_read
                                      ? "text-[#0F172A]"
                                      : "text-[#475569]"
                                  }`}
                                >
                                  {notification.title}
                                </h3>

                                {!notification.is_read && (
                                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                                    New
                                  </span>
                                )}
                              </div>

                              {isMine ? (
                                <p className="mt-1 text-sm font-bold text-[#3B82F6]">
                                  Sent by you
                                </p>
                              ) : (
                                <p className="mt-1 text-sm font-medium text-[#64748B]">
                                  From:{" "}
                                  <span className="font-bold text-[#0F172A]">
                                    {notification.sender_name || "Unknown"}
                                  </span>
                                  {notification.sender_company &&
                                    ` (${notification.sender_company})`}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                              {!notification.is_read && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.94 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700 transition-all hover:bg-blue-100"
                                  title="Mark as read"
                                >
                                  <span className="relative flex h-4 w-4 items-center justify-center">
                                    <Bell className="h-4 w-4 animate-pulse" />
                                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                                  </span>
                                  Unread
                                </motion.button>
                              )}

                              {isMine && (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.07 }}
                                    whileTap={{ scale: 0.93 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditForm(notification);
                                    }}
                                    className="rounded-xl bg-blue-50 p-2.5 text-blue-600 transition-all hover:bg-blue-100"
                                    title="Edit"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </motion.button>

                                  <motion.button
                                    whileHover={{ scale: 1.07 }}
                                    whileTap={{ scale: 0.93 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDeleteModal(notification.id);
                                    }}
                                    className="rounded-xl bg-red-50 p-2.5 text-red-600 transition-all hover:bg-red-100"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </motion.button>
                                </>
                              )}
                            </div>
                          </div>

                          <p className="mt-3 break-words text-sm font-medium leading-6 text-[#64748B] sm:text-[15px]">
                            {notification.message}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-bold text-[#64748B]">
                              <Clock className="h-3.5 w-3.5" />
                              {formatTime(notification.created_at)}
                            </span>

                            <span className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-bold capitalize text-[#475569]">
                              {notification.type?.replaceAll("-", " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Notification Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateForm(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            >
              <div className="max-h-[92vh] w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFC] to-white px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] shadow-lg shadow-blue-500/20">
                      <Bell className="h-5 w-5 text-white" />
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-[#0F172A] sm:text-xl">
                        Create Notification
                      </h3>
                      <p className="text-xs font-medium text-[#64748B]">
                        Send new notification
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCreateForm(false)}
                    className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                <form
                  onSubmit={handleCreateNotification}
                  className="max-h-[calc(92vh-90px)] space-y-4 overflow-y-auto p-5 sm:p-6"
                >
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#0F172A]">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newNotification.title}
                      onChange={(e) =>
                        setNewNotification({
                          ...newNotification,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter notification title"
                      className="input-field"
                      maxLength={150}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#0F172A]">
                      Message
                    </label>
                    <textarea
                      value={newNotification.message}
                      onChange={(e) =>
                        setNewNotification({
                          ...newNotification,
                          message: e.target.value,
                        })
                      }
                      placeholder="Enter notification message"
                      rows={4}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#0F172A]">
                      Type
                    </label>
                    <select
                      value={newNotification.type}
                      onChange={(e) =>
                        setNewNotification({
                          ...newNotification,
                          type: e.target.value,
                        })
                      }
                      className="input-field"
                    >
                      <option value="">
                        Select Type
                      </option>
                      <option value="natural-diamonds">Natural Diamonds</option>
                      <option value="lab-grown-diamonds">Lab Grown Diamonds</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="lab-grown-jewelry">Lab Grown Jewelry</option>
                    </select>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3B82F6] px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-[#1E40AF]"
                  >
                    <Send className="h-4 w-4" />
                    Create Notification
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Notification Modal */}
      <AnimatePresence>
        {showEditForm && editingNotification && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditForm(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            >
              <div className="max-h-[92vh] w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFC] to-white px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] shadow-lg shadow-blue-500/20">
                      <Edit3 className="h-5 w-5 text-white" />
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-[#0F172A] sm:text-xl">
                        Edit Notification
                      </h3>
                      <p className="text-xs font-medium text-[#64748B]">
                        Update your notification
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEditForm(false)}
                    className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                <form
                  onSubmit={handleEditNotification}
                  className="max-h-[calc(92vh-90px)] space-y-4 overflow-y-auto p-5 sm:p-6"
                >
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#0F172A]">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingNotification.title}
                      onChange={(e) =>
                        setEditingNotification({
                          ...editingNotification,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter notification title"
                      className="input-field"
                      maxLength={150}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#0F172A]">
                      Message
                    </label>
                    <textarea
                      value={editingNotification.message}
                      onChange={(e) =>
                        setEditingNotification({
                          ...editingNotification,
                          message: e.target.value,
                        })
                      }
                      placeholder="Enter notification message"
                      rows={4}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#0F172A]">
                      Type
                    </label>
                    <select
                      value={editingNotification.type}
                      onChange={(e) =>
                        setEditingNotification({
                          ...editingNotification,
                          type: e.target.value,
                        })
                      }
                      className="input-field"
                    >
                      <option value="natural-diamonds">Natural Diamonds</option>
                      <option value="lab-grown-diamonds">Lab Grown Diamonds</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="lab-grown-jewelry">Lab Grown Jewelry</option>
                    </select>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3B82F6] px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-[#1E40AF]"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Update Notification
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="p-7 text-center sm:p-8">
                  <motion.div
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 250, damping: 16 }}
                    className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50"
                  >
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </motion.div>

                  <h3 className="mb-2 text-2xl font-extrabold text-[#0F172A]">
                    Delete Notification
                  </h3>

                  <p className="text-sm font-medium leading-6 text-[#64748B]">
                    Are you sure you want to delete this notification? This action
                    cannot be undone.
                  </p>
                </div>

                <div className="flex border-t border-[#E2E8F0]">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 border-r border-[#E2E8F0] px-6 py-4 text-sm font-extrabold text-[#64748B] transition-colors hover:bg-[#F8FAFC]"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={deleteNotification}
                    className="flex flex-1 items-center justify-center gap-2 px-6 py-4 text-sm font-extrabold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotificationPage;