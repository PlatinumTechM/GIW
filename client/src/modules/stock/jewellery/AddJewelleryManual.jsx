import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  RotateCcw,
  Package,
  Gem,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Weight,
  Layers,
  Sparkles,
  ChevronRight,
  Video,
  ExternalLink,
  Tag,
  CircleDot
} from "lucide-react";
import notify from "../../../utils/notifications";
import api from "../../../services/api";

const INITIAL_FORM_DATA = {
  stock_id: "",
  type: "NATURAL",
  category: "",
  name: "",
  description: "",
  material: "",
  weight: "",
  diamond_type: "NATURAL",
  diamond_shape: "",
  diamond_weight: "",
  diamond_color: "",
  diamond_clarity: "",
  diamond_cut: "",
  diamond_growth: "",
  price: "",
  status: "AVAILABLE",
  jewellery_image1: "",
  jewellery_image2: "",
  jewellery_image3: "",
  jewellery_image4: "",
  jewellery_image5: "",
  jewellery_video: ""
};

const SectionCard = React.memo(({ title, icon: Icon, children, className = "" }) => (
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
));

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
  isUrl = false
}) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    onChange({ target: { name, value, type } });
  };

  return (
    <div className="space-y-1 sm:space-y-1.5 max-w-full">
      <label className="text-xs sm:text-sm font-medium text-[#0F172A] flex items-center justify-between">
        <span className="flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
        </span>
        {isUrl && value && (
            <a href={value} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 lowercase">
                preview <ExternalLink className="w-2.5 h-2.5" />
            </a>
        )}
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
            onChange={handleChange}
            required={required}
            className={`input-field ${Icon ? "pl-10" : "px-3 sm:px-4"} h-11 !bg-gray-50`}
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
            className={`input-field px-3 sm:px-4 py-3 !bg-gray-50 resize-none`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder?.toUpperCase()}
            className={`input-field ${Icon ? "pl-10" : "px-3 sm:px-4"} h-11 !bg-gray-50`}
          />
        )}
      </div>
    </div>
  );
};

