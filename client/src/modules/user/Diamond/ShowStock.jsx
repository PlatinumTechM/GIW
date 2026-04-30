import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, Check, ChevronLeft, ChevronRight, Star, Diamond } from "lucide-react";
import { stockAPI, favoritesAPI } from "../../../services/api.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import notify from "../../../utils/notifications.jsx";

const ShowStock = ({ type, viewMode = "grid", sortBy = "featured", filters }) => {
  const navigate = useNavigate();
  const { role } = useParams();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [togglingFavorite, setTogglingFavorite] = useState(null);
  const itemsPerPage = 9;

  const openDiamondDetail = (diamond) => {
    if (!diamond.id || diamond.id === "None" || isNaN(Number(diamond.id))) {
      console.error("Invalid diamond ID:", diamond.id);
      return;
    }
    navigate(`/${role}/diamond/${type}/${diamond.id}`);
  };

  // Map backend data to frontend format
  const mapStockData = (stock) => {
    return {
      id: stock.id,
      stockId: stock.stock_id,
      shape: stock.shape,
      carat: parseFloat(stock.weight),
      caratMin: parseFloat(stock.weight) * 0.95,
      caratMax: parseFloat(stock.weight) * 1.05,
      priceMin: Math.floor(stock.final_price * 0.9),
      priceMax: Math.floor(stock.final_price * 1.1),
      get price() { return Math.floor(stock.final_price); },
      colorType: stock.fancy_color ? "Fancy" : "White",
      color: stock.color || stock.fancy_color,
      fancyIntensity: stock.fancy_color_intensity,
      fancyOvertone: stock.fancy_color_overtone,
      clarity: stock.clarity,
      cut: stock.cut,
      polish: stock.polish,
      symmetry: stock.symmetry,
      fluorescence: stock.fluorescence,
      certification: stock.lab,
      certificationNumber: stock.certificate_number,
      hasMedia: !!(stock.diamond_image1 || stock.diamond_video),
      image: stock.diamond_image1,
      badge: stock.lab ? `${stock.lab} Certified` : null,
      available: stock.status === "AVAILABLE",
      table: stock.table_percentage,
      depth: stock.depth_percentage,
      length: stock.length,
      width: stock.width,
      height: stock.height,
      ratio: stock.lw_ratio ? parseFloat(stock.lw_ratio) : null,
      crownHeight: stock.crown_height,
      crownAngle: stock.crown_angle,
      pavilionDepth: stock.pavilion_depth,
      pavilionAngle: stock.pavilion_angle,
      girdle: stock.gridle_per,
      milky: stock.milky,
      eyeClean: stock.eye_clean,
      shade: stock.shade,
      type: stock.type,
      party: stock.party,
    };
  };

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortBy,
        };

        // Add filters to params
        if (filters?.shapes?.length > 0) params.shape = filters.shapes.join(",");
        // Only send color filter for White diamonds, not Fancy
        if (filters?.colors?.length > 0 && filters?.colorType === "White") {
          params.color = filters.colors.join(",");
        }
        if (filters?.clarity?.length > 0) params.clarity = filters.clarity.join(",");
        if (filters?.caratMin) params.minWeight = filters.caratMin;
        if (filters?.caratMax) params.maxWeight = filters.caratMax;
        if (filters?.priceMin) params.minPrice = filters.priceMin;
        if (filters?.priceMax) params.maxPrice = filters.priceMax;
        if (filters?.pricePerCaratMin) params.minPricePerCarat = filters.pricePerCaratMin;
        if (filters?.pricePerCaratMax) params.maxPricePerCarat = filters.pricePerCaratMax;

        // Detailed filters
        if (filters?.cuts?.length > 0) params.cut = filters.cuts.join(",");
        if (filters?.polish?.length > 0) params.polish = filters.polish.join(",");
        if (filters?.symmetry?.length > 0) params.symmetry = filters.symmetry.join(",");
        if (filters?.fluorescence?.length > 0) params.fluorescence = filters.fluorescence.join(",");
        if (filters?.growthType?.length > 0) params.growthType = filters.growthType.join(",");
        if (filters?.treatment?.length > 0) params.treatment = filters.treatment.join(",");
        if (filters?.certifications?.length > 0) params.lab = filters.certifications.join(",");
        
        // Color handling - backend handles both in color param
        if (filters?.colorType === "White" && filters?.colors?.length > 0) {
          params.color = filters.colors.join(",");
        } else if (filters?.colorType === "Fancy" && filters?.fancyColors?.length > 0) {
          params.color = filters.fancyColors.join(",");
        }
        if (filters?.fancyIntensity) params.fancyIntensity = filters.fancyIntensity;
        if (filters?.fancyOvertone) params.fancyOvertone = filters.fancyOvertone;
        if (filters?.certificateType) params.certificateType = filters.certificateType;
        if (filters?.available) params.status = "AVAILABLE";
        if (filters?.showOnlyMedia) params.hasMedia = "true";
        if (filters?.heartArrow) params.heartArrow = "true";
        if (filters?.noBgm) params.noBgm = "true";
        if (filters?.location) params.location = filters.location;
        if (filters?.supplier) params.supplier = filters.supplier;

        // Measurement filters
        if (filters?.lengthMin) params.minLength = filters.lengthMin;
        if (filters?.lengthMax) params.maxLength = filters.lengthMax;
        if (filters?.widthMin) params.minWidth = filters.widthMin;
        if (filters?.widthMax) params.maxWidth = filters.widthMax;
        if (filters?.heightMin) params.minHeight = filters.heightMin;
        if (filters?.heightMax) params.maxHeight = filters.heightMax;
        if (filters?.ratioMin) params.minRatio = filters.ratioMin;
        if (filters?.ratioMax) params.maxRatio = filters.ratioMax;

        // Percentage filters
        if (filters?.depthMin) params.minDepth = filters.depthMin;
        if (filters?.depthMax) params.maxDepth = filters.depthMax;
        if (filters?.tableMin) params.minTable = filters.tableMin;
        if (filters?.tableMax) params.maxTable = filters.tableMax;

        // Crown filters
        if (filters?.crownHeightMin) params.minCrownHeight = filters.crownHeightMin;
        if (filters?.crownHeightMax) params.maxCrownHeight = filters.crownHeightMax;
        if (filters?.crownAngleMin) params.minCrownAngle = filters.crownAngleMin;
        if (filters?.crownAngleMax) params.maxCrownAngle = filters.crownAngleMax;

        // Pavilion filters
        if (filters?.pavilionDepthMin) params.minPavilionDepth = filters.pavilionDepthMin;
        if (filters?.pavilionDepthMax) params.maxPavilionDepth = filters.pavilionDepthMax;
        if (filters?.pavilionAngleMin) params.minPavilionAngle = filters.pavilionAngleMin;
        if (filters?.pavilionAngleMax) params.maxPavilionAngle = filters.pavilionAngleMax;

        // Girdle filters
        if (filters?.girdleMin) params.minGirdle = filters.girdleMin;
        if (filters?.girdleMax) params.maxGirdle = filters.girdleMax;

        // Dropdown filters
        if (filters?.milky) params.milky = filters.milky;
        if (filters?.eyeClean) params.eyeClean = filters.eyeClean;
        if (filters?.shade) params.shade = filters.shade;

        // Use dedicated routes based on type - backend handles type filtering
        let response;
        if (type === "natural" || type === "natural-diamonds" || type === "NaturalDiamond") {
          response = await stockAPI.getNaturalDiamonds(params);
        } else if (type === "lab-grown" || type === "lab-grown-diamonds" || type === "LabGrownDiamond") {
          response = await stockAPI.getLabGrownDiamonds(params);
        } else {
          response = await stockAPI.getAllStocks(params);
        }

        if (response.success && response.data) {
          const mappedItems = response.data.stocks.map(mapStockData);
          setItems(mappedItems);
          setTotalCount(response.data.pagination.totalCount);
          setTotalPages(response.data.pagination.totalPages);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [type, currentPage, filters, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  // Fetch favorite status for loaded items
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!isAuthenticated || items.length === 0) return;

      try {
        const ids = items.map((item) => item.id);
        const response = await favoritesAPI.getBulkDiamondFavoriteStatus(ids);
        if (response.success) {
          setFavorites(response.data);
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [items, isAuthenticated]);

  // Toggle favorite
  const toggleFavorite = async (e, item) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      notify.warning("Login Required", "Please login to save favorites");
      return;
    }

    setTogglingFavorite(item.id);
    try {
      const response = await favoritesAPI.toggleDiamondFavorite(item.id);
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
      console.error("Error toggling favorite:", error);
      notify.error("Error", "Failed to update favorite");
    } finally {
      setTogglingFavorite(null);
    }
  };

  const toggleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Server-side sorting - handled by backend, frontend just displays
  const sortedItems = items;

  // Server-side filtering - all filters sent to backend
  const paginatedItems = sortedItems;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-[#F1F5F9] rounded w-3/4" />
              <div className="h-4 bg-[#F1F5F9] rounded w-1/2" />
              <div className="h-8 bg-[#F1F5F9] rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#F1F5F9] flex items-center justify-center">
          <Diamond className="w-12 h-12 text-[#94A3B8]" />
        </div>
        <h3 className="text-xl font-semibold text-[#0F172A] mb-2">No diamonds found</h3>
        <p className="text-[#64748B] mb-6">Try adjusting your filters to see more results</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E40AF] transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#64748B]">
          Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
          <span className="text-[#0F172A] font-medium">{totalCount}</span> diamonds
        </span>
      </div>

      {/* Diamond Grid or List View */}
      {viewMode === "list" ? (
        // List View
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr_1.5fr_1.5fr] gap-3 px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] text-sm font-semibold text-[#475569]">
            <div>Carat</div>
            <div>Color</div>
            <div>Clarity</div>
            <div>Cut</div>
            <div>Polish</div>
            <div>Symmetry</div>
            <div>Fluor</div>
            <div>Party</div>
            <div>Certification</div>
            <div className="text-right">Price</div>
          </div>

          {/* List Items */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.1 },
              },
            }}
          >
            {paginatedItems.map((item) => (
              <motion.div
                key={item.id}
                variants={scaleIn}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="group border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-all duration-300"
              >
                {/* Desktop Row */}
                <div
                  className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr_1.5fr_1.5fr] gap-3 px-6 py-4 items-center cursor-pointer"
                  onClick={() => openDiamondDetail(item)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#0F172A]">{item.carat}ct</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#0F172A]">
                      {item.colorType === "Fancy" && item.fancyIntensity ? `${item.fancyIntensity} ` : ""}
                      {item.color}
                      {item.fancyOvertone && item.fancyOvertone !== "None" ? ` ${item.fancyOvertone}` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-[#0F172A]">{item.clarity}</span>
                  </div>
                  <div>
                    <span className={`font-medium ${item.cut === "Excellent" || item.cut === "Ideal" ? "text-green-600" : "text-[#0F172A]"}`}>
                      {item.cut}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-[#0F172A]">{item.polish}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#0F172A]">{item.symmetry}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#0F172A]">{item.fluorescence}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#0F172A]">{item.party || "-"}</span>
                  </div>
                  <div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#0F172A]">{item.certification}</span>
                      <span className="text-xs text-[#64748B]">{item.certificationNumber}</span>
                    </div>
                  </div>
                  <div className="text-right flex items-center justify-end gap-3">
                    <div>
                      <p className="text-lg font-bold text-[#1E3A8A]">${item.price.toLocaleString()}</p>
                      {item.available && (
                        <span className="text-xs text-green-600 font-medium">Available</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(e, item)}
                      disabled={togglingFavorite === item.id}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110 ${
                        favorites[item.id] ? "text-red-500 bg-red-50" : "text-[#64748B] bg-[#F1F5F9] hover:text-red-500"
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={favorites[item.id] ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                {/* Mobile Card */}
                <div
                  className="lg:hidden p-4 cursor-pointer"
                  onClick={() => openDiamondDetail(item)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-[#0F172A]">
                          {item.shape} {item.carat}ct
                        </h3>
                        <p className="text-sm text-[#64748B] mt-0.5">
                          {item.colorType === "Fancy" && item.fancyIntensity ? `${item.fancyIntensity} ` : ""}
                          {item.color} · {item.clarity}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-[#1E3A8A] whitespace-nowrap">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-[#F1F5F9] px-2 py-1 rounded">{item.cut} Cut</span>
                      <span className="text-xs bg-[#F1F5F9] px-2 py-1 rounded">{item.polish} P</span>
                      <span className="text-xs bg-[#F1F5F9] px-2 py-1 rounded">{item.symmetry} S</span>
                      <span className="text-xs bg-[#F1F5F9] px-2 py-1 rounded">{item.fluorescence}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[#64748B]">{item.certification} · {item.certificationNumber} · {item.party || "-"}</span>
                      <div className="flex items-center gap-2">
                        {item.available && (
                          <span className="text-xs text-green-600 font-medium">Available</span>
                        )}
                        <button
                          onClick={(e) => toggleFavorite(e, item)}
                          disabled={togglingFavorite === item.id}
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                            favorites[item.id] ? "text-red-500 bg-red-50" : "text-[#64748B] bg-[#F1F5F9]"
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={favorites[item.id] ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        // Grid View
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {paginatedItems.map((item) => (
            <motion.div
              key={item.id}
              variants={scaleIn}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => openDiamondDetail(item)}
              className="group relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-[0_20px_50px_rgba(30,58,138,0.15)] transition-all duration-500 cursor-pointer"
            >
              {/* Image Container - Aspect Square like JewelryGrid */}
              <div
                className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]"
              >
                <motion.img
                  src={item.image}
                  alt={`${item.shape} Diamond`}
                  className="w-full h-full object-cover"
                  animate={{ scale: hoveredItem === item.id ? 1.1 : 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onError={(e) => {
                    e.target.style.display = "None";
                  }}
                />

                {/* Badge */}
                {item.badge && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg bg-[#1E3A8A]"
                  >
                    {item.badge}
                  </motion.div>
                )}

                {/* Hover Actions */}
 {/* Hover / Favorite Actions */}
<div
  className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-100 sm:top-4 sm:right-4 md:opacity-0 md:group-hover:opacity-100"
>
  <button
    onClick={(e) => toggleFavorite(e, item)}
    disabled={togglingFavorite === item.id}
    className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 ${
      favorites[item.id]
        ? "text-red-500"
        : "text-[#64748B] hover:text-red-500"
    }`}
  >
    <Heart
      className="w-5 h-5"
      fill={favorites[item.id] ? "currentColor" : "none"}
    />
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      openDiamondDetail(item);
    }}
    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#64748B] hover:text-[#1E3A8A] hover:scale-110 transition-all duration-300"
  >
    <Eye className="w-5 h-5" />
  </button>
</div>

                {/* Available Badge */}
                {item.available && (
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                      Available
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Certification */}
                <div className="mb-2 flex items-center justify-end">
                  <span className="text-xs font-medium text-[#64748B]">
                    {item.certificationNumber}
                  </span>
                </div>

                {/* Diamond Name */}
                <h3 className="mb-2 text-lg font-semibold text-[#0F172A] transition-colors group-hover:text-[#1E3A8A]">
                  {item.shape} {item.carat}ct {item.color} {item.clarity}
                </h3>

                {/* Specs */}
                <p className="mb-3 text-sm text-[#64748B] line-clamp-2">
                  {item.cut} Cut · {item.polish} Polish · {item.symmetry} Symmetry · {item.fluorescence} · {item.party || "No Party"}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                  <div>
                    <p className="text-xs text-[#64748B] mb-1">Avg Price</p>
                    <p className="text-xl font-bold text-[#1E3A8A]">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-xl shadow-gray-200/60 ring-1 ring-gray-100">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-[#64748B] transition-all duration-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1 px-2">
              {getVisiblePages().map((page, index) =>
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center text-sm text-[#94A3B8]">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${currentPage === page
                        ? "bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white shadow-md shadow-blue-900/20 scale-105"
                        : "text-[#475569] hover:bg-gray-100 hover:text-[#1E3A8A]"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-[#64748B] transition-all duration-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <p className="text-[#64748B]">
              Page <span className="font-semibold text-[#1E3A8A]">{currentPage}</span> of{" "}
              <span className="font-semibold text-[#1E3A8A]">{totalPages}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowStock;