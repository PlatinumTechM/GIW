import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { stockAPI } from "../../../src/api/api.js";

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
const DetailRow = ({ label, value, icon }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIconContainer}>
      <MaterialIcons name={icon} size={18} color={theme.primary} />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>
        {value || "-"}
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

// Section Component
const Section = ({ title, icon, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <MaterialIcons name={icon} size={20} color={theme.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function StockDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      try {
        const response = await stockAPI.getStockById(id);
        if (response.success && response.data) {
          setStock(response.data);
        } else {
          setStock(null);
        }
      } catch (error) {
        console.error("Error fetching stock:", error);
        setStock(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStock();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading stock details...</Text>
      </View>
    );
  }

  if (!stock) {
    return (
      <View style={[styles.container, styles.centered]}>
        <MaterialIcons name="error-outline" size={48} color={theme.textMuted} />
        <Text style={styles.errorTitle}>Stock not found</Text>
        <Text style={styles.errorText}>
          The stock item you're looking for doesn't exist.
        </Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isAvailable = stock.status === "AVAILABLE";
  const isFancy = !!stock.fancy_color;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {stock.stock_id || id}
        </Text>
        <View style={styles.statusBadge}>
          <Text
            style={[
              styles.statusText,
              { color: isAvailable ? theme.success : theme.danger },
            ]}
          >
            {stock.status}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Info Card */}
        <View style={styles.mainCard}>
          <Text style={styles.mainTitle}>
            {stock.shape} {stock.weight}ct {isFancy ? stock.fancy_color : stock.color} {stock.clarity}
          </Text>
          <Text style={styles.subTitle}>Type: {stock.type || "Natural"}</Text>
        </View>

        {/* Price Card */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Final Price</Text>
              <Text style={styles.priceValue}>
                ${stock.final_price ? Math.floor(stock.final_price).toLocaleString() : "-"}
              </Text>
            </View>
            <View style={styles.pricePerCarat}>
              <Text style={styles.pricePerCaratLabel}>Per Carat</Text>
              <Text style={styles.pricePerCaratValue}>
                ${stock.price_per_carat ? Math.floor(stock.price_per_carat).toLocaleString() : "-"}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Specs Grid */}
        <View style={styles.specsGrid}>
          <SpecCard
            icon="scale"
            label="Carat Weight"
            value={`${stock.weight} ct`}
            color={theme.primary}
          />
          <SpecCard
            icon="diamond"
            label="Shape"
            value={stock.shape}
            subValue={isFancy ? "Fancy" : "White"}
            color={theme.accent}
          />
          <SpecCard
            icon="palette"
            label="Color Grade"
            value={isFancy ? stock.fancy_color : stock.color}
            color={theme.success}
          />
          <SpecCard
            icon="visibility"
            label="Clarity"
            value={stock.clarity}
            color={theme.primaryLight}
          />
        </View>

        {/* Fancy Color Info */}
        {isFancy && (
          <View style={styles.fancyCard}>
            <MaterialIcons name="auto-awesome" size={24} color="#BE185D" />
            <View style={styles.fancyContent}>
              <Text style={styles.fancyTitle}>Fancy Color Diamond</Text>
              <Text style={styles.fancyText}>
                {stock.fancy_color_intensity} {stock.fancy_color}
                {stock.fancy_color_overtone && stock.fancy_color_overtone !== "None" && (
                  <Text> with {stock.fancy_color_overtone} Overtone</Text>
                )}
              </Text>
            </View>
          </View>
        )}

        {/* Cut Quality */}
        <Section title="Cut Quality" icon="content-cut">
          <View style={styles.qualityGrid}>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>Cut</Text>
              <Text style={styles.qualityValue}>{stock.cut || "-"}</Text>
            </View>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>Polish</Text>
              <Text style={styles.qualityValue}>{stock.polish || "-"}</Text>
            </View>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>Symmetry</Text>
              <Text style={styles.qualityValue}>{stock.symmetry || "-"}</Text>
            </View>
          </View>
        </Section>

        {/* Measurements */}
        <Section title="Measurements" icon="straighten">
          <View style={styles.detailsList}>
            <DetailRow
              icon="straighten"
              label="Length"
              value={stock.length ? `${stock.length} mm` : "-"}
            />
            <DetailRow
              icon="width-wide"
              label="Width"
              value={stock.width ? `${stock.width} mm` : "-"}
            />
            <DetailRow
              icon="height"
              label="Height"
              value={stock.height ? `${stock.height} mm` : "-"}
            />
            <DetailRow
              icon="aspect-ratio"
              label="L/W Ratio"
              value={stock.lw_ratio || "-"}
            />
            <DetailRow
              icon="table-chart"
              label="Table %"
              value={stock.table_percentage ? `${stock.table_percentage}%` : "-"}
            />
            <DetailRow
              icon="line-weight"
              label="Depth %"
              value={stock.depth_percentage ? `${stock.depth_percentage}%` : "-"}
            />
          </View>
        </Section>

        {/* Certificate */}
        <Section title="Certificate" icon="verified">
          <View style={styles.detailsList}>
            <DetailRow
              icon="business"
              label="Lab"
              value={stock.lab}
            />
            <DetailRow
              icon="confirmation-number"
              label="Certificate Number"
              value={stock.certificate_number}
            />
          </View>
        </Section>

        {/* Additional Details */}
        <Section title="Additional Details" icon="info">
          <View style={styles.detailsList}>
            <DetailRow
              icon="flare"
              label="Fluorescence"
              value={stock.fluorescence}
            />
            <DetailRow
              icon="opacity"
              label="Fluorescence Color"
              value={stock.fluorescence_color}
            />
            <DetailRow
              icon="brightness-high"
              label="Fluorescence Intensity"
              value={stock.fluorescence_intensity}
            />
            <DetailRow
              icon="opacity"
              label="Milky"
              value={stock.milky}
            />
            <DetailRow
              icon="remove-red-eye"
              label="Eye Clean"
              value={stock.eye_clean}
            />
            <DetailRow
              icon="brightness-medium"
              label="Shade"
              value={stock.shade}
            />
            <DetailRow
              icon="science"
              label="Growth Type"
              value={stock.growth_type}
            />
            <DetailRow
              icon="location-on"
              label="Location"
              value={`${stock.city || ""}${stock.state ? ", " + stock.state : ""}${stock.country ? ", " + stock.country : ""}` || "-"}
            />
          </View>
        </Section>

        {/* Crown & Pavilion */}
        <Section title="Crown & Pavilion" icon="terrain">
          <View style={styles.detailsList}>
            <DetailRow
              icon="terrain"
              label="Crown Height"
              value={stock.crown_height ? `${stock.crown_height}%` : "-"}
            />
            <DetailRow
              icon="rotate-right"
              label="Crown Angle"
              value={stock.crown_angle ? `${stock.crown_angle}°` : "-"}
            />
            <DetailRow
              icon="layers"
              label="Pavilion Depth"
              value={stock.pavilion_depth ? `${stock.pavilion_depth}%` : "-"}
            />
            <DetailRow
              icon="rotate-left"
              label="Pavilion Angle"
              value={stock.pavilion_angle ? `${stock.pavilion_angle}°` : "-"}
            />
            <DetailRow
              icon="vignette"
              label="Girdle %"
              value={stock.gridle_per ? `${stock.gridle_per}%` : "-"}
            />
            <DetailRow
              icon="linear-scale"
              label="Girdle Thin"
              value={stock.gridle_thin}
            />
            <DetailRow
              icon="linear-scale"
              label="Girdle Thick"
              value={stock.gridle_thick}
            />
            <DetailRow
              icon="report"
              label="Girdle Condition"
              value={stock.gridle_condition}
            />
          </View>
        </Section>

        {/* Culet */}
        <Section title="Culet" icon="adjust">
          <View style={styles.detailsList}>
            <DetailRow
              icon="radio-button-unchecked"
              label="Culet Size"
              value={stock.culet_size}
            />
            <DetailRow
              icon="report"
              label="Culet Condition"
              value={stock.culet_condition}
            />
          </View>
        </Section>

        {/* Comments */}
        {stock.certificate_comment && (
          <Section title="Comments" icon="comment">
            <View style={styles.commentBox}>
              <Text style={styles.commentText}>{stock.certificate_comment}</Text>
            </View>
          </Section>
        )}

        {/* Media URLs Info (displayed as text only) */}
        <Section title="Media" icon="photo-camera">
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaLabel}>Diamond Image:</Text>
            <Text style={styles.mediaValue} numberOfLines={1}>
              {stock.diamond_image1 || "Not provided"}
            </Text>
          </View>
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaLabel}>Diamond Video:</Text>
            <Text style={styles.mediaValue} numberOfLines={1}>
              {stock.diamond_video || "Not provided"}
            </Text>
          </View>
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaLabel}>Certificate Image:</Text>
            <Text style={styles.mediaValue} numberOfLines={1}>
              {stock.certificate_image || "Not provided"}
            </Text>
          </View>
        </Section>

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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: theme.background,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: {
    padding: 16,
  },
  mainCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.secondary,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
  priceCard: {
    backgroundColor: theme.primary,
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
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  pricePerCarat: {
    alignItems: "flex-end",
  },
  pricePerCaratLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 2,
  },
  pricePerCaratValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.secondary,
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
  commentBox: {
    backgroundColor: theme.background,
    borderRadius: 8,
    padding: 12,
  },
  commentText: {
    fontSize: 14,
    color: theme.text,
    lineHeight: 20,
  },
  mediaInfo: {
    marginBottom: 12,
  },
  mediaLabel: {
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 2,
  },
  mediaValue: {
    fontSize: 13,
    color: theme.primary,
    fontFamily: "monospace",
  },
});
