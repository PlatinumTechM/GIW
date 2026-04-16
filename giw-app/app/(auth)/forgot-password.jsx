import React, { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

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

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
    if (error) {
      setError("");
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmailSubmit = async () => {
    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    Toast.show({
      type: "success",
      text1: "Email Sent",
      text2: "Check your inbox for reset instructions.",
    });
    setStep(2);
  };

  const handlePasswordSubmit = async () => {
    if (!formData.password || !formData.confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    Toast.show({
      type: "success",
      text1: "Password Reset",
      text2: "Your password has been updated successfully.",
    });
    setSuccess(true);
  };

  if (success) {
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
        <View style={styles.blobTopRight} />
        <View style={styles.blobBottomLeft} />

        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <View style={styles.centeredScreen}>
            <View style={styles.successCard}>
              <View style={styles.successIcon}>
                <Text style={styles.successIconText}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Password Reset Complete</Text>
              <Text style={styles.successSubtitle}>
                Your password has been successfully updated. You can now sign in
                with your new credentials.
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.btn,
                  pressed && styles.btnPressed,
                ]}
                onPress={() => router.push("/(auth)/login")}
              >
                <Text style={styles.btnText}>Continue to Sign In</Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={18}
                  color="#fff"
                  style={{ marginLeft: 6 }}
                />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    );
  }

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
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>G</Text>
          </View>
          <Text style={styles.brand}>GIW</Text>
          <Text style={styles.title}>
            {step === 1 ? "Forgot Password?" : "Reset Password"}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? "Enter your email to receive reset instructions."
              : "Create a new secure password."}
          </Text>
        </View>

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

        <View style={styles.stepsRow}>
          <View style={[styles.stepBubble, step >= 1 && styles.stepActive]}>
            <Text style={[styles.stepText, step >= 1 && styles.stepTextActive]}>
              1
            </Text>
          </View>
          <View style={[styles.stepBar, step >= 2 && styles.stepBarActive]} />
          <View style={[styles.stepBubble, step >= 2 && styles.stepActive]}>
            <Text style={[styles.stepText, step >= 2 && styles.stepTextActive]}>
              2
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          {step === 1 ? (
            <FloatingInput
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              placeholder=""
              keyboardType="email-address"
              textContentType="emailAddress"
            />
          ) : (
            <>
              <FloatingInput
                label="New Password"
                value={formData.password}
                onChangeText={(value) => handleChange("password", value)}
                secureTextEntry={!showPassword}
                rightSlot={
                  <VisibilityPill
                    visible={showPassword}
                    onToggle={() => setShowPassword((p) => !p)}
                  />
                }
              />

              <View style={{ marginTop: 20 }}>
                <FloatingInput
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleChange("confirmPassword", value)
                  }
                  secureTextEntry={!showConfirmPassword}
                  rightSlot={
                    <VisibilityPill
                      visible={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword((p) => !p)}
                    />
                  }
                />
              </View>
            </>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.btn,
              pressed && styles.btnPressed,
              loading && styles.btnDisabled,
            ]}
            onPress={step === 1 ? handleEmailSubmit : handlePasswordSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.btnText}>
                  {step === 1 ? "Continue" : "Reset Password"}
                </Text>
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

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Remember your password?</Text>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.bottomLink}> Sign In</Text>
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

  /* steps */
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  stepBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  stepActive: {
    borderColor: "#1E3A8A",
    backgroundColor: "#1E3A8A",
  },
  stepText: {
    color: "#94A3B8",
    fontWeight: "700",
  },
  stepTextActive: {
    color: "#FFFFFF",
  },
  stepBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 12,
    borderRadius: 2,
  },
  stepBarActive: {
    backgroundColor: "#1E3A8A",
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
    marginTop: 24,
  },
  btnPressed: { opacity: 0.88, transform: [{ scale: 0.987 }] },
  btnDisabled: { opacity: 0.65, shadowOpacity: 0 },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  /* centered success screen */
  centeredScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  successCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    padding: 28,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  successIconText: {
    color: "#047857",
    fontSize: 32,
    fontWeight: "800",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },

  /* bottom */
  bottomRow: { flexDirection: "row", justifyContent: "center" },
  bottomText: { color: "#64748B", fontSize: 14 },
  bottomLink: { color: "#1D4ED8", fontSize: 14, fontWeight: "700" },
});

export default ForgotPasswordScreen;
