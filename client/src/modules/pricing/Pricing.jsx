import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../services/api";
import notify from "../../utils/notifications.jsx";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  Building2,
  HelpCircle,
  ArrowRight,
  Star,
  Diamond,
  X,
  ShieldCheck,
  Globe,
  BadgeDollarSign,
  Package,
  Gem,
  Leaf,
} from "lucide-react";

const Pricing = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("USD");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [purchasingPlan, setPurchasingPlan] = useState(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  const exchangeRate = 83;

  const handleSelectOption = (planName, option) => {
    setSelectedOptions((prev) => {
      const current = prev[planName];
      // If clicking same option, unselect it
      if (current && current.id === option.id) {
        const { [planName]: _, ...rest } = prev;
        return rest;
      }
      // Otherwise select the new option
      return {
        ...prev,
        [planName]: option,
      };
    });
  };

  const handleBuyPlan = async (planName) => {
    const selectedOption = selectedOptions[planName];
    if (!selectedOption) {
      notify.warning("Select Duration", "Please select a duration option first");
      return;
    }

    try {
      setPurchasingPlan(planName);
      const response = await authAPI.purchaseSubscription(
        selectedOption.id,
        selectedOption.duration
      );

      if (response.success) {
        notify.success(
          "Success",
          `You have successfully purchased the ${planName} plan for ${selectedOption.durationLabel}!`
        );
      } else {
        notify.error("Error", response.message || "Failed to purchase subscription");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to purchase subscription. Please try again.";
      notify.error("Error", errorMessage);
    } finally {
      setPurchasingPlan(null);
    }
  };

  const handleLoginFirst = () => {
    notify.info("Login Required", "Please login first, then buy the plan");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  // Convert INR price from backend to USD if needed
  const getPrice = (inrPrice) => {
    if (!inrPrice) return 0;
    return currency === "USD" ? Math.round(inrPrice / exchangeRate) : inrPrice;
  };

  const getCurrencySymbol = () => {
    return currency === "USD" ? "$" : "₹";
  };

  // Check user subscription status and redirect if active
  useEffect(() => {
    const checkSubscription = async () => {
      if (isAuthenticated) {
        try {
          // Fetch fresh user data to get latest subscription status
          const userData = await authAPI.getCurrentUser();
          setUser(userData);

          // Redirect if subscription is active
          if (userData?.subscriptionStatus === "active") {
            notify.info("Active Subscription", "You already have an active subscription.");
            navigate("/user/home");
            return;
          }
        } catch (error) {
          console.error("Error fetching user subscription:", error);
        }
      }
      setCheckingSubscription(false);
    };

    checkSubscription();
  }, [isAuthenticated, navigate, setUser]);

  // Fetch subscriptions from backend
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getPublicSubscriptions();
      if (response.success) {
        setSubscriptions(response.subscriptions || []);
      } else {
        notify.error("Error", "Failed to fetch subscription plans");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      notify.error("Error", "Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping for plan types
  const getTypeIcon = (planName) => {
    const iconMap = {
      basic: Zap,
      silver: Sparkles,
      gold: Crown,
      pro: Diamond,
      enterprise: Building2,
    };
    return iconMap[planName?.toLowerCase()] || Diamond;
  };

  // Get plan type display info
  const getPlanTypeInfo = (sub) => {
    const types = [];
    if (sub.hasDiamonds) types.push({ label: "Diamonds", icon: Diamond, color: "from-blue-400 to-cyan-300" });
    if (sub.hasJewellery) types.push({ label: "Jewellery", icon: Gem, color: "from-amber-400 to-orange-300" });
    return types;
  };

  // Group subscriptions by plan name and map to pricing cards
  const getPlans = () => {
    if (subscriptions.length === 0) {
      // Fallback to default plans if no subscriptions
      return [
        {
          name: "Basic",
          icon: Zap,
          description:
            "Perfect for small diamond businesses and new dealers entering the marketplace.",
          planTypes: [{ label: "Diamonds", icon: Diamond, color: "from-blue-400 to-cyan-300" }],
          options: [
            { duration: 1, durationLabel: "1 Month", price: 29, id: 1 },
            { duration: 3, durationLabel: "3 Months", price: 79, id: 2 },
            { duration: 6, durationLabel: "6 Months", price: 149, id: 3 },
            { duration: 12, durationLabel: "12 Months", price: 279, id: 4 },
          ],
          features: [
            "Up to 50 stock items",
            "Email support",
            "Standard marketplace access",
          ],
          notIncluded: ["Priority support", "Advanced analytics"],
          popular: false,
          cta: isAuthenticated ? "Buy Plan" : "Get Started",
          ctaLink: isAuthenticated ? "#" : "/register",
          badge: "For Small Businesses",
        },
        {
          name: "Silver",
          icon: Sparkles,
          description:
            "Built for growing diamond trading teams that need advanced visibility.",
          planTypes: [
            { label: "Diamonds", icon: Diamond, color: "from-blue-400 to-cyan-300" },
            { label: "Jewellery", icon: Gem, color: "from-amber-400 to-orange-300" },
          ],
          options: [
            { duration: 1, durationLabel: "1 Month", price: 79, id: 5 },
            { duration: 3, durationLabel: "3 Months", price: 229, id: 6 },
            { duration: 6, durationLabel: "6 Months", price: 429, id: 7 },
            { duration: 12, durationLabel: "12 Months", price: 799, id: 8 },
          ],
          features: [
            "Up to 200 stock items",
            "Priority support",
            "Advanced analytics",
            "Full API access",
          ],
          notIncluded: ["Dedicated account manager"],
          popular: true,
          cta: isAuthenticated ? "Buy Plan" : "Start Free Trial",
          ctaLink: isAuthenticated ? "#" : "/register",
          badge: "Most Popular",
        },
        {
          name: "Gold",
          icon: Crown,
          description:
            "Enterprise-grade infrastructure for large diamond companies.",
          planTypes: [
            { label: "Diamonds", icon: Diamond, color: "from-blue-400 to-cyan-300" },
            { label: "Jewellery", icon: Gem, color: "from-amber-400 to-orange-300" },
          ],
          options: [
            { duration: 1, durationLabel: "1 Month", price: 199, id: 9 },
            { duration: 3, durationLabel: "3 Months", price: 579, id: 10 },
            { duration: 6, durationLabel: "6 Months", price: 1099, id: 11 },
            { duration: 12, durationLabel: "12 Months", price: 2099, id: 12 },
          ],
          features: [
            "Unlimited stock items",
            "24/7 phone & email support",
            "Unlimited storage",
            "Advanced API access",
            "Dedicated account manager",
          ],
          notIncluded: [],
          popular: false,
          cta: "Contact Sales",
          ctaLink: "/contact",
          badge: "For Enterprises",
        },
      ];
    }

    // Group active subscriptions by plan name
    const grouped = subscriptions
      .filter((sub) => sub.isActive !== false)
      .reduce((acc, sub) => {
        const name = sub.name?.toLowerCase();
        const planTypes = getPlanTypeInfo(sub);
        
        if (!acc[name]) {
          // Build features based on plan type
          const baseFeatures = [`${sub.stockLimit} stock items limit`];
          if (sub.hasDiamonds) baseFeatures.push("Diamond marketplace access");
          if (sub.hasJewellery) baseFeatures.push("Jewellery marketplace access");
          baseFeatures.push("Email support");
          
          acc[name] = {
            name: sub.name?.charAt(0).toUpperCase() + sub.name?.slice(1) || "Plan",
            icon: getTypeIcon(name),
            description: sub.description || `${sub.name?.charAt(0).toUpperCase() + sub.name?.slice(1) || "Subscription"} plan for diamond and jewellery trading.`,
            planTypes: planTypes,
            options: [],
            features: baseFeatures,
            notIncluded:
              name === "basic"
                ? ["Priority support", "Advanced analytics", "Dedicated account manager"]
                : name === "silver"
                  ? ["Dedicated account manager", "White-label options"]
                  : [],
            popular: name === "silver",
            cta: name === "gold" || name === "enterprise" ? "Contact Sales" : (isAuthenticated ? "Buy Plan" : "Get Started"),
            ctaLink: "/register",
            badge:
              name === "basic"
                ? "For Small Businesses"
                : name === "silver"
                  ? "Most Popular"
                  : name === "gold"
                    ? "For Enterprises"
                    : "Premium Plan",
          };
        }
        acc[name].options.push({
          duration: sub.durationMonth,
          durationLabel: `${sub.durationMonth} Month${sub.durationMonth > 1 ? "s" : ""}`,
          price: sub.price,
          stockLimit: sub.stockLimit,
          id: sub.id,
        });
        return acc;
      }, {});

    // Sort options by duration within each plan
    Object.values(grouped).forEach((plan) => {
      plan.options.sort((a, b) => a.duration - b.duration);
    });

    // Return sorted by tier (basic, silver, gold, then others)
    const order = ["basic", "silver", "gold", "enterprise", "pro", "premium"];
    return Object.values(grouped).sort((a, b) => {
      const aIndex = order.indexOf(a.name.toLowerCase());
      const bIndex = order.indexOf(b.name.toLowerCase());
      if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  };

  const plans = getPlans();

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  };

  // Floating animation for decorative elements
  const floatingAnimation = {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      {/* Header with Title and Toggles */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-br from-[#F1F5F9] via-white to-[#EFF6FF] py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={floatingAnimation}
            className="absolute top-10 left-[10%] opacity-20"
          >
            <Diamond className="h-16 w-16 text-[#3B82F6]" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -10, 10, 0],
              transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute top-20 right-[15%] opacity-15"
          >
            <Gem className="h-20 w-20 text-[#F59E0B]" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 8, -8, 0],
              transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
            }}
            className="absolute bottom-10 left-[20%] opacity-10"
          >
            <Sparkles className="h-12 w-12 text-[#1E3A8A]" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 15, 0],
              transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            }}
            className="absolute top-32 right-[8%] opacity-10"
          >
            <Crown className="h-14 w-14 text-[#1E3A8A]" />
          </motion.div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/20 bg-white/80 backdrop-blur-sm px-4 py-2 shadow-sm"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-[#3B82F6]" />
              </motion.div>
              <span className="text-sm font-semibold text-[#1E3A8A]">Premium Diamond Trading Plans</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold text-[#0F172A] tracking-tight"
            >
              Choose Your Perfect{" "}
              <span className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] bg-clip-text text-transparent">
                Plan
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 text-lg text-[#64748B] max-w-2xl leading-relaxed"
            >
              Flexible pricing for diamond and jewellery dealers. All plans include a{" "}
              <span className="font-semibold text-[#1E3A8A]">14-day free trial</span>.
            </motion.p>

            {/* Currency Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10"
            >
              <div className="inline-flex items-center gap-1 rounded-2xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg shadow-[#1E3A8A]/5">
                {["USD", "INR"].map((curr, idx) => (
                  <motion.button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                      currency === curr
                        ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md"
                        : "text-[#64748B] hover:text-[#1E3A8A] hover:bg-[#F1F5F9]"
                    }`}
                  >
                    {curr} ({curr === "USD" ? "$" : "₹"})
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Pricing Cards */}
      <section className="relative bg-gradient-to-b from-[#F1F5F9] to-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading || checkingSubscription ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-[30px] border border-[#E2E8F0] bg-white p-8 shadow-lg"
                >
                  <div className="animate-pulse space-y-6">
                    <div className="h-4 w-24 rounded-lg bg-[#E2E8F0]" />
                    <div className="h-14 w-14 rounded-2xl bg-[#E2E8F0]" />
                    <div className="h-8 w-32 rounded-lg bg-[#E2E8F0]" />
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-12 rounded-xl bg-[#F1F5F9]" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              {plans.map((plan) => {
                const Icon = plan.icon;

                return (
                  <motion.div
                    key={plan.name}
                    variants={fadeInUp}
                    whileHover={{
                      y: -12,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    className={`group relative rounded-[30px] border transition-all duration-500 ${
                      plan.popular
                        ? "border-[#3B82F6]/30 bg-gradient-to-b from-[#1E3A8A] to-[#2563EB] text-white shadow-[0_25px_80px_rgba(30,58,138,0.25)] md:-mt-6 md:mb-6"
                        : "border-[#E2E8F0] bg-white shadow-[0_15px_50px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_60px_rgba(30,58,138,0.15)] hover:border-[#3B82F6]/30"
                    }`}
                  >
                    {/* Glow Effect for Popular Plan */}
                    {plan.popular && (
                      <div className="absolute -inset-px rounded-[30px] bg-gradient-to-b from-[#60A5FA]/20 to-transparent blur-xl opacity-50" />
                    )}
                    {/* Hover Glow for Non-Popular */}
                    {!plan.popular && (
                      <div className="absolute -inset-px rounded-[30px] bg-gradient-to-b from-[#3B82F6]/10 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                    )}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
                        <motion.span
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#1E3A8A] shadow-lg"
                        >
                          <Star className="h-4 w-4 fill-current" />
                          Most Popular
                        </motion.span>
                      </div>
                    )}

                    <div className="relative overflow-hidden rounded-[30px] p-8">
                      {!plan.popular && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#EFF6FF] via-white to-[#F8FAFC] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      )}

                      <div className="relative z-10">
                        <div className="mb-6">
                          <div
                            className={`mb-4 inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${
                              plan.popular
                                ? "bg-white/15 text-[#DBEAFE]"
                                : "bg-[#DBEAFE] text-[#1E3A8A]"
                            }`}
                          >
                            {plan.badge}
                          </div>

                          <motion.div
                            whileHover={{ rotate: 6, scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${
                              plan.popular
                                ? "bg-white/15"
                                : "bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] group-hover:from-[#DBEAFE] group-hover:to-[#BFDBFE]"
                            }`}
                          >
                            <Icon
                              className={`h-7 w-7 ${
                                plan.popular ? "text-white" : "text-[#1E3A8A]"
                              }`}
                            />
                          </motion.div>

                          <h3
                            className={`text-2xl font-bold ${
                              plan.popular ? "text-white" : "text-[#0F172A]"
                            }`}
                          >
                            {plan.name}
                          </h3>

                          <p
                            className={`mt-2 text-sm leading-6 ${
                              plan.popular
                                ? "text-[#DBEAFE]/90"
                                : "text-[#64748B]"
                            }`}
                          >
                            {plan.description}
                          </p>

                          {/* Plan Type Badges */}
                          {plan.planTypes && plan.planTypes.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {plan.planTypes.map((type, idx) => {
                                const TypeIcon = type.icon;
                                return (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                      plan.popular
                                        ? "bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm"
                                        : "bg-gradient-to-r from-[#DBEAFE] to-[#BFDBFE] text-[#1E3A8A] ring-1 ring-[#3B82F6]/20"
                                    }`}
                                  >
                                    <span className={`flex h-5 w-5 items-center justify-center rounded-md ${
                                      plan.popular
                                        ? "bg-white/20"
                                        : "bg-[#3B82F6]/15"
                                    }`}>
                                      <TypeIcon className={`h-3 w-3 ${
                                        plan.popular
                                          ? "text-white"
                                          : "text-[#2563EB]"
                                      }`} />
                                    </span>
                                    <span>{type.label}</span>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Multiple Duration Options */}
                        <div className="mt-8">
                          <p
                            className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${
                              plan.popular ? "text-[#93C5FD]" : "text-[#1E3A8A]"
                            }`}
                          >
                            Choose duration
                          </p>
                          <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                              hidden: {},
                              visible: { transition: { staggerChildren: 0.08 } },
                            }}
                            className="space-y-2"
                          >
                            {plan.options?.map((option, idx) => {
                              const price = getPrice(option.price);
                              const isSelected = selectedOptions[plan.name]?.id === option.id;
                              return (
                                <motion.div
                                  key={option.id}
                                  onClick={() => handleSelectOption(plan.name, option)}
                                  variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    visible: { opacity: 1, x: 0 },
                                  }}
                                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                                  whileHover={{
                                    scale: 1.02,
                                    x: 4,
                                    transition: { type: "spring", stiffness: 400 },
                                  }}
                                  className={`group/duration flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition-all duration-300 ${
                                    isSelected
                                      ? plan.popular
                                        ? "border-white bg-white/30 shadow-lg"
                                        : "border-[#3B82F6] bg-[#DBEAFE] shadow-md"
                                      : plan.popular
                                        ? "border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30"
                                        : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#3B82F6]/40 hover:bg-[#EFF6FF] hover:shadow-md"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <motion.div
                                      initial={false}
                                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                                        isSelected
                                          ? plan.popular
                                            ? "border-white bg-white"
                                            : "border-[#3B82F6] bg-[#3B82F6]"
                                          : plan.popular
                                            ? "border-white/40 group-hover/duration:border-white"
                                            : "border-[#CBD5E1] group-hover/duration:border-[#3B82F6]"
                                      }`}
                                    >
                                      <motion.div
                                        initial={false}
                                        animate={{ scale: isSelected ? 1 : 0 }}
                                        className={`h-2.5 w-2.5 rounded-full ${
                                          isSelected
                                            ? plan.popular
                                              ? "bg-[#1E3A8A]"
                                              : "bg-white"
                                            : plan.popular
                                              ? "bg-white"
                                              : "bg-[#3B82F6]"
                                        }`}
                                      />
                                    </motion.div>
                                    <span
                                      className={`text-sm font-medium ${
                                        plan.popular
                                          ? "text-white"
                                          : "text-[#0F172A]"
                                      }`}
                                    >
                                      {option.durationLabel}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span
                                      className={`text-sm ${
                                        plan.popular
                                          ? "text-[#93C5FD]"
                                          : "text-[#64748B]"
                                      }`}
                                    >
                                      {getCurrencySymbol()}
                                    </span>
                                    <motion.span
                                      whileHover={{ scale: 1.1 }}
                                      className={`text-lg font-bold ${
                                        plan.popular
                                          ? "text-white"
                                          : "text-[#0F172A]"
                                      }`}
                                    >
                                      {price.toLocaleString()}
                                    </motion.span>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        </div>

                        <div className="mt-8">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {plan.cta === "Buy Plan" ? (
                              <button
                                onClick={() => handleBuyPlan(plan.name)}
                                disabled={purchasingPlan === plan.name}
                                className={`group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                  plan.popular
                                    ? "bg-white text-[#1E3A8A] shadow-lg hover:bg-[#F8FAFC] hover:shadow-xl"
                                    : "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-[#1E3A8A]/25 hover:shadow-xl hover:shadow-[#1E3A8A]/30"
                                }`}
                              >
                                <span className="relative z-10">{purchasingPlan === plan.name ? "Processing..." : plan.cta}</span>
                                <motion.span
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="relative z-10"
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </motion.span>
                                {/* Shine effect on hover */}
                                <motion.div
                                  initial={{ x: "-100%" }}
                                  whileHover={{ x: "100%" }}
                                  transition={{ duration: 0.6 }}
                                  className={`absolute inset-0 ${
                                    plan.popular
                                      ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                      : "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                  }`}
                                />
                              </button>
                            ) : plan.cta === "Contact Sales" ? (
                              <Link
                                to={plan.ctaLink}
                                className={`group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300 ${
                                  plan.popular
                                    ? "bg-white text-[#1E3A8A] shadow-lg hover:bg-[#F8FAFC] hover:shadow-xl"
                                    : "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-[#1E3A8A]/25 hover:shadow-xl hover:shadow-[#1E3A8A]/30"
                                }`}
                              >
                                <span className="relative z-10">{plan.cta}</span>
                                <motion.span
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="relative z-10"
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </motion.span>
                                {/* Shine effect on hover */}
                                <motion.div
                                  initial={{ x: "-100%" }}
                                  whileHover={{ x: "100%" }}
                                  transition={{ duration: 0.6 }}
                                  className={`absolute inset-0 ${
                                    plan.popular
                                      ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                      : "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                  }`}
                                />
                              </Link>
                            ) : (
                              <button
                                onClick={handleLoginFirst}
                                className={`group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300 ${
                                  plan.popular
                                    ? "bg-white text-[#1E3A8A] shadow-lg hover:bg-[#F8FAFC] hover:shadow-xl"
                                    : "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-[#1E3A8A]/25 hover:shadow-xl hover:shadow-[#1E3A8A]/30"
                                }`}
                              >
                                <span className="relative z-10">{plan.cta}</span>
                                <motion.span
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="relative z-10"
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </motion.span>
                                {/* Shine effect on hover */}
                                <motion.div
                                  initial={{ x: "-100%" }}
                                  whileHover={{ x: "100%" }}
                                  transition={{ duration: 0.6 }}
                                  className={`absolute inset-0 ${
                                    plan.popular
                                      ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                      : "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                  }`}
                                />
                              </button>
                            )}
                          </motion.div>
                        </div>

                        <div
                          className={`mt-8 border-t pt-6 ${
                            plan.popular
                              ? "border-white/15"
                              : "border-[#E2E8F0]"
                          }`}
                        >
                          <p
                            className={`mb-4 text-xs font-semibold uppercase tracking-[0.18em] ${
                              plan.popular ? "text-[#93C5FD]" : "text-[#1E3A8A]"
                            }`}
                          >
                            Included features
                          </p>

                          <motion.ul
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                              hidden: {},
                              visible: { transition: { staggerChildren: 0.05 } },
                            }}
                            className="space-y-3"
                          >
                            {plan.features.map((feature, idx) => (
                              <motion.li
                                key={feature}
                                variants={{
                                  hidden: { opacity: 0, x: -10 },
                                  visible: { opacity: 1, x: 0 },
                                }}
                                transition={{ duration: 0.3, delay: idx * 0.03 }}
                                whileHover={{ x: 4 }}
                                className="group/feature flex items-start gap-3 cursor-default"
                              >
                                <motion.span
                                  whileHover={{ scale: 1.2, rotate: 10 }}
                                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                                    plan.popular
                                      ? "bg-white/15 group-hover/feature:bg-white/25"
                                      : "bg-[#DBEAFE] group-hover/feature:bg-[#3B82F6]"
                                  }`}
                                >
                                  <Check
                                    className={`h-3.5 w-3.5 transition-colors ${
                                      plan.popular
                                        ? "text-white"
                                        : "text-[#2563EB] group-hover/feature:text-white"
                                    }`}
                                  />
                                </motion.span>
                                <span
                                  className={`text-sm transition-colors ${
                                    plan.popular
                                      ? "text-white/90 group-hover/feature:text-white"
                                      : "text-[#475569] group-hover/feature:text-[#0F172A]"
                                  }`}
                                >
                                  {feature}
                                </span>
                              </motion.li>
                            ))}
                          </motion.ul>

                          {plan.notIncluded.length > 0 && (
                            <>
                              <div
                                className={`my-6 border-t ${
                                  plan.popular
                                    ? "border-white/15"
                                    : "border-[#E2E8F0]"
                                }`}
                              />
                              <p
                                className={`mb-4 text-xs font-semibold uppercase tracking-[0.18em] ${
                                  plan.popular
                                    ? "text-[#93C5FD]/80"
                                    : "text-[#94A3B8]"
                                }`}
                              >
                                Not included
                              </p>

                              <motion.ul
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                  hidden: {},
                                  visible: { transition: { staggerChildren: 0.05 } },
                                }}
                                className="space-y-3"
                              >
                                {plan.notIncluded.map((item, idx) => (
                                  <motion.li
                                    key={item}
                                    variants={{
                                      hidden: { opacity: 0, x: -10 },
                                      visible: { opacity: 1, x: 0 },
                                    }}
                                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                                    className="flex items-start gap-3"
                                  >
                                    <span
                                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                                        plan.popular
                                          ? "bg-white/10"
                                          : "bg-[#EFF6FF]"
                                      }`}
                                    >
                                      <X
                                        className={`h-3.5 w-3.5 ${
                                          plan.popular
                                            ? "text-[#BFDBFE]"
                                            : "text-[#93C5FD]"
                                        }`}
                                      />
                                    </span>
                                    <span
                                      className={`text-sm ${
                                        plan.popular
                                          ? "text-[#93C5FD]/80"
                                          : "text-[#94A3B8]"
                                      }`}
                                    >
                                      {item}
                                    </span>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Pricing;
