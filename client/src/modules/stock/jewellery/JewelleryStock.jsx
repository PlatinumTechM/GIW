import React, { useState, useEffect } from "react";
import {
  Plus,
  Table as TableIcon,
  Search,
  Filter,
  RefreshCw,
  Package,
  PlusCircle,
  Gem,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Share2,
  Pause,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JewelleryTable from "./JewelleryTable";
import AddJewelleryManual from "./AddJewelleryManual";
import JewelleryFilters from "./JewelleryFilters";
import JewelleryGrid from "./JewelleryGrid";
import JewelleryImport from "./JewelleryImport";
import api from "../../../services/api";
import notify from "../../../utils/notifications";
import { useAuth } from "../../../contexts/AuthContext";

const JewelleryStock = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("view"); // "view" or "add"
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editData, setEditData] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "table" or "grid"
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    materials: [],
    statuses: [],
    shapes: [],
    colors: [],
    clarities: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    materials: [],
    shapes: [],
    colors: [],
    clarities: [],
    status: "",
    diamond_type: "",
    weight: "",
    diamond_weight: "",
    totalWeightFrom: "",
    totalWeightTo: "",
    priceFrom: "",
    priceTo: "",
    stock_id: "",
  });

  const getVisiblePages = () => {
    if (!pagination) return [];
    const total = pagination.totalPages;
    const current = pagination.page;
    const pages = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(total);
      }
    }
    return pages;
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await api.get("/jewellry-stock/filters");
      if (response.data.success) {
        setFilterOptions(response.data.data);
      } else {
        console.warn(
          "Filter options API returned success:false",
          response.data,
        );
      }
    } catch (error) {
      console.error("Failed to fetch filter options", error);
      notify.error("Filter Error", "Could not load dynamic filter options.");
    }
  };

  const fetchStock = async (
    page = 1,
    query = "",
    filters = selectedFilters,
  ) => {
    setLoading(true);
    try {
      const response = await api.get(`/jewellry-stock`, {
        params: {
          page,
          search: query,
          limit,
          ...filters,
        },
      });
      setStockData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      notify.error("Error", "Failed to fetch jewellery stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock(currentPage, debouncedSearch, selectedFilters);
  }, [currentPage, debouncedSearch, limit]);

  const toggleRowSelection = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows(prev => 
      prev.length === stockData.length ? [] : stockData.map(item => item.id)
    );
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedRows.length === 0) return;
    
    const confirmed = await notify.confirm({
      title: `Update ${selectedRows.length} Items?`,
      message: `Are you sure you want to mark selected items as ${status.toLowerCase()}?`,
      confirmText: "Yes, Update",
      variant: status === "SOLD" ? "danger" : "info"
    });

    if (!confirmed) return;

    setIsBulkLoading(true);
    try {
      await Promise.all(selectedRows.map(id => api.put(`/jewellry-stock/${id}`, { status })));
      notify.success("Success", `Updated ${selectedRows.length} items to ${status}`);
      setSelectedRows([]);
      fetchStock(pagination?.page || 1, searchQuery);
    } catch (error) {
      console.error("Bulk update error:", error);
      notify.error("Error", "Failed to update some items");
    } finally {
      setIsBulkLoading(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const handleApplyFilters = (newFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1);
    fetchStock(1, searchQuery, newFilters);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    const defaultFilters = {
      categories: [],
      materials: [],
      shapes: [],
      colors: [],
      clarities: [],
      status: "",
      diamond_type: "",
      weight: "",
      diamond_weight: "",
      totalWeightFrom: "",
      totalWeightTo: "",
      priceFrom: "",
      priceTo: "",
      stock_id: "",
    };
    setSelectedFilters(defaultFilters);
    setSearchQuery("");
    setCurrentPage(1);
    fetchStock(1, "", defaultFilters);
    setIsFilterOpen(false);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setActiveTab("add");
  };

  const handleDelete = async (id) => {
    const confirmed = await notify.confirm({
      title: "Delete Item",
      message: "Are you sure you want to delete this item? This action cannot be undone.",
    });
    if (!confirmed) return;
    try {
      await api.delete(`/jewellry-stock/${id}`);
      notify.success("Success", "Item deleted successfully");
      fetchStock(currentPage, searchQuery);
    } catch (error) {
      notify.error("Error", "Failed to delete item");
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    const arrayKeys = [
      "categories",
      "materials",
      "shapes",
      "colors",
      "clarities",
    ];
    const stringKeys = [
      "status",
      "weight",
      "diamond_weight",
      "totalWeightFrom",
      "totalWeightTo",
      "priceFrom",
      "priceTo",
      "stock_id",
    ];

    arrayKeys.forEach((key) => {
      if (selectedFilters[key] && selectedFilters[key].length > 0) count++;
    });

    stringKeys.forEach((key) => {
      if (selectedFilters[key] && selectedFilters[key] !== "") count++;
    });

    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-[#F8FAFC]">
      {/* Sticky Header Section - Contains both View Toggle and Search/Actions */}
      <div className="bg-[#F8FAFC]">
        {/* Row 1: View Mode Toggles */}
        <div className="bg-white border-b border-[#E2E8F0]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-start">
              <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl w-full sm:w-auto shadow-sm border border-[#E2E8F0] overflow-x-auto no-scrollbar">
                <button
                  onClick={() => {
                    setActiveTab("view");
                    setEditData(null);
                  }}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === "view"
                      ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/50"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden xs:inline">Show Stock</span>
                  <span className="xs:hidden">Stock</span>
                </button>
                <button
                  onClick={() => setActiveTab("add")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === "add"
                      ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/50"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden xs:inline">Manual Entry</span>
                  <span className="xs:hidden">Add</span>
                </button>
                <button
                  onClick={() => setActiveTab("import")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === "import"
                      ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/50"
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden xs:inline">Imports</span>
                  <span className="xs:hidden">Import</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Search & Actions Row - Sticky only in "view" mode */}
        {activeTab === "view" && (
          <div className="bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] py-3 sm:py-4">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-row items-center gap-2 sm:gap-3">
                <div className="flex-1 relative group input-with-icon">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#94A3B8] group-focus-within:text-[#1E3A8A] transition-colors" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full input-field"
                  />
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2.5 rounded-xl transition-all text-xs font-bold relative ${
                      isFilterOpen
                        ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20"
                        : activeFilterCount > 0
                          ? "bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20"
                          : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden md:inline">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 animate-scale-in">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {user?.planHasShareLink && (
                    <button
                      onClick={() =>
                        notify.info("Share", "Sharing feature coming soon!")
                      }
                      className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2.5 bg-[#6366F1] text-white hover:bg-[#4F46E5] rounded-xl transition-all shadow-md shadow-indigo-100 text-xs font-bold"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden md:inline">Share</span>
                    </button>
                  )}

                  <button
                    onClick={() => fetchStock(currentPage, searchQuery)}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2.5 bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] rounded-xl transition-colors disabled:opacity-50 text-xs font-bold"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                    />
                    <span className="hidden md:inline">Refresh</span>
                  </button>

                  <div className="h-8 w-px bg-[#E2E8F0] mx-0.5 hidden xs:block" />

                  {/* View Toggle Group */}
                  <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                        viewMode === "table"
                          ? "bg-white text-[#1E3A8A] shadow-md"
                          : "text-[#94A3B8] hover:text-[#64748B]"
                      }`}
                    >
                      <TableIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-white text-[#1E3A8A] shadow-md"
                          : "text-[#94A3B8] hover:text-[#64748B]"
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          {activeTab === "view" ? (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {selectedRows.length > 0 && (
                <div className="bg-white rounded-xl border border-blue-100 p-3 mb-4 flex items-center justify-between shadow-sm shadow-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                      {selectedRows.length} Items Selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBulkStatusUpdate("HOLD")}
                      disabled={isBulkLoading}
                      className="px-4 py-1.5 bg-amber-500 text-white text-[10px] font-black rounded-lg hover:bg-amber-600 transition-all flex items-center gap-2 uppercase tracking-widest disabled:opacity-50"
                    >
                      <Pause className="w-3 h-3" />
                      Hold
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate("SOLD")}
                      disabled={isBulkLoading}
                      className="px-4 py-1.5 bg-rose-500 text-white text-[10px] font-black rounded-lg hover:bg-rose-600 transition-all flex items-center gap-2 uppercase tracking-widest disabled:opacity-50"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Sold
                    </button>
                    <button
                      onClick={() => setSelectedRows([])}
                      className="px-3 py-1.5 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {viewMode === "table" ? (
                <JewelleryTable
                  data={stockData}
                  loading={loading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  pagination={pagination}
                  onPageChange={setCurrentPage}
                  selectedRows={selectedRows}
                  onSelectRow={toggleRowSelection}
                  onSelectAll={toggleSelectAll}
                />
              ) : (
                <JewelleryGrid
                  data={stockData}
                  loading={loading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </motion.div>
          ) : activeTab === "add" ? (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AddJewelleryManual
                onRefresh={() => {
                  fetchStock(1, searchQuery);
                  setActiveTab("view");
                }}
                editData={editData}
                setEditData={setEditData}
              />
            </motion.div>
          ) : activeTab === "import" ? (
            <motion.div
              key="import"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <JewelleryImport
                onComplete={() => {
                  fetchStock(1, searchQuery);
                  setActiveTab("view");
                }}
                onCancel={() => setActiveTab("view")}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Unified Premium Pagination Footer */}
        {activeTab === "view" && pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-6 pb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
              {/* Rows Per Page Dropdown */}
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-[#E2E8F0] shadow-sm">
                <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest whitespace-nowrap">Rows:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-sm font-bold text-[#1E3A8A] focus:outline-none cursor-pointer"
                >
                  {[50, 100, 200, 500].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Pagination Bar */}
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-xl shadow-[#1E3A8A]/5 border border-[#E2E8F0]">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={pagination.page === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] transition-all duration-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-25"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1 px-2">
                  {getVisiblePages().map((page, index) =>
                    page === "..." ? (
                      <span key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center text-sm text-[#94A3B8]">
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all duration-200 ${pagination.page === page
                          ? "bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white shadow-md shadow-blue-900/20 scale-105"
                          : "text-[#475569] hover:bg-slate-50 hover:text-[#1E3A8A]"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={pagination.page === pagination.totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] transition-all duration-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-25"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#64748B]">
              <p>
                Page <span className="text-[#1E3A8A]">{pagination.page}</span> of{" "}
                <span className="text-[#1E3A8A]">{pagination.totalPages}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters Popup */}
      <JewelleryFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterOptions={filterOptions}
        initialFilters={selectedFilters}
        onApply={handleApplyFilters}
        onClearFilters={clearFilters}
      />
    </div>
  );
};
export default JewelleryStock;
