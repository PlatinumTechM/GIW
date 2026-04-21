import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  AlertTriangle,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Diamond,
  ArrowLeft,
  FileSpreadsheet,
  Search,
  SlidersHorizontal,
  RefreshCw,
  X,
  DiamondIcon,
  Palette,
  Sparkles,
  Scissors,
  Building2,
  Microscope,
  Scale,
  DollarSign,
  Tag,
} from "lucide-react";
import api from "@/services/api";
import * as XLSX from "xlsx";

// Public columns (excluding sensitive data)
const PUBLIC_COLUMNS = [
  "stock_id",
  "certificate_number",
  "weight",
  "shape",
  "color",
  "fancy_color",
  "fancy_color_intensity",
  "fancy_color_overtone",
  "clarity",
  "cut",
  "polish",
  "symmetry",
  "fluorescence",
  "fluorescence_color",
  "fluorescence_intensity",
  "measurements",
  "length",
  "width",
  "height",
  "depth_percentage",
  "table_percentage",
  "crown_height",
  "crown_angle",
  "pavilion_depth",
  "pavilion_angle",
  "gridle_thin",
  "gridle_thick",
  "gridle_condition",
  "gridle_per",
  "culet_size",
  "culet_condition",
  "shade",
  "milky",
  "eye_clean",
  "lab",
  "certificate_comment",
  "city",
  "state",
  "country",
  "treatment",
  "heart_arrow",
  "star_length",
  "laser_description",
  "growth_type",
  "key_to_symbol",
  "lw_ratio",
  "status",
  "price_per_carat",
  "diamond_type",
  "diamond_image1",
  "diamond_video",
  "certificate_image",
];

