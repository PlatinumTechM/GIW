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
  }));
};

// Get all subscriptions
export const getSubscriptions = async () => {
  const subscriptions = await adminRepo.getSubscriptions();
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
    throw new Error(
      "At least one plan type (Diamonds or Jewellery) must be selected",
    );
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
