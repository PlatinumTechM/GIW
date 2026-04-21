import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { stockAPI } from "../../../src/api/api.js";
import { LinearGradient } from "expo-linear-gradient";

// Map backend data to frontend format
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
    price: Math.floor(stock.final_price),
    certification: stock.lab,
    certificationNumber: stock.certificate_number,
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
    location: stock.city || "Surat",
    certificateImage: stock.certificate_image,
    video360: stock.diamond_video,
    image: stock.diamond_image1,
  };
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

// Detail Row Component
const DetailRow = ({ label, value, icon, isLink }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIconContainer}>
      <MaterialIcons name={icon} size={18} color={theme.primary} />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[styles.detailValue, isLink && styles.linkValue]}
        numberOfLines={1}
      >
        {value || "N/A"}
      </Text>
    </View>
  </View>
);

// Spec Card Component
const SpecCard = ({ icon, label, value, subValue, color = theme.primary }) => (
  <View style={styles.specCard}>
    <View style={[styles.specIconContainer, { backgroundColor: `${color}15` }]}>
      <MaterialIcons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.specLabel}>{label}</Text>
    <Text style={styles.specValue}>{value}</Text>
    {subValue && <Text style={styles.specSubValue}>{subValue}</Text>}
  </View>
);

export default function DiamondDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [diamond, setDiamond] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchDiamond = async () => {
      setLoading(true);
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

    if (id) {
      fetchDiamond();
    }
  }, [id]);

  const handleOpenLink = async (url) => {
    if (!url) {
      Alert.alert(
        "Not Available",
        "This content is not available for this diamond.",
      );
      return;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open this link.");
      }
    } catch (error) {
      console.error("Error opening link:", error);
      Alert.alert("Error", "Failed to open link.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading diamond details...</Text>
      </View>
    );
  }

  if (!diamond) {
    return (
      <View style={[styles.container, styles.centered]}>
        <MaterialIcons name="error-outline" size={48} color={theme.textMuted} />
        <Text style={styles.errorTitle}>Diamond not found</Text>
        <Text style={styles.errorText}>
          The diamond you're looking for doesn't exist.
        </Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.push("/(user)/diamond")}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {diamond.shape} {diamond.carat}ct
        </Text>
        <Pressable
          style={[styles.likeBtn, isLiked && styles.likeBtnActive]}
          onPress={() => setIsLiked(!isLiked)}
        >
          <MaterialIcons
            name={isLiked ? "favorite" : "favorite-border"}
            size={24}
            color={isLiked ? "#fff" : theme.danger}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Info Card */}
        <LinearGradient
          colors={[theme.background, "#E2E8F0"]}
          style={styles.mainCard}
        >
          <View style={styles.diamondVisual}>
            {diamond.image ? (
              <Image
                source={{ uri: diamond.image }}
                style={styles.diamondImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.diamondPlaceholder}>
                <MaterialIcons name="diamond" size={60} color={theme.primary} />
              </View>
            )}
          </View>

          {/* Badges */}
          <View style={styles.badgesRow}>
            {diamond.certification && (
              <View style={styles.badge}>
                <MaterialIcons name="verified" size={12} color="#fff" />
                <Text style={styles.badgeText}>
                  {diamond.certification} Certified
                </Text>
              </View>
            )}
            {diamond.available && (
              <View style={[styles.badge, styles.availableBadge]}>
                <MaterialIcons name="check-circle" size={12} color="#fff" />
                <Text style={styles.badgeText}>Available</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.mainTitle}>
            {diamond.shape} {diamond.carat}ct {diamond.color} {diamond.clarity}
          </Text>
          <Text style={styles.subTitle}>SKU: {diamond.id}</Text>
        </LinearGradient>

        {/* Price Card */}
        <LinearGradient
          colors={[theme.primary, theme.primaryLight]}
          style={styles.priceCard}
        >
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Diamond Price</Text>
              <Text style={styles.priceValue}>
                ${diamond.price.toLocaleString()}
              </Text>
              <Text style={styles.priceNote}>
                Includes certification & authentication
              </Text>
            </View>
            <MaterialIcons
              name="diamond"
              size={40}
              color="rgba(255,255,255,0.3)"
            />
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {diamond.video360 && (
            <Pressable
              style={[styles.actionBtn, styles.videoBtn]}
              onPress={() => handleOpenLink(diamond.video360)}
            >
              <MaterialIcons name="360" size={24} color="#fff" />
              <Text style={styles.actionBtnText}>View 360°</Text>
            </Pressable>
          )}
          {diamond.certificateImage && (
            <Pressable
              style={[styles.actionBtn, styles.certBtn]}
              onPress={() => handleOpenLink(diamond.certificateImage)}
            >
              <MaterialIcons
                name="description"
                size={24}
                color={theme.success}
              />
              <Text style={[styles.actionBtnText, { color: theme.success }]}>
                View Report
              </Text>
            </Pressable>
          )}
        </View>

        {/* Main Specs Grid */}
        <View style={styles.specsGrid}>
          <SpecCard
            icon="scale"
            label="Carat Weight"
            value={`${diamond.carat} ct`}
            color={theme.primary}
          />
          <SpecCard
            icon="diamond"
            label="Shape"
            value={diamond.shape}
            subValue={diamond.colorType}
            color={theme.accent}
          />
          <SpecCard
            icon="palette"
            label="Color Grade"
            value={diamond.color}
            color={theme.success}
          />
          <SpecCard
            icon="visibility"
            label="Clarity"
            value={diamond.clarity}
            color={theme.primaryLight}
          />
        </View>

        {/* Fancy Color Info */}
        {diamond.colorType === "Fancy" && (
          <View style={styles.fancyCard}>
            <MaterialIcons name="auto-awesome" size={24} color="#BE185D" />
            <View style={styles.fancyContent}>
              <Text style={styles.fancyTitle}>Fancy Color Diamond</Text>
              <Text style={styles.fancyText}>
                {diamond.fancyIntensity} {diamond.color}
                {diamond.fancyOvertone && diamond.fancyOvertone !== "None" && (
                  <Text> with {diamond.fancyOvertone} Overtone</Text>
                )}
              </Text>
            </View>
          </View>
        )}

        {/* Cut, Polish, Symmetry */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cut Quality</Text>
          <View style={styles.qualityGrid}>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>Cut</Text>
              <Text style={styles.qualityValue}>{diamond.cut || "-"}</Text>
            </View>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>Polish</Text>
              <Text style={styles.qualityValue}>{diamond.polish || "-"}</Text>
            </View>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>Symmetry</Text>
              <Text style={styles.qualityValue}>{diamond.symmetry || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Measurements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Measurements</Text>
          <View style={styles.detailsList}>
            <DetailRow
              icon="straighten"
              label="Length"
              value={diamond.length ? `${diamond.length} mm` : "-"}
            />
            <DetailRow
              icon="width-wide"
              label="Width"
              value={diamond.width ? `${diamond.width} mm` : "-"}
            />
            <DetailRow
              icon="height"
              label="Height"
              value={diamond.height ? `${diamond.height} mm` : "-"}
            />
            <DetailRow
              icon="aspect-ratio"
              label="L/W Ratio"
              value={diamond.ratio || "-"}
            />
            <DetailRow
              icon="table-chart"
              label="Table %"
              value={diamond.table ? `${diamond.table}%` : "-"}
            />
            <DetailRow
              icon="line-weight"
              label="Depth %"
              value={diamond.depth ? `${diamond.depth}%` : "-"}
            />
          </View>
        </View>

        {/* Advanced Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Details</Text>
          <View style={styles.detailsList}>
            <DetailRow
              icon="flare"
              label="Fluorescence"
              value={diamond.fluorescence}
            />
            <DetailRow
              icon="verified-user"
              label="Certificate Number"
              value={diamond.certificationNumber}
            />
            <DetailRow
              icon="location-on"
              label="Location"
              value={diamond.location}
            />
            <DetailRow icon="opacity" label="Milky" value={diamond.milky} />
            <DetailRow
              icon="remove-red-eye"
              label="Eye Clean"
              value={diamond.eyeClean}
            />
            <DetailRow
              icon="brightness-medium"
              label="Shade"
              value={diamond.shade}
            />
          </View>
        </View>

        {/* Crown & Pavilion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crown & Pavilion</Text>
          <View style={styles.detailsList}>
            <DetailRow
              icon="terrain"
              label="Crown Height"
              value={diamond.crownHeight ? `${diamond.crownHeight}%` : "-"}
            />
            <DetailRow
              icon="rotate-right"
              label="Crown Angle"
              value={diamond.crownAngle ? `${diamond.crownAngle}°` : "-"}
            />
            <DetailRow
              icon="layers"
              label="Pavilion Depth"
              value={diamond.pavilionDepth ? `${diamond.pavilionDepth}%` : "-"}
            />
            <DetailRow
              icon="rotate-left"
              label="Pavilion Angle"
              value={diamond.pavilionAngle ? `${diamond.pavilionAngle}°` : "-"}
            />
            <DetailRow
              icon="vignette"
              label="Girdle %"
              value={diamond.girdle ? `${diamond.girdle}%` : "-"}
            />
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.textMuted,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.textMuted,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  backButton: {
    marginTop: 24,
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    textAlign: "center",
    marginHorizontal: 12,
  },
  likeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
  },
  likeBtnActive: {
    backgroundColor: theme.danger,
  },
  scrollContent: {
    padding: 16,
  },
  mainCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  diamondVisual: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: theme.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  diamondImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  diamondPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  availableBadge: {
    backgroundColor: theme.success,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.secondary,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 4,
    fontFamily: "monospace",
  },
  priceCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  priceNote: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  videoBtn: {
    backgroundColor: theme.primary,
  },
  certBtn: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.success,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  specCard: {
    width: "47%",
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  specIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  specLabel: {
    fontSize: 11,
    color: theme.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  specValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.secondary,
  },
  specSubValue: {
    fontSize: 11,
    color: theme.textMuted,
    marginTop: 2,
  },
  fancyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCE7F3",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  fancyContent: {
    flex: 1,
  },
  fancyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#BE185D",
  },
  fancyText: {
    fontSize: 13,
    color: "#9D174D",
    marginTop: 2,
  },
  section: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.secondary,
    marginBottom: 16,
  },
  qualityGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qualityItem: {
    alignItems: "center",
    flex: 1,
  },
  qualityLabel: {
    fontSize: 11,
    color: theme.textMuted,
    marginBottom: 4,
  },
  qualityValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.primary,
  },
  detailsList: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
  },
  linkValue: {
    color: theme.primary,
  },
});
