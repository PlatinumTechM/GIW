import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Diamond, Filter, X, Search, RefreshCw, SlidersHorizontal } from "lucide-react";
import JewelryGrid from "./JewelryGrid";
import JewelryFilters from "./JewelryFilters";
import { jewelryAPI, favoritesAPI } from "../../../services/api.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import notify from "../../../utils/notifications.jsx";

const normalizeCategory = (cat) => {
  if (!cat) return null;
  const c = cat.toString().toUpperCase().trim();
  const validCategories = ["RING", "NECKLACE", "EARRINGS", "BRACELET", "PENDANT", "BANGLE", "BROOCH", "OTHER"];
  return validCategories.includes(c) ? c : "OTHER";
};

const normalizeMetal = (mat) => {
  if (!mat) return "white-gold";
  const m = mat.toString().toLowerCase().trim();
  if (m.includes("white gold")) return "white-gold";
  if (m.includes("yellow gold")) return "yellow-gold";
  if (m.includes("rose gold")) return "rose-gold";
  if (m.includes("platinum")) return "platinum";
  if (m.includes("silver")) return "silver";
  if (m.includes("two tone") || m.includes("two-tone")) return "two-tone";
  return "other";
};

const normalizeShape = (shape) => {
  if (!shape) return null;
  const s = shape.toString().toLowerCase().trim();
  const predefinedShapes = ["round", "pear", "oval", "princess", "emerald", "cushion", "marquise", "heart", "radiant", "baguette", "hexagonal", "square emerald", "briolette", "trilliant", "half moon", "rose cut", "kite"];
  return predefinedShapes.includes(s) ? s : "other";
};

