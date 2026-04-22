import jwt from "jsonwebtoken";
import { authRepo } from "./auth.repo.js";

const login = async (identifier, password) => {
  // Check if identifier is email or phone
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let user;

  if (emailRegex.test(identifier)) {
    user = await authRepo.findUserByEmail(identifier);
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

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      address: user.address,
      gst: user.gst,
      role: user.role || "user",
      isActive: user.is_active,
    },
  };
};

const register = async (userData) => {
  const {
    name,
    email,
    company,
    phone,
    address,
    gst,
    password,
    confirmPassword,
    document,
  } = userData;

  // Validation
  if (!name || !email || !company || !phone || !address || !gst || !password) {
    throw new Error("All fields are required");
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
    gst: gst.toUpperCase(),
    password,
    document,
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
    createdAt: newUser.created_at,
  };
};

const getCurrentUser = async (userId) => {
  const user = await authRepo.findUserById(userId);

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
  };
};

const updateProfile = async (userId, userData) => {
  const { name, company, phone, address, gst } = userData;

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
  };
};

export const authService = {
  login,
  register,
  getCurrentUser,
  updateProfile,
};
