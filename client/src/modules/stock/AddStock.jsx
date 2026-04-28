import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  Database,
  Table,
  Download,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  X,
  ChevronDown,
  Diamond,
  Palette,
  Sparkles,
  Scissors,
  Building2,
  Microscope,
  Scale,
  DollarSign,
  Tag,
  Share2,
  Link,
  Copy,
  Check,
  Percent,
  Edit,
  MessageCircle,
  Users,
} from "lucide-react";
import * as XLSX from "xlsx";
import { parse as parseCSV } from "papaparse";
import notify from "@/utils/notifications";
import api from "@/services/api";
import AddStockManual from "./AddStockManual";
import ShareAPI from "../share-api/ShareAPI";

const FIELD_MAPPINGS = {
  // Basic fields
  stock_id: [
    "stock id",
    "stockid",
    "stock_id",
    "stock no",
    "stockno",
    "stock #",
    "packet no",
    "packetno",
    "stoneno",
    "stone no",
    "stone #",
    "stone id",
    "stoneno",
    "stone",
    "pkt no",
    "pkt #",
    "ref no",
    "ref #",
    "reference",
  ],
  certificate_number: [
    "certificate number",
    "cert no",
    "cert_no",
    "certificate_no",
    "cert #",
    "cert.",
    "certificate #",
    "report no",
    "report #",
    "lab no",
    "lab #",
    "report",
    "certificate",
    "cert",
    "inscription",
    "insc",
    "cert num",
    "report num",
  ],
  weight: [
    "weight",
    "carat",
    "carat weight",
    "ct",
    "cts",
    "carats",
    "crt",
    "carat wt",
  ],
  shape: ["shape", "shp", "diamond shape", "cut shape"],
  color: ["color", "colour", "col", "colors", "clr"],

  // Fancy color fields
  fancy_color: [
    "fancy color",
    "fancycolor",
    "fncy color",
    "fncy clr",
    "fan color",
    "f color",
  ],
  fancy_color_intensity: [
    "fancy color intensity",
    "intensity",
    "fancy intensity",
    "clr intensity",
    "color intensity",
    "fancy int",
  ],
  fancy_color_overtone: [
    "fancy color overtone",
    "overtone",
    "fancy overtone",
    "color overtone",
  ],

  // Grading fields
  clarity: ["clarity", "clar", "clr", "clarities", "purity"],
  cut: ["cut", "cut grade", "cut quality", "cutting"],
  polish: ["polish", "pol", "polish grade", "polishing", "pol q"],
  symmetry: ["symmetry", "sym", "symm", "symmetry grade", "sym grade", "sym q"],
  fluorescence: [
    "fluorescence",
    "fluor",
    "flr",
    "fl",
    "fluorescence grade",
    "fluor grade",
    "fl. grade",
  ],
  fluorescence_color: [
    "fluorescence color",
    "fl color",
    "fl. color",
    "fluor color",
    "fluor. color",
  ],
  fluorescence_intensity: [
    "fluorescence intensity",
    "fl intensity",
    "fl. intensity",
    "fluor intensity",
    "fl. int",
  ],

  // Measurements
  measurements: [
    "measurements",
    "meas",
    "dimension",
    "dimensions",
    "measurement",
  ],
  length: ["length", "l", "mm length", "len", "lngth", "measurements length"],
  width: ["width", "w", "mm width", "wid", "measurements width"],
  height: [
    "height",
    "h",
    "mm height",
    "depth",
    "ht",
    "dep",
    "measurements depth",
  ],
  table_percentage: [
    "table %",
    "table percentage",
    "table",
    "tbl",
    "table pct",
    "table%",
    "tbl%",
  ],
  depth_percentage: [
    "depth %",
    "depth percentage",
    "depth",
    "dep",
    "depth pct",
    "depth%",
    "tbl depth",
  ],

  // Additional properties
  shade: ["shade", "shd"],
  milky: ["milky", "milkiness", "milk", "mlk"],
  eye_clean: ["eye clean", "eyeclean", "eye", "ec", "e/c"],
  lab: ["lab", "laboratory", "certificate lab", "lab name", "certificate by"],
  certificate_comment: [
    "certificate comment",
    "cert comment",
    "comment",
    "comments",
    "cert comments",
    "remarks",
  ],

  // Location
  city: ["city", "town"],
  state: ["state", "province"],
  country: ["country", "cntry", "nation"],

  // Treatment
  treatment: ["treatment", "treated", "treat", "trt"],

  // Pricing
  rap_price: ["rap price", "rap", "list price", "rap list", "base price"],
  rap_per_carat: [
    "rap per carat",
    "rap",
    "rap rate",
    "rap p/c",
    "rap/ct",
    "rap $/ct",
  ],
  price_per_carat: [
    "price per carat",
    "ppc",
    "per carat price",
    "rate per carat",
    "rate p/c",
    "$/ct",
    "price/carat",
    "price/ct",
    "$ per ct",
    "per ct price",
  ],
  final_price: [
    "final price",
    "total price",
    "amount",
    "total",
    "value",
    "price",
    "cost",
    "net price",
    "total amt",
  ],
  dollar_rate: [
    "dollar rate",
    "rate",
    "usd rate",
    "exchange rate",
    "$ rate",
    "usd",
  ],
  rs_amount: [
    "rs amount",
    "inr amount",
    "rupee amount",
    "local amount",
    "inr",
    "rs",
  ],
  discount: ["discount", "disc", "off", "disc %", "discount %", "less", "comm"],

  // Culet and Gridle
  culet_size: ["culet size", "culet"],
  culet_condition: ["culet condition", "culet cond"],
  gridle_thin: ["gridle thin", "girdle thin", "girdle min"],
  gridle_thick: ["gridle thick", "girdle thick", "girdle max"],
  gridle_condition: [
    "gridle condition",
    "girdle condition",
    "girdle cond",
    "gridle cond",
  ],
  gridle_per: ["gridle per", "girdle %", "girdle per"],

  // Crown and Pavilion
  crown_height: ["crown height"],
  crown_angle: ["crown angle"],
  pavilion_depth: ["pavilion depth"],
  pavilion_angle: ["pavilion angle"],

  // Special features
  heart_arrow: ["heart arrow", "hearts arrow", "h&a"],
  star_length: ["star length"],
  laser_description: ["laser description", "laser inscription", "inscription"],
  growth_type: ["growth type", "growth"],
  key_to_symbol: ["key to symbol", "key to symbols", "symbols"],
  lw_ratio: [
    "lw ratio",
    "l/w ratio",
    "length width ratio",
    "ratio",
    "l-w ratio",
  ],

  // Media
  diamond_image1: ["image 1", "image1", "photo 1", "pic 1"],
  diamond_video: ["video", "diamond video", "video link"],
  certificate_image: ["certificate image", "cert image", "certificate scan"],

  // Status
  status: ["status", "availability", "available", "avail"],
  diamond_type: ["diamond type", "stone type", "stone"],
  party: ["party", "supplier", "vendor", "source", "party name", "party_name"],
};

