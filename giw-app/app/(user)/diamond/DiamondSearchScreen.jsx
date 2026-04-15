import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// ============================================
// DATA CONSTANTS (from web version)
// ============================================
const SHAPES = [
  { name: "ROUND", icon: "circle", color: "#3B82F6" },
  { name: "PEAR", icon: "water-drop", color: "#8B5CF6" },
  { name: "OVAL", icon: "egg", color: "#10B981" },
  { name: "PRINCESS", icon: "square", color: "#F59E0B" },
  { name: "EMERALD", icon: "rectangle", color: "#14B8A6" },
  { name: "CUSHION", icon: "pentagon", color: "#EC4899" },
  { name: "MARQUISE", icon: "change-history", color: "#6366F1" },
  { name: "HEART", icon: "favorite", color: "#EF4444" },
  { name: "RADIANT", icon: "diamond", color: "#8B5CF6" },
  { name: "OTHER", icon: "more-horiz", color: "#6B7280" },
];

const WHITE_COLORS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const FANCY_COLORS = [
  "Yellow",
  "Blue",
  "Pink",
  "Red",
  "Green",
  "Purple",
  "Orange",
  "Violet",
  "Gray",
  "Black",
  "Brown",
  "Other",
];
const FANCY_INTENSITIES = [
  "Faint",
  "Very Light",
  "Light",
  "Fancy Light",
  "Fancy",
  "Fancy Dark",
  "Fancy Intense",
  "Fancy Vivid",
  "Fancy Deep",
];
const FANCY_OVERTONES = [
  "None",
  "Yellow",
  "Blue",
  "Pink",
  "Green",
  "Orange",
  "Brown",
  "Gray",
  "Purple",
  "Red",
];
const CLARITIES = [
  "FL",
  "IF",
  "VVS1",
  "VVS2",
  "VS1",
  "VS2",
  "SI1",
  "SI2",
  "I1",
  "I2",
];
const CUTS = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const POLISHES = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const SYMMETRIES = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const CERTIFICATION_LABS = [
  "GIA",
  "IGI",
  "HRD",
  "AGS",
  "GSI",
  "SGL",
  "GSAL",
  "Other",
  "None",
];
const FLUORESCENCE_OPTIONS = [
  "NONE",
  "Very Slight",
  "Slight",
  "Medium",
  "Strong",
  "Very Strong",
];
const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "carat-low", label: "Carat: Low to High" },
  { value: "carat-high", label: "Carat: High to Low" },
  { value: "color", label: "Color Grade" },
];

// ============================================
// FILTER SECTION COMPONENT
// ============================================
const FilterSection = ({ title, expanded, onToggle, children }) => {
  const [animation] = useState(new Animated.Value(expanded ? 1 : 0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["-90deg", "0deg"],
  });

  return (
    <View style={styles.filterSection}>
      <Pressable style={styles.filterSectionHeader} onPress={onToggle}>
        <Text style={styles.filterSectionTitle}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialIcons name="chevron-right" size={20} color="#64748B" />
        </Animated.View>
      </Pressable>
      {expanded && <View style={styles.filterSectionContent}>{children}</View>}
    </View>
  );
};

