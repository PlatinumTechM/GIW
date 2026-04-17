import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Diamond,
  Save,
  X,
  ChevronRight,
  Upload,
  Download,
  Image as ImageIcon,
  FileText,
  Package,
  Ruler,
  Palette,
  Sparkles,
  Building,
  DollarSign,
  Percent,
  MapPin,
  Gem,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Table,
  LayoutGrid,
  List,
  Search,
  Trash2,
  ChevronLeft,
  ChevronDown,
  MoreVertical,
  Database,
  RotateCcw,
} from "lucide-react";
import * as XLSX from "xlsx";
import { parse as parseCSV } from "papaparse";
import notify from "../../utils/notifications";
import api from "../../services/api";

const INITIAL_FORM_DATA = {
  stock_id: "",
  certificate_number: "",
  weight: "",
  shape: "",
  color: "",
  fancy_color: "",
  fancy_color_intensity: "",
  fancy_color_overtone: "",
  clarity: "",
  cut: "",
  polish: "",
  symmetry: "",
  fluorescence: "",
  fluorescence_color: "",
  fluorescence_intensity: "",
  measurements: "",
  length: "",
  width: "",
  height: "",
  shade: "",
  milky: "",
  eye_clean: "",
  lab: "",
  certificate_comment: "",
  city: "",
  state: "",
  country: "",
  treatment: "",
  depth_percentage: "",
  table_percentage: "",
  rap_per_carat: "",
  price_per_carat: "",
  final_price: "",
  dollar_rate: "",
  rs_amount: "",
  discount: "",
  heart_arrow: false,
  star_length: "",
  laser_description: "",
  growth_type: "",
  key_to_symbol: "",
  lw_ratio: "",
  culet_size: "",
  culet_condition: "",
  gridle_thin: "",
  gridle_thick: "",
  gridle_condition: "",
  gridle_per: "",
  crown_height: "",
  crown_angle: "",
  pavilion_depth: "",
  pavilion_angle: "",
  status: "",
  diamond_type: "",
  diamond_image1: "",
  diamond_image2: "",
  diamond_image3: "",
  diamond_image4: "",
  diamond_image5: "",
  diamond_video: "",
  certificate_image: "",
};

const SHAPE_OPTIONS = [
  "Round",
  "Princess",
  "Emerald",
  "Asscher",
  "Marquise",
  "Oval",
  "Radiant",
  "Pear",
  "Heart",
  "Cushion",
  "Baguette",
  "Trilliant",
  "Triangle",
];

