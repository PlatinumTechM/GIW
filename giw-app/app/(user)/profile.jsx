import React, { useState, useEffect, useCallback } from "react";
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
  Animated,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import { secureStorage } from "../../src/utils/secureStorage.js";
import { authAPI } from "../../src/api/api.js";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const [activeTab, setActiveTab] = useState("profile"); // profile, settings

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    gst: "",
  });

  const [settings, setSettings] = useState({
    notifications: true,
    biometricLogin: false,
    language: "English",
  });

  // Load user data from secure storage on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userData = await secureStorage.getUserData();

        // Here
        if (userData) {
          setUser(userData);
          // Animate in content
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        } else {
          // User not logged in - show message and redirect
          setMessage({
            type: "error",
            text: "Please login to access your profile",
          });
          // Redirect to login after short delay to show message
          setTimeout(() => {
            router.replace("/(auth)/login");
          }, 1000);
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

  const handleLogout = useCallback(async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await secureStorage.clearAll();
              Toast.show({
                type: "success",
                text1: "Logged Out",
                text2: "You have been successfully logged out",
              });
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Logout error:", error);
              Toast.show({
                type: "error",
                text1: "Logout Failed",
                text2: "Unable to logout. Please try again",
              });
            }
          },
        },
      ],
      { cancelable: true },
    );
  }, [router]);

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsEditing(true);
    setMessage({ type: "", text: "" });
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsEditing(false);
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

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return ["#7C3AED", "#A855F7"];
      case "dealer":
        return ["#059669", "#10B981"];
      default:
        return ["#1E3A8A", "#3B82F6"];
    }
  };

  const renderField = (label, value, icon, key, placeholder, options = {}) => (
    <View style={styles.fieldContainer} key={key}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          isEditing && styles.inputWrapperEditing,
          options.multiline && styles.inputWrapperMultiline,
        ]}
      >
        <View style={styles.inputIconContainer}>
          <MaterialIcons
            name={icon}
            size={20}
            color={isEditing ? "#1E3A8A" : "#94A3B8"}
          />
        </View>
        <TextInput
          style={[
            styles.modernInput,
            options.multiline && styles.multilineInput,
            !isEditing && styles.inputReadonly,
          ]}
          value={value}
          onChangeText={(text) => handleInputChange(key, text)}
          placeholder={placeholder}
          placeholderTextColor="#CBD5E1"
          editable={isEditing && !options.readonly}
          multiline={options.multiline}
          numberOfLines={options.numberOfLines}
          textAlignVertical={options.multiline ? "top" : "center"}
          keyboardType={options.keyboardType || "default"}
          autoCapitalize={options.autoCapitalize || "sentences"}
        />
        {options.readonly && (
          <View style={styles.readonlyBadge}>
            <MaterialIcons name="lock" size={14} color="#94A3B8" />
          </View>
        )}
      </View>
    </View>
  );

  const renderSettingItem = (icon, title, subtitle, type, value, onToggle) => (
    <View style={styles.settingItem} key={title}>
      <View style={styles.settingIconContainer}>
        <MaterialIcons name={icon} size={22} color="#1E3A8A" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {type === "switch" ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#E2E8F0", true: "#1E3A8A" }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <View style={styles.settingValueContainer}>
          <Text style={styles.settingValue}>{value}</Text>
          <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={["#1E3A8A", "#3B82F6"]}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </LinearGradient>
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
        {/* Hero Header with Gradient */}
        <LinearGradient
          colors={["#1E3A8A", "#3B82F6", "#60A5FA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroHeader}
        >
          <View style={styles.heroContent}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={8}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.heroTitle}>My Profile</Text>
            <Pressable
              style={styles.heroLogoutButton}
              onPress={handleLogout}
              hitSlop={8}
            >
              <MaterialIcons name="logout" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </LinearGradient>

        {/* Profile Card */}
        <Animated.View
          style={[
            styles.profileCardContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={getRoleColor(user?.role)}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            </LinearGradient>
            <View style={styles.avatarBadge}>
              <MaterialIcons name="verified" size={16} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.profileInfoSection}>
            <Text style={styles.profileName}>
              {user?.name || "Valued Customer"}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View
              style={[
                styles.roleBadge,
                { backgroundColor: getRoleColor(user?.role)[0] + "20" },
              ]}
            >
              <MaterialIcons
                name="shield"
                size={14}
                color={getRoleColor(user?.role)[0]}
              />
              <Text
                style={[
                  styles.roleText,
                  { color: getRoleColor(user?.role)[0] },
                ]}
              >
                {(user?.role || "Member").toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
                <MaterialIcons name="shopping-bag" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}>
                <MaterialIcons name="favorite" size={20} color="#EF4444" />
              </View>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={[styles.statIcon, { backgroundColor: "#DBEAFE" }]}>
                <MaterialIcons name="diamond" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Diamonds</Text>
            </View>
          </View>
        </Animated.View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === "profile" && styles.tabActive]}
            onPress={() => {
              setActiveTab("profile");
            }}
          >
            <MaterialIcons
              name="person"
              size={20}
              color={activeTab === "profile" ? "#1E3A8A" : "#94A3B8"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "profile" && styles.tabTextActive,
              ]}
            >
              Profile
            </Text>
          </Pressable>
          {/* <Pressable
            style={[styles.tab, activeTab === "settings" && styles.tabActive]}
            onPress={() => {
              setActiveTab("settings");
            }}
          >
            <MaterialIcons
              name="settings"
              size={20}
              color={activeTab === "settings" ? "#1E3A8A" : "#94A3B8"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "settings" && styles.tabTextActive,
              ]}
            >
              Settings
            </Text>
          </Pressable> */}
        </View>

        {/* Content Based on Active Tab */}
        {activeTab === "profile" ? (
          <Animated.View
            style={[
              styles.contentCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Form Header */}
            <View style={styles.formHeader}>
              <View style={styles.formHeaderIcon}>
                <MaterialIcons name="edit-note" size={24} color="#1E3A8A" />
              </View>
              <View>
                <Text style={styles.formHeaderTitle}>
                  {isEditing ? "Edit Profile" : "Profile Details"}
                </Text>
                <Text style={styles.formHeaderSubtitle}>
                  {isEditing
                    ? "Update your information below"
                    : "Your personal and business information"}
                </Text>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formFields}>
              {renderField(
                "Full Name",
                formData.name,
                "person",
                "name",
                "John Smith",
              )}
              {renderField(
                "Email Address",
                formData.email,
                "email",
                "email",
                "john@example.com",
                {
                  readonly: true,
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                },
              )}
              {renderField(
                "Company Name",
                formData.company,
                "business",
                "company",
                "Diamond Traders Ltd",
              )}
              {renderField(
                "Phone Number",
                formData.phone,
                "phone",
                "phone",
                "+91 98765 43210",
                { keyboardType: "phone-pad" },
              )}
              {renderField(
                "Business Address",
                formData.address,
                "location-on",
                "address",
                "Enter your full business address",
                { multiline: true, numberOfLines: 3 },
              )}
              {renderField(
                "GST Registration",
                formData.gst,
                "receipt",
                "gst",
                "22AAAAA0000A1Z5",
                { autoCapitalize: "characters" },
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              {!isEditing ? (
                <AnimatedPressable
                  onPress={handleEdit}
                  style={styles.primaryButton}
                  android_ripple={{ color: "rgba(255,255,255,0.2)" }}
                >
                  <LinearGradient
                    colors={["#1E3A8A", "#3B82F6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <MaterialIcons name="edit" size={20} color="#FFFFFF" />
                    <Text style={styles.primaryButtonText}>Edit Profile</Text>
                  </LinearGradient>
                </AnimatedPressable>
              ) : (
                <View style={styles.buttonRow}>
                  <Pressable
                    onPress={handleCancel}
                    disabled={saveLoading}
                    style={[
                      styles.secondaryButton,
                      saveLoading && styles.buttonDisabled,
                    ]}
                  >
                    <MaterialIcons name="close" size={20} color="#64748B" />
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleSave}
                    disabled={saveLoading}
                    style={[
                      styles.primaryButtonFlex,
                      saveLoading && styles.buttonDisabled,
                    ]}
                  >
                    {saveLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <MaterialIcons name="check" size={20} color="#FFFFFF" />
                        <Text style={styles.primaryButtonText}>
                          Save Changes
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>
              )}
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.contentCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.formHeader}>
              <View style={styles.formHeaderIcon}>
                <MaterialIcons name="settings" size={24} color="#1E3A8A" />
              </View>
              <View>
                <Text style={styles.formHeaderTitle}>Settings</Text>
                <Text style={styles.formHeaderSubtitle}>
                  Manage your preferences
                </Text>
              </View>
            </View>

            <View style={styles.settingsContainer}>
              {renderSettingItem(
                "notifications",
                "Push Notifications",
                "Receive order updates and offers",
                "switch",
                settings.notifications,
                (value) => setSettings({ ...settings, notifications: value }),
              )}
              {renderSettingItem(
                "fingerprint",
                "Biometric Login",
                "Use fingerprint or face recognition",
                "switch",
                settings.biometricLogin,
                (value) => setSettings({ ...settings, biometricLogin: value }),
              )}
              {renderSettingItem(
                "language",
                "Language",
                "Change app language",
                "select",
                settings.language,
              )}
            </View>

            {/* Support Section */}
            <View style={styles.supportSection}>
              <Text style={styles.supportTitle}>Support</Text>
              <Pressable style={styles.supportItem}>
                <MaterialIcons name="help-outline" size={22} color="#64748B" />
                <Text style={styles.supportItemText}>Help Center</Text>
                <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
              </Pressable>
              <Pressable style={styles.supportItem}>
                <MaterialIcons name="privacy-tip" size={22} color="#64748B" />
                <Text style={styles.supportItemText}>Privacy Policy</Text>
                <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
              </Pressable>
              <Pressable style={styles.supportItem}>
                <MaterialIcons name="description" size={22} color="#64748B" />
                <Text style={styles.supportItemText}>Terms of Service</Text>
                <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* Message Alert */}
        {message.text && (
          <Animated.View
            style={[
              styles.floatingMessage,
              message.type === "success"
                ? styles.floatingSuccess
                : styles.floatingError,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.messageContent}>
              <MaterialIcons
                name={message.type === "success" ? "check-circle" : "error"}
                size={24}
                color={message.type === "success" ? "#10B981" : "#EF4444"}
              />
              <Text
                style={[
                  styles.floatingMessageText,
                  message.type === "success"
                    ? styles.floatingSuccessText
                    : styles.floatingErrorText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  loadingGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  // Hero Header
  heroHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heroLogoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(220,38,38,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Profile Card
  profileCardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: -40,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileInfoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E2E8F0",
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#EFF6FF",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  tabTextActive: {
    color: "#1E3A8A",
  },

  // Content Card
  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Form Header
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  formHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  formHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  formHeaderSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },

  // Form Fields
  formFields: {
    gap: 20,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    minHeight: 52,
  },
  inputWrapperEditing: {
    borderColor: "#1E3A8A",
    backgroundColor: "#FFFFFF",
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputWrapperMultiline: {
    minHeight: 100,
    paddingTop: 14,
    alignItems: "flex-start",
  },
  inputIconContainer: {
    marginRight: 12,
  },
  modernInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    paddingVertical: 0,
    height: 52,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 4,
  },
  inputReadonly: {
    color: "#6B7280",
  },
  readonlyBadge: {
    marginLeft: 8,
  },

  // Action Buttons
  actionContainer: {
    marginTop: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  primaryButtonFlex: {
    flex: 2,
    backgroundColor: "#1E3A8A",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Settings
  settingsContainer: {
    gap: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },
  settingValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },

  // Support Section
  supportSection: {
    marginTop: 24,
    paddingTop: 24,
    // borderTopWidth: 1,
    // borderTopColor: "#F1F5F9",
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  supportItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  supportItemText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    marginLeft: 14,
  },

  // Floating Message
  floatingMessage: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingSuccess: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#10B981",
  },
  floatingError: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  messageContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  floatingMessageText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  floatingSuccessText: {
    color: "#059669",
  },
  floatingErrorText: {
    color: "#DC2626",
  },
});

export default Profile;
