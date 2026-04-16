import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import * as XLSX from "xlsx";
import { parse as parseCSV } from "papaparse";
import notify from "../../utils/notifications";
import api from "../../services/api";

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
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [validationErrors, setValidationErrors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(100);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

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

    setIsLoading(true);
    try {
   
      
      // Check if any row has length as "0" or 0
      const zeroLengthRows = data.filter(r => r.length === "0" || r.length === 0).length;
      const validLengthRows = data.filter(r => r.length && r.length !== "0" && r.length !== 0).length;
      console.log(`Summary: ${zeroLengthRows} rows have length=0, ${validLengthRows} rows have valid length`);

      const response = await api.post("/stock/bulk", { stock: data });
      const result = response.data;

      if (result.data) {
        setUploadResult(result.data);
        notify.success(
          "Success",
          `Saved ${result.data.insertedCount} rows, skipped ${result.data.skippedCount} rows (missing stock_id)`,
        );
        clearFile();
      } else {
        console.error("Backend error:", result);
        notify.error(
          "Submit Error",
          result.message || "Server error occurred",
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      notify.error(
        "Network Error",
        error.message || "Failed to connect to server",
      );
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0F172A]">Add Stock</h1>
                <p className="text-[#64748B]">
                  Bulk import diamonds via CSV or Excel
                </p>
              </div>
            </div>

            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 text-[#1E3A8A] bg-[#EFF6FF] rounded-lg hover:bg-[#DBEAFE] transition-colors"
            >
              <Download className="w-4 h-4" />
              Template
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left/Main Area - Data Display */}
          <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            {/* Data Preview Section */}
            {data.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
              >
                {/* Table Header with View Toggle */}
                <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Table className="w-5 h-5 text-[#1E3A8A]" />
                    <h3 className="font-semibold text-[#0F172A]">
                      Preview Data
                    </h3>
                    <span className="px-2 py-1 bg-[#F1F5F9] text-[#64748B] rounded-full text-xs">
                      {filteredData.length} of {data.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex bg-[#F1F5F9] rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                          viewMode === "grid"
                            ? "bg-white text-[#1E3A8A] shadow-sm"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                        Grid
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                          viewMode === "list"
                            ? "bg-white text-[#1E3A8A] shadow-sm"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        <List className="w-4 h-4" />
                        List
                      </button>
                    </div>
                    <div className="relative">
                      <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] w-48"
                      />
                    </div>
                  </div>
                </div>

                {/* Data Display - Grid or List View */}
                {viewMode === "grid" ? (
                  // Grid View
                  <div className="overflow-y-auto max-h-[600px] p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {paginatedData.map((row, idx) => {
                        const actualIndex =
                          (currentPage - 1) * rowsPerPage + idx;
                        const willBeSaved = hasStockId(row);
                        return (
                          <div
                            key={actualIndex}
                            className={`bg-[#F8FAFC] rounded-xl border p-4 hover:border-[#3B82F6] transition-colors ${
                              willBeSaved
                                ? "border-[#E2E8F0]"
                                : "border-red-300 bg-red-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-medium text-[#64748B] bg-white px-2 py-1 rounded-full border border-[#E2E8F0]">
                                #{actualIndex + 1}
                              </span>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  willBeSaved
                                    ? "text-green-700 bg-green-100"
                                    : "text-red-700 bg-red-100"
                                }`}
                              >
                                {willBeSaved
                                  ? "Will Save"
                                  : "Skip (no stock_id)"}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {columns.slice(0, 6).map((col) => (
                                <div
                                  key={col}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-[#64748B] capitalize">
                                    {col}:
                                  </span>
                                  <span className="font-medium text-[#0F172A]">
                                    {row[col] || "-"}
                                  </span>
                                </div>
                              ))}
                              {columns.length > 6 && (
                                <div className="text-xs text-[#94A3B8] text-center pt-2 border-t border-[#E2E8F0]">
                                  +{columns.length - 6} more fields
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // List View (Table)
                  <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full">
                      <thead className="bg-[#F8FAFC] sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase tracking-wider">
                            Status
                          </th>
                          {columns.map((col) => (
                            <th
                              key={col}
                              className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase tracking-wider cursor-pointer hover:bg-[#F1F5F9]"
                              onClick={() => handleSort(col)}
                            >
                              <div className="flex items-center gap-1">
                                {col}
                                {sortConfig.key === col && (
                                  <ArrowUpDown className="w-3 h-3" />
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {paginatedData.map((row, idx) => {
                          const actualIndex =
                            (currentPage - 1) * rowsPerPage + idx;
                          const willBeSaved = hasStockId(row);
                          return (
                            <tr
                              key={actualIndex}
                              className={`hover:bg-[#F8FAFC] ${!willBeSaved ? "bg-red-50" : ""}`}
                            >
                              <td className="px-4 py-3 text-sm whitespace-nowrap">
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    willBeSaved
                                      ? "text-green-700 bg-green-100"
                                      : "text-red-700 bg-red-100"
                                  }`}
                                >
                                  {willBeSaved ? "Save" : "Skip"}
                                </span>
                              </td>
                              {columns.map((col) => (
                                <td
                                  key={col}
                                  className="px-4 py-3 text-sm text-[#0F172A] whitespace-nowrap"
                                >
                                  {row[col] || "-"}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <div className="text-sm text-[#64748B]">
                      Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                      {Math.min(currentPage * rowsPerPage, filteredData.length)}{" "}
                      of {filteredData.length} rows
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 rounded-lg text-sm ${
                                currentPage === page
                                  ? "bg-[#1E3A8A] text-white"
                                  : "border border-[#E2E8F0] hover:bg-[#F1F5F9]"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        },
                      )}
                      {totalPages > 5 && (
                        <span className="text-[#64748B]">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Empty State */}
            {data.length === 0 && !file && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                  <Table className="w-8 h-8 text-[#94A3B8]" />
                </div>
                <h3 className="text-lg font-medium text-[#0F172A] mb-2">
                  No Data Imported
                </h3>
                <p className="text-[#64748B]">
                  Select a file or add stock manually to see preview
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar - Upload Controls */}
          <div className="lg:col-span-1 space-y-4 order-1 lg:order-2">
            {/* Upload Area */}
            {!file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  isDragging
                    ? "border-[#3B82F6] bg-[#EFF6FF]"
                    : "border-[#CBD5E1] bg-white hover:border-[#94A3B8]"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3A8A]/10 to-[#3B82F6]/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <p className="text-sm text-[#64748B] mb-4">
                  Drop file or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 bg-[#1E3A8A] text-white rounded-lg font-medium hover:bg-[#1E40AF] transition-colors text-sm"
                  >
                    Select File
                  </button>
                </div>

                {/* Required Fields Info */}
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <p className="text-xs text-[#64748B] mb-2">
                    <span className="font-semibold text-[#1E3A8A]">
                      Required for save:
                    </span>{" "}
                    stock_id
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    All other fields are optional. Rows without stock_id will be
                    skipped.
                  </p>
                </div>
              </motion.div>
            )}

            {/* File Info & Progress */}
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                      {file.name.endsWith(".csv") ? (
                        <FileText className="w-7 h-7 text-green-600" />
                      ) : (
                        <FileSpreadsheet className="w-7 h-7 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0F172A]">
                        {file.name}
                      </h4>
                      <p className="text-sm text-[#64748B]">
                        {(file.size / 1024).toFixed(2)} KB • {data.length}{" "}
                        records
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearFile}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                {uploadProgress < 100 && (
                  <div className="w-full bg-[#F1F5F9] rounded-full h-2 mb-4">
                    <div
                      className="bg-[#3B82F6] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                {/* Save Stats */}
                {data.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-700">
                        Import Summary
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-blue-900">
                        <span className="font-medium">Total rows:</span>{" "}
                        {getSaveStats().total}
                      </p>
                      <p className="text-green-700">
                        <span className="font-medium">Will be saved:</span>{" "}
                        {getSaveStats().saveable} (have stock_id)
                      </p>
                      <p className="text-red-600">
                        <span className="font-medium">Will be skipped:</span>{" "}
                        {getSaveStats().skipped} (missing stock_id)
                      </p>
                    </div>
                  </div>
                )}

                {/* Upload Result */}
                {uploadResult && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-700">
                        Upload Complete
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-green-900">
                        <span className="font-medium">Saved:</span>{" "}
                        {uploadResult.insertedCount} rows
                      </p>
                      <p className="text-orange-600">
                        <span className="font-medium">Skipped:</span>{" "}
                        {uploadResult.skippedCount} rows (no stock_id)
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Submit Button */}
            {data.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || getSaveStats().saveable === 0}
                  className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                    isLoading || getSaveStats().saveable === 0
                      ? "bg-[#94A3B8] text-white cursor-not-allowed"
                      : "bg-[#10B981] text-white hover:bg-[#059669]"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Stock ({getSaveStats().saveable})
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStock;
