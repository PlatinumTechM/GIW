import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../components/ui/Input";

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Smith", email: "john.smith@example.com", phone: "+1 555-123-4567", role: "User", status: "active", joined: "Jan 15, 2025", lastActive: "2 hours ago", avatar: "JS" },
    { id: 2, name: "Sarah Johnson", email: "sarah.johnson@example.com", phone: "+1 555-234-5678", role: "User", status: "active", joined: "Jan 14, 2025", lastActive: "5 hours ago", avatar: "SJ" },
    { id: 3, name: "Mike Brown", email: "mike.brown@example.com", phone: "+1 555-345-6789", role: "Dealer", status: "inactive", joined: "Jan 10, 2025", lastActive: "3 days ago", avatar: "MB" },
    { id: 4, name: "Emily Davis", email: "emily.davis@example.com", phone: "+1 555-456-7890", role: "User", status: "active", joined: "Jan 8, 2025", lastActive: "1 day ago", avatar: "ED" },
    { id: 5, name: "Chris Wilson", email: "chris.wilson@example.com", phone: "+1 555-567-8901", role: "Dealer", status: "active", joined: "Jan 5, 2025", lastActive: "Just now", avatar: "CW" },
    { id: 6, name: "Jessica Lee", email: "jessica.lee@example.com", phone: "+1 555-678-9012", role: "User", status: "inactive", joined: "Jan 3, 2025", lastActive: "1 week ago", avatar: "JL" },
    { id: 7, name: "David Taylor", email: "david.taylor@example.com", phone: "+1 555-789-0123", role: "User", status: "active", joined: "Jan 2, 2025", lastActive: "4 hours ago", avatar: "DT" },
    { id: 8, name: "Amanda Martinez", email: "amanda.martinez@example.com", phone: "+1 555-890-1234", role: "Dealer", status: "active", joined: "Dec 28, 2024", lastActive: "6 hours ago", avatar: "AM" },
    { id: 9, name: "Robert Anderson", email: "robert.anderson@example.com", phone: "+1 555-901-2345", role: "User", status: "inactive", joined: "Dec 25, 2024", lastActive: "2 weeks ago", avatar: "RA" },
    { id: 10, name: "Lisa Thompson", email: "lisa.thompson@example.com", phone: "+1 555-012-3456", role: "User", status: "active", joined: "Dec 20, 2024", lastActive: "1 hour ago", avatar: "LT" },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterRole]);

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === "active" ? "inactive" : "active";
        showNotification(`User ${user.name} is now ${newStatus}`);
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const deleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    setShowDeleteConfirm(false);
    setSelectedUser(null);
    showNotification(`User ${user.name} has been deleted`);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
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
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-6 left-1/2 z-50 px-6 py-3 bg-[#0F172A] text-white rounded-xl shadow-xl flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">User Management</h1>
          <p className="text-[#64748B] mt-1">Manage your platform users and their permissions</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Users", value: users.length },
          { label: "Active Users", value: users.filter(u => u.status === "active").length },
          { label: "Inactive Users", value: users.filter(u => u.status === "inactive").length },
          { label: "Dealers", value: users.filter(u => u.role === "Dealer").length },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-xl bg-blue-100 text-blue-800"
          >
            <p className="text-xs font-medium opacity-70">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0]"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#DBEAFE] outline-none transition-all bg-white text-[#0F172A]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#DBEAFE] outline-none transition-all bg-white text-[#0F172A]"
            >
              <option value="all">All Roles</option>
              <option value="User">User</option>
              <option value="Dealer">Dealer</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[600px]"
      >
        <div className="overflow-auto flex-1">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] sticky top-0">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] sticky top-0">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] sticky top-0">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] sticky top-0">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] sticky top-0">Last Active</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] sticky top-0">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <AnimatePresence mode="popLayout">
                {paginatedUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -100 }}
                    layout
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center text-white text-sm font-semibold shadow-md"
                        >
                          {user.avatar}
                        </motion.div>
                        <div>
                          <p className="font-medium text-[#0F172A]">{user.name}</p>
                          <p className="text-sm text-[#64748B]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "Dealer" ? "bg-[#DBEAFE] text-[#1E3A8A]" : "bg-[#F1F5F9] text-[#64748B]"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.role === "Dealer" ? "bg-[#3B82F6]" : "bg-[#94A3B8]"}`} />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleUserStatus(user.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          user.status === "active"
                            ? "bg-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5]/70"
                            : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                        }`}
                      >
                        <motion.span
                          animate={{ 
                            backgroundColor: user.status === "active" ? "#10B981" : "#94A3B8",
                            scale: user.status === "active" ? [1, 1.2, 1] : 1
                          }}
                          transition={{ duration: 0.3 }}
                          className="w-2 h-2 rounded-full"
                        />
                        {user.status === "active" ? "Active" : "Inactive"}
                      </motion.button>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">{user.joined}</td>
                    <td className="px-6 py-4 text-sm text-[#94A3B8]">{user.lastActive}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
                          className="p-2 text-[#94A3B8] hover:text-[#1E3A8A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => { setSelectedUser(user); setShowDeleteConfirm(true); }}
                          className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                        >  
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F1F5F9] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-[#64748B]">No users found matching your criteria</p>
          </motion.div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[#1E3A8A]/10 flex items-center justify-between">
          <p className="text-sm text-[#1E3A8A]/60">
            Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </motion.button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-[#1E3A8A] text-white"
                      : "text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50"
                  }`}
                >
                  {page}
                </motion.button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 text-sm font-medium text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </motion.button>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-32 bg-gradient-to-br from-[#1E3A8A] to-[#1E3A8A]/80">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUserModal(false)}
                  className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* User Info */}
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4 flex justify-between items-end">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#1E3A8A]/80 flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-white"
                  >
                    {selectedUser.avatar}
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      toggleUserStatus(selectedUser.id);
                      setSelectedUser({ ...selectedUser, status: selectedUser.status === "active" ? "inactive" : "active" });
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      selectedUser.status === "active"
                        ? "bg-[#DBEAFE] text-[#1E3A8A] hover:bg-[#DBEAFE]/70"
                        : "bg-[#DBEAFE]/50 text-[#1E3A8A]/70 hover:bg-[#DBEAFE]"
                    }`}
                  >
                    {selectedUser.status === "active" ? "Deactivate" : "Activate"}
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-bold text-[#1E3A8A]">{selectedUser.name}</h2>
                  <p className="text-[#1E3A8A]/60">{selectedUser.email}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 space-y-3"
                >
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#DBEAFE]/30">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#1E3A8A]/70 shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#1E3A8A]/50">Phone</p>
                      <p className="font-medium text-[#1E3A8A]">{selectedUser.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#DBEAFE]/30">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#1E3A8A]/70 shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#1E3A8A]/50">Role</p>
                      <p className="font-medium text-[#1E3A8A]">{selectedUser.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#DBEAFE]/30">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#1E3A8A]/70 shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#1E3A8A]/50">Joined Date</p>
                      <p className="font-medium text-[#1E3A8A]">{selectedUser.joined}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3A8A]/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </motion.div>
              <h3 className="text-lg font-semibold text-[#1E3A8A] mb-2">Delete User?</h3>
              <p className="text-sm text-[#1E3A8A]/60 mb-6">
                Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-[#1E3A8A]/70 hover:bg-[#DBEAFE]/50 rounded-xl transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => deleteUser(selectedUser.id)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                >
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

export default UserManagement;
