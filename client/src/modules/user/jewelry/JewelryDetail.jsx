import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  ZoomIn,
  Copy,
  X,
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
  Gem,
  Tag,
} from "lucide-react";

const JewelryDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [jewelry, setJewelry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const images = [
    `https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop`,
    `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop`,
    `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop`,
    `https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop`,
  ];

  // Mock data generator
  const getMockJewelry = (type, id) => {
    const categories = ["rings", "necklaces", "earrings", "bracelets"];
    const metals = ["yellow-gold", "white-gold", "rose-gold", "platinum"];
    const metalLabels = {
      "yellow-gold": "Yellow Gold",
      "white-gold": "White Gold",
      "rose-gold": "Rose Gold",
      "platinum": "Platinum",
    };
    const metalPurities = ["14K", "18K", "22K", "PT950"];

    const index = parseInt(id?.split("-").pop()) || 0;
    const category = categories[index % categories.length];
    const metal = metals[index % metals.length];
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
      name: jewelryNames[index % jewelryNames.length],
      category,
      price,
      metal,
      metalLabel: metalLabels[metal],
      metalPurity: metalPurities[index % metalPurities.length],
      description: `Beautiful ${metalLabels[metal]} ${category.slice(0, -1)} crafted with precision and elegance. Perfect for any occasion.`,
      imageDescription: `Premium ${metalLabels[metal]} ${category.slice(0, -1)} - shown from multiple angles`,
      image: images[index % images.length],
    };
  };

  useEffect(() => {
    setLoading(true);
    const fetchJewelry = async () => {
      try {
        const response = await fetch(`/api/jewelry/${type}/${id}`);
        if (response.ok) {
          const data = await response.json();
          setJewelry(data);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
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

  const getCategoryIcon = (category) => {
    const iconMap = {
      rings: "/diamond shap icon/round.svg",
      necklaces: "/diamond shap icon/oval.svg",
      earrings: "/diamond shap icon/pear.svg",
      bracelets: "/diamond shap icon/cub.svg",
    };
    return iconMap[category] || "/diamond shap icon/round.svg";
  };

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
        {/* Breadcrumb & Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center gap-4"
        >
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
            style={{ background: theme.surface, color: theme.textMuted, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = theme.primary; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.color = theme.textMuted; }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </motion.button>

          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-sm"
          >
            {["Jewelry", type?.replace(/-/g, " "), jewelry.name].map((item, i, arr) => (
              <span key={i} className="flex items-center gap-2">
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="capitalize"
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
          className="overflow-hidden rounded-3xl"
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
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-5">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  animate={floatingAnimation}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryLight} 100%)` }}
                >
                  <Crown className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold"
                    style={{ color: theme.secondary }}
                  >
                    {jewelry.name}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-2 mt-0.5"
                  >
                    <span className="text-sm font-mono" style={{ color: theme.textMuted }}>
                      SKU: {jewelry.id}
                    </span>
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex h-11 w-11 items-center justify-center rounded-full transition-all"
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
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShareModal(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-full transition-all"
                  style={{ 
                    background: theme.surface,
                    color: theme.textMuted,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = theme.primary; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.color = theme.textMuted; }}
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Left - Image Gallery */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4 p-6 lg:border-r"
              style={{ borderColor: theme.border }}
            >
              {/* Main Image */}
              <motion.div
                variants={itemVariants}
                className="relative aspect-square overflow-hidden rounded-2xl group cursor-zoom-in"
                style={{ background: `linear-gradient(135deg, ${theme.background} 0%, #E2E8F0 100%)` }}
                onMouseEnter={() => setIsImageZoomed(true)}
                onMouseLeave={() => setIsImageZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <motion.div
                  className="relative h-full w-full"
                  animate={isImageZoomed ? { scale: 1.5 } : { scale: 1 }}
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

                {/* Zoom Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isImageZoomed ? 0 : 1 }}
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium backdrop-blur-sm"
                  style={{ background: "rgba(255,255,255,0.9)", color: theme.text }}
                >
                  <ZoomIn className="h-4 w-4" />
                  Hover to zoom
                </motion.div>

                {/* Navigation Arrows */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: "rgba(255,255,255,0.9)", color: theme.text, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: "rgba(255,255,255,0.9)", color: theme.text, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>

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
                className="flex justify-center gap-3"
              >
                {images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImageIndex(idx)}
                    className="relative h-16 w-16 overflow-hidden rounded-xl transition-all"
                    style={{
                      opacity: activeImageIndex === idx ? 1 : 0.6,
                      boxShadow: activeImageIndex === idx ? `0 0 0 2px ${theme.primary}, 0 4px 12px rgba(0,0,0,0.1)` : "none"
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {activeImageIndex === idx && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0"
                        style={{ background: `${theme.primary}15` }}
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
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
                    className="mt-1 text-4xl font-bold"
                  >
                    ${jewelry.price.toLocaleString()}
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

              {/* Category */}
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
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textMuted }}>Category</p>
                </div>
                <p className="text-lg font-bold capitalize" style={{ color: theme.secondary }}>{jewelry.category}</p>
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

              {/* Metal Type */}
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
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: theme.textMuted }}>Metal Type</p>
                </div>
                <p className="text-lg font-bold" style={{ color: theme.secondary }}>{jewelry.metalLabel}</p>
                <p className="text-sm" style={{ color: theme.textMuted }}>{jewelry.metalPurity}</p>
              </motion.div>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
              style={{ background: theme.surface }}
            >
              <div 
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: `1px solid ${theme.border}` }}
              >
                <h3 className="text-lg font-semibold" style={{ color: theme.secondary }}>Share Jewelry</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShareModal(false)}
                  className="rounded-full p-1 transition-colors"
                  style={{ color: theme.textMuted }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.background = theme.background; 
                    e.currentTarget.style.color = theme.text; 
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.background = "transparent"; 
                    e.currentTarget.style.color = theme.textMuted; 
                  }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              <div className="p-6">
                <p className="mb-4 text-sm" style={{ color: theme.textMuted }}>Copy link to share this jewelry piece</p>
                <div className="flex gap-2">
                  <div 
                    className="flex-1 rounded-xl px-4 py-3 text-sm font-mono"
                    style={{ background: theme.background, color: theme.text }}
                  >
                    {window.location.href}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 font-medium transition-colors"
                    style={{ 
                      background: copied ? theme.success : theme.primary,
                      color: "#fff"
                    }}
                  >
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
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JewelryDetail;
