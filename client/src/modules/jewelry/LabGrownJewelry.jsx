import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Diamond,
  Sparkles,
  Heart,
  ShoppingBag,
  Star,
  Gem,
  Crown,
  ArrowUpRight,
  Filter,
  Eye,
  Leaf,
  FlaskConical,
  ChevronDown,
  X,
  SlidersHorizontal,
  RefreshCw,
  Search,
} from "lucide-react";

const Jewelry = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedMetals, setSelectedMetals] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    metal: true,
  });

  // New filter states - Image style
  const [activeTab, setActiveTab] = useState("single");
  const [showWithMedia, setShowWithMedia] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [caratRange, setCaratRange] = useState({ min: "", max: "" });
  const [leftFilterOpen, setLeftFilterOpen] = useState(false);

  const tabs = [
    { id: "single", label: "Single Stone" },
    { id: "pair", label: "Pair" },
    { id: "parcel", label: "Parcel" },
  ];

  // Shape data with jewelry images
  const shapes = [
    { id: "round", label: "Round", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop" },
    { id: "oval", label: "Oval", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop" },
    { id: "pear", label: "Pear", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop" },
    { id: "cushmod", label: "Cushion", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100&h=100&fit=crop" },
    { id: "emerald", label: "Emerald", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=100&h=100&fit=crop" },
    { id: "radiant", label: "Radiant", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop" },
    { id: "princess", label: "Princess", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=100&h=100&fit=crop" },
    { id: "marquise", label: "Marquise", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=100&h=100&fit=crop" },
    { id: "heart", label: "Heart", image: "https://images.unsplash.com/photo-1599643477877-5303c0c3f596?w=100&h=100&fit=crop" },
    { id: "asscher", label: "Asscher", image: "https://images.unsplash.com/photo-1602751584552-8ba420552259?w=100&h=100&fit=crop" },
    { id: "baguette", label: "Baguette", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=100&h=100&fit=crop" },
    { id: "trillion", label: "Trillion", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=100&h=100&fit=crop" },
  ];

  const toggleShape = (shapeId) => {
    setSelectedShapes(prev =>
      prev.includes(shapeId)
        ? prev.filter(id => id !== shapeId)
        : [...prev, shapeId]
    );
  };

  const handleRefresh = () => {
    setActiveTab("single");
    setShowWithMedia(false);
    setShowAvailable(false);
    setSelectedShapes([]);
    setCaratRange({ min: "", max: "" });
    setPriceRange([0, 50000]);
    setSelectedMetals([]);
    setActiveCategory("all");
    setSortBy("featured");
  };

  const imageStyleFiltersCount = selectedShapes.length + (showWithMedia ? 1 : 0) + (showAvailable ? 1 : 0) + (caratRange.min || caratRange.max ? 1 : 0);

  const categories = [
    { id: "all", label: "All Jewelry", icon: Diamond, count: 24 },
    { id: "rings", label: "Rings", icon: Sparkles, count: 8 },
    { id: "necklaces", label: "Necklaces", icon: Crown, count: 6 },
    { id: "earrings", label: "Earrings", icon: Gem, count: 5 },
    { id: "bracelets", label: "Bracelets", icon: Star, count: 5 },
  ];

  const metalTypes = [
    { id: "yellow-gold", label: "Yellow Gold", color: "#FFD700" },
    { id: "white-gold", label: "White Gold", color: "#E8E8E8" },
    { id: "rose-gold", label: "Rose Gold", color: "#E8B4B4" },
    { id: "platinum", label: "Platinum", color: "#C0C0C0" },
  ];

  const sortOptions = [
    { id: "featured", label: "Featured" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "newest", label: "Newest First" },
    { id: "rating", label: "Best Rated" },
  ];

  const jewelryItems = [
    {
      id: 1,
      name: "Royal Diamond Ring",
      category: "rings",
      price: 8200,
      priceDisplay: "$8,200",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
      badge: "Eco-Friendly",
      rating: 4.9,
      description: "18K White Gold with VS1 Natural Diamond",
      metal: "white-gold",
    },
    {
      id: 2,
      name: "Eternal Love Necklace",
      category: "necklaces",
      price: 5600,
      priceDisplay: "$5,600",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.8,
      description: "Platinum with Heart-shaped Natural Diamond",
      metal: "platinum",
    },
    {
      id: 3,
      name: "Celestial Earrings",
      category: "earrings",
      price: 3400,
      priceDisplay: "$3,400",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
      badge: "Popular",
      rating: 4.7,
      description: "Rose Gold with Natural Cluster Diamonds",
      metal: "rose-gold",
    },
    {
      id: 4,
      name: "Golden Era Bracelet",
      category: "bracelets",
      price: 9800,
      priceDisplay: "$9,800",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
      badge: "Premium",
      rating: 5.0,
      description: "22K Yellow Gold with Natural Baguette Diamonds",
      metal: "yellow-gold",
    },
    {
      id: 5,
      name: "Sapphire Dream Ring",
      category: "rings",
      price: 6200,
      priceDisplay: "$6,200",
      image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop",
      badge: null,
      rating: 4.6,
      description: "White Gold with Natural Sapphire & Diamonds",
      metal: "white-gold",
    },
    {
      id: 6,
      name: "Pearl Majesty Necklace",
      category: "necklaces",
      price: 4200,
      priceDisplay: "$4,200",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
      badge: "Classic",
      rating: 4.8,
      description: "Lab Pearls with Diamond Clasp",
      metal: "white-gold",
    },
    {
      id: 7,
      name: "Emerald Drop Earrings",
      category: "earrings",
      price: 7200,
      priceDisplay: "$7,200",
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop",
      badge: "Rare",
      rating: 4.9,
      description: "Natural Emeralds with Diamond Halo",
      metal: "yellow-gold",
    },
    {
      id: 8,
      name: "Infinity Diamond Bracelet",
      price: 4800,
      priceDisplay: "$4,800",
      category: "bracelets",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop",
      badge: "Trending",
      rating: 4.7,
      description: "White Gold with Natural Tennis Diamond Setting",
      metal: "white-gold",
    },
    {
      id: 9,
      name: "Rose Gold Eternity Ring",
      category: "rings",
      price: 2800,
      priceDisplay: "$2,800",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
      badge: "Sale",
      rating: 4.8,
      description: "14K Rose Gold with Natural Pavé Diamonds",
      metal: "rose-gold",
    },
    {
      id: 10,
      name: "Diamond Halo Pendant",
      category: "necklaces",
      price: 2200,
      priceDisplay: "$2,200",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
      badge: null,
      rating: 4.5,
      description: "Yellow Gold with Natural Diamond Halo",
      metal: "yellow-gold",
    },
    {
      id: 11,
      name: "Platinum Stud Earrings",
      category: "earrings",
      price: 1800,
      priceDisplay: "$1,800",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
      badge: "Certified",
      rating: 4.9,
      description: "Platinum with Natural Solitaire Diamonds",
      metal: "platinum",
    },
    {
      id: 12,
      name: "Yellow Gold Chain Bracelet",
      category: "bracelets",
      price: 1200,
      priceDisplay: "$1,200",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.6,
      description: "18K Yellow Gold Chain Link",
      metal: "yellow-gold",
    },
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleMetal = (metalId) => {
    setSelectedMetals(prev =>
      prev.includes(metalId)
        ? prev.filter(id => id !== metalId)
        : [...prev, metalId]
    );
  };

  const clearAllFilters = () => {
    setActiveCategory("all");
    setPriceRange([0, 50000]);
    setSelectedMetals([]);
    setSortBy("featured");
    setActiveTab("single");
    setShowWithMedia(false);
    setShowAvailable(false);
    setSelectedShapes([]);
    setCaratRange({ min: "", max: "" });
  };

  const activeFiltersCount =
    (activeCategory !== "all" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0) +
    selectedMetals.length +
    imageStyleFiltersCount;

  let filteredItems = jewelryItems.filter(item => {
    const categoryMatch = activeCategory === "all" || item.category === activeCategory;
    const priceMatch = item.price >= priceRange[0] && item.price <= priceRange[1];
    const metalMatch = selectedMetals.length === 0 || selectedMetals.includes(item.metal);
    return categoryMatch && priceMatch && metalMatch;
  });

  // Sort items
  filteredItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "newest": return b.id - a.id;
      default: return 0;
    }
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

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
              <motion.div variants={fadeInUp} className="mb-2 flex items-center gap-2 text-sm text-[#64748B]">
                <Link to="/" className="hover:text-[#1E3A8A]">Home</Link>
                <span>/</span>
                <span className="text-[#1E3A8A]">Natural Diamond Jewelry</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-2xl font-bold text-[#0F172A]">
                Natural Diamond Collection
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-sm text-[#64748B]">
                {filteredItems.length} products • GIA Certified • Premium Quality
              </motion.p>
            </div>
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <Link
                to="/lab-grown-jewelry"
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
              >
                <FlaskConical className="h-4 w-4" />
                View Lab-Grown
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Top Filter Bar */}
      <section className="sticky top-20 z-30 border-b border-[#E2E8F0] bg-white py-3 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#64748B]">{filteredItems.length} Results</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Search natural diamonds..."
                  className="w-48 rounded-lg border border-[#E2E8F0] bg-white py-2 pl-10 pr-4 text-sm transition-all focus:border-[#1E3A8A] focus:outline-none sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Active Filters Chips */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#E2E8F0] pt-3">
              <span className="text-sm text-[#64748B]">Active:</span>
              {activeCategory !== "all" && (
                <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                  {categories.find(c => c.id === activeCategory)?.label}
                  <button onClick={() => setActiveCategory("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedShapes.map((shapeId) => {
                const shape = shapes.find((s) => s.id === shapeId);
                return (
                  <span
                    key={shapeId}
                    className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                  >
                    {shape?.label}
                    <button onClick={() => toggleShape(shapeId)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              {selectedMetals.map(metalId => {
                const metal = metalTypes.find(m => m.id === metalId);
                return (
                  <span key={metalId} className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                    {metal?.label}
                    <button onClick={() => toggleMetal(metalId)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              {showWithMedia && (
                <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                  With Media
                  <button onClick={() => setShowWithMedia(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {showAvailable && (
                <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                  Available
                  <button onClick={() => setShowAvailable(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(caratRange.min || caratRange.max) && (
                <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                  {caratRange.min || "0"} - {caratRange.max || "∞"} ct
                  <button onClick={() => setCaratRange({ min: "", max: "" })}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="ml-2 flex items-center gap-1 text-xs font-medium text-[#64748B] underline hover:text-[#1E3A8A]"
              >
                <RefreshCw className="h-3 w-3" />
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden w-64 flex-shrink-0 lg:block">
              <div className="sticky top-40 space-y-6">
                {/* Categories */}
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                  <button
                    onClick={() => toggleSection("category")}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-[#0F172A]">Categories</h3>
                    <ChevronDown className={`h-4 w-4 text-[#64748B] transition-transform ${expandedSections.category ? "" : "-rotate-90"}`} />
                  </button>
                  {expandedSections.category && (
                    <div className="mt-4 space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                            activeCategory === category.id
                              ? "bg-[#DBEAFE] text-[#1E3A8A]"
                              : "text-[#475569] hover:bg-[#F1F5F9]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <category.icon className="h-4 w-4" />
                            {category.label}
                          </span>
                          <span className="text-xs text-[#64748B]">{category.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                  <button
                    onClick={() => toggleSection("price")}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-[#0F172A]">Price Range</h3>
                    <ChevronDown className={`h-4 w-4 text-[#64748B] transition-transform ${expandedSections.price ? "" : "-rotate-90"}`} />
                  </button>
                  {expandedSections.price && (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                          placeholder="Min"
                        />
                        <span className="text-[#64748B]">-</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                          placeholder="Max"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full accent-[#1E3A8A]"
                      />
                      <div className="flex justify-between text-xs text-[#64748B]">
                        <span>${priceRange[0].toLocaleString()}</span>
                        <span>${priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metal Type */}
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                  <button
                    onClick={() => toggleSection("metal")}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-[#0F172A]">Metal Type</h3>
                    <ChevronDown className={`h-4 w-4 text-[#64748B] transition-transform ${expandedSections.metal ? "" : "-rotate-90"}`} />
                  </button>
                  {expandedSections.metal && (
                    <div className="mt-4 space-y-2">
                      {metalTypes.map((metal) => (
                        <label
                          key={metal.id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-[#F1F5F9]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMetals.includes(metal.id)}
                            onChange={() => toggleMetal(metal.id)}
                            className="h-4 w-4 rounded border-[#E2E8F0] text-[#1E3A8A] focus:ring-[#1E3A8A]"
                          />
                          <span
                            className="h-4 w-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: metal.color }}
                          />
                          <span className="text-sm text-[#475569]">{metal.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

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

            {/* Product Grid */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${sortBy}-${priceRange}-${selectedMetals.join(",")}`}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                  variants={staggerContainer}
                  className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      variants={scaleIn}
                      custom={index}
                      onHoverStart={() => setHoveredItem(item.id)}
                      onHoverEnd={() => setHoveredItem(null)}
                      className="group relative"
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(30,58,138,0.15)]">
                        {/* Image Container */}
                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]">
                          <motion.img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            animate={{
                              scale: hoveredItem === item.id ? 1.1 : 1,
                            }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          />

                          {/* Badge */}
                          {item.badge && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg ${
                                item.badge === "Sale" ? "bg-red-500" : "bg-[#1E3A8A]"
                              }`}
                            >
                              {item.badge}
                            </motion.div>
                          )}

                          {/* Hover Overlay */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#0F172A]/60 via-[#0F172A]/20 to-transparent"
                          >
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{
                                y: hoveredItem === item.id ? 0 : 20,
                                opacity: hoveredItem === item.id ? 1 : 0,
                              }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="flex gap-3"
                            >
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1E3A8A] shadow-lg transition-all hover:bg-[#1E3A8A] hover:text-white"
                              >
                                <Eye className="h-5 w-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1E3A8A] shadow-lg transition-all hover:bg-[#1E3A8A] hover:text-white"
                              >
                                <Heart className="h-5 w-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E3A8A] text-white shadow-lg transition-all hover:bg-[#1E40AF]"
                              >
                                <ShoppingBag className="h-5 w-5" />
                              </motion.button>
                            </motion.div>
                          </motion.div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
                              {item.category}
                            </span>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="text-sm font-medium text-[#0F172A]">{item.rating}</span>
                            </div>
                          </div>
                          <h3 className="mb-1 text-lg font-semibold text-[#0F172A] transition-colors group-hover:text-[#1E3A8A]">
                            {item.name}
                          </h3>
                          <p className="mb-3 text-sm text-[#64748B]">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-[#1E3A8A]">{item.priceDisplay}</span>
                            <motion.button
                              whileHover={{ x: 3 }}
                              className="flex items-center gap-1 text-sm font-medium text-[#1E3A8A] opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              View Details
                              <ArrowUpRight className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {filteredItems.length === 0 && (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F5F9]">
                    <Filter className="h-8 w-8 text-[#64748B]" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">No products found</h3>
                  <p className="mb-4 text-sm text-[#64748B]">Try adjusting your filters to see more results.</p>
                  <button
                    onClick={clearAllFilters}
                    className="rounded-lg bg-[#1E3A8A] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#1E40AF]"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto bg-white p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#0F172A]">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-full p-2 hover:bg-[#F1F5F9]"
                >
                  <X className="h-5 w-5 text-[#64748B]" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-[#0F172A]">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                        activeCategory === category.id
                          ? "bg-[#DBEAFE] text-[#1E3A8A]"
                          : "text-[#475569] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
                        {category.label}
                      </span>
                      <span className="text-xs text-[#64748B]">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-[#0F172A]">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                    />
                    <span className="text-[#64748B]">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Metal */}
              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-[#0F172A]">Metal Type</h3>
                <div className="space-y-2">
                  {metalTypes.map((metal) => (
                    <label key={metal.id} className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedMetals.includes(metal.id)}
                        onChange={() => toggleMetal(metal.id)}
                        className="h-4 w-4 rounded border-[#E2E8F0] text-[#1E3A8A]"
                      />
                      <span
                        className="h-4 w-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: metal.color }}
                      />
                      <span className="text-sm text-[#475569]">{metal.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 rounded-lg border border-[#E2E8F0] py-3 text-sm font-medium text-[#475569]"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 rounded-lg bg-[#1E3A8A] py-3 text-sm font-medium text-white"
                >
                  Show {filteredItems.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Jewelry;