const COLOR_OPTIONS = [
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const CLARITY_OPTIONS = [
  "FL",
  "IF",
  "VVS1",
  "VVS2",
  "VS1",
  "VS2",
  "SI1",
  "SI2",
  "SI3",
  "I1",
  "I2",
  "I3",
];

const CUT_OPTIONS = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

const POLISH_OPTIONS = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

const SYMMETRY_OPTIONS = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

const FLUORESCENCE_OPTIONS = [
  "None",
  "Faint",
  "Medium",
  "Strong",
  "Very Strong",
];

const LAB_OPTIONS = [
  "GIA",
  "IGI",
  "HRD",
  "AGS",
  "EGL",
  "CGL",
  "P.G.I",
  "IIGJ",
  "DCLA",
];

const TREATMENT_OPTIONS = [
  "None",
  "Laser Drilled",
  "HPHT",
  "Irradiated",
  "Color Enhanced",
  "Clarity Enhanced",
  "Fracture Filled",
];

const DIAMOND_TYPE_OPTIONS = ["Natural", "Lab Grown", "Simulant"];

const FANCY_COLOR_OPTIONS = [
  "Yellow",
  "Pink",
  "Blue",
  "Green",
  "Orange",
  "Red",
  "Purple",
  "Violet",
  "Brown",
  "Gray",
  "Black",
  "Chameleon",
];

const FANCY_INTENSITY_OPTIONS = [
  "Faint",
  "Very Light",
  "Light",
  "Fancy Light",
  "Fancy",
  "Fancy Dark",
  "Fancy Intense",
  "Fancy Vivid",
  "Fancy Deep",
];

const FANCY_OVERTONE_OPTIONS = [
  "None",
  "Yellowish",
  "Orangey",
  "Brownish",
  "Greenish",
  "Purplish",
  "Grayish",
  "Pinkish",
];

const STATUS_OPTIONS = ["Available", "Sold", "Reserved", "On Hold", "In Transit"];

const GROWTH_TYPE_OPTIONS = [
  "CVD",
  "HPHT",
  "Natural",
];

const EYE_CLEAN_OPTIONS = ["Yes", "No", "VVS"];

const MILKY_OPTIONS = ["None", "Milky", "Slightly Milky", "Heavy Milky"];

// Field mappings for Excel import - matches backend logic
const FIELD_MAPPINGS = {
  type: ["type", "diamond type", "stone type"],
  stock_id: ["stock id", "stockid", "stock_id", "stock no", "stockno", "stock #", "packet no", "packetno", "stoneno", "stone no", "stone #", "stone id", "pkt no", "pkt #", "ref no", "ref #", "reference"],
  certificate_number: ["certificate number", "cert no", "cert_no", "certificate_no", "cert #", "cert.", "report no", "report #", "lab no", "lab #", "report", "certificate", "cert", "inscription", "insc"],
  weight: ["weight", "carat", "carat weight", "ct", "cts", "carats", "crt"],
  shape: ["shape", "shp", "diamond shape", "cut shape"],
  color: ["color", "colour", "col", "colors", "clr"],
  fancy_color: ["fancy color", "fancycolor", "fncy color", "fncy clr", "fan color", "f color"],
  fancy_color_intensity: ["fancy color intensity", "intensity", "fancy intensity", "clr intensity", "color intensity"],
  fancy_color_overtone: ["fancy color overtone", "overtone", "fancy overtone", "color overtone"],
  clarity: ["clarity", "clar", "clr", "clarities", "purity"],
  cut: ["cut", "cut grade", "cut quality", "cutting"],
  polish: ["polish", "pol", "polish grade", "polishing"],
  symmetry: ["symmetry", "sym", "symm", "symmetry grade", "sym grade"],
  fluorescence: ["fluorescence", "fluor", "flr", "fl", "fluorescence grade"],
  fluorescence_color: ["fluorescence color", "fl color", "fl. color", "fluor color"],
  fluorescence_intensity: ["fluorescence intensity", "fl intensity", "fl. intensity", "fluor intensity"],
  measurements: ["measurements", "meas", "dimension", "dimensions"],
  length: ["length", "l", "mm length", "len"],
  width: ["width", "w", "mm width", "wid"],
  height: ["height", "h", "mm height", "depth", "ht", "dep"],
  depth_percentage: ["depth %", "depth percentage", "depth", "dep", "depth pct", "depth%"],
  table_percentage: ["table %", "table percentage", "table", "tbl", "table pct", "table%"],
  rap_per_carat: ["rap per carat", "rap", "rap rate", "rap p/c", "rap/ct"],
  price_per_carat: ["price per carat", "ppc", "per carat price", "rate per carat", "rate p/c", "$/ct", "price/carat"],
  final_price: ["final price", "total price", "amount", "total", "value", "price", "cost", "net price"],
  dollar_rate: ["dollar rate", "rate", "usd rate", "exchange rate", "$ rate", "usd"],
  rs_amount: ["rs amount", "inr amount", "rupee amount", "local amount", "inr"],
  discount: ["discount", "disc", "off", "disc %", "discount %"],
  shade: ["shade", "shd"],
  milky: ["milky", "milkiness", "milk"],
  eye_clean: ["eye clean", "eyeclean", "eye", "ec", "e/c"],
  lab: ["lab", "laboratory", "certificate lab", "lab name"],
  certificate_comment: ["certificate comment", "cert comment", "comment", "comments", "remarks"],
  city: ["city", "town"],
  state: ["state", "province"],
  country: ["country", "cntry", "nation"],
  treatment: ["treatment", "treated", "treat", "trt"],
  heart_arrow: ["heart arrow", "hearts arrow", "h&a"],
  star_length: ["star length"],
  laser_description: ["laser description", "laser inscription", "inscription"],
  growth_type: ["growth type", "growth"],
  key_to_symbol: ["key to symbol", "key to symbols", "symbols"],
  lw_ratio: ["lw ratio", "l/w ratio", "length width ratio", "ratio"],
  culet_size: ["culet size", "culet"],
  culet_condition: ["culet condition", "culet cond"],
  gridle_thin: ["gridle thin", "girdle thin", "girdle min"],
  gridle_thick: ["gridle thick", "girdle thick", "girdle max"],
  gridle_condition: ["gridle condition", "girdle condition", "girdle cond", "gridle cond"],
  gridle_per: ["gridle per", "girdle %", "girdle per"],
  crown_height: ["crown height"],
  crown_angle: ["crown angle"],
  pavilion_depth: ["pavilion depth"],
  pavilion_angle: ["pavilion angle"],
  status: ["status", "availability", "available"],
  diamond_type: ["diamond type", "stone type", "stone"],
  diamond_image1: ["image 1", "image1", "photo 1", "pic 1"],
  diamond_image2: ["image 2", "image2", "photo 2", "pic 2"],
  diamond_image3: ["image 3", "image3", "photo 3", "pic 3"],
  diamond_image4: ["image 4", "image4", "photo 4", "pic 4"],
  diamond_image5: ["image 5", "image5", "photo 5", "pic 5"],
  diamond_video: ["video", "diamond video", "video link"],
  certificate_image: ["certificate image", "cert image", "certificate scan"],
};

const CULET_SIZE_OPTIONS = ["None", "Very Small", "Small", "Medium", "Large", "Very Large"];

const CULET_CONDITION_OPTIONS = ["Pointed", "Chipped", "Abraded"];

// Memoized SectionCard to prevent re-animation on every state change
const SectionCard = React.memo(({ title, icon: Icon, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden ${className}`}
  >
    <div className="px-6 py-4 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFC] to-white">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-[#1E3A8A]" />}
        <h3 className="font-semibold text-[#0F172A]">{title}</h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
));

// InputField component defined outside to prevent re-creation on renders
const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  options = null,
  helperText = null,
  min,
  max,
  step,
  uppercase = true,
}) => {
  const handleChange = (e) => {
    if (uppercase && type === "text") {
      e.target.value = e.target.value.toUpperCase();
    }
    onChange(e);
  };

  return (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-[#0F172A] flex items-center gap-1.5">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] z-10">
          <Icon className="w-4 h-4" />
        </div>
      )}
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? "pl-10" : "px-4"} pr-4 py-2.5 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#DBEAFE] transition-all appearance-none cursor-pointer`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            backgroundSize: "16px",
          }}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={3}
          className={`w-full px-4 py-2.5 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#DBEAFE] transition-all resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`w-full ${Icon ? "pl-10" : "px-4"} pr-4 py-2.5 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#DBEAFE] transition-all`}
        />
      )}
    </div>
    {helperText && (
      <p className="text-xs text-[#64748B]">{helperText}</p>
    )}
  </div>
  );
};

