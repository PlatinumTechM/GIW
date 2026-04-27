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
  Image as ImageIcon,
  Maximize2,
  Download,
} from "lucide-react";
import { notificationAPI } from "../../services/api.js";
import { showSuccess, showError } from "@/utils/notifications.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

const NotificationPage = () => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
  const [tempFilters, setTempFilters] = useState({
    type: "all",
    read: "all",
    sentBy: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Auto-open sidebar on mobile if no selection exists
    if (window.innerWidth < 1024 && !selectedNotification) {
      setIsSidebarOpen(true);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [selectedNotification]);

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
      const data = response.data || [];
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showError("Failed to load notifications", "Please try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        if (showCreateForm) setShowCreateForm(false);
        else if (showEditForm) setShowEditForm(false);
        else if (showDeleteModal) setShowDeleteModal(false);
        else if (showFilters) setShowFilters(false);
        else setSelectedNotification(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showCreateForm, showEditForm, showDeleteModal, showFilters]);

  useEffect(() => {
    const filters = {
      search: searchQuery || undefined,
      type: filterType !== "all" ? filterType : undefined,
      is_read: filterRead !== "all" ? filterRead : undefined,
      sent_by: filterSentBy !== "all" ? filterSentBy : undefined,
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

      const formData = new FormData();
      formData.append("title", newNotification.title);
      formData.append("message", newNotification.message);
      formData.append("type", newNotification.type);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      await notificationAPI.createNotification(formData);
      showSuccess("Notification sent", "Your notification has been created successfully");

      setNewNotification({
        title: "",
        message: "",
        type: "",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
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

      const formData = new FormData();
      formData.append("title", editingNotification.title);
      formData.append("message", editingNotification.message);
      formData.append("type", editingNotification.type);
      if (selectedFile) {
        formData.append("image", selectedFile);
      } else {
        formData.append("image", editingNotification.image);
      }

      await notificationAPI.updateNotification(editingNotification.id, formData);

      showSuccess("Notification updated", "Your changes have been saved successfully");

      // Update selected notification if it's the one being edited
      if (selectedNotification?.id === editingNotification.id) {
        setSelectedNotification({ ...selectedNotification, ...editingNotification });
      }

      setShowEditForm(false);
      setEditingNotification(null);
      setSelectedFile(null);
      setPreviewUrl(null);
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

      if (selectedNotification?.id === deletingId) {
        setSelectedNotification(null);
      }

      showSuccess("Notification deleted", "The notification has been removed");

      setShowDeleteModal(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      showError("Failed to delete notification", "Please try again later");
    }
  };

  const markAsRead = async (id) => {
    // Update state immediately (Optimistic Update)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    if (selectedNotification?.id === id) {
      setSelectedNotification(prev => ({ ...prev, is_read: true }));
    }

    try {
      await notificationAPI.markAsRead(id);
    } catch (error) {
      console.error("Error marking as read:", error);
      // Revert if failed (optional but good practice)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
      );
      if (selectedNotification?.id === id) {
        setSelectedNotification(prev => ({ ...prev, is_read: false }));
      }
    }
  };

  const handleSelectNotification = (notification) => {
    setSelectedNotification(notification);
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    // On mobile, close sidebar after selection
    if (windowWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const openEditForm = (notification) => {
    setEditingNotification(notification);
    setShowEditForm(true);
  };

  const openCreateForm = () => {
    setShowCreateForm(true);
  };

  const openFilters = () => {
    setTempFilters({
      type: filterType,
      read: filterRead,
      sentBy: filterSentBy,
    });
    setShowFilters(true);
  };

  const applyFilters = () => {
    setFilterType(tempFilters.type);
    setFilterRead(tempFilters.read);
    setFilterSentBy(tempFilters.sentBy);
    setShowFilters(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showError("File too large", "Maximum file size is 10MB");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterRead("all");
    setFilterSentBy("all");
    setShowFilters(false);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const getIcon = (type, size = "base", name = "") => {
    const isSmall = size === "small";
    const base = `${isSmall ? "w-8 h-8 rounded-lg" : "w-11 h-11 rounded-2xl"
      } flex items-center justify-center shadow-sm transition-all duration-300 font-bold text-xs`;

    const getInitials = (n) => {
      if (!n || n === "System") return "S";
      const parts = n.trim().split(/\s+/);
      if (parts.length === 0) return "S";
      if (parts.length === 1) return parts[0][0].toUpperCase();
      return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const initials = getInitials(name);

    switch (type) {
      case "user":
      case "natural-diamonds":
      case "lab-grown-diamonds":
        return (
          <div className={`${base} bg-[#dbeafe] border border-[#93c5fd] text-[#1e40af]`}>
            {initials}
          </div>
        );
      case "jewelry":
      case "lab-grown-jewelry":
        return (
          <div className={`${base} bg-[#fce7f3] border border-[#f9a8d4] text-[#be185d]`}>
            {initials}
          </div>
        );
      default:
        return (
          <div className={`${base} bg-[#f1f5f9] border border-[#cbd5e1] text-[#64748b]`}>
            {initials}
          </div>
        );
    }
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className={`${windowWidth < 1024 ? "h-auto" : "h-[calc(100vh-64px)]"} bg-[#F8FAFC] p-0 lg:p-4`}
    >
      <div className={`mx-auto max-w-[1600px] overflow-hidden rounded-none border-slate-200 bg-white shadow-xl shadow-slate-200/50 flex lg:rounded-3xl lg:border ${windowWidth < 1024 ? "h-auto" : "h-full"}`}>
        {/* Left Pane: Notification Details */}
        <div className={`flex-1 flex-col overflow-hidden bg-white ${windowWidth < 1024 && isSidebarOpen ? "hidden" : "flex"}`}>
          {selectedNotification ? (
            <>
              {/* Details Header */}
              <div className="border-b border-slate-100 bg-white px-4 py-3 lg:px-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <div className="shrink-0">
                      {getIcon(selectedNotification.type, "base", selectedNotification.sender_name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-extrabold text-[#0F172A] lg:text-lg">
                        {selectedNotification.sender_name || "System"}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 sm:gap-2 sm:text-xs">
                        <span className="truncate">{selectedNotification.title}</span>
                        <span className="shrink-0">•</span>
                        <span className="shrink-0 capitalize">
                          {selectedNotification.type?.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  </div>


                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => markAsRead(selectedNotification.id)}
                      className={`flex h-9 items-center justify-center gap-1.5 rounded-xl border px-2 transition-all sm:h-10 sm:px-3 ${selectedNotification.is_read
                        ? "border-slate-100 bg-slate-50 text-slate-400"
                        : "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm"
                        }`}
                      title={selectedNotification.is_read ? "Read" : "Mark as Read"}
                      disabled={selectedNotification.is_read}
                    >
                      <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden md:inline text-xs font-bold">
                        {selectedNotification.is_read ? "Read" : "Mark as Read"}
                      </span>
                    </button>

                    {Number(user?.id) === Number(selectedNotification.sender_id) && (
                      <div className="flex items-center gap-1 border-l border-slate-100 pl-1 sm:gap-2 sm:pl-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openEditForm(selectedNotification)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 sm:h-9 sm:w-9"
                        >
                          <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openDeleteModal(selectedNotification.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 sm:h-9 sm:w-9"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Body */}
              <div className={`flex-col bg-[#F8FAFC]/50 p-4 lg:flex-1 lg:overflow-y-auto lg:p-8 ${windowWidth < 1024 ? "flex" : "flex-1 overflow-y-auto"}`}>
                <motion.div
                  key={selectedNotification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto max-w-3xl"
                >
                  <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:p-10">
                    <div className="mb-6 flex items-center justify-between border-b border-slate-50 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0F172A]">
                            {selectedNotification.sender_name || "Unknown"}
                          </p>
                          <p className="text-xs font-medium text-slate-400">
                            {selectedNotification.sender_company || "System Notification"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400">
                          {new Date(selectedNotification.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          {new Date(selectedNotification.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-600">
                        {selectedNotification.message}
                      </p>
                    </div>

                    {selectedNotification.image && (
                      <div className="mt-6">
                        <div className="relative group overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 max-w-fit mx-auto">
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${selectedNotification.image}`}
                            alt="Notification"
                            className="max-h-[280px] w-full object-contain cursor-pointer transition-transform duration-500 group-hover:scale-[1.02]"
                            onClick={() => {
                              setLightboxImage(`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${selectedNotification.image}`);
                              setShowLightbox(true);
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10 pointer-events-none">
                            <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-50 pt-5 lg:mt-10 lg:pt-6">
                      <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-extrabold text-blue-600">
                        <Clock className="h-3 w-3" />
                        {formatTime(selectedNotification.created_at)}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold text-slate-600 capitalize">
                        <Diamond className="h-3 w-3" />
                        {selectedNotification.type?.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  {windowWidth < 1024 && (
                    <div className="mt-8 flex justify-center pb-8">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-extrabold text-[#0F172A] shadow-xl shadow-slate-200 ring-1 ring-slate-100 transition-all active:bg-slate-50"
                      >
                        <Inbox className="h-4 w-4 text-blue-500" />
                        Back to Messages
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-slate-50/20 p-8 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                <Bell className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-extrabold text-[#0F172A]">Select a notification</h3>
              <p className="mt-2 max-w-xs text-sm font-medium text-slate-400">
                Choose a notification from the list on the right to view its details.
              </p>
            </div>
          )}
        </div>

        <motion.div
          animate={{
            width: isSidebarOpen ? (windowWidth < 1024 ? "100%" : "400px") : "0px",
            opacity: isSidebarOpen ? 1 : 0,
            display: isSidebarOpen ? "flex" : "none",
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative flex h-full flex-col border-l border-slate-100 bg-slate-50/30"
        >
          <div className="border-b border-slate-100 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#0F172A]">Notifications</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={openFilters}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${showFilters
                      ? "border-blue-200 bg-blue-50 text-blue-600"
                      : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    <Filter className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {showFilters && (
                      <>
                        {windowWidth < 1024 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                            className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-[2px]"
                          />
                        )}
                        <motion.div
                          initial={windowWidth < 1024 ? { opacity: 0, scale: 0.9 } : { opacity: 0, y: 10 }}
                          animate={windowWidth < 1024 ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 }}
                          exit={windowWidth < 1024 ? { opacity: 0, scale: 0.9 } : { opacity: 0, y: 10 }}
                          className={`${windowWidth < 1024
                            ? "fixed inset-x-4 top-[20%] z-30 mx-auto max-w-[320px] rounded-3xl"
                            : "absolute right-0 top-12 z-30 w-64 rounded-2xl"
                            } border border-slate-100 bg-white p-5 shadow-2xl shadow-slate-900/20`}
                        >
                          {windowWidth < 1024 && (
                            <div className="mb-4 flex items-center justify-between border-b border-slate-50 pb-3">
                              <h4 className="text-sm font-extrabold text-slate-800">Filter Messages</h4>
                              <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          <div className="space-y-3">
                            <div>
                              <label className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Type
                              </label>
                              <select
                                value={tempFilters.type}
                                onChange={(e) => setTempFilters({ ...tempFilters, type: e.target.value })}
                                className="input-field"
                              >
                                {notificationTypes.map((t) => (
                                  <option key={t.value} value={t.value}>
                                    {t.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Status
                              </label>
                              <select
                                value={tempFilters.read}
                                onChange={(e) => setTempFilters({ ...tempFilters, read: e.target.value })}
                                className="input-field"
                              >
                                <option value="all">All Status</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                Sender
                              </label>
                              <select
                                value={tempFilters.sentBy}
                                onChange={(e) => setTempFilters({ ...tempFilters, sentBy: e.target.value })}
                                className="input-field"
                              >
                                <option value="all">All Senders</option>
                                <option value="me">Sent by me</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                              <button
                                onClick={applyFilters}
                                className="flex-1 rounded-xl bg-blue-600 py-2 text-xs font-extrabold text-white transition-all hover:bg-blue-700 shadow-md shadow-blue-200"
                              >
                                Apply
                              </button>
                              <button
                                onClick={clearFilters}
                                className="flex-1 rounded-xl bg-slate-100 py-2 text-xs font-extrabold text-slate-600 transition-all hover:bg-slate-200"
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openCreateForm}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            <div className="relative input-with-icon">
              <Search className="icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="input-field"
              />
            </div>
          </div>

          <div className={`flex-1 overflow-x-hidden custom-scrollbar ${windowWidth < 1024 ? "" : "overflow-y-auto"}`}>
            {loading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex animate-pulse gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-slate-200" />
                      <div className="h-3 w-1/2 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    variants={itemVariants}
                    onClick={() => handleSelectNotification(n)}
                    className={`relative flex cursor-pointer items-start gap-3 p-4 transition-all ${selectedNotification?.id === n.id
                        ? "bg-blue-50 shadow-sm ring-1 ring-blue-100/50"
                        : !n.is_read ? "bg-slate-50/50" : "bg-white hover:bg-slate-50"
                      }`}
                  >
                    {!n.is_read && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
                    )}
                    {selectedNotification?.id === n.id && (
                      <div className="absolute right-0 top-0 h-full w-1 bg-blue-500" />
                    )}
                    <div className="shrink-0">{getIcon(n.type, "small", n.sender_name)}</div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className={`truncate text-sm font-bold ${!n.is_read ? "text-[#0F172A]" : "text-slate-500"}`}>
                            {n.sender_name || "System"}
                          </h4>
                          {!n.is_read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                          )}
                        </div>
                        <span className="shrink-0 text-[10px] font-bold text-slate-400">
                          {formatTime(n.created_at)}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-400">
                        {n.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modals remain mostly the same but with updated styles if needed */}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 shrink-0">
                  <h3 className="text-lg font-extrabold text-[#0F172A]">Create Notification</h3>
                  <button onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateNotification} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">Title</label>
                    <input
                      type="text"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                      className="input-field"
                      placeholder="Notification title..."
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">Message</label>
                    <textarea
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                      className="input-field"
                      rows={4}
                      placeholder="Write your message here..."
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">Type</label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Type</option>
                      {notificationTypes.slice(1).map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">Attachment (Optional)</label>
                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <input
                          type="file"
                          id="create-image-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="create-image-upload"
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/50"
                        >
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                          <span className="text-sm font-bold text-slate-500 text-center">
                            {selectedFile ? selectedFile.name : "Choose an image..."}
                          </span>
                        </label>
                      </div>
                      {previewUrl && (
                        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                          <img src={previewUrl} alt="Preview" className="h-40 w-full object-contain p-2" />
                          <button
                            type="button"
                            onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                            className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                    Send Notification
                  </button>
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 shrink-0">
                  <h3 className="text-lg font-extrabold text-[#0F172A]">Edit Notification</h3>
                  <button onClick={() => setShowEditForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleEditNotification} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">Title</label>
                    <input
                      type="text"
                      value={editingNotification.title}
                      onChange={(e) => setEditingNotification({ ...editingNotification, title: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">Message</label>
                    <textarea
                      value={editingNotification.message}
                      onChange={(e) => setEditingNotification({ ...editingNotification, message: e.target.value })}
                      className="input-field"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">Type</label>
                    <select
                      value={editingNotification.type}
                      onChange={(e) => setEditingNotification({ ...editingNotification, type: e.target.value })}
                      className="input-field"
                    >
                      {notificationTypes.slice(1).map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">Attachment (Optional)</label>
                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <input
                          type="file"
                          id="edit-image-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="edit-image-upload"
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/50"
                        >
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                          <span className="text-sm font-bold text-slate-500 text-center">
                            {selectedFile ? selectedFile.name : (editingNotification.image ? "Change image..." : "Choose an image...")}
                          </span>
                        </label>
                      </div>
                      {(previewUrl || editingNotification.image) && (
                        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                          <img
                            src={previewUrl || `${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${editingNotification.image}`}
                            alt="Preview"
                            className="h-40 w-full object-contain p-2"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl(null);
                              if (editingNotification.image) {
                                setEditingNotification({ ...editingNotification, image: null });
                              }
                            }}
                            className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Save Changes
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && lightboxImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLightbox(false)}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center"
            >
              <div className="absolute right-6 top-6">
                <button
                  onClick={() => setShowLightbox(false)}
                  className="rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={lightboxImage}
                alt="Enlarged notification"
                className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <AlertCircle className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0F172A]">Delete Notification?</h3>
                  <p className="mt-2 text-sm font-medium text-slate-400">
                    This will permanently remove the notification.
                  </p>
                </div>
                <div className="flex border-t border-slate-100">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteNotification}
                    className="flex-1 px-4 py-4 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
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

