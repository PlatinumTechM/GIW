import React, { useState, useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { stockAPI } from "../../../src/api/api.js";
import { secureStorage } from "../../../src/utils/secureStorage.js";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Map backend data to frontend format
const mapStockData = (stock) => {
  return {
    id: stock.id,
    stockId: stock.stock_id || stock.id,
    shape: stock.shape,
    carat: parseFloat(stock.weight),
    price: Math.floor(stock.final_price),
    colorType: stock.fancy_color ? "Fancy" : "White",
    color: stock.color || stock.fancy_color,
    fancyIntensity: stock.fancy_color_intensity,
    fancyOvertone: stock.fancy_color_overtone,
    clarity: stock.clarity,
    cut: stock.cut,
    polish: stock.polish,
    symmetry: stock.symmetry,
    fluorescence: stock.fluorescence,
    certification: stock.lab,
    certificationNumber: stock.certificate_number,
    available: stock.status === "AVAILABLE",
    status: stock.status,
    type: stock.type,
    createdAt: stock.created_at,
  };
};

// Stock List Item Component
const StockListItem = ({ stock, onPress }) => (
  <Pressable style={styles.listItem} onPress={() => onPress(stock.id)}>
    <View style={styles.row}>
      <View style={styles.idContainer}>
        <MaterialIcons name="inventory-2" size={16} color="#1E3A8A" />
        <Text style={styles.stockId}>{stock.stockId || stock.id}</Text>
      </View>
      <View
        style={[
          styles.statusChip,
          stock.available ? styles.statusAvailable : styles.statusOther,
        ]}
      >
        <Text
          style={[
            styles.statusChipText,
            stock.available && styles.statusAvailableText,
          ]}
        >
          {stock.status}
        </Text>
      </View>
    </View>

    <View style={styles.specsRow}>
      <View style={styles.specCell}>
        <Text style={styles.specLabel}>Cert #</Text>
        <Text style={styles.specValue} numberOfLines={1}>
          {stock.certificationNumber || "-"}
        </Text>
      </View>
      <View style={styles.specCell}>
        <Text style={styles.specLabel}>Weight</Text>
        <Text style={styles.specValue}>{stock.carat} ct</Text>
      </View>
      <View style={styles.specCell}>
        <Text style={styles.specLabel}>Shape</Text>
        <Text style={styles.specValue}>{stock.shape}</Text>
      </View>
    </View>

    <View style={styles.specsRow}>
      <View style={styles.specCell}>
        <Text style={styles.specLabel}>Color</Text>
        <Text style={[styles.specValue, styles.colorValue]}>{stock.color}</Text>
      </View>
      <View style={styles.specCell}>
        <Text style={styles.specLabel}>Clarity</Text>
        <Text style={[styles.specValue, styles.clarityValue]}>
          {stock.clarity}
        </Text>
      </View>
      <View style={styles.specCell}>
        <Text style={styles.specLabel}>Cut</Text>
        <Text style={styles.specValue}>{stock.cut || "-"}</Text>
      </View>
    </View>

    {stock.colorType === "Fancy" && stock.fancyIntensity && (
      <View style={styles.fancyRow}>
        <MaterialIcons name="auto-awesome" size={14} color="#BE185D" />
        <Text style={styles.fancyText}>
          {stock.fancyIntensity} {stock.fancyOvertone || ""} {stock.color}
        </Text>
      </View>
    )}

    <View style={styles.priceRow}>
      <Text style={styles.priceLabel}>Final Price</Text>
      <Text style={styles.priceValue}>${stock.price.toLocaleString()}</Text>
    </View>
  </Pressable>
);

// Filter Chip Component
const FilterChip = memo(({ label, selected, onPress, color = "#1E3A8A" }) => (
  <Pressable
    style={[
      styles.filterChip,
      selected && { backgroundColor: color, borderColor: color },
    ]}
    onPress={onPress}
  >
    <Text style={[styles.filterChipText, selected && { color: "#fff" }]}>
      {label}
    </Text>
  </Pressable>
));

// Filter Section Component
const FilterSection = memo(({ title, icon, children }) => (
  <View style={styles.filterSection}>
    <View style={styles.filterSectionHeader}>
      <MaterialIcons name={icon} size={18} color="#1E3A8A" />
      <Text style={styles.filterSectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
));

// Filter Modal Component
const FilterModal = memo(
  ({ visible, onClose, filters, onApply, filterOptions }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
      setLocalFilters(filters);
    }, [filters, visible]);

    const toggleArrayFilter = useCallback((field, value) => {
      setLocalFilters((prev) => {
        const current = prev[field] || [];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [field]: updated };
      });
    }, []);

    const updateFilter = useCallback((field, value) => {
      setLocalFilters((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleApply = useCallback(() => {
      onApply(localFilters);
      onClose();
    }, [localFilters, onApply, onClose]);

    const handleClear = useCallback(() => {
      const emptyFilters = {
        stockId: "",
        certificate: "",
        status: [],
        shape: [],
        minWeight: "",
        maxWeight: "",
        color: [],
        cut: [],
        clarity: [],
        lab: [],
        minPricePerCarat: "",
        maxPricePerCarat: "",
        growthType: [],
      };
      setLocalFilters(emptyFilters);
      onApply(emptyFilters);
      onClose();
    }, [onApply, onClose]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={onClose} />
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <MaterialIcons name="filter-list" size={22} color="#fff" />
                <Text style={styles.modalHeaderTitle}>Filters</Text>
              </View>
              <Pressable onPress={onClose}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Search Fields */}
              <FilterSection title="Search" icon="search">
                <TextInput
                  style={styles.filterInput}
                  placeholder="Stock ID..."
                  value={localFilters.stockId}
                  onChangeText={(text) => updateFilter("stockId", text)}
                  autoCapitalize="characters"
                />
                <TextInput
                  style={[styles.filterInput, { marginTop: 8 }]}
                  placeholder="Certificate Number..."
                  value={localFilters.certificate}
                  onChangeText={(text) => updateFilter("certificate", text)}
                />
              </FilterSection>

              {/* Status */}
              <FilterSection title="Status" icon="bookmark">
                <View style={styles.chipGrid}>
                  {["AVAILABLE", "HOLD", "SOLD", "MEMO"].map((status) => (
                    <FilterChip
                      key={status}
                      label={status}
                      selected={localFilters.status?.includes(status)}
                      onPress={() => toggleArrayFilter("status", status)}
                      color={
                        status === "AVAILABLE"
                          ? "#10B981"
                          : status === "SOLD"
                            ? "#EF4444"
                            : "#F59E0B"
                      }
                    />
                  ))}
                </View>
              </FilterSection>

              {/* Shape */}
              <FilterSection title="Shape" icon="change-history">
                <View style={styles.chipGrid}>
                  {(filterOptions.shapes || []).map((shape) => (
                    <FilterChip
                      key={shape}
                      label={shape}
                      selected={localFilters.shape?.includes(shape)}
                      onPress={() => toggleArrayFilter("shape", shape)}
                    />
                  ))}
                </View>
              </FilterSection>

              {/* Color */}
              <FilterSection title="Color" icon="palette">
                <View style={styles.chipGrid}>
                  {(filterOptions.colors || []).map((color) => (
                    <FilterChip
                      key={color}
                      label={color}
                      selected={localFilters.color?.includes(color)}
                      onPress={() => toggleArrayFilter("color", color)}
                    />
                  ))}
                </View>
              </FilterSection>

              {/* Clarity */}
              <FilterSection title="Clarity" icon="auto-awesome">
                <View style={styles.chipGrid}>
                  {(filterOptions.clarities || []).map((clarity) => (
                    <FilterChip
                      key={clarity}
                      label={clarity}
                      selected={localFilters.clarity?.includes(clarity)}
                      onPress={() => toggleArrayFilter("clarity", clarity)}
                    />
                  ))}
                </View>
              </FilterSection>

              {/* Cut */}
              <FilterSection title="Cut" icon="content-cut">
                <View style={styles.chipGrid}>
                  {[
                    "Ideal",
                    "Excellent",
                    "Very Good",
                    "Good",
                    "Fair",
                    "Poor",
                  ].map((cut) => (
                    <FilterChip
                      key={cut}
                      label={cut}
                      selected={localFilters.cut?.includes(cut)}
                      onPress={() => toggleArrayFilter("cut", cut)}
                    />
                  ))}
                </View>
              </FilterSection>

              {/* Lab */}
              <FilterSection title="Lab" icon="business">
                <View style={styles.chipGrid}>
                  {["GIA", "IGI", "HRD", "AGS", "EGL", "CGL"].map((lab) => (
                    <FilterChip
                      key={lab}
                      label={lab}
                      selected={localFilters.lab?.includes(lab)}
                      onPress={() => toggleArrayFilter("lab", lab)}
                    />
                  ))}
                </View>
              </FilterSection>

              {/* Growth Type */}
              <FilterSection title="Growth Type" icon="science">
                <View style={styles.chipGrid}>
                  {["CVD", "HPHT"].map((type) => (
                    <FilterChip
                      key={type}
                      label={type}
                      selected={localFilters.growthType?.includes(type)}
                      onPress={() => toggleArrayFilter("growthType", type)}
                    />
                  ))}
                </View>
              </FilterSection>

              {/* Weight Range */}
              <FilterSection title="Weight Range (ct)" icon="scale">
                <View style={styles.rangeContainer}>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Min"
                    keyboardType="decimal-pad"
                    value={localFilters.minWeight}
                    onChangeText={(text) => updateFilter("minWeight", text)}
                  />
                  <Text style={styles.rangeSeparator}>to</Text>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Max"
                    keyboardType="decimal-pad"
                    value={localFilters.maxWeight}
                    onChangeText={(text) => updateFilter("maxWeight", text)}
                  />
                </View>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price/Carat ($)" icon="attach-money">
                <View style={styles.rangeContainer}>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Min"
                    keyboardType="number-pad"
                    value={localFilters.minPricePerCarat}
                    onChangeText={(text) =>
                      updateFilter("minPricePerCarat", text)
                    }
                  />
                  <Text style={styles.rangeSeparator}>to</Text>
                  <TextInput
                    style={styles.rangeInput}
                    placeholder="Max"
                    keyboardType="number-pad"
                    value={localFilters.maxPricePerCarat}
                    onChangeText={(text) =>
                      updateFilter("maxPricePerCarat", text)
                    }
                  />
                </View>
              </FilterSection>

              <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.modalFooter}>
              <Pressable style={styles.clearButton} onPress={handleClear}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

// Active Filter Chip
const ActiveFilterChip = memo(({ label, onRemove }) => (
  <View style={styles.activeFilterChip}>
    <Text style={styles.activeFilterText}>{label}</Text>
    <Pressable onPress={onRemove} style={styles.activeFilterRemove}>
      <MaterialIcons name="close" size={14} color="#1E3A8A" />
    </Pressable>
  </View>
));

export default function StockScreen() {
  const router = useRouter();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    shapes: [],
    colors: [],
    clarities: [],
  });

  const [filters, setFilters] = useState({
    stockId: "",
    certificate: "",
    status: [],
    shape: [],
    minWeight: "",
    maxWeight: "",
    color: [],
    cut: [],
    clarity: [],
    lab: [],
    minPricePerCarat: "",
    maxPricePerCarat: "",
    growthType: [],
  });

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await stockAPI.getMyStocks({ filters: true });
        if (response.success && response.data?.filters) {
          setFilterOptions(response.data.filters);
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Build query params with filters
  const buildParams = useCallback(() => {
    const params = {};
    if (filters.stockId) params.stockId = filters.stockId;
    if (filters.certificate) params.certificate = filters.certificate;
    if (filters.status.length) params.status = filters.status.join(",");
    if (filters.shape.length) params.shape = filters.shape.join(",");
    if (filters.color.length) params.color = filters.color.join(",");
    if (filters.clarity.length) params.clarity = filters.clarity.join(",");
    if (filters.cut.length) params.cut = filters.cut.join(",");
    if (filters.lab.length) params.lab = filters.lab.join(",");
    if (filters.growthType.length)
      params.growthType = filters.growthType.join(",");
    if (filters.minWeight) params.minWeight = filters.minWeight;
    if (filters.maxWeight) params.maxWeight = filters.maxWeight;
    if (filters.minPricePerCarat)
      params.minPricePerCarat = filters.minPricePerCarat;
    if (filters.maxPricePerCarat)
      params.maxPricePerCarat = filters.maxPricePerCarat;
    return params;
  }, [filters]);

  const fetchMyStocks = useCallback(async () => {
    try {
      const token = await secureStorage.getToken();
      if (!token) {
        setError("Please login to view your stocks");
        return;
      }

      const params = buildParams();
      const response = await stockAPI.getMyStocks(params);
      if (response.success && response.data) {
        const mappedStocks = response.data.stocks?.map(mapStockData) || [];
        setStocks(mappedStocks);
      } else {
        setStocks([]);
      }
    } catch (err) {
      console.error("Error fetching stocks:", err);
      setError("Failed to load your stocks");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchMyStocks();
  }, [fetchMyStocks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyStocks();
  }, [fetchMyStocks]);

  const removeFilter = useCallback((field, value) => {
    setFilters((prev) => {
      if (Array.isArray(prev[field])) {
        return { ...prev, [field]: prev[field].filter((v) => v !== value) };
      }
      return { ...prev, [field]: "" };
    });
  }, []);

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some((v) =>
      Array.isArray(v) ? v.length > 0 : v !== "",
    );
  }, [filters]);

  const getActiveFilterLabels = useCallback(() => {
    const labels = [];
    if (filters.stockId)
      labels.push({ label: `ID: ${filters.stockId}`, field: "stockId" });
    if (filters.certificate)
      labels.push({
        label: `Cert: ${filters.certificate}`,
        field: "certificate",
      });
    filters.status.forEach((s) =>
      labels.push({ label: s, field: "status", value: s }),
    );
    filters.shape.forEach((s) =>
      labels.push({ label: s, field: "shape", value: s }),
    );
    filters.color.forEach((c) =>
      labels.push({ label: c, field: "color", value: c }),
    );
    filters.clarity.forEach((c) =>
      labels.push({ label: c, field: "clarity", value: c }),
    );
    filters.cut.forEach((c) =>
      labels.push({ label: c, field: "cut", value: c }),
    );
    filters.lab.forEach((l) =>
      labels.push({ label: l, field: "lab", value: l }),
    );
    filters.growthType.forEach((g) =>
      labels.push({ label: g, field: "growthType", value: g }),
    );
    if (filters.minWeight || filters.maxWeight) {
      labels.push({
        label: `Weight: ${filters.minWeight || 0}-${filters.maxWeight || "∞"}`,
        field: "weight",
      });
    }
    if (filters.minPricePerCarat || filters.maxPricePerCarat) {
      labels.push({
        label: `Price: ${filters.minPricePerCarat || 0}-${filters.maxPricePerCarat || "∞"}`,
        field: "price",
      });
    }
    return labels;
  }, [filters]);

  const openStockDetail = (id) => {
    router.push(`/(user)/stock/${id}`);
  };

  const activeFilterLabels = getActiveFilterLabels();

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Loading your stocks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <MaterialIcons name="error-outline" size={48} color="#94A3B8" />
        <Text style={styles.errorTitle}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchMyStocks}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Stocks</Text>
          <Text style={styles.headerSubtitle}>
            {stocks.length} {stocks.length === 1 ? "item" : "items"} in your
            inventory
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <Pressable
            style={[
              styles.filterButton,
              hasActiveFilters() && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilters(true)}
          >
            <MaterialIcons
              name="tune"
              size={20}
              color={hasActiveFilters() ? "#fff" : "#1E3A8A"}
            />
            {hasActiveFilters() && <View style={styles.filterBadge} />}
          </Pressable>
          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/(user)/stock/AddStock")}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Active Filters */}
      {hasActiveFilters() && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activeFiltersContainer}
          contentContainerStyle={styles.activeFiltersContent}
        >
          {activeFilterLabels.map((f, idx) => (
            <ActiveFilterChip
              key={`${f.field}-${idx}`}
              label={f.label}
              onRemove={() => removeFilter(f.field, f.value)}
            />
          ))}
        </ScrollView>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {stocks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <MaterialIcons name="inventory-2" size={48} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>No stocks yet</Text>
            <Text style={styles.emptyText}>
              Your diamond inventory will appear here
            </Text>
            <Pressable
              style={styles.browseButton}
              onPress={() => router.push("/(user)/stock/AddStock")}
            >
              <Text style={styles.browseButtonText}>Add Stock</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {stocks.map((stock) => (
              <StockListItem
                key={stock.id}
                stock={stock}
                onPress={openStockDetail}
              />
            ))}
            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={setFilters}
        filterOptions={filterOptions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: "#1E3A8A",
  },
  filterBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  activeFiltersContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    maxHeight: 56,
  },
  activeFiltersContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1E3A8A",
  },
  activeFilterRemove: {
    marginLeft: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#1E3A8A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalScroll: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Filter Section Styles
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  filterSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  filterInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rangeInput: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  scrollContent: {
    padding: 12,
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  idContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stockId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  statusAvailable: {
    backgroundColor: "#10B981",
  },
  statusOther: {
    backgroundColor: "#F59E0B",
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  statusAvailableText: {
    color: "#fff",
  },
  specsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  specCell: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
  },
  specLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  specValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  colorValue: {
    color: "#1E3A8A",
  },
  clarityValue: {
    color: "#059669",
  },
  fancyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FDF2F8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  fancyText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#BE185D",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
