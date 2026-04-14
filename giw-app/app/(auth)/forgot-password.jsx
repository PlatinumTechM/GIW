import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

const ForgotPasswordScreen = () => {
  const router = useRouter();
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
      <SafeAreaView style={styles.safeArea}>
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
              style={styles.button}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.buttonText}>Continue to Sign In</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.stepsRow}>
            <View style={[styles.stepBubble, step >= 1 && styles.stepActive]}>
              <Text
                style={[styles.stepText, step >= 1 && styles.stepTextActive]}
              >
                1
              </Text>
            </View>
            <View style={[styles.stepBar, step >= 2 && styles.stepBarActive]} />
            <View style={[styles.stepBubble, step >= 2 && styles.stepActive]}>
              <Text
                style={[styles.stepText, step >= 2 && styles.stepTextActive]}
              >
                2
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>
            {step === 1 ? (
              <>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => handleChange("email", value)}
                  placeholder="dealer@company.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                />
                <Pressable
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleEmailSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Continue</Text>
                  )}
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(value) => handleChange("password", value)}
                  placeholder="Enter new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.smallToggle}
                >
                  <Text style={styles.toggleText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>

                <Text style={[styles.fieldLabel, styles.marginTop]}>
                  Confirm Password
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleChange("confirmPassword", value)
                  }
                  placeholder="Confirm password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  style={styles.smallToggle}
                >
                  <Text style={styles.toggleText}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handlePasswordSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Reset Password</Text>
                  )}
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Remember your password?</Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={[styles.bottomText, styles.linkText]}> Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 24,
  },
  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
  },
  errorText: {
    color: "#B91C1C",
    marginBottom: 16,
  },
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
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 16,
  },
  smallToggle: {
    alignSelf: "flex-end",
    marginTop: -12,
    marginBottom: 16,
  },
  toggleText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  centeredScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
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
  marginTop: {
    marginTop: 8,
  },
  bottomRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomText: {
    color: "#475569",
    fontSize: 14,
  },
  linkText: {
    color: "#1E40AF",
    fontWeight: "700",
  },
});

export default ForgotPasswordScreen;
