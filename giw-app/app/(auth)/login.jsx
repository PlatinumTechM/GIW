import { useState, useRef, useEffect } from "react";
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
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authAPI } from "../../src/api/api.js";
import Toast from "react-native-toast-message";
import { secureStorage } from "../../src/utils/secureStorage.js";

/* ─── Animated floating-label input ─────────────────────────────────────── */
const FloatingInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  rightSlot,
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
    // Explicitly focus the input when the container is pressed
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.floatWrapper, focused && styles.floatWrapperFocused]}
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
          style={styles.floatInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />
        {rightSlot}
      </View>
    </Pressable>
  );
};

/* ─── Password visibility toggle pill ───────────────────────────────────── */
/*  Lives OUTSIDE the TextInput — no layout jump, no iOS quirks            */
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

/* ─── Strength dot row ──────────────────────────────────────────────────── */
const strengthLevel = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

/* ─── Main Screen ─────────────────────────────────────────────────────────── */
const LoginScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  /* ── identical login logic ── */
  const login = async (identifier, password) => {
    try {
      const result = await authAPI.login(identifier, password);
      return { success: true, data: result.user, token: result.token };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!formData.identifier || !formData.password) {
      setError("Please enter your email/mobile and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await login(formData.identifier, formData.password);
      if (result.success) {
        const tokenStored = await secureStorage.setToken(result.token);
        const userDataStored = await secureStorage.setUserData(result.data);
        const roleStored = await secureStorage.setRole(
          result.data?.role || "user",
        );
        const verifyToken = await secureStorage.getToken();
        const verifyUserData = await secureStorage.getUserData();
        setTimeout(async () => {
          const delayedToken = await secureStorage.getToken();
          const delayedUserData = await secureStorage.getUserData();
        }, 500);

        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: "Welcome back!",
        });

        if (result.data?.role === "user") {
          router.push("/(user)/home");
        } else {
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: result.error || "Invalid credentials",
        });
        setError(result.error || "Unable to sign in");
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: err.message || "Unable to sign in",
      });
      setError(err.message || "Unable to sign in");
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
          <Text style={styles.title}>Welcome Back.</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey.</Text>
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

        {/* ── Form card ── */}
        <View style={styles.card}>
          <FloatingInput
            label="Email or Mobile Number"
            value={formData.identifier}
            onChangeText={(v) => handleChange("identifier", v)}
            keyboardType="default"
            textContentType="username"
            returnKeyType="next"
          />

          <View style={{ marginTop: 20 }}>
            <FloatingInput
              label="Password"
              value={formData.password}
              onChangeText={(v) => handleChange("password", v)}
              secureTextEntry={!showPassword}
              textContentType={Platform.OS === "ios" ? "password" : "password"}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              rightSlot={
                <VisibilityPill
                  visible={showPassword}
                  onToggle={() => setShowPassword((p) => !p)}
                />
              }
            />
          </View>

          {/* ── Remember / Forgot ── */}
          <View style={styles.rowBetween}>
            <Pressable
              style={styles.rememberRow}
              onPress={() => setRememberMe((p) => !p)}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && (
                  <MaterialIcons name="check" size={12} color="#fff" />
                )}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>

          {/* ── Sign In button ── */}
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
                <Text style={styles.btnText}>Sign In</Text>
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

        {/* ── Register link ── */}
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>New to GIW? </Text>
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.bottomLink}>Create account</Text>
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

  /* error */
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

  /* visibility pill — sits right of the input, never inside it */
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

  /* strength bar */
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 5,
  },
  strengthDot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 6,
    minWidth: 38,
    textAlign: "right",
  },

  /* row */
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 24,
  },
  rememberRow: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#1D4ED8", borderColor: "#1D4ED8" },
  rememberText: { color: "#475569", fontSize: 14 },
  forgotText: { color: "#1D4ED8", fontSize: 14, fontWeight: "700" },

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

export default LoginScreen;