const AddJewelleryManual = ({ onRefresh, editData, setEditData }) => {
  const [formData, setFormData] = useState(editData || INITIAL_FORM_DATA);
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data for submission
      const submissionData = { ...formData };
      const numericFields = ["weight", "diamond_weight", "price"];

      Object.keys(submissionData).forEach(key => {
        // Handle numeric fields: convert empty strings to null
        if (numericFields.includes(key)) {
          if (submissionData[key] === "" || submissionData[key] === null || submissionData[key] === undefined) {
            submissionData[key] = null;
          } else {
            submissionData[key] = parseFloat(submissionData[key]);
          }
        }
        // Handle text fields: ensure they are trimmed (and uppercase if needed by backend logic)
        else if (typeof submissionData[key] === 'string' && !key.includes('image') && !key.includes('video')) {
          submissionData[key] = submissionData[key].trim().toUpperCase();
        }
      });

      if (submissionData.id) {
        await api.put(`/jewellry-stock/${submissionData.id}`, submissionData);
        notify.success("Success", "Jewellery item updated successfully!");
      } else {
        await api.post("/jewellry-stock", submissionData);
        notify.success("Success", "Jewellery item added successfully!");
      }
      
      setFormData(INITIAL_FORM_DATA);
      if (setEditData) setEditData(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      notify.error("Error", error.response?.data?.message || "Failed to process jewellery");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    if (setEditData) setEditData(null);
    notify.info("Reset", "Form has been cleared");
  };

  const tabs = [
    { id: "basic", label: "Product Info", icon: Package },
    { id: "grading", label: "Gem Specs", icon: Gem },
    { id: "images", label: "Media Assets", icon: ImageIcon },
  ];

  return (
    <div className="bg-[#F8FAFC]">
      {/* Header - Not sticky anymore as per user request */}
      <div className="bg-white border-b border-[#E2E8F0] shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center text-white shadow-xl shadow-blue-100">
                <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight">
                    {editData ? 'Edit Jewellery' : 'Add Jewellery Piece'}
                </h1>
                <p className="text-[10px] sm:text-xs text-[#64748B] font-bold uppercase tracking-widest">Manual Inventory Entry</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleReset}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-[#E2E8F0] text-[#64748B] font-bold text-[10px] sm:text-xs rounded-xl hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-all shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden xs:inline">Reset</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-[2] sm:flex-none flex items-center justify-center gap-2 px-6 sm:px-10 py-2.5 sm:py-3 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white font-black text-[10px] sm:text-xs rounded-xl shadow-xl shadow-[#1E3A8A]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{editData ? 'Update' : 'Save Piece'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Sticky - Sticky for quick navigation during scroll */}
      <div className="max-w-7xl mx-auto px-4 mb-8 sticky top-[64px] z-20 bg-[#F8FAFC]/80 backdrop-blur-md py-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-[#1E3A8A] text-white shadow-xl shadow-[#1E3A8A]/20"
                    : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-[#94A3B8]'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === "basic" && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <SectionCard title="Basic Specifications" icon={Package}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Stock ID"
                    name="stock_id"
                    value={formData.stock_id}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter Stock ID"
                  />
                  <InputField
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    options={["RING", "NECKLACE", "EARRINGS", "BRACELET", "PENDANT", "BANGLE", "BROOCH", "OTHER"]}
                  />
                  <InputField
                    label="Piece Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Name"
                    className="sm:col-span-2"
                  />
                  <InputField
                    label="Metal Material"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    options={["GOLD", "WHITE GOLD", "ROSE GOLD", "PLATINUM", "SILVER", "YELLOW GOLD"]}
                  />
                   <InputField
                    label="Metal Weight (G)"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="0.000"
                  />
                  <InputField
                    label="Selling Price (INR)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="sm:col-span-2"
                  />
                </div>
              </SectionCard>

              <SectionCard title="Product Description" icon={FileText}>
                <InputField
                    label="Details & Description"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the piece characteristics..."
                />
              </SectionCard>
            </motion.div>
          )}

          {activeTab === "grading" && (
            <motion.div
              key="grading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <SectionCard title="Diamond Specifications" icon={Gem}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Stone Type"
                    name="diamond_type"
                    value={formData.diamond_type}
                    onChange={handleInputChange}
                    options={["NATURAL", "LAB GROWN"]}
                  />
                  <InputField
                    label="Stone Shape"
                    name="diamond_shape"
                    value={formData.diamond_shape}
                    onChange={handleInputChange}
                    options={["ROUND", "PRINCESS", "PEAR", "OVAL", "EMERALD", "MARQUISE", "HEART", "CUSHION", "RADIANT", "ASSCHER"]}
                  />
                  <InputField
                    label="Stone Weight (CT)"
                    name="diamond_weight"
                    type="number"
                    value={formData.diamond_weight}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                  <InputField
                    label="Color Grade"
                    name="diamond_color"
                    value={formData.diamond_color}
                    onChange={handleInputChange}
                    placeholder="E.G. D, E-F"
                  />
                  <InputField
                    label="Clarity Grade"
                    name="diamond_clarity"
                    value={formData.diamond_clarity}
                    onChange={handleInputChange}
                    placeholder="E.G. VVS1, VS2"
                  />
                  <InputField
                    label="Stone Cut"
                    name="diamond_cut"
                    value={formData.diamond_cut}
                    onChange={handleInputChange}
                    options={["EXCELLENT", "VERY GOOD", "GOOD", "FAIR"]}
                  />
                </div>
              </SectionCard>

              <SectionCard title="Other Gem Details" icon={Sparkles}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputField
                        label="Diamond Growth"
                        name="diamond_growth"
                        value={formData.diamond_growth}
                        onChange={handleInputChange}
                        options={["CVD", "HPHT", "NATURAL", "OTHER"]}
                    />
          
                    <InputField
                        label="Current Status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        options={["AVAILABLE", "SOLD"]}
                        className="sm:col-span-2"
                    />
                </div>
              </SectionCard>
            </motion.div>
          )}

          {activeTab === "images" && (
            <motion.div
              key="images"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <SectionCard title="Primary Media Links" icon={ImageIcon}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Image URL 1"
                    name="jewellery_image1"
                    value={formData.jewellery_image1}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    isUrl={true}
                  />
                  <InputField
                    label="Image URL 2"
                    name="jewellery_image2"
                    value={formData.jewellery_image2}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    isUrl={true}
                  />
                  <InputField
                    label="Showcase Video URL"
                    name="jewellery_video"
                    value={formData.jewellery_video}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    isUrl={true}
                    className="md:col-span-2"
                  />
                </div>
              </SectionCard>

              <SectionCard title="Additional Gallery" icon={Layers}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField
                    label="Image URL 3"
                    name="jewellery_image3"
                    value={formData.jewellery_image3}
                    onChange={handleInputChange}
                    isUrl={true}
                  />
                  <InputField
                    label="Image URL 4"
                    name="jewellery_image4"
                    value={formData.jewellery_image4}
                    onChange={handleInputChange}
                    isUrl={true}
                  />
                  <InputField
                    label="Image URL 5"
                    name="jewellery_image5"
                    value={formData.jewellery_image5}
                    onChange={handleInputChange}
                    isUrl={true}
                  />
                </div>
              </SectionCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AddJewelleryManual;
