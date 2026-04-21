import * as shareService from "./share.service.js";

// POST /share/create - Create new share link
export const createShareLink = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Please login" });
    }

    const result = await shareService.generateShareLink(userId, req.body);

    // Build full URL
    const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";

    res.status(201).json({
      success: true,
      data: { ...result, shareUrl: `${baseUrl}/share/${result.token}` },
    });
  } catch (error) {
    console.error("Share error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /share/data/:token - Get shared stock (public)
export const getSharedData = async (req, res) => {
  try {
    // Get pagination from query params
    const { page = 1, limit = 50 } = req.query;
    const result = await shareService.getSharedStockData(req.params.token, { page, limit });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Share data error:", error);
    const isExpired = error.message?.includes("expired") || error.message?.includes("revoked");
    res.status(isExpired ? 410 : 500).json({
      success: false,
      message: error.message,
      expired: isExpired,
    });
  }
};
