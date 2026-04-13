export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  next();
};

export const validateRegister = (req, res, next) => {
  const { name, email, company, phone, address, gst, password, confirmPassword } = req.body;
  
  // Check all required fields
  const requiredFields = { name, email, company, phone, address, gst, password, confirmPassword };
  const missingFields = Object.entries(requiredFields)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  
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
      error: "Invalid phone number format" 
    });
  }
  
  next();
};
