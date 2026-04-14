import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Diamond,
  Sparkles,
  Heart,
  Star,
  Gem,
  Crown,
  Filter,
  FlaskConical,
  ChevronDown,
  X,
  SlidersHorizontal,
  RefreshCw,
  Search,
  Grid3X3,
  List,
} from "lucide-react";
import ShowStock from "./ShowStock";
import Input from "../../../components/ui/Input";

const shapes = [
  { name: "ROUND", icon: "/diamond%20shap%20icon/round.svg", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop" },
  { name: "PEAR", icon: "/diamond%20shap%20icon/pear.svg", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop" },
  { name: "OVAL", icon: "/diamond%20shap%20icon/oval.svg", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop" },
  { name: "PRINCESS", icon: "/diamond%20shap%20icon/princess.svg", image: "https://images.unsplash.com/photo-1599643477877-5303c0c3f596?w=100&h=100&fit=crop" },
  { name: "EMERALD", icon: "/diamond%20shap%20icon/emerald.svg", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=100&h=100&fit=crop" },
  { name: "CUSHION", icon: "/diamond%20shap%20icon/cub.svg", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100&h=100&fit=crop" },
  { name: "MARQUISE", icon: "/diamond%20shap%20icon/marquise.svg", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop" },
  { name: "HEART", icon: "/diamond%20shap%20icon/heart.svg", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop" },
  { name: "RADIANT", icon: "/diamond%20shap%20icon/radiant.svg", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=100&h=100&fit=crop" },
  { name: "OTHER", icon: "/diamond%20shap%20icon/other.svg", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop" },
];

const whiteColors = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const fancyColorsRow1 = ["Yellow", "Blue", "Pink", "Red", "Green", "Purple", "Orange", "Violet", "Gray", "Black", "Brown", "Other"];
const fancyColorsRow2 = [];
const fancyIntensities = ["Faint", "Very Light", "Light", "Fancy Light", "Fancy", "Fancy Dark", "Fancy Intense", "Fancy Vivid", "Fancy Deep"];
const fancyOvertones = ["None", "Yellow", "Blue", "Pink", "Green", "Orange", "Brown", "Gray", "Purple", "Red"];
const clarities = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2"];
const cuts = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const polishes = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const symmetries = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const certificationLabs = ["GIA", "IGI", "HRD", "AGS", "GSI", "SGL", "GSAL", "Other", "None"];
const fluorescenceOptions = ["NONE", "Very Slight", "Slight", "Medium", "Strong", "Very Strong"];
const sorts = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "carat-low", label: "Carat: Low to High" },
  { value: "carat-high", label: "Carat: High to Low" },
  { value: "color", label: "Color Grade" },
];

const NaturalDiamond = () => {
  const [activeTab, setActiveTab] = useState("Single Stone");
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [showOnlyMedia, setShowOnlyMedia] = useState(false);
  const [availableItems, setAvailableItems] = useState(false);
  const [caratMin, setCaratMinState] = useState("");
  const [caratMax, setCaratMaxState] = useState("");
  const [priceMin, setPriceMinState] = useState("");
  const [priceMax, setPriceMaxState] = useState("");
  const [colorType, setColorType] = useState("White");
  const [selectedWhiteColors, setSelectedWhiteColors] = useState([]);
  const [selectedFancyColors, setSelectedFancyColors] = useState([]);
  const [selectedFancyIntensity, setSelectedFancyIntensity] = useState("");
  const [selectedFancyOvertone, setSelectedFancyOvertone] = useState("");
  const [selectedClarities, setSelectedClarities] = useState([]);
  const [selectedCuts, setSelectedCuts] = useState([]);
  const [selectedPolish, setSelectedPolish] = useState([]);
  const [selectedSymmetry, setSelectedSymmetry] = useState([]);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [certificateType, setCertificateType] = useState(null); // 'certified' | 'non-certified' | null
  const [selectedFluorescence, setSelectedFluorescence] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Applied filters state - these are the filters actually passed to ShowStock
  const [appliedFilters, setAppliedFilters] = useState({
    shapes: [],
    colors: [],
    colorType: "White",
    fancyIntensity: "",
    fancyOvertone: "",
    clarities: [],
    cuts: [],
    polish: [],
    symmetry: [],
    certifications: [],
    certificateType: null,
    available: false,
    showOnlyMedia: false,
    caratMin: "",
    caratMax: "",
    priceMin: "",
    priceMax: "",
    lengthMin: "",
    lengthMax: "",
    widthMin: "",
    widthMax: "",
    heightMin: "",
    heightMax: "",
    ratioMin: "",
    ratioMax: "",
    depthMin: "",
    depthMax: "",
    tableMin: "",
    tableMax: "",
    crownHeightMin: "",
    crownHeightMax: "",
    crownAngleMin: "",
    crownAngleMax: "",
    pavilionDepthMin: "",
    pavilionDepthMax: "",
    pavilionAngleMin: "",
    pavilionAngleMax: "",
    girdleMin: "",
    girdleMax: "",
    milky: "",
    eyeClean: "",
    shade: "",
  });
  const [expandedSections, setExpandedSections] = useState({
    shape: true,
    color: true,
    clarity: true,
    cut: true,
    polish: true,
    symmetry: true,
    carat: true,
    price: true,
    certification: true,
    labReport: true,
    fluorescence: true,
    advanced: false,
  });

  // Advanced Filters - Measurements
  const [lengthMin, setLengthMinState] = useState("");
  const [lengthMax, setLengthMaxState] = useState("");
  const [widthMin, setWidthMinState] = useState("");
  const [widthMax, setWidthMaxState] = useState("");
  const [heightMin, setHeightMinState] = useState("");
  const [heightMax, setHeightMaxState] = useState("");
  const [ratioMin, setRatioMinState] = useState("");
  const [ratioMax, setRatioMaxState] = useState("");
  const [depthMin, setDepthMinState] = useState("");
  const [depthMax, setDepthMaxState] = useState("");
  const [tableMin, setTableMinState] = useState("");
  const [tableMax, setTableMaxState] = useState("");
  const [crownHeightMin, setCrownHeightMinState] = useState("");
  const [crownHeightMax, setCrownHeightMaxState] = useState("");
  const [crownAngleMin, setCrownAngleMinState] = useState("");
  const [crownAngleMax, setCrownAngleMaxState] = useState("");
  const [pavilionDepthMin, setPavilionDepthMinState] = useState("");
  const [pavilionDepthMax, setPavilionDepthMaxState] = useState("");
  const [pavilionAngleMin, setPavilionAngleMinState] = useState("");
  const [pavilionAngleMax, setPavilionAngleMaxState] = useState("");
  const [girdleMin, setGirdleMinState] = useState("");
  const [girdleMax, setGirdleMaxState] = useState("");
  const [milky, setMilkyState] = useState("");
  const [eyeClean, setEyeCleanState] = useState("");
  const [shade, setShadeState] = useState("");

  // Auto-apply filters when range values change
  useEffect(() => {
    applyFilters();
  }, [caratMin, caratMax, priceMin, priceMax, lengthMin, lengthMax, widthMin, widthMax, heightMin, heightMax, ratioMin, ratioMax, depthMin, depthMax, tableMin, tableMax, crownHeightMin, crownHeightMax, crownAngleMin, crownAngleMax, pavilionDepthMin, pavilionDepthMax, pavilionAngleMin, pavilionAngleMax, girdleMin, girdleMax, milky, eyeClean, shade]);

  // Wrapper functions for state setters that also update appliedFilters via useEffect
  const setCaratMin = (val) => { setCaratMinState(val); };
  const setCaratMax = (val) => { setCaratMaxState(val); };
  const setPriceMin = (val) => { setPriceMinState(val); };
  const setPriceMax = (val) => { setPriceMaxState(val); };
  const setLengthMin = (val) => { setLengthMinState(val); };
  const setLengthMax = (val) => { setLengthMaxState(val); };
  const setWidthMin = (val) => { setWidthMinState(val); };
  const setWidthMax = (val) => { setWidthMaxState(val); };
  const setHeightMin = (val) => { setHeightMinState(val); };
  const setHeightMax = (val) => { setHeightMaxState(val); };
  const setRatioMin = (val) => { setRatioMinState(val); };
  const setRatioMax = (val) => { setRatioMaxState(val); };
  const setDepthMin = (val) => { setDepthMinState(val); };
  const setDepthMax = (val) => { setDepthMaxState(val); };
  const setTableMin = (val) => { setTableMinState(val); };
  const setTableMax = (val) => { setTableMaxState(val); };
  const setCrownHeightMin = (val) => { setCrownHeightMinState(val); };
  const setCrownHeightMax = (val) => { setCrownHeightMaxState(val); };
  const setCrownAngleMin = (val) => { setCrownAngleMinState(val); };
  const setCrownAngleMax = (val) => { setCrownAngleMaxState(val); };
  const setPavilionDepthMin = (val) => { setPavilionDepthMinState(val); };
  const setPavilionDepthMax = (val) => { setPavilionDepthMaxState(val); };
  const setPavilionAngleMin = (val) => { setPavilionAngleMinState(val); };
  const setPavilionAngleMax = (val) => { setPavilionAngleMaxState(val); };
  const setGirdleMin = (val) => { setGirdleMinState(val); };
  const setGirdleMax = (val) => { setGirdleMaxState(val); };
  const setMilky = (val) => { setMilkyState(val); };
  const setEyeClean = (val) => { setEyeCleanState(val); };
  const setShade = (val) => { setShadeState(val); };

  const toggleShape = (shape) => {
    if (selectedShapes.includes(shape)) {
      setSelectedShapes(selectedShapes.filter((s) => s !== shape));
    } else {
      setSelectedShapes([...selectedShapes, shape]);
    }
  };

  const toggleWhiteColor = (color) => {
    if (selectedWhiteColors.includes(color)) {
      setSelectedWhiteColors(selectedWhiteColors.filter((c) => c !== color));
    } else {
      setSelectedWhiteColors([...selectedWhiteColors, color]);
    }
  };

  const toggleFancyColor = (color) => {
    if (selectedFancyColors.includes(color)) {
      setSelectedFancyColors(selectedFancyColors.filter((c) => c !== color));
    } else {
      setSelectedFancyColors([...selectedFancyColors, color]);
    }
  };

  const toggleClarity = (clarity) => {
    if (selectedClarities.includes(clarity)) {
      setSelectedClarities(selectedClarities.filter((c) => c !== clarity));
    } else {
      setSelectedClarities([...selectedClarities, clarity]);
    }
  };

  const toggleCut = (cut) => {
    if (selectedCuts.includes(cut)) {
      setSelectedCuts(selectedCuts.filter((c) => c !== cut));
    } else {
      setSelectedCuts([...selectedCuts, cut]);
    }
  };

  const togglePolish = (polish) => {
    if (selectedPolish.includes(polish)) {
      setSelectedPolish(selectedPolish.filter((p) => p !== polish));
    } else {
      setSelectedPolish([...selectedPolish, polish]);
    }
  };

  const toggleSymmetry = (symmetry) => {
    if (selectedSymmetry.includes(symmetry)) {
      setSelectedSymmetry(selectedSymmetry.filter((s) => s !== symmetry));
    } else {
      setSelectedSymmetry([...selectedSymmetry, symmetry]);
    }
  };

  const toggleCertification = (cert) => {
    if (selectedCertifications.includes(cert)) {
      setSelectedCertifications(selectedCertifications.filter((c) => c !== cert));
    } else {
      setSelectedCertifications([...selectedCertifications, cert]);
    }
  };

  const toggleFluorescence = (fluor) => {
    if (selectedFluorescence.includes(fluor)) {
      setSelectedFluorescence(selectedFluorescence.filter((f) => f !== fluor));
    } else {
      setSelectedFluorescence([...selectedFluorescence, fluor]);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    setSelectedShapes([]);
    setSelectedWhiteColors([]);
    setSelectedFancyColors([]);
    setSelectedFancyIntensity("");
    setSelectedFancyOvertone("");
    setColorType("White");
    setSelectedClarities([]);
    setSelectedCuts([]);
    setSelectedPolish([]);
    setSelectedSymmetry([]);
    setSelectedCertifications([]);
    setCertificateType(null);
    setCaratMin("");
    setCaratMax("");
    setPriceMin("");
    setPriceMax("");
    setShowOnlyMedia(false);
    setAvailableItems(false);
    setSelectedFluorescence([]);
    // Advanced filters
    setLengthMin("");
    setLengthMax("");
    setWidthMin("");
    setWidthMax("");
    setHeightMin("");
    setHeightMax("");
    setRatioMin("");
    setRatioMax("");
    setDepthMin("");
    setDepthMax("");
    setTableMin("");
    setTableMax("");
    setCrownHeightMin("");
    setCrownHeightMax("");
    setCrownAngleMin("");
    setCrownAngleMax("");
    setPavilionDepthMin("");
    setPavilionDepthMax("");
    setPavilionAngleMin("");
    setPavilionAngleMax("");
    setGirdleMin("");
    setGirdleMax("");
    setMilky("");
    setEyeClean("");
    setShade("");
    // Also clear applied filters
    setAppliedFilters({
      shapes: [],
      colors: [],
      colorType: "White",
      fancyIntensity: "",
      fancyOvertone: "",
      clarities: [],
      cuts: [],
      polish: [],
      symmetry: [],
      certifications: [],
      certificateType: null,
      available: false,
      showOnlyMedia: false,
      caratMin: "",
      caratMax: "",
      priceMin: "",
      priceMax: "",
      lengthMin: "",
      lengthMax: "",
      widthMin: "",
      widthMax: "",
      heightMin: "",
      heightMax: "",
      ratioMin: "",
      ratioMax: "",
      depthMin: "",
      depthMax: "",
      tableMin: "",
      tableMax: "",
      crownHeightMin: "",
      crownHeightMax: "",
      crownAngleMin: "",
      crownAngleMax: "",
      pavilionDepthMin: "",
      pavilionDepthMax: "",
      pavilionAngleMin: "",
      pavilionAngleMax: "",
      girdleMin: "",
      girdleMax: "",
      milky: "",
      eyeClean: "",
      shade: "",
    });
  };

  // Apply filters function - copies pending state to applied filters
  const applyFilters = () => {
    setAppliedFilters({
      shapes: selectedShapes,
      colors: colorType === "White" ? selectedWhiteColors : selectedFancyColors,
      colorType,
      fancyIntensity: selectedFancyIntensity,
      fancyOvertone: selectedFancyOvertone,
      clarities: selectedClarities,
      cuts: selectedCuts,
      polish: selectedPolish,
      symmetry: selectedSymmetry,
      certifications: selectedCertifications,
      certificateType,
      available: availableItems,
      showOnlyMedia,
      caratMin,
      caratMax,
      priceMin,
      priceMax,
      lengthMin,
      lengthMax,
      widthMin,
      widthMax,
      heightMin,
      heightMax,
      ratioMin,
      ratioMax,
      depthMin,
      depthMax,
      tableMin,
      tableMax,
      crownHeightMin,
      crownHeightMax,
      crownAngleMin,
      crownAngleMax,
      pavilionDepthMin,
      pavilionDepthMax,
      pavilionAngleMin,
      pavilionAngleMax,
      girdleMin,
      girdleMax,
      milky,
      eyeClean,
      shade,
    });
  };

  const activeFiltersCount =
    selectedShapes.length +
    selectedWhiteColors.length +
    selectedFancyColors.length +
    (selectedFancyIntensity ? 1 : 0) +
    (selectedFancyOvertone ? 1 : 0) +
    selectedClarities.length +
    selectedCuts.length +
    selectedPolish.length +
    selectedSymmetry.length +
    selectedCertifications.length +
    (certificateType ? 1 : 0) +
    (caratMin || caratMax ? 1 : 0) +
    (priceMin || priceMax ? 1 : 0) +
    (showOnlyMedia ? 1 : 0) +
    (availableItems ? 1 : 0) +
    selectedFluorescence.length +
    // Advanced filters count
    (lengthMin || lengthMax ? 1 : 0) +
    (widthMin || widthMax ? 1 : 0) +
    (heightMin || heightMax ? 1 : 0) +
    (ratioMin || ratioMax ? 1 : 0) +
    (depthMin || depthMax ? 1 : 0) +
    (tableMin || tableMax ? 1 : 0) +
    (crownHeightMin || crownHeightMax ? 1 : 0) +
    (crownAngleMin || crownAngleMax ? 1 : 0) +
    (pavilionDepthMin || pavilionDepthMax ? 1 : 0) +
    (pavilionAngleMin || pavilionAngleMax ? 1 : 0) +
    (girdleMin || girdleMax ? 1 : 0) +
    (milky ? 1 : 0) +
    (eyeClean ? 1 : 0) +
    (shade ? 1 : 0);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <button
        onClick={() => toggleSection(section)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="font-semibold text-[#0F172A]">{title}</h3>
        <ChevronDown
          className={`h-4 w-4 text-[#64748B] transition-transform ${
            expandedSections[section] ? "" : "-rotate-90"
          }`}
        />
      </button>
      {expandedSections[section] && <div className="mt-4">{children}</div>}
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Shape Filter */}
      <FilterSection title="Shape" section="shape">
        <div className="grid grid-cols-3 gap-2">
          {shapes.map((shape) => (
            <button
              key={shape.name}
              onClick={() => toggleShape(shape.name)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-300 ${
                selectedShapes.includes(shape.name)
                  ? "bg-[#DBEAFE] ring-2 ring-[#1E3A8A] scale-105"
                  : "hover:bg-[#F1F5F9]"
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg">
                <img
                  src={shape.icon}
                  alt={shape.name}
                  className="w-9 h-9 object-contain transition-all duration-300"
                  style={{
                    filter: selectedShapes.includes(shape.name)
                      ? 'brightness(0.3) contrast(1.8)'
                      : 'brightness(0.2) contrast(1.5) opacity(1)'
                  }}
                />
              </div>
              <span
                className={`text-[10px] leading-tight text-center ${
                  selectedShapes.includes(shape.name)
                    ? "text-[#1E3A8A] font-medium"
                    : "text-[#475569]"
                }`}
              >
                {shape.name}
              </span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color Filter - Merged Color Type and Color Grade */}
      <FilterSection title="Color" section="color">
        {/* Color Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setColorType("White")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              colorType === "White"
                ? "bg-[#DBEAFE] text-[#1E3A8A] border border-[#1E3A8A]"
                : "bg-[#F1F5F9] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A] border border-transparent"
            }`}
          >
            White
          </button>
          <button
            onClick={() => setColorType("Fancy")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              colorType === "Fancy"
                ? "bg-[#DBEAFE] text-[#1E3A8A] border border-[#1E3A8A]"
                : "bg-[#F1F5F9] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A] border border-transparent"
            }`}
          >
            Fancy
          </button>
        </div>

        {/* White Color Options */}
        {colorType === "White" && (
          <div>
            <div className="flex flex-wrap gap-2">
              {whiteColors.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleWhiteColor(color)}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    selectedWhiteColors.includes(color)
                      ? "bg-[#1E3A8A] text-white shadow-md scale-105"
                      : "bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A]"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-[#64748B] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              D is the highest color grade
            </div>
          </div>
        )}

        {/* Fancy Color Options */}
        {colorType === "Fancy" && (
          <div>
            {/* Fancy Color Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {fancyColorsRow1.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleFancyColor(color)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedFancyColors.includes(color)
                      ? "bg-[#1E3A8A] text-white shadow-md scale-105"
                      : "bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A]"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
            {/* Intensity & Overtone - Stacked */}
            <div className="space-y-3">
              {/* Color Intensity */}
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1.5">Color Intensity</label>
                <select
                  value={selectedFancyIntensity}
                  onChange={(e) => setSelectedFancyIntensity(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#475569] focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                >
                  <option value="">Select Intensity</option>
                  {fancyIntensities.map((intensity) => (
                    <option key={intensity} value={intensity}>{intensity}</option>
                  ))}
                </select>
              </div>
              {/* Color Overtone */}
              <div>
                <label className="block text-sm font-medium text-[#1E3A8A] mb-1.5">Color Overtone</label>
                <select
                  value={selectedFancyOvertone}
                  onChange={(e) => setSelectedFancyOvertone(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#475569] focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                >
                  <option value="">Select Overtone</option>
                  {fancyOvertones.map((overtone) => (
                    <option key={overtone} value={overtone}>{overtone}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </FilterSection>

      {/* Carat Filter */}
      <FilterSection title="Carat Weight" section="carat">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#64748B]">min</span>
              <Input
                type="number"
                step="0.01"
                placeholder=""
                value={caratMin}
                onChange={(e) => setCaratMin(e.target.value)}
                rightElement={<span className="text-xs text-[#64748B]">ct</span>}
                className="pl-10 text-center rounded-lg py-2.5"
              />
            </div>
          </div>
          <span className="text-[#64748B]">-</span>
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#64748B]">max</span>
              <Input
                type="number"
                step="0.01"
                placeholder=""
                value={caratMax}
                onChange={(e) => setCaratMax(e.target.value)}
                rightElement={<span className="text-xs text-[#64748B]">ct</span>}
                className="pl-10 text-center rounded-lg py-2.5"
              />
            </div>
          </div>
        </div>
        <div className="mt-2 flex gap-1.5">
          {[0.5, 1, 2, 3, 5].map((carat) => (
            <button
              key={carat}
              onClick={() => {
                setCaratMin(carat.toString());
                setCaratMax((carat + 0.99).toString());
              }}
              className="flex-1 py-1.5 px-1 rounded-md text-xs bg-[#F1F5F9] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A] transition-colors"
            >
              {carat}ct
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection title="Price Range" section="price">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]">$</span>
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-medium text-[#64748B]">min</span>
              <Input
                type="number"
                placeholder=""
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="pl-14 rounded-lg py-2.5"
              />
            </div>
          </div>
          <span className="text-[#64748B]">-</span>
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]">$</span>
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-medium text-[#64748B]">max</span>
              <Input
                type="number"
                placeholder=""
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="pl-14 rounded-lg py-2.5"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Clarity Filter */}
      <FilterSection title="Clarity" section="clarity">
        <div className="grid grid-cols-2 gap-1.5">
          {clarities.map((clarity) => (
            <button
              key={clarity}
              onClick={() => toggleClarity(clarity)}
              className={`py-2 px-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedClarities.includes(clarity)
                  ? "bg-[#1E3A8A] text-white shadow-md"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A]"
              }`}
            >
              {clarity}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Cut Filter */}
      <FilterSection title="Cut Quality" section="cut">
        <div className="space-y-1.5">
          {cuts.map((cut) => (
            <button
              key={cut}
              onClick={() => toggleCut(cut)}
              className={`w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between ${
                selectedCuts.includes(cut)
                  ? "bg-[#1E3A8A] text-white shadow-md"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A]"
              }`}
            >
              {cut}
              {selectedCuts.includes(cut) && <Sparkles className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Polish Filter */}
      <FilterSection title="Polish" section="polish">
        <div className="space-y-1.5">
          {polishes.map((polish) => (
            <button
              key={polish}
              onClick={() => togglePolish(polish)}
              className={`w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between ${
                selectedPolish.includes(polish)
                  ? "bg-[#1E3A8A] text-white shadow-md"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A]"
              }`}
            >
              {polish}
              {selectedPolish.includes(polish) && <Sparkles className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Symmetry Filter */}
      <FilterSection title="Symmetry" section="symmetry">
        <div className="space-y-1.5">
          {symmetries.map((symmetry) => (
            <button
              key={symmetry}
              onClick={() => toggleSymmetry(symmetry)}
              className={`w-full py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between ${
                selectedSymmetry.includes(symmetry)
                  ? "bg-[#1E3A8A] text-white shadow-md"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A]"
              }`}
            >
              {symmetry}
              {selectedSymmetry.includes(symmetry) && <Sparkles className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Fluorescence Filter */}
      <FilterSection title="Fluorescence" section="fluorescence">
        <div className="flex flex-wrap gap-2">
          {fluorescenceOptions.map((fluor) => (
            <button
              key={fluor}
              onClick={() => toggleFluorescence(fluor)}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                selectedFluorescence.includes(fluor)
                  ? "bg-[#7C3AED] text-white shadow-md scale-105"
                  : "bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#EDE9FE] hover:text-[#7C3AED] hover:border-[#7C3AED]"
              }`}
            >
              {fluor}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Certification Filter */}
      <FilterSection title="Certificate" section="certification">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCertificateType('certified')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              certificateType === 'certified'
                ? "bg-[#1E3A8A] text-white border border-[#1E3A8A] shadow-md"
                : "bg-[#F1F5F9] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A] border border-transparent"
            }`}
          >
            Certified
          </button>
          <button
            onClick={() => {
              setCertificateType('non-certified');
              setSelectedCertifications([]);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              certificateType === 'non-certified'
                ? "bg-[#1E3A8A] text-white border border-[#1E3A8A] shadow-md"
                : "bg-[#F1F5F9] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A] border border-transparent"
            }`}
          >
            Non-certified
          </button>
        </div>

        {/* Laboratory Report - Only show when Certified is selected */}
        {certificateType === 'certified' && (
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <button
              onClick={() => toggleSection('labReport')}
              className="flex w-full items-center justify-between text-left mb-3"
            >
              <h4 className="font-semibold text-[#1E3A8A]">Laboratory Report</h4>
              <ChevronDown
                className={`h-4 w-4 text-[#1E3A8A] transition-transform ${
                  expandedSections.labReport ? "" : "-rotate-90"
                }`}
              />
            </button>
            {expandedSections.labReport && (
              <div className="flex flex-wrap gap-2">
                {certificationLabs.map((lab) => (
                  <button
                    key={lab}
                    onClick={() => toggleCertification(lab)}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      selectedCertifications.includes(lab)
                        ? "bg-[#1E3A8A] text-white shadow-md"
                        : "bg-white border border-[#CBD5E1] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A]"
                    }`}
                  >
                    {lab}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </FilterSection>

      {/* Advanced Filters - Grouped under single collapsible section */}
      <FilterSection title="Advanced Filters" section="advanced">
        <div className="space-y-4">
          {/* Length */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Length (mm)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                placeholder="Min"
                value={lengthMin}
                onChange={(e) => setLengthMin(e.target.value)}
                className="flex-1 text-sm py-2"
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Max"
                value={lengthMax}
                onChange={(e) => setLengthMax(e.target.value)}
                className="flex-1 text-sm py-2"
              />
            </div>
          </div>

          {/* Width */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Width (mm)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                placeholder="Min"
                value={widthMin}
                onChange={(e) => setWidthMin(e.target.value)}
                className="flex-1 text-sm py-2"
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Max"
                value={widthMax}
                onChange={(e) => setWidthMax(e.target.value)}
                className="flex-1 text-sm py-2"
              />
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Height (mm)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.01"
                placeholder="Min"
                value={heightMin}
                onChange={(e) => setHeightMin(e.target.value)}
                className="flex-1 text-sm py-2"
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Max"
                value={heightMax}
                onChange={(e) => setHeightMax(e.target.value)}
                className="flex-1 text-sm py-2"
              />
            </div>
          </div>

          {/* Depth */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Depth (%)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="Min"
                value={depthMin}
                onChange={(e) => setDepthMin(e.target.value)}
                className="flex-1 text-sm py-2"
              />
              <Input
                type="number"
                step="0.1"
                placeholder="Max"
                value={depthMax}
                onChange={(e) => setDepthMax(e.target.value)}
                className="flex-1 text-sm py-2"
              />
            </div>
          </div>

          {/* Table */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Table (%)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="Min"
                value={tableMin}
                onChange={(e) => setTableMin(e.target.value)}
                className="flex-1 text-sm py-2"
              />
              <Input
                type="number"
                step="0.1"
                placeholder="Max"
                value={tableMax}
                onChange={(e) => setTableMax(e.target.value)}
                className="flex-1 text-sm py-2"
              />
            </div>
          </div>

          {/* Crown Height */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Crown Height (%)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="Min"
                value={crownHeightMin}
                onChange={(e) => setCrownHeightMin(e.target.value)}
                className="flex-1 text-sm py-2"
              />
              <Input
                type="number"
                step="0.1"
                placeholder="Max"
                value={crownHeightMax}
                onChange={(e) => setCrownHeightMax(e.target.value)}
                className="flex-1 text-sm py-2"
              />
            </div>
          </div>

          {/* Crown Angle */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Crown Angle (°)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="Min"
                value={crownAngleMin}
                onChange={(e) => setCrownAngleMin(e.target.value)}
                className="flex-1 text-sm py-2"
              />
              <Input
                type="number"
                step="0.1"
                placeholder="Max"
                value={crownAngleMax}
                onChange={(e) => setCrownAngleMax(e.target.value)}
                className="flex-1 text-sm py-2"
              />
            </div>
          </div>

          {/* Pavilion Depth */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Pavilion Depth (%)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="Min"
                value={pavilionDepthMin}
                onChange={(e) => setPavilionDepthMin(e.target.value)}
                className="flex-1 text-sm py-2"
              />
              <Input
                type="number"
                step="0.1"
                placeholder="Max"
                value={pavilionDepthMax}
                onChange={(e) => setPavilionDepthMax(e.target.value)}
                className="flex-1 text-sm py-2"
              />
            </div>
          </div>

          {/* Pavilion Angle */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Pavilion Angle (°)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="Min"
                value={pavilionAngleMin}
                onChange={(e) => setPavilionAngleMin(e.target.value)}
                className="flex-1 text-sm py-2"
              />
              <Input
                type="number"
                step="0.1"
                placeholder="Max"
                value={pavilionAngleMax}
                onChange={(e) => setPavilionAngleMax(e.target.value)}
                className="flex-1 text-sm py-2"
              />
            </div>
          </div>

          {/* Girdle */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Girdle (%)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="Min"
                value={girdleMin}
                onChange={(e) => setGirdleMin(e.target.value)}
                className="flex-1 text-sm py-2"
              />
              <Input
                type="number"
                step="0.1"
                placeholder="Max"
                value={girdleMax}
                onChange={(e) => setGirdleMax(e.target.value)}
                className="flex-1 text-sm py-2"
              />
            </div>
          </div>

          {/* Milky */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Milky</label>
            <select
              value={milky}
              onChange={(e) => setMilky(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#475569] focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
            >
              <option value="">All</option>
              <option value="None">None</option>
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
              <option value="Heavy">Heavy</option>
            </select>
          </div>

          {/* Eye Clean */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Eye Clean</label>
            <select
              value={eyeClean}
              onChange={(e) => setEyeClean(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#475569] focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
            >
              <option value="">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Shade */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Shade</label>
            <select
              value={shade}
              onChange={(e) => setShade(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-[#CBD5E1] bg-white text-sm text-[#475569] focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
            >
              <option value="">All</option>
              <option value="None">None</option>
              <option value="Faint">Faint</option>
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
              <option value="Strong">Strong</option>
            </select>
          </div>
        </div>
      </FilterSection>
    </div>
  );

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#FAFBFC]"
    >
      {/* Professional Header */}
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <motion.div variants={fadeInUp} className="mb-2 flex items-center gap-2 text-sm text-[#64748B]">
                <Link to="/user/home" className="hover:text-[#1E3A8A]">Home</Link>
                <span>/</span>
                <span className="text-[#1E3A8A]">Natural Diamonds</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-2xl font-bold text-[#0F172A]">
                Natural Diamond Collection
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-sm text-[#64748B]">
                GIA Certified • Premium Quality • Ethically Sourced
              </motion.p>
            </div>
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <Link
                to="/lab-grown-diamonds"
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
              >
                <FlaskConical className="h-4 w-4" />
                View Lab-Grown Diamonds
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Top Filter Bar */}
      <section className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-white py-3 backdrop-blur-xl w-full shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Mobile Filter Button - Left Side */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A] lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#1E3A8A] text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <span className="text-sm text-[#64748B]">Natural Diamonds</span>
              {activeFiltersCount > 0 && (
                <>
                  <span className="text-sm text-[#64748B]">•</span>
                  <span className="text-sm text-[#64748B]">Active:</span>
                  {selectedShapes.map((shape) => (
                    <span key={shape} className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      {shape}
                      <button onClick={() => toggleShape(shape)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedWhiteColors.map((color) => (
                    <span key={color} className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      Color {color}
                      <button onClick={() => toggleWhiteColor(color)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedFancyColors.map((color) => (
                    <span key={color} className="flex items-center gap-1 rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-medium text-[#BE185D]">
                      Fancy {color}
                      <button onClick={() => toggleFancyColor(color)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedFancyIntensity && (
                    <span className="flex items-center gap-1 rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-medium text-[#BE185D]">
                      Intensity: {selectedFancyIntensity}
                      <button onClick={() => setSelectedFancyIntensity("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedFancyOvertone && (
                    <span className="flex items-center gap-1 rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-medium text-[#BE185D]">
                      Overtone: {selectedFancyOvertone}
                      <button onClick={() => setSelectedFancyOvertone("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedClarities.map((clarity) => (
                    <span key={clarity} className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      {clarity}
                      <button onClick={() => toggleClarity(clarity)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedCuts.map((cut) => (
                    <span key={cut} className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      {cut}
                      <button onClick={() => toggleCut(cut)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedPolish.map((polish) => (
                    <span key={polish} className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      Polish: {polish}
                      <button onClick={() => togglePolish(polish)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedSymmetry.map((symmetry) => (
                    <span key={symmetry} className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      Sym: {symmetry}
                      <button onClick={() => toggleSymmetry(symmetry)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedCertifications.map((cert) => (
                    <span key={cert} className="flex items-center gap-1 rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-medium text-[#86198F]">
                      {cert}
                      <button onClick={() => toggleCertification(cert)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {certificateType && (
                    <span className="flex items-center gap-1 rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-medium text-[#86198F]">
                      {certificateType === 'certified' ? 'Certified' : 'Non-certified'}
                      <button onClick={() => {
                        setCertificateType(null);
                        setSelectedCertifications([]);
                      }}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {showOnlyMedia && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      With Media
                      <button onClick={() => setShowOnlyMedia(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {availableItems && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      Available
                      <button onClick={() => setAvailableItems(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(caratMin || caratMax) && (
                    <span className="flex items-center gap-1 rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#1E3A8A]">
                      {caratMin || "0"} - {caratMax || "∞"} ct
                      <button onClick={() => { setCaratMin(""); setCaratMax(""); }}>
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
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Search Bar - Like Jewelry.jsx */}
              <div className="block">
                <Input
                  type="text"
                  placeholder="Search diamonds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4 text-[#64748B]" />}
                  className="w-32 sm:w-48 lg:w-64 bg-white rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden w-64 flex-shrink-0 lg:block">
              <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <FilterContent />

                {/* Apply Filters Button */}
                <button
                  onClick={applyFilters}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] py-3 text-sm font-medium text-white transition-all hover:bg-[#1E40AF] shadow-md"
                >
                  <Filter className="h-4 w-4" />
                  Apply Filters
                </button>

                {/* Clear Filters */}
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

            {/* Main Content Area */}
            <div className="flex-1">

              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#64748B]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-[#E2E8F0] bg-white py-2 px-3 text-sm"
                  >
                    {sorts.map((sort) => (
                      <option key={sort.value} value={sort.value}>
                        {sort.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white p-1">
                  <button
                    onClick={() => setViewMode("grid")}
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
                    onClick={() => setViewMode("list")}
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
              </div>

              {/* Stock Grid/List */}
              <ShowStock
                type="natural"
                viewMode={viewMode}
                sortBy={sortBy}
                searchQuery={searchQuery}
                filters={appliedFilters}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 flex h-full w-80 flex-col bg-white lg:hidden"
            >
              {/* Fixed Header */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                    <Gem className="w-6 h-6 text-[#1E3A8A]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-[#0F172A]">Filters</h2>
                    <p className="text-xs text-[#64748B]">Natural Diamonds</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full p-2 hover:bg-[#F1F5F9]"
                >
                  <X className="h-5 w-5 text-[#64748B]" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <FilterContent />
              </div>

              {/* Fixed Footer */}
              <div className="border-t border-[#E2E8F0] p-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setShowMobileFilters(false);
                    }}
                    className="flex-1 rounded-lg border border-[#E2E8F0] py-3 text-sm font-medium text-[#475569] hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => {
                      applyFilters();
                      setShowMobileFilters(false);
                    }}
                    className="flex-1 rounded-lg bg-[#1E3A8A] py-3 text-sm font-medium text-white hover:bg-[#1E40AF]"
                  >
                    Apply Filters
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

export default NaturalDiamond;
