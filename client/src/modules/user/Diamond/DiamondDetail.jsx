import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  Diamond,
  Scale,
  Shield,
  CheckCircle2,
  FileCheck,
  Copy,
  MapPin,
  Ruler,
  Gem,
  Sparkles,
  Eye,
  Mail,
  X,
} from "lucide-react";
import { stockAPI } from "../../../services/api.js";

const DiamondDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diamond, setDiamond] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Check out this diamond: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this diamond`);
    const body = encodeURIComponent(`Check out this diamond: ${window.location.href}`);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank", "noopener,noreferrer");
  };

  // Calculate available media types based on available URLs
  const getAvailableMediaTypes = (stock) => {
    const mediaTypes = [];

    // Check for images (diamond_image1-5)
    const hasImages = [
      stock.diamond_image1,
      stock.diamond_image2,
      stock.diamond_image3,
      stock.diamond_image4,
      stock.diamond_image5,
    ].some(img => img && img.trim() !== "");

    if (hasImages) mediaTypes.push("Photo");

    // Check for video
    const hasVideo = stock.diamond_video && stock.diamond_video.trim() !== "" && stock.diamond_video.toUpperCase() !== "NONE";
    if (hasVideo) mediaTypes.push("Video");

    // Check for certificate
    const hasCertificate = stock.certificate_image && stock.certificate_image.trim() !== "" && stock.certificate_image.toUpperCase() !== "NONE";
    if (hasCertificate) mediaTypes.push("Certificate");

    // Return formatted string
    if (mediaTypes.length === 0) return "None";
    if (mediaTypes.length === 1) return mediaTypes[0] + " Only";
    if (mediaTypes.length === 2) return mediaTypes.join(" + ");
    return mediaTypes.slice(0, -1).join(", ") + " & " + mediaTypes[mediaTypes.length - 1];
  };

  // Map backend data to frontend format (same as ShowStock)
  const mapDiamondData = (stock) => {
    return {
      id: stock.id,
      stockId: stock.stock_id,
      shape: stock.shape,
      carat: parseFloat(stock.weight),
      colorType: stock.fancy_color ? "Fancy" : "White",
      color: stock.color || stock.fancy_color,
      fancyIntensity: stock.fancy_color_intensity,
      fancyOvertone: stock.fancy_color_overtone,
      clarity: stock.clarity,
      cut: stock.cut,
      polish: stock.polish,
      symmetry: stock.symmetry,
      fluorescence: stock.fluorescence,
      price: Math.floor(stock.price_per_carat),
      finalPrice: stock.final_price ? Math.floor(stock.final_price) : null,
      discount: stock.discount || null,
      certification: stock.lab,
      certificationNumber: stock.certificate_number,
      status: stock.status,
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
      fluorescenceColor: stock.fluorescence_color || null,
      fluorescenceIntensity: stock.fluorescence_intensity || null,
      treatment: stock.treatment || null,
      heartArrow: stock.heart_arrow || null,
      laserDescription: stock.laser_description || null,
      growthType: stock.growth_type || null,
      keyToSymbol: stock.key_to_symbol || null,
      lwRatio: stock.lw_ratio || null,
      culetCondition: stock.culet_condition || null,
      location: stock.city || "None",
      state: stock.state || null,
      country: stock.country || null,
      certificateImage: stock.certificate_image && stock.certificate_image.trim() !== "" && stock.certificate_image.toUpperCase() !== "NONE" ? stock.certificate_image : null,
      video360: stock.diamond_video && stock.diamond_video.trim() !== "" && stock.diamond_video.toUpperCase() !== "NONE" ? stock.diamond_video : null,
      // Fancy color fields
      fancyColor: stock.fancy_color || null,
      colorIntensity: stock.color_intensity || stock.fancy_color_intensity || null,
      colorOvertone: stock.color_overtone || stock.fancy_color_overtone || null,
      // Media fields
      diamondImage1: stock.diamond_image1,
      diamondImage2: stock.diamond_image2,
      diamondImage3: stock.diamond_image3,
      diamondImage4: stock.diamond_image4,
      diamondImage5: stock.diamond_image5,
      mediaAvailable: getAvailableMediaTypes(stock),
      party: stock.party,
      supplierCompany: stock.supplier_company,
      supplierAddress: stock.supplier_address,
      supplierGst: stock.supplier_gst,
      supplierEmail: stock.supplier_email,
      supplierPhone: stock.supplier_phone,
    };
  };

  useEffect(() => {
    setLoading(true);
    const fetchDiamond = async () => {
      try {
        const response = await stockAPI.getStockById(id);
        if (response.success && response.data) {
          setDiamond(mapDiamondData(response.data));
        } else {
          setDiamond(null);
        }
      } catch (error) {
        console.error("Error fetching diamond:", error);
        setDiamond(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDiamond();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  if (!diamond) return null;

  const getShapeIcon = (shape) => {
    const shapeMap = {
      ROUND: "/diamond shap icon/round.svg",
      OVAL: "/diamond shap icon/oval.svg",
      PEAR: "/diamond shap icon/pear.svg",
      PRINCESS: "/diamond shap icon/princess.svg",
      EMERALD: "/diamond shap icon/emerald.svg",
      CUSHION: "/diamond shap icon/cub.svg",
      MARQUISE: "/diamond shap icon/marquise.svg",
      HEART: "/diamond shap icon/heart.svg",
      RADIANT: "/diamond shap icon/radiant.svg",
      BAGUETTE: "/diamond shap icon/Baguette.svg",
      HEXAGONAL: "/diamond shap icon/Hexagonal.svg",
      "SQUARE EMERALD": "/diamond shap icon/Square Emerald.svg",
      BRIOLETTE: "/diamond shap icon/Briolette.svg",
      TRILLIANT: "/diamond shap icon/Trilliant.svg",
      "HALF MOON": "/diamond shap icon/half moon.svg",
      "ROSE CUT": "/diamond shap icon/rose cut.svg",
      KITE: "/diamond shap icon/kite.svg",
      OTHER: "/diamond shap icon/other.svg",
    };
    const normalizedShape = shape ? shape.toUpperCase().trim() : "OTHER";
    return shapeMap[normalizedShape] || "/diamond shap icon/other.svg";
  };

  const getGradeStyles = (grade, type) => {
    const styles = {
      color: {
        D: "from-emerald-500 to-emerald-600 shadow-emerald-200",
        E: "from-emerald-500 to-emerald-600 shadow-emerald-200",
        F: "from-emerald-500 to-emerald-600 shadow-emerald-200",
        G: "from-blue-500 to-blue-600 shadow-blue-200",
        H: "from-blue-500 to-blue-600 shadow-blue-200",
        I: "from-amber-500 to-amber-600 shadow-amber-200",
        J: "from-amber-500 to-amber-600 shadow-amber-200",
      },
      clarity: {
        FL: "from-emerald-500 to-emerald-600 shadow-emerald-200",
        IF: "from-emerald-500 to-emerald-600 shadow-emerald-200",
        VVS1: "from-blue-500 to-blue-600 shadow-blue-200",
        VVS2: "from-blue-500 to-blue-600 shadow-blue-200",
        VS1: "from-blue-500 to-blue-600 shadow-blue-200",
        VS2: "from-amber-500 to-amber-600 shadow-amber-200",
        SI1: "from-amber-500 to-amber-600 shadow-amber-200",
      },
      cut: {
        Ideal: "from-emerald-500 to-emerald-600 shadow-emerald-200",
        Excellent: "from-emerald-500 to-emerald-600 shadow-emerald-200",
        "Very Good": "from-blue-500 to-blue-600 shadow-blue-200",
        Good: "from-amber-500 to-amber-600 shadow-amber-200",
      },
    };
    return styles[type]?.[grade] || "from-slate-500 to-slate-600 shadow-slate-200";
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
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
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
                  <Diamond className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold"
                    style={{ color: theme.secondary }}
                  >
                    {diamond.shape} {diamond.carat}ct {diamond.color} {diamond.clarity}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm font-mono mt-0.5"
                    style={{ color: theme.textMuted }}
                  >
                    SKU: {diamond.id}
                  </motion.p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShareClick}
                  className="flex h-11 w-11 items-center justify-center rounded-full transition-all"
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
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Left - Diamond Info Card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4 p-6 lg:border-r"
              style={{ borderColor: theme.border }}
            >
              {/* Main Info Card */}
              <motion.div
                variants={itemVariants}
                className="relative aspect-square overflow-hidden rounded-2xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${theme.background} 0%, #E2E8F0 100%)` }}
              >
                {diamond.diamondImage1 ? (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    src={diamond.diamondImage1}
                    alt={`${diamond.shape} Diamond`}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <motion.div
                  animate={floatingAnimation}
                  className={`flex flex-col items-center gap-4 ${diamond.diamondImage1 ? "hidden" : "flex"}`}
                  id="diamond-placeholder"
                >
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-2xl shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryLight} 100%)` }}
                  >
                    <Diamond className="h-12 w-12 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: theme.secondary }}>
                      {diamond.shape} {diamond.carat}ct
                    </p>
                    <p className="text-sm" style={{ color: theme.textMuted }}>
                      {diamond.color} · {diamond.clarity}
                    </p>
                  </div>
                </motion.div>

                {/* Badges */}
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  {diamond.certification && (
                    <motion.div
                      initial={{ opacity: 0, x: -20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryLight} 100%)` }}
                    >
                      <Shield className="h-4 w-4" />
                      {diamond.certification} Certified
                    </motion.div>
                  )}
                </div>

                {diamond.available && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-4 left-4"
                  >
                    <span
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${theme.success} 0%, #059669 100%)` }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </motion.div>
                      Available
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* 360 Video & Certification */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="rounded-xl p-5"
                style={{
                  background: `linear-gradient(135deg, ${theme.success}08 0%, ${theme.success}15 100%)`,
                  border: `1px solid ${theme.success}30`
                }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="flex h-14 w-14 items-center justify-center rounded-xl shadow-md"
                    style={{ background: theme.surface }}
                  >
                    <Shield className="h-7 w-7" style={{ color: theme.success }} />
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-bold" style={{ color: theme.secondary }}>{diamond.certification} Certified</p>
                    <p className="text-sm" style={{ color: theme.textMuted }}>Cert. No: {diamond.certificationNumber}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {diamond.video360 ? (
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg transition-all"
                        style={{
                          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryLight} 100%)`,
                          color: "#fff",
                          boxShadow: `0 8px 20px -5px ${theme.primary}50`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primaryLight} 0%, #60A5FA 100%)`;
                          e.currentTarget.style.boxShadow = `0 12px 28px -8px ${theme.primary}60`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryLight} 100%)`;
                          e.currentTarget.style.boxShadow = `0 8px 20px -5px ${theme.primary}50`;
                        }}
                        onClick={() => diamond.video360 && window.open(diamond.video360, '_blank')}
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                          <Eye className="h-4 w-4" />
                        </motion.div>
                        View 360
                      </motion.button>
                    ) : (
                      <span className="text-sm font-medium" style={{ color: theme.textMuted }}>
                        Video Link Not Available
                      </span>
                    )}
                    {diamond.certificateImage ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-all"
                        style={{
                          background: theme.surface,
                          color: theme.success,
                          border: `1px solid ${theme.success}40`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = theme.success;
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = theme.surface;
                          e.currentTarget.style.color = theme.success;
                        }}
                        onClick={() => diamond.certificateImage && window.open(diamond.certificateImage, '_blank')}
                      >
                        <FileCheck className="h-3.5 w-3.5" />
                        View Report
                      </motion.button>
                    ) : (
                      <span className="text-sm font-medium" style={{ color: theme.textMuted }}>
                        Certificate Link Not Available
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Additional Info */}
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
                  <FileCheck className="h-5 w-5" style={{ color: theme.primary }} />
                  Additional Details
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Fancy Color", value: diamond.fancyColor || "None" },
                    { label: "Color Intensity", value: diamond.colorIntensity || "None" },
                    { label: "Color Overtone", value: diamond.colorOvertone || "None" },
                    { label: "City", value: diamond.location || "None" },
                    { label: "State", value: diamond.state || "None" },
                    { label: "Country", value: diamond.country || "None" },
                    { label: "Fluorescence", value: diamond.fluorescence || "None" },
                    { label: "Party", value: diamond.party || "None" },
                    diamond.mediaAvailable && diamond.mediaAvailable !== "None" && { label: "Media Available", value: diamond.mediaAvailable },
                  ].filter(Boolean).map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-center justify-between pb-2 last:pb-0"
                      style={{ borderBottom: idx < 6 ? `1px solid ${theme.border}` : "none" }}
                    >
                      <span style={{ color: theme.textMuted }}>{item.label}</span>
                      <span className="font-semibold" style={{ color: theme.secondary }}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* More Details */}
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
                  <FileCheck className="h-5 w-5" style={{ color: theme.primary }} />
                  More Details
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Fluorescence Color", value: diamond.fluorescenceColor || "None" },
                    { label: "Fluorescence Intensity", value: diamond.fluorescenceIntensity || "None" },
                    { label: "Shade", value: diamond.shade || "None" },
                    { label: "Milky", value: diamond.milky || "None" },
                    { label: "Eye Clean", value: diamond.eyeClean || "None" },
                    { label: "Treatment", value: diamond.treatment || "None" },
                    { label: "Heart & Arrow", value: diamond.heartArrow || "None" },
                    { label: "Laser Description", value: diamond.laserDescription || "None" },
                    { label: "Growth Type", value: diamond.growthType || "None" },
                    { label: "Key to Symbol", value: diamond.keyToSymbol || "None" },
                    { label: "L/W Ratio", value: diamond.lwRatio || "None" },
                    { label: "Culet Condition", value: diamond.culetCondition || "None" },
                  ].filter(Boolean).map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-center justify-between pb-2 last:pb-0"
                      style={{ borderBottom: idx < 11 ? `1px solid ${theme.border}` : "none" }}
                    >
                      <span style={{ color: theme.textMuted }}>{item.label}</span>
                      <span className="font-semibold" style={{ color: theme.secondary }}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Details */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5 p-6 overflow-visible"
            >
              {/* Title & Fancy Info */}
              <motion.div variants={itemVariants} className="space-y-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.primary}25 100%)` }}
                  >
                    <img
                      src={getShapeIcon(diamond.shape)}
                      alt={diamond.shape}
                      className="h-6 w-6"
                    />
                  </motion.div>
                  <span className="text-sm font-medium" style={{ color: theme.textMuted }}>
                    {diamond.shape ? `${diamond.shape} Shape` : 'Shape'} • {diamond.colorType} Diamond
                  </span>
                  {diamond.status && ["HOLD", "SOLD", "MEMO"].includes(diamond.status.toUpperCase()) && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-auto rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md"
                      style={{
                        background:
                          diamond.status.toUpperCase() === "SOLD"
                            ? `linear-gradient(135deg, ${theme.danger} 0%, #DC2626 100%)`
                            : `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryLight} 100%)`
                      }}
                    >
                      Status: {diamond.status.toUpperCase()}
                    </motion.span>
                  )}
                </div>

                <h2 className="text-2xl font-bold" style={{ color: theme.secondary }}>
                  {diamond.carat ? `${diamond.carat} Carat` : ''} {diamond.color || ''} {diamond.clarity || ''} {diamond.shape || ''}
                </h2>

                {/* Location Badge */}
                {diamond.location && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium"
                    style={{ background: theme.background, color: theme.textMuted, border: `1px solid ${theme.border}` }}
                  >
                    <MapPin className="h-4 w-4" style={{ color: theme.danger }} />
                    <span>Location: <span className="font-semibold" style={{ color: theme.secondary }}>{diamond.location}</span></span>
                  </motion.div>
                )}

                {diamond.colorType === "Fancy" && diamond.fancyIntensity && diamond.fancyIntensity !== "None" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)" }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {diamond.fancyIntensity} {diamond.color || ''}
                    {diamond.fancyOvertone && diamond.fancyOvertone !== "None" && (
                      <span>with {diamond.fancyOvertone} Overtone</span>
                    )}
                  </motion.div>
                )}
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
                    <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>Diamond Price</p>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="mt-1 text-4xl font-bold"
                  >
                    ${diamond.price ? diamond.price.toLocaleString() : "0"}
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


              {/* Specs Grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                {[
                  { icon: Scale, label: "Carat Weight", value: diamond.carat ? `${diamond.carat} ct` : "None" },
                  { icon: Gem, label: "Shape", value: diamond.shape || "None", sub: `${diamond.colorType} Diamond` },
                  { icon: Sparkles, label: "Color Grade", value: diamond.color },
                  { icon: Eye, label: "Clarity", value: diamond.clarity },
                  { icon: Diamond, label: "Final Price", value: diamond.finalPrice ? `$${diamond.finalPrice.toLocaleString()}` : "None", sub: "Total Price" },
                ].map((spec, idx) => (
                  <motion.div
                    key={idx}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    variants={cardHoverVariants}
                    className="rounded-xl p-4 transition-all"
                    style={{
                      background: "transparent",
                      border: `1px solid ${theme.border}`
                    }}
                  >
                    <div className="mb-2 flex items-center gap-2" style={{ color: theme.textMuted }}>
                      <spec.icon className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">{spec.label}</span>
                    </div>
                    <p className="text-xl font-bold" style={{ color: theme.secondary }}>{spec.value}</p>
                    {spec.isBadge ? (
                      <span className={`mt-2 inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white shadow-md ${getGradeStyles(spec.value, spec.label.toLowerCase().includes("color") ? "color" : "clarity")}`}>
                        {spec.sub}
                      </span>
                    ) : (
                      <p className="text-xs" style={{ color: theme.textMuted }}>{spec.sub}</p>
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {/* Cut Quality */}
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
                  <Diamond className="h-5 w-5" style={{ color: theme.primary }} />
                  Cut Quality Grades
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Cut", value: diamond.cut },
                    { label: "Polish", value: diamond.polish },
                    { label: "Symmetry", value: diamond.symmetry },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="text-center"
                    >
                      <p className="text-xs mb-2" style={{ color: theme.textMuted }}>{item.label}</p>
                      <span className={`inline-block rounded-full bg-gradient-to-r px-4 py-1.5 text-sm font-bold text-white shadow-md ${getGradeStyles(item.value, "cut")}`}>
                        {item.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Measurements */}
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
                  <Ruler className="h-5 w-5" style={{ color: theme.primary }} />
                  Measurement Details

                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Length", value: diamond.length, unit: " mm" },
                    { label: "Width", value: diamond.width, unit: " mm" },
                    { label: "Height", value: diamond.height, unit: " mm" },
                    { label: "Depth", value: diamond.depth, unit: "%" },
                    { label: "Table", value: diamond.table, unit: "%" },
                    { label: "Culet Size", value: diamond.culetSize, unit: "" },
                    { label: "Girdle %", value: diamond.girdlePercentage, unit: "%" },
                    { label: "Crown Height", value: diamond.crownHeight, unit: "" },
                    { label: "Crown Angle", value: diamond.crownAngle, unit: "" },
                    { label: "Pavilion Depth", value: diamond.pavilionDepth, unit: " mm" },
                    { label: "Pavilion Angle", value: diamond.pavilionAngle, unit: "°" },
                    { label: "Discount", value: diamond.discount ? `${diamond.discount}%` : "None", unit: "" },
                  ].map((item, idx) => {
                    const displayValue = item.value === "None" || item.value === null || item.value === undefined || item.value === ""
                      ? "None"
                      : `${item.value}${item.unit}`;
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.03 }}
                        className="rounded-lg p-3 transition-colors"
                        style={{ background: theme.background }}
                      >
                        <p className="text-xs" style={{ color: theme.textMuted }}>{item.label}</p>
                        <p className="font-bold" style={{ color: theme.secondary }}>{displayValue}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
              {/* Supplier Details */}
              {diamond.supplierCompany && (
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
                    <Shield className="h-5 w-5" style={{ color: theme.primary }} />
                    Supplier Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <span style={{ color: theme.textMuted }}>Company Name</span>
                      <span className="font-semibold text-right" style={{ color: theme.secondary }}>{diamond.supplierCompany || "None"}</span>
                    </div>
                    <div className="flex items-start justify-between pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <span style={{ color: theme.textMuted }}>Address</span>
                      <span className="font-semibold text-right max-w-xs" style={{ color: theme.secondary }}>{diamond.supplierAddress || "None"}</span>
                    </div>
                    <div className="flex items-start justify-between pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <span style={{ color: theme.textMuted }}>GST Number</span>
                      <span className="font-semibold text-right" style={{ color: theme.secondary }}>{diamond.supplierGst || "None"}</span>
                    </div>
                    <div className="flex items-start justify-between pb-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <span style={{ color: theme.textMuted }}>Email</span>
                      <span className="font-semibold text-right" style={{ color: theme.secondary }}>{diamond.supplierEmail || "None"}</span>
                    </div>
                    {diamond.supplierPhone && (
                      <div className="flex items-start justify-between">
                        <span style={{ color: theme.textMuted }}>Phone</span>
                        <span className="font-semibold text-right" style={{ color: theme.secondary }}>{diamond.supplierPhone}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              {/* Reference ID */}
              <motion.div
                variants={itemVariants}
                className="rounded-xl p-4"
                style={{ background: theme.background }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: theme.textMuted }}>Reference ID</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm font-semibold" style={{ color: theme.text }}>{diamond.id}</code>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        navigator.clipboard.writeText(diamond.id);
                      }}
                      className="rounded-lg p-1.5 transition-colors"
                      style={{ color: theme.textMuted }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme.surface;
                        e.currentTarget.style.color = theme.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = theme.textMuted;
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
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

export default DiamondDetail;