const SharePage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [pendingFilters, setPendingFilters] = useState({
    stockId: "",
    certificate: "",
    status: [],
    shape: [],
    minWeight: "",
    maxWeight: "",
    color: [],
    cut: [],
    clarity: [],
    lab: [],
    minPricePerCarat: "",
    maxPricePerCarat: "",
    growthType: [],
  });

  const [appliedFilters, setAppliedFilters] = useState({
    stockId: "",
    certificate: "",
    status: [],
    shape: [],
    minWeight: "",
    maxWeight: "",
    color: [],
    cut: [],
    clarity: [],
    lab: [],
    minPricePerCarat: "",
    maxPricePerCarat: "",
    growthType: [],
  });

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    shapes: [],
    colors: [],
    clarities: [],
  });
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(false);

  useEffect(() => {
    fetchSharedData();
  }, [token, currentPage]);

  const fetchSharedData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/share/data/${token}?page=${currentPage}`);
      if (response.data.success) {
        setData(response.data.data);
        // Extract filter options from stock data
        extractFilterOptions(response.data.data.stocks);
      }
    } catch (error) {
      console.error("Error fetching shared data:", error);
      const message = error.response?.data?.message || "Failed to load shared data";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique filter options from stock data
  const extractFilterOptions = useCallback((stocks) => {
    if (!stocks || stocks.length === 0) return;
    
    const shapes = [...new Set(stocks.map(s => s.shape).filter(Boolean))];
    const colors = [...new Set(stocks.map(s => s.color).filter(Boolean))];
    const clarities = [...new Set(stocks.map(s => s.clarity).filter(Boolean))];
    
    setFilterOptions({
      shapes: shapes.sort(),
      colors: colors.sort(),
      clarities: clarities.sort(),
    });
    setFilterOptionsLoading(false);
  }, []);

  // Filter handlers
  const handlePendingFilterChange = (field, value) => {
    setPendingFilters((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayFilter = (field, value) => {
    setPendingFilters((prev) => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleStatusToggle = (status) => {
    setPendingFilters((prev) => {
      const currentStatuses = prev.status || [];
      const newStatuses = currentStatuses.includes(status)
        ? currentStatuses.filter((s) => s !== status)
        : [...currentStatuses, status];
      return { ...prev, status: newStatuses };
    });
  };

  const applyFilters = () => {
    setAppliedFilters({ ...pendingFilters });
    setCurrentPage(1);
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      stockId: "",
      certificate: "",
      status: [],
      shape: [],
      minWeight: "",
      maxWeight: "",
      color: [],
      cut: [],
      clarity: [],
      lab: [],
      minPricePerCarat: "",
      maxPricePerCarat: "",
      growthType: [],
    };
    setPendingFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const removeFilter = (field, value = null) => {
    if (value !== null && Array.isArray(appliedFilters[field])) {
      const newValues = appliedFilters[field].filter((v) => v !== value);
      const newFilters = { ...appliedFilters, [field]: newValues };
      setAppliedFilters(newFilters);
      setPendingFilters(newFilters);
    } else {
      const newFilters = { ...appliedFilters, [field]: Array.isArray(appliedFilters[field]) ? [] : "" };
      setAppliedFilters(newFilters);
      setPendingFilters(newFilters);
    }
  };

  const hasActiveFilters = () => {
    return (
      appliedFilters.stockId ||
      appliedFilters.certificate ||
      appliedFilters.status.length > 0 ||
      appliedFilters.shape.length > 0 ||
      appliedFilters.color.length > 0 ||
      appliedFilters.cut.length > 0 ||
      appliedFilters.clarity.length > 0 ||
      appliedFilters.lab.length > 0 ||
      appliedFilters.growthType.length > 0 ||
      appliedFilters.minWeight ||
      appliedFilters.maxWeight ||
      appliedFilters.minPricePerCarat ||
      appliedFilters.maxPricePerCarat ||
      searchQuery
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (appliedFilters.stockId) count++;
    if (appliedFilters.certificate) count++;
    count += appliedFilters.status.length;
    count += appliedFilters.shape.length;
    count += appliedFilters.color.length;
    count += appliedFilters.cut.length;
    count += appliedFilters.clarity.length;
    count += appliedFilters.lab.length;
    count += appliedFilters.growthType.length;
    if (appliedFilters.minWeight || appliedFilters.maxWeight) count++;
    if (appliedFilters.minPricePerCarat || appliedFilters.maxPricePerCarat) count++;
    if (searchQuery) count++;
    return count;
  };

  // Client-side filtering
  const filteredStocks = data?.stocks?.filter((item) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      (item.stock_id && item.stock_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.shape && item.shape.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.certificate_number && item.certificate_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.color && item.color.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.clarity && item.clarity.toLowerCase().includes(searchQuery.toLowerCase()));

    // Applied filters
    const matchesStockId = !appliedFilters.stockId || (item.stock_id && item.stock_id.toLowerCase().includes(appliedFilters.stockId.toLowerCase()));
    const matchesCertificate = !appliedFilters.certificate || (item.certificate_number && item.certificate_number.toLowerCase().includes(appliedFilters.certificate.toLowerCase()));
    const matchesStatus = appliedFilters.status.length === 0 || appliedFilters.status.includes(item.status);
    const matchesShape = appliedFilters.shape.length === 0 || appliedFilters.shape.includes(item.shape);
    const matchesColor = appliedFilters.color.length === 0 || appliedFilters.color.includes(item.color);
    const matchesCut = appliedFilters.cut.length === 0 || appliedFilters.cut.includes(item.cut);
    const matchesClarity = appliedFilters.clarity.length === 0 || appliedFilters.clarity.includes(item.clarity);
    const matchesLab = appliedFilters.lab.length === 0 || appliedFilters.lab.includes(item.lab);
    const matchesGrowthType = appliedFilters.growthType.length === 0 || appliedFilters.growthType.includes(item.growth_type);
    const matchesWeight = (!appliedFilters.minWeight || item.weight >= parseFloat(appliedFilters.minWeight)) &&
                         (!appliedFilters.maxWeight || item.weight <= parseFloat(appliedFilters.maxWeight));
    const matchesPrice = (!appliedFilters.minPricePerCarat || item.price_per_carat >= parseFloat(appliedFilters.minPricePerCarat)) &&
                        (!appliedFilters.maxPricePerCarat || item.price_per_carat <= parseFloat(appliedFilters.maxPricePerCarat));

    return (
      matchesSearch &&
      matchesStockId &&
      matchesCertificate &&
      matchesStatus &&
      matchesShape &&
      matchesColor &&
      matchesCut &&
      matchesClarity &&
      matchesLab &&
      matchesGrowthType &&
      matchesWeight &&
      matchesPrice
    );
  }) || [];

  const handleDownloadExcel = () => {
    if (!data?.stocks || data.stocks.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(data.stocks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shared Stock");
    XLSX.writeFile(workbook, `shared-stock-${token.slice(0, 8)}.xlsx`);
  };

  const getValue = (item, field) => {
    if (item[field] === null || item[field] === undefined || item[field] === "")
      return "-";
    return item[field];
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Loading Stock Data...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch the shared data</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    const isExpired = error.toLowerCase().includes("expired") || error.toLowerCase().includes("revoked");
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isExpired ? "bg-amber-100" : "bg-red-100"}`}>
            {isExpired ? (
              <Clock className="w-8 h-8 text-amber-600" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isExpired ? "Link Expired" : "Error"}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {isExpired && (
            <p className="text-sm text-gray-500 mb-4">
              This share link has expired or been revoked. Please contact the person who shared this link with you.
            </p>
          )}
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </motion.div>
      </div>
    );
  }

  // Empty state
  if (!data?.stocks || data.stocks.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Stock Found</h2>
          <p className="text-gray-600">The shared link contains no stock data.</p>
        </div>
      </div>
    );
  }

  const { pagination, expiresIn, expiryTime } = data;
  const stocks = filteredStocks; // Use filtered stocks instead of all stocks
  
  // Filter options arrays
  const uniqueShapes = filterOptions.shapes;
  const uniqueColors = filterOptions.colors;
  const uniqueClarities = filterOptions.clarities;
  const uniqueStatuses = ["AVAILABLE", "HOLD", "SOLD", "MEMO"];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
            
              <div>
                <h1 className="text-xl font-bold text-gray-900">Shared Stock</h1>
                <p className="text-sm text-gray-500">
                  Viewing filtered stock data •{" "}
                  <span className="text-amber-600 font-medium">
                    Expires in {expiresIn}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDownloadExcel}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors text-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="sm:hidden">Excel</span>
                <span className="hidden sm:inline">Download Excel</span>
              </button>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Read-only view:</span> This is a shared view of
              stock data. The link expires on{" "}
              <span className="font-medium">
                {new Date(expiryTime).toLocaleString()}
              </span>
              . Pricing information is hidden for privacy.
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-3 sm:p-4 mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search stock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                hasActiveFilters()
                  ? "bg-blue-600 text-white"
                  : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters() && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs font-medium">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
            <button
              onClick={fetchSharedData}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] rounded-lg transition-colors disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-xs text-gray-500 font-medium">Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                Search:{searchQuery}
                <button onClick={() => setSearchQuery("")} className="hover:bg-gray-200 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.stockId && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                Stock:{appliedFilters.stockId}
                <button onClick={() => removeFilter("stockId")} className="hover:bg-blue-200 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.certificate && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                Cert:{appliedFilters.certificate}
                <button onClick={() => removeFilter("certificate")} className="hover:bg-blue-200 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {appliedFilters.shape.map((shape) => (
              <span key={shape} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                {shape}
                <button onClick={() => removeFilter("shape", shape)} className="hover:bg-indigo-200 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {appliedFilters.color.map((color) => (
              <span key={color} className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                {color}
                <button onClick={() => removeFilter("color", color)} className="hover:bg-purple-200 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {appliedFilters.clarity.map((clarity) => (
              <span key={clarity} className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">
                {clarity}
                <button onClick={() => removeFilter("clarity", clarity)} className="hover:bg-emerald-200 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {appliedFilters.cut.map((cut) => (
              <span key={cut} className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs">
                {cut}
                <button onClick={() => removeFilter("cut", cut)} className="hover:bg-pink-200 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {appliedFilters.lab.map((lab) => (
              <span key={lab} className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs">
                {lab}
                <button onClick={() => removeFilter("lab", lab)} className="hover:bg-cyan-200 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {appliedFilters.growthType.map((type) => (
              <span key={type} className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs">
                {type}
                <button onClick={() => removeFilter("growthType", type)} className="hover:bg-teal-200 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {appliedFilters.status.map((status) => (
              <span key={status} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                status === "AVAILABLE" ? "bg-green-100 text-green-700" :
                status === "SOLD" ? "bg-red-100 text-red-700" :
                status === "HOLD" ? "bg-amber-100 text-amber-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {status}
                <button onClick={() => removeFilter("status", status)} className={`rounded p-0.5 ml-1 ${
                  status === "AVAILABLE" ? "hover:bg-green-200" :
                  status === "SOLD" ? "hover:bg-red-200" :
                  status === "HOLD" ? "hover:bg-amber-200" :
                  "hover:bg-blue-200"
                }`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(appliedFilters.minWeight || appliedFilters.maxWeight) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                {appliedFilters.minWeight || "0"}-{appliedFilters.maxWeight || "∞"}ct
                <button onClick={() => { removeFilter("minWeight"); removeFilter("maxWeight"); }} className="hover:bg-orange-200 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(appliedFilters.minPricePerCarat || appliedFilters.maxPricePerCarat) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-xs">
                ${appliedFilters.minPricePerCarat || "0"}-${appliedFilters.maxPricePerCarat || "∞"}
                <button onClick={() => { removeFilter("minPricePerCarat"); removeFilter("maxPricePerCarat"); }} className="hover:bg-rose-200 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-500 hover:text-red-600 hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Results Summary */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#64748B]">
              Showing{" "}
              <span className="font-semibold text-[#0F172A]">
                {stocks.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#0F172A]">
                {pagination.total}
              </span>{" "}
              total items
              {pagination.totalPages > 1 && (
                <>
                  {" "}(Page{" "}
                  <span className="font-semibold text-[#0F172A]">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#0F172A]">
                    {pagination.totalPages}
                  </span>
                  )
                </>
              )}
            </span>
          </div>
        </div>

        {/* Table - Responsive with scroll */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-auto max-h-[60vh]">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-30 bg-gray-200">
              <tr className="bg-gray-200 text-gray-900">
                <th className="px-2 py-3 text-center font-semibold border-r border-gray-300 sticky left-0 z-40 w-10 bg-gray-300">
                  #
                </th>
                {PUBLIC_COLUMNS.map((field) => {
                  const isSortable = [
                    "stock_id",
                    "certificate_number",
                    "weight",
                    "shape",
                    "color",
                    "clarity",
                    "cut",
                    "lab",
                    "growth_type",
                    "status",
                  ].includes(field);

                  return (
                    <th
                      key={field}
                      className="px-2 sm:px-3 py-2 sm:py-3 text-left font-semibold border-r border-gray-300 whitespace-nowrap bg-gray-200 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-1">
                        <span className="truncate max-w-20 sm:max-w-none">{field.replace(/_/g, " ").toUpperCase()}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              {stocks.map((item, index) => {
                const rowNumber = (pagination.page - 1) * pagination.limit + index + 1;
                const rowBgClass = index % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]";
                return (
                  <tr
                    key={item.id || index}
                    className={`${rowBgClass} hover:bg-[#EFF6FF] transition-colors text-sm border-b border-[#E2E8F0]`}
                  >
                    <td className={`px-2 py-3 text-center text-xs text-[#64748B] border-r border-[#E2E8F0] sticky left-0 z-10 w-10 font-medium ${rowBgClass}`}>
                      {rowNumber}
                    </td>
                    {PUBLIC_COLUMNS.map((field) => {
                      const value = getValue(item, field);
                      const isEmpty = value === "-";

                      return (
                        <td
                          key={field}
                          className={`px-2 sm:px-3 py-2 sm:py-3 border-r border-[#E2E8F0] whitespace-nowrap text-xs sm:text-sm ${
                            isEmpty ? "text-[#94A3B8]" : "text-[#374151]"
                          }`}
                        >
                          {field === "stock_id" && !isEmpty ? (
                            <span className="font-semibold text-[#1E3A8A]">{value}</span>
                          ) : field === "color" && !isEmpty ? (
                            <span className="px-2 py-0.5 bg-[#EFF6FF] text-[#1E3A8A] rounded text-xs font-semibold">
                              {value}
                            </span>
                          ) : field === "clarity" && !isEmpty ? (
                            <span className="px-2 py-0.5 bg-[#F0FDF4] text-[#059669] rounded text-xs font-semibold">
                              {value}
                            </span>
                          ) : field === "status" ? (
                            <span
                              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                item.status === "AVAILABLE" || !item.status
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : item.status === "SOLD"
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : "bg-amber-100 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {value}
                            </span>
                          ) : field === "weight" && !isEmpty ? (
                            <span className="font-medium">{value}</span>
                          ) : field === "diamond_image1" && !isEmpty ? (
                            <a
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Image
                            </a>
                          ) : field === "diamond_video" && !isEmpty ? (
                            <a
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Video
                            </a>
                          ) : field === "certificate_image" && !isEmpty ? (
                            <a
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Certificate
                            </a>
                          ) : (
                            value
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between mt-4 rounded-lg">
            <p className="text-sm text-[#64748B]">
              Page{" "}
              <span className="font-semibold text-[#0F172A]">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#0F172A]">
                {pagination.totalPages}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        <AnimatePresence>
          {showFilters && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl lg:max-w-4xl max-h-[85vh] overflow-hidden pointer-events-auto border border-gray-200">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-slate-900 text-white">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5" />
                      <h2 className="text-base font-semibold">Filter Stock</h2>
                    </div>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Filter Content */}
                  <div className="p-3 overflow-y-auto max-h-[calc(85vh-120px)] bg-gray-50">
                    <div className="space-y-2">
                      {/* Search Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={pendingFilters.stockId}
                          onChange={(e) => handlePendingFilterChange("stockId", e.target.value)}
                          placeholder="Search By Stock ID.."
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={pendingFilters.certificate}
                          onChange={(e) => handlePendingFilterChange("certificate", e.target.value)}
                          placeholder="Search By Certificate Number.."
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Shape */}
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                          <DiamondIcon className="w-4 h-4 text-indigo-500" />
                          Shape
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {filterOptionsLoading ? (
                            <div className="flex flex-wrap gap-1.5 w-full">
                              {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-7 w-16 bg-gray-200 rounded-md animate-pulse" />
                              ))}
                            </div>
                          ) : uniqueShapes.length > 0 ? (
                            uniqueShapes.map((shape) => (
                              <button
                                key={shape}
                                onClick={() => toggleArrayFilter("shape", shape)}
                                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                                  pendingFilters.shape.includes(shape)
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {shape}
                              </button>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No shapes</span>
                          )}
                        </div>
                      </div>

                      {/* Color */}
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                          <Palette className="w-4 h-4 text-purple-500" />
                          Color
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {filterOptionsLoading ? (
                            <div className="flex flex-wrap gap-1.5 w-full">
                              {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-7 w-12 bg-gray-200 rounded-md animate-pulse" />
                              ))}
                            </div>
                          ) : uniqueColors.length > 0 ? (
                            uniqueColors.map((color) => (
                              <button
                                key={color}
                                onClick={() => toggleArrayFilter("color", color)}
                                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                                  pendingFilters.color.includes(color)
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {color}
                              </button>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No colors</span>
                          )}
                        </div>
                      </div>

                      {/* Clarity, Cut, Lab */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {/* Clarity */}
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                            <Sparkles className="w-4 h-4 text-emerald-500" />
                            Clarity
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {filterOptionsLoading ? (
                              <div className="flex flex-wrap gap-1 w-full">
                                {[...Array(6)].map((_, i) => (
                                  <div key={i} className="h-6 w-10 bg-gray-200 rounded-md animate-pulse" />
                                ))}
                              </div>
                            ) : uniqueClarities.length > 0 ? (
                              uniqueClarities.map((clarity) => (
                                <button
                                  key={clarity}
                                  onClick={() => toggleArrayFilter("clarity", clarity)}
                                  className={`px-2 py-1 rounded text-xs transition-all ${
                                    pendingFilters.clarity.includes(clarity)
                                      ? "bg-emerald-600 text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {clarity}
                                </button>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">No data</span>
                            )}
                          </div>
                        </div>

                        {/* Cut */}
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                            <Scissors className="w-4 h-4 text-pink-500" />
                            Cut
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {["Ideal", "Exc", "VG", "Good", "Fair", "Poor"].map((cut, idx) => {
                              const fullNames = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
                              return (
                                <button
                                  key={fullNames[idx]}
                                  onClick={() => toggleArrayFilter("cut", fullNames[idx])}
                                  className={`px-2 py-1 rounded text-xs transition-all ${
                                    pendingFilters.cut.includes(fullNames[idx])
                                      ? "bg-pink-600 text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {cut}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Lab */}
                        <div className="bg-white p-3 rounded-lg border border-gray-200 col-span-2 sm:col-span-1">
                          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                            <Building2 className="w-4 h-4 text-cyan-500" />
                            Lab
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {["GIA", "IGI", "HRD", "AGS", "EGL", "CGL"].map((lab) => (
                              <button
                                key={lab}
                                onClick={() => toggleArrayFilter("lab", lab)}
                                className={`px-2 py-1 rounded text-xs transition-all ${
                                  pendingFilters.lab.includes(lab)
                                    ? "bg-cyan-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {lab}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Growth, Weight, Price */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {/* Growth Type */}
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                            <Microscope className="w-4 h-4 text-teal-500" />
                            Growth
                          </label>
                          <div className="flex gap-1">
                            {["CVD", "HPHT"].map((type) => (
                              <button
                                key={type}
                                onClick={() => toggleArrayFilter("growthType", type)}
                                className={`flex-1 px-2 py-1.5 rounded text-sm transition-all ${
                                  pendingFilters.growthType.includes(type)
                                    ? "bg-teal-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Weight */}
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                            <Scale className="w-4 h-4 text-orange-500" />
                            Weight
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              step="0.01"
                              value={pendingFilters.minWeight}
                              onChange={(e) => handlePendingFilterChange("minWeight", e.target.value)}
                              placeholder="Min"
                              className="w-full px-2 py-2 text-center border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={pendingFilters.maxWeight}
                              onChange={(e) => handlePendingFilterChange("maxWeight", e.target.value)}
                              placeholder="Max"
                              className="w-full px-2 py-2 text-center border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Price */}
                        <div className="bg-white p-3 rounded-lg border border-gray-200 col-span-2 sm:col-span-1">
                          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                            <DollarSign className="w-4 h-4 text-rose-500" />
                            Price
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              step="1"
                              value={pendingFilters.minPricePerCarat}
                              onChange={(e) => handlePendingFilterChange("minPricePerCarat", e.target.value)}
                              placeholder="Min"
                              className="w-full px-2 py-2 text-center border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="number"
                              step="1"
                              value={pendingFilters.maxPricePerCarat}
                              onChange={(e) => handlePendingFilterChange("maxPricePerCarat", e.target.value)}
                              placeholder="Max"
                              className="w-full px-2 py-2 text-center border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                          <Tag className="w-4 h-4 text-green-500" />
                          Status
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {uniqueStatuses.map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusToggle(status)}
                              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                                pendingFilters.status.includes(status)
                                  ? status === "AVAILABLE"
                                    ? "bg-green-600 text-white"
                                    : status === "SOLD"
                                      ? "bg-red-600 text-white"
                                      : status === "HOLD"
                                        ? "bg-amber-500 text-white"
                                        : "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
                    <button
                      onClick={clearAllFilters}
                      className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      Clear All
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={applyFilters}
                        className="px-4 py-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SharePage;
