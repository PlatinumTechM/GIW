import { adminService } from "./admin.service.js";

const verifyAdminPassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }
    
    const result = await adminService.verifyAdminPassword(password);
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error at verifyAdminPassword = ", error);
    res.status(401).json({
      success: false,
      message: error.message || "Password verification failed"
    });
  }
};

const getAllUsers = async (req, res) => {
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

export const adminController = {
  verifyAdminPassword,
  getAllUsers
};
