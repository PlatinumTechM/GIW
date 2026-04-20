import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
  RefreshControl,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authAPI } from "../../src/api/api.js";
import { secureStorage } from "../../src/utils/secureStorage.js";
import Toast from "react-native-toast-message";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.75:5000/api/v1"; // Your computer IP - UPDATE if different!

const { width: screenWidth } = Dimensions.get("window");

// ─── Design Tokens ────────────────────────────────────────────────
const COLORS = {
  primary: "#1E3A8A",
  primaryLight: "#3B6FD4",
  accent: "#60A5FA",
  surface: "#FFFFFF",
  background: "#f8f9fa",
  text: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  amber: "#f59e0b",
};

const ITEMS_PER_PAGE = 10;

// ─── Sort Icon Component ──────────────────────────────────────────
const SortIcon = ({ columnKey, sortConfig }) => {
  if (sortConfig.key !== columnKey) {
    return (
      <MaterialIcons name="swap-vert" size={16} color={COLORS.textSecondary} />
    );
  }
  return sortConfig.direction === "asc" ? (
    <MaterialIcons name="arrow-upward" size={16} color={COLORS.primary} />
  ) : (
    <MaterialIcons name="arrow-downward" size={16} color={COLORS.primary} />
  );
};

// ─── User Card Component ──────────────────────────────────────────
const UserCard = ({
  user,
  onToggleStatus,
  onViewDetails,
  onViewPassword,
  revealedPassword,
  onHidePassword,
  onViewDocument,
}) => {
  const statusColor = user.status === "active" ? COLORS.success : COLORS.error;

  return (
    <View style={styles.userCard}>
      {/* Header - Avatar & Name */}
      <View style={styles.userHeader}>
        <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
          <Text style={styles.avatarText}>{user.avatar}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.contactRow}>
            <MaterialIcons
              name="email"
              size={14}
              color={COLORS.textSecondary}
            />
            <Text style={styles.contactText} numberOfLines={1}>
              {user.email}
            </Text>
          </View>
          <View style={styles.contactRow}>
            <MaterialIcons
              name="phone"
              size={14}
              color={COLORS.textSecondary}
            />
            <Text style={styles.contactText}>{user.phone || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons Grid */}
      <View style={styles.actionGrid}>
        {/* Status Toggle */}
        <Pressable
          style={[
            styles.actionButton,
            {
              backgroundColor:
                user.status === "active" ? COLORS.success : COLORS.error,
            },
          ]}
          onPress={onToggleStatus}
        >
          <MaterialIcons
            name={user.status === "active" ? "check-circle" : "cancel"}
            size={18}
            color="#fff"
          />
          <Text style={styles.actionButtonText}>
            {user.status === "active" ? "Active" : "Inactive"}
          </Text>
        </Pressable>

        {/* Details Button */}
        <Pressable
          style={[
            styles.actionButton,
            { backgroundColor: COLORS.primaryLight },
          ]}
          onPress={onViewDetails}
        >
          <MaterialIcons name="person" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Details</Text>
        </Pressable>

        {/* Password Button - Shows password when revealed */}
        <Pressable
          style={[
            styles.actionButton,
            {
              backgroundColor:
                revealedPassword === user.id ? "#FEF3C7" : COLORS.amber,
            },
          ]}
          onPress={
            revealedPassword === user.id ? onHidePassword : onViewPassword
          }
        >
          <MaterialIcons
            name={
              revealedPassword === user.id ? "visibility-off" : "visibility"
            }
            size={18}
            color={revealedPassword === user.id ? COLORS.amber : "#fff"}
          />
          <Text
            style={[
              styles.actionButtonText,
              revealedPassword === user.id && {
                color: COLORS.amber,
                fontSize: 12,
              },
            ]}
            numberOfLines={1}
          >
            {revealedPassword === user.id ? user.password || "N/A" : "Password"}
          </Text>
        </Pressable>

        {/* Document Button */}
        {user.document ? (
          <Pressable
            style={[styles.actionButton, { backgroundColor: COLORS.info }]}
            onPress={onViewDocument}
          >
            <MaterialIcons name="description" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Document</Text>
          </Pressable>
        ) : (
          <View style={[styles.actionButton, styles.actionButtonDisabled]}>
            <MaterialIcons
              name="description"
              size={18}
              color={COLORS.textSecondary}
            />
            <Text
              style={[styles.actionButtonText, { color: COLORS.textSecondary }]}
            >
              No Doc
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// ─── Password Verification Modal ──────────────────────────────────
const PasswordModal = ({
  visible,
  onClose,
  onVerify,
  adminPassword,
  setAdminPassword,
  verifying,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <MaterialIcons name="security" size={28} color={COLORS.amber} />
            <Text style={styles.modalTitle}>Admin Verification</Text>
          </View>
          <Text style={styles.modalDescription}>
            Enter your admin password to view user password
          </Text>

          <View style={styles.passwordInputContainer}>
            <MaterialIcons name="lock" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.passwordInput}
              placeholder="Admin password"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry
              value={adminPassword}
              onChangeText={setAdminPassword}
              autoFocus
            />
          </View>

          <View style={styles.modalButtons}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.verifyButton, verifying && styles.buttonDisabled]}
              onPress={onVerify}
              disabled={verifying || !adminPassword}
            >
              {verifying ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="verified-user" size={18} color="#fff" />
                  <Text style={styles.verifyButtonText}>Verify</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Document View Modal ──────────────────────────────────────────
const DocumentViewModal = ({ visible, documentUrl, onClose }) => {
  if (!documentUrl) return null;

  const handleOpenDocument = async () => {
    try {
      const fullUrl = documentUrl.startsWith("http")
        ? documentUrl
        : `${API_URL.replace("/api/v1", "")}${documentUrl}`;

      const supported = await Linking.canOpenURL(fullUrl);
      if (supported) {
        await Linking.openURL(fullUrl);
      } else {
        Toast.show({
          type: "error",
          text1: "Cannot Open Document",
          text2: "No application available to open this file",
        });
      }
    } catch (error) {
      console.error("Error opening document:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to open document",
      });
    }
  };

  const getFileName = (url) => {
    if (!url) return "document";
    return url.split("/").pop() || "document";
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <MaterialIcons name="description" size={28} color={COLORS.info} />
            <Text style={styles.modalTitle}>User Document</Text>
          </View>
          <Text style={styles.modalDescription}>
            View or download the uploaded document
          </Text>

          <View style={styles.documentPreview}>
            <MaterialIcons
              name="insert-drive-file"
              size={64}
              color={COLORS.primaryLight}
            />
            <Text style={styles.documentName} numberOfLines={1}>
              {getFileName(documentUrl)}
            </Text>
            <Text style={styles.documentHint}>
              Tap below to open the document
            </Text>
          </View>

          <View style={styles.modalButtons}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Close</Text>
            </Pressable>
            <Pressable
              style={[styles.viewButton, styles.verifyButton]}
              onPress={handleOpenDocument}
            >
              <MaterialIcons name="open-in-new" size={18} color="#fff" />
              <Text style={styles.verifyButtonText}>Open Document</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── User Details Modal ───────────────────────────────────────────
const UserDetailsModal = ({ visible, user, onClose, onViewDocument }) => {
  if (!user) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.detailsModalContent]}>
          <View style={styles.detailsHeader}>
            <View
              style={[
                styles.detailsAvatar,
                { backgroundColor: COLORS.primary },
              ]}
            >
              <Text style={styles.detailsAvatarText}>{user.avatar}</Text>
            </View>
            <View>
              <Text style={styles.detailsName}>{user.name}</Text>
              <Text style={styles.detailsSubtitle}>User Details</Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.detailsScroll}
          >
            <DetailRow icon="email" label="Email" value={user.email} />
            <DetailRow icon="phone" label="Phone" value={user.phone || "N/A"} />
            <DetailRow
              icon="business"
              label="Company"
              value={user.company || "N/A"}
            />
            <DetailRow
              icon="location-on"
              label="Address"
              value={user.address || "N/A"}
            />
            <DetailRow icon="receipt" label="GST" value={user.gst || "N/A"} />
            <DetailRow
              icon="calendar-today"
              label="Joined"
              value={user.joined}
            />
            <DetailRow
              icon="verified-user"
              label="Status"
              value={user.status === "active" ? "Active" : "Inactive"}
              valueColor={
                user.status === "active" ? COLORS.success : COLORS.error
              }
            />
            {user.document && (
              <Pressable onPress={onViewDocument}>
                <DetailRow
                  icon="description"
                  label="Document"
                  value={user.document}
                  isDocument
                />
              </Pressable>
            )}
          </ScrollView>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

// ─── Detail Row Component ─────────────────────────────────────────
const DetailRow = ({ icon, label, value, valueColor, isDocument }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIconContainer}>
      <MaterialIcons name={icon} size={18} color={COLORS.primary} />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[styles.detailValue, valueColor && { color: valueColor }]}
        numberOfLines={isDocument ? 2 : 1}
      >
        {value}
      </Text>
    </View>
  </View>
);

