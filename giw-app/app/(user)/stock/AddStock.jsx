import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { stockAPI } from "../../../src/api/api.js";

// ==========================================
// CONSTANTS & FIELD MAPPINGS
// ==========================================

const INITIAL_FORM_DATA = {
  stock_id: "",
  type: "NATURAL",
  certificate_number: "",
  weight: "",
  shape: "",
  color: "",
  fancy_color: "",
  fancy_color_intensity: "",
  fancy_color_overtone: "",
  clarity: "",
  cut: "",
  polish: "",
  symmetry: "",
  fluorescence: "",
  fluorescence_color: "",
  fluorescence_intensity: "",
  measurements: "",
  length: "",
  width: "",
  height: "",
  shade: "",
  milky: "",
  eye_clean: "",
  lab: "",
  certificate_comment: "",
  city: "",
  state: "",
  country: "",
  treatment: "",
  depth_percentage: "",
  table_percentage: "",
  rap_per_carat: "",
  price_per_carat: "",
  final_price: "",
  dollar_rate: "",
  rs_amount: "",
  discount: "",
  heart_arrow: false,
  star_length: "",
  laser_description: "",
  growth_type: "",
  key_to_symbol: "",
  lw_ratio: "",
  culet_size: "",
  culet_condition: "",
  gridle_thin: "",
  gridle_thick: "",
  gridle_condition: "",
  gridle_per: "",
  crown_height: "",
  crown_angle: "",
  pavilion_depth: "",
  pavilion_angle: "",
  status: "AVAILABLE",
  diamond_type: "",
  diamond_image1: "",
  diamond_video: "",
  certificate_image: "",
};

// Field mappings for Excel import - matches backend logic
const FIELD_MAPPINGS = {
  type: ["type", "diamond type", "stone type"],
  stock_id: [
    "stock id",
    "stockid",
    "stock_id",
    "stock no",
    "stockno",
    "stock #",
    "packet no",
    "packetno",
    "stoneno",
    "stone no",
    "stone #",
    "stone id",
    "pkt no",
    "pkt #",
    "ref no",
    "ref #",
    "reference",
  ],
  certificate_number: [
    "certificate number",
    "cert no",
    "cert_no",
    "certificate_no",
    "cert #",
    "cert.",
    "report no",
    "report #",
    "lab no",
    "lab #",
    "report",
    "certificate",
    "cert",
    "inscription",
    "insc",
  ],
  weight: ["weight", "carat", "carat weight", "ct", "cts", "carats", "crt"],
  shape: ["shape", "shp", "diamond shape", "cut shape"],
  color: ["color", "colour", "col", "colors", "clr"],
  fancy_color: [
    "fancy color",
    "fancycolor",
    "fncy color",
    "fncy clr",
    "fan color",
    "f color",
  ],
  fancy_color_intensity: [
    "fancy color intensity",
    "intensity",
    "fancy intensity",
    "clr intensity",
    "color intensity",
  ],
  fancy_color_overtone: [
    "fancy color overtone",
    "overtone",
    "fancy overtone",
    "color overtone",
  ],
  clarity: ["clarity", "clar", "clr", "clarities", "purity"],
  cut: ["cut", "cut grade", "cut quality", "cutting"],
  polish: ["polish", "pol", "polish grade", "polishing"],
  symmetry: ["symmetry", "sym", "symm", "symmetry grade", "sym grade"],
  fluorescence: ["fluorescence", "fluor", "flr", "fl", "fluorescence grade"],
  fluorescence_color: [
    "fluorescence color",
    "fl color",
    "fl. color",
    "fluor color",
  ],
  fluorescence_intensity: [
    "fluorescence intensity",
    "fl intensity",
    "fl. intensity",
    "fluor intensity",
  ],
  measurements: ["measurements", "meas", "dimension", "dimensions"],
  length: ["length", "l", "mm length", "len"],
  width: ["width", "w", "mm width", "wid"],
  height: ["height", "h", "mm height", "depth", "ht", "dep"],
  depth_percentage: [
    "depth %",
    "depth percentage",
    "depth",
    "dep",
    "depth pct",
    "depth%",
  ],
  table_percentage: [
    "table %",
    "table percentage",
    "table",
    "tbl",
    "table pct",
    "table%",
  ],
  rap_per_carat: ["rap per carat", "rap", "rap rate", "rap p/c", "rap/ct"],
  price_per_carat: [
    "price per carat",
    "ppc",
    "per carat price",
    "rate per carat",
    "rate p/c",
  ],
  final_price: [
    "final price",
    "total price",
    "amount",
    "total",
    "value",
    "price",
    "cost",
  ],
  dollar_rate: [
    "dollar rate",
    "rate",
    "usd rate",
    "exchange rate",
    "$ rate",
    "usd",
  ],
  rs_amount: [
    "rs amount",
    "inr amount",
    "rupee amount",
    "local amount",
    "inr",
    "rs",
  ],
  lab: ["lab", "laboratory", "certificate lab", "lab name", "certificate by"],
  status: ["status", "availability", "available"],
  city: ["city", "town"],
  state: ["state", "province"],
  country: ["country", "cntry", "nation"],
  treatment: ["treatment", "treated", "treat", "trt"],
  growth_type: ["growth type", "growth", "cvd", "hpht"],
  milky: ["milky", "milkiness", "milk", "mlk"],
  eye_clean: ["eye clean", "eyeclean", "eye", "ec", "e/c"],
  shade: ["shade", "shd"],
};

