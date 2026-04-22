import { useState, useCallback, useMemo } from "react";
import { ChevronDown, Sparkles, ChevronDown as ChevronDownIcon } from "lucide-react";
import Input from "../../../components/ui/Input";

// Constants
export const shapes = [
  { name: "ROUND", icon: "/diamond%20shap%20icon/round.svg" },
  { name: "PEAR", icon: "/diamond%20shap%20icon/pear.svg" },
  { name: "OVAL", icon: "/diamond%20shap%20icon/oval.svg" },
  { name: "PRINCESS", icon: "/diamond%20shap%20icon/princess.svg" },
  { name: "EMERALD", icon: "/diamond%20shap%20icon/emerald.svg" },
  { name: "CUSHION", icon: "/diamond%20shap%20icon/cub.svg" },
  { name: "MARQUISE", icon: "/diamond%20shap%20icon/marquise.svg" },
  { name: "HEART", icon: "/diamond%20shap%20icon/heart.svg" },
  { name: "RADIANT", icon: "/diamond%20shap%20icon/radiant.svg" },
  { name: "BAGUETTE", icon: "/diamond%20shap%20icon/Baguette.svg" },
  { name: "HEXAGONAL", icon: "/diamond%20shap%20icon/Hexagonal.svg" },
  { name: "SQUARE EMERALD", icon: "/diamond%20shap%20icon/Square%20Emerald.svg" },
  { name: "BRIOLETTE", icon: "/diamond%20shap%20icon/Briolette.svg" },
  { name: "TRILLIANT", icon: "/diamond%20shap%20icon/Trilliant.svg" },
  { name: "HALF MOON", icon: "/diamond%20shap%20icon/half%20moon.svg" },
  { name: "ROSE CUT", icon: "/diamond%20shap%20icon/rose%20cut.svg" },
  { name: "KITE", icon: "/diamond%20shap%20icon/kite.svg" },
  { name: "OTHER", icon: "/diamond%20shap%20icon/other.svg" },
  
];

export const whiteColors = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
export const fancyColorsRow1 = ["Yellow", "Blue", "Pink", "Red", "Green", "Purple", "Orange", "Violet", "Gray", "Black", "Brown", "Other"];
export const fancyIntensities = ["Faint", "Very Light", "Light", "Fancy Light", "Fancy", "Fancy Dark", "Fancy Intense", "Fancy Vivid", "Fancy Deep"];
export const fancyOvertones = ["None", "Yellow", "Blue", "Pink", "Green", "Orange", "Brown", "Gray", "Purple", "Red"];
export const clarities = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2"];
export const cuts = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
export const polishes = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
export const symmetries = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
export const certificationLabs = ["GIA", "IGI", "HRD", "AGS", "GSI", "SGL", "GSAL", "Other", "None"];
export const fluorescenceOptions = ["NONE", "Very Slight", "Slight", "Medium", "Strong", "Very Strong"];