const mapJewelryItem = (item) => {
  const badge = item.diamond_type?.toString().toLowerCase().includes("lab")
    ? "Lab-Created"
    : item.status === "available" && item.created_at
      ? (new Date(item.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? "New" : "Certified")
      : item.status === "sold"
        ? "Sold"
        : null;

  return {
    id: item.id,
    name: item.name || "Unnamed Jewelry",
    category: item.category || "None",
    price: Number(item.price) || 0,
    priceDisplay: `$${Number(item.price || 0).toLocaleString()}`,
    image: item.jewellery_image1 || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
    badge,
    description: item.description || `${item.material || "None"} ${item.category || "None"}`.trim(),
    metal: normalizeMetal(item.material) || "None",
    shape: normalizeShape(item.diamond_shape) || "None",
    stock_id: item.stock_id || "None",
    status: item.status || "None",
    material: item.material || "None",
    diamond_type: item.diamond_type || "None",
    diamond_shape: item.diamond_shape || "None",
    weight: (item.weight && item.weight.toString().toLowerCase() !== "noneg") ? item.weight : null,
    diamond_weight: item.diamond_weight || "None",
    diamond_color: item.diamond_color || "None",
    diamond_clarity: item.diamond_clarity || "None",
    diamond_cut: item.diamond_cut || "None",
    diamond_growth: item.diamond_growth || "None",
    total_diamond_weight: item.total_diamond_weight || "None",
    jewellery_image1: item.jewellery_image1,
    jewellery_image2: item.jewellery_image2,
    jewellery_image3: item.jewellery_image3,
    jewellery_image4: item.jewellery_image4,
    jewellery_image5: item.jewellery_image5,
    jewellery_video: item.jewellery_video,
    created_at: item.created_at,
  };
};

const LabGrownJewelry = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState({});
  const [togglingId, setTogglingId] = useState(null);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = { limit: 100 };
        if (activeCategory !== "all") {
          params.categories = [activeCategory];
        }
        const response = await jewelryAPI.getLabGrownJewelry(params);
        const rawItems = response.data || [];
        setItems(rawItems.map(mapJewelryItem));
      } catch (err) {
        console.error("Failed to fetch lab-grown jewelry:", err);
        setError("Failed to load jewelry. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJewelry();
  }, [activeCategory]);

  // Fetch favorite status for loaded items
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!isAuthenticated || items.length === 0) return;

      try {
        const ids = items.map((item) => item.id);
        const response = await favoritesAPI.getBulkJewelryFavoriteStatus(ids);
        if (response.success) {
          setFavorites(response.data);
        }
      } catch (error) {
        console.error("Error fetching jewelry favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [items, isAuthenticated]);

  const handleToggleFavorite = async (item) => {
    if (!isAuthenticated) {
      notify.warning("Login Required", "Please login to save favorites");
      return;
    }

    setTogglingId(item.id);
    try {
      const response = await favoritesAPI.toggleJewelryFavorite(item.id);
      if (response.success) {
        setFavorites((prev) => ({
          ...prev,
          [item.id]: response.data.isFavorite,
        }));
        if (response.data.isFavorite) {
          notify.success("Added to Favorites", "Item saved to your favorites");
        } else {
          notify.info("Removed from Favorites", "Item removed from your favorites");
        }
      }
    } catch (error) {
      console.error("Error toggling jewelry favorite:", error);
      notify.error("Error", "Failed to update favorite");
    } finally {
      setTogglingId(null);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#E2E8F0] border-t-[#1E3A8A]" />
          <p className="text-sm text-[#64748B]">Loading jewelry collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Filter className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-[#0F172A]">{error}</h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-[#1E3A8A] px-6 py-2 text-sm font-medium text-white transition-all hover:bg-[#1E40AF]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                <Link to={`/${role}/home`} className="hover:text-[#1E3A8A]">
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
                {items.length} products • GIA Certified • Premium Quality
              </motion.p>
            </div>
            <Link
              to={`/${role}/jewelry`}
              className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
            >
              <Diamond className="h-4 w-4" />
              <span className="text-xs sm:text-sm">View Natural Jewelry</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <JewelryFilters items={items} isLabGrown={true} searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeCategory={activeCategory} setActiveCategory={setActiveCategory}>
        {({
          filteredItems,
          filteredItemsCount,
          clearAllFilters,
          activeCategory,
          selectedMetals,
          selectedShapes,
          priceRange,
          centerStoneWeightRange,
          activeFiltersCount,
          toggleMetal,
          toggleShape,
          setActiveCategory,
          setPriceRange,
          setCenterStoneWeightRange,
        }) => (
          <>
            <section className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white py-3 backdrop-blur-xl shadow-sm">
<div className="w-full px-4 sm:px-6 lg:px-8">                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('openMobileFilters'))}
                      className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A] lg:hidden"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">Filters</span>
                      {activeFiltersCount > 0 && (
                        <span className="bg-[#1E3A8A] text-white text-xs px-1.5 py-0.5 rounded-full">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>
                    <span className="ml-10 text-xs sm:text-sm text-[#64748B]">Lab-Grown Jewelry</span>
                    {activeFiltersCount > 0 && (
                      <>
                        <span className="text-sm text-[#64748B]">•</span>
                        <span className="text-sm text-[#64748B]">Active:</span>
                        {activeCategory !== "all" && (
                          <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-2 sm:px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                            <span className="truncate max-w-[80px] sm:max-w-none">{activeCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                            <button onClick={() => setActiveCategory("all")}>
                              <X className="h-3 w-3 flex-shrink-0" />
                            </button>
                          </span>
                        )}
                        {selectedShapes.map((shape) => (
                          <span
                            key={shape}
                            className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-2 sm:px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                          >
                            {shape}
                            <button onClick={() => toggleShape(shape)}>
                              <X className="h-3 w-3 flex-shrink-0" />
                            </button>
                          </span>
                        ))}
                        {selectedMetals.map((metal) => (
                          <span
                            key={metal}
                            className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-2 sm:px-3 py-1 text-xs font-medium text-[#1E3A8A]"
                          >
                            <span className="truncate max-w-[80px] sm:max-w-none">{metal.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                            <button onClick={() => toggleMetal(metal)}>
                              <X className="h-3 w-3 flex-shrink-0" />
                            </button>
                          </span>
                        ))}
                        {(priceRange[0] > 0 || priceRange[1] > 0) && (
                          <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-2 sm:px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                            ${priceRange[0]} - ${priceRange[1]}
                            <button onClick={() => setPriceRange([0, 0])}>
                              <X className="h-3 w-3 flex-shrink-0" />
                            </button>
                          </span>
                        )}
                        {(centerStoneWeightRange[0] > 0 || centerStoneWeightRange[1] > 0) && (
                          <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-2 sm:px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                            {centerStoneWeightRange[0]}ct - {centerStoneWeightRange[1]}ct
                            <button onClick={() => setCenterStoneWeightRange([0, 0])}>
                              <X className="h-3 w-3 flex-shrink-0" />
                            </button>
                          </span>
                        )}
                        <button
                          onClick={clearAllFilters}
                          className="flex items-center gap-1 text-xs font-medium text-[#64748B] underline hover:text-[#1E3A8A]"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Clear all
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Search jewelry..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-4 sm:py-8">
<div className="w-full px-4 sm:px-6 lg:px-8">

                <JewelryGrid
                  items={filteredItems}
                  itemsPerPage={itemsPerPage}
                  showSearch={false}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  type="lab-grown"
                  favorites={favorites}
                  togglingId={togglingId}
                  onItemClick={(item) =>
                    navigate(`/${role}/jewelry/lab-grown/${item.id}`)
                  }
                  onAddToCart={(item) => console.log("Add to cart:", item.name)}
                  onAddToWishlist={handleToggleFavorite}
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
            </section>
          </>
        )}
      </JewelryFilters>
    </motion.div>
  );
};

export default LabGrownJewelry;
