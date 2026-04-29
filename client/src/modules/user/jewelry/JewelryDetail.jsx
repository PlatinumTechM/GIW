import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
  Gem,
  Tag,
  CheckCircle2,
  Box,
  Weight,
  Palette,
  Droplet,
  Scissors,
  Layers,
  Calendar,
  Hash,
  Play,
  Video,
  Menu,
  Share2,
  Mail,
  Copy,
} from "lucide-react";
import { jewelryAPI } from "../../../services/api.js";

const JewelryDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [jewelry, setJewelry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setCopied(false);
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      const textarea = document.createElement("textarea");
      textarea.value = window.location.href;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      console.error("Clipboard fallback used:", err);
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Check out this jewelry: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this jewelry`);
    const body = encodeURIComponent(`Check out this jewelry: ${window.location.href}`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank", "noopener,noreferrer");
  };


  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };

  const getImages = (jewelryData) => {
    const images = [];
    if (jewelryData?.jewellery_image1) images.push(jewelryData.jewellery_image1);
    if (jewelryData?.jewellery_image2) images.push(jewelryData.jewellery_image2);
    if (jewelryData?.jewellery_image3) images.push(jewelryData.jewellery_image3);
    if (jewelryData?.jewellery_image4) images.push(jewelryData.jewellery_image4);
    if (jewelryData?.jewellery_image5) images.push(jewelryData.jewellery_image5);
    return images.length > 0 ? images : [
      // `https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop`,
    ];
  };

  // Mock data generator - matches jewellery_stock table structure
  const getMockJewelry = (type, id) => {
    const categories = ["rings", "necklaces", "earrings", "bracelets"];
    const materials = ["Yellow Gold", "White Gold", "Rose Gold", "Platinum", "Silver"];
    const diamondTypes = ["Natural", "Lab Grown"];
    const diamondShapes = ["Round", "Princess", "Cushion", "Oval", "Emerald", "Pear", "Marquise"];
    const diamondColors = ["D", "E", "F", "G", "H", "I", "J"];
    const diamondClarity = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
    const diamondCuts = ["Excellent", "Very Good", "Good", "Fair"];
    const diamondGrowth = ["CVD", "HPHT"];
    const statuses = ["available", "sold", "reserved"];

    const index = parseInt(id?.split("-").pop()) || 0;
    const category = categories[index % categories.length];
    const material = materials[index % materials.length];
    const price = Math.floor(1000 + Math.random() * 15000);

    const jewelryNames = [
      "Royal Diamond Ring",
      "Eternal Love Necklace",
      "Celestial Earrings",
      "Golden Era Bracelet",
      "Sapphire Dream Ring",
      "Pearl Majesty Necklace",
      "Emerald Drop Earrings",
      "Infinity Diamond Bracelet",
    ];

    return {
      id: id || `${type}-1`,
      stock_id: `STK-${1000 + index}`,
      name: jewelryNames[index % jewelryNames.length],
      category,
      type: type || "jewelry",
      material,
      weight: (2.5 + Math.random() * 8).toFixed(3),
      diamond_type: diamondTypes[index % diamondTypes.length],
      diamond_shape: diamondShapes[index % diamondShapes.length],
      diamond_weight: (0.3 + Math.random() * 2).toFixed(3),
      diamond_color: diamondColors[index % diamondColors.length],
      diamond_clarity: diamondClarity[index % diamondClarity.length],
      diamond_cut: diamondCuts[index % diamondCuts.length],
      diamond_growth: diamondGrowth[index % diamondGrowth.length],
      price,
      status: statuses[index % statuses.length],
      description: `Beautiful ${material} ${category.slice(0, -1)} crafted with precision and elegance. Perfect for any occasion.`,
      jewellery_image1: `https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop`,
      jewellery_image2: `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop`,
      jewellery_image3: null,
      jewellery_image4: null,
      jewellery_image5: null,
      jewellery_video: `https://www.w3schools.com/html/mov_bbb.mp4`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  useEffect(() => {
    setLoading(true);
    const fetchJewelry = async () => {
      try {
        const response = await jewelryAPI.getJewelryById(id);
        if (response.success && response.data) {
          setJewelry(response.data);
        } else {
          setJewelry(getMockJewelry(type, id));
        }
      } catch (error) {
        console.error("Error fetching jewelry:", error);
        setJewelry(getMockJewelry(type, id));
      } finally {
        setLoading(false);
      }
    };
    fetchJewelry();
  }, [type, id]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const images = getImages(jewelry);

  const nextImage = () => {
    if (isVideoActive) {
      setIsVideoActive(false);
      setActiveImageIndex(0);
    } else if (activeImageIndex === images.length - 1 && jewelry.jewellery_video) {
      setIsVideoActive(true);
    } else {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (isVideoActive) {
      setIsVideoActive(false);
      setActiveImageIndex(images.length - 1);
    } else if (activeImageIndex === 0 && jewelry.jewellery_video) {
      setIsVideoActive(true);
    } else if (activeImageIndex === 0) {
      setActiveImageIndex(images.length - 1);
    } else {
      setActiveImageIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-4 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-10 w-24 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300"
              />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="h-6 w-48 rounded-lg bg-gradient-to-r from-slate-200 to-slate-300"
              />
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="aspect-square rounded-3xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200"
              />
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="h-24 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!jewelry) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const cardHoverVariants = {
    rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(30, 58, 138, 0.15), 0 10px 10px -5px rgba(30, 58, 138, 0.1)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const floatingAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Theme colors
  const theme = {
    primary: "#1E3A8A",
    primaryLight: "#3B82F6",
    secondary: "#0F172A",
    accent: "#F59E0B",
    success: "#10B981",
    danger: "#EF4444",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#1E293B",
    textMuted: "#64748B",
    border: "#E2E8F0",
  };

  return (
    <div className="min-h-screen pt-4 pb-16" style={{ background: `linear-gradient(135deg, ${theme.background} 0%, #FFFFFF 50%, #F1F5F9 100%)` }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile Back Button with Favorite */}
        <div className="mb-4 sm:hidden flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-2)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
            style={{ background: theme.surface, color: theme.textMuted, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = theme.primary; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.color = theme.textMuted; }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShareClick}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-all"
              style={{
                background: theme.surface,
                color: theme.textMuted,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-all"
              style={{
                background: isLiked ? theme.danger : theme.surface,
                color: isLiked ? "#fff" : theme.textMuted,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`h-5 w-5 ${isLiked && "fill-current"}`} />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb & Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 hidden sm:flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          onClick={() => navigate(-2)}
        >
          <button
            className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all cursor-pointer hover:scale-105 active:scale-95 hover:-translate-x-0.5"
            style={{ background: theme.surface, color: theme.textMuted, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = theme.primary; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.color = theme.textMuted; }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>

          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-sm flex-wrap"
          >
            {[].map((item, i, arr) => (
              <span key={i} className="flex items-center gap-2">
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="capitalize truncate max-w-[120px] sm:max-w-none"
                  style={{
                    color: i === arr.length - 1 ? theme.primary : theme.textMuted,
                    fontWeight: i === arr.length - 1 ? 600 : 400
                  }}
                >
                  {item}
                </motion.span>
                {i < arr.length - 1 && (
                  <span style={{ color: theme.border }}>/</span>
                )}
              </span>
            ))}
          </motion.nav>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-visible sm:overflow-hidden rounded-3xl"
          style={{
            background: "transparent",
            boxShadow: "0 25px 50px -12px rgba(30, 58, 138, 0.15), 0 0 0 1px rgba(30, 58, 138, 0.05)"
          }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden px-8 py-6"
            style={{
              background: "transparent",
              borderBottom: `1px solid ${theme.border}`
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}08, transparent)` }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  animate={floatingAnimation}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryLight} 100%)` }}
                >
                  <Crown className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: theme.secondary }}
                  >
                    {jewelry.name}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-2 sm:gap-3 mt-0.5 flex-wrap"
                  >
                    <span className="text-xs sm:text-sm font-mono" style={{ color: theme.textMuted }}>
                      Stock ID: {jewelry.stock_id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: jewelry.status === 'available' ? `${theme.success}20` : jewelry.status === 'sold' ? `${theme.danger}20` : `${theme.accent}20`,
                        color: jewelry.status === 'available' ? theme.success : jewelry.status === 'sold' ? theme.danger : theme.accent,
                      }}
                    >
                      {jewelry.status}
                    </span>
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShareClick}
                  className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full transition-all"
                  style={{
                    background: theme.surface,
                    color: theme.textMuted,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full transition-all"
                  style={{
                    background: isLiked ? theme.danger : theme.surface,
                    color: isLiked ? "#fff" : theme.textMuted,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                >
                  <motion.div
                    animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className={`h-5 w-5 ${isLiked && "fill-current"}`} />
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="grid gap-0 lg:grid-cols-2 grid-cols-1">
            {/* Left - Image Gallery */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4 p-4 sm:p-6 lg:border-r w-full"
              style={{ borderColor: theme.border }}
            >
              {/* Main Image or Video */}
              <motion.div
                variants={itemVariants}
                className="relative aspect-square sm:aspect-square md:aspect-square lg:aspect-square overflow-hidden rounded-2xl group w-full"
                style={{ background: `linear-gradient(135deg, ${theme.background} 0%, #E2E8F0 100%)` }}
                onMouseEnter={() => !isVideoActive && setIsImageZoomed(true)}
                onMouseLeave={() => setIsImageZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                {isVideoActive && jewelry.jewellery_video ? (
                  <div className="relative w-full h-full bg-black">
                    {getYouTubeEmbedUrl(jewelry.jewellery_video) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(jewelry.jewellery_video)}
                        title="Jewelry Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <video
                        src={jewelry.jewellery_video}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ) : (
                  <motion.div
                    className="relative h-full w-full"
                    animate={isImageZoomed ? { scale: 1.2 } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    }}
                  >
                    <motion.img
                      key={activeImageIndex}
                      src={images[activeImageIndex]}
                      alt={jewelry.name}
                      className="h-full w-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                )}

                {/* Zoom Indicator - only for images */}
                {!isVideoActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isImageZoomed ? 0 : 1 }}
                    className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium backdrop-blur-sm"
                    style={{ background: "rgba(255,255,255,0.9)", color: theme.text }}
                  >
                    <ZoomIn className="h-4 w-4" />
                    Hover to zoom
                  </motion.div>
                )}

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer hover:scale-110 active:scale-90"
                  style={{ background: "rgba(255,255,255,0.9)", color: theme.text, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer hover:scale-110 active:scale-90"
                  style={{ background: "rgba(255,255,255,0.9)", color: theme.text, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

              </motion.div>

              {/* Image Description */}
              <motion.div
                variants={itemVariants}
                className="text-center px-4"
              >
                <p className="text-sm italic" style={{ color: theme.textMuted }}>
                  {jewelry.imageDescription}
                </p>
              </motion.div>

              {/* Thumbnails */}
              <motion.div
                variants={itemVariants}
                className="flex justify-start md:justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 px-2 snap-x"
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setIsVideoActive(false);
                    }}
                    className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-xl transition-all cursor-pointer hover:scale-110 active:scale-95 hover:-translate-y-0.5"
                    style={{
                      opacity: !isVideoActive && activeImageIndex === idx ? 1 : 0.6,
                      boxShadow: !isVideoActive && activeImageIndex === idx ? `0 0 0 2px ${theme.primary}, 0 4px 12px rgba(0,0,0,0.1)` : "none"
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {!isVideoActive && activeImageIndex === idx && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0"
                        style={{ background: `${theme.primary}15` }}
                      />
                    )}
                  </button>
                ))}

                {/* Video Thumbnail */}
                {jewelry.jewellery_video && (
                  <button
                    onClick={() => {
                      setActiveImageIndex(0);
                      setIsVideoActive(true);
                    }}
                    className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-xl transition-all flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 hover:-translate-y-0.5"
                    style={{
                      opacity: isVideoActive ? 1 : 0.6,
                      boxShadow: isVideoActive ? `0 0 0 2px ${theme.primary}, 0 4px 12px rgba(0,0,0,0.1)` : "none",
                      background: `${theme.primary}15`
                    }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Play className="h-6 w-6" style={{ color: theme.primary }} />
                      <span className="text-[8px] mt-0.5" style={{ color: theme.primary }}>Video</span>
                    </div>
                    {isVideoActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0"
                        style={{ background: `${theme.primary}15` }}
                      />
                    )}
                  </button>
                )}
              </motion.div>
              {/* Supplier Details */}
              {jewelry.supplier && jewelry.supplier.id && (
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  variants={cardHoverVariants}
                  className="rounded-xl p-5 transition-all"
                  style={{
                    background: "transparent",
                    border: `1px solid ${theme.border}`
                  }}
                >
                  <h3 className="mb-4 flex items-center gap-2 font-semibold" style={{ color: theme.secondary }}>
                    <Box className="h-5 w-5" style={{ color: theme.primary }} />
                    Supplier Details
                  </h3>
                  <div className="space-y-3">
                    {jewelry.supplier.company && (
                      <div className="flex items-start justify-between pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <span style={{ color: theme.textMuted }}>Company Name</span>
                        <span className="font-semibold text-right" style={{ color: theme.secondary }}>{jewelry.supplier.company}</span>
                      </div>
                    )}
                    {jewelry.supplier.email && (
                      <div className="flex items-start justify-between pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <span style={{ color: theme.textMuted }}>Email</span>
                        <span className="font-semibold text-right truncate" style={{ color: theme.secondary }}>{jewelry.supplier.email}</span>
                      </div>
                    )}
                    {jewelry.supplier.gst && (
                      <div className="flex items-start justify-between pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <span style={{ color: theme.textMuted }}>GST Number</span>
                        <span className="font-semibold text-right" style={{ color: theme.secondary }}>{jewelry.supplier.gst}</span>
                      </div>
                    )}
                    {jewelry.supplier.address && (
                      <div className="flex items-start justify-between pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <span style={{ color: theme.textMuted }}>Address</span>
                        <span className="font-semibold text-right max-w-xs" style={{ color: theme.secondary }}>{jewelry.supplier.address}</span>
                      </div>
                    )}
                    {jewelry.supplier.phone && (
                      <div className="flex items-start justify-between pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <span style={{ color: theme.textMuted }}>Phone</span>
                        <span className="font-semibold text-right" style={{ color: theme.secondary }}>{jewelry.supplier.phone}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right - Details */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5 p-6 overflow-visible"
            >
              {/* Title & Category Info */}
              <motion.div variants={itemVariants} className="space-y-3">
                <span className="text-sm font-medium capitalize" style={{ color: theme.textMuted }}>
                  {jewelry.category} • {jewelry.metalLabel}
                </span>
              </motion.div>

              {/* Price Card */}
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={cardHoverVariants}
                className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryLight} 50%, ${theme.primary} 100%)`,
                  boxShadow: `0 20px 40px -15px ${theme.primary}40`
                }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                />
                {/* Secondary Shimmer */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)" }}
                  animate={{ x: ["100%", "-100%"], y: ["-100%", "100%"] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
                />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <motion.div
                      animate={pulseAnimation}
                    >
                      <Sparkles className="h-4 w-4" style={{ color: "rgba(255,255,255,0.8)" }} />
                    </motion.div>
                    <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Price</p>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="mt-1 text-3xl sm:text-4xl font-bold"
                  >
                    ${Number(jewelry.price).toLocaleString('en-IN')}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-2 text-xs"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    Includes certification & authentication
                  </motion.p>
                </div>
              </motion.div>

              {/* Category & Type */}
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={cardHoverVariants}
                className="rounded-xl p-4 transition-colors"
                style={{
                  background: "transparent",
                  border: `1px solid ${theme.border}`
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4" style={{ color: theme.primary }} />
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textMuted }}>Category & Type</p>
                </div>
                <p className="text-lg font-bold capitalize" style={{ color: theme.secondary }}>{jewelry.category}</p>
                <p className="text-sm" style={{ color: theme.textMuted }}>{jewelry.type}</p>
              </motion.div>

              {/* Description */}
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={cardHoverVariants}
                className="rounded-xl p-4 transition-colors"
                style={{
                  background: "transparent",
                  border: `1px solid ${theme.border}`
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4" style={{ color: theme.primary }} />
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textMuted }}>Description</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: theme.secondary }}>{jewelry.description || jewelry.imageDescription}</p>
              </motion.div>

              {/* Material & Weight */}
              <motion.div
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={cardHoverVariants}
                className="rounded-xl p-4 transition-colors"
                style={{
                  background: "transparent",
                  border: `1px solid ${theme.border}`
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Gem className="h-4 w-4" style={{ color: theme.primary }} />
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textMuted }}>Material</p>
                </div>
                <p className="text-lg font-bold" style={{ color: theme.secondary }}>{jewelry.material || "None"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Weight className="h-4 w-4" style={{ color: theme.textMuted }} />
                  <p className="text-sm" style={{ color: theme.textMuted }}>{jewelry.weight && jewelry.weight.toLowerCase() !== "noneg" ? `${jewelry.weight} grams` : "N/A"}</p>
                </div>
              </motion.div>

              {/* Diamond Details */}
              {(jewelry.diamond_type || jewelry.diamond_shape || jewelry.diamond_weight) && (
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  variants={cardHoverVariants}
                  className="rounded-xl p-4 transition-colors"
                  style={{
                    background: "transparent",
                    border: `1px solid ${theme.border}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4" style={{ color: theme.primary }} />
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textMuted }}>Diamond Details</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {jewelry.diamond_type && (
                      <div>
                        <p className="text-xs" style={{ color: theme.textMuted }}>Type</p>
                        <p className="text-sm font-semibold" style={{ color: theme.secondary }}>{jewelry.diamond_type || "None"}</p>
                      </div>
                    )}
                    {jewelry.diamond_shape && (
                      <div>
                        <p className="text-xs" style={{ color: theme.textMuted }}>Shape</p>
                        <p className="text-sm font-semibold capitalize" style={{ color: theme.secondary }}>{jewelry.diamond_shape || "None"}</p>
                      </div>
                    )}
                    {jewelry.diamond_weight && (
                      <div>
                        <p className="text-xs" style={{ color: theme.textMuted }}>Weight</p>
                        <p className="text-sm font-semibold" style={{ color: theme.secondary }}>{jewelry.diamond_weight.toString().toLowerCase() !== "noneg" ? `${jewelry.diamond_weight} ct` : "N/A"}</p>
                      </div>
                    )}
                    {jewelry.diamond_color && (
                      <div>
                        <p className="text-xs" style={{ color: theme.textMuted }}>Color</p>
                        <p className="text-sm font-semibold" style={{ color: theme.secondary }}>{jewelry.diamond_color || "None"}</p>
                      </div>
                    )}
                    {jewelry.diamond_clarity && (
                      <div>
                        <p className="text-xs" style={{ color: theme.textMuted }}>Clarity</p>
                        <p className="text-sm font-semibold" style={{ color: theme.secondary }}>{jewelry.diamond_clarity || "None"}</p>
                      </div>
                    )}
                    {jewelry.diamond_cut && (
                      <div>
                        <p className="text-xs" style={{ color: theme.textMuted }}>Cut</p>
                        <p className="text-sm font-semibold" style={{ color: theme.secondary }}>{jewelry.diamond_cut || "None"}</p>
                      </div>
                    )}
                  </div>
                  {jewelry.diamond_growth && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.border }}>
                      <p className="text-xs" style={{ color: theme.textMuted }}>Growth Method</p>
                      <p className="text-sm font-semibold" style={{ color: theme.secondary }}>{jewelry.diamond_growth}</p>
                    </div>
                  )}
                </motion.div>
              )}


            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md"
            onClick={closeShareModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.86, y: 28, rotateX: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 18, rotateX: -6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white/95 p-6 text-center shadow-[0_25px_80px_rgba(15,23,42,0.28)] ring-1 ring-white/70"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl"
                animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.9, 0.55] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-purple-500/10 blur-2xl"
                animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.85, 0.45] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.button
                type="button"
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeShareModal();
                }}
                className="absolute right-5 top-5 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-400 shadow-sm backdrop-blur-md transition-all hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close share modal"
              >
                <X className="h-5 w-5 pointer-events-none" />
              </motion.button>

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 text-[#1E3A8A] shadow-sm"
                >
                  <Share2 className="h-5 w-5" />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="text-2xl font-bold text-slate-900"
                >
                  Share This Product
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="mt-1 text-sm text-slate-500"
                >
                  Send this product link quickly
                </motion.p>

                <div className="mt-7 flex justify-center gap-5">
                  <motion.button
                    whileHover={{ y: -4, scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={shareViaWhatsApp}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-[0_14px_30px_rgba(37,211,102,0.35)] transition-all group-hover:shadow-[0_18px_38px_rgba(37,211,102,0.45)]">
                      <motion.span
                        className="absolute inset-0 rounded-2xl bg-white/20"
                        animate={{ opacity: [0, 0.45, 0], scale: [0.75, 1.16, 1.28] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                      />
                      <svg className="relative h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-600 transition-colors group-hover:text-slate-900">WhatsApp</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -4, scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={shareViaEmail}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EA4335] text-white shadow-[0_14px_30px_rgba(234,67,53,0.35)] transition-all group-hover:shadow-[0_18px_38px_rgba(234,67,53,0.45)]">
                      <motion.span
                        className="absolute inset-0 rounded-2xl bg-white/20"
                        animate={{ opacity: [0, 0.45, 0], scale: [0.75, 1.16, 1.28] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                      />
                      <Mail className="relative h-7 w-7" />
                    </div>
                    <span className="text-sm font-semibold text-slate-600 transition-colors group-hover:text-slate-900">Gmail</span>
                  </motion.button>
                </div>

                <div className="relative my-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-slate-500">Or copy the link</span>
                  </div>
                </div>

                <motion.div
                  animate={copied ? { scale: [1, 1.02, 1], borderColor: ["#E2E8F0", "#10B981", "#E2E8F0"] } : {}}
                  transition={{ duration: 0.55 }}
                  className="relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/90 p-1.5 pl-4 shadow-inner"
                >
                  <motion.div
                    animate={copied ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.45 }}
                    className="mr-2 text-slate-400"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                  </motion.div>

                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-600 outline-none"
                  />

                  <motion.button
                    type="button"
                    onClick={handleCopyShareLink}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.92 }}
                    animate={copied ? { background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" } : { background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)" }}
                    className="relative ml-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25"
                  >
                    {copied && (
                      <motion.span
                        className="absolute inset-0 bg-white/25"
                        initial={{ x: "-100%" }}
                        animate={{ x: "120%" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.div>

                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 ring-1 ring-emerald-100"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Link copied successfully
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JewelryDetail;
