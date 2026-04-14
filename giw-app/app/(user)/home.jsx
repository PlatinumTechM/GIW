import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("window");

const categoryImages = [
  {
    id: "natural-diamond",
    url: { uri: "http://192.168.1.75:5000/uploads/user/natural-diamonds.png" },
    alt: "Natural Diamonds",
  },
  {
    id: "lab-grown-diamond",
    url: {
      uri: "http://192.168.1.75:5000/uploads/user/lab-grown-diamonds.png",
    },
    alt: "Lab-Grown Diamonds",
  },
  {
    id: "jewelry",
    url: { uri: "http://192.168.1.75:5000/uploads/user/jewelry.png" },
    alt: "Jewelry",
  },
  {
    id: "lab-grown-jewelry",
    url: { uri: "http://192.168.1.75:5000/uploads/user/lab-grown-jewelry.png" },
    alt: "Lab-Grown Jewelry",
  },
];

const categories = [
  {
    id: "natural-diamonds",
    name: "Natural Diamonds",
    icon: "diamond",
    color: "#1E3A8A",
    path: "/categories/natural-diamonds",
  },
  {
    id: "lab-grown-diamonds",
    name: "Lab-Grown Diamonds",
    icon: "science",
    color: "#3B82F6",
    path: "/categories/lab-grown-diamonds",
  },
  {
    id: "jewelry",
    name: "Jewelry",
    icon: "watch",
    color: "#8B5CF6",
    path: "/categories/jewelry",
  },
  {
    id: "lab-grown-jewelry",
    name: "Lab-Grown Jewelry",
    icon: "auto-awesome",
    color: "#EC4899",
    path: "/categories/lab-grown-jewelry",
  },
];

