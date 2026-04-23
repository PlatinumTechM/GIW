import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FlaskConical, Filter, X, Search, RefreshCw, SlidersHorizontal } from "lucide-react";
import JewelryGrid from "./JewelryGrid";
import JewelryFilters from "./JewelryFilters";

const Jewelry = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 9;

  const items = [
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
                {items.length} products • GIA Certified • Premium Quality
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

      {/* Top Filter Bar - Above Filters */}
      <section className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white py-3 backdrop-blur-xl shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              {/* Mobile Filter Button - Above text on mobile, hidden on desktop */}
              <button
                onClick={() => {
                  // This will be handled by JewelryFilters component
                  const event = new CustomEvent('openMobileFilters');
                  window.dispatchEvent(event);
                }}
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A] sm:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <span className="text-sm font-medium text-[#1E3A8A]">Natural Jewelry</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <JewelryFilters items={items} searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            {({
              filteredItems,
              filteredItemsCount,
              clearAllFilters,
              activeCategory,
              selectedMetals,
              selectedShapes,
              priceRange,
              activeFiltersCount,
              toggleMetal,
              toggleShape,
              setActiveCategory,
              setPriceRange,
            }) => (
              <>
                {/* Active Filters Bar - Inside JewelryFilters to access state */}
                {activeFiltersCount > 0 && (
                  <section className="mb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-[#64748B]">Active:</span>
                        {activeCategory !== "all" && (
                          <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                            {activeCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            <button onClick={() => setActiveCategory("all")}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        )}
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
                        {selectedMetals.map((metal) => (
                          <span
                            key={metal}
                            className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                          >
                            {metal.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            <button onClick={() => toggleMetal(metal)}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        {(priceRange[0] > 0 || priceRange[1] > 0) && (
                          <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                            ${priceRange[0]} - ${priceRange[1]}
                            <button onClick={() => setPriceRange([0, 0])}>
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
                      </div>
                    </div>
                  </section>
                )}

                <JewelryGrid
                  items={filteredItems}
                  itemsPerPage={itemsPerPage}
                  showSearch={false}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  type="natural"
                  onItemClick={(item) => navigate(`/user/jewelry/natural/${item.id}`)}
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
              </>
            )}
          </JewelryFilters>
        </div>
      </section>
    </motion.div>
  );
};

export default Jewelry;