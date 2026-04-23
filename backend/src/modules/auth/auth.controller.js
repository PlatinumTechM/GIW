import * as authService from "./auth.service.js";

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const result = await authService.login(email, password);

    // Set session duration: 30 days if rememberMe, otherwise 7 days
    const sessionDays = rememberMe ? 30 : 7;
    const maxAge = sessionDays * 24 * 60 * 60 * 1000;

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
      expires: new Date(Date.now() + maxAge),
      path: "/",
    });

    res.status(200).json({ token: result.token, user: result.user });
  } catch (error) {
    console.error("Error at login = ", error);
    res.status(401).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      phone,
      address,
      gst,
      password,
      confirmPassword
    } = req.body;
    
    // Get document full path if file was uploaded
    const document = req.file ? `/uploads/documents/${req.file.filename}` : null;

    const result = await authService.register({
      name,
      email,
      company,
      phone,
      address,
      gst,
      password,
      confirmPassword,
      document
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error) {
    console.error("Error at register = ", error);
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await authService.getCurrentUser(userId);
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error at getCurrentUser = ", error);
    
    if (error.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, company, phone, address, gst } = req.body;

    const updatedUser = await authService.updateProfile(userId, {
      name,
      company,
      phone,
      address,
      gst,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error at updateProfile = ", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the httpOnly cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error at logout = ", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const purchaseSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId, durationMonths } = req.body;

    if (!planId || !durationMonths) {
      return res.status(400).json({
        success: false,
        message: "Plan ID and duration months are required",
      });
    }

    const subscription = await authService.purchaseSubscription(userId, planId, durationMonths);

    res.status(201).json({
      success: true,
      message: "Subscription purchased successfully",
      subscription,
    });
  } catch (error) {
    console.error("Error at purchaseSubscription = ", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to purchase subscription",
    });
  }
};
