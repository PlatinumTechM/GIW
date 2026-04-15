import { adminRepo } from "./admin.repo.js";

// Verify admin password
const verifyAdminPassword = async (password) => {
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
const getAllUsers = async () => {
  const users = await adminRepo.getAllUsers();
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company,
    phone: user.phone,
    address: user.address,
    gst: user.gst,
    document: user.document,
    password: user.password,
    role: user.role || 'user',
    isActive: user.is_active,
    createdAt: user.created_at,
  }));
};

export const adminService = {
  verifyAdminPassword,
  getAllUsers
};