const SWIPE_THRESHOLD = 50;
const AUTO_SCROLL_INTERVAL = 5000;

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageLoading, setImageLoading] = useState({});
  const [pressedCategory, setPressedCategory] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const autoPlayRef = useRef(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const navigateToImage = useCallback(
    (direction) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const newIndex =
        direction === "next"
          ? (currentImageIndex + 1) % categoryImages.length
          : (currentImageIndex - 1 + categoryImages.length) %
            categoryImages.length;

      Animated.timing(slideAnim, {
        toValue: direction === "next" ? -screenWidth : screenWidth,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentImageIndex(newIndex);
        slideAnim.setValue(0);
      });
    },
    [currentImageIndex, slideAnim],
  );

  const goToImage = useCallback(
    (index) => {
      if (index === currentImageIndex) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const direction = index > currentImageIndex ? "next" : "prev";

      Animated.timing(slideAnim, {
        toValue: direction === "next" ? -screenWidth : screenWidth,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setCurrentImageIndex(index);
        slideAnim.setValue(0);
      });
    },
    [currentImageIndex, slideAnim],
  );

  // Auto-scroll carousel with pause on interaction
  useEffect(() => {
    if (!isAutoPlaying) return;

    autoPlayRef.current = setInterval(() => {
      navigateToImage("next");
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, navigateToImage]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10,
      onPanResponderGrant: () => {
        setIsAutoPlaying(false);
        slideAnim.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        slideAnim.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, vx } = gestureState;

        if (dx > SWIPE_THRESHOLD || vx > 0.5) {
          navigateToImage("prev");
        } else if (dx < -SWIPE_THRESHOLD || vx < -0.5) {
          navigateToImage("next");
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
        }

        // Resume auto-play after 3 seconds
        setTimeout(() => setIsAutoPlaying(true), 3000);
      },
    }),
  ).current;

  const handleCategoryPress = (category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log("Navigate to:", category.path);
  };

  const handleCategoryPressIn = (categoryId) => {
    setPressedCategory(categoryId);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handleCategoryPressOut = () => {
    setPressedCategory(null);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handleImageLoad = (index) => {
    setImageLoading((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageLoadStart = (index) => {
    setImageLoading((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Welcome to</Text>
          <Text style={styles.headerTitle}>GIW Diamonds</Text>
        </View>
        <Pressable
          style={styles.headerIcon}
          onPress={() => router.push("/profile")}
        >
          <MaterialIcons name="person" size={24} color="#0F172A" />
        </Pressable>
      </View>

      {/* Category Image Carousel with Swipe */}
      <View style={styles.carouselWrapper}>
        <View style={styles.carouselContainer} {...panResponder.panHandlers}>
          {categoryImages.map((image, index) => {
            const isCurrent = index === currentImageIndex;
            const isPrev =
              index ===
              (currentImageIndex - 1 + categoryImages.length) %
                categoryImages.length;
            const isNext =
              index === (currentImageIndex + 1) % categoryImages.length;

            if (!isCurrent && !isPrev && !isNext) return null;

            let translateX = 0;
            if (isCurrent) {
              translateX = slideAnim;
            } else if (isPrev) {
              translateX = Animated.add(
                slideAnim,
                new Animated.Value(-screenWidth),
              );
            } else if (isNext) {
              translateX = Animated.add(
                slideAnim,
                new Animated.Value(screenWidth),
              );
            }

            return (
              <Animated.View
                key={image.id}
                style={[
                  styles.carouselImageContainer,
                  {
                    transform: [{ translateX }],
                    opacity: isCurrent ? 1 : 0.5,
                    zIndex: isCurrent ? 2 : 1,
                  },
                ]}
              >
                {imageLoading[index] && (
                  <View style={styles.imageLoader}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                  </View>
                )}
                <Image
                  source={image.url}
                  style={styles.carouselImage}
                  resizeMode="cover"
                  onLoadStart={() => handleImageLoadStart(index)}
                  onLoad={() => handleImageLoad(index)}
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageAlt}>{image.alt}</Text>
                </View>
              </Animated.View>
            );
          })}

          {/* Swipe Hints */}
          <View style={styles.swipeHints} pointerEvents="none">
            <View style={styles.swipeHintLeft}>
              <MaterialIcons
                name="chevron-left"
                size={32}
                color="rgba(255,255,255,0.6)"
              />
            </View>
            <View style={styles.swipeHintRight}>
              <MaterialIcons
                name="chevron-right"
                size={32}
                color="rgba(255,255,255,0.6)"
              />
            </View>
          </View>
        </View>

        {/* Carousel Indicators */}
        <View style={styles.carouselIndicators}>
          {categoryImages.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => goToImage(index)}
              style={[
                styles.indicator,
                index === currentImageIndex && styles.activeIndicator,
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
            />
          ))}
        </View>
      </View>

      {/* Categories Section */}
      <View style={styles.categoriesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.sectionSubtitle}>Explore our collections</Text>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <Animated.View
              key={category.id}
              style={[
                {
                  transform: [
                    { scale: pressedCategory === category.id ? scaleAnim : 1 },
                  ],
                },
              ]}
            >
              <Pressable
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
                onPressIn={() => handleCategoryPressIn(category.id)}
                onPressOut={handleCategoryPressOut}
                android_ripple={{
                  color: `${category.color}20`,
                  foreground: true,
                }}
              >
                <LinearGradient
                  colors={[category.color, `${category.color}DD`]}
                  style={styles.categoryIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialIcons
                    name={category.icon}
                    size={28}
                    color="#FFFFFF"
                  />
                </LinearGradient>
                <Text style={styles.categoryName}>{category.name}</Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={16}
                  color="#94A3B8"
                  style={styles.categoryArrow}
                />
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Featured Section */}
      <View style={styles.featuredContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <Pressable style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#3B82F6" />
          </Pressable>
        </View>
        <View style={styles.featuredCard}>
          <View style={styles.featuredIcon}>
            <MaterialIcons name="stars" size={32} color="#F59E0B" />
          </View>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>Premium Collection</Text>
            <Text style={styles.featuredSubtitle}>
              Discover our exclusive diamonds
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerGreeting: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  // Carousel Styles
  carouselWrapper: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  carouselContainer: {
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
    position: "relative",
  },
  carouselImageContainer: {
    width: screenWidth - 32,
    height: 220,
    position: "absolute",
    borderRadius: 20,
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  imageLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
    zIndex: 1,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  imageAlt: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  swipeHints: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  swipeHintLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  swipeHintRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CBD5E1",
  },
  activeIndicator: {
    backgroundColor: "#3B82F6",
    width: 24,
    borderRadius: 4,
  },

  // Section Header Styles
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },

  // Categories Styles
  categoriesContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryCard: {
    width: (screenWidth - 56) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  categoryArrow: {
    marginLeft: 4,
  },

  // Featured Section Styles
  featuredContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  featuredCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  featuredSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
});

export default Home;
