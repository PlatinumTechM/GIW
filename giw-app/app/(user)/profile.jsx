import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { secureStorage } from "../../src/utils/secureStorage.js";
import { authAPI } from "../../src/api/api.js";
import { authDebug } from "../../src/utils/authDebug.js";

// TODO: Replace with React Navigation
// import { useAuth } from "@/contexts/AuthContext";
// import notify from "@/utils/notifications.jsx";
// import { formatFieldValue } from "@/utils/formatters.js";

const Profile = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    gst: "",
  });

  // Load user data from secure storage on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);

        // Run comprehensive authentication debugging
        await authDebug.debugAuthState();

        const userData = await secureStorage.getUserData();
        console.log("Raw userdata from storage:", userData);
        console.log("Userdata type:", typeof userData);
        console.log("Userdata is null:", userData === null);

        if (userData) {
          setUser(userData);
          console.log("User data loaded successfully:", userData);
        } else {
          console.log("No user data found in storage");
          // If no user data, show error message but don't redirect
          setMessage({
            type: "error",
            text: "Please login to access your profile",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setMessage({
          type: "error",
          text: "Failed to load profile data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Check authentication status periodically
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await secureStorage.getToken();
        if (!token) {
          if (!loading) {
            setMessage({
              type: "warning",
              text: "Your session has expired. Please login again.",
            });
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };

    // Check auth status every 30 seconds
    const authInterval = setInterval(checkAuth, 30000);

    return () => clearInterval(authInterval);
  }, []);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        phone: user.phone || "",
        address: user.address || "",
        gst: user.gst || "",
      });
    }
  }, [user]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = async () => {
    try {
      await secureStorage.clearAll();
      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "You have been successfully logged out",
      });
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: "Unable to logout. Please try again",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: "", text: "" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        phone: user.phone || "",
        address: user.address || "",
        gst: user.gst || "",
      });
    }
    setMessage({ type: "", text: "" });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Get authentication token from secure storage
      const token = await secureStorage.getToken();

      console.log(
        "Token retrieved for profile update:",
        token ? "Token exists" : "No token found",
      );

      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      // Call PUT /auth/profile API
      const response = await authAPI.updateProfile(
        {
          name: formData.name.trim(),
          company: formData.company.trim(),
          phone: formData.phone,
          address: formData.address.trim(),
          gst: formData.gst,
        },
        token,
      );

      if (response.success) {
        setUser(response.user);
        // Store updated user data securely
        await secureStorage.setUserData(response.user);
        await secureStorage.setRole(response.user.role || "user");
        setIsEditing(false);
        Toast.show({
          type: "success",
          text1: "Profile Updated",
          text2: "Your changes have been saved successfully",
        });
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        Toast.show({
          type: "error",
          text1: "Save Failed",
          text2: "Unable to save changes. Please try again",
        });
        setMessage({
          type: "error",
          text: response.error || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Update profile error:", error);
      Toast.show({
        type: "error",
        text1: "Save Failed",
        text2: "Unable to save changes. Please try again",
      });
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#64748B" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>My Profile</Text>
              <Text style={styles.headerSubtitle}>
                Your exclusive account information
              </Text>
            </View>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <MaterialIcons name="logout" size={20} color="#FFFFFF" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </Pressable>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Profile Header with Avatar */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={40} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.name || "Valued Customer"}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              {/* Role Badge */}
              <View style={styles.roleBadge}>
                <MaterialIcons name="shield" size={16} color="#B8860B" />
                <Text style={styles.roleText}>{user?.role || "Member"}</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialIcons name="diamond" size={24} color="#1E3A8A" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="favorite" size={24} color="#EF4444" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <MaterialIcons name="business" size={20} color="#1E3A8A" />
              </View>
              <Text style={styles.contactLabel}>
                {user?.company || "No company"}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <MaterialIcons name="phone" size={20} color="#1E3A8A" />
              </View>
              <Text style={styles.contactLabel}>
                {user?.phone || "No phone"}
              </Text>
            </View>
          </View>
        </View>

        {/* Edit Form */}
        <View style={styles.formCard}>
          <View style={styles.formContent}>
            {/* Name Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <MaterialIcons name="person" size={20} color="#1E3A8A" />
                </View>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                  placeholder="John Smith"
                  placeholderTextColor="#9CA3AF"
                  editable={isEditing}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <MaterialIcons name="email" size={20} color="#94A3B8" />
                </View>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  placeholder="john@example.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={isEditing}
                />
                <View style={styles.fieldNote}>
                  <MaterialIcons name="shield" size={12} color="#10B981" />
                  <Text style={styles.fieldNoteText}>
                    Email address cannot be changed
                  </Text>
                </View>
              </View>
            </View>

            {/* Company Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Company Name</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <MaterialIcons name="business" size={20} color="#1E3A8A" />
                </View>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.company}
                  onChangeText={(value) => handleInputChange("company", value)}
                  placeholder="Diamond Traders Ltd"
                  placeholderTextColor="#9CA3AF"
                  editable={isEditing}
                />
              </View>
            </View>

            {/* Phone Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <MaterialIcons name="phone" size={20} color="#1E3A8A" />
                </View>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  editable={isEditing}
                />
              </View>
            </View>

            {/* Address Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Business Address</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <MaterialIcons name="location-on" size={20} color="#1E3A8A" />
                </View>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    !isEditing && styles.inputDisabled,
                  ]}
                  value={formData.address}
                  onChangeText={(value) => handleInputChange("address", value)}
                  placeholder="Enter your full business address"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  editable={isEditing}
                />
              </View>
            </View>

            {/* GST Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>GST Registration Number</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <MaterialIcons name="receipt" size={20} color="#B8860B" />
                </View>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={formData.gst}
                  onChangeText={(value) => handleInputChange("gst", value)}
                  placeholder="22AAAAA0000A1Z5"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                  editable={isEditing}
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {!isEditing ? (
              <Pressable onPress={handleEdit} style={styles.editButton}>
                <MaterialIcons name="edit" size={20} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </Pressable>
            ) : (
              <View style={styles.buttonRow}>
                <Pressable
                  onPress={handleCancel}
                  disabled={saveLoading}
                  style={[
                    styles.cancelButton,
                    saveLoading && styles.buttonDisabled,
                  ]}
                >
                  <MaterialIcons name="close" size={20} color="#475569" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  disabled={saveLoading}
                  style={[
                    styles.saveButton,
                    saveLoading && styles.buttonDisabled,
                  ]}
                >
                  {saveLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialIcons name="save" size={20} color="#FFFFFF" />
                      <Text style={styles.saveButtonText}>Save</Text>
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Message Alert */}
        {message.text && (
          <View
            style={[
              styles.messageContainer,
              message.type === "success"
                ? styles.successMessage
                : styles.errorMessage,
            ]}
          >
            <MaterialIcons
              name={message.type === "success" ? "check-circle" : "error"}
              size={24}
              color={message.type === "success" ? "#10B981" : "#EF4444"}
            />
            <Text
              style={[
                styles.messageText,
                message.type === "success"
                  ? styles.successText
                  : styles.errorText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#DC2626",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    color: "#FFFFFF",
  },
  profileInfo: {
    alignItems: "center",
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#64748B",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FEF2C8",
    borderRadius: 20,
  },
  roleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B8860B",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  statItem: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  contactInfo: {
    gap: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
  },
  contactIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  contactLabel: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  formHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  editIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  formSubtitle: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  field: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  inputContainer: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    marginTop: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F3F8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 16,
    backgroundColor: "#F8FAFC",
    fontSize: 16,
    color: "#475569",
  },
  inputDisabled: {
    backgroundColor: "#F1F5F9",
    color: "#9CA3AF",
  },
  textArea: {
    height: 80,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  fieldNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  fieldNoteText: {
    fontSize: 12,
    color: "#10B981",
  },
  actionButtons: {
    gap: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1E3A8A",
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  saveButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1E3A8A",
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  successMessage: {
    backgroundColor: "#D1FAE5",
  },
  errorMessage: {
    backgroundColor: "#FEE2E2",
  },
  messageText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  successText: {
    color: "#065F46",
  },
  errorText: {
    color: "#DC2626",
  },
});

export default Profile;
