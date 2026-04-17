import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  AlertCircle,
  Database,
  Table,
  Download,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  CloudUpload,
  MoreVertical,
  Upload as UploadIcon,
  Globe,
  Pause,
  ShoppingCart,
  Send,
  RotateCcw,
  AlertTriangle,
  X,
  Grid3X3,
  FileUp,
  ArrowDownToLine,
  RefreshCw,
  SlidersHorizontal,
  FileJson,
  Layers,
  Box,
  TrendingUp,
  DollarSign,
  Gem,
  Hash,
  Scale,
  Palette,
  Sparkles,
} from "lucide-react";
import * as XLSX from "xlsx";
import { parse as parseCSV } from "papaparse";
import notify from "../../utils/notifications";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import AddStockManual from "./AddStockManual";

// Only stock_id is required to save to database
// All other fields are optional - if data exists, save it; if not, save as null

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
  diamond_image2: ["image 2", "image2", "photo 2", "pic 2"],
  diamond_image3: ["image 3", "image3", "photo 3", "pic 3"],
  diamond_image4: ["image 4", "image4", "photo 4", "pic 4"],
  diamond_image5: ["image 5", "image5", "photo 5", "pic 5"],
  diamond_video: ["video", "diamond video", "video link"],
  certificate_image: ["certificate image", "cert image", "certificate scan"],

  // Status
  status: ["status", "availability", "available", "avail"],
  diamond_type: ["diamond type", "stone type", "stone", "growth type"],
};