const AddStock = () => {
  // View mode: 'show' | 'import' | 'manual'
  const [viewMode, setViewMode] = useState("show");
  const [editingStock, setEditingStock] = useState(null);

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [markupPercentage, setMarkupPercentage] = useState("");
  const [showMarkupModal, setShowMarkupModal] = useState(false);

  // User stock state
  const [userStock, setUserStock] = useState([]);
  const [userStockLoading, setUserStockLoading] = useState(false);
  const [userStockPage, setUserStockPage] = useState(1);
  const [userStockTotalPages, setUserStockTotalPages] = useState(1);
  const [userStockSearch, setUserStockSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userStockTotal, setUserStockTotal] = useState(0);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(userStockSearch);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [userStockSearch]);

  // Filter states - pending (not yet applied)
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
    party: [],
  });

  // Applied filters (sent to backend)
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
    party: [],
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    sortBy: "created_at",
    sortOrder: "DESC",
  });

  // Legacy filter states for backward compatibility
  const [filterShape, setFilterShape] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [filterClarity, setFilterClarity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterParty, setFilterParty] = useState("");

  // File upload state
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [importType, setImportType] = useState("");
  const fileInputRef = useRef(null);

  // Fetch user stock on mount and when page, filters, or sorting changes
  useEffect(() => {
    fetchUserStock();
  }, [userStockPage, appliedFilters, sortConfig, debouncedSearch]);

  const handleEditStock = (item) => {
    setEditingStock(item);
    setViewMode("manual");
  };

  const fetchUserStock = async () => {
    setUserStockLoading(true);
    try {
      // Build query params with filters and sorting
      const params = new URLSearchParams();
      params.append("page", userStockPage);
      params.append("limit", 50);

      // Add search
      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      // Add applied filters
      if (appliedFilters.stockId)
        params.append("stockId", appliedFilters.stockId);
      if (appliedFilters.certificate)
        params.append("certificate", appliedFilters.certificate);
      if (appliedFilters.status.length > 0)
        params.append("status", appliedFilters.status.join(","));
      if (appliedFilters.shape.length > 0)
        params.append("shape", appliedFilters.shape.join(","));
      if (appliedFilters.minWeight)
        params.append("minWeight", appliedFilters.minWeight);
      if (appliedFilters.maxWeight)
        params.append("maxWeight", appliedFilters.maxWeight);
      if (appliedFilters.color.length > 0)
        params.append("color", appliedFilters.color.join(","));
      if (appliedFilters.cut.length > 0)
        params.append("cut", appliedFilters.cut.join(","));
      if (appliedFilters.clarity.length > 0)
        params.append("clarity", appliedFilters.clarity.join(","));
      if (appliedFilters.lab.length > 0)
        params.append("lab", appliedFilters.lab.join(","));
      if (appliedFilters.minPricePerCarat)
        params.append("minPricePerCarat", appliedFilters.minPricePerCarat);
      if (appliedFilters.maxPricePerCarat)
        params.append("maxPricePerCarat", appliedFilters.maxPricePerCarat);
      if (appliedFilters.growthType.length > 0)
        params.append("growthType", appliedFilters.growthType.join(","));
      if (appliedFilters.party.length > 0)
        params.append("party", appliedFilters.party.join(","));

      // Add sorting
      params.append("sortBy", sortConfig.sortBy);
      params.append("sortOrder", sortConfig.sortOrder);

      const response = await api.get(`/stock/my?${params.toString()}`);
      if (response.data.success) {
        setUserStock(response.data.data.stocks);
        setUserStockTotalPages(response.data.data.pagination.totalPages);
        setUserStockTotal(response.data.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching user stock:", error);
      notify.error("Error", "Failed to fetch your stock");
    } finally {
      setUserStockLoading(false);
    }
  };

  // Filter and Sorting Handlers
  const handlePendingFilterChange = (field, value) => {
    setPendingFilters((prev) => ({ ...prev, [field]: value }));
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

  // Generic toggle for multi-select filters
  const toggleArrayFilter = (field, value) => {
    setPendingFilters((prev) => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  // Check if any filters are active
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
      appliedFilters.party.length > 0 ||
      appliedFilters.minWeight ||
      appliedFilters.maxWeight ||
      appliedFilters.minPricePerCarat ||
      appliedFilters.maxPricePerCarat
    );
  };

  // Get count of active filters
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
    count += appliedFilters.party.length;
    if (appliedFilters.minWeight || appliedFilters.maxWeight) count++;
    if (appliedFilters.minPricePerCarat || appliedFilters.maxPricePerCarat)
      count++;
    return count;
  };

  const applyFilters = () => {
    setAppliedFilters({ ...pendingFilters });
    setUserStockPage(1); // Reset to first page when filters change
    setShowFilters(false); // Close modal
    setViewMode("show"); // Switch to Show Stock view
  };

  // Remove individual filter
  const removeFilter = (field, value = null) => {
    if (value !== null && Array.isArray(appliedFilters[field])) {
      // Remove specific value from array filter
      const newValues = appliedFilters[field].filter((v) => v !== value);
      const newFilters = { ...appliedFilters, [field]: newValues };
      setAppliedFilters(newFilters);
      setPendingFilters(newFilters);
    } else {
      // Clear entire filter field
      const newFilters = {
        ...appliedFilters,
        [field]: Array.isArray(appliedFilters[field]) ? [] : "",
      };
      setAppliedFilters(newFilters);
      setPendingFilters(newFilters);
    }
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
      party: [],
    };
    setPendingFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setUserStockSearch("");
    setShowFilters(false);
    setUserStockPage(1);

    // Clear legacy filters too
    setFilterShape("");
    setFilterColor("");
    setFilterClarity("");
    setFilterStatus("");
  };
  //share
  // Handle share functionality - open markup modal first
  const handleShare = () => {
    setMarkupPercentage("");
    setShowMarkupModal(true);
  };

  // Generate share link with markup
  const generateShareLinkWithMarkup = async () => {
    setShareLoading(true);
    try {
      // Build filters object to send to backend
      const filtersToShare = {
        filters: {
          ...appliedFilters,
          search: userStockSearch,
          page: userStockPage,
          limit: 50,
          sortBy: sortConfig.sortBy,
          sortOrder: sortConfig.sortOrder,
        },
        markupPercentage: parseFloat(markupPercentage) || 0,
      };

      const response = await api.post("/share/create", filtersToShare);

      if (response.data.success) {
        setShareData(response.data.data);
        setShowMarkupModal(false);
        setShowShareModal(true);
        setCopied(false);
        notify.success(
          "Share Link Created",
          markupPercentage
            ? `Link created with ${markupPercentage}% markup on prices!`
            : "Your stock link is ready to share!",
        );
      }
    } catch (error) {
      console.error("Share error:", error);
      notify.error(
        "Error",
        error.response?.data?.message || "Failed to create share link",
      );
    } finally {
      setShareLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareData?.shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareData.shareUrl);
      setCopied(true);
      notify.success("Copied!", "Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      notify.error("Error", "Failed to copy link");
    }
  };

  const shareViaWhatsApp = () => {
    if (!shareData?.shareUrl) return;
    const text = `Check out my diamond stock: ${shareData.shareUrl}\n\nLink expires in 24 hours.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSort = (column) => {
    setSortConfig((prev) => {
      if (prev.sortBy === column) {
        // Same column: ASC → DESC → Default (reset)
        if (prev.sortOrder === "ASC") {
          return { sortBy: column, sortOrder: "DESC" };
        } else {
          // Reset to default (created_at DESC)
          return { sortBy: "created_at", sortOrder: "DESC" };
        }
      }
      // New column, start with ASC
      return { sortBy: column, sortOrder: "ASC" };
    });
  };

  const getSortIcon = (column) => {
    if (sortConfig.sortBy !== column) {
      return (
        <span className="text-slate-400 opacity-0 group-hover:opacity-50">
          ↕
        </span>
      );
    }
    return sortConfig.sortOrder === "ASC" ? (
      <span className="text-white">↑</span>
    ) : (
      <span className="text-white">↓</span>
    );
  };

  // Normalize field name: first convert to lowercase, trim, remove special chars, then match
  const normalizeFieldName = (field) => {
    if (!field) return "";

    // Step 1: Convert to lowercase, trim, remove underscores and dashes
    const normalized = String(field)
      .toLowerCase()
      .trim()
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ");

    // Step 2: Check if it matches any known field variations
    // First pass: exact matches only
    for (const [standard, variations] of Object.entries(FIELD_MAPPINGS)) {
      for (const variation of variations) {
        const varClean = String(variation.toLowerCase().trim());
        if (normalized === varClean) {
          return standard;
        }
      }
    }

    // Second pass: contains (skip measurements to avoid matching "measurements length" etc)
    for (const [standard, variations] of Object.entries(FIELD_MAPPINGS)) {
      if (standard === "measurements") continue; // Skip generic measurements
      for (const variation of variations) {
        const varClean = variation.toLowerCase().trim();
        if (normalized.includes(varClean)) {
          return standard;
        }
      }
    }

    // Return cleaned version if no match found
    return normalized.replace(/\s+/g, "_");
  };

  // Check if row has stock_id - only these rows will be saved
  const hasStockId = (row) => {
    return row.stock_id && String(row.stock_id).trim() !== "";
  };

  // Count rows that will be saved vs skipped
  const getSaveStats = () => {
    const saveable = data.filter(hasStockId).length;
    const skipped = data.length - saveable;
    return { saveable, skipped, total: data.length };
  };

  const processFile = useCallback(async (uploadedFile) => {
    if (!uploadedFile) return;
    const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();

    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        let parsedData = [];
        let headers = [];

        if (fileExtension === "csv") {
          const result = parseCSV(content, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
          });
          headers = result.meta.fields.map(normalizeFieldName);
          parsedData = result.data.map((row) => {
            const normalizedRow = {};
            Object.entries(row).forEach(([key, value]) => {
              const normalizedKey = normalizeFieldName(key);
              normalizedRow[normalizedKey] = value;
            });
            return normalizedRow;
          });
        } else if (fileExtension === "xlsx" || fileExtension === "xls") {
          // Use ArrayBuffer for better Excel parsing
          const workbook = XLSX.read(content, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          // Use header: true to get objects with headers as keys
          // raw: true returns actual numeric values
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
            header: true,
            raw: false,
            defval: null,
          });

          if (jsonData.length > 0) {
            // Get headers from first row keys
            const rawHeaders = Object.keys(jsonData[0]);
            headers = rawHeaders.map(normalizeFieldName);

            parsedData = jsonData.map((row, rowIdx) => {
              const obj = {};
              rawHeaders.forEach((header, colIdx) => {
                const normalizedKey = normalizeFieldName(header);

                // SKIP if this normalized key already has a valid value
                // This prevents "Star Length" from overwriting "Length"
                if (
                  obj[normalizedKey] !== undefined &&
                  obj[normalizedKey] !== null &&
                  obj[normalizedKey] !== "" &&
                  obj[normalizedKey] !== "0"
                ) {
                  return; // Skip this column, first valid value wins
                }

                let value = row[header];

                // Try to get the actual cell value directly from sheet
                const range = XLSX.utils.decode_range(firstSheet["!ref"]);
                const cellRef = XLSX.utils.encode_cell({
                  r: range.s.r + 1 + rowIdx,
                  c: colIdx,
                });
                const cell = firstSheet[cellRef];

                // PRIORITY: Use formatted value (w) first as it shows what Excel displays
                // Only fall back to raw value (v) if w is not available
                if (cell) {
                  if (
                    cell.w !== undefined &&
                    cell.w !== null &&
                    cell.w !== ""
                  ) {
                    value = cell.w;
                  } else if (cell.v !== undefined && cell.v !== null) {
                    value = cell.v;
                  }
                }

                // Convert to string unless null/undefined
                if (value !== null && value !== undefined) {
                  value = String(value).trim();
                }

                // Only set if value is valid (not null, undefined, empty, or "0" when we don't have a value yet)
                // Actually, we should set it even if "0" because it might be a real 0 value
                // But skip if we already have a valid non-zero value
                const currentVal = obj[normalizedKey];
                const hasValidCurrent =
                  currentVal !== undefined &&
                  currentVal !== null &&
                  currentVal !== "" &&
                  currentVal !== "0";
                const newValIsValid =
                  value !== undefined && value !== null && value !== "";

                if (!hasValidCurrent && newValIsValid) {
                  obj[normalizedKey] = value;
                }
              });

              return obj;
            });
          }
        }

        // Remove duplicate columns (different headers might map to same normalized name)
        const uniqueColumns = [...new Set(headers)];
        setColumns(uniqueColumns);
        setData(parsedData);
        setFile(uploadedFile);

        // Check for stock_id - rows without it will be skipped
        const skippedRows = [];
        parsedData.forEach((row, index) => {
          if (!hasStockId(row)) {
            skippedRows.push({ row: index + 1, reason: "Missing stock_id" });
          }
        });

        const stats = {
          total: parsedData.length,
          saveable: parsedData.filter(hasStockId).length,
          skipped: skippedRows.length,
        };

        if (skippedRows.length > 0) {
          notify.warning(
            "Import Preview",
            `${stats.saveable} rows will be saved, ${stats.skipped} rows will be skipped (missing stock_id)`,
          );
        } else {
          notify.success(
            "File Parsed",
            `All ${parsedData.length} rows will be imported`,
          );
        }
      };

      if (fileExtension === "csv") {
        reader.readAsText(uploadedFile);
      } else {
        reader.readAsArrayBuffer(uploadedFile);
      }
    } catch (error) {
      console.error("File parsing error:", error);
      notify.error(
        "Parse Error",
        "Failed to parse the file. Please check the format.",
      );
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile &&
        (droppedFile.name.endsWith(".csv") ||
          droppedFile.name.endsWith(".xlsx") ||
          droppedFile.name.endsWith(".xls"))
      ) {
        processFile(droppedFile);
      } else {
        notify.error("Invalid File", "Please upload a CSV or XLSX file");
      }
    },
    [processFile],
  );

  const clearFile = () => {
    setFile(null);
    setData([]);
    setColumns([]);
    setImportType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({
    stage: "",
    message: "",
  });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);

  const handleSubmit = async () => {
    if (data.length === 0) {
      notify.error("No Data", "Please upload a file first");
      return;
    }

    const { saveable } = getSaveStats();
    if (saveable === 0) {
      notify.error("No Valid Data", "No rows with stock_id found to save");
      return;
    }

    setIsImporting(true);
    setImportProgress({
      stage: "processing",
      message: "Processing your data...",
    });

    try {
      const response = await api.post("/stock/bulk", {
        stock: data,
        type: importType,
      });
      const result = response.data;

      if (result.limitReached) {
        // Show notification instead of modal
        notify.warning("Import Partial", result.message);

        // Still show success for partially imported items
        if (result.data?.insertedCount > 0) {
          const replaceMsg =
            result.data.replacedCount > 0
              ? `, replaced ${result.data.replacedCount} existing`
              : "";
          notify.warning(
            "Import Partial",
            `Saved ${result.data.insertedCount} rows${replaceMsg}. ${result.message}`,
          );
        }
      } else if (result.data) {
        const replaceMsg =
          result.data.replacedCount > 0
            ? `, replaced ${result.data.replacedCount} existing`
            : "";
        notify.success(
          "Import Complete",
          `Saved ${result.data.insertedCount} rows${replaceMsg}, skipped ${result.data.skippedCount} rows`,
        );
        clearFile();
        fetchFilterOptions(); // Refresh filter options to show new values
      } else {
        console.error("Backend error:", result);
        notify.error(
          "Import Failed",
          result.message || "Server error occurred",
        );
      }
    } catch (error) {
      console.error("Import error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to connect to server";

      if (errorMessage.includes("Subscription limit") || errorMessage.includes("No active subscription")) {
        notify.error(errorMessage);
      } else {
        notify.error("Import Failed", errorMessage);
      }
    } finally {
      setIsImporting(false);
      setImportProgress({ stage: "", message: "" });
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "type",
      "stock_id",
      "party",
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
      "shade",
      "milky",
      "eye_clean",
      "lab",
      "certificate_comment",
      "city",
      "state",
      "country",
      "treatment",
      "depth_percentage",
      "table_percentage",
      "rap_price",
      "rap_per_carat",
      "price_per_carat",
      "final_price",
      "dollar_rate",
      "rs_amount",
      "discount",
      "heart_arrow",
      "star_length",
      "laser_description",
      "growth_type",
      "key_to_symbol",
      "lw_ratio",
      "culet_size",
      "culet_condition",
      "gridle_thin",
      "gridle_thick",
      "gridle_condition",
      "gridle_per",
      "crown_height",
      "crown_angle",
      "pavilion_depth",
      "pavilion_angle",
      "status",
      "diamond_type",
      "diamond_image1",
      "diamond_video",
      "certificate_image",
    ];
    const template = headers.join(",") + "\n";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter user stock based on search and filters
  const filteredUserStock = userStock.filter((item) => {
    const matchesSearch =
      !debouncedSearch ||
      (item.stock_id &&
        item.stock_id.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
      (item.shape &&
        item.shape.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
      (item.certificate_number &&
        item.certificate_number
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())) ||
      (item.color &&
        item.color.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
      (item.party &&
        item.party.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
      (item.clarity &&
        item.clarity.toLowerCase().includes(debouncedSearch.toLowerCase()));

    const matchesShape = !filterShape || item.shape === filterShape;
    const matchesColor = !filterColor || item.color === filterColor;
    const matchesClarity = !filterClarity || item.clarity === filterClarity;
    const matchesStatus = !filterStatus || item.status === filterStatus;
    const matchesParty = !filterParty || item.party === filterParty;

    return (
      matchesSearch &&
      matchesShape &&
      matchesColor &&
      matchesClarity &&
      matchesStatus &&
      matchesParty
    );
  });

  // Fetch filter options from DB (all available values)
  const [filterOptions, setFilterOptions] = useState({
    shapes: [],
    colors: [],
    clarities: [],
    parties: [],
  });
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);

  const fetchFilterOptions = useCallback(async () => {
    try {
      setFilterOptionsLoading(true);
      const response = await api.get("/stock/filters");
      if (response.data.success) {
        setFilterOptions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    } finally {
      setFilterOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // Use DB filter options
  const uniqueShapes = filterOptions.shapes;
  const uniqueColors = filterOptions.colors;
  const uniqueClarities = filterOptions.clarities;
  const uniqueStatuses = ["AVAILABLE", "HOLD", "SOLD", "MEMO"];

  const clearFilters = () => {
    setFilterShape("");
    setFilterColor("");
    setFilterClarity("");
    setFilterStatus("");
    setUserStockSearch("");
  };

  // All columns from the database
  const ALL_DB_FIELDS = [
    "stock_id",
    "certificate_number",
    "weight",
    "shape",
    "color",
    "party",
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
    "rap_per_carat",
    "price_per_carat",
    "final_price",
    "discount",
    "dollar_rate",
    "rs_amount",
    "heart_arrow",
    "star_length",
    "laser_description",
    "growth_type",
    "key_to_symbol",
    "lw_ratio",
    "diamond_type",
    "type",
    "status",
    "diamond_image1",
    "diamond_video",
    "certificate_image",
  ];

  // Helper to get value or "-"
  const getValue = (item, field) => {
    if (item[field] === null || item[field] === undefined || item[field] === "")
      return "-";
    return item[field];
  };

  // Simple Table Row - All fields in one horizontal row
  const SimpleTableRow = ({ item, index, page }) => {
    // Calculate continuous row number: (page - 1) * 50 + index + 1
    const rowNumber = (page - 1) * 50 + index + 1;
    const rowBgClass = index % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]";

    return (
      <tr
        className={`${rowBgClass} hover:bg-[#EFF6FF] transition-colors text-sm border-b border-[#E2E8F0]`}
      >
        {/* Row Number - Continuous across pages */}
        <td
          className={`px-2 py-3 text-center text-xs text-[#64748B] border-r border-[#E2E8F0] sticky left-0 z-10 w-10 font-medium ${rowBgClass}`}
        >
          {rowNumber}
        </td>

        {/* All Database Fields */}
        {ALL_DB_FIELDS.map((field) => {
          const value = getValue(item, field);
          const isEmpty = value === "-";

          return (
            <td
              key={field}
              className={`px-2 sm:px-3 py-2 sm:py-3 border-r border-[#E2E8F0] whitespace-nowrap text-xs sm:text-sm ${isEmpty ? "text-[#94A3B8]" : "text-[#374151]"
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
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.status === "AVAILABLE" || !item.status
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : item.status === "SOLD"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-amber-100 text-amber-700 border border-amber-200"
                    }`}
                >
                  {value}
                </span>
              ) : field === "final_price" && !isEmpty ? (
                <span className="font-semibold text-green-700">
                  ${parseFloat(value).toLocaleString()}
                </span>
              ) : field === "weight" && !isEmpty ? (
                <span className="font-medium">{value} </span>
              ) : (
                value
              )}
            </td>
          );
        })}

        {/* Actions Column */}
        <td className="px-2 py-2 border-r border-[#E2E8F0] text-center sticky right-0 bg-white shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => handleEditStock(item)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Update Data"
          >
            <Edit className="w-4 h-4" />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Main Action Bar - Left: Filter, Right: Add/Show Stock + Import Features */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Right: View Mode Toggle - 3 Options */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setViewMode("show")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${viewMode === "show"
                  ? "bg-[#1E3A8A] text-white shadow-md"
                  : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
              >
                <Table className="w-4 h-4" />
                <span className="hidden sm:inline">Show Stock</span>
                <span className="sm:hidden">Stock</span>
              </button>
              <button
                onClick={() => setViewMode("import")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${viewMode === "import"
                  ? "bg-[#1E3A8A] text-white shadow-md"
                  : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Imports</span>
                <span className="sm:hidden">Import</span>
              </button>
              <button
                onClick={() => {
                  setViewMode("manual");
                  setEditingStock(null);
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${viewMode === "manual"
                  ? "bg-[#1E3A8A] text-white shadow-md"
                  : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Manual Entry</span>
                <span className="sm:hidden">Manual</span>
              </button>
              <button
                onClick={() => setViewMode("share-api")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${viewMode === "share-api"
                  ? "bg-[#1E3A8A] text-white shadow-md"
                  : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share API</span>
                <span className="sm:hidden">API</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Modal Popup */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[2010] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-[98%] sm:w-[94%] md:max-w-4xl max-h-[95vh] flex flex-col overflow-hidden pointer-events-auto border border-gray-200">
                {/* Header */}
                <div className="flex-none flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-slate-900 text-white">
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

                {/* Filter Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-2.5 bg-gray-50">
                  <div className="space-y-1.5">
                    {/* Search & Party Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={pendingFilters.stockId}
                        onChange={(e) =>
                          handlePendingFilterChange("stockId", e.target.value)
                        }
                        placeholder="Search By Stock ID.."
                        className="input-field w-full py-2 text-sm"
                      />
                      <input
                        type="text"
                        value={pendingFilters.certificate}
                        onChange={(e) =>
                          handlePendingFilterChange(
                            "certificate",
                            e.target.value,
                          )
                        }
                        placeholder="Search By Certificate Number.."
                        className="input-field w-full py-2 text-sm"
                      />
                      <select
                        className="input-field w-full py-2 text-sm"
                        value={pendingFilters.party?.[0] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPendingFilters((prev) => ({
                            ...prev,
                            party: val ? [val] : [],
                          }));
                        }}
                      >
                        <option value="">All Parties</option>
                        {filterOptions.parties?.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Shape */}
                    <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                        <Diamond className="w-4 h-4 text-indigo-500" />
                        Shape
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {filterOptionsLoading ? (
                          <div className="flex flex-wrap gap-1.5 w-full">
                            {[...Array(8)].map((_, i) => (
                              <div
                                key={i}
                                className="h-7 w-16 bg-gray-200 rounded-md animate-pulse"
                              />
                            ))}
                          </div>
                        ) : uniqueShapes.length > 0 ? (
                          uniqueShapes.map((shape) => (
                            <button
                              key={shape}
                              onClick={() => toggleArrayFilter("shape", shape)}
                              className={`px-3 py-1.5 rounded-md text-sm transition-all ${pendingFilters.shape.includes(shape)
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              {shape}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">
                            No shapes
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Color */}
                    <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                        <Palette className="w-4 h-4 text-purple-500" />
                        Color
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {filterOptionsLoading ? (
                          <div className="flex flex-wrap gap-1.5 w-full">
                            {[...Array(12)].map((_, i) => (
                              <div
                                key={i}
                                className="h-7 w-12 bg-gray-200 rounded-md animate-pulse"
                              />
                            ))}
                          </div>
                        ) : uniqueColors.length > 0 ? (
                          uniqueColors.map((color) => (
                            <button
                              key={color}
                              onClick={() => toggleArrayFilter("color", color)}
                              className={`px-3 py-1.5 rounded-md text-sm transition-all ${pendingFilters.color.includes(color)
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              {color}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">
                            No colors
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2 Column Grid for Clarity, Cut, Lab */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {/* Clarity */}
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                          Clarity
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {filterOptionsLoading ? (
                            <div className="flex flex-wrap gap-1 w-full">
                              {[...Array(6)].map((_, i) => (
                                <div
                                  key={i}
                                  className="h-6 w-10 bg-gray-200 rounded-md animate-pulse"
                                />
                              ))}
                            </div>
                          ) : uniqueClarities.length > 0 ? (
                            uniqueClarities.map((clarity) => (
                              <button
                                key={clarity}
                                onClick={() =>
                                  toggleArrayFilter("clarity", clarity)
                                }
                                className={`px-2 py-1 rounded text-xs transition-all ${pendingFilters.clarity.includes(clarity)
                                  ? "bg-emerald-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                              >
                                {clarity}
                              </button>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">
                              No data
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cut */}
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                          <Scissors className="w-4 h-4 text-pink-500" />
                          Cut
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {["ID", "EX", "VG", "Good", "Fair", "Poor"].map(
                            (cut, idx) => {
                              const fullNames = [
                                "IDEAL",
                                "EXCELLENT",
                                "VERY GOOD",
                                "Good",
                                "Fair",
                                "Poor",
                              ];
                              return (
                                <button
                                  key={fullNames[idx]}
                                  onClick={() =>
                                    toggleArrayFilter("cut", fullNames[idx])
                                  }
                                  className={`px-2 py-1 rounded text-xs transition-all ${pendingFilters.cut.includes(fullNames[idx])
                                    ? "bg-pink-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                  {cut}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>

                      {/* Lab */}
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200 col-span-2 sm:col-span-1">
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                          <Building2 className="w-4 h-4 text-cyan-500" />
                          Lab
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {[
                            "GIA",
                            "IGI",
                            "HRD",
                            "AGS",
                            "EGL",
                            "CGL",
                            "NON CERTIFIED",
                          ].map((lab) => (
                            <button
                              key={lab}
                              onClick={() => toggleArrayFilter("lab", lab)}
                              className={`px-2 py-1 rounded text-xs transition-all ${pendingFilters.lab.includes(lab)
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

                    {/* Growth, Weight, Price Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {/* Growth Type */}
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                          <Microscope className="w-4 h-4 text-teal-500" />
                          Growth
                        </label>
                        <div className="flex gap-1">
                          {["CVD", "HPHT"].map((type) => (
                            <button
                              key={type}
                              onClick={() =>
                                toggleArrayFilter("growthType", type)
                              }
                              className={`flex-1 px-2 py-1.5 rounded text-sm transition-all ${pendingFilters.growthType.includes(type)
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
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                          <Scale className="w-4 h-4 text-orange-500" />
                          Weight
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={pendingFilters.minWeight}
                            onChange={(e) =>
                              handlePendingFilterChange(
                                "minWeight",
                                e.target.value,
                              )
                            }
                            placeholder="Min"
                            className="input-field text-center w-full py-2 text-sm"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={pendingFilters.maxWeight}
                            onChange={(e) =>
                              handlePendingFilterChange(
                                "maxWeight",
                                e.target.value,
                              )
                            }
                            placeholder="Max"
                            className="input-field text-center w-full py-2 text-sm"
                          />
                        </div>
                      </div>

                      {/* Price */}
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200 col-span-2 sm:col-span-1">
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                          <DollarSign className="w-4 h-4 text-rose-500" />
                          Price / Ct
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="1"
                            value={pendingFilters.minPricePerCarat}
                            onChange={(e) =>
                              handlePendingFilterChange(
                                "minPricePerCarat",
                                e.target.value,
                              )
                            }
                            placeholder="Min"
                            className="input-field text-center w-full py-2 text-sm"
                          />
                          <input
                            type="number"
                            step="1"
                            value={pendingFilters.maxPricePerCarat}
                            onChange={(e) =>
                              handlePendingFilterChange(
                                "maxPricePerCarat",
                                e.target.value,
                              )
                            }
                            placeholder="Max"
                            className="input-field text-center w-full py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2">
                        <Tag className="w-4 h-4 text-green-500" />
                        Status
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {["AVAILABLE", "HOLD", "SOLD", "MEMO"].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusToggle(status)}
                            className={`px-3 py-1.5 rounded-md text-sm transition-all ${pendingFilters.status.includes(status)
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
                <div className="flex-none flex items-center justify-between px-4 py-2.5 border-t border-gray-200 bg-white">
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

      {/* Main Content Area - 3 View Modes */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: Show Stock - Only Table */}
        {viewMode === "show" && (
          <div className="space-y-4">
            {/* Search Bar - Responsive */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search Stock By Stock ID"
                  value={userStockSearch}
                  onChange={(e) => setUserStockSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${hasActiveFilters()
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

                {/* share */}
                <button
                  onClick={handleShare}
                  disabled={userStockLoading || filteredUserStock.length === 0}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  onClick={fetchUserStock}
                  disabled={userStockLoading}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] rounded-lg transition-colors disabled:opacity-50 text-sm"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${userStockLoading ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Active Filters Display - Compact */}
            {hasActiveFilters() && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 font-medium">
                  Filters:
                </span>
                {/* Stock ID */}
                {appliedFilters.stockId && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    Stock:{appliedFilters.stockId}
                    <button
                      onClick={() => removeFilter("stockId")}
                      className="hover:bg-blue-200 rounded p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {/* Certificate */}
                {appliedFilters.certificate && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    Cert:{appliedFilters.certificate}
                    <button
                      onClick={() => removeFilter("certificate")}
                      className="hover:bg-blue-200 rounded p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {/* Shapes */}
                {appliedFilters.shape.map((shape) => (
                  <span
                    key={shape}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs"
                  >
                    {shape}
                    <button
                      onClick={() => removeFilter("shape", shape)}
                      className="hover:bg-indigo-200 rounded p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {/* Colors */}
                {appliedFilters.color.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                  >
                    {color}
                    <button
                      onClick={() => removeFilter("color", color)}
                      className="hover:bg-purple-200 rounded p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {/* Clarities */}
                {appliedFilters.clarity.map((clarity) => (
                  <span
                    key={clarity}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs"
                  >
                    {clarity}
                    <button
                      onClick={() => removeFilter("clarity", clarity)}
                      className="hover:bg-emerald-200 rounded p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {/* Cuts */}
                {appliedFilters.cut.map((cut) => (
                  <span
                    key={cut}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs"
                  >
                    {cut}
                    <button
                      onClick={() => removeFilter("cut", cut)}
                      className="hover:bg-pink-200 rounded p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {/* Labs */}
                {appliedFilters.lab.map((lab) => (
                  <span
                    key={lab}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs"
                  >
                    {lab}
                    <button
                      onClick={() => removeFilter("lab", lab)}
                      className="hover:bg-cyan-200 rounded p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {/* Parties */}
                {appliedFilters.party?.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    Party: {p}
                    <button
                      onClick={() => removeFilter("party", p)}
                      className="hover:bg-blue-200 rounded p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {/* Growth Types */}
                {appliedFilters.growthType.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs"
                  >
                    {type}
                    <button
                      onClick={() => removeFilter("growthType", type)}
                      className="hover:bg-teal-200 rounded p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {/* Statuses */}
                {appliedFilters.status.map((status) => (
                  <span
                    key={status}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${status === "AVAILABLE"
                      ? "bg-green-100 text-green-700"
                      : status === "SOLD"
                        ? "bg-red-100 text-red-700"
                        : status === "HOLD"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {status}
                    <button
                      onClick={() => removeFilter("status", status)}
                      className={`rounded p-0.5 ml-1 ${status === "AVAILABLE"
                        ? "hover:bg-green-200"
                        : status === "SOLD"
                          ? "hover:bg-red-200"
                          : status === "HOLD"
                            ? "hover:bg-amber-200"
                            : "hover:bg-blue-200"
                        }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {/* Weight Range */}
                {(appliedFilters.minWeight || appliedFilters.maxWeight) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                    {appliedFilters.minWeight || "0"}-
                    {appliedFilters.maxWeight || "∞"}ct
                    <button
                      onClick={() => {
                        removeFilter("minWeight");
                        removeFilter("maxWeight");
                      }}
                      className="hover:bg-orange-200 rounded p-0.5 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {/* Price Range */}
                {(appliedFilters.minPricePerCarat ||
                  appliedFilters.maxPricePerCarat) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-xs">
                      ${appliedFilters.minPricePerCarat || "0"}-$
                      {appliedFilters.maxPricePerCarat || "∞"}
                      <button
                        onClick={() => {
                          removeFilter("minPricePerCarat");
                          removeFilter("maxPricePerCarat");
                        }}
                        className="hover:bg-rose-200 rounded p-0.5 ml-1"
                      >
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

            {/* User Stock List - Full Width Table */}
            {userStockLoading ? (
              <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
                {/* Skeleton Header */}
                <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] p-4">
                  <div className="flex gap-4">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                {/* Skeleton Rows */}
                <div className="p-4 space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredUserStock.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
                <div className="w-16 h-16 rounded-xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-[#94A3B8]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  No Stock Found
                </h3>
                <p className="text-[#64748B] mb-4">
                  {userStockSearch
                    ? "No items match your search criteria"
                    : "You haven't added any stock yet."}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setViewMode("import")}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Import Data
                  </button>
                  <button
                    onClick={() => setViewMode("manual")}
                    className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E40AF] transition-colors font-medium"
                  >
                    Manual Entry
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Results Summary */}
                <div className="bg-white rounded-lg border border-[#E2E8F0] p-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#64748B]">
                      Showing{" "}
                      <span className="font-semibold text-[#0F172A]">
                        {filteredUserStock.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-[#0F172A]">
                        {userStockTotal}
                      </span>{" "}
                      total items (Page{" "}
                      <span className="font-semibold text-[#0F172A]">
                        {userStockPage}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-[#0F172A]">
                        {userStockTotalPages}
                      </span>
                      )
                    </span>
                  </div>
                </div>

                {/* Full Width Table */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-auto max-h-[70vh]">
                  <table className="w-full text-sm border-collapse">
                    <thead className="sticky top-0 z-30 bg-gray-200">
                      <tr className="bg-gray-200 text-gray-900">
                        <th className="px-2 py-3 text-center font-semibold border-r border-gray-300 sticky left-0 z-40 w-10 bg-gray-300">
                          #
                        </th>
                        {ALL_DB_FIELDS.map((field) => {
                          // Determine if this column is sortable
                          const sortableFields = [
                            "stock_id",
                            "certificate_number",
                            "weight",
                            "shape",
                            "color",
                            "clarity",
                            "cut",
                            "lab",
                            "price_per_carat",
                            "final_price",
                            "growth_type",
                            "status",
                          ];
                          const isSortable = sortableFields.includes(field);

                          return (
                            <th
                              key={field}
                              onClick={() => isSortable && handleSort(field)}
                              className={`px-2 sm:px-3 py-2 sm:py-3 text-left font-semibold border-r border-gray-300 whitespace-nowrap bg-gray-200 text-xs sm:text-sm ${isSortable
                                ? "cursor-pointer hover:bg-gray-300 transition-all group"
                                : ""
                                }`}
                            >
                              <div className="flex items-center gap-1">
                                <span>
                                  {field.replace(/_/g, " ").toUpperCase()}
                                </span>
                                {isSortable && (
                                  <span className="ml-1">
                                    {getSortIcon(field)}
                                  </span>
                                )}
                              </div>
                            </th>
                          );
                        })}
                        <th className="px-2 sm:px-3 py-2 sm:py-3 text-center font-semibold border-r border-gray-300 whitespace-nowrap bg-gray-200 text-xs sm:text-sm sticky right-0 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="overflow-y-auto">
                      {filteredUserStock.map((item, index) => (
                        <SimpleTableRow
                          key={item.id}
                          item={item}
                          index={index}
                          page={userStockPage}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {userStockTotalPages > 1 && (
                  <div className="px-4 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-[#64748B]">
                      Page{" "}
                      <span className="font-semibold text-[#0F172A]">
                        {userStockPage}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-[#0F172A]">
                        {userStockTotalPages}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setUserStockPage((p) => Math.max(1, p - 1))
                        }
                        disabled={userStockPage === 1}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Prev</span>
                      </button>
                      <button
                        onClick={() =>
                          setUserStockPage((p) =>
                            Math.min(userStockTotalPages, p + 1),
                          )
                        }
                        disabled={userStockPage === userStockTotalPages}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Imports - File Upload + Preview + Duplicate Modal */}
        {viewMode === "import" && (
          <div className="space-y-6">
            {/* Import Options Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Excel/CSV Import */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-white rounded-xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 p-6 cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                    <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-1">
                    Excel / CSV
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    Upload .xlsx, .xls, or .csv files
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) =>
                      e.target.files?.[0] && processFile(e.target.files[0])
                    }
                    className="hidden"
                  />
                </div>
              </div>

              {/* API Import */}
              {/* <div
                onClick={() =>
                  notify.info(
                    "Coming Soon",
                    "API import will be available soon!",
                  )
                }
                className="bg-white rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 p-6 cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                    <Database className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-1">
                    API Import
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    Connect external data source
                  </p>
                </div>
              </div> */}

              {/* Download Template */}
              <div
                onClick={downloadTemplate}
                className="bg-white rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-500 p-6 cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
                    <Download className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-1">
                    Template
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    Download sample CSV format
                  </p>
                </div>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging
                ? "border-emerald-500 bg-emerald-50"
                : "border-[#E2E8F0] bg-white hover:border-emerald-300"
                }`}
            >
              <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                <Upload
                  className={`w-8 h-8 ${isDragging ? "text-emerald-500" : "text-[#94A3B8]"}`}
                />
              </div>
              <p className="text-lg font-medium text-[#0F172A] mb-2">
                Drop your file here, or{" "}
                <span
                  className="text-emerald-600 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </span>
              </p>
              <p className="text-sm text-[#64748B]">
                Supports CSV, XLSX, XLS files up to 10MB
              </p>
            </div>

            {/* File Preview & Data Table */}
            {data.length > 0 && (
              <div className="space-y-4">
                {/* File Info Bar */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
                  {/* File Info - First Row */}
                  <div className="flex items-center gap-3 mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                    <div>
                      <p className="font-medium text-[#0F172A]">{file?.name}</p>
                      <p className="text-sm text-[#64748B]">
                        {data.length} rows ready to import
                      </p>
                    </div>
                  </div>

                  {/* Import Controls - Second Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Type Dropdown and Mobile Cancel Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      {/* Type Dropdown */}
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-[#64748B]">
                          Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={importType}
                          onChange={(e) => setImportType(e.target.value)}
                          className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select Type</option>
                          <option value="NATURAL">NATURAL</option>
                          <option value="LABGROWN">LABGROWN</option>
                        </select>
                      </div>

                      {/* Cancel Button - Mobile Only */}
                      <button
                        onClick={clearFile}
                        className="px-4 py-2 text-[#64748B] hover:text-red-600 transition-colors sm:hidden"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                      {/* Cancel Button - Desktop Only */}
                      <button
                        onClick={clearFile}
                        className="px-4 py-2 text-[#64748B] hover:text-red-600 transition-colors hidden sm:block sm:order-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isImporting || !importType}
                        className="w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 sm:order-1"
                      >
                        {isImporting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Import {getSaveStats().saveable} Rows
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Data Preview Table */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-auto max-h-[60vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 z-20 bg-slate-700 text-white">
                      <tr>
                        {columns.map((col) => (
                          <th
                            key={col}
                            className="px-2 sm:px-3 py-2 text-left font-semibold whitespace-nowrap text-xs sm:text-sm"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 10).map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]"
                        >
                          {columns.map((col) => (
                            <td
                              key={col}
                              className="px-2 sm:px-3 py-2 whitespace-nowrap text-xs sm:text-sm"
                            >
                              {row[col] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.length > 10 && (
                    <div className="p-3 text-center text-sm text-[#64748B] bg-[#F8FAFC]">
                      + {data.length - 10} more rows
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: Manual Entry */}
        {viewMode === "manual" && (
          <AddStockManual
            onStockAdded={() => {
              fetchUserStock();
              fetchFilterOptions();
              setEditingStock(null);
              setViewMode("show");
            }}
            editData={editingStock}
            onCancel={() => {
              setEditingStock(null);
              setViewMode("show");
            }}
          />
        )}

        {/* VIEW 4: Share API */}
        {viewMode === "share-api" && <ShareAPI />}
      </div>

      {/* Import Loading Overlay */}
      {isImporting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Importing Stock...
            </h3>
            <p className="text-gray-600 mb-4">{importProgress.message}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Please wait, this may take a moment
            </p>
          </div>
        </div>
      )}

      {/* share */}
      {/* Markup Input Modal - First Step */}
      <AnimatePresence>
        {showMarkupModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMarkupModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-[2010] pointer-events-none p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Percent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Price Markup
                        </h3>
                        <p className="text-sm text-indigo-100">
                          Add percentage to price per carat
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMarkupModal(false)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Markup Percentage (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={markupPercentage}
                        onChange={(e) => setMarkupPercentage(e.target.value)}
                        placeholder="Enter percentage (e.g., 10)"
                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        min="0"
                        max="1000"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        %
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Leave empty for no markup. Price per carat will be
                      increased by this percentage.
                    </p>
                  </div>

                  {/* Preview */}
                  {markupPercentage && parseFloat(markupPercentage) > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">
                        <span className="font-semibold">Preview:</span> Price
                        per carat will be increased by{" "}
                        <span className="font-semibold">
                          {markupPercentage}%
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowMarkupModal(false)}
                      className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={generateShareLinkWithMarkup}
                      disabled={shareLoading}
                      className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {shareLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          Generate Link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Share Modal - Second Step */}
      <AnimatePresence>
        {showShareModal && shareData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-[2010] p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Share Stock
                        </h3>
                        <p className="text-indigo-100 text-sm">
                          Link expires in 24 hours
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowShareModal(false)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Link Display */}
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 border border-gray-200">
                    <Link className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {shareData.shareUrl}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Copy Link */}
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${copied
                        ? "bg-green-100 text-green-700 border-2 border-green-200"
                        : "bg-indigo-50 text-indigo-700 border-2 border-indigo-100 hover:bg-indigo-100"
                        }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </>
                      )}
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={shareViaWhatsApp}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 border-2 border-green-100 hover:bg-green-100 rounded-xl font-medium transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                  </div>

                  {/* Info */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800 flex items-center gap-2">
                      <span className="font-medium">Note:</span>
                      Anyone with this link can view your filtered stock data
                      for 24 hours. Pricing information is hidden in shared
                      view.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Subscription Limit Modal - Bulk Upload */}
      <AnimatePresence>
        {showSubscriptionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000] p-4"
            onClick={() => setShowSubscriptionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Premium Header */}
              <div className="relative bg-gradient-to-br from-amber-500 via-orange-400 to-red-500 px-6 py-8">
                <div className="absolute top-0 right-0 opacity-10">
                  <DollarSign className="w-32 h-32" />
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/30">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      Limit Reached
                    </h3>
                    <p className="text-white/90 text-sm">
                      Time to grow your business
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="px-6 py-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {subscriptionError}
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Add more stocks</span>{" "}
                      with higher limits
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Bulk import</span>{" "}
                      unlimited records
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Priority support</span>{" "}
                      and advanced features
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Continue Later
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/pricing";
                    setShowSubscriptionModal(false);
                  }}
                  className="flex-1 px-4 py-3 text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all hover:scale-105"
                >
                  Upgrade Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddStock;
