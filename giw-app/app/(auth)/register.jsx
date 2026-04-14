import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authAPI } from "../../src/api/api.js";
import Toast from "react-native-toast-message";

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

      console.log("Document picker result:", result);

      if (result.canceled) {
        console.log("User cancelled document selection");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log("Selected document:", asset);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.brand}>GIW</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Register your diamond business with GIW.
          </Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <View style={styles.formCard}>
          <View>
            <View style={styles.fieldHalf}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleChange("name", value)}
                placeholder="John Smith"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                maxLength={50}
              />
            </View>
            <View style={styles.fieldHalf}>
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
                maxLength={100}
              />
            </View>
          </View>

          <View>
            <View style={styles.fieldHalf}>
              <Text style={styles.fieldLabel}>Company Name</Text>
              <TextInput
                style={styles.input}
                value={formData.company}
                onChangeText={(value) => handleChange("company", value)}
                placeholder="Diamond Traders Ltd"
                placeholderTextColor="#9CA3AF"
                maxLength={100}
              />
            </View>
            <View style={styles.fieldHalf}>
              <Text style={styles.fieldLabel}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => handleChange("phone", value)}
                placeholder="+91 98765 43210"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={20}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Business Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(value) => handleChange("address", value)}
              placeholder="Enter your full business address"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={200}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>GST Number</Text>
            <TextInput
              style={styles.input}
              value={formData.gst}
              onChangeText={(value) => handleChange("gst", value)}
              placeholder="22AAAAA0000A1Z5"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              maxLength={15}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.fieldHalf}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={formData.password}
                  onChangeText={(value) => handleChange("password", value)}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={8}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
            </View>
            <View style={styles.fieldHalf}>
              <Text style={styles.fieldLabel}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleChange("confirmPassword", value)
                  }
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  hitSlop={8}
                >
                  <MaterialIcons
                    name={showConfirmPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <Pressable style={styles.uploadButton} onPress={handleChooseDocument}>
            <Text style={styles.uploadText}>
              {formData.document
                ? `📄 ${formData.document.name}`
                : "📄 Upload business document (optional)"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account?</Text>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text style={[styles.bottomText, styles.linkText]}> Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    marginBottom: 12,
  },
  successText: {
    color: "#047857",
    marginBottom: 12,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  fieldHalf: {
    flex: 1,
    minWidth: "48%",
    marginBottom: 16,
  },
  field: {
    display: "flex",
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 8,
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
  },
  textArea: {
    minHeight: 98,
    paddingTop: 14,
    marginBottom: 40,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  uploadButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  uploadText: {
    fontSize: 15,
    color: "#1E40AF",
  },
  button: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
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

export default RegisterScreen;
