import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, Check, ChevronLeft, ChevronRight, Star, Diamond } from "lucide-react";

const ShowStock = ({ type, viewMode = "grid", sortBy = "featured", filters, searchQuery = "" }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const openDiamondDetail = (diamond) => {
    navigate(`/diamond/${type}/${diamond.id}`);
  };

  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/stock/${type}`);
        const data = await response.json();
        setItems(data || getMockData(type));
      } catch (error) {
        console.error("Error fetching stock:", error);
        setItems(getMockData(type));
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [type]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, searchQuery]);

  const getMockData = (category) => {
    const shapes = ["Round", "Oval", "Pear", "Cushion", "Emerald"];
    const whiteColors = ["D", "E", "F", "G", "H", "I", "J"];
    const fancyColors = ["Yellow", "Blue", "Pink", "Red", "Green", "Purple", "Orange", "Violet", "Gray", "Black", "Brown"];
    const fancyIntensities = ["Faint", "Very Light", "Light", "Fancy Light", "Fancy", "Fancy Dark", "Fancy Intense", "Fancy Vivid", "Fancy Deep"];
    const fancyOvertones = ["None", "Yellow", "Blue", "Pink", "Green", "Orange", "Brown", "Gray", "Purple", "Red"];
    const clarities = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1"];
    const cuts = ["Ideal", "Excellent", "Very Good", "Good"];
    const certifications = ["GIA", "IGI", "HRD"];
    const hasMedia = [true, false];

    return Array.from({ length: 24 }, (_, i) => {
      const caratMin = parseFloat((0.3 + Math.random() * 2).toFixed(2));
      const caratMax = parseFloat((caratMin + 0.5 + Math.random() * 2).toFixed(2));
      const priceMin = Math.floor(2000 + Math.random() * 30000);
      const priceMax = Math.floor(priceMin + 5000 + Math.random() * 50000);
      const isFancy = Math.random() > 0.7;
      return {
        id: `${category}-${i + 1}`,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        carat: parseFloat(((caratMin + caratMax) / 2).toFixed(2)),
        caratMin,
        caratMax,
        colorType: isFancy ? "Fancy" : "White",
        color: isFancy
          ? fancyColors[Math.floor(Math.random() * fancyColors.length)]
          : whiteColors[Math.floor(Math.random() * whiteColors.length)],
        fancyIntensity: isFancy ? fancyIntensities[Math.floor(Math.random() * fancyIntensities.length)] : null,
        fancyOvertone: isFancy ? fancyOvertones[Math.floor(Math.random() * fancyOvertones.length)] : null,
        clarity: clarities[Math.floor(Math.random() * clarities.length)],
        cut: cuts[Math.floor(Math.random() * cuts.length)],
        polish: cuts[Math.floor(Math.random() * cuts.length)],
        symmetry: cuts[Math.floor(Math.random() * cuts.length)],
        fluorescence: ["None", "Faint", "Medium"][Math.floor(Math.random() * 3)],
        price: Math.floor((priceMin + priceMax) / 2),
        priceMin,
        priceMax,
        certification: certifications[Math.floor(Math.random() * certifications.length)],
        certificationNumber: `CERT-${Math.floor(Math.random() * 1000000)}`,
        hasMedia: hasMedia[Math.floor(Math.random() * hasMedia.length)],
        image: `https://images.unsplash.com/photo-${['1605100804763-247f67b3557e', '1515377905703-c4788e51af15', '1573408301185-9146fe634ad0', '1603561591411-07134e71a2a9'][i % 4]}?w=600&h=600&fit=crop`,
        badge: i % 3 === 0 ? "GIA Certified" : i % 4 === 0 ? "Available" : null,
        available: Math.random() > 0.2,
        table: Math.floor(54 + Math.random() * 10),
        depth: Math.floor(59 + Math.random() * 8),
      };
    });
  };

  const toggleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "carat-low":
        return a.carat - b.carat;
      case "carat-high":
        return b.carat - a.carat;
      case "color":
        return a.color.localeCompare(b.color);
      default:
        return 0;
    }
  });

  const filteredItems = sortedItems.filter((item) => {
    // Search query filter
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase();
      const searchText = `${item.shape} ${item.carat} ${item.color} ${item.clarity} ${item.cut} ${item.certification}`.toLowerCase();
      if (!searchText.includes(query)) return false;
    }
    // All other filters
    if (filters?.shapes?.length > 0 && !filters.shapes.some(s => s.toLowerCase() === item.shape.toLowerCase())) return false;

    // Color Type filter
    if (filters?.colorType && item.colorType !== filters.colorType) return false;

    // Color Grade filter - handle both White and Fancy colors
    if (filters?.colors?.length > 0 && !filters.colors.includes(item.color)) return false;

    // Fancy Intensity filter
    if (filters?.fancyIntensity && item.fancyIntensity !== filters.fancyIntensity) return false;

    // Fancy Overtone filter
    if (filters?.fancyOvertone && item.fancyOvertone !== filters.fancyOvertone) return false;

    if (filters?.clarities?.length > 0 && !filters.clarities.includes(item.clarity)) return false;
    if (filters?.cuts?.length > 0 && !filters.cuts.includes(item.cut)) return false;
    if (filters?.polish?.length > 0 && !filters.polish.includes(item.polish)) return false;
    if (filters?.symmetry?.length > 0 && !filters.symmetry.includes(item.symmetry)) return false;
    if (filters?.certifications?.length > 0 && !filters.certifications.includes(item.certification)) return false;
    if (filters?.certificateType === 'certified' && (!item.certification || item.certification === 'None')) return false;
    if (filters?.certificateType === 'non-certified' && item.certification && item.certification !== 'None') return false;
    if (filters?.available && !item.available) return false;
    if (filters?.showOnlyMedia && !item.hasMedia) return false;
    if (filters?.caratMin && item.carat < parseFloat(filters.caratMin)) return false;
    if (filters?.caratMax && item.carat > parseFloat(filters.caratMax)) return false;
    if (filters?.priceMin && item.price < parseFloat(filters.priceMin)) return false;
    if (filters?.priceMax && item.price > parseFloat(filters.priceMax)) return false;
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  if (filteredItems.length === 0) {
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
          {Math.min(currentPage * itemsPerPage, filteredItems.length)} of{" "}
          <span className="text-[#0F172A] font-medium">{filteredItems.length}</span> diamonds
        </span>
      </div>

      {/* Diamond Grid or List View */}
      {viewMode === "list" ? (
        // List View
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr_1.5fr] gap-3 px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] text-sm font-semibold text-[#475569]">
            <div>Shape</div>
            <div>Carat</div>
            <div>Color</div>
            <div>Clarity</div>
            <div>Cut</div>
            <div>Polish</div>
            <div>Symmetry</div>
            <div>Fluor</div>
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
                <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr_1.5fr] gap-3 px-6 py-4 items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] flex items-center justify-center overflow-hidden cursor-pointer"
                        onClick={() => openDiamondDetail(item)}
                      >
                        <img
                          src={item.image}
                          alt={item.shape}
                          className="w-10 h-10 object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0F172A]">{item.shape}</p>
                        {item.badge && (
                          <span className="text-xs text-[#1E3A8A] bg-[#DBEAFE] px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-[#0F172A]">{item.carat}ct</span>
                  </div>
                  <div>
                    <span className={`font-medium ${item.colorType === "Fancy" ? "text-pink-600" : "text-[#0F172A]"}`}>
                      {item.colorType === "Fancy" && item.fancyIntensity ? `${item.fancyIntensity} ` : ""}
                      {item.color}
                      {item.fancyOvertone && item.fancyOvertone !== "None" ? `/${item.fancyOvertone}` : ""}
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
                    <div className="flex flex-col">
                      <span className="font-medium text-[#0F172A]">{item.certification}</span>
                      <span className="text-xs text-[#64748B]">{item.certificationNumber}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#1E3A8A]">${item.price.toLocaleString()}</p>
                    {item.available && (
                      <span className="text-xs text-green-600 font-medium">Available</span>
                    )}
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="lg:hidden p-4">
                  <div className="flex gap-4">
                    <div
                      className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] flex-shrink-0 overflow-hidden cursor-pointer"
                      onClick={() => openDiamondDetail(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.shape}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
                        <span className="text-xs text-[#64748B]">{item.certification} · {item.certificationNumber}</span>
                        {item.available && (
                          <span className="text-xs text-green-600 font-medium">Available</span>
                        )}
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
              className="group relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-[0_20px_50px_rgba(30,58,138,0.15)] transition-all duration-500"
            >
              {/* Image Container - Aspect Square like JewelryGrid */}
              <div
                className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] cursor-pointer"
                onClick={() => openDiamondDetail(item)}
              >
                <motion.img
                  src={item.image}
                  alt={`${item.shape} Diamond`}
                  className="w-full h-full object-cover"
                  animate={{ scale: hoveredItem === item.id ? 1.1 : 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: hoveredItem === item.id ? 1 : 0,
                    y: hoveredItem === item.id ? 0 : 10,
                  }}
                  className="absolute top-4 right-4 flex flex-col gap-2"
                >
                  <button className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#64748B] hover:text-red-500 hover:scale-110 transition-all duration-300">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openDiamondDetail(item)}
                    className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#64748B] hover:text-[#1E3A8A] hover:scale-110 transition-all duration-300"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </motion.div>

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
                  {item.cut} Cut · {item.polish} Polish · {item.symmetry} Symmetry · {item.fluorescence}
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
