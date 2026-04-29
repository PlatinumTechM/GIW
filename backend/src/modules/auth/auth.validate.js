export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email/Mobile and password are required" });
  }
  // Check if email or phone format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-+()]{10,20}$/;
  if (!emailRegex.test(email) && !phoneRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email or mobile number format" });
  }
  next();
};

export const validateRegister = (req, res, next) => {
  const { name, email, company, phone, address, gst, password, confirmPassword, role } = req.body;
  
  // Check all required fields
  // company, address, gst are optional for Buyer
  const requiredFields = { name, email, phone, password, confirmPassword };
  const missingFields = Object.entries(requiredFields)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  
  // For Seller, company, address, and gst are required
  if (role === "Seller") {
    const sellerRequiredFields = { company, address, gst };
    const missingSellerFields = Object.entries(sellerRequiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);
    missingFields.push(...missingSellerFields);
  }
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      success: false,
      error: `Missing required fields: ${missingFields.join(", ")}` 
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      error: "Password must be at least 6 characters" 
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: "Invalid email format" 
    });
  }
  
  // Phone validation (basic)
  const phoneRegex = /^[\d\s\-+()]{10,20}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      success: false,
      error: "Please enter a valid mobile number with at least 10 digits" 
    });
  }
  
  next();
};
