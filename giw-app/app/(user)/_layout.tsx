import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Platform,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useEffect } from "react";

// ─── Design Tokens ────────────────────────────────────────────────
const COLORS = {
  primary: "#1E3A8A",
  primaryLight: "#3B6FD4",
  accent: "#60A5FA",
  surface: "#FFFFFF",
  border: "#EEF2FF",
  tabInactive: "#94A3B8",
  pill: "#EFF6FF",
  shadow: "#1E3A8A",
};

// ─── Animated Tab Button ───────────────────────────────────────────
function TabButton({
  isFocused,
  onPress,
  onLongPress,
  label,
  iconName,
}: {
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  label: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1.08 : 1,
        useNativeDriver: true,
        tension: 180,
        friction: 10,
      }),
      Animated.timing(bgAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused]);

  const pillWidth = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [44, 110],
  });

  const pillOpacity = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabButton}
      android_ripple={{ color: "transparent" }}
    >
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }], alignItems: "center" }}
      >
        {/* Icon + active dot row */}
        <View style={styles.iconWrapper}>
          {isFocused ? (
            <View style={styles.activeIconContainer}>
              <View style={styles.activeGlow} />
              <MaterialIcons name={iconName} size={22} color={COLORS.primary} />
            </View>
          ) : (
            <MaterialIcons
              name={iconName}
              size={22}
              color={COLORS.tabInactive}
            />
          )}
        </View>

        {/* Label */}
        <Text
          style={[
            styles.tabLabel,
            isFocused
              ? { color: COLORS.primary, fontWeight: "700" }
              : { color: COLORS.tabInactive, fontWeight: "500" },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>

        {/* Active dot */}
        {isFocused && <View style={styles.activeDot} />}
      </Animated.View>
    </Pressable>
  );
}

// ─── Custom Tab Bar ────────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const visibleRoutes = state.routes.filter(
    (route: any) => !descriptors[route.key].options.tabBarButton,
  );

  return (
    <View
      style={[
        styles.tabBarOuter,
        {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
      ]}
    >
      {/* Top accent line */}
      <View style={styles.topAccentLine} />

      <View style={styles.tabBarInner}>
        {visibleRoutes.map((route: any) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === state.routes.indexOf(route);

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          // Derive icon per route name
          const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
            home: "home",
            profile: "account-circle",
          };

          return (
            <TabButton
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              label={options.tabBarLabel ?? route.name}
              iconName={iconMap[route.name] ?? "circle"}
            />
          );
        })}
      </View>
    </View>
  );
}

// ─── Layout ────────────────────────────────────────────────────────
export default function UserLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home", tabBarLabel: "Home" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarLabel: "Profile" }}
      />
      <Tabs.Screen
        name="diamond/index"
        options={{ tabBarButton: () => null }}
      />
      <Tabs.Screen
        name="diamond/DiamondSearchScreen"
        options={{ tabBarButton: () => null }}
      />
      <Tabs.Screen
        name="jewelry/index"
        options={{ tabBarButton: () => null }}
      />
      <Tabs.Screen
        name="jewelry/JewelrySearchScreen"
        options={{ tabBarButton: () => null }}
      />
    </Tabs>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBarOuter: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 0,
    // iOS shadow
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    // Android elevation
    elevation: 16,
  },
  topAccentLine: {
    height: 3,
    marginHorizontal: 24,
    marginTop: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  tabBarInner: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingTop: 6,
    paddingHorizontal: 8,
    minHeight: 58,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    minWidth: 64,
    minHeight: 56, // Accessible tap target
  },
  iconWrapper: {
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeGlow: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    opacity: 0.18,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
    letterSpacing: 0.3,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primaryLight,
    marginTop: 3,
  },
});
