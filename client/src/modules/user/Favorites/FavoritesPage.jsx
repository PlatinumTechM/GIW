import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  Diamond,
  Gem,
  Grid3X3,
  List,
} from "lucide-react";
import { favoritesAPI } from "../../../services/api.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import notify from "../../../utils/notifications.jsx";

const tabs = [
  { id: "all", label: "All Items", icon: Heart },
  { id: "diamonds", label: "Diamonds", icon: Diamond },
  { id: "jewelry", label: "Jewelry", icon: Gem },
];

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "buyer";

  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({
    diamond: 0,
    jewelry: 0,
    DIAMOND: 0,
    JEWELRY: 0,
    total: 0,
  });
  const [viewMode, setViewMode] = useState("grid");
  const [removingId, setRemovingId] = useState(null);

  const itemsPerPage = 12;

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const type =
        activeTab === "all"
          ? undefined
          : activeTab === "diamonds"
          ? "diamond"
          : "jewelry";

      const response = await favoritesAPI.getAllFavorites({
        page: currentPage,
        limit: itemsPerPage,
        type,
      });

      if (response.success) {
        setFavorites(
          response.data.items ||
            response.data.stocks ||
            response.data.jewelry ||
            []
        );
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      notify.error("Error", "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const response = await favoritesAPI.getFavoriteCounts();
      if (response.success) {
        setCounts(response.data);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
    fetchCounts();
  }, [activeTab, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleRemoveFavorite = async (item) => {
    const id = item.type === "DIAMOND" ? item.stockId || item.id : item.id;
    setRemovingId(id);

    try {
      if (item.type === "DIAMOND") {
        await favoritesAPI.toggleDiamondFavorite(item.id);
      } else {
        await favoritesAPI.toggleJewelryFavorite(item.id);
      }

      setFavorites((prev) => prev.filter((f) => f.id !== item.id));
      fetchCounts();
      notify.success("Removed", "Item removed from favorites");
    } catch (error) {
      console.error("Error removing favorite:", error);
      notify.error("Error", "Failed to remove from favorites");
    } finally {
      setRemovingId(null);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDetail = (item) => {
    if (item.type === "DIAMOND") {
      const diamondType = item.diamondType === "NATURAL" ? "natural" : "lab-grown";
      navigate(`/${role}/diamond/${diamondType}/${item.id}`);
    } else {
      const jewelryType = item.diamondType?.toLowerCase().includes("lab")
        ? "lab-grown"
        : "natural";
      navigate(`/${role}/jewelry/${jewelryType}/${item.id}`);
    }
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

  const mapDiamondData = (stock) => ({
    id: stock.id,
    type: "DIAMOND",
    stockId: stock.stock_id,
    shape: stock.shape,
    carat: parseFloat(stock.weight),
    price: Math.floor(stock.final_price),
    color: stock.color || stock.fancy_color,
    clarity: stock.clarity,
    cut: stock.cut,
    polish: stock.polish,
    symmetry: stock.symmetry,
    fluorescence: stock.fluorescence,
    certification: stock.lab,
    certificationNumber: stock.certificate_number,
    image: stock.diamond_image1,
    seller: stock.seller_name || stock.seller_company || "Unknown",
    available: stock.status === "AVAILABLE",
    favoritedAt: stock.favorited_at,
    diamondType: stock.type_name,
  });

  const mapJewelryData = (item) => ({
    id: item.id,
    type: "JEWELRY",
    jewelryId: item.jewellry_id || item.id,
    name: item.name || "Unnamed Jewelry",
    category: item.jewelry_sub_category || item.jewelry_style || "",
    subCategory: item.jewelry_style || "",
    price: Math.floor(item.price || 0),
    metalType: item.material || "",
    diamondType: item.center_gem_type || "",
    totalCarat: item.center_weight_cts || item.weight || "",
    image: item.jewellery_image1,
    seller: item.seller_name || item.seller_company || "Unknown",
    available: item.status === "AVAILABLE",
    favoritedAt: item.favorited_at,
  });

  const mappedFavorites = favorites.map((item) =>
    item.type === "DIAMOND" ||
    item.item_type === "DIAMOND" ||
    item.item_type === "diamond"
      ? mapDiamondData(item)
      : mapJewelryData(item)
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const getTabCount = (tabId) => {
    if (tabId === "all") return counts.total || 0;
    if (tabId === "diamonds") return counts.diamond || counts.DIAMOND || 0;
    if (tabId === "jewelry") return counts.jewelry || counts.JEWELRY || 0;
    return 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#FAFBFC]"
    >
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <motion.div
                variants={fadeInUp}
                className="mb-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#64748B]"
              >
                <Link to={`/${role}/home`} className="hover:text-[#1E3A8A]">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[#1E3A8A]">My Favorites</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-xl font-bold text-[#0F172A] sm:text-2xl"
              >
                My Favorites
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-sm text-[#64748B]">
                {counts.total} saved items
              </motion.p>
            </div>

            <div className="flex w-full items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white p-1 sm:w-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all sm:flex-none sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm ${
                  viewMode === "grid"
                    ? "bg-[#1E3A8A] text-white shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Grid</span>
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all sm:flex-none sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm ${
                  viewMode === "list"
                    ? "bg-[#1E3A8A] text-white shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">List</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-0 z-10 border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-2 py-2 sm:flex sm:overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = getTabCount(tab.id);

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition-all sm:flex-row sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
                    activeTab === tab.id
                      ? "bg-[#1E3A8A] text-white shadow-md"
                      : "text-[#475569] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  <span className="truncate">{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] sm:text-xs ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white"
                >
                  <div className="aspect-square bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]" />
                  <div className="space-y-3 p-4 sm:p-5">
                    <div className="h-4 w-3/4 rounded bg-[#F1F5F9]" />
                    <div className="h-4 w-1/2 rounded bg-[#F1F5F9]" />
                    <div className="h-8 w-1/3 rounded bg-[#F1F5F9]" />
                  </div>
                </div>
              ))}
            </div>
          ) : mappedFavorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center sm:py-20"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F1F5F9] sm:h-24 sm:w-24">
                <Heart className="h-10 w-10 text-[#94A3B8] sm:h-12 sm:w-12" />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-[#0F172A] sm:text-xl">
                No favorites yet
              </h3>

              <p className="mb-6 max-w-md text-sm text-[#64748B] sm:text-base">
                Start exploring our collection and save your favorite diamonds and
                jewelry pieces here.
              </p>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  to={`/${role}/natural-diamonds`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1E40AF]"
                >
                  <Diamond className="h-4 w-4" />
                  Browse Diamonds
                </Link>

                <Link
                  to={`/${role}/jewelry`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-semibold text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
                >
                  <Gem className="h-4 w-4" />
                  Browse Jewelry
                </Link>
              </div>
            </motion.div>
          ) : viewMode === "list" ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-3 sm:space-y-4"
            >
              {mappedFavorites.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  className={`group relative rounded-2xl border border-[#E2E8F0] bg-white p-4 transition-all hover:shadow-lg sm:p-6 ${
                    removingId === item.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div
                      onClick={() => openDetail(item)}
                      className="relative h-44 w-full flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] sm:h-24 sm:w-24"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.type === "DIAMOND" ? "Diamond" : item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          {item.type === "DIAMOND" ? (
                            <Diamond className="h-9 w-9 text-[#94A3B8]" />
                          ) : (
                            <Gem className="h-9 w-9 text-[#94A3B8]" />
                          )}
                        </div>
                      )}

                      <div className="absolute left-2 top-2 rounded-full bg-[#1E3A8A] px-2 py-0.5 text-[10px] font-bold text-white">
                        {item.type === "DIAMOND" ? "Diamond" : "Jewelry"}
                      </div>
                    </div>

                    <div onClick={() => openDetail(item)} className="flex-1 cursor-pointer">
                      {item.type === "DIAMOND" ? (
                        <>
                          <h3 className="mb-1 text-base font-semibold text-[#0F172A] sm:text-lg">
                            {item.shape} {item.carat}ct {item.color} {item.clarity}
                          </h3>
                          <p className="text-sm text-[#64748B]">
                            {item.cut} Cut · {item.polish} Polish · {item.symmetry} Symmetry
                          </p>
                          <p className="mt-1 text-xs text-[#94A3B8]">
                            {item.certification} · {item.certificationNumber}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="mb-1 text-base font-semibold text-[#0F172A] sm:text-lg">
                            {item.name}
                          </h3>
                          <p className="text-sm text-[#64748B]">
                            {item.category} · {item.subCategory}
                          </p>
                          <p className="mt-1 text-xs text-[#94A3B8]">
                            {item.metalType} · {item.diamondType} Diamonds · {item.totalCarat}ct
                          </p>
                        </>
                      )}

                      <p className="mt-2 text-xs text-[#94A3B8]">Seller: {item.seller}</p>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-[#E2E8F0] pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <p className="text-lg font-bold text-[#1E3A8A] sm:text-xl">
                          ${item.price.toLocaleString()}
                        </p>
                        {item.available && (
                          <span className="text-xs font-medium text-green-600">
                            Available
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetail(item)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F5F9] text-[#475569] transition-all hover:bg-[#E2E8F0] hover:text-[#1E3A8A] sm:h-10 sm:w-10"
                        >
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>

                        <button
                          onClick={() => handleRemoveFavorite(item)}
                          disabled={removingId === item.id}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 transition-all hover:bg-red-100 disabled:opacity-60 sm:h-10 sm:w-10"
                        >
                          <Heart className="h-4 w-4 fill-red-500 text-red-500 sm:h-5 sm:w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6"
            >
              {mappedFavorites.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  className={`group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white transition-all duration-300 hover:shadow-[0_20px_50px_rgba(30,58,138,0.15)] ${
                    removingId === item.id ? "opacity-50" : ""
                  }`}
                >
                  <div
                    onClick={() => openDetail(item)}
                    className="relative aspect-square cursor-pointer overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]"
                  >
                    {item.image ? (
                      <motion.img
                        src={item.image}
                        alt={item.type === "DIAMOND" ? "Diamond" : item.name}
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        {item.type === "DIAMOND" ? (
                          <Diamond className="h-14 w-14 text-[#CBD5E1] sm:h-16 sm:w-16" />
                        ) : (
                          <Gem className="h-14 w-14 text-[#CBD5E1] sm:h-16 sm:w-16" />
                        )}
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-full bg-[#1E3A8A] px-3 py-1 text-[10px] font-bold text-white shadow-lg sm:left-4 sm:top-4">
                      {item.type === "DIAMOND" ? "Diamond" : "Jewelry"}
                    </div>

                    {item.available && (
                      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                        <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                          Available
                        </span>
                      </div>
                    )}

                    <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 sm:right-4 sm:top-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(item);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#475569] shadow-md transition-all hover:scale-110 hover:text-[#1E3A8A] sm:h-9 sm:w-9"
                      >
                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(item);
                        }}
                        disabled={removingId === item.id}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-md transition-all hover:scale-110 disabled:opacity-60 sm:h-9 sm:w-9"
                      >
                        <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>

                  <div onClick={() => openDetail(item)} className="cursor-pointer p-4 sm:p-5">
                    {item.type === "DIAMOND" ? (
                      <>
                        <h3 className="mb-2 line-clamp-1 text-base font-semibold text-[#0F172A] transition-colors group-hover:text-[#1E3A8A] sm:text-lg">
                          {item.shape} {item.carat}ct {item.color} {item.clarity}
                        </h3>

                        <p className="mb-3 line-clamp-2 text-sm text-[#64748B]">
                          {item.cut} Cut · {item.polish} Polish · {item.symmetry} Symmetry ·{" "}
                          {item.fluorescence}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="mb-2 line-clamp-1 text-base font-semibold text-[#0F172A] transition-colors group-hover:text-[#1E3A8A] sm:text-lg">
                          {item.name}
                        </h3>

                        <p className="mb-3 line-clamp-2 text-sm text-[#64748B]">
                          {item.category} · {item.subCategory} · {item.metalType} ·{" "}
                          {item.diamondType} Diamonds
                        </p>
                      </>
                    )}

                    <div className="flex items-end justify-between gap-3 border-t border-[#E2E8F0] pt-3">
                      <div>
                        <p className="text-xs text-[#64748B]">Price</p>
                        <p className="text-lg font-bold text-[#1E3A8A] sm:text-xl">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>

                      <p className="max-w-[120px] truncate text-right text-xs text-[#94A3B8]">
                        {item.seller}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12">
              <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl bg-white px-3 py-3 shadow-xl shadow-gray-200/60 ring-1 ring-gray-100 sm:gap-2 sm:px-5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-[#64748B] transition-all duration-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1 px-1 sm:px-2">
                  {getVisiblePages().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="flex h-8 w-8 items-center justify-center text-sm text-[#94A3B8]"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 ${
                          currentPage === page
                            ? "scale-105 bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white shadow-md shadow-blue-900/20"
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
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-[#64748B] transition-all duration-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-[#64748B]">
                Page{" "}
                <span className="font-semibold text-[#1E3A8A]">{currentPage}</span> of{" "}
                <span className="font-semibold text-[#1E3A8A]">{totalPages}</span>
              </p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default FavoritesPage;