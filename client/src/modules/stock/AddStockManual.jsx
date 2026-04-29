import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Diamond,
  Save,
  X,
  ChevronRight,
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
  RotateCcw,
} from "lucide-react";
import notify from "../../utils/notifications";
import api from "../../services/api";

const INITIAL_FORM_DATA = {
  stock_id: "",
  party: "",
  type: "",
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



const TYPE_OPTIONS = ["NATURAL", "LABGROWN"];

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

const STATUS_OPTIONS = ["AVAILABLE", "SOLD", "ON HOLD", "IN MEMO"];

const GROWTH_TYPE_OPTIONS = ["CVD", "HPHT", "NATURAL"];

const EYE_CLEAN_OPTIONS = ["Yes", "No", "VVS"];

const MILKY_OPTIONS = ["None", "Milky", "Slightly Milky", "Heavy Milky"];

const NON_NEGATIVE_FIELDS = new Set([
  "weight",
  "price_per_carat",
  "rap_per_carat",
  "rs_amount",
  "dollar_rate",
  "final_price",
]);

// Field mappings for Excel import - matches backend logic
const FIELD_MAPPINGS = {
  type: ["type", "diamond type", "stone type"],
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
    "pkt no",
    "pkt #",
    "ref no",
    "ref #",
    "reference",
  ],
  party: ["party", "supplier", "vendor", "source", "party name", "party_name"],
  certificate_number: [
    "certificate number",
    "cert no",
    "cert_no",
    "certificate_no",
    "cert #",
    "cert.",
    "report no",
    "report #",
    "lab no",
    "lab #",
    "report",
    "certificate",
    "cert",
    "inscription",
    "insc",
  ],
  weight: ["weight", "carat", "carat weight", "ct", "cts", "carats", "crt"],
  shape: ["shape", "shp", "diamond shape", "cut shape"],
  color: ["color", "colour", "col", "colors", "clr"],
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
  ],
  fancy_color_overtone: [
    "fancy color overtone",
    "overtone",
    "fancy overtone",
    "color overtone",
  ],
  clarity: ["clarity", "clar", "clr", "clarities", "purity"],
  cut: ["cut", "cut grade", "cut quality", "cutting"],
  polish: ["polish", "pol", "polish grade", "polishing"],
  symmetry: ["symmetry", "sym", "symm", "symmetry grade", "sym grade"],
  fluorescence: ["fluorescence", "fluor", "flr", "fl", "fluorescence grade"],
  fluorescence_color: [
    "fluorescence color",
    "fl color",
    "fl. color",
    "fluor color",
  ],
  fluorescence_intensity: [
    "fluorescence intensity",
    "fl intensity",
    "fl. intensity",
    "fluor intensity",
  ],
  measurements: ["measurements", "meas", "dimension", "dimensions"],
  length: ["length", "l", "mm length", "len"],
  width: ["width", "w", "mm width", "wid"],
  height: ["height", "h", "mm height", "depth", "ht", "dep"],
  depth_percentage: [
    "depth %",
    "depth percentage",
    "depth",
    "dep",
    "depth pct",
    "depth%",
  ],
  table_percentage: [
    "table %",
    "table percentage",
    "table",
    "tbl",
    "table pct",
    "table%",
  ],
  rap_per_carat: ["rap per carat", "rap", "rap rate", "rap p/c", "rap/ct"],
  price_per_carat: [
    "price per carat",
    "ppc",
    "per carat price",
    "rate per carat",
    "rate p/c",
    "$/ct",
    "price/carat",
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
  ],
  dollar_rate: [
    "dollar rate",
    "rate",
    "usd rate",
    "exchange rate",
    "$ rate",
    "usd",
  ],
  rs_amount: ["rs amount", "inr amount", "rupee amount", "local amount", "inr"],
  discount: ["discount", "disc", "off", "disc %", "discount %"],
  shade: ["shade", "shd"],
  milky: ["milky", "milkiness", "milk"],
  eye_clean: ["eye clean", "eyeclean", "eye", "ec", "e/c"],
  lab: ["lab", "laboratory", "certificate lab", "lab name"],
  certificate_comment: [
    "certificate comment",
    "cert comment",
    "comment",
    "comments",
    "remarks",
  ],
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
  gridle_condition: [
    "gridle condition",
    "girdle condition",
    "girdle cond",
    "gridle cond",
  ],
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

