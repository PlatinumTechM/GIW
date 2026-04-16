import React, { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authAPI } from "../../src/api/api.js";
import Toast from "react-native-toast-message";

/* ─── Animated floating-label input ─────────────────────────────────────── */
const FloatingInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  rightSlot,
  multiline,
  ...rest
}) => {
  const floatAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const animate = (toValue) =>
    Animated.spring(floatAnim, {
      toValue,
      useNativeDriver: false,
      speed: 30,
      bounciness: 0,
    }).start();

  useEffect(() => {
    if (value || focused) animate(1);
    else animate(0);
  }, [value, focused]);

  const labelTop = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, -9],
  });
  const labelSize = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });
  const labelColor = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#94A3B8", focused ? "#2563EB" : "#64748B"],
  });
  const labelBgColor = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", "#FFFFFF"],
  });

  const handlePress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.floatWrapper,
        focused && styles.floatWrapperFocused,
        multiline && styles.floatWrapperMultiline,
      ]}
    >
      <Animated.Text
        style={[
          styles.floatLabel,
          {
            top: labelTop,
            fontSize: labelSize,
            color: labelColor,
            backgroundColor: labelBgColor,
          },
        ]}
        pointerEvents="none"
      >
        {label}
      </Animated.Text>

      <View style={styles.floatRow} pointerEvents="box-none">
        <TextInput
          ref={inputRef}
          style={[styles.floatInput, multiline && styles.floatInputMultiline]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          multiline={multiline}
          {...rest}
        />
        {rightSlot}
      </View>
    </Pressable>
  );
};

