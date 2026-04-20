import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { stockAPI } from "../../../src/api/api.js";

const { width: screenWidth } = Dimensions.get("window");

// Map backend data to frontend format
const mapStockData = (stock) => {
  return {
    id: stock.id,
    stockId: stock.stock_id,
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
    hasMedia: !!(stock.diamond_image1 || stock.diamond_video),
    image: stock.diamond_image1,
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
    video360: stock.diamond_video,
    certificateImage: stock.certificate_image,
  };
};

// Diamond Card Component
const DiamondCard = ({ diamond, onPress, viewMode }) => {
  const isGrid = viewMode === "grid";

  return (
    <Pressable
      style={[styles.card, isGrid ? styles.gridCard : styles.listCard]}
      onPress={() => onPress(diamond.id)}
    >
      {/* Image Section - Only in Grid View */}
      {isGrid && (
        <View style={[styles.imageContainer, styles.gridImage]}>
          {diamond.image ? (
            <Image
              source={{ uri: diamond.image }}
              style={styles.diamondImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialIcons name="diamond" size={40} color="#94A3B8" />
            </View>
          )}
          {/* Badges */}
          <View style={styles.badgesContainer}>
            {diamond.certification && (
              <View style={styles.certBadge}>
                <Text style={styles.certBadgeText}>
                  {diamond.certification}
                </Text>
              </View>
            )}
            {diamond.available && (
              <View style={styles.availableBadge}>
                <MaterialIcons name="check-circle" size={10} color="#fff" />
                <Text style={styles.availableBadgeText}>Available</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Info Section */}
      <View style={[styles.infoContainer, !isGrid && styles.listInfoContainer]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.shapeText}>{diamond.shape}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {!isGrid && diamond.certification && (
              <View style={styles.listCertBadge}>
                <Text style={styles.listCertBadgeText}>
                  {diamond.certification}
                </Text>
              </View>
            )}
            {!isGrid && diamond.available && (
              <View style={styles.listAvailableBadge}>
                <MaterialIcons name="check-circle" size={10} color="#fff" />
              </View>
            )}
            <Text style={styles.caratText}>{diamond.carat}ct</Text>
          </View>
        </View>

        {/* Specs Row */}
        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Color</Text>
            <Text style={styles.specValue}>{diamond.color}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Clarity</Text>
            <Text style={styles.specValue}>{diamond.clarity}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Cut</Text>
            <Text style={styles.specValue}>{diamond.cut || "-"}</Text>
          </View>
        </View>

        {/* Fancy Info */}
        {diamond.colorType === "Fancy" && (
          <View style={styles.fancyBadge}>
            <MaterialIcons name="auto-awesome" size={12} color="#BE185D" />
            <Text style={styles.fancyText}>
              {diamond.fancyIntensity} {diamond.color}
            </Text>
          </View>
        )}

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            ${diamond.price.toLocaleString()}
          </Text>
          <MaterialIcons name="arrow-forward" size={20} color="#1E3A8A" />
        </View>

        {/* Additional Details for List View */}
        {!isGrid && (
          <View style={styles.listDetails}>
            <Text style={styles.detailText}>
              {diamond.polish} Polish • {diamond.symmetry} Symmetry
            </Text>
            {diamond.fluorescence && (
              <Text style={styles.detailText}>
                Fluorescence: {diamond.fluorescence}
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

// Main ShowStock Component
const ShowStock = ({
  type,
  viewMode = "grid",
  sortBy = "featured",
  filters = {},
  searchQuery = "",
}) => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 9;

  const openDiamondDetail = (id) => {
    router.push(`/(user)/diamond/${id}`);
  };

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortBy,
      };

      // Add filters to params
      if (filters?.shapes?.length > 0) params.shape = filters.shapes.join(",");
      if (filters?.colors?.length > 0) params.color = filters.colors.join(",");
      if (filters?.clarities?.length > 0)
        params.clarity = filters.clarities.join(",");
      if (filters?.caratMin) params.minCarat = filters.caratMin;
      if (filters?.caratMax) params.maxCarat = filters.caratMax;
      if (filters?.priceMin) params.minPrice = filters.priceMin;
      if (filters?.priceMax) params.maxPrice = filters.priceMax;
      if (searchQuery?.trim()) params.search = searchQuery.trim();

      // Detailed filters
      if (filters?.cuts?.length > 0) params.cut = filters.cuts.join(",");
      if (filters?.polish?.length > 0) params.polish = filters.polish.join(",");
      if (filters?.symmetry?.length > 0)
        params.symmetry = filters.symmetry.join(",");
      if (filters?.fluorescence?.length > 0)
        params.fluorescence = filters.fluorescence.join(",");
      if (filters?.certifications?.length > 0)
        params.lab = filters.certifications.join(",");
      if (filters?.fancyIntensity)
        params.fancyIntensity = filters.fancyIntensity;
      if (filters?.fancyOvertone) params.fancyOvertone = filters.fancyOvertone;
      if (filters?.available) params.availability = "AVAILABLE";
      if (filters?.showOnlyMedia) params.hasMedia = "true";

      // Measurement filters
      if (filters?.lengthMin) params.minLength = filters.lengthMin;
      if (filters?.lengthMax) params.maxLength = filters.lengthMax;
      if (filters?.widthMin) params.minWidth = filters.widthMin;
      if (filters?.widthMax) params.maxWidth = filters.widthMax;
      if (filters?.heightMin) params.minHeight = filters.heightMin;
      if (filters?.heightMax) params.maxHeight = filters.heightMax;
      if (filters?.ratioMin) params.minRatio = filters.ratioMin;
      if (filters?.ratioMax) params.maxRatio = filters.ratioMax;

      // Percentage filters
      if (filters?.depthMin) params.minDepth = filters.depthMin;
      if (filters?.depthMax) params.maxDepth = filters.depthMax;
      if (filters?.tableMin) params.minTable = filters.tableMin;
      if (filters?.tableMax) params.maxTable = filters.tableMax;

      // Crown filters
      if (filters?.crownHeightMin)
        params.minCrownHeight = filters.crownHeightMin;
      if (filters?.crownHeightMax)
        params.maxCrownHeight = filters.crownHeightMax;
      if (filters?.crownAngleMin) params.minCrownAngle = filters.crownAngleMin;
      if (filters?.crownAngleMax) params.maxCrownAngle = filters.crownAngleMax;

      // Pavilion filters
      if (filters?.pavilionDepthMin)
        params.minPavilionDepth = filters.pavilionDepthMin;
      if (filters?.pavilionDepthMax)
        params.maxPavilionDepth = filters.pavilionDepthMax;
      if (filters?.pavilionAngleMin)
        params.minPavilionAngle = filters.pavilionAngleMin;
      if (filters?.pavilionAngleMax)
        params.maxPavilionAngle = filters.pavilionAngleMax;

      // Girdle filters
      if (filters?.girdleMin) params.minGirdle = filters.girdleMin;
      if (filters?.girdleMax) params.maxGirdle = filters.girdleMax;

      // Dropdown filters
      if (filters?.milky) params.milky = filters.milky;
      if (filters?.eyeClean) params.eyeClean = filters.eyeClean;
      if (filters?.shade) params.shade = filters.shade;

      // Use dedicated routes based on type
      let response;
      if (type === "natural" || type === "natural-diamonds") {
        response = await stockAPI.getNaturalDiamonds(params);
      } else if (type === "lab-grown" || type === "lab-grown-diamonds") {
        response = await stockAPI.getLabGrownDiamonds(params);
      } else {
        response = await stockAPI.getAllStocks(params);
      }

      if (response.success && response.data) {
        const mappedItems = response.data.stocks.map(mapStockData);
        setItems(mappedItems);
        setTotalCount(response.data.pagination.totalCount);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [type, currentPage, sortBy, filters, searchQuery]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, searchQuery]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Loading diamonds...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <MaterialIcons name="diamond" size={48} color="#94A3B8" />
        </View>
        <Text style={styles.emptyTitle}>No diamonds found</Text>
        <Text style={styles.emptyText}>
          Try adjusting your filters to see more results
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
          <Text style={styles.resultsBold}>{totalCount}</Text> diamonds
        </Text>
      </View>

      {/* Items Grid/List */}
      <View
        style={[
          styles.itemsContainer,
          viewMode === "grid" ? styles.gridContainer : styles.listContainer,
        ]}
      >
        {items.map((diamond) => (
          <DiamondCard
            key={diamond.id}
            diamond={diamond}
            onPress={openDiamondDetail}
            viewMode={viewMode}
          />
        ))}
      </View>

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <Pressable
            style={[
              styles.pageButton,
              currentPage === 1 && styles.pageButtonDisabled,
            ]}
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <MaterialIcons
              name="chevron-left"
              size={24}
              color={currentPage === 1 ? "#94A3B8" : "#1E3A8A"}
            />
          </Pressable>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pageNumbers}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first, last, current, and neighbors
                return (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                );
              })
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <Text style={styles.ellipsis}>...</Text>
                  )}
                  <Pressable
                    style={[
                      styles.pageNumber,
                      currentPage === page && styles.pageNumberActive,
                    ]}
                    onPress={() => handlePageChange(page)}
                  >
                    <Text
                      style={[
                        styles.pageNumberText,
                        currentPage === page && styles.pageNumberTextActive,
                      ]}
                    >
                      {page}
                    </Text>
                  </Pressable>
                </React.Fragment>
              ))}
          </ScrollView>

          <Pressable
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.pageButtonDisabled,
            ]}
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={currentPage === totalPages ? "#94A3B8" : "#1E3A8A"}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
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
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 13,
    color: "#64748B",
  },
  resultsBold: {
    color: "#0F172A",
    fontWeight: "600",
  },
  itemsContainer: {
    gap: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  listContainer: {
    flexDirection: "column",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  gridCard: {
    width: (screenWidth - 64) / 2,
    marginBottom: 12,
  },
  listCard: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 12,
  },
  imageContainer: {
    position: "relative",
    backgroundColor: "#F8FAFC",
  },
  gridImage: {
    width: "100%",
    height: 140,
  },
  listImage: {
    width: 120,
    height: 120,
  },
  diamondImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  badgesContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  certBadge: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  certBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  availableBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 12,
  },
  listInfoContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  shapeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  caratText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  specsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 2,
  },
  specValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  fancyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCE7F3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  fancyText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#BE185D",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  listDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  listCertBadge: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listCertBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  listAvailableBadge: {
    backgroundColor: "#10B981",
    padding: 2,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 12,
    color: "#64748B",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 12,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageNumbers: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pageNumber: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pageNumberActive: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },
  pageNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  pageNumberTextActive: {
    color: "#FFFFFF",
  },
  ellipsis: {
    fontSize: 14,
    color: "#94A3B8",
    paddingHorizontal: 4,
  },
});

export default ShowStock;
