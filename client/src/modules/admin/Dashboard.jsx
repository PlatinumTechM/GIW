import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1254,
    activeUsers: 987,
    newUsers: 42,
    revenue: "$125,000",
  });

  const [recentUsers, setRecentUsers] = useState([
    { id: 1, name: "John Smith", email: "john@example.com", status: "active", joined: "2 hours ago" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", status: "active", joined: "5 hours ago" },
    { id: 3, name: "Mike Brown", email: "mike@example.com", status: "inactive", joined: "1 day ago" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", status: "active", joined: "2 days ago" },
    { id: 5, name: "Chris Wilson", email: "chris@example.com", status: "active", joined: "3 days ago" },
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: "+12%",
      trend: "up",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "from-[#1E3A8A] to-[#1E3A8A]/80",
      bgColor: "bg-[#DBEAFE]",
      textColor: "text-[#1E3A8A]",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      change: "+8%",
      trend: "up",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-[#1E3A8A] to-[#1E3A8A]/80",
      bgColor: "bg-[#DBEAFE]",
      textColor: "text-[#1E3A8A]",
    },
    {
      title: "New Users Today",
      value: stats.newUsers,
      change: "+24%",
      trend: "up",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: "from-[#FBBF24] to-[#F59E0B]",
      bgColor: "bg-[#FBBF24]/20",
      textColor: "text-[#1E3A8A]",
    },
    {
      title: "Revenue",
      value: stats.revenue,
      change: "+15%",
      trend: "up",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-[#FBBF24] to-[#F59E0B]",
      bgColor: "bg-[#FBBF24]/20",
      textColor: "text-[#1E3A8A]",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-[#0F172A]">Dashboard Overview</h1>
        <p className="text-[#64748B] mt-1">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] hover:shadow-lg hover:border-[#3B82F6]/20 transition-all"
          >
            {/* Background Gradient Decoration */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2`} />
            
            <div className="relative">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] text-[#1E3A8A]`}>
                  {stat.icon}
                </div>
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-1 text-xs font-medium text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded-full"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {stat.change}
                </motion.span>
              </div>
              
              <div className="mt-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-sm text-[#64748B]"
                >
                  {stat.title}
                </motion.p>
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-2xl font-bold text-[#0F172A] mt-1"
                >
                  {stat.value}
                </motion.h3>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* User Management Icon */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="flex justify-end"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative group"
        >
          <Link
            to="/admin/users"
            className="flex items-center justify-center w-12 h-12 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#1E3A8A]/90 transition-all shadow-lg shadow-[#1E3A8A]/20 hover:shadow-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </Link>
          {/* Tooltip */}
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#1E3A8A] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
            User Management
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1E3A8A] rotate-45"></span>
          </span>
        </motion.div>
      </motion.div>

      {/* Recent Users Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden"
      >
        {/* Section Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">Recent Users</h2>
            <p className="text-sm text-[#64748B] mt-1">Latest registered users on the platform</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#1E3A8A] hover:bg-[#F1F5F9] rounded-xl transition-colors"
          >
            View All
          </motion.button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {recentUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.5)" }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center text-sm font-semibold text-white"
                      >
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </motion.div>
                      <span className="font-medium text-[#0F172A]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#64748B]">{user.email}</td>
                  <td className="px-6 py-4">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-[#D1FAE5] text-[#065F46]"
                          : "bg-[#F1F5F9] text-[#64748B]"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-[#10B981] animate-pulse" : "bg-[#94A3B8]"}`} />
                      {user.status === "active" ? "Active" : "Inactive"}
                    </motion.span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#94A3B8]">{user.joined}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Activity Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">User Growth</h3>
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 1.4 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                className="flex-1 bg-gradient-to-t from-[#1E3A8A] to-[#3B82F6] rounded-t-lg hover:from-[#3B82F6] hover:to-[#60A5FA] transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-[#94A3B8]">
            <span>Jan</span>
            <span>Mar</span>
            <span>Jun</span>
            <span>Sep</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
          <h3 className="text-lg font-semibold text-[#0F172A] mb-4">System Status</h3>
          <div className="space-y-4">
            {[
              { name: "Server Uptime", value: 99.9, color: "bg-[#1E3A8A]" },
              { name: "API Response", value: 98.5, color: "bg-[#3B82F6]" },
              { name: "Database", value: 99.2, color: "bg-[#60A5FA]" },
              { name: "CDN", value: 99.8, color: "bg-[#93C5FD]" },
            ].map((item, i) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#64748B]">{item.name}</span>
                  <span className="font-medium text-[#0F172A]">{item.value}%</span>
                </div>
                <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 1.5 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
