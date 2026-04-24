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
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JewelleryTable from "./JewelleryTable";
import AddJewelleryManual from "./AddJewelleryManual";
import JewelleryFilters from "./JewelleryFilters";
import JewelleryGrid from "./JewelleryGrid";
import api from "../../../services/api";
import notify from "../../../utils/notifications";

const JewelleryStock = () => {
  const [activeTab, setActiveTab] = useState("view"); // "view" or "add"
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editData, setEditData] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "table" or "grid"
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({ categories: [], materials: [], statuses: [] });
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
    priceFrom: "",
    priceTo: "",
    stock_id: ""
  });

  const fetchFilterOptions = async () => {
    try {
      const response = await api.get("/jewellry-stock/filters");
      if (response.data.success) {
        setFilterOptions(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch filter options", error);
    }
  };

  const fetchStock = async (page = 1, query = "", filters = selectedFilters) => {
    setLoading(true);
    try {
      const response = await api.get(`/jewellry-stock`, {
        params: { 
          page, 
          search: query, 
          limit: 10, // Set limit to 10 as per user request
          ...filters
        }
      });
      setStockData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      notify.error("Error", "Failed to fetch jewellery stock");
    } finally {
      setLoading(false);
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
    fetchStock(currentPage, debouncedSearch, selectedFilters);
  }, [currentPage, debouncedSearch, selectedFilters]);

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
        priceFrom: "",
        priceTo: "",
        stock_id: ""
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
    if (!window.confirm("Are you sure you want to delete this item?")) return;
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
    const arrayKeys = ['categories', 'materials', 'shapes', 'colors', 'clarities'];
    const stringKeys = ['status', 'weight', 'diamond_weight', 'priceFrom', 'priceTo', 'stock_id'];

    arrayKeys.forEach(key => {
      if (selectedFilters[key] && selectedFilters[key].length > 0) count++;
    });

    stringKeys.forEach(key => {
      if (selectedFilters[key] && selectedFilters[key] !== "") count++;
    });

    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-[#F8FAFC]">
      {/* Sticky Header Section - Contains both View Toggle and Search/Actions */}
      <div className="sticky top-0 z-[50] bg-[#F8FAFC]">
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
                  onClick={() => notify.info("Coming Soon", "Import feature is under development.")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-white/50 transition-all whitespace-nowrap"
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

                  <button
                    onClick={() => notify.info("Share", "Sharing feature coming soon!")}
                    className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2.5 bg-[#6366F1] text-white hover:bg-[#4F46E5] rounded-xl transition-all shadow-md shadow-indigo-100 text-xs font-bold"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden md:inline">Share</span>
                  </button>

                  <button
                    onClick={() => fetchStock(currentPage, searchQuery)}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2.5 bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] rounded-xl transition-colors disabled:opacity-50 text-xs font-bold"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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
               {viewMode === "table" ? (
                <JewelleryTable 
                  data={stockData} 
                  loading={loading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  pagination={pagination}
                  onPageChange={setCurrentPage}
                  onSearch={setSearchQuery}
                  searchQuery={searchQuery}
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
          ) : (
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
          )}
        </AnimatePresence>

        {/* Unified Pagination Footer */}
        {activeTab === "view" && pagination && pagination.totalPages > 1 && (
          <div className="mt-8 px-4 sm:px-6 py-4 bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] font-bold uppercase tracking-widest">
                Page <span className="text-[#1E3A8A]">{pagination.page}</span> of {pagination.totalPages}
              </p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCurrentPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] font-black text-[#1E3A8A] bg-white border-2 border-[#1E3A8A]/10 rounded-xl hover:bg-[#1E3A8A] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1E3A8A] transition-all uppercase tracking-widest shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <button
                onClick={() => setCurrentPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-[10px] font-black text-white bg-[#1E3A8A] border-2 border-[#1E3A8A] rounded-xl hover:bg-[#1E40AF] disabled:opacity-30 transition-all uppercase tracking-widest shadow-xl shadow-blue-100"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
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
