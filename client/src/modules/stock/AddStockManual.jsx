import { useState } from "react";
import { motion } from "framer-motion";
import {
  Diamond,
  Save,
  X,
  ChevronRight,
  Upload,
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
} from "lucide-react";
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

const CULET_SIZE_OPTIONS = ["None", "Very Small", "Small", "Medium", "Large", "Very Large"];

const CULET_CONDITION_OPTIONS = ["Pointed", "Chipped", "Abraded"];

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

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "grading", label: "Grading", icon: Gem },
    { id: "measurements", label: "Measurements", icon: Ruler },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "advanced", label: "Advanced", icon: Sparkles },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "certificate", label: "Certificate", icon: FileText },
  ];

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
  }) => (
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
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className={`w-full px-4 py-2.5 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#DBEAFE] transition-all resize-none`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
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

  const SectionCard = ({ title, icon: Icon, children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center shadow-lg">
                <Diamond className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0F172A]">Add Stock</h1>
                <p className="text-[#64748B]">Add individual diamond stock item</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === "basic" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 border-2 border-[#E2E8F0] text-[#64748B] rounded-xl font-medium hover:border-[#94A3B8] hover:text-[#0F172A] transition-all"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#1E3A8A]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Stock Item
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockManual;
