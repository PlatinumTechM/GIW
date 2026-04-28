import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gem,
  Filter,
  FlaskConical,
  X,
  SlidersHorizontal,
  RefreshCw,
  Search,
  Grid3X3,
  List,
} from "lucide-react";
import ShowStock from "./ShowStock";
import { DiamondFilterContent, useDiamondFilters } from "./DiamondFilters";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "carat-low", label: "Carat: Low to High" },
  { value: "carat-high", label: "Carat: High to Low" },
  { value: "color", label: "Color Grade" },
];

// Animation variants - defined outside component to prevent re-creation
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const NaturalDiamond = () => {
  const [activeTab, setActiveTab] = useState("Single Stone");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Use shared diamond filters hook
  const filters = useDiamondFilters();
  const {
    appliedFilters,
    activeFiltersCount,
    pendingFiltersCount,
    clearAllFilters,
    applyFilters,
    sortBy,
    setSortBy,
    pendingSortBy,
    setPendingSortBy,
    selectedShapes,
    selectedWhiteColors,
    selectedFancyColors,
    selectedFancyIntensity,
    selectedFancyOvertone,
    selectedClarities,
    selectedCuts,
    selectedPolish,
    selectedSymmetry,
    selectedCertifications,
    certificateType,
    showOnlyMedia,
    availableItems,
    caratMin,
    caratMax,
    pricePerCaratMin,
    pricePerCaratMax,
    setSelectedFancyIntensity,
    setSelectedFancyOvertone,
    setCertificateType,
    setShowOnlyMedia,
    setAvailableItems,
    setCaratMin,
    setCaratMax,
    setPricePerCaratMin,
    setPricePerCaratMax,
    toggleShape,
    toggleWhiteColor,
    toggleFancyColor,
    toggleClarity,
    toggleCut,
    togglePolish,
    toggleSymmetry,
    toggleCertification,
    toggleTreatment,
    selectedTreatment,
    setSelectedTreatment,
    selectedLocation,
    setSelectedLocation,
    selectedSupplier,
    setSelectedSupplier,
    selectedHeartArrow,
    setSelectedHeartArrow,
    selectedNoBgm,
    setSelectedNoBgm,
    selectedFluorescence,
    toggleFluorescence,
  } = filters;

  const filterContentJsx = <DiamondFilterContent filters={{ ...filters, isLabGrown: false }} />;

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileFilters]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#FAFBFC]"
    >
      {/* Professional Header */}
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <motion.div
                variants={fadeInUp}
                className="mb-2 flex items-center gap-2 text-sm text-[#64748B]"
              >
                <Link to="/user/home" className="hover:text-[#1E3A8A]">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[#1E3A8A]">Natural Diamonds</span>
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="text-2xl font-bold text-[#0F172A]"
              >
                Natural Diamond Collection
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-sm text-[#64748B]">
                GIA Certified • Premium Quality • Ethically Sourced
              </motion.p>
            </div>
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <Link
                to="/user/lab-grown-diamonds"
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
              >
                <FlaskConical className="h-4 w-4" />
                View Lab-Grown Diamonds
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Top Filter Bar */}
      <section className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white py-3 backdrop-blur-xl w-full shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 lg:flex-wrap lg:overflow-visible">
              {/* Mobile Filter Button - Left Side */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A] lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#1E3A8A] text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <span className="text-sm text-[#64748B]">Natural Diamonds</span>
              {activeFiltersCount > 0 && (
                <>
                  <span className="text-sm text-[#64748B]">•</span>
                  <span className="text-sm text-[#64748B]">Active:</span>
                  {selectedShapes.map((shape) => (
                    <span
                      key={shape}
                      className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                    >
                      {shape}
                      <button onClick={() => toggleShape(shape)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedWhiteColors.map((color) => (
                    <span
                      key={color}
                      className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                    >
                      Color {color}
                      <button onClick={() => toggleWhiteColor(color)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedFancyColors.map((color) => (
                    <span
                      key={color}
                      className="flex items-center gap-1 rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-medium text-[#BE185D]"
                    >
                      Fancy {color}
                      <button onClick={() => toggleFancyColor(color)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedFancyIntensity && (
                    <span className="flex items-center gap-1 rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-medium text-[#BE185D]">
                      Intensity: {selectedFancyIntensity}
                      <button onClick={() => setSelectedFancyIntensity("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedFancyOvertone && (
                    <span className="flex items-center gap-1 rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-medium text-[#BE185D]">
                      Overtone: {selectedFancyOvertone}
                      <button onClick={() => setSelectedFancyOvertone("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedClarities.map((clarity) => (
                    <span
                      key={clarity}
                      className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                    >
                      {clarity}
                      <button onClick={() => toggleClarity(clarity)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedCuts.map((cut) => (
                    <span
                      key={cut}
                      className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                    >
                      {cut}
                      <button onClick={() => toggleCut(cut)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedPolish.map((polish) => (
                    <span
                      key={polish}
                      className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                    >
                      Polish: {polish}
                      <button onClick={() => togglePolish(polish)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedSymmetry.map((symmetry) => (
                    <span
                      key={symmetry}
                      className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                    >
                      Sym: {symmetry}
                      <button onClick={() => toggleSymmetry(symmetry)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedCertifications.map((cert) => (
                    <span
                      key={cert}
                      className="flex items-center gap-1 rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-medium text-[#86198F]"
                    >
                      {cert}
                      <button onClick={() => toggleCertification(cert)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {certificateType && (
                    <span className="flex items-center gap-1 rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-medium text-[#86198F]">
                      {certificateType === "certified"
                        ? "Certified"
                        : "Non-certified"}
                      <button
                        onClick={() => {
                          setCertificateType(null);
                          setSelectedCertifications([]);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {showOnlyMedia && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      With Media
                      <button onClick={() => setShowOnlyMedia(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {availableItems && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      Available
                      <button onClick={() => setAvailableItems(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(caratMin || caratMax) && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      {caratMin || "0"} - {caratMax || "∞"} ct
                      <button
                        onClick={() => {
                          setCaratMin("");
                          setCaratMax("");
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(pricePerCaratMin || pricePerCaratMax) && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      {pricePerCaratMin ? `$${pricePerCaratMin}` : "$0"} - {pricePerCaratMax ? `$${pricePerCaratMax}` : "∞"}/ct
                      <button
                        onClick={() => {
                          setPricePerCaratMin("");
                          setPricePerCaratMax("");
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedLocation && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      Location: {selectedLocation}
                      <button onClick={() => setSelectedLocation("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedSupplier && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      Supplier: {selectedSupplier}
                      <button onClick={() => setSelectedSupplier("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedHeartArrow && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      H&A
                      <button onClick={() => setSelectedHeartArrow(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedNoBgm && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      No BGM
                      <button onClick={() => setSelectedNoBgm(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedFluorescence.map((fluor) => (
                    <span
                      key={fluor}
                      className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                    >
                      Fluor: {fluor}
                      <button onClick={() => toggleFluorescence(fluor)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedTreatment.map((treatment) => (
                    <span
                      key={treatment}
                      className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                    >
                      {treatment}
                      <button onClick={() => toggleTreatment(treatment)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="ml-1 flex items-center gap-1 text-xs font-medium text-[#64748B] underline hover:text-[#1E3A8A]"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Clear all
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden w-80 flex-shrink-0 lg:flex lg:flex-col h-[calc(100vh-140px)] sticky top-[120px]">
              {/* Scrollable Filter Content */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-4">
                {filterContentJsx}
              </div>

              {/* Fixed Bottom Buttons */}
              <div className="border-t border-[#E2E8F0] pt-4 pb-2 space-y-3 bg-white">
                {/* Apply Filters Button */}
                {pendingFiltersCount > 0 && (
                  <button
                    onClick={applyFilters}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] py-3 text-sm font-medium text-white transition-all hover:bg-[#1E40AF] shadow-md"
                  >
                    <Filter className="h-4 w-4" />
                    Apply Filters
                    <span className="ml-1 bg-white text-[#1E3A8A] text-xs px-2 py-0.5 rounded-full font-semibold">
                      {pendingFiltersCount}
                    </span>
                  </button>
                )}
                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-3 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
                  >
                    <X className="h-4 w-4" />
                    Clear All Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#64748B]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPendingSortBy(e.target.value);
                    }}
                    className="rounded-lg border border-[#E2E8F0] bg-white py-2 px-3 text-sm"
                  >
                    {sorts.map((sort) => (
                      <option key={sort.value} value={sort.value}>
                        {sort.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${viewMode === "grid"
                      ? "bg-[#1E3A8A] text-white shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${viewMode === "list"
                      ? "bg-[#1E3A8A] text-white shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                  >
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>
              </div>

              {/* Stock Grid/List */}
              <ShowStock
                type="natural"
                viewMode={viewMode}
                sortBy={sortBy}
                filters={appliedFilters}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 flex h-full w-[90vw] max-w-[400px] flex-col bg-white lg:hidden"
            >
              {/* Fixed Header */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                    <Gem className="w-6 h-6 text-[#1E3A8A]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#0F172A]">
                      Filters
                    </h2>
                    <p className="text-xs text-[#64748B]">Natural Diamonds</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full p-2 hover:bg-[#F1F5F9]"
                >
                  <X className="h-5 w-5 text-[#64748B]" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {filterContentJsx}
              </div>

              {/* Fixed Footer */}
              <div className="border-t border-[#E2E8F0] p-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setShowMobileFilters(false);
                    }}
                    className="flex-1 rounded-lg border border-[#E2E8F0] py-3 text-sm font-medium text-[#475569] hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => {
                      applyFilters();
                      setShowMobileFilters(false);
                    }}
                    className="flex-1 rounded-lg bg-[#1E3A8A] py-3 text-sm font-medium text-white hover:bg-[#1E40AF]"
                  >
                    Apply Filters
                    {pendingFiltersCount > 0 && (
                      <span className="ml-1 bg-white text-[#1E3A8A] text-xs px-2 py-0.5 rounded-full font-semibold">
                        {pendingFiltersCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NaturalDiamond;
