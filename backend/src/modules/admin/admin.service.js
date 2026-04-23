import * as adminRepo from "./admin.repo.js";

// Verify admin password
export const verifyAdminPassword = async (password) => {
  const admin = await adminRepo.verifyAdmin(password);
  if (!admin) {
    throw new Error("Invalid admin password");
  }
  return {
    success: true,
    message: "Password verified successfully",
  };
};

// Get all users
export const getAllUsers = async () => {
  const users = await adminRepo.getAllUsers();
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company,
    phone: user.phone,
    address: user.address,
    gst: user.gst,
    document: user.document,
    password: user.password,
    role: user.role || "user",
    isActive: user.is_active,
    createdAt: user.created_at,
    planName: user.plan_name,
    planExpiry: user.plan_expiry,
    subscriptionStatus: user.subscription_status,
    stockCount: parseInt(user.stock_count || 0),
    stockLimit: parseInt(user.stock_limit || 0),
  }));
};

// Get all subscriptions
export const getSubscriptions = async () => {
  const subscriptions = await adminRepo.getSubscriptions();
  return subscriptions;
};

// Get only active subscriptions (for public pricing page)
export const getActiveSubscriptions = async () => {
  const subscriptions = await adminRepo.getActiveSubscriptions();
  return subscriptions;
};

const VALID_DURATIONS = [1, 3, 6, 12];

// Validate duration
export const validateDuration = (duration) => {
  if (!VALID_DURATIONS.includes(parseInt(duration))) {
    throw new Error(
      `Duration must be one of: ${VALID_DURATIONS.join(", ")} months`,
    );
  }
};

// Validate price and stock limit
export const validatePricingData = (price, stockLimit) => {
  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  if (stockLimit < 0) {
    throw new Error("Stock limit cannot be negative");
  }
};

// Validate plan type (at least one must be selected)
export const validatePlanType = (hasDiamonds, hasJewellery) => {
  if (!hasDiamonds && !hasJewellery) {
    throw new Error("At least one plan type (Diamonds or Jewellery) must be selected");
  }
};

// Create subscription
export const createSubscription = async (data) => {
  validateDuration(data.durationMonth);
  validatePricingData(data.price, data.stockLimit);
  validatePlanType(data.hasDiamonds, data.hasJewellery);
  const subscription = await adminRepo.createSubscription(data);
  return subscription;
};

// Update subscription
export const updateSubscription = async (id, data) => {
  validateDuration(data.durationMonth);
  validatePricingData(data.price, data.stockLimit);
  validatePlanType(data.hasDiamonds, data.hasJewellery);
  const subscription = await adminRepo.updateSubscription(id, data);
  return subscription;
};

// Delete subscription
export const deleteSubscription = async (id) => {
  await adminRepo.deleteSubscription(id);
  return { success: true };
};

// Get all subscription buyers
export const getSubscriptionBuyers = async () => {
  const buyers = await adminRepo.getSubscriptionBuyers();
  return buyers.map((buyer) => ({
    subscriptionId: buyer.subscription_id,
    userId: buyer.user_id,
    planId: buyer.plan_id,
    startDate: buyer.start_date,
    endDate: buyer.end_date,
    status: buyer.status,
    purchaseDate: buyer.purchase_date,
    userName: buyer.user_name,
    userEmail: buyer.user_email,
    userCompany: buyer.user_company,
    userPhone: buyer.user_phone,
    planName: buyer.plan_name,
    durationMonth: buyer.duration_month,
    price: parseFloat(buyer.price),
  }));
};

// Update user plan (admin only)
export const updateUserPlan = async (userId, planId, durationMonths) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Validate duration if planId is provided
  if (planId && !VALID_DURATIONS.includes(parseInt(durationMonths))) {
    throw new Error(`Duration must be one of: ${VALID_DURATIONS.join(", ")} months`);
  }

  const subscription = await adminRepo.updateUserPlan(userId, planId, durationMonths);

  // Get updated user data with plan info
  const users = await adminRepo.getAllUsers();
  const updatedUser = users.find((u) => u.id === parseInt(userId));

  return {
    subscription,
    user: updatedUser ? {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      planName: updatedUser.plan_name,
      planExpiry: updatedUser.plan_expiry,
      subscriptionStatus: updatedUser.subscription_status,
    } : null,
  };
};

// Update user status (active/inactive)
export const updateUserStatus = async (userId, isActive) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  return await adminRepo.updateUserStatus(userId, isActive);
};
