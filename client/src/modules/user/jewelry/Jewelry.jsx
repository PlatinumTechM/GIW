import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Diamond,
  Sparkles,
  Star,
  Gem,
  Crown,
  Filter,
  FlaskConical,
  ChevronDown,
  X,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import JewelryGrid from "./JewelryGrid";
import Input from "../../../components/ui/Input";

const Jewelry = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedMetals, setSelectedMetals] = useState([]);
  const [sortBy] = useState("featured");
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

  const itemsPerPage = 9;

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
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop",
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
      description: "Natural Emeralds with Diamond Halo",
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
      description: "White Gold with Natural Tennis Diamond Setting",
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
      description: "14K Rose Gold with Natural Pavé Diamonds",
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
      description: "Yellow Gold with Natural Diamond Halo",
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
      description: "Platinum with Natural Solitaire Diamonds",
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
    setSelectedMetals((prev) =>
      prev.includes(metalId)
        ? prev.filter((id) => id !== metalId)
        : [...prev, metalId]
    );
  };

  const clearAllFilters = () => {
    setActiveCategory("all");
    setPriceRange([0, 50000]);
    setSelectedMetals([]);
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

    return categoryMatch && priceMatch && metalMatch;
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
                <span className="text-[#1E3A8A]">Natural Jewelry</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-2xl font-bold text-[#0F172A]"
              >
                Natural Jewelry Collection
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-sm text-[#64748B]">
                {filteredItems.length} products • GIA Certified • Premium Quality
              </motion.p>


            </div>
            <Link
              to="/lab-grown-jewelry"
              className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
            >
              <FlaskConical className="h-4 w-4" />
              <span className="text-xs sm:text-sm">View Lab-Grown</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-0 z-30 w-full border-b border-[#E2E8F0] bg-white py-3 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A] lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>

            <div className="flex items-center gap-3">


              <Input
                type="text"
                placeholder="Search natural jewelry..."
                icon={<Search className="h-4 w-4 text-[#64748B]" />}
                className="w-48 rounded-lg bg-white sm:w-64"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-8">
            <aside className="hidden w-64 flex-shrink-0 lg:block">
              <div className="sticky top-[120px] max-h-[calc(100vh-140px)] space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                  <button
                    onClick={() => toggleSection("category")}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-[#0F172A]">Categories</h3>
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
                          onClick={() => setActiveCategory(category.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${activeCategory === category.id
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

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                  <button
                    onClick={() => toggleSection("price")}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <h3 className="font-semibold text-[#0F172A]">Price Range</h3>
                    <ChevronDown
                      className={`h-4 w-4 text-[#64748B] transition-transform ${expandedSections.price ? "" : "-rotate-90"
                        }`}
                    />
                  </button>

                  {expandedSections.price && (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) =>
                              setPriceRange([
                                Number(e.target.value),
                                priceRange[1],
                              ])
                            }
                            icon={<span className="text-[#64748B]">$</span>}
                            className="rounded-lg py-2.5"
                            placeholder="Min"
                          />
                        </div>

                        <span className="text-[#64748B]">-</span>

                        <div className="flex-1">
                          <Input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) =>
                              setPriceRange([
                                priceRange[0],
                                Number(e.target.value),
                              ])
                            }
                            icon={<span className="text-[#64748B]">$</span>}
                            className="rounded-lg py-2.5"
                            placeholder="Max"
                          />
                        </div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="1000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Number(e.target.value)])
                        }
                        className="w-full accent-[#1E3A8A]"
                      />

                      <div className="flex justify-between text-xs text-[#64748B]">
                        <span>${priceRange[0].toLocaleString()}</span>
                        <span>${priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
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
                    <div className="mt-4 space-y-2">
                      {metalTypes.map((metal) => (
                        <label
                          key={metal.id}
                          className="flex cursor-pointer items-center gap-3"
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
                          <span className="text-sm text-[#475569]">
                            {metal.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

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

            <div className="flex-1">
              <JewelryGrid
                items={filteredItems}
                itemsPerPage={itemsPerPage}
                showSearch={false}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                type="natural"
                onItemClick={(item) => navigate(`/jewelry/natural/${item.id}`)}
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
              className="fixed left-0 top-0 z-50 flex h-full w-80 flex-col bg-white lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg">
                    <img
                      src={
                        filteredItems[0]?.image ||
                        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop"
                      }
                      alt="Product"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#0F172A]">
                      Filters
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      {filteredItems.length} items
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-full p-2 hover:bg-[#F1F5F9]"
                >
                  <X className="h-5 w-5 text-[#64748B]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-6">
                  <h3 className="mb-3 font-semibold text-[#0F172A]">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${activeCategory === category.id
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

                <div className="mb-6">
                  <h3 className="mb-3 font-semibold text-[#0F172A]">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) =>
                            setPriceRange([
                              Number(e.target.value),
                              priceRange[1],
                            ])
                          }
                          icon={<span className="text-[#64748B]">$</span>}
                          className="rounded-lg py-2.5 focus:border-[#1E3A8A] focus:outline-none"
                          placeholder="Min"
                        />
                      </div>
                      <span className="text-[#64748B]">-</span>
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([
                              priceRange[0],
                              Number(e.target.value),
                            ])
                          }
                          icon={<span className="text-[#64748B]">$</span>}
                          className="rounded-lg py-2.5 focus:border-[#1E3A8A] focus:outline-none"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 font-semibold text-[#0F172A]">
                    Metal Type
                  </h3>
                  <div className="space-y-2">
                    {metalTypes.map((metal) => (
                      <label
                        key={metal.id}
                        className="flex cursor-pointer items-center gap-3"
                      >
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
                        <span className="text-sm text-[#475569]">
                          {metal.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] p-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setMobileFiltersOpen(false);
                    }}
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Jewelry;