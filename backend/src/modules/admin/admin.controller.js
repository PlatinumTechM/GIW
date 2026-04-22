import * as adminService from "./admin.service.js";

export const verifyAdminPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const result = await adminService.verifyAdminPassword(password);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error at verifyAdminPassword = ", error);
    res.status(401).json({
      success: false,
      message: error.message || "Password verification failed",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error at getAllUsers = ", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all subscriptions
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await adminService.getSubscriptions();
    res.status(200).json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    console.error("Error at getSubscriptions = ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch subscriptions",
    });
  }
};

// Get only active subscriptions (for public pricing page)
const getActiveSubscriptions = async (req, res) => {
  try {
    const subscriptions = await adminService.getActiveSubscriptions();
    res.status(200).json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    console.error("Error at getActiveSubscriptions = ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch subscriptions",
    });
  }
};

// Create subscription
export const createSubscription = async (req, res) => {
  try {
    const {
      name,
      durationMonth,
      price,
      stockLimit,
      hasDiamonds,
      hasJewellery,
      description,
    } = req.body;

    if (
      !name ||
      !durationMonth ||
      price === undefined ||
      stockLimit === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, durationMonth, price, stockLimit",
      });
    }

    const subscription = await adminService.createSubscription({
      name,
      durationMonth: parseInt(durationMonth),
      price: parseFloat(price),
      stockLimit: parseInt(stockLimit),
      hasDiamonds: hasDiamonds === true || hasDiamonds === "true",
      hasJewellery: hasJewellery === true || hasJewellery === "true",
      description: description || null,
    });

    res.status(201).json({
      success: true,
      subscription,
      message: "Subscription plan created successfully",
    });
  } catch (error) {
    console.error("Error at createSubscription = ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create subscription",
    });
  }
};

// Update subscription
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      durationMonth,
      price,
      stockLimit,
      hasDiamonds,
      hasJewellery,
      description,
      isActive,
    } = req.body;

    if (
      !name ||
      !durationMonth ||
      price === undefined ||
      stockLimit === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, durationMonth, price, stockLimit",
      });
    }

    const subscription = await adminService.updateSubscription(id, {
      name,
      durationMonth: parseInt(durationMonth),
      price: parseFloat(price),
      stockLimit: parseInt(stockLimit),
      hasDiamonds: hasDiamonds === true || hasDiamonds === "true",
      hasJewellery: hasJewellery === true || hasJewellery === "true",
      description: description || null,
      isActive,
    });

    res.status(200).json({
      success: true,
      subscription,
      message: "Subscription plan updated successfully",
    });
  } catch (error) {
    console.error("Error at updateSubscription = ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update subscription",
    });
  }
};

// Delete subscription
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    await adminService.deleteSubscription(id);
    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    console.error("Error at deleteSubscription = ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete subscription",
    });
  }
};

// Get all subscription buyers
export const getSubscriptionBuyers = async (req, res) => {
  try {
    const buyers = await adminService.getSubscriptionBuyers();
    res.status(200).json({
      success: true,
      buyers,
    });
  } catch (error) {
    console.error("Error at getSubscriptionBuyers = ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch subscription buyers",
    });
  }
};

// Update user plan (admin only)
export const updateUserPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { planId, durationMonths } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await adminService.updateUserPlan(userId, planId, durationMonths);

    res.status(200).json({
      success: true,
      message: planId ? "User plan updated successfully" : "User plan removed successfully",
      subscription: result.subscription,
      user: result.user,
    });
  } catch (error) {
    console.error("Error at updateUserPlan = ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update user plan",
    });
  }
};