// ─── Main Users Component ─────────────────────────────────────────
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordUser, setPasswordUser] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [revealedPassword, setRevealedPassword] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const insets = useSafeAreaInsets();
  const tokenRef = React.useRef(null);

  // Get token on mount
  useEffect(() => {
    const getToken = async () => {
      tokenRef.current = await secureStorage.getToken();
    };
    getToken();
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const token = tokenRef.current || (await secureStorage.getToken());
      const response = await authAPI.getAllUsers(token);

      if (response.success) {
        const formattedUsers = response.users
          .filter((user) => user.role === "user")
          .map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            company: user.company,
            address: user.address,
            gst: user.gst,
            document: user.document,
            status: user.isActive ? "active" : "inactive",
            joined: new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            avatar:
              user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U",
          }));
        setUsers(formattedUsers);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Load",
          text2: response.message || "Could not fetch users",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load users from database",
      });
    }
  }, []);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    load();
  }, [fetchUsers]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  }, [fetchUsers]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedUsers = React.useMemo(() => {
    return [...users].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, sortConfig]);

  // Filter users
  const filteredUsers = React.useMemo(() => {
    return sortedUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [sortedUsers, searchTerm, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Toggle user status
  const toggleUserStatus = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newStatus = user.status === "active" ? "inactive" : "active";

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
    );

    Toast.show({
      type: "success",
      text1: "Status Updated",
      text2: `${user.name} is now ${newStatus}`,
    });
  };

  // View password handler
  const handleViewPassword = (user) => {
    setPasswordUser(user);
    setShowPasswordModal(true);
    setAdminPassword("");
  };

  // Verify admin password
  const verifyAndShowPassword = async () => {
    if (!adminPassword || !passwordUser) return;

    setVerifying(true);
    try {
      const token = tokenRef.current || (await secureStorage.getToken());
      const response = await authAPI.verifyAdminPassword(adminPassword, token);

      if (response.success) {
        setRevealedPassword(passwordUser.id);
        setShowPasswordModal(false);
        setAdminPassword("");
        Toast.show({
          type: "success",
          text1: "Access Granted",
          text2: "User password is now visible",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Access Denied",
          text2: "Incorrect admin password",
        });
      }
    } catch (error) {
      console.error("Password verification error:", error);
      Toast.show({
        type: "error",
        text1: "Access Denied",
        text2: "Incorrect admin password",
      });
    } finally {
      setVerifying(false);
    }
  };

  // View user details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // View document handler
  const handleViewDocument = (documentUrl) => {
    setSelectedDocument(documentUrl);
    setShowDocumentModal(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>User Management</Text>
          <Text style={styles.subtitle}>
            {users.filter((u) => u.status === "active").length} Active ·{" "}
            {users.filter((u) => u.status === "inactive").length} Inactive
          </Text>
        </View>
      </View>

      {/* Search & Filter */}
      <View style={styles.filterContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <Pressable onPress={() => setSearchTerm("")}>
              <MaterialIcons
                name="close"
                size={20}
                color={COLORS.textSecondary}
              />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChips}
        >
          {["all", "active", "inactive"].map((status) => (
            <Pressable
              key={status}
              style={[
                styles.filterChip,
                filterStatus === status && styles.filterChipActive,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterStatus === status && styles.filterChipTextActive,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Sort Headers */}
      <View style={styles.sortHeader}>
        <Pressable style={styles.sortButton} onPress={() => handleSort("name")}>
          <Text style={styles.sortLabel}>Name</Text>
          <SortIcon columnKey="name" sortConfig={sortConfig} />
        </Pressable>
        <Pressable
          style={styles.sortButton}
          onPress={() => handleSort("email")}
        >
          <Text style={styles.sortLabel}>Email</Text>
          <SortIcon columnKey="email" sortConfig={sortConfig} />
        </Pressable>
      </View>

      {/* Users List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {paginatedUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="search-off"
              size={48}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        ) : (
          paginatedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              revealedPassword={revealedPassword}
              onToggleStatus={() => toggleUserStatus(user.id)}
              onViewDetails={() => handleViewDetails(user)}
              onViewPassword={() => handleViewPassword(user)}
              onHidePassword={() => setRevealedPassword(null)}
              onViewDocument={() => handleViewDocument(user.document)}
            />
          ))
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <View style={styles.pagination}>
            <Text style={styles.paginationInfo}>
              {startIndex + 1}-
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
              {filteredUsers.length}
            </Text>
            <View style={styles.paginationButtons}>
              <Pressable
                style={[
                  styles.pageButton,
                  currentPage === 1 && styles.pageButtonDisabled,
                ]}
                onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <MaterialIcons
                  name="chevron-left"
                  size={24}
                  color={
                    currentPage === 1 ? COLORS.textSecondary : COLORS.primary
                  }
                />
              </Pressable>
              <Text style={styles.pageIndicator}>
                {currentPage} / {totalPages}
              </Text>
              <Pressable
                style={[
                  styles.pageButton,
                  currentPage === totalPages && styles.pageButtonDisabled,
                ]}
                onPress={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={
                    currentPage === totalPages
                      ? COLORS.textSecondary
                      : COLORS.primary
                  }
                />
              </Pressable>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modals */}
      <PasswordModal
        visible={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setAdminPassword("");
        }}
        onVerify={verifyAndShowPassword}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        verifying={verifying}
      />

      <UserDetailsModal
        visible={showDetailsModal}
        user={selectedUser}
        onClose={() => setShowDetailsModal(false)}
        onViewDocument={() =>
          selectedUser?.document && handleViewDocument(selectedUser.document)
        }
      />

      <DocumentViewModal
        visible={showDocumentModal}
        documentUrl={selectedDocument}
        onClose={() => {
          setShowDocumentModal(false);
          setSelectedDocument(null);
        }}
      />
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  filterChips: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  sortHeader: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 16,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  userHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  contactText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    flex: 1,
    minWidth: "45%",
    maxWidth: "48%",
  },
  actionButtonDisabled: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  paginationInfo: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  paginationButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageIndicator: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    minWidth: 50,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  detailsModalContent: {
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  verifyButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.amber,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  viewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.info,
  },
  documentPreview: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 20,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 12,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  documentHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  // Details Modal Styles
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  detailsAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsAvatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  detailsName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  detailsSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  detailsScroll: {
    maxHeight: 400,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default Users;