// ============================================
// TOGGLE BUTTON COMPONENT
// ============================================
const ToggleButton = ({
  label,
  selected,
  onPress,
  small,
  color = "#1E3A8A",
}) => (
  <Pressable
    style={[
      styles.toggleButton,
      small && styles.toggleButtonSmall,
      selected && { backgroundColor: color, borderColor: color },
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.toggleButtonText,
        small && styles.toggleButtonTextSmall,
        selected && styles.toggleButtonTextSelected,
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

// ============================================
// RANGE INPUT COMPONENT
// ============================================
const RangeInput = ({
  label,
  min,
  max,
  onMinChange,
  onMaxChange,
  unit = "",
}) => (
  <View style={styles.rangeContainer}>
    <Text style={styles.rangeLabel}>{label}</Text>
    <View style={styles.rangeInputs}>
      <TextInput
        style={styles.rangeInput}
        placeholder="Min"
        value={min}
        onChangeText={onMinChange}
        keyboardType="decimal-pad"
      />
      <Text style={styles.rangeSeparator}>-</Text>
      <TextInput
        style={styles.rangeInput}
        placeholder="Max"
        value={max}
        onChangeText={onMaxChange}
        keyboardType="decimal-pad"
      />
      {unit ? <Text style={styles.rangeUnit}>{unit}</Text> : null}
    </View>
  </View>
);

// ============================================
// SELECT DROPDOWN COMPONENT
// ============================================
const SelectDropdown = ({ label, value, options, onSelect }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.selectContainer}>
      <Text style={styles.selectLabel}>{label}</Text>
      <Pressable style={styles.selectButton} onPress={() => setShowModal(true)}>
        <Text style={value ? styles.selectValue : styles.selectPlaceholder}>
          {value || "Select..."}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#64748B" />
      </Pressable>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <Pressable onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color="#0F172A" />
              </Pressable>
            </View>
            <ScrollView>
              <Pressable
                style={styles.modalOption}
                onPress={() => {
                  onSelect("");
                  setShowModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>All</Text>
              </Pressable>
              {options.map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.modalOption,
                    value === option && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setShowModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      value === option && styles.modalOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {value === option && (
                    <MaterialIcons name="check" size={20} color="#1E3A8A" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ============================================
// ACTIVE FILTER PILL
// ============================================
const FilterPill = ({
  label,
  onRemove,
  color = "#DBEAFE",
  textColor = "#1E3A8A",
}) => (
  <View style={[styles.filterPill, { backgroundColor: color }]}>
    <Text style={[styles.filterPillText, { color: textColor }]}>{label}</Text>
    <Pressable onPress={onRemove} hitSlop={4}>
      <MaterialIcons name="close" size={14} color={textColor} />
    </Pressable>
  </View>
);

// ============================================
// MAIN DIAMOND SEARCH SCREEN
// ============================================
const DiamondSearchScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Get diamond type from params (natural or labgrown)
  const type = params.type || "natural";
  const isNatural = type === "natural";

  // ==========================================
  // STATE
  // ==========================================
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter States
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [colorType, setColorType] = useState("White");
  const [selectedWhiteColors, setSelectedWhiteColors] = useState([]);
  const [selectedFancyColors, setSelectedFancyColors] = useState([]);
  const [selectedFancyIntensity, setSelectedFancyIntensity] = useState("");
  const [selectedFancyOvertone, setSelectedFancyOvertone] = useState("");
  const [selectedClarities, setSelectedClarities] = useState([]);
  const [selectedCuts, setSelectedCuts] = useState([]);
  const [selectedPolish, setSelectedPolish] = useState([]);
  const [selectedSymmetry, setSelectedSymmetry] = useState([]);
  const [selectedFluorescence, setSelectedFluorescence] = useState([]);
  const [certificateType, setCertificateType] = useState(null);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [showOnlyMedia, setShowOnlyMedia] = useState(false);
  const [availableItems, setAvailableItems] = useState(false);

  // Range States
  const [caratMin, setCaratMin] = useState("");
  const [caratMax, setCaratMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Advanced Filter States
  const [lengthMin, setLengthMin] = useState("");
  const [lengthMax, setLengthMax] = useState("");
  const [widthMin, setWidthMin] = useState("");
  const [widthMax, setWidthMax] = useState("");
  const [depthMin, setDepthMin] = useState("");
  const [depthMax, setDepthMax] = useState("");
  const [tableMin, setTableMin] = useState("");
  const [tableMax, setTableMax] = useState("");
  const [milky, setMilky] = useState("");
  const [eyeClean, setEyeClean] = useState("");

  // Expanded Sections
  const [expandedSections, setExpandedSections] = useState({
    shape: true,
    color: true,
    clarity: false,
    cut: false,
    polish: false,
    symmetry: false,
    carat: true,
    price: true,
    certification: false,
    fluorescence: false,
    advanced: false,
  });

  // Applied Filters (for ShowStock)
  const [appliedFilters, setAppliedFilters] = useState({});

  // ==========================================
  // TOGGLE HANDLERS
  // ==========================================
  const toggleShape = useCallback((shape) => {
    setSelectedShapes((prev) =>
      prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape],
    );
  }, []);

  const toggleWhiteColor = useCallback((color) => {
    setSelectedWhiteColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  }, []);

  const toggleFancyColor = useCallback((color) => {
    setSelectedFancyColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  }, []);

  const toggleClarity = useCallback((clarity) => {
    setSelectedClarities((prev) =>
      prev.includes(clarity)
        ? prev.filter((c) => c !== clarity)
        : [...prev, clarity],
    );
  }, []);

  const toggleCut = useCallback((cut) => {
    setSelectedCuts((prev) =>
      prev.includes(cut) ? prev.filter((c) => c !== cut) : [...prev, cut],
    );
  }, []);

  const togglePolish = useCallback((polish) => {
    setSelectedPolish((prev) =>
      prev.includes(polish)
        ? prev.filter((p) => p !== polish)
        : [...prev, polish],
    );
  }, []);

  const toggleSymmetry = useCallback((symmetry) => {
    setSelectedSymmetry((prev) =>
      prev.includes(symmetry)
        ? prev.filter((s) => s !== symmetry)
        : [...prev, symmetry],
    );
  }, []);

  const toggleFluorescence = useCallback((fluor) => {
    setSelectedFluorescence((prev) =>
      prev.includes(fluor) ? prev.filter((f) => f !== fluor) : [...prev, fluor],
    );
  }, []);

  const toggleCertification = useCallback((cert) => {
    setSelectedCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert],
    );
  }, []);

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // ==========================================
  // CLEAR & APPLY FILTERS
  // ==========================================
  const clearAllFilters = useCallback(() => {
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
    setDepthMin("");
    setDepthMax("");
    setTableMin("");
    setTableMax("");
    setMilky("");
    setEyeClean("");
    setAppliedFilters({});
  }, []);

  const applyFilters = useCallback(() => {
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
      depthMin,
      depthMax,
      tableMin,
      tableMax,
      milky,
      eyeClean,
    });
  }, [
    selectedShapes,
    selectedWhiteColors,
    selectedFancyColors,
    colorType,
    selectedFancyIntensity,
    selectedFancyOvertone,
    selectedClarities,
    selectedCuts,
    selectedPolish,
    selectedSymmetry,
    selectedCertifications,
    certificateType,
    availableItems,
    showOnlyMedia,
    caratMin,
    caratMax,
    priceMin,
    priceMax,
    lengthMin,
    lengthMax,
    widthMin,
    widthMax,
    depthMin,
    depthMax,
    tableMin,
    tableMax,
    milky,
    eyeClean,
  ]);

  // ==========================================
  // ACTIVE FILTERS COUNT
  // ==========================================
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
    selectedFluorescence.length;

  // ==========================================
  // FILTER CONTENT COMPONENT
  // ==========================================
  const FilterContent = () => (
    <View style={styles.filterContent}>
      {/* Shape Filter */}
      <FilterSection
        title="Shape"
        expanded={expandedSections.shape}
        onToggle={() => toggleSection("shape")}
      >
        <View style={styles.shapesGrid}>
          {SHAPES.map((shape, index) => (
            <Pressable
              key={shape.name}
              style={[
                styles.shapeButton,
                (index + 1) % 4 === 0 && styles.shapeButtonNoMargin,
                selectedShapes.includes(shape.name) &&
                  styles.shapeButtonSelected,
              ]}
              onPress={() => toggleShape(shape.name)}
            >
              <LinearGradient
                colors={
                  selectedShapes.includes(shape.name)
                    ? [shape.color, shape.color]
                    : ["#F1F5F9", "#E2E8F0"]
                }
                style={styles.shapeIconContainer}
              >
                <MaterialIcons
                  name={shape.icon}
                  size={24}
                  color={
                    selectedShapes.includes(shape.name) ? "#FFFFFF" : "#64748B"
                  }
                />
              </LinearGradient>
              <Text
                style={[
                  styles.shapeLabel,
                  selectedShapes.includes(shape.name) &&
                    styles.shapeLabelSelected,
                ]}
              >
                {shape.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </FilterSection>

      {/* Color Filter */}
      <FilterSection
        title="Color"
        expanded={expandedSections.color}
        onToggle={() => toggleSection("color")}
      >
        {/* Color Type Toggle */}
        <View style={styles.colorTypeContainer}>
          <Pressable
            style={[
              styles.colorTypeButton,
              colorType === "White" && styles.colorTypeButtonActive,
            ]}
            onPress={() => setColorType("White")}
          >
            <Text
              style={[
                styles.colorTypeText,
                colorType === "White" && styles.colorTypeTextActive,
              ]}
            >
              White
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.colorTypeButton,
              colorType === "Fancy" && styles.colorTypeButtonActive,
            ]}
            onPress={() => setColorType("Fancy")}
          >
            <Text
              style={[
                styles.colorTypeText,
                colorType === "Fancy" && styles.colorTypeTextActive,
              ]}
            >
              Fancy
            </Text>
          </Pressable>
        </View>

        {/* White Color Options */}
        {colorType === "White" && (
          <View style={styles.colorGrid}>
            {WHITE_COLORS.map((color) => (
              <ToggleButton
                key={color}
                label={color}
                selected={selectedWhiteColors.includes(color)}
                onPress={() => toggleWhiteColor(color)}
                small
              />
            ))}
          </View>
        )}

        {/* Fancy Color Options */}
        {colorType === "Fancy" && (
          <View style={styles.fancyColorContainer}>
            <View style={styles.colorGrid}>
              {FANCY_COLORS.map((color) => (
                <ToggleButton
                  key={color}
                  label={color}
                  selected={selectedFancyColors.includes(color)}
                  onPress={() => toggleFancyColor(color)}
                  small
                  color="#BE185D"
                />
              ))}
            </View>
            <SelectDropdown
              label="Color Intensity"
              value={selectedFancyIntensity}
              options={FANCY_INTENSITIES}
              onSelect={setSelectedFancyIntensity}
            />
            <SelectDropdown
              label="Color Overtone"
              value={selectedFancyOvertone}
              options={FANCY_OVERTONES}
              onSelect={setSelectedFancyOvertone}
            />
          </View>
        )}
      </FilterSection>

      {/* Carat Filter */}
      <FilterSection
        title="Carat Weight"
        expanded={expandedSections.carat}
        onToggle={() => toggleSection("carat")}
      >
        <RangeInput
          min={caratMin}
          max={caratMax}
          onMinChange={setCaratMin}
          onMaxChange={setCaratMax}
          unit="ct"
        />
        <View style={styles.quickSelectRow}>
          {[0.5, 1, 2, 3, 5].map((carat) => (
            <Pressable
              key={carat}
              style={styles.quickSelectButton}
              onPress={() => {
                setCaratMin(carat.toString());
                setCaratMax((carat + 0.99).toString());
              }}
            >
              <Text style={styles.quickSelectText}>{carat}ct</Text>
            </Pressable>
          ))}
        </View>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection
        title="Price Range"
        expanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
      >
        <RangeInput
          min={priceMin}
          max={priceMax}
          onMinChange={setPriceMin}
          onMaxChange={setPriceMax}
          unit="$"
        />
      </FilterSection>

      {/* Clarity Filter */}
      <FilterSection
        title="Clarity"
        expanded={expandedSections.clarity}
        onToggle={() => toggleSection("clarity")}
      >
        <View style={styles.twoColumnGrid}>
          {CLARITIES.map((clarity) => (
            <ToggleButton
              key={clarity}
              label={clarity}
              selected={selectedClarities.includes(clarity)}
              onPress={() => toggleClarity(clarity)}
              small
            />
          ))}
        </View>
      </FilterSection>

      {/* Cut Filter */}
      <FilterSection
        title="Cut Quality"
        expanded={expandedSections.cut}
        onToggle={() => toggleSection("cut")}
      >
        {CUTS.map((cut) => (
          <Pressable
            key={cut}
            style={[
              styles.listButton,
              selectedCuts.includes(cut) && styles.listButtonSelected,
            ]}
            onPress={() => toggleCut(cut)}
          >
            <Text
              style={[
                styles.listButtonText,
                selectedCuts.includes(cut) && styles.listButtonTextSelected,
              ]}
            >
              {cut}
            </Text>
            {selectedCuts.includes(cut) && (
              <MaterialIcons name="star" size={16} color="#FFFFFF" />
            )}
          </Pressable>
        ))}
      </FilterSection>

      {/* Polish Filter */}
      <FilterSection
        title="Polish"
        expanded={expandedSections.polish}
        onToggle={() => toggleSection("polish")}
      >
        {POLISHES.map((polish) => (
          <Pressable
            key={polish}
            style={[
              styles.listButton,
              selectedPolish.includes(polish) && styles.listButtonSelected,
            ]}
            onPress={() => togglePolish(polish)}
          >
            <Text
              style={[
                styles.listButtonText,
                selectedPolish.includes(polish) &&
                  styles.listButtonTextSelected,
              ]}
            >
              {polish}
            </Text>
            {selectedPolish.includes(polish) && (
              <MaterialIcons name="star" size={16} color="#FFFFFF" />
            )}
          </Pressable>
        ))}
      </FilterSection>

      {/* Symmetry Filter */}
      <FilterSection
        title="Symmetry"
        expanded={expandedSections.symmetry}
        onToggle={() => toggleSection("symmetry")}
      >
        {SYMMETRIES.map((symmetry) => (
          <Pressable
            key={symmetry}
            style={[
              styles.listButton,
              selectedSymmetry.includes(symmetry) && styles.listButtonSelected,
            ]}
            onPress={() => toggleSymmetry(symmetry)}
          >
            <Text
              style={[
                styles.listButtonText,
                selectedSymmetry.includes(symmetry) &&
                  styles.listButtonTextSelected,
              ]}
            >
              {symmetry}
            </Text>
            {selectedSymmetry.includes(symmetry) && (
              <MaterialIcons name="star" size={16} color="#FFFFFF" />
            )}
          </Pressable>
        ))}
      </FilterSection>

      {/* Fluorescence Filter */}
      <FilterSection
        title="Fluorescence"
        expanded={expandedSections.fluorescence}
        onToggle={() => toggleSection("fluorescence")}
      >
        <View style={styles.colorGrid}>
          {FLUORESCENCE_OPTIONS.map((fluor) => (
            <ToggleButton
              key={fluor}
              label={fluor}
              selected={selectedFluorescence.includes(fluor)}
              onPress={() => toggleFluorescence(fluor)}
              small
              color="#7C3AED"
            />
          ))}
        </View>
      </FilterSection>

      {/* Certification Filter */}
      <FilterSection
        title="Certificate"
        expanded={expandedSections.certification}
        onToggle={() => toggleSection("certification")}
      >
        <View style={styles.colorTypeContainer}>
          <Pressable
            style={[
              styles.colorTypeButton,
              certificateType === "certified" && styles.colorTypeButtonActive,
            ]}
            onPress={() => setCertificateType("certified")}
          >
            <Text
              style={[
                styles.colorTypeText,
                certificateType === "certified" && styles.colorTypeTextActive,
              ]}
            >
              Certified
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.colorTypeButton,
              certificateType === "non-certified" &&
                styles.colorTypeButtonActive,
            ]}
            onPress={() => {
              setCertificateType("non-certified");
              setSelectedCertifications([]);
            }}
          >
            <Text
              style={[
                styles.colorTypeText,
                certificateType === "non-certified" &&
                  styles.colorTypeTextActive,
              ]}
            >
              Non-certified
            </Text>
          </Pressable>
        </View>

        {certificateType === "certified" && (
          <View style={styles.labSection}>
            <Text style={styles.labSectionTitle}>Laboratory Report</Text>
            <View style={styles.colorGrid}>
              {CERTIFICATION_LABS.map((lab) => (
                <ToggleButton
                  key={lab}
                  label={lab}
                  selected={selectedCertifications.includes(lab)}
                  onPress={() => toggleCertification(lab)}
                  small
                />
              ))}
            </View>
          </View>
        )}
      </FilterSection>

      {/* Advanced Filters */}
      <FilterSection
        title="Advanced Filters"
        expanded={expandedSections.advanced}
        onToggle={() => toggleSection("advanced")}
      >
        <RangeInput
          label="Length (mm)"
          min={lengthMin}
          max={lengthMax}
          onMinChange={setLengthMin}
          onMaxChange={setLengthMax}
        />
        <RangeInput
          label="Width (mm)"
          min={widthMin}
          max={widthMax}
          onMinChange={setWidthMin}
          onMaxChange={setWidthMax}
        />
        <RangeInput
          label="Depth (%)"
          min={depthMin}
          max={depthMax}
          onMinChange={setDepthMin}
          onMaxChange={setDepthMax}
        />
        <RangeInput
          label="Table (%)"
          min={tableMin}
          max={tableMax}
          onMinChange={setTableMin}
          onMaxChange={setTableMax}
        />
        <SelectDropdown
          label="Milky"
          value={milky}
          options={["None", "Light", "Medium", "Heavy"]}
          onSelect={setMilky}
        />
        <SelectDropdown
          label="Eye Clean"
          value={eyeClean}
          options={["Yes", "No"]}
          onSelect={setEyeClean}
        />
      </FilterSection>
    </View>
  );

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {isNatural ? "Natural Diamonds" : "Lab-Grown Diamonds"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isNatural
                ? "GIA Certified • Premium Quality"
                : "Eco-Friendly • Sustainable"}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              router.push(
                `/(user)/diamond/search?type=${isNatural ? "labgrown" : "natural"}`,
              )
            }
            style={styles.switchButton}
          >
            <MaterialIcons name="science" size={20} color="#1E3A8A" />
            <Text style={styles.switchButtonText}>
              {isNatural ? "Lab-Grown" : "Natural"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search diamonds..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable
          style={styles.filterButton}
          onPress={() => setShowMobileFilters(true)}
        >
          <MaterialIcons name="tune" size={20} color="#475569" />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Active Filters Scroll */}
      {activeFiltersCount > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activeFiltersContainer}
          contentContainerStyle={styles.activeFiltersContent}
        >
          {selectedShapes.map((shape) => (
            <FilterPill
              key={shape}
              label={shape}
              onRemove={() => toggleShape(shape)}
            />
          ))}
          {selectedWhiteColors.map((color) => (
            <FilterPill
              key={color}
              label={`Color ${color}`}
              onRemove={() => toggleWhiteColor(color)}
            />
          ))}
          {selectedFancyColors.map((color) => (
            <FilterPill
              key={color}
              label={`Fancy ${color}`}
              onRemove={() => toggleFancyColor(color)}
              color="#FCE7F3"
              textColor="#BE185D"
            />
          ))}
          {selectedFancyIntensity && (
            <FilterPill
              label={`Intensity: ${selectedFancyIntensity}`}
              onRemove={() => setSelectedFancyIntensity("")}
              color="#FCE7F3"
              textColor="#BE185D"
            />
          )}
          {selectedClarities.map((clarity) => (
            <FilterPill
              key={clarity}
              label={clarity}
              onRemove={() => toggleClarity(clarity)}
            />
          ))}
          {(caratMin || caratMax) && (
            <FilterPill
              label={`${caratMin || "0"} - ${caratMax || "∞"} ct`}
              onRemove={() => {
                setCaratMin("");
                setCaratMax("");
              }}
            />
          )}
          <Pressable style={styles.clearAllButton} onPress={clearAllFilters}>
            <MaterialIcons name="refresh" size={14} color="#1E3A8A" />
            <Text style={styles.clearAllText}>Clear all</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* Sort and View Toggle */}
      <View style={styles.toolbar}>
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <SelectDropdown
            label=""
            value={SORTS.find((s) => s.value === sortBy)?.label || "Featured"}
            options={SORTS.map((s) => s.label)}
            onSelect={(label) => {
              const sort = SORTS.find((s) => s.label === label);
              if (sort) setSortBy(sort.value);
            }}
          />
        </View>
        <View style={styles.viewToggle}>
          <Pressable
            style={[
              styles.viewButton,
              viewMode === "grid" && styles.viewButtonActive,
            ]}
            onPress={() => setViewMode("grid")}
          >
            <MaterialIcons
              name="grid-view"
              size={20}
              color={viewMode === "grid" ? "#FFFFFF" : "#64748B"}
            />
          </Pressable>
          <Pressable
            style={[
              styles.viewButton,
              viewMode === "list" && styles.viewButtonActive,
            ]}
            onPress={() => setViewMode("list")}
          >
            <MaterialIcons
              name="view-list"
              size={20}
              color={viewMode === "list" ? "#FFFFFF" : "#64748B"}
            />
          </Pressable>
        </View>
      </View>

      {/* Main Content - Diamond List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* TODO: Replace with actual DiamondList component */}
        <View style={styles.placeholderContainer}>
          <MaterialIcons name="diamond" size={48} color="#CBD5E1" />
          <Text style={styles.placeholderText}>Diamond list coming soon</Text>
          <Text style={styles.placeholderSubtext}>
            Type: {type} | Sort: {sortBy} | View: {viewMode}
          </Text>
          {activeFiltersCount > 0 && (
            <Text style={styles.placeholderSubtext}>
              {activeFiltersCount} filters applied
            </Text>
          )}
        </View>

        {/* Apply Button */}
        <Pressable style={styles.applyButton} onPress={applyFilters}>
          <LinearGradient
            colors={["#1E3A8A", "#1E40AF"]}
            style={styles.applyButtonGradient}
          >
            <MaterialIcons name="filter-list" size={20} color="#FFFFFF" />
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </LinearGradient>
        </Pressable>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Mobile Filters Modal */}
      <Modal
        visible={showMobileFilters}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <View style={styles.modalIconContainer}>
                <MaterialIcons name="diamond" size={24} color="#1E3A8A" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Filters</Text>
                <Text style={styles.modalSubtitle}>
                  {isNatural ? "Natural Diamonds" : "Lab-Grown Diamonds"}
                </Text>
              </View>
            </View>
            <Pressable onPress={() => setShowMobileFilters(false)}>
              <MaterialIcons name="close" size={24} color="#64748B" />
            </Pressable>
          </View>

          {/* Filter Content */}
          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            <FilterContent />
            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <Pressable style={styles.clearButton} onPress={clearAllFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </Pressable>
            <Pressable
              style={styles.applyFilterButton}
              onPress={() => {
                applyFilters();
                setShowMobileFilters(false);
              }}
            >
              <LinearGradient
                colors={["#1E3A8A", "#1E40AF"]}
                style={styles.applyFilterButtonGradient}
              >
                <Text style={styles.applyFilterButtonText}>
                  Apply Filters
                  {activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ""}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  switchButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  filterButton: {
    position: "relative",
    padding: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  activeFiltersContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    maxHeight: 50,
  },
  activeFiltersContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: "center",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    padding: 6,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: "#1E3A8A",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 8,
  },
  applyButton: {
    marginTop: 16,
  },
  applyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  modalScroll: {
    flex: 1,
    padding: 16,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  applyFilterButton: {
    flex: 2,
  },
  applyFilterButtonGradient: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  applyFilterButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // Filter Content Styles
  filterContent: {
    gap: 12,
  },
  filterSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  filterSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  filterSectionContent: {
    padding: 16,
    paddingTop: 0,
  },
  shapesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  shapeButton: {
    width: "23%",
    marginRight: "2.66%",
    marginBottom: 8,
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  shapeButtonSelected: {
    backgroundColor: "#DBEAFE",
    borderColor: "#1E3A8A",
  },
  shapeButtonNoMargin: {
    marginRight: 0,
  },
  shapeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  shapeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },
  shapeLabelSelected: {
    color: "#1E3A8A",
  },
  colorTypeContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  colorTypeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  colorTypeButtonActive: {
    backgroundColor: "#DBEAFE",
    borderWidth: 1,
    borderColor: "#1E3A8A",
  },
  colorTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  colorTypeTextActive: {
    color: "#1E3A8A",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  fancyColorContainer: {
    gap: 12,
  },
  toggleButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  toggleButtonSmall: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  toggleButtonTextSmall: {
    fontSize: 12,
  },
  toggleButtonTextSelected: {
    color: "#FFFFFF",
  },
  twoColumnGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    marginBottom: 6,
  },
  listButtonSelected: {
    backgroundColor: "#1E3A8A",
  },
  listButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  listButtonTextSelected: {
    color: "#FFFFFF",
  },
  rangeContainer: {
    marginBottom: 12,
  },
  rangeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  rangeInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rangeInput: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
    textAlign: "center",
  },
  rangeSeparator: {
    fontSize: 14,
    color: "#64748B",
  },
  rangeUnit: {
    fontSize: 12,
    color: "#64748B",
  },
  quickSelectRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  quickSelectButton: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  quickSelectText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  labSection: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  labSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 10,
  },
  // Select Dropdown Styles
  selectContainer: {
    marginBottom: 12,
  },
  selectLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  selectValue: {
    fontSize: 14,
    color: "#0F172A",
  },
  selectPlaceholder: {
    fontSize: 14,
    color: "#94A3B8",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.7,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalOptionSelected: {
    backgroundColor: "#EFF6FF",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#0F172A",
  },
  modalOptionTextSelected: {
    color: "#1E3A8A",
    fontWeight: "600",
  },
});

export default DiamondSearchScreen;