// FilterSection Component
const FilterSection = ({ title, section, children, expandedSections, toggleSection }) => (
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

// Custom Hook for Filter State
export const useDiamondFilters = () => {
  // Pending filter states (what user is selecting)
  const [pendingShapes, setPendingShapes] = useState([]);
  const [pendingShowOnlyMedia, setPendingShowOnlyMedia] = useState(false);
  const [pendingAvailableItems, setPendingAvailableItems] = useState(false);
  const [pendingCaratMin, setPendingCaratMin] = useState("");
  const [pendingCaratMax, setPendingCaratMax] = useState("");
  const [pendingPriceMin, setPendingPriceMin] = useState("");
  const [pendingPriceMax, setPendingPriceMax] = useState("");
  const [pendingColorType, setPendingColorType] = useState("White");
  const [pendingWhiteColors, setPendingWhiteColors] = useState([]);
  const [pendingFancyColors, setPendingFancyColors] = useState([]);
  const [pendingFancyIntensity, setPendingFancyIntensity] = useState("");
  const [pendingFancyOvertone, setPendingFancyOvertone] = useState("");
  const [pendingClarities, setPendingClarities] = useState([]);
  const [pendingCuts, setPendingCuts] = useState([]);
  const [pendingPolish, setPendingPolish] = useState([]);
  const [pendingSymmetry, setPendingSymmetry] = useState([]);
  const [pendingCertifications, setPendingCertifications] = useState([]);
  const [pendingCertificateType, setPendingCertificateType] = useState(null);
  const [pendingFluorescence, setPendingFluorescence] = useState([]);
  const [visibleShapesCount, setVisibleShapesCount] = useState(8);
  const SHAPES_BATCH_SIZE = 8;

  // Applied filter states (what's actually applied to results)
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [showOnlyMedia, setShowOnlyMedia] = useState(false);
  const [availableItems, setAvailableItems] = useState(false);
  const [caratMin, setCaratMin] = useState("");
  const [caratMax, setCaratMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
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
  const [certificateType, setCertificateType] = useState(null);
  const [selectedFluorescence, setSelectedFluorescence] = useState([]);
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

  // Advanced Filters - Pending
  const [pendingLengthMin, setPendingLengthMin] = useState("");
  const [pendingLengthMax, setPendingLengthMax] = useState("");
  const [pendingWidthMin, setPendingWidthMin] = useState("");
  const [pendingWidthMax, setPendingWidthMax] = useState("");
  const [pendingHeightMin, setPendingHeightMin] = useState("");
  const [pendingHeightMax, setPendingHeightMax] = useState("");
  const [pendingRatioMin, setPendingRatioMin] = useState("");
  const [pendingRatioMax, setPendingRatioMax] = useState("");
  const [pendingDepthMin, setPendingDepthMin] = useState("");
  const [pendingDepthMax, setPendingDepthMax] = useState("");
  const [pendingTableMin, setPendingTableMin] = useState("");
  const [pendingTableMax, setPendingTableMax] = useState("");
  const [pendingCrownHeightMin, setPendingCrownHeightMin] = useState("");
  const [pendingCrownHeightMax, setPendingCrownHeightMax] = useState("");
  const [pendingCrownAngleMin, setPendingCrownAngleMin] = useState("");
  const [pendingCrownAngleMax, setPendingCrownAngleMax] = useState("");
  const [pendingPavilionDepthMin, setPendingPavilionDepthMin] = useState("");
  const [pendingPavilionDepthMax, setPendingPavilionDepthMax] = useState("");
  const [pendingPavilionAngleMin, setPendingPavilionAngleMin] = useState("");
  const [pendingPavilionAngleMax, setPendingPavilionAngleMax] = useState("");
  const [pendingGirdleMin, setPendingGirdleMin] = useState("");
  const [pendingGirdleMax, setPendingGirdleMax] = useState("");
  const [pendingMilky, setPendingMilky] = useState("");
  const [pendingEyeClean, setPendingEyeClean] = useState("");
  const [pendingShade, setPendingShade] = useState("");
  // Sort by - Pending
  const [pendingSortBy, setPendingSortBy] = useState("featured");

  // Advanced Filters - Applied
  const [lengthMin, setLengthMin] = useState("");
  const [lengthMax, setLengthMax] = useState("");
  const [widthMin, setWidthMin] = useState("");
  const [widthMax, setWidthMax] = useState("");
  const [heightMin, setHeightMin] = useState("");
  const [heightMax, setHeightMax] = useState("");
  const [ratioMin, setRatioMin] = useState("");
  const [ratioMax, setRatioMax] = useState("");
  const [depthMin, setDepthMin] = useState("");
  const [depthMax, setDepthMax] = useState("");
  const [tableMin, setTableMin] = useState("");
  const [tableMax, setTableMax] = useState("");
  const [crownHeightMin, setCrownHeightMin] = useState("");
  const [crownHeightMax, setCrownHeightMax] = useState("");
  const [crownAngleMin, setCrownAngleMin] = useState("");
  const [crownAngleMax, setCrownAngleMax] = useState("");
  const [pavilionDepthMin, setPavilionDepthMin] = useState("");
  const [pavilionDepthMax, setPavilionDepthMax] = useState("");
  const [pavilionAngleMin, setPavilionAngleMin] = useState("");
  const [pavilionAngleMax, setPavilionAngleMax] = useState("");
  const [girdleMin, setGirdleMin] = useState("");
  const [girdleMax, setGirdleMax] = useState("");
  const [milky, setMilky] = useState("");
  const [eyeClean, setEyeClean] = useState("");
  const [shade, setShade] = useState("");
  // Sort by - Applied
  const [sortBy, setSortBy] = useState("featured");

  // Toggle functions for pending states
  const toggleShape = useCallback((shape) => {
    setPendingShapes((prev) =>
      prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
    );
  }, []);

  const toggleWhiteColor = useCallback((color) => {
    setPendingWhiteColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  }, []);

  const toggleFancyColor = useCallback((color) => {
    setPendingFancyColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  }, []);

  const toggleClarity = useCallback((clarity) => {
    setPendingClarities((prev) =>
      prev.includes(clarity) ? prev.filter((c) => c !== clarity) : [...prev, clarity]
    );
  }, []);

  const toggleCut = useCallback((cut) => {
    setPendingCuts((prev) =>
      prev.includes(cut) ? prev.filter((c) => c !== cut) : [...prev, cut]
    );
  }, []);

  const togglePolish = useCallback((polish) => {
    setPendingPolish((prev) =>
      prev.includes(polish) ? prev.filter((p) => p !== polish) : [...prev, polish]
    );
  }, []);

  const toggleSymmetry = useCallback((symmetry) => {
    setPendingSymmetry((prev) =>
      prev.includes(symmetry) ? prev.filter((s) => s !== symmetry) : [...prev, symmetry]
    );
  }, []);

  const toggleCertification = useCallback((cert) => {
    setPendingCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  }, []);

  const toggleFluorescence = useCallback((fluor) => {
    setPendingFluorescence((prev) =>
      prev.includes(fluor) ? prev.filter((f) => f !== fluor) : [...prev, fluor]
    );
  }, []);

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const showMoreShapes = useCallback(() => {
    setVisibleShapesCount((prev) => Math.min(prev + SHAPES_BATCH_SIZE, shapes.length));
  }, []);

  const resetVisibleShapes = useCallback(() => {
    setVisibleShapesCount(7);
  }, []);

  // Apply pending filters to applied filters
  const applyFilters = useCallback(() => {
    setSelectedShapes(pendingShapes);
    setShowOnlyMedia(pendingShowOnlyMedia);
    setAvailableItems(pendingAvailableItems);
    setCaratMin(pendingCaratMin);
    setCaratMax(pendingCaratMax);
    setPriceMin(pendingPriceMin);
    setPriceMax(pendingPriceMax);
    setColorType(pendingColorType);
    setSelectedWhiteColors(pendingWhiteColors);
    setSelectedFancyColors(pendingFancyColors);
    setSelectedFancyIntensity(pendingFancyIntensity);
    setSelectedFancyOvertone(pendingFancyOvertone);
    setSelectedClarities(pendingClarities);
    setSelectedCuts(pendingCuts);
    setSelectedPolish(pendingPolish);
    setSelectedSymmetry(pendingSymmetry);
    setSelectedCertifications(pendingCertifications);
    setCertificateType(pendingCertificateType);
    setSelectedFluorescence(pendingFluorescence);
    setLengthMin(pendingLengthMin);
    setLengthMax(pendingLengthMax);
    setWidthMin(pendingWidthMin);
    setWidthMax(pendingWidthMax);
    setHeightMin(pendingHeightMin);
    setHeightMax(pendingHeightMax);
    setRatioMin(pendingRatioMin);
    setRatioMax(pendingRatioMax);
    setDepthMin(pendingDepthMin);
    setDepthMax(pendingDepthMax);
    setTableMin(pendingTableMin);
    setTableMax(pendingTableMax);
    setCrownHeightMin(pendingCrownHeightMin);
    setCrownHeightMax(pendingCrownHeightMax);
    setCrownAngleMin(pendingCrownAngleMin);
    setCrownAngleMax(pendingCrownAngleMax);
    setPavilionDepthMin(pendingPavilionDepthMin);
    setPavilionDepthMax(pendingPavilionDepthMax);
    setPavilionAngleMin(pendingPavilionAngleMin);
    setPavilionAngleMax(pendingPavilionAngleMax);
    setGirdleMin(pendingGirdleMin);
    setGirdleMax(pendingGirdleMax);
    setMilky(pendingMilky);
    setEyeClean(pendingEyeClean);
    setShade(pendingShade);
    setSortBy(pendingSortBy);
  }, [
    pendingShapes, pendingShowOnlyMedia, pendingAvailableItems, pendingSortBy,
    pendingCaratMin, pendingCaratMax, pendingPriceMin, pendingPriceMax,
    pendingColorType, pendingWhiteColors, pendingFancyColors,
    pendingFancyIntensity, pendingFancyOvertone, pendingClarities,
    pendingCuts, pendingPolish, pendingSymmetry, pendingCertifications,
    pendingCertificateType, pendingFluorescence, pendingLengthMin,
    pendingLengthMax, pendingWidthMin, pendingWidthMax, pendingHeightMin,
    pendingHeightMax, pendingRatioMin, pendingRatioMax, pendingDepthMin,
    pendingDepthMax, pendingTableMin, pendingTableMax, pendingCrownHeightMin,
    pendingCrownHeightMax, pendingCrownAngleMin, pendingCrownAngleMax,
    pendingPavilionDepthMin, pendingPavilionDepthMax, pendingPavilionAngleMin,
    pendingPavilionAngleMax, pendingGirdleMin, pendingGirdleMax, pendingMilky,
    pendingEyeClean, pendingShade,
  ]);

  // Sync applied filters to pending (used on initial load or when clearing)
  const syncPendingToApplied = useCallback(() => {
    setPendingShapes(selectedShapes);
    setPendingShowOnlyMedia(showOnlyMedia);
    setPendingAvailableItems(availableItems);
    setPendingCaratMin(caratMin);
    setPendingCaratMax(caratMax);
    setPendingPriceMin(priceMin);
    setPendingPriceMax(priceMax);
    setPendingColorType(colorType);
    setPendingWhiteColors(selectedWhiteColors);
    setPendingFancyColors(selectedFancyColors);
    setPendingFancyIntensity(selectedFancyIntensity);
    setPendingFancyOvertone(selectedFancyOvertone);
    setPendingClarities(selectedClarities);
    setPendingCuts(selectedCuts);
    setPendingPolish(selectedPolish);
    setPendingSymmetry(selectedSymmetry);
    setPendingCertifications(selectedCertifications);
    setPendingCertificateType(certificateType);
    setPendingFluorescence(selectedFluorescence);
    setPendingLengthMin(lengthMin);
    setPendingLengthMax(lengthMax);
    setPendingWidthMin(widthMin);
    setPendingWidthMax(widthMax);
    setPendingHeightMin(heightMin);
    setPendingHeightMax(heightMax);
    setPendingRatioMin(ratioMin);
    setPendingRatioMax(ratioMax);
    setPendingDepthMin(depthMin);
    setPendingDepthMax(depthMax);
    setPendingTableMin(tableMin);
    setPendingTableMax(tableMax);
    setPendingCrownHeightMin(crownHeightMin);
    setPendingCrownHeightMax(crownHeightMax);
    setPendingCrownAngleMin(crownAngleMin);
    setPendingCrownAngleMax(crownAngleMax);
    setPendingPavilionDepthMin(pavilionDepthMin);
    setPendingPavilionDepthMax(pavilionDepthMax);
    setPendingPavilionAngleMin(pavilionAngleMin);
    setPendingPavilionAngleMax(pavilionAngleMax);
    setPendingGirdleMin(girdleMin);
    setPendingGirdleMax(girdleMax);
    setPendingMilky(milky);
    setPendingEyeClean(eyeClean);
    setPendingShade(shade);
    setPendingSortBy(sortBy);
  }, [
    selectedShapes, showOnlyMedia, availableItems, caratMin, caratMax, sortBy,
    priceMin, priceMax, colorType, selectedWhiteColors, selectedFancyColors,
    selectedFancyIntensity, selectedFancyOvertone, selectedClarities,
    selectedCuts, selectedPolish, selectedSymmetry, selectedCertifications,
    certificateType, selectedFluorescence, lengthMin, lengthMax, widthMin,
    widthMax, heightMin, heightMax, ratioMin, ratioMax, depthMin, depthMax,
    tableMin, tableMax, crownHeightMin, crownHeightMax, crownAngleMin,
    crownAngleMax, pavilionDepthMin, pavilionDepthMax, pavilionAngleMin,
    pavilionAngleMax, girdleMin, girdleMax, milky, eyeClean, shade,
  ]);

  const clearAllFilters = useCallback(() => {
    // Clear pending states
    setPendingShapes([]);
    setPendingWhiteColors([]);
    setPendingFancyColors([]);
    setPendingFancyIntensity("");
    setPendingFancyOvertone("");
    setPendingColorType("White");
    setPendingClarities([]);
    setPendingCuts([]);
    setPendingPolish([]);
    setPendingSymmetry([]);
    setPendingCertifications([]);
    setPendingCertificateType(null);
    setPendingCaratMin("");
    setPendingCaratMax("");
    setPendingPriceMin("");
    setPendingPriceMax("");
    setPendingShowOnlyMedia(false);
    setPendingAvailableItems(false);
    setPendingFluorescence([]);
    setPendingLengthMin("");
    setPendingLengthMax("");
    setPendingWidthMin("");
    setPendingWidthMax("");
    setPendingHeightMin("");
    setPendingHeightMax("");
    setPendingRatioMin("");
    setPendingRatioMax("");
    setPendingDepthMin("");
    setPendingDepthMax("");
    setPendingTableMin("");
    setPendingTableMax("");
    setPendingCrownHeightMin("");
    setPendingCrownHeightMax("");
    setPendingCrownAngleMin("");
    setPendingCrownAngleMax("");
    setPendingPavilionDepthMin("");
    setPendingPavilionDepthMax("");
    setPendingPavilionAngleMin("");
    setPendingPavilionAngleMax("");
    setPendingGirdleMin("");
    setPendingGirdleMax("");
    setPendingMilky("");
    setPendingEyeClean("");
    setPendingShade("");
    setPendingSortBy("featured");
    // Clear applied states
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
    setSortBy("featured");
  }, []);

  const appliedFilters = useMemo(() => ({
    shapes: selectedShapes,
    colors: colorType === "White" ? selectedWhiteColors : selectedFancyColors,
    colorType,
    fancyColors: colorType === "Fancy" ? selectedFancyColors : [],
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
    sortBy,
  }), [
    selectedShapes, selectedWhiteColors, selectedFancyColors, colorType,
    selectedFancyIntensity, selectedFancyOvertone, selectedClarities,
    selectedCuts, selectedPolish, selectedSymmetry, selectedCertifications,
    certificateType, availableItems, showOnlyMedia, caratMin, caratMax,
    priceMin, priceMax, lengthMin, lengthMax, widthMin, widthMax,
    heightMin, heightMax, ratioMin, ratioMax, depthMin, depthMax,
    tableMin, tableMax, crownHeightMin, crownHeightMax, crownAngleMin,
    crownAngleMax, pavilionDepthMin, pavilionDepthMax, pavilionAngleMin,
    pavilionAngleMax, girdleMin, girdleMax, milky, eyeClean, shade, sortBy,
  ]);

  const activeFiltersCount = useMemo(() =>
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
    (shade ? 1 : 0) +
    (sortBy !== "featured" ? 1 : 0),
    [
      selectedShapes, selectedWhiteColors, selectedFancyColors,
      selectedFancyIntensity, selectedFancyOvertone, selectedClarities,
      selectedCuts, selectedPolish, selectedSymmetry, selectedCertifications,
      certificateType, caratMin, caratMax, priceMin, priceMax, showOnlyMedia,
      availableItems, selectedFluorescence, lengthMin, lengthMax, widthMin,
      widthMax, heightMin, heightMax, ratioMin, ratioMax, depthMin, depthMax,
      tableMin, tableMax, crownHeightMin, crownHeightMax, crownAngleMin,
      crownAngleMax, pavilionDepthMin, pavilionDepthMax, pavilionAngleMin,
      pavilionAngleMax, girdleMin, girdleMax, milky, eyeClean, shade,
      sortBy,
    ]
  );

  // Count filters that are selected but not yet applied
  const pendingFiltersCount = useMemo(() => {
    const count = pendingShapes.length +
    pendingWhiteColors.length +
    pendingFancyColors.length +
    (pendingFancyIntensity ? 1 : 0) +
    (pendingFancyOvertone ? 1 : 0) +
    pendingClarities.length +
    pendingCuts.length +
    pendingPolish.length +
    pendingSymmetry.length +
    pendingCertifications.length +
    (pendingCertificateType ? 1 : 0) +
    (pendingCaratMin || pendingCaratMax ? 1 : 0) +
    (pendingPriceMin || pendingPriceMax ? 1 : 0) +
    (pendingShowOnlyMedia ? 1 : 0) +
    (pendingAvailableItems ? 1 : 0) +
    pendingFluorescence.length +
    (pendingLengthMin || pendingLengthMax ? 1 : 0) +
    (pendingWidthMin || pendingWidthMax ? 1 : 0) +
    (pendingHeightMin || pendingHeightMax ? 1 : 0) +
    (pendingRatioMin || pendingRatioMax ? 1 : 0) +
    (pendingDepthMin || pendingDepthMax ? 1 : 0) +
    (pendingTableMin || pendingTableMax ? 1 : 0) +
    (pendingCrownHeightMin || pendingCrownHeightMax ? 1 : 0) +
    (pendingCrownAngleMin || pendingCrownAngleMax ? 1 : 0) +
    (pendingPavilionDepthMin || pendingPavilionDepthMax ? 1 : 0) +
    (pendingPavilionAngleMin || pendingPavilionAngleMax ? 1 : 0) +
    (pendingGirdleMin || pendingGirdleMax ? 1 : 0) +
    (pendingMilky ? 1 : 0) +
    (pendingEyeClean ? 1 : 0) +
    (pendingShade ? 1 : 0);
    return count;
  }, [
      pendingShapes, pendingWhiteColors, pendingFancyColors,
      pendingFancyIntensity, pendingFancyOvertone, pendingClarities,
      pendingCuts, pendingPolish, pendingSymmetry, pendingCertifications,
      pendingCertificateType, pendingCaratMin, pendingCaratMax, pendingPriceMin,
      pendingPriceMax, pendingShowOnlyMedia, pendingAvailableItems,
      pendingFluorescence, pendingLengthMin, pendingLengthMax, pendingWidthMin,
      pendingWidthMax, pendingHeightMin, pendingHeightMax, pendingRatioMin,
      pendingRatioMax, pendingDepthMin, pendingDepthMax, pendingTableMin,
      pendingTableMax, pendingCrownHeightMin, pendingCrownHeightMax,
      pendingCrownAngleMin, pendingCrownAngleMax, pendingPavilionDepthMin,
      pendingPavilionDepthMax, pendingPavilionAngleMin, pendingPavilionAngleMax,
      pendingGirdleMin, pendingGirdleMax, pendingMilky, pendingEyeClean, pendingShade,
    ]
  );

  return {
    // Sort by
    sortBy,
    pendingSortBy,
    setPendingSortBy,
    // Applied States (for display in active filters)
    selectedShapes,
    showOnlyMedia,
    availableItems,
    caratMin,
    caratMax,
    priceMin,
    priceMax,
    colorType,
    selectedWhiteColors,
    selectedFancyColors,
    selectedFancyIntensity,
    selectedFancyOvertone,
    selectedClarities,
    selectedCuts,
    selectedPolish,
    selectedSymmetry,
    selectedCertifications,
    certificateType,
    selectedFluorescence,
    expandedSections,
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
    // Pending States (for filter UI)
    pendingShapes,
    pendingShowOnlyMedia,
    pendingAvailableItems,
    pendingCaratMin,
    pendingCaratMax,
    pendingPriceMin,
    pendingPriceMax,
    pendingColorType,
    pendingWhiteColors,
    pendingFancyColors,
    pendingFancyIntensity,
    pendingFancyOvertone,
    pendingClarities,
    pendingCuts,
    pendingPolish,
    pendingSymmetry,
    pendingCertifications,
    pendingCertificateType,
    pendingFluorescence,
    pendingLengthMin,
    pendingLengthMax,
    pendingWidthMin,
    pendingWidthMax,
    pendingHeightMin,
    pendingHeightMax,
    pendingRatioMin,
    pendingRatioMax,
    pendingDepthMin,
    pendingDepthMax,
    pendingTableMin,
    pendingTableMax,
    pendingCrownHeightMin,
    pendingCrownHeightMax,
    pendingCrownAngleMin,
    pendingCrownAngleMax,
    pendingPavilionDepthMin,
    pendingPavilionDepthMax,
    pendingPavilionAngleMin,
    pendingPavilionAngleMax,
    pendingGirdleMin,
    pendingGirdleMax,
    pendingMilky,
    pendingEyeClean,
    pendingShade,
    // Counts and computed
    appliedFilters,
    activeFiltersCount,
    pendingFiltersCount,
    // Pending Setters (for filter UI)
    setPendingShowOnlyMedia,
    setPendingAvailableItems,
    setPendingCaratMin,
    setPendingCaratMax,
    setPendingPriceMin,
    setPendingPriceMax,
    setPendingColorType,
    setPendingFancyIntensity,
    setPendingFancyOvertone,
    setPendingCertificateType,
    setPendingLengthMin,
    setPendingLengthMax,
    setPendingWidthMin,
    setPendingWidthMax,
    setPendingHeightMin,
    setPendingHeightMax,
    setPendingRatioMin,
    setPendingRatioMax,
    setPendingDepthMin,
    setPendingDepthMax,
    setPendingTableMin,
    setPendingTableMax,
    setPendingCrownHeightMin,
    setPendingCrownHeightMax,
    setPendingCrownAngleMin,
    setPendingCrownAngleMax,
    setPendingPavilionDepthMin,
    setPendingPavilionDepthMax,
    setPendingPavilionAngleMin,
    setPendingPavilionAngleMax,
    setPendingGirdleMin,
    setPendingGirdleMax,
    setPendingMilky,
    setPendingEyeClean,
    setPendingShade,
    // Applied Setters (for clearing)
    setShowOnlyMedia,
    setAvailableItems,
    setCaratMin,
    setCaratMax,
    setPriceMin,
    setPriceMax,
    setColorType,
    setSelectedFancyIntensity,
    setSelectedFancyOvertone,
    setCertificateType,
    setLengthMin,
    setLengthMax,
    setWidthMin,
    setWidthMax,
    setHeightMin,
    setHeightMax,
    setRatioMin,
    setRatioMax,
    setDepthMin,
    setDepthMax,
    setTableMin,
    setTableMax,
    setCrownHeightMin,
    setCrownHeightMax,
    setCrownAngleMin,
    setCrownAngleMax,
    setPavilionDepthMin,
    setPavilionDepthMax,
    setPavilionAngleMin,
    setPavilionAngleMax,
    setGirdleMin,
    setGirdleMax,
    setMilky,
    setEyeClean,
    setShade,
    setSortBy,
    // Toggles
    toggleShape,
    toggleWhiteColor,
    toggleFancyColor,
    toggleClarity,
    toggleCut,
    togglePolish,
    toggleSymmetry,
    toggleCertification,
    toggleFluorescence,
    toggleSection,
    // Shape pagination
    visibleShapesCount,
    showMoreShapes,
    resetVisibleShapes,
    // Actions
    applyFilters,
    syncPendingToApplied,
    clearAllFilters,
  };
};

// Filter Content Component
export const DiamondFilterContent = ({
  filters,
}) => {
  const {
    // Use pending states for UI controls
    pendingShapes: selectedShapes,
    pendingColorType: colorType,
    pendingWhiteColors: selectedWhiteColors,
    pendingFancyColors: selectedFancyColors,
    pendingFancyIntensity: selectedFancyIntensity,
    pendingFancyOvertone: selectedFancyOvertone,
    pendingClarities: selectedClarities,
    pendingCuts: selectedCuts,
    pendingPolish: selectedPolish,
    pendingSymmetry: selectedSymmetry,
    pendingCertifications: selectedCertifications,
    pendingCertificateType: certificateType,
    pendingFluorescence: selectedFluorescence,
    pendingCaratMin: caratMin,
    pendingCaratMax: caratMax,
    pendingPriceMin: priceMin,
    pendingPriceMax: priceMax,
    expandedSections,
    visibleShapesCount,
    pendingLengthMin: lengthMin,
    pendingLengthMax: lengthMax,
    pendingWidthMin: widthMin,
    pendingWidthMax: widthMax,
    pendingHeightMin: heightMin,
    pendingHeightMax: heightMax,
    pendingRatioMin: ratioMin,
    pendingRatioMax: ratioMax,
    pendingDepthMin: depthMin,
    pendingDepthMax: depthMax,
    pendingTableMin: tableMin,
    pendingTableMax: tableMax,
    pendingCrownHeightMin: crownHeightMin,
    pendingCrownHeightMax: crownHeightMax,
    pendingCrownAngleMin: crownAngleMin,
    pendingCrownAngleMax: crownAngleMax,
    pendingPavilionDepthMin: pavilionDepthMin,
    pendingPavilionDepthMax: pavilionDepthMax,
    pendingPavilionAngleMin: pavilionAngleMin,
    pendingPavilionAngleMax: pavilionAngleMax,
    pendingGirdleMin: girdleMin,
    pendingGirdleMax: girdleMax,
    pendingMilky: milky,
    pendingEyeClean: eyeClean,
    pendingShade: shade,
    // Pending setters
    setPendingColorType: setColorType,
    setPendingFancyIntensity: setSelectedFancyIntensity,
    setPendingFancyOvertone: setSelectedFancyOvertone,
    setPendingCertificateType: setCertificateType,
    setPendingCaratMin: setCaratMin,
    setPendingCaratMax: setCaratMax,
    setPendingPriceMin: setPriceMin,
    setPendingPriceMax: setPriceMax,
    setPendingLengthMin: setLengthMin,
    setPendingLengthMax: setLengthMax,
    setPendingWidthMin: setWidthMin,
    setPendingWidthMax: setWidthMax,
    setPendingHeightMin: setHeightMin,
    setPendingHeightMax: setHeightMax,
    setPendingRatioMin: setRatioMin,
    setPendingRatioMax: setRatioMax,
    setPendingDepthMin: setDepthMin,
    setPendingDepthMax: setDepthMax,
    setPendingTableMin: setTableMin,
    setPendingTableMax: setTableMax,
    setPendingCrownHeightMin: setCrownHeightMin,
    setPendingCrownHeightMax: setCrownHeightMax,
    setPendingCrownAngleMin: setCrownAngleMin,
    setPendingCrownAngleMax: setCrownAngleMax,
    setPendingPavilionDepthMin: setPavilionDepthMin,
    setPendingPavilionDepthMax: setPavilionDepthMax,
    setPendingPavilionAngleMin: setPavilionAngleMin,
    setPendingPavilionAngleMax: setPavilionAngleMax,
    setPendingGirdleMin: setGirdleMin,
    setPendingGirdleMax: setGirdleMax,
    setPendingMilky: setMilky,
    setPendingEyeClean: setEyeClean,
    setPendingShade: setShade,
    // Toggles
    toggleShape,
    toggleWhiteColor,
    toggleFancyColor,
    toggleClarity,
    toggleCut,
    togglePolish,
    toggleSymmetry,
    toggleCertification,
    toggleFluorescence,
    toggleSection,
    showMoreShapes,
  } = filters;

  return (
    <div className="space-y-4">
      {/* Shape Filter */}
      <FilterSection title="Shape" section="shape" expandedSections={expandedSections} toggleSection={toggleSection}>
        <div className="grid grid-cols-4 gap-1.5">
          {shapes.slice(0, visibleShapesCount).map((shape) => (
            <button
              key={shape.name}
              onClick={() => toggleShape(shape.name)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all duration-200 ${
                selectedShapes.includes(shape.name)
                  ? "bg-[#DBEAFE] ring-1 ring-[#1E3A8A]"
                  : "bg-white border border-gray-100 hover:bg-[#F1F5F9]"
              }`}
            >
              <img
                src={shape.icon}
                alt={shape.name}
                className="w-8 h-8 object-contain mb-0.5"
              />
              <span
                className={`text-[8px] text-center leading-none ${
                  selectedShapes.includes(shape.name)
                    ? "text-[#1E3A8A] font-semibold"
                    : "text-gray-600"
                }`}
              >
                {shape.name}
              </span>
            </button>
          ))}
        </div>
        {visibleShapesCount < shapes.length && (
          <button
            onClick={showMoreShapes}
            className="w-full mt-3 py-2 flex items-center justify-center gap-1 text-sm text-[#1E3A8A] font-medium hover:bg-[#DBEAFE] rounded-lg transition-colors duration-200"
          >
            More shape
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        )}
      </FilterSection>

      {/* Color Filter */}
      <FilterSection title="Color" section="color" expandedSections={expandedSections} toggleSection={toggleSection}>
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

        {colorType === "Fancy" && (
          <div>
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
            <div className="space-y-3">
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
      <FilterSection title="Carat Weight" section="carat" expandedSections={expandedSections} toggleSection={toggleSection}>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="number"
              step="0.01"
              placeholder="ct min"
              value={caratMin}
              onChange={(e) => setCaratMin(e.target.value)}
              className="rounded-lg py-2.5 text-sm text-gray-900"
            />
          </div>
          <span className="text-[#64748B]">-</span>
          <div className="flex-1">
            <Input
              type="number"
              step="0.01"
              placeholder="ct max"
              value={caratMax}
              onChange={(e) => setCaratMax(e.target.value)}
              className="rounded-lg py-2.5 text-sm text-gray-900"
            />
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
      <FilterSection title="Price Range" section="price" expandedSections={expandedSections} toggleSection={toggleSection}>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="$ min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="rounded-lg py-2.5 text-sm text-gray-900"
            />
          </div>
          <span className="text-[#64748B]">-</span>
          <div className="flex-1">
            <Input
              type="number"
              placeholder="$ max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="rounded-lg py-2.5 text-sm text-gray-900"
            />
          </div>
        </div>
      </FilterSection>

      {/* Clarity Filter */}
      <FilterSection title="Clarity" section="clarity" expandedSections={expandedSections} toggleSection={toggleSection}>
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
      <FilterSection title="Cut Quality" section="cut" expandedSections={expandedSections} toggleSection={toggleSection}>
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
      <FilterSection title="Polish" section="polish" expandedSections={expandedSections} toggleSection={toggleSection}>
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
      <FilterSection title="Symmetry" section="symmetry" expandedSections={expandedSections} toggleSection={toggleSection}>
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
      <FilterSection title="Fluorescence" section="fluorescence" expandedSections={expandedSections} toggleSection={toggleSection}>
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
      <FilterSection title="Certificate" section="certification" expandedSections={expandedSections} toggleSection={toggleSection}>
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

        {certificateType === 'certified' && (
          <div className="grid grid-cols-3 gap-1.5">
            {certificationLabs.map((lab) => (
              <button
                key={lab}
                onClick={() => toggleCertification(lab)}
                className={`py-1.5 px-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                  selectedCertifications.includes(lab)
                    ? "bg-[#1E3A8A] text-white shadow-md"
                    : "bg-[#F1F5F9] text-[#475569] hover:bg-[#DBEAFE] hover:text-[#1E3A8A]"
                }`}
              >
                {lab}
              </button>
            ))}
          </div>
        )}
      </FilterSection>

      {/* Advanced Filters */}
      <FilterSection title="Advanced Filters" section="advanced" expandedSections={expandedSections} toggleSection={toggleSection}>
        <div className="space-y-4">
          {/* Measurements */}
          <div>
            <label className="block text-sm font-medium text-[#1E3A8A] mb-2">Length (mm)</label>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="min" value={lengthMin} onChange={(e) => setLengthMin(e.target.value)} className="rounded-lg py-2 text-sm" />
              <span className="text-[#64748B]">-</span>
              <Input type="number" placeholder="max" value={lengthMax} onChange={(e) => setLengthMax(e.target.value)} className="rounded-lg py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E3A8A] mb-2">Width (mm)</label>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="min" value={widthMin} onChange={(e) => setWidthMin(e.target.value)} className="rounded-lg py-2 text-sm" />
              <span className="text-[#64748B]">-</span>
              <Input type="number" placeholder="max" value={widthMax} onChange={(e) => setWidthMax(e.target.value)} className="rounded-lg py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E3A8A] mb-2">Height (mm)</label>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="min" value={heightMin} onChange={(e) => setHeightMin(e.target.value)} className="rounded-lg py-2 text-sm" />
              <span className="text-[#64748B]">-</span>
              <Input type="number" placeholder="max" value={heightMax} onChange={(e) => setHeightMax(e.target.value)} className="rounded-lg py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E3A8A] mb-2">Ratio</label>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="min" value={ratioMin} onChange={(e) => setRatioMin(e.target.value)} className="rounded-lg py-2 text-sm" />
              <span className="text-[#64748B]">-</span>
              <Input type="number" placeholder="max" value={ratioMax} onChange={(e) => setRatioMax(e.target.value)} className="rounded-lg py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E3A8A] mb-2">Depth %</label>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="min" value={depthMin} onChange={(e) => setDepthMin(e.target.value)} className="rounded-lg py-2 text-sm" />
              <span className="text-[#64748B]">-</span>
              <Input type="number" placeholder="max" value={depthMax} onChange={(e) => setDepthMax(e.target.value)} className="rounded-lg py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1E3A8A] mb-2">Table %</label>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="min" value={tableMin} onChange={(e) => setTableMin(e.target.value)} className="rounded-lg py-2 text-sm" />
              <span className="text-[#64748B]">-</span>
              <Input type="number" placeholder="max" value={tableMax} onChange={(e) => setTableMax(e.target.value)} className="rounded-lg py-2 text-sm" />
            </div>
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default DiamondFilterContent;
