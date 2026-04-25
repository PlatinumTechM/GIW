export const validateCreateNotification = (req, res, next) => {
  const { title, message, type } = req.body;



  if (!title || !message) {
    return res.status(400).json({
      success: false,
      error: "Title and message are required",
    });
  }

  if (title.length > 150) {
    return res.status(400).json({
      success: false,
      error: "Title must not exceed 150 characters",
    });
  }

  const allowedTypes = ["natural-diamonds", "lab-grown-diamonds", "jewelry", "lab-grown-jewelry"];
  if (type && !allowedTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      error: "Invalid type. Allowed types: natural-diamonds, lab-grown-diamonds, jewelry, lab-grown-jewelry",
    });
  }

  next();
};

export const validateUpdateNotification = (req, res, next) => {
  const { title, message, type } = req.body;

  if (!title || !message) {
    return res.status(400).json({
      success: false,
      error: "Title and message are required",
    });
  }

  if (title.length > 150) {
    return res.status(400).json({
      success: false,
      error: "Title must not exceed 150 characters",
    });
  }

  const allowedTypes = ["natural-diamonds", "lab-grown-diamonds", "jewelry", "lab-grown-jewelry"];
  if (type && !allowedTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      error: "Invalid type. Allowed types: natural-diamonds, lab-grown-diamonds, jewelry, lab-grown-jewelry",
    });
  }

  next();
};