const AddStockManual = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState({
    diamond_image1: null,
    diamond_image2: null,
    diamond_image3: null,
    diamond_image4: null,
    diamond_image5: null,
    diamond_video: null,
    certificate_image: null,
  });

  // Excel Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importData, setImportData] = useState([]);
  const [importColumns, setImportColumns] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importPreviewMode, setImportPreviewMode] = useState("grid");
  const [importSearchTerm, setImportSearchTerm] = useState("");
  const [importCurrentPage, setImportCurrentPage] = useState(1);
  const [importRowsPerPage] = useState(50);
  const [importSortConfig, setImportSortConfig] = useState({ key: null, direction: "asc" });
  const [importResult, setImportResult] = useState(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => ({
          ...prev,
          [fieldName]: reader.result,
        }));
        setFormData((prev) => ({
          ...prev,
          [fieldName]: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/stock", formData);

      notify.success("Success", "Stock item added successfully!");
      setFormData(INITIAL_FORM_DATA);
      setImagePreview({
        diamond_image1: null,
        diamond_image2: null,
        diamond_image3: null,
        diamond_image4: null,
        diamond_image5: null,
        diamond_video: null,
        certificate_image: null,
      });
    } catch (error) {
      console.error("Submit error:", error);
      notify.error("Error", error.response?.data?.message || "Failed to add stock");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setImagePreview({
      diamond_image1: null,
      diamond_image2: null,
      diamond_image3: null,
      diamond_image4: null,
      diamond_image5: null,
      diamond_video: null,
      certificate_image: null,
    });
    notify.info("Reset", "Form has been cleared");
  };

  // Excel Import Helper Functions
  const normalizeColumnName = (name) => {
    if (!name) return "";
    return name.toString().toLowerCase().trim().replace(/\s+/g, " ");
  };

  const findMatchingField = (columnName) => {
    const normalized = normalizeColumnName(columnName);
    for (const [field, possibleNames] of Object.entries(FIELD_MAPPINGS)) {
      if (possibleNames.some((name) => normalized.includes(name.toLowerCase()))) {
        return field;
      }
    }
    return columnName.toLowerCase().replace(/\s+/g, "_");
  };

  const mapRowToDb = (row) => {
    const mapped = {};
    Object.entries(row).forEach(([key, value]) => {
      const field = findMatchingField(key);
      mapped[field] = value;
    });
    return mapped;
  };

  const hasStockId = (row) => {
    return row.stock_id && row.stock_id.toString().trim() !== "";
  };

  const getSaveStats = () => {
    const total = importData.length;
    const saveable = importData.filter(hasStockId).length;
    const skipped = total - saveable;
    return { total, saveable, skipped };
  };

  const parseExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const parseCSVFile = async (file) => {
    return new Promise((resolve, reject) => {
      parseCSV(file, {
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
        header: true,
        skipEmptyLines: true,
      });
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file) => {
    setImportLoading(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      let parsedData;
      if (file.name.endsWith(".csv")) {
        parsedData = await parseCSVFile(file);
      } else {
        const rawData = await parseExcelFile(file);
        if (rawData.length > 0) {
          const headers = rawData[0];
          parsedData = rawData.slice(1).map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
        } else {
          parsedData = [];
        }
      }

      setImportProgress(50);

      const mappedData = parsedData.map(mapRowToDb);
      const validData = mappedData.filter((row) => Object.keys(row).length > 0);

      if (validData.length > 0) {
        setImportColumns(Object.keys(validData[0]));
      }

      setImportData(validData);
      setImportFile(file);
      setImportProgress(100);
      notify.success("File Loaded", `Loaded ${validData.length} rows from ${file.name}`);
    } catch (error) {
      console.error("File parsing error:", error);
      notify.error("Error", "Failed to parse file. Please check the format.");
    } finally {
      setImportLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      await processFile(file);
    } else {
      notify.error("Invalid File", "Please upload a CSV or Excel file.");
    }
  };

  const clearImportFile = () => {
    setImportFile(null);
    setImportData([]);
    setImportColumns([]);
    setImportResult(null);
    setImportCurrentPage(1);
    setImportSearchTerm("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const checkDuplicates = async () => {
    const stockIds = importData
      .filter(hasStockId)
      .map((row) => row.stock_id)
      .filter((id) => id);

    if (stockIds.length === 0) return;

    try {
      const response = await api.post("/stock/check-duplicates", { stockIds });
      if (response.data.success && response.data.data.existing.length > 0) {
        setDuplicateInfo(response.data.data);
        setShowDuplicateWarning(true);
      } else {
        await handleImportSubmit();
      }
    } catch (error) {
      console.error("Error checking duplicates:", error);
      await handleImportSubmit();
    }
  };

  const handleImportSubmit = async () => {
    const { saveable } = getSaveStats();
    if (saveable === 0) {
      notify.error("No Valid Data", "No rows with stock_id found to import.");
      return;
    }

    setImportLoading(true);
    try {
      const validRows = importData.filter(hasStockId);
      const response = await api.post("/stock/bulk", validRows);

      if (response.data.success) {
        setImportResult(response.data.data);
        notify.success(
          "Import Complete",
          `Saved: ${response.data.data.insertedCount}, Skipped: ${response.data.data.skippedCount}`
        );
        setTimeout(() => {
          clearImportFile();
          setShowImportModal(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Import error:", error);
      notify.error("Import Failed", error.response?.data?.message || "Failed to import stock");
    } finally {
      setImportLoading(false);
    }
  };

  const handleImportSort = (key) => {
    setImportSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleImportPageChange = (page) => {
    setImportCurrentPage(page);
  };

  const filteredImportData = importData.filter((row) => {
    if (!importSearchTerm) return true;
    const search = importSearchTerm.toLowerCase();
    return Object.values(row).some((val) =>
      val?.toString().toLowerCase().includes(search)
    );
  });

  const sortedImportData = [...filteredImportData].sort((a, b) => {
    if (!importSortConfig.key) return 0;
    const aVal = a[importSortConfig.key] || "";
    const bVal = b[importSortConfig.key] || "";
    if (importSortConfig.direction === "asc") {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const importTotalPages = Math.ceil(sortedImportData.length / importRowsPerPage);
  const paginatedImportData = sortedImportData.slice(
    (importCurrentPage - 1) * importRowsPerPage,
    importCurrentPage * importRowsPerPage
  );

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "grading", label: "Grading", icon: Gem },
    { id: "measurements", label: "Measurements", icon: Ruler },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "advanced", label: "Advanced", icon: Sparkles },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "certificate", label: "Certificate", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Title */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
                <Diamond className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0F172A]">Add Stock</h1>
                <p className="text-sm text-[#64748B]">Manual stock entry form</p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-[#64748B] hover:text-[#0F172A] hover:bg-white rounded-lg transition-all border border-[#E2E8F0]"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Stock
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20"
                    : "bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {activeTab === "basic" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stock Information */}
                <SectionCard title="Stock Information" icon={Package}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Stock ID"
                      name="stock_id"
                      value={formData.stock_id}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter unique stock ID"
                    />
                    <InputField
                      label="Diamond Type"
                      name="diamond_type"
                      value={formData.diamond_type}
                      onChange={handleInputChange}
                      options={DIAMOND_TYPE_OPTIONS}
                    />
                    <InputField
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      options={STATUS_OPTIONS}
                    />
                    <InputField
                      label="Growth Type"
                      name="growth_type"
                      value={formData.growth_type}
                      onChange={handleInputChange}
                      options={GROWTH_TYPE_OPTIONS}
                    />
                  </div>
                </SectionCard>

                {/* Location */}
                <SectionCard title="Location" icon={MapPin}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                    />
                    <InputField
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                    />
                    <InputField
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Enter country"
                      className="sm:col-span-2"
                    />
                  </div>
                </SectionCard>
              </div>
            </motion.div>
          )}

          {activeTab === "grading" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 4C Grading */}
                <SectionCard title="4C Grading" icon={Gem}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Shape"
                      name="shape"
                      value={formData.shape}
                      onChange={handleInputChange}
                      options={SHAPE_OPTIONS}
                      required
                    />
                    <InputField
                      label="Weight (Carat)"
                      name="weight"
                      type="number"
                      step="0.001"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="0.000"
                      required
                    />
                    <InputField
                      label="Color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      options={COLOR_OPTIONS}
                    />
                    <InputField
                      label="Clarity"
                      name="clarity"
                      value={formData.clarity}
                      onChange={handleInputChange}
                      options={CLARITY_OPTIONS}
                    />
                    <InputField
                      label="Cut"
                      name="cut"
                      value={formData.cut}
                      onChange={handleInputChange}
                      options={CUT_OPTIONS}
                    />
                    <InputField
                      label="Polish"
                      name="polish"
                      value={formData.polish}
                      onChange={handleInputChange}
                      options={POLISH_OPTIONS}
                    />
                    <InputField
                      label="Symmetry"
                      name="symmetry"
                      value={formData.symmetry}
                      onChange={handleInputChange}
                      options={SYMMETRY_OPTIONS}
                    />
                    <InputField
                      label="Fluorescence"
                      name="fluorescence"
                      value={formData.fluorescence}
                      onChange={handleInputChange}
                      options={FLUORESCENCE_OPTIONS}
                    />
                  </div>
                </SectionCard>

                {/* Fancy Color */}
                <SectionCard title="Fancy Color Details" icon={Palette}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Fancy Color"
                      name="fancy_color"
                      value={formData.fancy_color}
                      onChange={handleInputChange}
                      options={FANCY_COLOR_OPTIONS}
                    />
                    <InputField
                      label="Fancy Color Intensity"
                      name="fancy_color_intensity"
                      value={formData.fancy_color_intensity}
                      onChange={handleInputChange}
                      options={FANCY_INTENSITY_OPTIONS}
                    />
                    <InputField
                      label="Fancy Color Overtone"
                      name="fancy_color_overtone"
                      value={formData.fancy_color_overtone}
                      onChange={handleInputChange}
                      options={FANCY_OVERTONE_OPTIONS}
                    />
                    <InputField
                      label="Fluorescence Color"
                      name="fluorescence_color"
                      value={formData.fluorescence_color}
                      onChange={handleInputChange}
                      placeholder="e.g. Blue, Yellow"
                    />
                    <InputField
                      label="Fluorescence Intensity"
                      name="fluorescence_intensity"
                      value={formData.fluorescence_intensity}
                      onChange={handleInputChange}
                      placeholder="Enter intensity"
                    />
                  </div>
                </SectionCard>

                {/* Visual Characteristics */}
                <SectionCard title="Visual Characteristics" icon={Sparkles}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Shade"
                      name="shade"
                      value={formData.shade}
                      onChange={handleInputChange}
                      placeholder="Enter shade"
                    />
                    <InputField
                      label="Milky"
                      name="milky"
                      value={formData.milky}
                      onChange={handleInputChange}
                      options={MILKY_OPTIONS}
                    />
                    <InputField
                      label="Eye Clean"
                      name="eye_clean"
                      value={formData.eye_clean}
                      onChange={handleInputChange}
                      options={EYE_CLEAN_OPTIONS}
                    />
                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl">
                      <input
                        type="checkbox"
                        name="heart_arrow"
                        checked={formData.heart_arrow}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-2 border-[#E2E8F0] text-[#1E3A8A] focus:ring-[#3B82F6] cursor-pointer"
                      />
                      <label className="text-sm font-medium text-[#0F172A] cursor-pointer">
                        Heart & Arrow Pattern
                      </label>
                    </div>
                  </div>
                </SectionCard>

                {/* Treatment */}
                <SectionCard title="Treatment Information" icon={Sparkles}>
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="Treatment"
                      name="treatment"
                      value={formData.treatment}
                      onChange={handleInputChange}
                      options={TREATMENT_OPTIONS}
                    />
                    <InputField
                      label="Key to Symbol"
                      name="key_to_symbol"
                      value={formData.key_to_symbol}
                      onChange={handleInputChange}
                      type="textarea"
                      placeholder="Enter key to symbol details"
                    />
                    <InputField
                      label="Laser Description"
                      name="laser_description"
                      value={formData.laser_description}
                      onChange={handleInputChange}
                      type="textarea"
                      placeholder="Enter laser inscription details"
                    />
                  </div>
                </SectionCard>
              </div>
            </motion.div>
          )}

          {activeTab === "measurements" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Measurements */}
                <SectionCard title="Basic Measurements" icon={Ruler}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Measurements"
                      name="measurements"
                      value={formData.measurements}
                      onChange={handleInputChange}
                      placeholder="e.g. 6.5 - 6.7 x 4.2"
                      helperText="Format: Length - Width x Depth"
                    />
                    <InputField
                      label="Length (mm)"
                      name="length"
                      type="number"
                      step="0.001"
                      value={formData.length}
                      onChange={handleInputChange}
                      placeholder="0.000"
                    />
                    <InputField
                      label="Width (mm)"
                      name="width"
                      type="number"
                      step="0.001"
                      value={formData.width}
                      onChange={handleInputChange}
                      placeholder="0.000"
                    />
                    <InputField
                      label="Height (mm)"
                      name="height"
                      type="number"
                      step="0.001"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="0.000"
                    />
                    <InputField
                      label="L/W Ratio"
                      name="lw_ratio"
                      value={formData.lw_ratio}
                      onChange={handleInputChange}
                      placeholder="e.g. 1.00:1"
                    />
                  </div>
                </SectionCard>

                {/* Proportions */}
                <SectionCard title="Proportions" icon={Percent}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Depth %"
                      name="depth_percentage"
                      type="number"
                      step="0.001"
                      value={formData.depth_percentage}
                      onChange={handleInputChange}
                      placeholder="0.000"
                    />
                    <InputField
                      label="Table %"
                      name="table_percentage"
                      type="number"
                      step="0.001"
                      value={formData.table_percentage}
                      onChange={handleInputChange}
                      placeholder="0.000"
                    />
                    <InputField
                      label="Star Length %"
                      name="star_length"
                      value={formData.star_length}
                      onChange={handleInputChange}
                      placeholder="Enter star length %"
                    />
                  </div>
                </SectionCard>

                {/* Girdle */}
                <SectionCard title="Girdle Details" icon={Ruler}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Girdle Thin"
                      name="gridle_thin"
                      value={formData.gridle_thin}
                      onChange={handleInputChange}
                      placeholder="e.g. Thin"
                    />
                    <InputField
                      label="Girdle Thick"
                      name="gridle_thick"
                      value={formData.gridle_thick}
                      onChange={handleInputChange}
                      placeholder="e.g. Slightly Thick"
                    />
                    <InputField
                      label="Girdle Condition"
                      name="gridle_condition"
                      value={formData.gridle_condition}
                      onChange={handleInputChange}
                      placeholder="e.g. Faceted"
                    />
                    <InputField
                      label="Girdle %"
                      name="gridle_per"
                      value={formData.gridle_per}
                      onChange={handleInputChange}
                      placeholder="Enter girdle percentage"
                    />
                  </div>
                </SectionCard>

                {/* Culet */}
                <SectionCard title="Culet Details" icon={Diamond}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Culet Size"
                      name="culet_size"
                      value={formData.culet_size}
                      onChange={handleInputChange}
                      options={CULET_SIZE_OPTIONS}
                    />
                    <InputField
                      label="Culet Condition"
                      name="culet_condition"
                      value={formData.culet_condition}
                      onChange={handleInputChange}
                      options={CULET_CONDITION_OPTIONS}
                    />
                  </div>
                </SectionCard>

                {/* Crown & Pavilion */}
                <SectionCard title="Crown & Pavilion" icon={Building} className="lg:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InputField
                      label="Crown Height"
                      name="crown_height"
                      value={formData.crown_height}
                      onChange={handleInputChange}
                      placeholder="Enter crown height"
                    />
                    <InputField
                      label="Crown Angle"
                      name="crown_angle"
                      type="number"
                      step="0.1"
                      value={formData.crown_angle}
                      onChange={handleInputChange}
                      placeholder="0.0"
                    />
                    <InputField
                      label="Pavilion Depth"
                      name="pavilion_depth"
                      value={formData.pavilion_depth}
                      onChange={handleInputChange}
                      placeholder="Enter pavilion depth"
                    />
                    <InputField
                      label="Pavilion Angle"
                      name="pavilion_angle"
                      type="number"
                      step="0.1"
                      value={formData.pavilion_angle}
                      onChange={handleInputChange}
                      placeholder="0.0"
                    />
                  </div>
                </SectionCard>
              </div>
            </motion.div>
          )}

          {activeTab === "pricing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <SectionCard title="Pricing Details" icon={DollarSign} className="max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    label="RAP Price/Carat"
                    name="rap_per_carat"
                    type="number"
                    step="0.01"
                    value={formData.rap_per_carat}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    icon={DollarSign}
                  />
                  <InputField
                    label="Discount %"
                    name="discount"
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    icon={Percent}
                  />
                  <InputField
                    label="Price/Carat"
                    name="price_per_carat"
                    type="number"
                    step="0.01"
                    value={formData.price_per_carat}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    icon={DollarSign}
                  />
                  <InputField
                    label="Final Price"
                    name="final_price"
                    type="number"
                    step="0.01"
                    value={formData.final_price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    icon={DollarSign}
                  />
                  <InputField
                    label="Dollar Rate"
                    name="dollar_rate"
                    type="number"
                    step="0.01"
                    value={formData.dollar_rate}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                  <InputField
                    label="RS Amount"
                    name="rs_amount"
                    type="number"
                    step="0.01"
                    value={formData.rs_amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>

                {/* Price Summary */}
                <div className="mt-6 p-4 bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] rounded-xl border border-[#3B82F6]/20">
                  <h4 className="font-semibold text-[#1E3A8A] mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Price Summary
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-[#64748B]">Weight:</span>
                      <span className="ml-2 font-medium text-[#0F172A]">
                        {formData.weight || "0"} ct
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Price/Carat:</span>
                      <span className="ml-2 font-medium text-[#0F172A]">
                        ${formData.price_per_carat || "0"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Total:</span>
                      <span className="ml-2 font-medium text-[#0F172A]">
                        ${formData.final_price || "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </motion.div>
          )}

          {activeTab === "advanced" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <SectionCard title="Advanced Details" icon={Sparkles} className="max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Certificate Number"
                    name="certificate_number"
                    type="number"
                    value={formData.certificate_number}
                    onChange={handleInputChange}
                    placeholder="Enter certificate number"
                  />
                  <InputField
                    label="Lab"
                    name="lab"
                    value={formData.lab}
                    onChange={handleInputChange}
                    options={LAB_OPTIONS}
                  />
                </div>
              </SectionCard>
            </motion.div>
          )}

          {activeTab === "images" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <SectionCard title="Diamond Images" icon={ImageIcon}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {["diamond_image1", "diamond_image2", "diamond_image3", "diamond_image4", "diamond_image5"].map(
                    (field, index) => (
                      <div key={field} className="space-y-2">
                        <label className="text-sm font-medium text-[#0F172A]">
                          Image {index + 1}
                        </label>
                        <div className="relative">
                          <div
                            className={`aspect-square rounded-xl border-2 border-dashed ${
                              imagePreview[field]
                                ? "border-[#10B981] bg-[#D1FAE5]"
                                : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#94A3B8]"
                            } flex items-center justify-center cursor-pointer transition-all overflow-hidden`}
                            onClick={() =>
                              document.getElementById(field).click()
                            }
                          >
                            {imagePreview[field] ? (
                              <img
                                src={imagePreview[field]}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-4">
                                <Upload className="w-6 h-6 text-[#94A3B8] mx-auto mb-1" />
                                <span className="text-xs text-[#64748B]">
                                  Upload
                                </span>
                              </div>
                            )}
                          </div>
                          <input
                            id={field}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, field)}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Video Upload */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-[#0F172A] block mb-2">
                    Diamond Video
                  </label>
                  <div
                    className={`relative h-32 rounded-xl border-2 border-dashed ${
                      imagePreview.diamond_video
                        ? "border-[#10B981] bg-[#D1FAE5]"
                        : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#94A3B8]"
                    } flex items-center justify-center cursor-pointer transition-all`}
                    onClick={() => document.getElementById("diamond_video").click()}
                  >
                    {imagePreview.diamond_video ? (
                      <video
                        src={imagePreview.diamond_video}
                        className="h-full rounded-lg"
                        controls
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                        <span className="text-sm text-[#64748B]">
                          Upload Video
                        </span>
                      </div>
                    )}
                    <input
                      id="diamond_video"
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleImageUpload(e, "diamond_video")}
                      className="hidden"
                    />
                  </div>
                </div>
              </SectionCard>
            </motion.div>
          )}

          {activeTab === "certificate" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Certificate Image" icon={FileText}>
                  <div className="space-y-4">
                    <div
                      className={`relative aspect-[3/4] rounded-xl border-2 border-dashed ${
                        imagePreview.certificate_image
                          ? "border-[#10B981] bg-[#D1FAE5]"
                          : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#94A3B8]"
                      } flex items-center justify-center cursor-pointer transition-all overflow-hidden`}
                      onClick={() =>
                        document.getElementById("certificate_image").click()
                      }
                    >
                      {imagePreview.certificate_image ? (
                        <img
                          src={imagePreview.certificate_image}
                          alt="Certificate Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center p-8">
                          <Upload className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                          <span className="text-sm text-[#64748B]">
                            Click to upload certificate image
                          </span>
                          <p className="text-xs text-[#94A3B8] mt-1">
                            Supports JPG, PNG, PDF
                          </p>
                        </div>
                      )}
                      <input
                        id="certificate_image"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleImageUpload(e, "certificate_image")}
                        className="hidden"
                      />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Certificate Comments" icon={FileText}>
                  <div className="space-y-4">
                    <InputField
                      label="Certificate Number"
                      name="certificate_number"
                      type="number"
                      value={formData.certificate_number}
                      onChange={handleInputChange}
                      placeholder="Enter certificate number"
                    />
                    <InputField
                      label="Lab"
                      name="lab"
                      value={formData.lab}
                      onChange={handleInputChange}
                      options={LAB_OPTIONS}
                    />
                    <InputField
                      label="Comments"
                      name="certificate_comment"
                      value={formData.certificate_comment}
                      onChange={handleInputChange}
                      type="textarea"
                      placeholder="Enter any additional certificate comments or notes"
                    />
                  </div>
                </SectionCard>
              </div>
            </motion.div>
          )}

        
        </div>
      </div>

      {/* Import Excel Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowImportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-[#F8FAFC] to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#0F172A]">Import from Excel</h2>
                    <p className="text-sm text-[#64748B]">Upload CSV or Excel file with stock data</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {!importFile ? (
                  /* Upload Area */
                  <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                      isDragging
                        ? "border-[#3B82F6] bg-[#EFF6FF]"
                        : "border-[#E2E8F0] hover:border-[#94A3B8]"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <div className="w-16 h-16 rounded-xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-[#64748B]" />
                    </div>
                    <h3 className="text-lg font-medium text-[#0F172A] mb-2">
                      Drop your file here
                    </h3>
                    <p className="text-[#64748B] mb-4">
                      or click to browse from your computer
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-xl font-medium hover:bg-[#1E40AF] transition-colors"
                    >
                      Select File
                    </button>
                    <p className="text-xs text-[#94A3B8] mt-4">
                      Supports CSV, XLSX, XLS files
                    </p>
                  </div>
                ) : (
                  /* File Preview */
                  <div className="space-y-4">
                    {/* File Info */}
                    <div className="bg-[#F8FAFC] rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                          {importFile.name.endsWith(".csv") ? (
                            <FileText className="w-6 h-6 text-green-600" />
                          ) : (
                            <FileSpreadsheet className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-[#0F172A]">{importFile.name}</h4>
                          <p className="text-sm text-[#64748B]">
                            {(importFile.size / 1024).toFixed(2)} KB • {importData.length} rows
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full">
                            {getSaveStats().saveable} will save
                          </span>
                          <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full">
                            {getSaveStats().skipped} skipped
                          </span>
                        </div>
                        <button
                          onClick={clearImportFile}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Search and View Toggle */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="w-5 h-5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search data..."
                          value={importSearchTerm}
                          onChange={(e) => setImportSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                        />
                      </div>
                      <div className="flex bg-[#F1F5F9] rounded-lg p-1">
                        <button
                          onClick={() => setImportPreviewMode("grid")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            importPreviewMode === "grid"
                              ? "bg-white text-[#1E3A8A] shadow-sm"
                              : "text-[#64748B]"
                          }`}
                        >
                          <LayoutGrid className="w-4 h-4" />
                          Grid
                        </button>
                        <button
                          onClick={() => setImportPreviewMode("list")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            importPreviewMode === "list"
                              ? "bg-white text-[#1E3A8A] shadow-sm"
                              : "text-[#64748B]"
                          }`}
                        >
                          <List className="w-4 h-4" />
                          List
                        </button>
                      </div>
                    </div>

                    {/* Data Preview */}
                    {importPreviewMode === "grid" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                        {paginatedImportData.map((row, idx) => {
                          const actualIndex = (importCurrentPage - 1) * importRowsPerPage + idx;
                          const willBeSaved = hasStockId(row);
                          return (
                            <div
                              key={actualIndex}
                              className={`bg-[#F8FAFC] rounded-xl border p-4 ${
                                willBeSaved ? "border-[#E2E8F0]" : "border-red-300 bg-red-50"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-[#64748B] bg-white px-2 py-1 rounded-full">
                                  #{actualIndex + 1}
                                </span>
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    willBeSaved ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                                  }`}
                                >
                                  {willBeSaved ? "Will Save" : "No stock_id"}
                                </span>
                              </div>
                              <div className="space-y-1 text-sm">
                                {Object.entries(row).slice(0, 5).map(([key, val]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-[#64748B]">{key}:</span>
                                    <span className="font-medium text-[#0F172A] truncate max-w-[120px]">
                                      {val || "-"}
                                    </span>
                                  </div>
                                ))}
                                {Object.keys(row).length > 5 && (
                                  <div className="text-xs text-[#94A3B8] text-center pt-2">
                                    +{Object.keys(row).length - 5} more fields
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="overflow-x-auto max-h-[400px]">
                        <table className="w-full text-sm">
                          <thead className="bg-[#F8FAFC] sticky top-0">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-[#475569] uppercase">Status</th>
                              {importColumns.slice(0, 8).map((col) => (
                                <th
                                  key={col}
                                  className="px-3 py-2 text-left text-xs font-semibold text-[#475569] uppercase cursor-pointer hover:bg-[#F1F5F9]"
                                  onClick={() => handleImportSort(col)}
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E8F0]">
                            {paginatedImportData.map((row, idx) => {
                              const actualIndex = (importCurrentPage - 1) * importRowsPerPage + idx;
                              const willBeSaved = hasStockId(row);
                              return (
                                <tr key={actualIndex} className={!willBeSaved ? "bg-red-50" : ""}>
                                  <td className="px-3 py-2">
                                    <span
                                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                                        willBeSaved ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                                      }`}
                                    >
                                      {willBeSaved ? "Save" : "Skip"}
                                    </span>
                                  </td>
                                  {importColumns.slice(0, 8).map((col) => (
                                    <td key={col} className="px-3 py-2 text-[#0F172A] whitespace-nowrap">
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
                    {importTotalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                        <p className="text-sm text-[#64748B]">
                          Page {importCurrentPage} of {importTotalPages}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleImportPageChange(importCurrentPage - 1)}
                            disabled={importCurrentPage === 1}
                            className="p-2 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] disabled:opacity-50"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          {Array.from({ length: Math.min(5, importTotalPages) }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handleImportPageChange(page)}
                              className={`px-3 py-1 rounded-lg text-sm ${
                                importCurrentPage === page
                                  ? "bg-[#1E3A8A] text-white"
                                  : "border border-[#E2E8F0] hover:bg-[#F1F5F9]"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => handleImportPageChange(importCurrentPage + 1)}
                            disabled={importCurrentPage === importTotalPages}
                            className="p-2 rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] disabled:opacity-50"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <div className="text-sm text-[#64748B]">
                  {importFile && (
                    <span>
                      <span className="font-medium text-[#0F172A]">{getSaveStats().saveable}</span> rows with stock_id will be imported
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    Cancel
                  </button>
                  {importFile && (
                    <button
                      onClick={checkDuplicates}
                      disabled={importLoading || getSaveStats().saveable === 0}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {importLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Database className="w-4 h-4" />
                          Import {getSaveStats().saveable} Items
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duplicate Warning Modal */}
      <AnimatePresence>
        {showDuplicateWarning && duplicateInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Duplicate Stock IDs Found</h3>
              </div>
              <p className="text-sm text-[#64748B] mb-4">
                The following stock IDs already exist in the database and will be replaced:
              </p>
              <div className="bg-amber-50 rounded-xl p-4 mb-4 max-h-40 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {duplicateInfo.existing.map((id) => (
                    <span key={id} className="px-2 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                      {id}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDuplicateWarning(false)}
                  className="flex-1 px-4 py-2.5 border border-[#E2E8F0] text-[#64748B] rounded-xl font-medium hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDuplicateWarning(false);
                    handleImportSubmit();
                  }}
                  className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
                >
                  Replace & Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Result Toast */}
      <AnimatePresence>
        {importResult && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl border border-[#E2E8F0] p-4 z-[70]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#0F172A]">Import Complete</h4>
                <p className="text-sm text-[#64748B]">
                  Saved: <span className="text-green-700 font-medium">{importResult.insertedCount}</span> •{" "}
                  Skipped: <span className="text-red-600 font-medium">{importResult.skippedCount}</span>
                </p>
              </div>
              <button
                onClick={() => setImportResult(null)}
                className="ml-4 p-1 text-[#94A3B8] hover:text-[#64748B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddStockManual;
