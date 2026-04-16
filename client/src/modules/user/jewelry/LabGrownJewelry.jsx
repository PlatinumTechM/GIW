import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Diamond,
  Sparkles,
  Star,
  Gem,
  Crown,
  Filter,
  X,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import JewelryGrid from "./JewelryGrid";
import Input from "../../../components/ui/Input";
import JewelryFilters from "./JewelryFilters";

const LabGrownJewelry = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedMetals, setSelectedMetals] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subcategory: false,
    price: true,
    carat: false,
    gender: false,
    metal: true,
    shape: false,
    theme: false,
  });

  const [activeTab, setActiveTab] = useState("single");
  const [showWithMedia, setShowWithMedia] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [caratRange, setCaratRange] = useState({ min: "", max: "" });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedCaratRange, setSelectedCaratRange] = useState(null);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [tempCategory, setTempCategory] = useState("all");
  const [tempPriceRange, setTempPriceRange] = useState([0, 50000]);
  const [tempMetals, setTempMetals] = useState([]);

  const itemsPerPage = 9;

  const shapes = [
    { id: "round", label: "Round" },
    { id: "oval", label: "Oval" },
    { id: "pear", label: "Pear" },
    { id: "cushmod", label: "Cushion" },
    { id: "emerald", label: "Emerald" },
    { id: "radiant", label: "Radiant" },
    { id: "princess", label: "Princess" },
    { id: "marquise", label: "Marquise" },
    { id: "heart", label: "Heart" },
    { id: "asscher", label: "Asscher" },
    { id: "baguette", label: "Baguette" },
    { id: "trillion", label: "Trillion" },
  ];

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

  const jewelryItems = [
    {
      id: 1,
      name: "Royal Diamond Ring",
      category: "rings",
      price: 8200,
      priceDisplay: "$8,200",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
      badge: "Lab-Created",
      rating: 4.9,
      description: "18K White Gold with VS1 Lab-Grown Diamond",
      metal: "white-gold",
    },
    {
      id: 2,
      name: "Eternal Love Necklace",
      category: "necklaces",
      price: 5600,
      priceDisplay: "$5,600",
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.8,
      description: "Platinum with Heart-shaped Lab-Grown Diamond",
      metal: "platinum",
    },
    {
      id: 3,
      name: "Celestial Earrings",
      category: "earrings",
      price: 3400,
      priceDisplay: "$3,400",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
      badge: "Popular",
      rating: 4.7,
      description: "Rose Gold with Lab-Grown Cluster Diamonds",
      metal: "rose-gold",
    },
    {
      id: 4,
      name: "Golden Era Bracelet",
      category: "bracelets",
      price: 9800,
      priceDisplay: "$9,800",
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
      badge: "Premium",
      rating: 5.0,
      description: "22K Yellow Gold with Lab-Grown Baguette Diamonds",
      metal: "yellow-gold",
    },
    {
      id: 5,
      name: "Sapphire Dream Ring",
      category: "rings",
      price: 6200,
      priceDisplay: "$6,200",
      image:
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop",
      badge: null,
      rating: 4.6,
      description: "White Gold with Lab-Grown Sapphire & Diamonds",
      metal: "white-gold",
    },
    {
      id: 6,
      name: "Pearl Majesty Necklace",
      category: "necklaces",
      price: 4200,
      priceDisplay: "$4,200",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop",
      badge: "Rare",
      rating: 4.9,
      description: "Lab-Grown Emeralds with Diamond Halo",
      metal: "yellow-gold",
    },
    {
      id: 8,
      name: "Infinity Diamond Bracelet",
      category: "bracelets",
      price: 4800,
      priceDisplay: "$4,800",
      image:
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop",
      badge: "Trending",
      rating: 4.7,
      description: "White Gold with Lab-Grown Tennis Diamond Setting",
      metal: "white-gold",
    },
    {
      id: 9,
      name: "Rose Gold Eternity Ring",
      category: "rings",
      price: 2800,
      priceDisplay: "$2,800",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
      badge: "Sale",
      rating: 4.8,
      description: "14K Rose Gold with Lab-Grown Pavé Diamonds",
      metal: "rose-gold",
    },
    {
      id: 10,
      name: "Diamond Halo Pendant",
      category: "necklaces",
      price: 2200,
      priceDisplay: "$2,200",
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
      badge: null,
      rating: 4.5,
      description: "Yellow Gold with Lab-Grown Diamond Halo",
      metal: "yellow-gold",
    },
    {
      id: 11,
      name: "Platinum Stud Earrings",
      category: "earrings",
      price: 1800,
      priceDisplay: "$1,800",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
      badge: "Certified",
      rating: 4.9,
      description: "Platinum with Lab-Grown Solitaire Diamonds",
      metal: "platinum",
    },
    {
      id: 12,
      name: "Yellow Gold Chain Bracelet",
      category: "bracelets",
      price: 1200,
      priceDisplay: "$1,200",
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.6,
      description: "18K Yellow Gold Chain Link",
      metal: "yellow-gold",
    },
  ];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleMetal = (metalId) => {
    setTempMetals((prev) =>
      prev.includes(metalId)
        ? prev.filter((id) => id !== metalId)
        : [...prev, metalId]
    );
  };

  const toggleShape = (shapeId) => {
    setSelectedShapes((prev) =>
      prev.includes(shapeId)
        ? prev.filter((id) => id !== shapeId)
        : [...prev, shapeId]
    );
  };

  const clearAllFilters = () => {
    setActiveCategory("all");
    setPriceRange([0, 50000]);
    setSelectedMetals([]);
    setTempCategory("all");
    setTempPriceRange([0, 50000]);
    setTempMetals([]);
    setSortBy("featured");
    setActiveTab("single");
    setShowWithMedia(false);
    setShowAvailable(false);
    setSelectedShapes([]);
    setCaratRange({ min: "", max: "" });
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSelectedGender("all");
    setSelectedPriceRange(null);
    setSelectedCaratRange(null);
    setSelectedThemes([]);
    setSearchQuery("");
  };

  const applyFilters = () => {
    setActiveCategory(tempCategory);
    setPriceRange(tempPriceRange);
    setSelectedMetals(tempMetals);
  };

  const imageStyleFiltersCount =
    selectedShapes.length +
    (showWithMedia ? 1 : 0) +
    (showAvailable ? 1 : 0) +
    (caratRange.min || caratRange.max ? 1 : 0);

  const activeFiltersCount =
    (activeCategory !== "all" ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0) +
    selectedMetals.length +
    imageStyleFiltersCount +
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedSubcategory !== "all" ? 1 : 0) +
    (selectedGender !== "all" ? 1 : 0) +
    (selectedPriceRange ? 1 : 0) +
    (selectedCaratRange ? 1 : 0) +
    selectedThemes.length;

  let filteredItems = jewelryItems.filter((item) => {
    const categoryMatch =
      activeCategory === "all" || item.category === activeCategory;
    const priceMatch =
      item.price >= priceRange[0] && item.price <= priceRange[1];
    const metalMatch =
      selectedMetals.length === 0 || selectedMetals.includes(item.metal);
    const searchMatch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && priceMatch && metalMatch && searchMatch;
  });

  filteredItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#FAFBFC]"
    >
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
                <span className="text-[#1E3A8A]">Lab-Grown Jewelry</span>
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="text-2xl font-bold text-[#0F172A]"
              >
                Lab-Grown Jewelry Collection
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-sm text-[#64748B]">
                {filteredItems.length} products • GIA Certified • Premium Quality
              </motion.p>
            </div>
            <Link
              to="/jewelry"
              className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
            >
              <Diamond className="h-4 w-4" />
              <span className="text-xs sm:text-sm">View Jewelry</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white py-3 backdrop-blur-xl w-full shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-[#64748B]">
                {filteredItems.length} Results
              </span>

              {activeFiltersCount > 0 && (
                <>
                  <span className="text-sm text-[#64748B]">•</span>
                  <span className="text-sm text-[#64748B]">Active:</span>

                  {activeCategory !== "all" && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      {categories.find((c) => c.id === activeCategory)?.label}
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

                  {selectedMetals.map((metalId) => {
                    const metal = metalTypes.find((m) => m.id === metalId);
                    return (
                      <span
                        key={metalId}
                        className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                      >
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

                  {searchQuery && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      Search: {searchQuery}
                      <button onClick={() => setSearchQuery("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

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

            <div className="flex items-center gap-3">
              <Input
                type="text"
                placeholder="Search lab-grown jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4 text-[#64748B]" />}
                className="w-48 sm:w-64 bg-white rounded-lg"
              />

              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A] lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-8">
            <JewelryFilters
              tempCategory={tempCategory}
              setTempCategory={setTempCategory}
              tempPriceRange={tempPriceRange}
              setTempPriceRange={setTempPriceRange}
              tempMetals={tempMetals}
              toggleMetal={toggleMetal}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              applyFilters={applyFilters}
              clearAllFilters={clearAllFilters}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              categories={categories}
              metalTypes={metalTypes}
              filteredItemsCount={filteredItems.length}
              isLabGrown={true}
            />

            <div className="flex-1">
              <JewelryGrid
                items={filteredItems}
                itemsPerPage={itemsPerPage}
                showSearch={false}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                type="lab-grown"
                onItemClick={(item) => navigate(`/user/jewelry/lab-grown/${item.id}`)}
                onAddToCart={(item) => console.log("Add to cart:", item.name)}
                onAddToWishlist={(item) =>
                  console.log("Add to wishlist:", item.name)
                }
                onQuickView={(item) => console.log("Quick view:", item.name)}
              />

              {filteredItems.length === 0 && (
                <div className="py-20 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F5F9]">
                    <Filter className="h-8 w-8 text-[#64748B]" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">
                    No products found
                  </h3>
                  <p className="mb-4 text-sm text-[#64748B]">
                    Try adjusting your filters to see more results.
                  </p>
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

    </motion.div>
  );
};

export default LabGrownJewelry;