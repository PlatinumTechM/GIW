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
  Image,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// ============================================
// DATA CONSTANTS
// ============================================
const CATEGORIES = [
  { id: "all", label: "All Jewelry", icon: "diamond", count: 24 },
  { id: "rings", label: "Rings", icon: "auto-awesome", count: 8 },
  { id: "necklaces", label: "Necklaces", icon: "workspace-premium", count: 6 },
  { id: "earrings", label: "Earrings", icon: "star", count: 5 },
  { id: "bracelets", label: "Bracelets", icon: "watch", count: 5 },
];

const METAL_TYPES = [
  { id: "yellow-gold", label: "Yellow Gold", color: "#FFD700" },
  { id: "white-gold", label: "White Gold", color: "#E8E8E8" },
  { id: "rose-gold", label: "Rose Gold", color: "#E8B4B4" },
  { id: "platinum", label: "Platinum", color: "#C0C0C0" },
];

const PRICE_RANGES = [
  { id: "under-1000", label: "Under $1,000", min: 0, max: 1000 },
  { id: "1000-5000", label: "$1,000 - $5,000", min: 1000, max: 5000 },
  { id: "5000-10000", label: "$5,000 - $10,000", min: 5000, max: 10000 },
  { id: "10000-25000", label: "$10,000 - $25,000", min: 10000, max: 25000 },
  { id: "over-25000", label: "Over $25,000", min: 25000, max: 50000 },
];

const GENDERS = [
  { id: "all", label: "All" },
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "unisex", label: "Unisex" },
];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

