import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Search, 
  Gem, 
  Scale, 
  DollarSign, 
  Package, 
  Layers, 
  Filter as FilterIcon,
  RotateCcw,
  CheckCircle2
} from "lucide-react";

// Move sub-components OUTSIDE to prevent focus loss on re-render
const FilterSection = ({ title, icon: Icon, children }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 px-1">
      {Icon && <Icon className="w-4 h-4 text-[#475569]" />}
      <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
        {title}
      </h4>
    </div>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const PillGroup = ({ options, filterKey, currentFilters, onToggle }) => {
  // Filter out empty or null options
  const validOptions = (options || []).filter(opt => opt && opt.trim() !== "");
  
  return (
    <div className="flex flex-wrap gap-2">
      {validOptions.map((option) => {
        const isActive = (currentFilters[filterKey] || []).includes(option);
        return (
          <button
            key={option}
            onClick={() => onToggle(filterKey, option)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 border ${
              isActive
                ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md"
                : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#1E3A8A]/30 hover:bg-[#F8FAFC]"
            }`}
          >
            {isActive && <CheckCircle2 className="w-3 h-3" />}
            {option}
          </button>
        );
      })}
    </div>
  );
};

const JewelleryFilters = ({ 
  isOpen, 
  onClose, 
  filterOptions, 
  initialFilters, 
  onApply, 
  onClearFilters 
}) => {
  const [currentFilters, setCurrentFilters] = useState(initialFilters);

  // Sync local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const toggleMultiSelect = (key, value) => {
    const current = currentFilters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setCurrentFilters(prev => ({ ...prev, [key]: updated }));
  };

  const handleInputChange = (key, value) => {
    setCurrentFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center sm:justify-end p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Professional Sidebar Panel */}
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-[95%] sm:w-[400px] h-[92%] sm:h-[calc(100vh-32px)] bg-white shadow-2xl flex flex-col rounded-[2.5rem] sm:rounded-2xl border-l border-[#E2E8F0] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white sticky top-0 z-10 sm:rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/10 flex items-center justify-center text-[#1E3A8A]">
                <FilterIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Advanced Filters</h2>
                <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-tight">Refine Stock Results</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Filters Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-hide">
            
            {/* Search Input */}
            <FilterSection title="Quick Search" icon={Search}>
              <input
                type="text"
                placeholder="Search by Stock ID or Name..."
                value={currentFilters.stock_id || ""}
                onChange={(e) => handleInputChange("stock_id", e.target.value)}
                className="input-field h-11 text-sm focus:ring-[#1E3A8A]/10 px-4"
              />
            </FilterSection>

            {/* Category & Material */}
            <FilterSection title="Classification" icon={Package}>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-2 block tracking-wider">Category</label>
                  <PillGroup 
                    options={filterOptions.categories} 
                    filterKey="categories" 
                    currentFilters={currentFilters}
                    onToggle={toggleMultiSelect}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-2 block tracking-wider">Metal Material</label>
                  <PillGroup 
                    options={filterOptions.materials} 
                    filterKey="materials" 
                    currentFilters={currentFilters}
                    onToggle={toggleMultiSelect}
                  />
                </div>
              </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Pricing (₹)" icon={DollarSign}>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min Price (₹)"
                    value={currentFilters.priceFrom || ""}
                    onChange={(e) => handleInputChange("priceFrom", e.target.value)}
                    className="input-field h-11 text-sm px-4"
                  />
                </div>
                <span className="text-[#CBD5E1] font-bold">—</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Max Price (₹)"
                    value={currentFilters.priceTo || ""}
                    onChange={(e) => handleInputChange("priceTo", e.target.value)}
                    className="input-field h-11 text-sm px-4"
                  />
                </div>
              </div>
            </FilterSection>

            {/* Technical Specs */}
            <FilterSection title="Technical Details" icon={Layers}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Metal Wt (g)</label>
                  <input
                    type="number"
                    placeholder="Min G"
                    value={currentFilters.weight || ""}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="input-field h-10 text-xs px-4"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase">Stone Wt (ct)</label>
                  <input
                    type="number"
                    placeholder="Min CT"
                    value={currentFilters.diamond_weight || ""}
                    onChange={(e) => handleInputChange("diamond_weight", e.target.value)}
                    className="input-field h-10 text-xs px-4"
                  />
                </div>
              </div>
            </FilterSection>

            {/* Diamond Details */}
            <FilterSection title="Gemstone Specs" icon={Gem}>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-2 block tracking-wider">Stone Type</label>
                  <div className="flex bg-[#F1F5F9] p-1 rounded-xl">
                    {["NATURAL", "LABGROWN"].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          const newValue = currentFilters.diamond_type === type ? "" : type;
                          handleInputChange("diamond_type", newValue);
                        }}
                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                          currentFilters.diamond_type === type
                            ? "bg-white text-[#1E3A8A] shadow-sm"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-2 block tracking-wider">Shape</label>
                  <PillGroup 
                    options={filterOptions.shapes || []} 
                    filterKey="shapes" 
                    currentFilters={currentFilters}
                    onToggle={toggleMultiSelect}
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-2 block tracking-wider">Color Grade</label>
                  <PillGroup 
                    options={filterOptions.colors || []} 
                    filterKey="colors" 
                    currentFilters={currentFilters}
                    onToggle={toggleMultiSelect}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-2 block tracking-wider">Clarity Grade</label>
                  <PillGroup 
                    options={filterOptions.clarities || []} 
                    filterKey="clarities" 
                    currentFilters={currentFilters}
                    onToggle={toggleMultiSelect}
                  />
                </div>
              </div>
            </FilterSection>

            {/* Status Selection */}
            <FilterSection title="Inventory Status" icon={CheckCircle2}>
              <div className="grid grid-cols-2 gap-2 pb-6">
                {["AVAILABLE", "SOLD"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleInputChange("status", status)}
                    className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all border ${
                      currentFilters.status === status
                        ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                        : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </FilterSection>

          </div>

          {/* Sticky Actions Footer */}
          <div className="px-6 py-5 border-t border-[#E2E8F0] bg-white sticky bottom-0 sm:rounded-b-2xl flex items-center gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <button
              onClick={() => {
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
                setCurrentFilters(defaultFilters);
                onClearFilters();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] text-[#64748B] font-bold text-xs rounded-xl hover:bg-[#F1F5F9] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={() => onApply(currentFilters)}
              className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E3A8A] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#1E3A8A]/20 hover:bg-[#1E40AF] transition-all"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JewelleryFilters;
