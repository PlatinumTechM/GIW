import jwt from "jsonwebtoken";
import * as authRepo from "./auth.repo.js";

export const login = async (identifier, password) => {
  // Check if identifier is email or phone
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let user;

  // Normalize identifier to lowercase before checking regex
  const normalizedIdentifier = identifier.toLowerCase().trim();

  if (emailRegex.test(normalizedIdentifier)) {
    user = await authRepo.findUserByEmail(normalizedIdentifier);
  } else {
    // Treat as phone number
    user = await authRepo.findUserByPhone(identifier);
  }

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is active
  if (!user.is_active) {
    throw new Error("Account is inactive. Please contact admin.");
  }

  const cleanInput = String(password).trim();
  const cleanDB = String(user.password).trim();
  if (cleanInput !== cleanDB) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "7d",
    },
  );

  // Fetch user with subscription info
  const userWithSubscription = await authRepo.findUserWithSubscription(user.id);

  // Check if subscription plan has expired
  if (userWithSubscription.plan_expiry && userWithSubscription.subscription_status === 'active') {
    const expiryDate = new Date(userWithSubscription.plan_expiry);
    const currentDate = new Date();
    if (expiryDate < currentDate) {
      throw new Error("Your subscription plan has expired. Please renew to continue.");
    }
  }

  // Determine redirect URL based on role
  const userRole = userWithSubscription.role || "Buyer";
  let redirectUrl = "/user/home";
  if (userRole === "Seller") {
    redirectUrl = "/user/add-stock";
  } else if (userRole === "admin") {
    redirectUrl = "/admin";
  }

  return {
    token,
    redirectUrl,
    user: {
      id: userWithSubscription.id,
      name: userWithSubscription.name,
      email: userWithSubscription.email,
      company: userWithSubscription.company,
      phone: userWithSubscription.phone,
      address: userWithSubscription.address,
      gst: userWithSubscription.gst,
      role: userRole,
      isActive: userWithSubscription.is_active,
      planName: userWithSubscription.plan_name,
      planHasShareLink: userWithSubscription.plan_has_share_link,
      planExpiry: userWithSubscription.plan_expiry,
      subscriptionStatus: userWithSubscription.subscription_status,
      type: userWithSubscription.type,
      usedStock: parseInt(userWithSubscription.used_stock || 0),
      stockLimit: parseInt(userWithSubscription.stock_limit || 0),
    },
  };
};

export const register = async (userData) => {
  const {
    name,
    email,
    company,
    phone,
    address,
    city,
    country,
    gst,
    password,
    confirmPassword,
    document,
    type,
    role,
  } = userData;

  // Validation
  if (!name || !email || !phone || !password) {
    throw new Error("Name, email, phone, and password are required");
  }

  // For Seller, company, address, and gst are required
  if (role === "Seller" && (!company || !address || !gst)) {
    throw new Error("Company, address, and GST are required for Seller");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await authRepo.findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const newUser = await authRepo.createUser({
    name: name.toUpperCase(),
    email: email.toLowerCase(),
    company: company.toUpperCase(),
    phone,
    address: address.toUpperCase(),
    city: city ? city.toLowerCase() : "",
    country: country ? country.toLowerCase() : "",
    gst: gst.toUpperCase(),
    password,
    document,
    type,
    role: role || "Buyer",
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    company: newUser.company,
    phone: newUser.phone,
    address: newUser.address,
    gst: newUser.gst,
    document: newUser.document,
    role: newUser.role || "user",
    type: newUser.type,
    createdAt: newUser.created_at,
  };
};

export const getCurrentUser = async (userId) => {
  const user = await authRepo.findUserWithSubscription(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company,
    phone: user.phone,
    address: user.address,
    gst: user.gst,
    document: user.document,
    role: user.role || "user",
    isActive: user.is_active,
    planName: user.plan_name,
    planHasShareLink: user.plan_has_share_link,
    planExpiry: user.plan_expiry,
    subscriptionStatus: user.subscription_status,
    type: user.type,
    usedStock: parseInt(user.used_stock || 0),
    stockLimit: parseInt(user.stock_limit || 0),
  };
};

export const updateProfile = async (userId, userData) => {
  const { name, company, phone, address, gst, type } = userData;

  // Validation
  if (!name || !company || !phone || !address || !gst) {
    throw new Error("All fields are required");
  }

  // Phone validation
  const phoneRegex = /^[\d\s\-+()]{10,20}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error("Please enter a valid mobile number with at least 10 digits");
  }

  const updatedUser = await authRepo.updateUser(userId, {
    name: name.toUpperCase(),
    company: company.toUpperCase(),
    phone: phone.toUpperCase(),
    address: address.toUpperCase(),
    gst: gst.toUpperCase(),
    type,
  });

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    company: updatedUser.company,
    phone: updatedUser.phone,
    address: updatedUser.address,
    gst: updatedUser.gst,
    document: updatedUser.document,
    role: updatedUser.role || "user",
    isActive: updatedUser.is_active,
    type: updatedUser.type,
  };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await authRepo.findUserByIdWithPassword(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const cleanInput = String(currentPassword).trim();
  const cleanDB = String(user.password).trim();
  if (cleanInput !== cleanDB) {
    throw new Error("Invalid current password");
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters");
  }

  await authRepo.updatePassword(userId, newPassword);
  return true;
};

export const purchaseSubscription = async (userId, planId, durationMonths) => {
  if (!planId || !durationMonths) {
    throw new Error("Plan ID and duration are required");
  }

  const subscription = await authRepo.createUserSubscription(userId, planId, durationMonths);

  return {
    id: subscription.id,
    userId: subscription.user_id,
    planId: subscription.plan_id,
    startDate: subscription.start_date,
    endDate: subscription.end_date,
    status: subscription.status,
    createdAt: subscription.created_at,
  };
};