// Sample Jewelry Items
const JEWELRY_ITEMS = [
  {
    id: 1,
    name: "Royal Diamond Ring",
    category: "rings",
    price: 8200,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
    badge: "Eco-Friendly",
    rating: 4.9,
    description: "18K White Gold with VS1 Natural Diamond",
    metal: "white-gold",
    gender: "women",
  },
  {
    id: 2,
    name: "Eternal Love Necklace",
    category: "necklaces",
    price: 5600,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
    badge: "New",
    rating: 4.8,
    description: "Platinum with Heart-shaped Natural Diamond",
    metal: "platinum",
    gender: "women",
  },
  {
    id: 3,
    name: "Celestial Earrings",
    category: "earrings",
    price: 3400,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
    badge: "Popular",
    rating: 4.7,
    description: "Rose Gold with Natural Cluster Diamonds",
    metal: "rose-gold",
    gender: "women",
  },
  {
    id: 4,
    name: "Golden Era Bracelet",
    category: "bracelets",
    price: 9800,
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
    badge: "Premium",
    rating: 5.0,
    description: "22K Yellow Gold with Natural Baguette Diamonds",
    metal: "yellow-gold",
    gender: "unisex",
  },
  {
    id: 5,
    name: "Sapphire Dream Ring",
    category: "rings",
    price: 6200,
    image:
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop",
    badge: null,
    rating: 4.6,
    description: "White Gold with Natural Sapphire & Diamonds",
    metal: "white-gold",
    gender: "women",
  },
  {
    id: 6,
    name: "Pearl Majesty Necklace",
    category: "necklaces",
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
    badge: "Classic",
    rating: 4.8,
    description: "Lab Pearls with Diamond Clasp",
    metal: "white-gold",
    gender: "women",
  },
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
const ToggleButton = ({ label, selected, onPress, style, textStyle }) => (
  <Pressable
    style={[
      styles.toggleButton,
      selected && { backgroundColor: "#1E3A8A", borderColor: "#1E3A8A" },
      style,
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.toggleButtonText,
        selected && styles.toggleButtonTextSelected,
        textStyle,
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
      {label ? <Text style={styles.selectLabel}>{label}</Text> : null}
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
              <Text style={styles.modalTitle}>{label || "Select"}</Text>
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
                  key={typeof option === "string" ? option : option.value}
                  style={[
                    styles.modalOption,
                    value ===
                      (typeof option === "string" ? option : option.label) &&
                      styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    onSelect(
                      typeof option === "string" ? option : option.label,
                    );
                    setShowModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      value ===
                        (typeof option === "string" ? option : option.label) &&
                        styles.modalOptionTextSelected,
                    ]}
                  >
                    {typeof option === "string" ? option : option.label}
                  </Text>
                  {value ===
                    (typeof option === "string" ? option : option.label) && (
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
// JEWELRY CARD COMPONENT
// ============================================
const JewelryCard = ({ item, onPress, viewMode }) => {
  if (viewMode === "list") {
    return (
      <Pressable style={styles.listCard} onPress={onPress}>
        <Image source={{ uri: item.image }} style={styles.listCardImage} />
        <View style={styles.listCardContent}>
          <View style={styles.listCardHeader}>
            <Text style={styles.listCardName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.listCardDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.listCardFooter}>
            <Text style={styles.listCardPrice}>
              ${item.price.toLocaleString()}
            </Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.gridCard} onPress={onPress}>
      <View style={styles.gridCardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.gridCardImage} />
        {item.badge && (
          <View style={styles.gridBadge}>
            <Text style={styles.gridBadgeText}>{item.badge}</Text>
          </View>
        )}
        <Pressable style={styles.favoriteButton}>
          <MaterialIcons name="favorite-outline" size={20} color="#64748B" />
        </Pressable>
      </View>
      <View style={styles.gridCardContent}>
        <Text style={styles.gridCardName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.gridCardDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.gridCardFooter}>
          <Text style={styles.gridCardPrice}>
            ${item.price.toLocaleString()}
          </Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

// ============================================
// MAIN JEWELRY SEARCH SCREEN
// ============================================
const JewelrySearchScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Get jewelry type from params (natural or labgrown)
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
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedMetals, setSelectedMetals] = useState([]);
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [showWithMedia, setShowWithMedia] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);

  // Expanded Sections
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    metal: true,
    gender: false,
  });

  // ==========================================
  // TOGGLE HANDLERS
  // ==========================================
  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const toggleMetal = useCallback((metalId) => {
    setSelectedMetals((prev) =>
      prev.includes(metalId)
        ? prev.filter((id) => id !== metalId)
        : [...prev, metalId],
    );
  }, []);

  // ==========================================
  // CLEAR & APPLY FILTERS
  // ==========================================
  const clearAllFilters = useCallback(() => {
    setActiveCategory("all");
    setSelectedMetals([]);
    setSelectedGender("all");
    setSelectedPriceRange(null);
    setPriceMin("");
    setPriceMax("");
    setShowWithMedia(false);
    setShowAvailable(false);
    setSearchQuery("");
  }, []);

  // ==========================================
  // FILTER LOGIC
  // ==========================================
  const filteredItems = JEWELRY_ITEMS.filter((item) => {
    const categoryMatch =
      activeCategory === "all" || item.category === activeCategory;
    const metalMatch =
      selectedMetals.length === 0 || selectedMetals.includes(item.metal);
    const genderMatch =
      selectedGender === "all" || item.gender === selectedGender;
    const searchMatch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    let priceMatch = true;
    if (selectedPriceRange) {
      const range = PRICE_RANGES.find((r) => r.id === selectedPriceRange);
      if (range) {
        priceMatch = item.price >= range.min && item.price <= range.max;
      }
    } else if (priceMin || priceMax) {
      const min = priceMin ? parseFloat(priceMin) : 0;
      const max = priceMax ? parseFloat(priceMax) : Infinity;
      priceMatch = item.price >= min && item.price <= max;
    }

    return (
      categoryMatch && metalMatch && genderMatch && priceMatch && searchMatch
    );
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // ==========================================
  // ACTIVE FILTERS COUNT
  // ==========================================
  const activeFiltersCount =
    (activeCategory !== "all" ? 1 : 0) +
    selectedMetals.length +
    (selectedGender !== "all" ? 1 : 0) +
    (selectedPriceRange ? 1 : 0) +
    (priceMin || priceMax ? 1 : 0) +
    (showWithMedia ? 1 : 0) +
    (showAvailable ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // ==========================================
  // FILTER CONTENT COMPONENT
  // ==========================================
  const FilterContent = () => (
    <View style={styles.filterContent}>
      {/* Category Filter */}
      <FilterSection
        title="Categories"
        expanded={expandedSections.category}
        onToggle={() => toggleSection("category")}
      >
        <View style={styles.categoryList}>
          {CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <View style={styles.categoryButtonContent}>
                <MaterialIcons
                  name={category.icon}
                  size={20}
                  color={activeCategory === category.id ? "#1E3A8A" : "#64748B"}
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    activeCategory === category.id &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </View>
              <Text style={styles.categoryCount}>{category.count}</Text>
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
        <View style={styles.priceRangeList}>
          {PRICE_RANGES.map((range) => (
            <Pressable
              key={range.id}
              style={[
                styles.priceRangeButton,
                selectedPriceRange === range.id &&
                  styles.priceRangeButtonActive,
              ]}
              onPress={() =>
                setSelectedPriceRange(
                  selectedPriceRange === range.id ? null : range.id,
                )
              }
            >
              <Text
                style={[
                  styles.priceRangeText,
                  selectedPriceRange === range.id &&
                    styles.priceRangeTextActive,
                ]}
              >
                {range.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <RangeInput
          label="Custom Price Range"
          min={priceMin}
          max={priceMax}
          onMinChange={setPriceMin}
          onMaxChange={setPriceMax}
          unit="$"
        />
      </FilterSection>

      {/* Metal Type Filter */}
      <FilterSection
        title="Metal Type"
        expanded={expandedSections.metal}
        onToggle={() => toggleSection("metal")}
      >
        <View style={styles.metalGrid}>
          {METAL_TYPES.map((metal) => (
            <Pressable
              key={metal.id}
              style={[
                styles.metalButton,
                selectedMetals.includes(metal.id) && styles.metalButtonActive,
              ]}
              onPress={() => toggleMetal(metal.id)}
            >
              <View
                style={[
                  styles.metalColorIndicator,
                  { backgroundColor: metal.color },
                ]}
              />
              <Text
                style={[
                  styles.metalLabel,
                  selectedMetals.includes(metal.id) && styles.metalLabelActive,
                ]}
              >
                {metal.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </FilterSection>

      {/* Gender Filter */}
      <FilterSection
        title="Gender"
        expanded={expandedSections.gender}
        onToggle={() => toggleSection("gender")}
      >
        <View style={styles.genderGrid}>
          {GENDERS.map((gender) => (
            <ToggleButton
              key={gender.id}
              label={gender.label}
              selected={selectedGender === gender.id}
              onPress={() => setSelectedGender(gender.id)}
            />
          ))}
        </View>
      </FilterSection>
    </View>
  );

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {isNatural ? "Natural Jewelry" : "Lab-Grown Jewelry"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {filteredItems.length} products • Premium Quality
            </Text>
          </View>
          <Pressable
            onPress={() =>
              router.push(
                `/(user)/jewelry/JewelrySearchScreen?type=${isNatural ? "labgrown" : "natural"}`,
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
            placeholder="Search jewelry..."
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
          {activeCategory !== "all" && (
            <FilterPill
              label={CATEGORIES.find((c) => c.id === activeCategory)?.label}
              onRemove={() => setActiveCategory("all")}
            />
          )}
          {selectedMetals.map((metal) => (
            <FilterPill
              key={metal}
              label={METAL_TYPES.find((m) => m.id === metal)?.label}
              onRemove={() => toggleMetal(metal)}
            />
          ))}
          {selectedGender !== "all" && (
            <FilterPill
              label={GENDERS.find((g) => g.id === selectedGender)?.label}
              onRemove={() => setSelectedGender("all")}
            />
          )}
          {selectedPriceRange && (
            <FilterPill
              label={
                PRICE_RANGES.find((r) => r.id === selectedPriceRange)?.label
              }
              onRemove={() => setSelectedPriceRange(null)}
            />
          )}
          {(priceMin || priceMax) && (
            <FilterPill
              label={`$${priceMin || "0"} - $${priceMax || "∞"}`}
              onRemove={() => {
                setPriceMin("");
                setPriceMax("");
              }}
            />
          )}
          {searchQuery && (
            <FilterPill
              label={`Search: ${searchQuery}`}
              onRemove={() => setSearchQuery("")}
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
            options={SORTS}
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

      {/* Jewelry Grid/List */}
      <FlatList
        data={filteredItems}
        key={viewMode}
        numColumns={viewMode === "grid" ? 2 : 1}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <JewelryCard
            item={item}
            viewMode={viewMode}
            onPress={() => console.log("Navigate to jewelry detail:", item.id)}
          />
        )}
        contentContainerStyle={[
          styles.jewelryList,
          viewMode === "grid" && styles.jewelryListGrid,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No jewelry found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
      />

      {/* Mobile Filters Modal */}
      <Modal
        visible={showMobileFilters}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <View style={styles.modalIconContainer}>
                <MaterialIcons name="watch" size={24} color="#1E3A8A" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Filters</Text>
                <Text style={styles.modalSubtitle}>
                  {isNatural ? "Natural Jewelry" : "Lab-Grown Jewelry"}
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
              onPress={() => setShowMobileFilters(false)}
            >
              <LinearGradient
                colors={["#1E3A8A", "#1E40AF"]}
                style={styles.applyFilterButtonGradient}
              >
                <Text style={styles.applyFilterButtonText}>
                  Show {filteredItems.length} Results
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
  jewelryList: {
    padding: 16,
    paddingBottom: 100,
  },
  jewelryListGrid: {
    gap: 12,
  },
  // Grid Card Styles
  gridCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    margin: 6,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  gridCardImageContainer: {
    position: "relative",
    height: 160,
  },
  gridCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gridBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  gridBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 6,
  },
  gridCardContent: {
    padding: 12,
  },
  gridCardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  gridCardDescription: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 8,
  },
  gridCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gridCardPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },
  // List Card Styles
  listCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  listCardImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  listCardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  listCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  listCardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
  },
  badge: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  listCardDescription: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 8,
  },
  listCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listCardPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 8,
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
  categoryList: {
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
  },
  categoryButtonActive: {
    backgroundColor: "#DBEAFE",
  },
  categoryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  categoryButtonTextActive: {
    color: "#1E3A8A",
  },
  categoryCount: {
    fontSize: 12,
    color: "#64748B",
  },
  priceRangeList: {
    gap: 8,
    marginBottom: 16,
  },
  priceRangeButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  priceRangeButtonActive: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },
  priceRangeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
  },
  priceRangeTextActive: {
    color: "#FFFFFF",
  },
  metalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metalButton: {
    width: (screenWidth - 72) / 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metalButtonActive: {
    backgroundColor: "#DBEAFE",
    borderColor: "#1E3A8A",
  },
  metalColorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  metalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  metalLabelActive: {
    color: "#1E3A8A",
  },
  genderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  toggleButtonTextSelected: {
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

export default JewelrySearchScreen;
