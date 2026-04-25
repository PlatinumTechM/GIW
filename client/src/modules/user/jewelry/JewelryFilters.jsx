import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Diamond,
  Sparkles,
  Star,
  Gem,
  Crown,
  Filter,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";


const JewelryFilters = ({
  items,
  onFilterChange,
  children,
  isLabGrown = false,
  searchQuery: propSearchQuery,
  setSearchQuery: propSetSearchQuery,
}) => {
  // UI state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    metal: true,
    shape: true,
    carat: true,
  });
  const [shapeDisplayCount, setShapeDisplayCount] = useState(8);

  // Ref for sidebar scroll container to preserve scroll position
  const sidebarScrollRef = useRef(null);
  const scrollPositionRef = useRef(0);

  // ========== APPLIED FILTER STATES (what's actually filtering the results) ==========
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selectedMetals, setSelectedMetals] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [centerStoneWeightRange, setCenterStoneWeightRange] = useState([0, 0]);
  // Use prop searchQuery if provided, otherwise use internal state
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : internalSearchQuery;
  const setSearchQuery = propSetSearchQuery || setInternalSearchQuery;
  const [sortBy, setSortBy] = useState("featured");

  // ========== PENDING FILTER STATES (what user is selecting in UI) ==========
  const [pendingCategory, setPendingCategory] = useState("all");
  const [pendingPriceRange, setPendingPriceRange] = useState([0, 0]);
  const [pendingMetals, setPendingMetals] = useState([]);
  const [pendingShapes, setPendingShapes] = useState([]);
  const [pendingCenterStoneWeightRange, setPendingCenterStoneWeightRange] = useState([0, 0]);

  const categories = [
    { id: "all", label: "All Types", icon: Diamond, count: items?.length || 0 },
    { id: "engagement-rings", label: "Engagement Rings", icon: Sparkles, count: items?.filter(i => i.category === "engagement-rings").length || 0 },
    { id: "wedding-bands", label: "Wedding Bands", icon: Crown, count: items?.filter(i => i.category === "wedding-bands").length || 0 },
    { id: "fashion-women", label: "Fashion Women", icon: Gem, count: items?.filter(i => i.category === "fashion-women").length || 0 },
    { id: "fashion-men", label: "Fashion Men", icon: Star, count: items?.filter(i => i.category === "fashion-men").length || 0 },
    { id: "earrings", label: "Earrings", icon: Gem, count: items?.filter(i => i.category === "earrings").length || 0 },
    { id: "bracelets", label: "Bracelets", icon: Star, count: items?.filter(i => i.category === "bracelets").length || 0 },
    { id: "necklaces", label: "Necklaces", icon: Crown, count: items?.filter(i => i.category === "necklaces").length || 0 },
    { id: "pearl-jewelry", label: "Pearl Jewelry", icon: Gem, count: items?.filter(i => i.category === "pearl-jewelry").length || 0 },
    { id: "accessories", label: "Accessories", icon: Diamond, count: items?.filter(i => i.category === "accessories").length || 0 },
  ];

  const metalTypes = [
    { id: "white-gold", label: "White Gold", color: "#F5F5F5" },
    { id: "yellow-gold", label: "Yellow Gold", color: "#FFD700" },
    { id: "rose-gold", label: "Rose Gold", color: "#E8B4B4" },
    { id: "platinum", label: "Platinum", color: "#A8A8A8" },
    { id: "silver", label: "Silver", color: "#C0C0C0" },
    { id: "two-tone", label: "Two Tone", color: "linear-gradient(135deg, #FFD700 50%, #E8E8E8 50%)" },
    { id: "other", label: "Other", color: "#808080" },
  ];

  const shapeTypes = [
    { id: "round", label: "Round", icon: "/diamond shap icon/round.svg" },
    { id: "pear", label: "Pear", icon: "/diamond shap icon/pear.svg" },
    { id: "oval", label: "Oval", icon: "/diamond shap icon/oval.svg" },
    { id: "princess", label: "Princess", icon: "/diamond shap icon/princess.svg" },
    { id: "emerald", label: "Emerald", icon: "/diamond shap icon/emerald.svg" },
    { id: "cushion", label: "Cushion", icon: "/diamond shap icon/cub.svg" },
    { id: "marquise", label: "Marquise", icon: "/diamond shap icon/marquise.svg" },
    { id: "heart", label: "Heart", icon: "/diamond shap icon/heart.svg" },
    { id: "radiant", label: "Radiant", icon: "/diamond shap icon/radiant.svg" },
    { id: "baguette", label: "Baguette", icon: "/diamond shap icon/Baguette.svg" },
    { id: "hexagonal", label: "Hexagonal", icon: "/diamond shap icon/Hexagonal.svg" },
    { id: "asscher", label: "SQUARE EMERALD", icon: "/diamond shap icon/Square Emerald.svg" },
    { id: "briolette", label: "Briolette", icon: "/diamond shap icon/Briolette.svg" },
    { id: "trilliant", label: "Trilliant", icon: "/diamond shap icon/Trilliant.svg" },
    { id: "half-moon", label: "Half Moon", icon: "/diamond shap icon/half moon.svg" },
    { id: "rose-cut", label: "Rose Cut", icon: "/diamond shap icon/rose cut.svg" },
    { id: "kite", label: "Kite", icon: "/diamond shap icon/kite.svg" },
    { id: "other", label: "Other", icon: "/diamond shap icon/other.svg" },
  ];

  // Compute filtered items
  const filteredItems = useMemo(() => {
    let result = items?.filter((item) => {
      const categoryMatch =
        activeCategory === "all" || item.category === activeCategory;
      const priceMatch =
        (priceRange[0] === 0 && priceRange[1] === 0) ||
        (item.price >= priceRange[0] && item.price <= priceRange[1]);
      const metalMatch =
        selectedMetals.length === 0 || selectedMetals.includes(item.metal);
      const shapeMatch =
        selectedShapes.length === 0 || selectedShapes.includes(item.shape);
      const weightMatch =
        (centerStoneWeightRange[0] === 0 && centerStoneWeightRange[1] === 0) ||
        (item.diamond_weight >= centerStoneWeightRange[0] && item.diamond_weight <= centerStoneWeightRange[1]);
      const searchMatch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && priceMatch && metalMatch && shapeMatch && weightMatch && searchMatch;
    }) || [];

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });

    return result;
  }, [items, activeCategory, priceRange, selectedMetals, selectedShapes, searchQuery, sortBy]);

  // Define functions before hooks that use them
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Category selection - only update pending state
  const handleCategorySelect = useCallback((categoryId) => {
    setPendingCategory(categoryId);
  }, []);

  // Price range change - only update pending state
  const handlePriceChange = useCallback((min, max) => {
    setPendingPriceRange([min, max]);
  }, []);

  // Carat weight change - only update pending state
  const handleCaratChange = useCallback((min, max) => {
    setPendingCenterStoneWeightRange([min, max]);
  }, []);

  // Toggle functions for pending states (no immediate application)
  const toggleMetal = useCallback((metalId) => {
    setPendingMetals((prev) =>
      prev.includes(metalId)
        ? prev.filter((id) => id !== metalId)
        : [...prev, metalId]
    );
  }, []);

  const toggleShape = useCallback((shapeId) => {
    setPendingShapes((prev) =>
      prev.includes(shapeId)
        ? prev.filter((id) => id !== shapeId)
        : [...prev, shapeId]
    );
  }, []);

  // Apply pending filters to applied filters (like DiamondFilters)
  const applyFilters = useCallback(() => {
    // Save current scroll position before applying filters
    if (sidebarScrollRef.current) {
      scrollPositionRef.current = sidebarScrollRef.current.scrollTop;
    }

    setActiveCategory(pendingCategory);
    setPriceRange(pendingPriceRange);
    setSelectedMetals(pendingMetals);
    setSelectedShapes(pendingShapes);
    setCenterStoneWeightRange(pendingCenterStoneWeightRange);

    // Restore scroll position after state update
    setTimeout(() => {
      if (sidebarScrollRef.current) {
        sidebarScrollRef.current.scrollTop = scrollPositionRef.current;
      }
    }, 0);
  }, [pendingCategory, pendingPriceRange, pendingMetals, pendingShapes, pendingCenterStoneWeightRange]);

  // Clear all filters - both pending and applied (like DiamondFilters)
  const clearAllFilters = useCallback(() => {
    // Clear applied states
    setActiveCategory("all");
    setPriceRange([0, 0]);
    setSelectedMetals([]);
    setSelectedShapes([]);
    setCenterStoneWeightRange([0, 0]);
    setSearchQuery("");
    setSortBy("featured");
    // Clear pending states
    setPendingCategory("all");
    setPendingPriceRange([0, 0]);
    setPendingMetals([]);
    setPendingShapes([]);
    setPendingCenterStoneWeightRange([0, 0]);
    setShapeDisplayCount(8);
  }, []);

  // Sync applied filters to pending (used on initial load or when clearing) - like DiamondFilters
  const syncPendingToApplied = useCallback(() => {
    setPendingCategory(activeCategory);
    setPendingPriceRange(priceRange);
    setPendingMetals(selectedMetals);
    setPendingShapes(selectedShapes);
    setPendingCenterStoneWeightRange(centerStoneWeightRange);
  }, [activeCategory, priceRange, selectedMetals, selectedShapes, centerStoneWeightRange]);

  // Store callback refs to avoid recreating functions
  const callbacksRef = useRef({
    onFilterChange,
    clearAllFilters,
    setActiveCategory,
    setSearchQuery,
    setSortBy,
  });

  // Update refs when values change
  useEffect(() => {
    callbacksRef.current = {
      onFilterChange,
      clearAllFilters,
      setActiveCategory,
      setSearchQuery,
      setSortBy,
    };
  }, [onFilterChange, clearAllFilters, setActiveCategory, setSearchQuery, setSortBy]);

  // Notify parent only when filters are applied (not on temp changes)
  useEffect(() => {
    callbacksRef.current.onFilterChange?.({
      filteredItems,
      filteredItemsCount: filteredItems.length,
      activeCategory,
      priceRange,
      selectedMetals,
      selectedShapes,
      centerStoneWeightRange,
      searchQuery,
      sortBy,
      clearAllFilters: callbacksRef.current.clearAllFilters,
      setActiveCategory: callbacksRef.current.setActiveCategory,
      setSearchQuery: callbacksRef.current.setSearchQuery,
      setSortBy: callbacksRef.current.setSortBy,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredItems, activeCategory, priceRange, selectedMetals, selectedShapes, centerStoneWeightRange, searchQuery, sortBy]);

  // Body scroll lock for mobile
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileFiltersOpen]);

  // Listen for custom event to open mobile filters
  useEffect(() => {
    const handleOpenMobileFilters = () => {
      setMobileFiltersOpen(true);
    };

    window.addEventListener('openMobileFilters', handleOpenMobileFilters);
    return () => {
      window.removeEventListener('openMobileFilters', handleOpenMobileFilters);
    };
  }, []);

  // Applied filters object (like DiamondFilters)
  const appliedFilters = useMemo(
    () => ({
      category: activeCategory,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      metals: selectedMetals,
      shapes: selectedShapes,
      centerStoneWeightMin: centerStoneWeightRange[0],
      centerStoneWeightMax: centerStoneWeightRange[1],
      searchQuery,
      sortBy,
    }),
    [
      activeCategory,
      priceRange,
      selectedMetals,
      selectedShapes,
      centerStoneWeightRange,
      searchQuery,
      sortBy,
    ],
  );

  // Count of currently applied filters
  const activeFiltersCount = useMemo(
    () =>
      (activeCategory !== "all" ? 1 : 0) +
      (priceRange[0] > 0 || priceRange[1] > 0 ? 1 : 0) +
      selectedMetals.length +
      selectedShapes.length +
      (centerStoneWeightRange[0] > 0 || centerStoneWeightRange[1] > 0 ? 1 : 0) +
      (searchQuery ? 1 : 0) +
      (sortBy !== "featured" ? 1 : 0),
    [
      activeCategory,
      priceRange,
      selectedMetals,
      selectedShapes,
      centerStoneWeightRange,
      searchQuery,
      sortBy,
    ],
  );

  // Count of pending filters selected
  const pendingFiltersCount = useMemo(
    () =>
      (pendingCategory !== "all" ? 1 : 0) +
      (pendingPriceRange[0] > 0 || pendingPriceRange[1] > 0 ? 1 : 0) +
      pendingMetals.length +
      pendingShapes.length +
      (pendingCenterStoneWeightRange[0] > 0 || pendingCenterStoneWeightRange[1] > 0 ? 1 : 0),
    [
      pendingCategory,
      pendingPriceRange,
      pendingMetals,
      pendingShapes,
      pendingCenterStoneWeightRange,
    ],
  );

  // Check if pending filters differ from applied filters (unsaved changes)
  const hasUnsavedChanges =
    pendingCategory !== activeCategory ||
    pendingPriceRange[0] !== priceRange[0] ||
    pendingPriceRange[1] !== priceRange[1] ||
    pendingMetals.length !== selectedMetals.length ||
    pendingMetals.some(m => !selectedMetals.includes(m)) ||
    pendingShapes.length !== selectedShapes.length ||
    pendingShapes.some(s => !selectedShapes.includes(s)) ||
    pendingCenterStoneWeightRange[0] !== centerStoneWeightRange[0] ||
    pendingCenterStoneWeightRange[1] !== centerStoneWeightRange[1];

  // Render helpers
  const renderFilterBadge = (label, onRemove) => (
    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
      {label}
      <button onClick={onRemove}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );

  const filterContent = useMemo(() => (
    <>
      {/* Mobile Filter Button - Hidden since moved to top bar */}
      {/* Original mobile filter button is now in the top filter bar */}

      {/* Desktop Sidebar */}
      <aside className="hidden w-56 md:w-60 lg:w-64 flex-shrink-0 md:block lg:ml-4">
        <div className="sticky top-[80px] md:top-[100px] flex max-h-[calc(100vh-100px)] md:max-h-[calc(100vh-120px)] flex-col rounded-xl border border-[#E2E8F0] bg-white mt-4">
          <div ref={sidebarScrollRef} className="flex-1 space-y-6 overflow-y-auto px-5 pb-5 pr-2 pt-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {/* Categories */}
            <div>
              <button
                onClick={() => toggleSection("category")}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="font-semibold text-[#0F172A]">All Types</h3>
                <ChevronDown
                  className={`h-4 w-4 text-[#64748B] transition-transform ${expandedSections.category ? "" : "-rotate-90"
                    }`}
                />
              </button>

              {expandedSections.category && (
                <div className="mt-4 space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${pendingCategory === category.id
                        ? "bg-[#DBEAFE] text-[#1E3A8A]"
                        : "text-[#475569] hover:bg-[#F1F5F9]"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
                        {category.label}
                      </span>
                      <span className="text-xs text-[#64748B]">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Total Price */}
            <div>
              <button
                onClick={() => toggleSection("price")}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="font-semibold text-[#0F172A]">Total Price</h3>
                <ChevronDown
                  className={`h-4 w-4 text-[#64748B] transition-transform ${expandedSections.price ? "" : "-rotate-90"
                    }`}
                />
              </button>

              {expandedSections.price && (
                <div className="mt-4" key="total-price">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={pendingPriceRange[0] || ''}
                        onChange={(e) => {
                          const newMin = Number(e.target.value) || 0;
                          setPendingPriceRange([newMin, pendingPriceRange[1]]);
                        }}
                        className="input-field"
                        placeholder="Min, $"
                      />
                    </div>

                    <span className="text-[#64748B]">{'>'}</span>

                    <div className="flex-1">
                      <input
                        type="number"
                        value={pendingPriceRange[1] || ''}
                        onChange={(e) => {
                          const newMax = Number(e.target.value) || 0;
                          setPendingPriceRange([pendingPriceRange[0], newMax]);
                        }}
                        className="input-field"
                        placeholder="Max, $"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metal Type */}
            <div>
              <button
                onClick={() => toggleSection("metal")}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="font-semibold text-[#0F172A]">Metal Type</h3>
                <ChevronDown
                  className={`h-4 w-4 text-[#64748B] transition-transform ${expandedSections.metal ? "" : "-rotate-90"
                    }`}
                />
              </button>

              {expandedSections.metal && (
                <div className="mt-4 space-y-2" key="metal-type-list">
                  {metalTypes.map((metal) => {
                    const isSelected = pendingMetals.includes(metal.id);
                    return (
                      <div
                        key={`metal-${metal.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMetal(metal.id);
                        }}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-[#F1F5F9]"
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border ${isSelected
                            ? 'border-[#1E3A8A] bg-[#1E3A8A]'
                            : 'border-[#E2E8F0] bg-white'
                            }`}
                        >
                          {isSelected && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span
                          className="h-4 w-4 rounded-full border border-gray-200"
                          style={{ background: metal.color }}
                        />
                        <span className="text-sm text-[#475569]">
                          {metal.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/*Stone Weight (Carat) */}
            <div>
              <button
                onClick={() => toggleSection("carat")}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="font-semibold text-[#0F172A]">Stone Weight</h3>
                <ChevronDown
                  className={`h-4 w-4 text-[#64748B] transition-transform ${expandedSections.carat ? "" : "-rotate-90"
                    }`}
                />
              </button>

              {expandedSections.carat && (
                <div className="mt-4" key="center-stone-weight">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        step="0.01"
                        value={pendingCenterStoneWeightRange[0] || ''}
                        onChange={(e) => {
                          setPendingCenterStoneWeightRange([
                            Number(e.target.value) || 0,
                            pendingCenterStoneWeightRange[1],
                          ]);
                        }}
                        className="input-field"
                        placeholder="Min"
                      />
                    </div>

                    <span className="text-[#64748B]">{'>'}</span>

                    <div className="flex-1">
                      <input
                        type="number"
                        step="0.01"
                        value={pendingCenterStoneWeightRange[1] || ''}
                        onChange={(e) => {
                          setPendingCenterStoneWeightRange([
                            pendingCenterStoneWeightRange[0],
                            Number(e.target.value) || 0,
                          ]);
                        }}
                        className="input-field"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shape */}
            <div>
              <button
                onClick={() => toggleSection("shape")}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="font-semibold text-[#0F172A]">Diamond Shape</h3>
                <ChevronDown
                  className={`h-4 w-4 text-[#64748B] transition-transform ${expandedSections.shape ? "" : "-rotate-90"
                    }`}
                />
              </button>

              {expandedSections.shape && (
                <div className="mt-4" key="shape-type-grid">
                  <div className="grid grid-cols-4 gap-2">
                    {shapeTypes.slice(0, shapeDisplayCount).map((shape) => {
                      const isSelected = pendingShapes.includes(shape.id);
                      return (
                        <button
                          key={`shape-${shape.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleShape(shape.id);
                          }}
                          className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-all ${isSelected
                            ? 'bg-[#DBEAFE] ring-1 ring-[#1E3A8A]'
                            : 'hover:bg-[#F1F5F9]'
                            }`}
                        >
                          <img
                            src={shape.icon}
                            alt={shape.label}
                            className="h-8 w-8 object-contain"
                          />
                          <span className={`text-[10px] uppercase ${isSelected ? 'text-[#1E3A8A] font-medium' : 'text-[#475569]'}`}>
                            {shape.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {shapeDisplayCount < shapeTypes.length && (
                    <button
                      onClick={() => setShapeDisplayCount(shapeDisplayCount === 8 ? 16 : shapeTypes.length)}
                      className="mt-3 flex w-full items-center justify-center gap-1 text-sm text-[#1E3A8A] hover:text-[#1E40AF]"
                    >
                      <span>More shape</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Apply & Clear Buttons */}
          {(hasUnsavedChanges || activeFiltersCount > 0) && (
            <div className="border-t border-[#E2E8F0] bg-white p-4 space-y-3">
              {hasUnsavedChanges && (
                <button
                  onClick={applyFilters}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] py-3 text-sm font-medium text-white transition-all hover:bg-[#1E40AF] active:scale-95"
                >
                  <Filter className="h-4 w-4" />
                  Apply Filters
                </button>
              )}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-3 text-sm font-medium text-[#475569] transition-all hover:border-[#64748B] hover:text-[#0F172A] active:scale-95"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 flex h-full w-[85vw] max-w-sm flex-col bg-white md:hidden"
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] p-3 sm:p-4">
                <div>
                  <h2 className="text-sm font-semibold text-[#0F172A]">
                    Filters
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {filteredItems.length} items
                  </p>
                </div>

                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-full p-2 hover:bg-[#F1F5F9]"
                >
                  <X className="h-5 w-5 text-[#64748B]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                {/* Mobile Categories */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="mb-2 sm:mb-3 font-semibold text-[#0F172A] text-sm">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${pendingCategory === category.id
                          ? "bg-[#DBEAFE] text-[#1E3A8A]"
                          : "text-[#475569] hover:bg-[#F1F5F9]"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          {category.label}
                        </span>
                        <span className="text-xs text-[#64748B]">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Total Price */}
                <div className="mb-4 sm:mb-6">
                  <button
                    onClick={() => toggleSection("price")}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-[#0F172A]">Total Price</h3>
                    <ChevronDown
                      className={`h-4 w-4 text-[#64748B] transition-transform ${expandedSections.price ? "" : "-rotate-90"
                        }`}
                    />
                  </button>

                  {expandedSections.price && (
                    <div className="mt-3" key="mobile-total-price">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <input
                            type="number"
                            value={pendingPriceRange[0] || ''}
                            onChange={(e) => {
                              setPendingPriceRange([
                                Number(e.target.value) || 0,
                                pendingPriceRange[1],
                              ]);
                            }}
                            className="input-field"
                            placeholder="Min, $"
                          />
                        </div>
                        <span className="text-[#64748B]">{'>'}</span>
                        <div className="flex-1">
                          <input
                            type="number"
                            value={pendingPriceRange[1] || ''}
                            onChange={(e) => {
                              setPendingPriceRange([
                                pendingPriceRange[0],
                                Number(e.target.value) || 0,
                              ]);
                            }}
                            className="input-field"
                            placeholder="Max, $"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile  Stone Weight */}
                <div className="mb-4 sm:mb-6">
                  <button
                    onClick={() => toggleSection("carat")}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-[#0F172A]">Stone Weight</h3>
                    <ChevronDown
                      className={`h-4 w-4 text-[#64748B] transition-transform ${expandedSections.carat ? "" : "-rotate-90"
                        }`}
                    />
                  </button>

                  {expandedSections.carat && (
                    <div className="mt-3" key="mobile-center-stone-weight">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <input
                            type="number"
                            step="0.01"
                            value={pendingCenterStoneWeightRange[0] || ''}
                            onChange={(e) => {
                              setPendingCenterStoneWeightRange([
                                Number(e.target.value) || 0,
                                pendingCenterStoneWeightRange[1],
                              ]);
                            }}
                            className="input-field"
                            placeholder="Min"
                          />
                        </div>
                        <span className="text-[#64748B]">{'>'}</span>
                        <div className="flex-1">
                          <input
                            type="number"
                            step="0.01"
                            value={pendingCenterStoneWeightRange[1] || ''}
                            onChange={(e) => {
                              setPendingCenterStoneWeightRange([
                                pendingCenterStoneWeightRange[0],
                                Number(e.target.value) || 0,
                              ]);
                            }}
                            className="input-field"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Metal Type */}
                <div className="mb-4 sm:mb-6" key="mobile-metal-type">
                  <h3 className="mb-2 sm:mb-3 font-semibold text-[#0F172A] text-sm">
                    Metal Type
                  </h3>
                  <div className="space-y-2">
                    {metalTypes.map((metal) => {
                      const isSelected = pendingMetals.includes(metal.id);
                      return (
                        <div
                          key={`mobile-metal-${metal.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMetal(metal.id);
                          }}
                          className="flex cursor-pointer items-center gap-3"
                        >
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded border ${isSelected
                              ? 'border-[#1E3A8A] bg-[#1E3A8A]'
                              : 'border-[#E2E8F0] bg-white'
                              }`}
                          >
                            {isSelected && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span
                            className="h-4 w-4 rounded-full border border-gray-200"
                            style={{ background: metal.color }}
                          />
                          <span className="text-sm text-[#475569]">
                            {metal.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Shape */}
                <div className="mb-4 sm:mb-6" key="mobile-shape-type">
                  <h3 className="mb-2 sm:mb-3 font-semibold text-[#0F172A] text-sm">
                    Shape
                  </h3>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {shapeTypes.slice(0, shapeDisplayCount).map((shape) => {
                      const isSelected = pendingShapes.includes(shape.id);
                      return (
                        <button
                          key={`mobile-shape-${shape.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleShape(shape.id);
                          }}
                          className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-all ${isSelected
                            ? 'bg-[#DBEAFE] ring-1 ring-[#1E3A8A]'
                            : 'hover:bg-[#F1F5F9]'
                            }`}
                        >
                          <img
                            src={shape.icon}
                            alt={shape.label}
                            className="h-8 w-8 object-contain"
                          />
                          <span className={`text-[10px] uppercase ${isSelected ? 'text-[#1E3A8A] font-medium' : 'text-[#475569]'}`}>
                            {shape.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {shapeDisplayCount < shapeTypes.length && (
                    <button
                      onClick={() => setShapeDisplayCount(shapeDisplayCount === 8 ? 16 : shapeTypes.length)}
                      className="mt-3 flex w-full items-center justify-center gap-1 text-sm text-[#1E3A8A] hover:text-[#1E40AF]"
                    >
                      <span>More shape</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Footer Buttons */}
              <div className="border-t border-[#E2E8F0] p-3 sm:p-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="flex-1 rounded-lg border border-[#E2E8F0] py-3 text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => {
                      applyFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="flex-1 rounded-lg bg-[#1E3A8A] py-3 text-sm font-medium text-white hover:bg-[#1E40AF] transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  ), [
    expandedSections, toggleSection, categories, pendingCategory, handleCategorySelect,
    pendingPriceRange, pendingCenterStoneWeightRange, pendingMetals, metalTypes, toggleMetal,
    pendingShapes, shapeTypes, shapeDisplayCount, toggleShape, hasUnsavedChanges,
    activeFiltersCount, applyFilters, clearAllFilters, mobileFiltersOpen, setMobileFiltersOpen,
    filteredItems.length
  ]);

  // Main render - if children is a function, call it with filter data
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
      {filterContent}
      <div className="flex-1 min-w-0">
        {typeof children === 'function'
          ? children({
            filteredItems,
            filteredItemsCount: filteredItems.length,
            activeCategory,
            priceRange,
            centerStoneWeightRange,
            selectedMetals,
            selectedShapes,
            searchQuery,
            sortBy,
            setSearchQuery,
            setSortBy,
            clearAllFilters,
            activeFiltersCount,
            appliedFilters,
            categories,
            metalTypes,
            shapeTypes,
            renderFilterBadge,
            setActiveCategory,
            setSelectedShapes,
            setPriceRange,
            setCenterStoneWeightRange,
            toggleMetal: (metalId) => {
              setSelectedMetals((prev) =>
                prev.includes(metalId)
                  ? prev.filter((id) => id !== metalId)
                  : [...prev, metalId]
              );
            },
            toggleShape: (shapeId) => {
              setSelectedShapes((prev) =>
                prev.includes(shapeId)
                  ? prev.filter((id) => id !== shapeId)
                  : [...prev, shapeId]
              );
            },
          })
          : children}
      </div>
    </div>
  );
};

export default JewelryFilters;