// Options for dropdowns
const SHAPE_OPTIONS = [
  "Round",
  "Princess",
  "Emerald",
  "Asscher",
  "Marquise",
  "Oval",
  "Radiant",
  "Pear",
  "Heart",
  "Cushion",
  "Baguette",
  "Trilliant",
  "Triangle",
];

const COLOR_OPTIONS = [
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const CLARITY_OPTIONS = [
  "FL",
  "IF",
  "VVS1",
  "VVS2",
  "VS1",
  "VS2",
  "SI1",
  "SI2",
  "SI3",
  "I1",
  "I2",
  "I3",
];
const CUT_OPTIONS = ["Excellent", "Very Good", "Good", "Fair", "Poor"];
const POLISH_OPTIONS = ["Excellent", "Very Good", "Good", "Fair", "Poor"];
const SYMMETRY_OPTIONS = ["Excellent", "Very Good", "Good", "Fair", "Poor"];
const FLUORESCENCE_OPTIONS = [
  "None",
  "Faint",
  "Medium",
  "Strong",
  "Very Strong",
];
const LAB_OPTIONS = [
  "GIA",
  "IGI",
  "HRD",
  "AGS",
  "EGL",
  "CGL",
  "P.G.I",
  "IIGJ",
  "DCLA",
];
const TREATMENT_OPTIONS = [
  "None",
  "Laser Drilled",
  "HPHT",
  "Irradiated",
  "Color Enhanced",
  "Clarity Enhanced",
  "Fracture Filled",
];
const TYPE_OPTIONS = ["NATURAL", "LABGROWN"];
const FANCY_COLOR_OPTIONS = [
  "Yellow",
  "Pink",
  "Blue",
  "Green",
  "Orange",
  "Red",
  "Purple",
  "Violet",
  "Brown",
  "Gray",
  "Black",
  "Chameleon",
];
const FANCY_INTENSITY_OPTIONS = [
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
const FANCY_OVERTONE_OPTIONS = [
  "None",
  "Yellowish",
  "Orangey",
  "Brownish",
  "Greenish",
  "Purplish",
  "Grayish",
  "Pinkish",
];
const STATUS_OPTIONS = ["AVAILABLE", "SOLD", "ON HOLD", "IN MEMO"];
const GROWTH_TYPE_OPTIONS = ["CVD", "HPHT", "NATURAL"];
const EYE_CLEAN_OPTIONS = ["Yes", "No", "VVS"];
const MILKY_OPTIONS = ["None", "Milky", "Slightly Milky", "Heavy Milky"];

// ==========================================
// HELPER COMPONENTS
// ==========================================

// Section Header
const SectionHeader = ({ title, icon }) => (
  <View style={styles.sectionHeader}>
    <MaterialIcons name={icon} size={20} color="#1E3A8A" />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// Form Input
const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  required = false,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>
      {label} {required && <Text style={styles.required}>*</Text>}
    </Text>
    <TextInput
      style={styles.textInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#94A3B8"
      keyboardType={keyboardType}
    />
  </View>
);

// Dropdown Component
const SelectDropdown = ({
  label,
  value,
  options,
  onSelect,
  placeholder,
  required = false,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <Pressable style={styles.dropdownButton} onPress={() => setVisible(true)}>
        <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="expand-more" size={24} color="#64748B" />
      </Pressable>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <Pressable onPress={() => setVisible(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.optionItem,
                    value === item && styles.optionItemActive,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === item && styles.optionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {value === item && (
                    <MaterialIcons name="check" size={20} color="#1E3A8A" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Toggle Chip
const ToggleChip = ({ label, selected, onPress }) => (
  <Pressable
    style={[styles.chip, selected && styles.chipActive]}
    onPress={onPress}
  >
    <Text style={[styles.chipText, selected && styles.chipTextActive]}>
      {label}
    </Text>
  </Pressable>
);

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AddStockScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [bulkUploadMode, setBulkUploadMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);

  // Update form field
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Handle file upload for bulk import
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "text/csv",
        ],
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setUploadedFile(file);

      // Read file content
      const content = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Parse CSV (simplified - in production use a proper CSV parser)
      const lines = content.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(",");
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || "";
        });
        rows.push(row);
      }

      // Map fields using FIELD_MAPPINGS
      const mappedData = rows.map((row) => {
        const mapped = {};
        Object.keys(FIELD_MAPPINGS).forEach((field) => {
          const possibleNames = FIELD_MAPPINGS[field];
          for (const name of possibleNames) {
            if (row[name] !== undefined) {
              mapped[field] = row[name];
              break;
            }
          }
        });
        return mapped;
      });

      setUploadedData(mappedData);
      Alert.alert("Success", `Parsed ${mappedData.length} rows from file`);
    } catch (error) {
      console.error("File upload error:", error);
      Alert.alert("Error", "Failed to parse file. Please check the format.");
    }
  };

  // Submit single stock
  const handleSubmit = async () => {
    // Validation
    if (
      !formData.stock_id ||
      !formData.weight ||
      !formData.shape ||
      !formData.color ||
      !formData.clarity
    ) {
      Alert.alert(
        "Error",
        "Please fill in all required fields: Stock ID, Weight, Shape, Color, Clarity",
      );
      return;
    }

    setLoading(true);
    try {
      const stockData = {
        ...formData,
        weight: parseFloat(formData.weight) || 0,
        diamond_image1: formData.diamond_image1 || null,
        diamond_video: formData.diamond_video || null,
        certificate_image: formData.certificate_image || null,
        depth_percentage: formData.depth_percentage
          ? parseFloat(formData.depth_percentage)
          : null,
        table_percentage: formData.table_percentage
          ? parseFloat(formData.table_percentage)
          : null,
        rap_per_carat: formData.rap_per_carat
          ? parseFloat(formData.rap_per_carat)
          : null,
        price_per_carat: formData.price_per_carat
          ? parseFloat(formData.price_per_carat)
          : null,
        final_price: formData.final_price
          ? parseFloat(formData.final_price)
          : null,
        dollar_rate: formData.dollar_rate
          ? parseFloat(formData.dollar_rate)
          : null,
        rs_amount: formData.rs_amount ? parseFloat(formData.rs_amount) : null,
        discount: formData.discount ? parseFloat(formData.discount) : null,
        length: formData.length ? parseFloat(formData.length) : null,
        width: formData.width ? parseFloat(formData.width) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        lw_ratio: formData.lw_ratio ? parseFloat(formData.lw_ratio) : null,
        crown_height: formData.crown_height
          ? parseFloat(formData.crown_height)
          : null,
        crown_angle: formData.crown_angle
          ? parseFloat(formData.crown_angle)
          : null,
        pavilion_depth: formData.pavilion_depth
          ? parseFloat(formData.pavilion_depth)
          : null,
        pavilion_angle: formData.pavilion_angle
          ? parseFloat(formData.pavilion_angle)
          : null,
      };

      const response = await stockAPI.createStock(stockData);

      if (response.success) {
        Alert.alert("Success", "Stock added successfully!", [
          {
            text: "OK",
            onPress: () => {
              setFormData(INITIAL_FORM_DATA);
              router.push("/(user)/stock");
            },
          },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to add stock");
      }
    } catch (error) {
      console.error("Error adding stock:", error);
      Alert.alert("Error", "Failed to add stock. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Submit bulk upload
  const handleBulkSubmit = async () => {
    if (!uploadedData || uploadedData.length === 0) {
      Alert.alert("Error", "No data to upload");
      return;
    }

    setLoading(true);
    try {
      // Process each row
      let successCount = 0;
      let errorCount = 0;

      for (const row of uploadedData) {
        try {
          const stockData = {
            ...row,
            weight: parseFloat(row.weight) || 0,
            price_per_carat: row.price_per_carat
              ? parseFloat(row.price_per_carat)
              : null,
            final_price: row.final_price ? parseFloat(row.final_price) : null,
          };
          const response = await stockAPI.createStock(stockData);
          if (response.success) successCount++;
          else errorCount++;
        } catch (err) {
          errorCount++;
        }
      }

      Alert.alert(
        "Bulk Upload Complete",
        `Success: ${successCount}, Errors: ${errorCount}`,
        [{ text: "OK", onPress: () => router.push("/(user)/stock") }],
      );
    } catch (error) {
      Alert.alert("Error", "Bulk upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Add Stock</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Mode Toggle */}
      <View style={styles.modeToggle}>
        <Pressable
          style={[
            styles.modeButton,
            !bulkUploadMode && styles.modeButtonActive,
          ]}
          onPress={() => setBulkUploadMode(false)}
        >
          <MaterialIcons
            name="edit"
            size={18}
            color={!bulkUploadMode ? "#fff" : "#64748B"}
          />
          <Text
            style={[styles.modeText, !bulkUploadMode && styles.modeTextActive]}
          >
            Manual
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeButton, bulkUploadMode && styles.modeButtonActive]}
          onPress={() => setBulkUploadMode(true)}
        >
          <MaterialIcons
            name="upload-file"
            size={18}
            color={bulkUploadMode ? "#fff" : "#64748B"}
          />
          <Text
            style={[styles.modeText, bulkUploadMode && styles.modeTextActive]}
          >
            Bulk Upload
          </Text>
        </Pressable>
      </View>

      {bulkUploadMode ? (
        // Bulk Upload View
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <SectionHeader title="Bulk Import" icon="upload-file" />

            <Pressable style={styles.uploadArea} onPress={handleFileUpload}>
              <MaterialIcons name="cloud-upload" size={48} color="#1E3A8A" />
              <Text style={styles.uploadTitle}>Upload Excel/CSV File</Text>
              <Text style={styles.uploadSubtitle}>
                Tap to select file with stock data{"\n"}Supports .xlsx, .xls,
                .csv
              </Text>
            </Pressable>

            {uploadedFile && (
              <View style={styles.fileInfo}>
                <MaterialIcons
                  name="insert-drive-file"
                  size={24}
                  color="#1E3A8A"
                />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName}>{uploadedFile.name}</Text>
                  <Text style={styles.fileSize}>
                    {uploadedData?.length || 0} rows parsed
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    setUploadedFile(null);
                    setUploadedData(null);
                  }}
                >
                  <MaterialIcons name="close" size={20} color="#EF4444" />
                </Pressable>
              </View>
            )}

            <Pressable
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleBulkSubmit}
              disabled={loading || !uploadedData}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="cloud-upload" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Upload All Stocks</Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        // Manual Entry View
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Required Fields */}
          <View style={styles.section}>
            <SectionHeader title="Required Information" icon="star" />

            <FormInput
              label="Stock ID"
              value={formData.stock_id}
              onChangeText={(text) => updateField("stock_id", text)}
              placeholder="Enter stock ID"
              required
            />

            <SelectDropdown
              label="Type"
              value={formData.type}
              options={TYPE_OPTIONS}
              onSelect={(value) => updateField("type", value)}
              placeholder="Select type"
              required
            />

            <FormInput
              label="Certificate Number"
              value={formData.certificate_number}
              onChangeText={(text) => updateField("certificate_number", text)}
              placeholder="Enter certificate number"
            />

            <FormInput
              label="Weight (Carat)"
              value={formData.weight}
              onChangeText={(text) => updateField("weight", text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
              required
            />

            <SelectDropdown
              label="Shape"
              value={formData.shape}
              options={SHAPE_OPTIONS}
              onSelect={(value) => updateField("shape", value)}
              placeholder="Select shape"
              required
            />

            <SelectDropdown
              label="Color"
              value={formData.color}
              options={COLOR_OPTIONS}
              onSelect={(value) => updateField("color", value)}
              placeholder="Select color"
              required
            />

            <SelectDropdown
              label="Clarity"
              value={formData.clarity}
              options={CLARITY_OPTIONS}
              onSelect={(value) => updateField("clarity", value)}
              placeholder="Select clarity"
              required
            />
          </View>

          {/* Grading */}
          <View style={styles.section}>
            <SectionHeader title="Grading" icon="diamond" />

            <SelectDropdown
              label="Cut"
              value={formData.cut}
              options={CUT_OPTIONS}
              onSelect={(value) => updateField("cut", value)}
              placeholder="Select cut"
            />

            <SelectDropdown
              label="Polish"
              value={formData.polish}
              options={POLISH_OPTIONS}
              onSelect={(value) => updateField("polish", value)}
              placeholder="Select polish"
            />

            <SelectDropdown
              label="Symmetry"
              value={formData.symmetry}
              options={SYMMETRY_OPTIONS}
              onSelect={(value) => updateField("symmetry", value)}
              placeholder="Select symmetry"
            />

            <SelectDropdown
              label="Fluorescence"
              value={formData.fluorescence}
              options={FLUORESCENCE_OPTIONS}
              onSelect={(value) => updateField("fluorescence", value)}
              placeholder="Select fluorescence"
            />

            <SelectDropdown
              label="Lab / Certification"
              value={formData.lab}
              options={LAB_OPTIONS}
              onSelect={(value) => updateField("lab", value)}
              placeholder="Select lab"
            />
          </View>

          {/* Measurements */}
          <View style={styles.section}>
            <SectionHeader title="Measurements" icon="straighten" />

            <FormInput
              label="Length (mm)"
              value={formData.length}
              onChangeText={(text) => updateField("length", text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <FormInput
              label="Width (mm)"
              value={formData.width}
              onChangeText={(text) => updateField("width", text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <FormInput
              label="Height (mm)"
              value={formData.height}
              onChangeText={(text) => updateField("height", text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <FormInput
              label="Depth %"
              value={formData.depth_percentage}
              onChangeText={(text) => updateField("depth_percentage", text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <FormInput
              label="Table %"
              value={formData.table_percentage}
              onChangeText={(text) => updateField("table_percentage", text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Pricing */}
          <View style={styles.section}>
            <SectionHeader title="Pricing" icon="attach-money" />

            <FormInput
              label="Rap Per Carat"
              value={formData.rap_per_carat}
              onChangeText={(text) => updateField("rap_per_carat", text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <FormInput
              label="Price Per Carat"
              value={formData.price_per_carat}
              onChangeText={(text) => updateField("price_per_carat", text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <FormInput
              label="Final Price"
              value={formData.final_price}
              onChangeText={(text) => updateField("final_price", text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <FormInput
              label="Dollar Rate"
              value={formData.dollar_rate}
              onChangeText={(text) => updateField("dollar_rate", text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            <FormInput
              label="Discount %"
              value={formData.discount}
              onChangeText={(text) => updateField("discount", text)}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Additional Properties */}
          <View style={styles.section}>
            <SectionHeader title="Additional Properties" icon="more-horiz" />

            <SelectDropdown
              label="Treatment"
              value={formData.treatment}
              options={TREATMENT_OPTIONS}
              onSelect={(value) => updateField("treatment", value)}
              placeholder="Select treatment"
            />

            <SelectDropdown
              label="Milky"
              value={formData.milky}
              options={MILKY_OPTIONS}
              onSelect={(value) => updateField("milky", value)}
              placeholder="Select milky"
            />

            <SelectDropdown
              label="Eye Clean"
              value={formData.eye_clean}
              options={EYE_CLEAN_OPTIONS}
              onSelect={(value) => updateField("eye_clean", value)}
              placeholder="Select eye clean"
            />

            <SelectDropdown
              label="Growth Type"
              value={formData.growth_type}
              options={GROWTH_TYPE_OPTIONS}
              onSelect={(value) => updateField("growth_type", value)}
              placeholder="Select growth type"
            />

            <Text style={styles.inputLabel}>Status</Text>
            <View style={styles.chipContainer}>
              {STATUS_OPTIONS.map((status) => (
                <ToggleChip
                  key={status}
                  label={status}
                  selected={formData.status === status}
                  onPress={() => updateField("status", status)}
                />
              ))}
            </View>
          </View>

          {/* Fancy Color (conditional) */}
          {formData.color === "Fancy" && (
            <View style={styles.section}>
              <SectionHeader title="Fancy Color Details" icon="palette" />

              <SelectDropdown
                label="Fancy Color"
                value={formData.fancy_color}
                options={FANCY_COLOR_OPTIONS}
                onSelect={(value) => updateField("fancy_color", value)}
                placeholder="Select fancy color"
              />

              <SelectDropdown
                label="Fancy Intensity"
                value={formData.fancy_color_intensity}
                options={FANCY_INTENSITY_OPTIONS}
                onSelect={(value) =>
                  updateField("fancy_color_intensity", value)
                }
                placeholder="Select intensity"
              />

              <SelectDropdown
                label="Fancy Overtone"
                value={formData.fancy_color_overtone}
                options={FANCY_OVERTONE_OPTIONS}
                onSelect={(value) => updateField("fancy_color_overtone", value)}
                placeholder="Select overtone"
              />
            </View>
          )}

          {/* Media / Images */}
          <View style={styles.section}>
            <SectionHeader title="Media & Images" icon="photo-camera" />

            <FormInput
              label="Diamond Image URL"
              value={formData.diamond_image1}
              onChangeText={(text) => updateField("diamond_image1", text)}
              placeholder="Enter image URL"
            />

            <FormInput
              label="Diamond Video URL"
              value={formData.diamond_video}
              onChangeText={(text) => updateField("diamond_video", text)}
              placeholder="Enter video URL"
            />

            <FormInput
              label="Certificate Image URL"
              value={formData.certificate_image}
              onChangeText={(text) => updateField("certificate_image", text)}
              placeholder="Enter certificate image URL"
            />
          </View>

          {/* Submit Button */}
          <Pressable
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="save" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Save Stock</Text>
              </>
            )}
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: "#1E3A8A",
  },
  modeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  modeTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
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
    color: "#1E3A8A",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0F172A",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: "#0F172A",
  },
  dropdownPlaceholder: {
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  optionItemActive: {
    backgroundColor: "#EFF6FF",
  },
  optionText: {
    fontSize: 16,
    color: "#0F172A",
  },
  optionTextActive: {
    color: "#1E3A8A",
    fontWeight: "600",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  chipTextActive: {
    color: "#fff",
  },
  uploadArea: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginTop: 12,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  fileDetails: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  fileSize: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1E3A8A",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
