import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShoppingBag as ShoppingBagIcon,
  Search,
  ArrowUpDown,
  Grid3X3,
  List,
  Gem,
  Diamond,
  Scale,
  Tag,
  Box,
} from "lucide-react";

const JewelryGrid = ({
  items,
  itemsPerPage = 9,
  showPagination = true,
  showSearch = true,
  showSort = true,
  emptyMessage = "No products found",
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onItemClick,
  viewMode = "grid",
  onViewModeChange,
  type = "natural",
  favorites = {},
  togglingId = null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.metal?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "newest":
        return sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
      case "name-asc":
        return sorted.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      case "name-desc":
        return sorted.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );
      default:
        return sorted;
    }
  }, [filteredItems, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, items]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page === "...") return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#F1F5F9] flex items-center justify-center">
          <ShoppingBagIcon className="w-12 h-12 text-[#94A3B8]" />
        </div>
        <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
          {emptyMessage}
        </h3>
        <p className="text-[#64748B]">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

  if (sortedItems.length === 0 && searchQuery) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#F1F5F9] flex items-center justify-center">
          <Search className="w-12 h-12 text-[#94A3B8]" />
        </div>
        <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
          No matches found
        </h3>
        <p className="text-[#64748B] mb-4">
          No products match &quot;{searchQuery}&quot;
        </p>
        <button
          onClick={() => setSearchQuery("")}
          className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E40AF] transition-colors"
        >
          Clear Search
        </button>
      </div>
    );
  }

  const sortOptions = [
    { id: "featured", label: "Featured" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "newest", label: "Newest First" },
    { id: "name-asc", label: "Name: A-Z" },
    { id: "name-desc", label: "Name: Z-A" },
  ];

  return (
    <div className="space-y-6">
      {(showSearch || showSort) && (
        <div className={`flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between ${showSearch ? "bg-white p-4 rounded-xl border border-[#E2E8F0]" : ""}`}>
          {showSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-10 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E3A8A]"
                >
                  <span className="text-xs">✕</span>
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 w-full justify-between">
            {showSort && (
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#64748B]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm bg-white cursor-pointer min-w-[160px]"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* View Mode Toggle */}
            {onViewModeChange && (
              <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white p-1">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-[#1E3A8A] text-white shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => onViewModeChange("list")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-[#1E3A8A] text-white shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-[#64748B]">
          Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, sortedItems.length)} of{" "}
          <span className="text-[#0F172A] font-medium">
            {sortedItems.length}
          </span>{" "}
          products
          {searchQuery && (
            <span className="ml-2 text-[#1E3A8A]">
              • Search: &quot;{searchQuery}&quot;
            </span>
          )}
        </span>
      </div>

      {viewMode === "list" ? (
        // List View
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          {/* Table Header */}
          <div className="sticky top-0 z-10 hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] text-sm font-semibold text-[#475569]">
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Metal</div>
            <div className="col-span-2">Description</div>
            <div className="col-span-1 text-right">Price</div>
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
                onClick={() => onItemClick?.(item)}
                className="group border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-all duration-300 cursor-pointer"
              >
                {/* Desktop Row */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-4">
                    <div>
                      <p className="font-semibold text-[#0F172A] line-clamp-1">{item.name}</p>
                      {item.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.badge === "Sale"
                            ? "bg-red-100 text-red-600"
                            : item.badge === "New"
                            ? "bg-green-100 text-green-600"
                            : item.badge === "Popular"
                            ? "bg-amber-100 text-amber-600"
                            : item.badge === "Premium"
                            ? "bg-purple-100 text-purple-600"
                            : item.badge === "Lab-Created"
                            ? "bg-emerald-100 text-emerald-600"
                            : item.badge === "Eco-Friendly"
                            ? "bg-teal-100 text-teal-600"
                            : "bg-[#DBEAFE] text-[#1E3A8A]"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-[#64748B] capitalize">
                      {item.category?.replace(/s$/, "").replace(/-/g, " ")}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-[#0F172A] capitalize">
                      {item.metal?.replace(/-/g, " ")}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-[#64748B] line-clamp-1">{item.description}</span>
                  </div>
                  <div className="col-span-1 text-right flex items-center justify-end gap-3">
                    <p className="text-lg font-bold text-[#1E3A8A]">
                      {item.priceDisplay || `$${item.price?.toLocaleString()}`}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToWishlist?.(item);
                      }}
                      disabled={togglingId === item.id}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110 ${
                        favorites[item.id] ? "text-red-500 bg-red-50" : "text-[#64748B] bg-[#F1F5F9] hover:text-red-500"
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={favorites[item.id] ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="lg:hidden p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-[#0F172A] line-clamp-1">{item.name}</h3>
                          <p className="text-sm text-[#64748B] mt-0.5 capitalize">
                            {item.category?.replace(/s$/, "").replace(/-/g, " ")} • {item.metal?.replace(/-/g, " ")}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-[#1E3A8A] whitespace-nowrap">
                          {item.priceDisplay || `$${item.price?.toLocaleString()}`}
                        </p>
                      </div>
                      <p className="text-sm text-[#64748B] mt-2 line-clamp-1">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        {item.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            item.badge === "Sale"
                              ? "bg-red-100 text-red-600"
                              : item.badge === "New"
                              ? "bg-green-100 text-green-600"
                              : item.badge === "Popular"
                              ? "bg-amber-100 text-amber-600"
                              : item.badge === "Premium"
                              ? "bg-purple-100 text-purple-600"
                              : item.badge === "Lab-Created"
                              ? "bg-emerald-100 text-emerald-600"
                              : item.badge === "Eco-Friendly"
                              ? "bg-teal-100 text-teal-600"
                              : "bg-[#DBEAFE] text-[#1E3A8A]"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToWishlist?.(item);
                          }}
                          disabled={togglingId === item.id}
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
              onClick={() => onItemClick?.(item)}
              className="group relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-[0_20px_50px_rgba(30,58,138,0.15)] transition-all duration-500 cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]"
                   onClick={() => onItemClick?.(item)}>
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  animate={{ scale: hoveredItem === item.id ? 1.1 : 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />

                {item.status && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${
                      item.status === 'available' || item.status === 'AVAILABLE'
                        ? 'bg-emerald-600 text-white'
                        : item.status === 'sold' || item.status === 'SOLD'
                        ? 'bg-red-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                )}

                {item.badge && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg ${
                      item.badge === "Sale"
                        ? "bg-red-500"
                        : item.badge === "New"
                        ? "bg-green-500"
                        : item.badge === "Popular"
                        ? "bg-amber-500"
                        : item.badge === "Premium"
                        ? "bg-purple-500"
                        : item.badge === "Lab-Created"
                        ? "bg-emerald-600"
                        : item.badge === "Eco-Friendly"
                        ? "bg-teal-500"
                        : "bg-[#1E3A8A]"
                    }`}
                  >
                    {item.badge}
                  </motion.div>
                )}

                <div
                  className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-100 sm:top-4 sm:right-4 md:opacity-0 md:group-hover:opacity-100"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWishlist?.(item);
                    }}
                    disabled={togglingId === item.id}
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
                    onClick={() => onQuickView?.(item)}
                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#64748B] hover:text-[#1E3A8A] hover:scale-110 transition-all duration-300"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                {/* Name */}
                <h3 className="mb-3 text-lg font-bold text-[#1E3A8A] transition-colors group-hover:text-[#1E40AF] line-clamp-2 uppercase">
                  {item.name}
                </h3>

                {/* Gram Value */}
                <div className="mb-3 flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-[#64748B]" />
                  <span className="text-xs text-[#0F172A] font-medium">
                    {item.weight && item.weight.toLowerCase() !== "noneg" ? `${item.weight}g` : "N/A"}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                  <div>
                    <p className="text-lg font-bold text-[#1E3A8A]">
                      {item.priceDisplay || `$${item.price?.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {showPagination && totalPages > 1 && sortedItems.length > 0 && (
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
              Page{" "}
              <span className="font-semibold text-[#1E3A8A]">{currentPage}</span>{" "}
              of{" "}
              <span className="font-semibold text-[#1E3A8A]">{totalPages}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JewelryGrid;