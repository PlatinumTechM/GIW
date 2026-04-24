import { useState, useEffect } from "react";
import { 
  Key, 
  User, 
  Mail, 
  Percent, 
  Send, 
  Copy, 
  Check, 
  ExternalLink,
  Shield,
  Filter,
  Plus,
  Trash2,
  Clock,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import api from "@/services/api";
import notify from "@/utils/notifications";
import { motion, AnimatePresence } from "framer-motion";

const ShareAPI = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    discountPercentage: "",
    includeCategory: "",
    excludeCategory: "",
    allowHold: false,
    allowSell: false,
    allowInsert: false,
    allowUpdate: false,
  });

  const [loading, setLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMyApiKeys();
  }, [currentPage]);

  const fetchMyApiKeys = async () => {
    try {
      const response = await api.get(`/share-api/my?page=${currentPage}&limit=${itemsPerPage}`);
      if (response.data.success) {
        setApiKeys(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCount(response.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      notify.error("Error", "Name and Email are required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/share-api/create", formData);
      if (response.data.success) {
        setGeneratedKey(response.data.data);
        setShowTokenModal(true);
        setFormData({
          name: "",
          email: "",
          discountPercentage: "",
          includeCategory: "",
          excludeCategory: "",
          allowHold: false,
          allowSell: false,
          allowInsert: false,
          allowUpdate: false,
        });
        fetchMyApiKeys();
        notify.success("Success", "API Authorized Token Generated!");
      }
    } catch (error) {
      console.error("Error generating API key:", error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || "Failed to generate API token";
      notify.error("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    notify.success("Copied", "Token copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await api.patch(`/share-api/${id}/status`, { 
        isActive: !currentStatus 
      });
      if (response.data.success) {
        notify.success("Success", response.data.message);
        fetchMyApiKeys();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      notify.error("Error", "Failed to update token status");
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto p-2 sm:p-6 space-y-6 sm:space-y-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left text-white">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Key className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Share API Access</h1>
              <p className="text-indigo-100 text-xs sm:text-sm mt-1 font-medium opacity-90">Generate secure authorized tokens for external stock sharing</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 px-1 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" /> Recipient Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 px-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 px-1 flex items-center gap-2">
                <Percent className="w-4 h-4 text-indigo-600" /> Difference (%)
              </label>
              <input
                type="number"
                step="0.01"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                placeholder="e.g. 5.00"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700"
              />
            </div>
          </div>
          
          <div className="flex justify-start">
              <button 
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-indigo-600 text-sm font-semibold flex items-center gap-2 hover:text-indigo-700 transition-colors"
              >
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
              </button>
          </div>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 px-1 flex items-center gap-2">
                      <Filter className="w-4 h-4 text-indigo-500" /> Include Shapes
                    </label>
                    <input
                      type="text"
                      name="includeCategory"
                      value={formData.includeCategory}
                      onChange={handleInputChange}
                      placeholder="Round, Pear, Heart"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-700 px-1 flex items-center gap-2">
                      <Filter className="w-4 h-4 text-red-500" /> Exclude Shapes
                    </label>
                    <input
                      type="text"
                      name="excludeCategory"
                      value={formData.excludeCategory}
                      onChange={handleInputChange}
                      placeholder="Marquise, Oval"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-semibold text-gray-700 px-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" /> Grant Permissions
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { id: "allowHold", label: "Can Hold", color: "bg-amber-50 text-amber-700 border-amber-200" },
                      { id: "allowSell", label: "Can Sell", color: "bg-blue-50 text-blue-700 border-blue-200" },
                      { id: "allowInsert", label: "Can Insert", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                      { id: "allowUpdate", label: "Can Update", color: "bg-indigo-50 text-indigo-700 border-indigo-200" }
                    ].map((perm) => (
                      <label 
                        key={perm.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          formData[perm.id] ? perm.color : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name={perm.id}
                          checked={formData[perm.id]}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-medium">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate Authorized Token
              </>
            )}
          </button>
        </form>
      </div>

      {/* API Keys Table */}
      {apiKeys.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Recent API Tokens
            </h2>
          </div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Difference(%)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{key.name}</div>
                      <div className="text-xs text-gray-500">{key.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                        {key.discount_percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(key.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <code className="text-[11px] bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600 font-mono border border-gray-200">
                          {key.api_token.substring(0, 12)}...
                        </code>
                        <button 
                          onClick={() => copyToClipboard(key.api_token)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Copy Full Token"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        key.is_active 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                        : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        {key.is_active ? (
                          <><ShieldCheck className="w-3 h-3" /> Active</>
                        ) : (
                          <><ShieldAlert className="w-3 h-3" /> Inactive</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleStatus(key.id, key.is_active)}
                        className={`p-2 rounded-xl transition-all ${
                          key.is_active 
                          ? "text-emerald-600 hover:bg-emerald-50" 
                          : "text-red-600 hover:bg-red-50"
                        }`}
                        title={key.is_active ? "Deactivate Token" : "Activate Token"}
                      >
                        {key.is_active ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{key.name}</div>
                    <div className="text-xs text-gray-500">{key.email}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    key.is_active 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-red-50 text-red-700 border-red-100"
                  }`}>
                    {key.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Difference</div>
                    <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block">
                      {key.discount_percentage}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Created Date</div>
                    <div className="text-xs text-gray-600">
                      {new Date(key.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 flex-1 mr-4">
                    <code className="flex-1 text-[10px] bg-gray-50 px-2 py-1 rounded border border-gray-200 text-gray-600 font-mono overflow-hidden">
                      {key.api_token.substring(0, 15)}...
                    </code>
                    <button 
                      onClick={() => copyToClipboard(key.api_token)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleStatus(key.id, key.is_active)}
                    className={`p-1.5 rounded-lg ${
                      key.is_active ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {key.is_active ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalCount > 0 && (
            <div className="px-6 py-6 border-t border-gray-50 flex flex-col items-center gap-4 bg-gray-50/30">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-sm ring-1 ring-gray-100">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all duration-200 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1 px-2">
                  {getVisiblePages().map((page, index) =>
                    page === "..." ? (
                      <span key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center text-sm text-gray-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
                          currentPage === page
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105"
                            : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all duration-200 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <p className="text-gray-500">
                  Showing <span className="text-indigo-600">{(currentPage - 1) * itemsPerPage + 1}</span> -{" "}
                  <span className="text-indigo-600">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of{" "}
                  <span className="text-indigo-600">{totalCount}</span> tokens
                </p>
                <span className="text-gray-300">|</span>
                <p className="text-gray-500">
                  Page <span className="text-indigo-600">{currentPage}</span> of {totalPages}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Token Modal */}
      <AnimatePresence>
        {showTokenModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowTokenModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowTokenModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto flex-1">
                <div className="pt-10 pb-6 px-8 text-center">
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm"
                  >
                    <Key className="w-8 h-8 text-indigo-600" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Authorized Token Generated</h3>
                  <p className="text-gray-500 text-sm mt-1">Ready for use by <span className="font-semibold text-indigo-600">{generatedKey?.name}</span></p>
                </div>
                
                <div className="p-6 sm:p-8 pt-0 space-y-6 sm:space-y-8">
                  {/* Token Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Authorized Token</label>
                      {copied && <span className="text-[10px] font-bold text-green-600">Copied!</span>}
                    </div>
                    <div className="relative flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <code className="flex-1 text-[11px] sm:text-xs font-mono font-semibold text-indigo-700 break-all">
                        {generatedKey?.api_token}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(generatedKey?.api_token)}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Endpoint URL Section */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Global Endpoint URL</label>
                      <div className="relative flex items-center p-3 bg-slate-800 rounded-xl overflow-x-auto">
                        <code className="text-[10px] sm:text-xs text-indigo-300 font-mono whitespace-nowrap">
                          {import.meta.env.VITE_API_BASE_URL}/share-api/stock
                        </code>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${import.meta.env.VITE_API_BASE_URL}/share-api/stock`);
                            notify.success("Copied", "Endpoint URL copied!");
                          }}
                          className="ml-auto p-1.5 text-indigo-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Postman Guide */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Postman Integration</label>
                      <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Auth Type</span>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded border border-indigo-100 uppercase">Bearer Token</span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Header</span>
                          <span className="text-[10px] font-mono font-bold text-gray-700">Authorization</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowTokenModal(false)}
                    className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareAPI;