/* ─── Password visibility toggle pill ───────────────────────────────────── */
const VisibilityPill = ({ visible, onToggle }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
      }),
    ]).start();
    onToggle();
  };

  return (
    <Pressable onPress={handlePress} hitSlop={10} style={styles.pillWrapper}>
      <Animated.View
        style={[styles.pill, { transform: [{ scale: scaleAnim }] }]}
      >
        <MaterialIcons
          name={visible ? "visibility" : "visibility-off"}
          size={14}
          color={visible ? "#2563EB" : "#94A3B8"}
        />
        <Text style={[styles.pillText, visible && styles.pillTextActive]}>
          {visible ? "Hide" : "Show"}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

/* ─── Main Screen ─────────────────────────────────────────────────────────── */
const RegisterScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    address: "",
    phone: "",
    gst: "",
    password: "",
    confirmPassword: "",
    document: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 540,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 14,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleChange = (field, value) => {
    if (error) setError("");
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChooseDocument = async () => {
    try {
      // Check if DocumentPicker is available
      if (!DocumentPicker || !DocumentPicker.getDocumentAsync) {
        Toast.show({
          type: "error",
          text1: "Feature Not Available",
          text2: "Document picker is not available on this device",
        });
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        setFormData((prev) => ({
          ...prev,
          document: {
            uri: asset.uri,
            name: asset.name,
            type: asset.mimeType || "unknown",
            size: asset.size || 0,
          },
        }));

        Toast.show({
          type: "success",
          text1: "Success",
          text2: `Document "${asset.name}" selected successfully`,
        });
      } else {
        Toast.show({
          type: "info",
          text1: "No Document Selected",
          text2: "Please select a document to upload",
        });
      }
    } catch (error) {
      console.error("Document picker error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Failed to pick document: ${error.message || "Unknown error"}`,
      });
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        address: formData.address,
        gst: formData.gst,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const result = await authAPI.register(userData);

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: "Your account has been created successfully!",
        });
        setSuccess(
          "Registration successful! Please check your email for verification.",
        );
        setError("");
      } else {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: result.error || "Unable to register",
        });
        setError(result.error || "Unable to register");
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: err.message || "Unable to register",
      });
      setError(err.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      {/* ── Decorative blobs ── */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>G</Text>
          </View>
          <Text style={styles.brand}>GIW</Text>
          <Text style={styles.title}>Create Account.</Text>
          <Text style={styles.subtitle}>
            Register your diamond business with GIW.
          </Text>
        </View>

        {/* ── Error banner ── */}
        {error ? (
          <View style={styles.errorBanner}>
            <MaterialIcons
              name="error-outline"
              size={16}
              color="#DC2626"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* ── Success banner ── */}
        {success ? (
          <View style={styles.successBanner}>
            <MaterialIcons
              name="check-circle-outline"
              size={16}
              color="#059669"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.successText}>{success}</Text>
          </View>
        ) : null}

        {/* ── Form card ── */}
        <View style={styles.card}>
          <View>
            <View style={styles.half}>
              <FloatingInput
                label="Full Name *"
                value={formData.name}
                onChangeText={(v) => handleChange("name", v)}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            <View style={styles.half}>
              <FloatingInput
                label="Email Address *"
                value={formData.email}
                onChangeText={(v) => handleChange("email", v)}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
          </View>

          <View>
            <View style={styles.half}>
              <FloatingInput
                label="Company Name"
                value={formData.company}
                onChangeText={(v) => handleChange("company", v)}
                returnKeyType="next"
              />
            </View>
            <View style={styles.half}>
              <FloatingInput
                label="Mobile Number *"
                value={formData.phone}
                onChangeText={(v) => handleChange("phone", v)}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={{ marginTop: 8 }}>
            <FloatingInput
              label="Business Address"
              value={formData.address}
              onChangeText={(v) => handleChange("address", v)}
              multiline
              numberOfLines={3}
              returnKeyType="next"
            />
          </View>

          <View style={{ marginTop: 8 }}>
            <FloatingInput
              label="GST Number"
              value={formData.gst}
              onChangeText={(v) => handleChange("gst", v)}
              autoCapitalize="characters"
              maxLength={15}
              returnKeyType="next"
            />
          </View>

          <View>
            <View style={styles.half}>
              <FloatingInput
                label="Password *"
                value={formData.password}
                onChangeText={(v) => handleChange("password", v)}
                secureTextEntry={!showPassword}
                returnKeyType="next"
                rightSlot={
                  <VisibilityPill
                    visible={showPassword}
                    onToggle={() => setShowPassword((p) => !p)}
                  />
                }
              />
            </View>
            <View style={styles.half}>
              <FloatingInput
                label="Confirm Password *"
                value={formData.confirmPassword}
                onChangeText={(v) => handleChange("confirmPassword", v)}
                secureTextEntry={!showConfirmPassword}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                rightSlot={
                  <VisibilityPill
                    visible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((p) => !p)}
                  />
                }
              />
            </View>
          </View>

          <Pressable style={styles.uploadButton} onPress={handleChooseDocument}>
            <MaterialIcons
              name={formData.document ? "description" : "upload-file"}
              size={20}
              color="#1D4ED8"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.uploadText} numberOfLines={1}>
              {formData.document
                ? formData.document.name
                : "Upload business document (optional)"}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.btn,
              pressed && styles.btnPressed,
              loading && styles.btnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.btnText}>Register</Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={18}
                  color="#fff"
                  style={{ marginLeft: 6 }}
                />
              </>
            )}
          </Pressable>
        </View>

        {/* ── Login link ── */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.bottomLink}>Sign In</Text>
          </Pressable>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: "#F8FAFF",
    paddingHorizontal: 24,
  },

  /* decorative */
  blobTopRight: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#DBEAFE",
    opacity: 0.55,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: 80,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#E0E7FF",
    opacity: 0.45,
  },

  /* header */
  header: { marginBottom: 32 },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#1D4ED8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#1D4ED8",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  logoText: { color: "#fff", fontWeight: "800", fontSize: 20 },
  brand: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 46,
    marginBottom: 10,
  },
  subtitle: { fontSize: 15, color: "#64748B", lineHeight: 22 },

  /* error/success banners */
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: { color: "#DC2626", fontSize: 13, flex: 1 },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  successText: { color: "#059669", fontSize: 13, flex: 1 },

  /* card */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.09,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    marginBottom: 28,
  },

  /* row layout */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  half: {
    flex: 1,
    minWidth: "45%",
  },

  /* floating label field */
  floatWrapper: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#FAFBFF",
    minHeight: 60,
    marginBottom: 12,
  },
  floatWrapperFocused: {
    borderColor: "#2563EB",
    backgroundColor: "#FFFFFF",
    shadowColor: "#2563EB",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  floatWrapperMultiline: {
    minHeight: 90,
    paddingTop: 24,
  },
  floatLabel: {
    position: "absolute",
    left: 12,
    paddingHorizontal: 4,
    zIndex: 10,
  },
  floatRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  floatInput: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
    paddingTop: 2,
    paddingBottom: 2,
  },
  floatInputMultiline: {
    minHeight: 50,
    textAlignVertical: "top",
  },

  /* visibility pill */
  pillWrapper: { marginLeft: 8 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  pillText: { fontSize: 12, fontWeight: "600", color: "#94A3B8" },
  pillTextActive: { color: "#2563EB" },

  /* upload button */
  uploadButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  uploadText: {
    fontSize: 14,
    color: "#1D4ED8",
    fontWeight: "500",
    flexShrink: 1,
  },

  /* button */
  btn: {
    height: 54,
    borderRadius: 17,
    backgroundColor: "#1D4ED8",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1D4ED8",
    shadowOpacity: 0.32,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  btnPressed: { opacity: 0.88, transform: [{ scale: 0.987 }] },
  btnDisabled: { opacity: 0.65, shadowOpacity: 0 },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  /* bottom */
  bottomRow: { flexDirection: "row", justifyContent: "center" },
  bottomText: { color: "#64748B", fontSize: 14 },
  bottomLink: { color: "#1D4ED8", fontSize: 14, fontWeight: "700" },
});

export default RegisterScreen;