const AddStock = () => {
  const { user } = useAuth();

  // View mode: 'show' | 'import' | 'manual'
  const [viewMode, setViewMode] = useState("show");

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const importMenuRef = useRef(null);

  // User stock state
  const [userStock, setUserStock] = useState([]);
  const [userStockLoading, setUserStockLoading] = useState(false);
  const [userStockPage, setUserStockPage] = useState(1);
  const [userStockTotalPages, setUserStockTotalPages] = useState(1);
  const [userStockSearch, setUserStockSearch] = useState("");
  const [userStockTotal, setUserStockTotal] = useState(0);

  // Filter states
  const [filterShape, setFilterShape] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [filterClarity, setFilterClarity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // File upload state
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [previewMode, setPreviewMode] = useState("grid");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [validationErrors, setValidationErrors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(50);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    onHold: 0,
    totalValue: 0,
  });

  // Fetch user stock on mount and when page changes
  useEffect(() => {
    fetchUserStock();
    fetchStats();
  }, [userStockPage]);

  // Close import menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (importMenuRef.current && !importMenuRef.current.contains(event.target)) {
        setShowImportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUserStock = async () => {
    setUserStockLoading(true);
    try {
      const response = await api.get(`/stock/my?page=${userStockPage}&limit=50`);
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

  const fetchStats = async () => {
    try {
      const response = await api.get("/stock/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
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

  // Parse measurements string like "7.74-7.80*5.49" into length, width, height
  const parseMeasurements = (measurementsStr) => {
    if (!measurementsStr || typeof measurementsStr !== "string") {
      return { length: null, width: null, height: null };
    }

    const cleanStr = measurementsStr.trim();

    // Match pattern: number-number*number (length-width*height)
    const match = cleanStr.match(/^(\d+\.?\d*)-(\d+\.?\d*)\*(\d+\.?\d*)$/);

    if (match) {
      return {
        length: parseFloat(match[1]),
        width: parseFloat(match[2]),
        height: parseFloat(match[3]),
      };
    }

    // Pattern: number*number*number (all asterisks)
    const altMatch = cleanStr.match(/^(\d+\.?\d*)\*(\d+\.?\d*)\*(\d+\.?\d*)$/);
    if (altMatch) {
      return {
        length: parseFloat(altMatch[1]),
        width: parseFloat(altMatch[2]),
        height: parseFloat(altMatch[3]),
      };
    }

    return { length: null, width: null, height: null };
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

    setIsLoading(true);
    setUploadProgress(0);
    setValidationErrors([]);

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
          console.log("Header = ", headers);
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
            defval: null
          });

          if (jsonData.length > 0) {
            // Get headers from first row keys
            const rawHeaders = Object.keys(jsonData[0]);
            headers = rawHeaders.map(normalizeFieldName);
            
            // DEBUG: Check raw Excel values for length/width/height columns
            console.log("=== EXCEL RAW DEBUG ===");
            const range = XLSX.utils.decode_range(firstSheet['!ref']);
            rawHeaders.forEach((header, colIdx) => {
              const lowerHeader = header.toLowerCase();
              if (lowerHeader.includes('length') || lowerHeader.includes('width') || lowerHeader.includes('height') || lowerHeader.includes('depth')) {
                // Get first data row cell (row 1 is header, so data starts at row 2 -> index 1)
                const cellRef = XLSX.utils.encode_cell({r: range.s.r + 1, c: colIdx});
                const cell = firstSheet[cellRef];
                const hasIssue = cell?.v === 0 && cell?.w && cell?.w !== "0";
                console.log(`Header "${header}" (col ${colIdx}) -> Cell ${cellRef}:`, {
                  v: cell?.v,  // raw value
                  w: cell?.w,  // formatted value
                  t: cell?.t,  // type
                  ISSUE: hasIssue ? "RAW IS 0 BUT FORMATTED HAS VALUE!" : "OK"
                });
              }
            });
            console.log("=======================");
            
            parsedData = jsonData.map((row, rowIdx) => {
              const obj = {};
              rawHeaders.forEach((header, colIdx) => {
                const normalizedKey = normalizeFieldName(header);
                
                // SKIP if this normalized key already has a valid value
                // This prevents "Star Length" from overwriting "Length"
                if (obj[normalizedKey] !== undefined && obj[normalizedKey] !== null && obj[normalizedKey] !== "" && obj[normalizedKey] !== "0") {
                  // DEBUG: Show which columns are being skipped
                  if (rowIdx === 0) {
                    console.log(`SKIPPING column "${header}" -> "${normalizedKey}" (already has value: "${obj[normalizedKey]}")`);
                  }
                  return; // Skip this column, first valid value wins
                }
                
                let value = row[header];
                
                // Try to get the actual cell value directly from sheet
                const range = XLSX.utils.decode_range(firstSheet['!ref']);
                const cellRef = XLSX.utils.encode_cell({r: range.s.r + 1 + rowIdx, c: colIdx});
                const cell = firstSheet[cellRef];
                
                // PRIORITY: Use formatted value (w) first as it shows what Excel displays
                // Only fall back to raw value (v) if w is not available
                if (cell) {
                  if (cell.w !== undefined && cell.w !== null && cell.w !== "") {
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
                const hasValidCurrent = currentVal !== undefined && currentVal !== null && currentVal !== "" && currentVal !== "0";
                const newValIsValid = value !== undefined && value !== null && value !== "";
                
                if (!hasValidCurrent && newValIsValid) {
                  obj[normalizedKey] = value;
                }
              });
              
              // DEBUG first row
              if (rowIdx === 0) {
                console.log("First row parsed:", {
                  length: obj.length,
                  width: obj.width,
                  height: obj.height,
                  color: obj.color,
                  fancy_color: obj.fancy_color,
                  fancy_color_intensity: obj.fancy_color_intensity,
                  fancy_color_overtone: obj.fancy_color_overtone
                });
              }
              
              return obj;
            });
          }
        }

        // Remove duplicate columns (different headers might map to same normalized name)
        const uniqueColumns = [...new Set(headers)]
        console.log("Unique columns:", uniqueColumns);
        console.log("parsedData :", parsedData);
        setColumns(uniqueColumns);
        setData(parsedData);
        setFile(uploadedFile);
        setCurrentPage(1);
        setUploadResult(null);

        // Check for stock_id - rows without it will be skipped
        const skippedRows = [];
        parsedData.forEach((row, index) => {
          if (!hasStockId(row)) {
            skippedRows.push({ row: index + 1, reason: "Missing stock_id" });
          }
        });
        setValidationErrors(skippedRows);

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

        setIsLoading(false);
        setUploadProgress(100);
      };

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
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
      setIsLoading(false);
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

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setData([]);
    setColumns([]);
    setValidationErrors([]);
    setUploadProgress(0);
    setCurrentPage(1);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((row) => {
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase()),
    );
  });

  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState(null);

  const checkAndSubmit = async (skipCheck = false) => {
    if (data.length === 0) {
      notify.error("No Data", "Please upload a file first");
      return;
    }

    const { saveable } = getSaveStats();
    if (saveable === 0) {
      notify.error("No Valid Data", "No rows with stock_id found to save");
      return;
    }

    // Get all stock_ids from data
    const stockIds = data
      .filter(row => row.stock_id && String(row.stock_id).trim() !== "")
      .map(row => row.stock_id);

    // Step 1: Check for duplicates (unless skipped)
    if (!skipCheck && stockIds.length > 0) {
      try {
        const checkResponse = await api.post("/stock/check-duplicates", { stockIds });
        const checkResult = checkResponse.data;
        
        if (checkResult.data && checkResult.data.hasDuplicates) {
          // Show warning
          setDuplicateInfo({
            count: checkResult.data.existingCount,
            ids: checkResult.data.existingIds.slice(0, 10), // Show first 10
            total: checkResult.data.existingIds.length,
          });
          setShowDuplicateWarning(true);
          return; // Stop here, wait for user confirmation
        }
      } catch (error) {
        console.error("Duplicate check failed:", error);
        // Continue with upload even if check fails
      }
    }

    // Step 2: Proceed with upload
    await doUpload();
  };

  const doUpload = async () => {
    setIsLoading(true);
    setShowDuplicateWarning(false);
    
    try {
      const response = await api.post("/stock/bulk", { stock: data });
      const result = response.data;

      if (result.data) {
        setUploadResult(result.data);
        const replaceMsg = result.data.replacedCount 
          ? `, replaced ${result.data.replacedCount} existing` 
          : "";
        notify.success(
          "Success",
          `Saved ${result.data.insertedCount} rows${replaceMsg}, skipped ${result.data.skippedCount} rows`,
        );
        clearFile();
      } else {
        console.error("Backend error:", result);
        notify.error("Submit Error", result.message || "Server error occurred");
      }
    } catch (error) {
      console.error("Submit error:", error);
      notify.error("Network Error", error.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => checkAndSubmit(false);

  const downloadTemplate = () => {
    const headers = [
      "type",
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
      "diamond_image2",
      "diamond_image3",
      "diamond_image4",
      "diamond_image5",
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

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter user stock based on search and filters
  const filteredUserStock = userStock.filter((item) => {
    const matchesSearch = !userStockSearch ||
      (item.stock_id && item.stock_id.toLowerCase().includes(userStockSearch.toLowerCase())) ||
      (item.shape && item.shape.toLowerCase().includes(userStockSearch.toLowerCase())) ||
      (item.certificate_number && item.certificate_number.toLowerCase().includes(userStockSearch.toLowerCase())) ||
      (item.color && item.color.toLowerCase().includes(userStockSearch.toLowerCase())) ||
      (item.clarity && item.clarity.toLowerCase().includes(userStockSearch.toLowerCase()));

    const matchesShape = !filterShape || item.shape === filterShape;
    const matchesColor = !filterColor || item.color === filterColor;
    const matchesClarity = !filterClarity || item.clarity === filterClarity;
    const matchesStatus = !filterStatus || item.status === filterStatus;

    return matchesSearch && matchesShape && matchesColor && matchesClarity && matchesStatus;
  });

  // Get unique values for filters
  const uniqueShapes = [...new Set(userStock.map(s => s.shape).filter(Boolean))];
  const uniqueColors = [...new Set(userStock.map(s => s.color).filter(Boolean))];
  const uniqueClarities = [...new Set(userStock.map(s => s.clarity).filter(Boolean))];
  const uniqueStatuses = [...new Set(userStock.map(s => s.status).filter(Boolean))];

  const clearFilters = () => {
    setFilterShape("");
    setFilterColor("");
    setFilterClarity("");
    setFilterStatus("");
    setUserStockSearch("");
  };

  // All columns from the database
  const ALL_DB_FIELDS = [
    "stock_id", "certificate_number", "weight", "shape", "color",
    "fancy_color", "fancy_color_intensity", "fancy_color_overtone",
    "clarity", "cut", "polish", "symmetry",
    "fluorescence", "fluorescence_color", "fluorescence_intensity",
    "measurements", "length", "width", "height",
    "depth_percentage", "table_percentage",
    "crown_height", "crown_angle", "pavilion_depth", "pavilion_angle",
    "gridle_thin", "gridle_thick", "gridle_condition", "gridle_per",
    "culet_size", "culet_condition",
    "shade", "milky", "eye_clean", "lab", "certificate_comment",
    "city", "state", "country", "treatment",
    "rap_per_carat", "price_per_carat", "final_price", "discount",
    "dollar_rate", "rs_amount",
    "heart_arrow", "star_length", "laser_description", "growth_type",
    "key_to_symbol", "lw_ratio",
    "diamond_type", "type", "status",
    "diamond_image1", "diamond_image2", "diamond_image3", "diamond_image4", "diamond_image5",
    "diamond_video", "certificate_image"
  ];

  // Field groups for the expanded view
  const FIELD_GROUPS = {
    "Stock ID": ["stock_id"],
    "Certificate": ["certificate_number", "lab"],
    "Basic": ["shape", "weight", "color", "fancy_color", "fancy_color_intensity", "fancy_color_overtone"],
    "Grading": ["clarity", "cut", "polish", "symmetry", "fluorescence", "fluorescence_color", "fluorescence_intensity"],
    "Measurements": ["measurements", "length", "width", "height", "depth_percentage", "table_percentage", "lw_ratio"],
    "Proportions": ["crown_height", "crown_angle", "pavilion_depth", "pavilion_angle"],
    "Girdle": ["gridle_thin", "gridle_thick", "gridle_condition", "gridle_per"],
    "Culet": ["culet_size", "culet_condition"],
    "Properties": ["shade", "milky", "eye_clean", "treatment", "heart_arrow", "star_length"],
    "Other": ["growth_type", "key_to_symbol", "laser_description"],
    "Location": ["city", "state", "country"],
    "Pricing": ["rap_per_carat", "price_per_carat", "final_price", "discount", "dollar_rate", "rs_amount"],
    "Media": ["diamond_image1", "diamond_image2", "diamond_image3", "diamond_image4", "diamond_image5", "diamond_video", "certificate_image"],
    "Status": ["diamond_type", "type", "status"],
    "Comments": ["certificate_comment"]
  };

  // Helper to get value or "-"
  const getValue = (item, field) => {
    if (item[field] === null || item[field] === undefined || item[field] === "") return "-";
    return item[field];
  };

  // Simple Table Row - All fields in one horizontal row
  const SimpleTableRow = ({ item, index, page }) => {
    // Calculate continuous row number: (page - 1) * 50 + index + 1
    const rowNumber = (page - 1) * 50 + index + 1;

    return (
      <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'} hover:bg-[#EFF6FF] transition-colors text-sm border-b border-[#E2E8F0]`}>
        {/* Row Number - Continuous across pages */}
        <td className="px-2 py-3 text-center text-xs text-[#64748B] border-r border-[#E2E8F0] sticky left-0 bg-inherit z-10 w-10 font-medium">
          {rowNumber}
        </td>

        {/* All Database Fields */}
        {ALL_DB_FIELDS.map((field) => {
          const value = getValue(item, field);
          const isEmpty = value === "-";

          return (
            <td
              key={field}
              className={`px-3 py-3 border-r border-[#E2E8F0] whitespace-nowrap ${
                isEmpty ? 'text-[#94A3B8]' : 'text-[#374151]'
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
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  item.status === "AVAILABLE" || !item.status ? "bg-green-100 text-green-700 border border-green-200" :
                  item.status === "SOLD" ? "bg-red-100 text-red-700 border border-red-200" :
                  "bg-amber-100 text-amber-700 border border-amber-200"
                }`}>
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
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
 
      {/* Main Action Bar - Left: Filter, Right: Add/Show Stock + Import Features */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Filter Toggle Button */}
            {/* <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showFilters
                  ? "bg-[#1E3A8A] text-white shadow-md"
                  : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] border border-[#E2E8F0]"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {(filterShape || filterColor || filterClarity || filterStatus) && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {[filterShape, filterColor, filterClarity, filterStatus].filter(Boolean).length}
                </span>
              )}
            </button> */}

            {/* Right: View Mode Toggle - 3 Options */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl">
              <button
                onClick={() => setViewMode("show")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "show"
                    ? "bg-[#1E3A8A] text-white shadow-md"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Table className="w-4 h-4" />
                Show Stock
              </button>
              <button
                onClick={() => setViewMode("import")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "import"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Upload className="w-4 h-4" />
                Imports
              </button>
              <button
                onClick={() => setViewMode("manual")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "manual"
                    ? "bg-[#fab34f] text-white shadow-md"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Plus className="w-4 h-4" />
                Manual Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden"
          >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-[#64748B] mb-1">Shape</label>
                  <select
                    value={filterShape}
                    onChange={(e) => setFilterShape(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="">All Shapes</option>
                    {uniqueShapes.map(shape => (
                      <option key={shape} value={shape}>{shape}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-[#64748B] mb-1">Color</label>
                  <select
                    value={filterColor}
                    onChange={(e) => setFilterColor(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="">All Colors</option>
                    {uniqueColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-[#64748B] mb-1">Clarity</label>
                  <select
                    value={filterClarity}
                    onChange={(e) => setFilterClarity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="">All Clarities</option>
                    {uniqueClarities.map(clarity => (
                      <option key={clarity} value={clarity}>{clarity}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-[#64748B] mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="">All Status</option>
                    {uniqueStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area - 3 View Modes */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: Show Stock - Only Table */}
        {viewMode === "show" && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search stock..."
                  value={userStockSearch}
                  onChange={(e) => setUserStockSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? "bg-[#1E3A8A] text-white" : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* User Stock List - Full Width Table */}
            {userStockLoading ? (
              <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-[#E2E8F0]">
                <div className="w-8 h-8 border-4 border-[#E2E8F0] border-t-[#1E3A8A] rounded-full animate-spin" />
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
                      Showing <span className="font-semibold text-[#0F172A]">{filteredUserStock.length}</span> items
                      (Page <span className="font-semibold text-[#0F172A]">{userStockPage}</span> of <span className="font-semibold text-[#0F172A]">{userStockTotalPages}</span>)
                    </span>
                  </div>
                </div>

                {/* Full Width Table */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-x-auto max-h-[70vh]">
                  <table className="w-full text-sm border-collapse">
                    <thead className="sticky top-0 z-30">
                      <tr className="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
                        <th className="px-2 py-3 text-center font-semibold border-r border-slate-500/30 sticky left-0 bg-gradient-to-r from-slate-700 to-slate-700 z-40 w-10">#</th>
                        {ALL_DB_FIELDS.map((field) => (
                          <th
                            key={field}
                            className="px-3 py-3 text-left font-semibold border-r border-slate-500/30 whitespace-nowrap bg-gradient-to-r from-slate-700 to-slate-600"
                          >
                            {field.replace(/_/g, ' ').toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="overflow-y-auto">
                      {filteredUserStock.map((item, index) => (
                        <SimpleTableRow key={item.id} item={item} index={index} page={userStockPage} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {userStockTotalPages > 1 && (
                  <div className="px-4 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                    <p className="text-sm text-[#64748B]">
                      Showing page <span className="font-semibold text-[#0F172A]">{userStockPage}</span> of <span className="font-semibold text-[#0F172A]">{userStockTotalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setUserStockPage(p => Math.max(1, p - 1))}
                        disabled={userStockPage === 1}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      <button
                        onClick={() => setUserStockPage(p => Math.min(userStockTotalPages, p + 1))}
                        disabled={userStockPage === userStockTotalPages}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
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
                  <h3 className="font-semibold text-[#0F172A] mb-1">Excel / CSV</h3>
                  <p className="text-sm text-[#64748B]">Upload .xlsx, .xls, or .csv files</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>

              {/* API Import */}
              <div
                onClick={() => notify.info("Coming Soon", "API import will be available soon!")}
                className="bg-white rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 p-6 cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                    <Database className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-1">API Import</h3>
                  <p className="text-sm text-[#64748B]">Connect external data source</p>
                </div>
              </div>

              {/* Download Template */}
              <div
                onClick={() => notify.info("Coming Soon", "Template download will be available soon!")}
                className="bg-white rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-500 p-6 cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
                    <Download className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-1">Template</h3>
                  <p className="text-sm text-[#64748B]">Download sample CSV format</p>
                </div>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-[#E2E8F0] bg-white hover:border-emerald-300"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                <Upload className={`w-8 h-8 ${isDragging ? "text-emerald-500" : "text-[#94A3B8]"}`} />
              </div>
              <p className="text-lg font-medium text-[#0F172A] mb-2">
                Drop your file here, or <span className="text-emerald-600 cursor-pointer" onClick={() => fileInputRef.current?.click()}>browse</span>
              </p>
              <p className="text-sm text-[#64748B]">Supports CSV, XLSX, XLS files up to 10MB</p>
            </div>

            {/* File Preview & Data Table */}
            {data.length > 0 && (
              <div className="space-y-4">
                {/* File Info Bar */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                    <div>
                      <p className="font-medium text-[#0F172A]">{file?.name}</p>
                      <p className="text-sm text-[#64748B]">{data.length} rows ready to import</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearFile}
                      className="px-4 py-2 text-[#64748B] hover:text-red-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => checkAndSubmit(false)}
                      disabled={isLoading}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all disabled:opacity-50"
                    >
                      {isLoading ? "Checking..." : "Check & Upload"}
                    </button>
                  </div>
                </div>

                {/* Data Preview Table */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-x-auto max-h-[60vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 z-20 bg-slate-700 text-white">
                      <tr>
                        {columns.map((col) => (
                          <th key={col} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]">
                          {columns.map((col) => (
                            <td key={col} className="px-3 py-2 whitespace-nowrap">
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
        {viewMode === "manual" && <AddStockManual />}
      </div>

      {/* Duplicate Warning Modal */}
      {showDuplicateWarning && duplicateInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Duplicate Stock IDs Found</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              {duplicateInfo.count} stock ID{duplicateInfo.count > 1 ? 's' : ''} already exist{duplicateInfo.count === 1 ? 's' : ''} in the database.
              Uploading will <strong>replace</strong> the existing data with new data.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
              <p className="text-xs text-gray-500 mb-2">Existing IDs:</p>
              <div className="flex flex-wrap gap-1">
                {duplicateInfo.ids.map((id, i) => (
                  <span key={i} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                    {id}
                  </span>
                ))}
                {duplicateInfo.total > 10 && (
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                    +{duplicateInfo.total - 10} more
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDuplicateWarning(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => doUpload()}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Replace & Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStock;