const CULET_SIZE_OPTIONS = [
  "None",
  "Very Small",
  "Small",
  "Medium",
  "Large",
  "Very Large",
];

const CULET_CONDITION_OPTIONS = ["Pointed", "Chipped", "Abraded"];

// Memoized SectionCard to prevent re-animation on every state change
const SectionCard = React.memo(
  ({ title, icon: Icon, children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] overflow-hidden ${className}`}
    >
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFC] to-white">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E3A8A]" />}
          <h3 className="font-semibold text-[#0F172A] text-sm sm:text-base">{title}</h3>
        </div>
      </div>
      <div className="p-3 sm:p-6 overflow-hidden">{children}</div>
    </motion.div>
  ),
);

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
  readonly = false,
}) => {
  const handleChange = (e) => {
    if (uppercase && type === "text") {
      e.target.value = e.target.value.toUpperCase();
    }
    onChange(e);
  };

  return (
    <div className="space-y-1 sm:space-y-1.5 max-w-full">
      <label className="text-xs sm:text-sm font-medium text-[#0F172A] flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative overflow-hidden">
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
            required={required}
            className={`w-full max-w-full text-sm sm:text-base ${Icon ? "pl-10" : "px-3 sm:px-4"} input-field`}
            style={{
              // backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              backgroundSize: "16px",
              maxWidth: "100%",
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
            onChange={readonly ? () => { } : handleChange}
            placeholder={placeholder}
            rows={3}
            readOnly={readonly}
            className={`w-full text-sm sm:text-base input-field px-3 sm:px-4 ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={readonly ? () => { } : handleChange}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            readOnly={readonly}
            className={`w-full text-sm sm:text-base ${Icon ? "pl-10" : "px-3 sm:px-4"} input-field ${readonly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        )}
      </div>
      {helperText && <p className="text-xs text-[#64748B]">{helperText}</p>}
    </div>
  );
};

const AddStockManual = ({ onStockAdded, editData, onCancel }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    if (editData) {
      // Map editData to INITIAL_FORM_DATA structure if necessary
      // For now assume they match mostly
      const sanitizedData = { ...INITIAL_FORM_DATA };
      Object.keys(INITIAL_FORM_DATA).forEach(key => {
        if (editData[key] !== undefined && editData[key] !== null) {
          sanitizedData[key] = editData[key];
        }
      });
      setFormData(sanitizedData);

      // Handle image previews if they are URLs
      setImagePreview({
        diamond_image1: editData.diamond_image1 || null,
        diamond_image2: editData.diamond_image2 || null,
        diamond_image3: editData.diamond_image3 || null,
        diamond_image4: editData.diamond_image4 || null,
        diamond_image5: editData.diamond_image5 || null,
        diamond_video: editData.diamond_video || null,
        certificate_image: editData.certificate_image || null,
      });
    } else {
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
    }
  }, [editData]);
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const [imagePreview, setImagePreview] = useState({
    diamond_image1: null,
    diamond_image2: null,
    diamond_image3: null,
    diamond_image4: null,
    diamond_image5: null,
    diamond_video: null,
    certificate_image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "number" && NON_NEGATIVE_FIELDS.has(name)) {
      const numericValue = Number(value);
      if (value !== "" && !Number.isNaN(numericValue) && numericValue < 0) {
        return;
      }
    }

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Auto-calculate final price when price_per_carat or rap_per_carat changesz
      if (name === 'price_per_carat' || name === 'weight') {
        const pricePerCarat = parseFloat(updatedData.price_per_carat) || 0;
        const weight = parseFloat(updatedData.weight) || 0;
        updatedData.final_price = Math.max(pricePerCarat * weight, 0).toFixed(2);
      }

      // Auto-calculate RS amount when final_price or dollar_rate changes
      if (name === 'final_price' || name === 'dollar_rate') {
        const finalPrice = parseFloat(updatedData.final_price) || 0;
        const dollarRate = parseFloat(updatedData.dollar_rate) || 0;
        updatedData.rs_amount = Math.max(finalPrice * dollarRate, 0).toFixed(2);
      }



      return updatedData;
    });
  };

  const validateForm = () => {
    const requiredFields = ["stock_id", "type"];
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        missingFields.push(field);
      }
    });

    const negativeFields = Array.from(NON_NEGATIVE_FIELDS).filter((field) => {
      const fieldValue = formData[field];
      if (fieldValue === "" || fieldValue === null || fieldValue === undefined) {
        return false;
      }
      const numericValue = Number(fieldValue);
      return !Number.isNaN(numericValue) && numericValue < 0;
    });

    return { missingFields, negativeFields };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const { missingFields, negativeFields } = validateForm();
    if (missingFields.length > 0) {
      const fieldNames = missingFields
        .map((field) => field.replace(/_/g, " ").toUpperCase())
        .join(", ");
      notify.warning(
        "Required Fields",
        `Please fill in all required fields: ${fieldNames}`,
      );
      return;
    }

    if (negativeFields.length > 0) {
      const fieldNames = negativeFields
        .map((field) => field.replace(/_/g, " ").toUpperCase())
        .join(", ");
      notify.error(
        "Validation Error",
        `Negative values are not allowed for: ${fieldNames}`,
      );
      return;
    }

    setIsLoading(true);

    try {
      if (editData) {
        await api.put(`/stock/${editData.id}`, formData);
        notify.success("Success", "Stock item updated successfully!");
      } else {
        await api.post("/stock", formData);
        notify.success("Success", "Stock item added successfully!");
      }
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
      if (onStockAdded) onStockAdded();
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage = error.response?.data?.message || "Failed to add stock";

      // Handle subscription limit error
      if (errorMessage.includes("Subscription limit") || errorMessage.includes("No active subscription")) {
        notify.error(errorMessage);
      }
      // Handle duplicate stock_id error
      else if (errorMessage.includes("already exists")) {
        notify.error(
          "Duplicate Stock ID",
          errorMessage
        );
      }
      else {
        notify.error(
          "Error",
          errorMessage,
        );
      }
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

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "grading", label: "Grading", icon: Gem },
    { id: "measurements", label: "Measurements", icon: Ruler },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "certificate", label: "Certificate", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            {/* Left: Title */}
            <div className="flex items-center gap-3 sm:gap-4">

              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-[#0F172A] truncate">
                  {editData ? "Update Stock" : "Add Stock"}
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] hidden sm:block">
                  {editData ? "Edit existing stock record" : "Manual stock entry form"}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                {editData && (
                  <button
                    onClick={onCancel}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all border border-red-200 flex-1 sm:flex-none"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-[#64748B] hover:text-[#0F172A] hover:bg-white rounded-lg transition-all border border-[#E2E8F0] flex-1 sm:flex-none"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-1 sm:flex-none whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="hidden sm:inline">{editData ? "Updating..." : "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">{editData ? "Update Stock" : "Save Stock"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4 sm:mb-6 -mx-3 px-3 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
                  ? "bg-[#1E3A8A] text-white shadow-lg shadow-[#1E3A8A]/20"
                  : "bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0]"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
          {activeTab === "basic" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Stock Information */}
                <SectionCard title="Stock Information" icon={Package}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
                    <InputField
                      label="Stock ID"
                      name="stock_id"
                      value={formData.stock_id}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter unique stock ID"
                    />
                    <InputField
                      label="Party"
                      name="party"
                      value={formData.party}
                      onChange={handleInputChange}
                      placeholder="Enter party name"
                    />
                    <InputField
                      label="Type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      options={TYPE_OPTIONS}
                      required
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
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
                      min={0}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Basic Measurements */}
                <SectionCard title="Basic Measurements" icon={Ruler}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-w-0">
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
                <SectionCard
                  title="Crown & Pavilion"
                  icon={Building}
                  className="lg:col-span-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
              <SectionCard
                title="Pricing Details"
                icon={DollarSign}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <InputField
                    label="RAP Price/Carat"
                    name="rap_per_carat"
                    type="number"
                    step="0.01"
                    min={0}
                    value={formData.rap_per_carat}
                    onChange={handleInputChange}
                    placeholder="0.00"

                  />
                  <InputField
                    label="Price/Carat"
                    name="price_per_carat"
                    type="number"
                    step="0.01"
                    min={0}
                    value={formData.price_per_carat}
                    onChange={handleInputChange}
                    placeholder="0.00"

                  />
                  <InputField
                    label="Discount %"
                    name="discount"
                    type="number"
                    step="0.01"
                    min={0}
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="0.00"

                  />
                  <InputField
                    label="Final Price"
                    name="final_price"
                    type="number"
                    step="0.01"
                    min={0}
                    value={formData.final_price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    readonly={true}
                  />
                  <InputField
                    label="Dollar Rate"
                    name="dollar_rate"
                    type="number"
                    step="0.01"
                    min={0}
                    value={formData.dollar_rate}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                  <InputField
                    label="RS Amount"
                    name="rs_amount"
                    type="number"
                    step="0.01"
                    min={0}
                    value={formData.rs_amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    readonly={true}
                  />
                </div>

                {/* Price Summary */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] rounded-xl border border-[#3B82F6]/20">
                  <h4 className="font-semibold text-[#1E3A8A] mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <CheckCircle className="w-4 h-4" />
                    Price Summary
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-[#64748B]">Price/Carat:</span>
                      <span className="ml-2 font-medium text-[#0F172A]">
                        ${formData.price_per_carat || "0"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">RAP Price:</span>
                      <span className="ml-2 font-medium text-[#0F172A]">
                        ${formData.rap_per_carat || "0"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Final Price:</span>
                      <span className="ml-2 font-medium text-[#0F172A]">
                        ${formData.final_price || "0"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B]">RS Amount:</span>
                      <span className="ml-2 font-medium text-[#0F172A]">
                        ₹{formData.rs_amount || "0"}
                      </span>
                    </div>
                  </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    "diamond_image1",
                    "diamond_image2",
                    "diamond_image3",
                    "diamond_image4",
                    "diamond_image5",
                  ].map((field, index) => (
                    <InputField
                      key={field}
                      label={`Image ${index + 1} URL`}
                      name={field}
                      type="url"
                      value={formData[field]}
                      onChange={handleInputChange}
                      placeholder={`Enter image ${index + 1} URL`}
                    />
                  ))}
                </div>

                {/* Video URL Input */}
                <div className="mt-6">
                  <InputField
                    label="Diamond Video URL"
                    name="diamond_video"
                    type="url"
                    value={formData.diamond_video}
                    onChange={handleInputChange}
                    placeholder="Enter video URL"
                  />
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <SectionCard title="Certificate Image" icon={FileText}>
                  <div className="space-y-3 sm:space-y-4">
                    <InputField
                      label="Certificate Image URL"
                      name="certificate_image"
                      type="url"
                      value={formData.certificate_image}
                      onChange={handleInputChange}
                      placeholder="Enter certificate image URL"
                    />
                  </div>
                </SectionCard>

                <SectionCard title="Certificate Comments" icon={FileText}>
                  <div className="space-y-3 sm:space-y-4">
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

      {/* Subscription Limit Modal */}
      <AnimatePresence>
        {showSubscriptionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
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
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Add more stocks</span> with higher limits
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Bulk import</span> unlimited records
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Priority support</span> and advanced features
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

export default AddStockManual;
