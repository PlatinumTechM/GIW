import * as shareApiService from "./share-api.service.js";

export const createApiKey = async (req, res) => {
  try {
    const userId = req.user.id;
    const apiKey = await shareApiService.createApiKey(userId, req.body);

    res.status(201).json({
      success: true,
      data: apiKey,
    });
  } catch (error) {
    console.error("Error creating API key:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create API key",
      error: error.detail || error.message
    });
  }
};

export const getMyApiKeys = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const { keys, total } = await shareApiService.getUserApiKeys(userId, page, limit);

    res.status(200).json({
      success: true,
      data: keys,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch API keys",
    });
  }
};

export const getStockByToken = async (req, res) => {
  try {
    // The apiKey is already validated and attached by authenticateHeader middleware
    const apiKey = req.apiKey;
    
    // We can also use req.user if needed (e.g. for audit logs)
    
    const data = await shareApiService.getStockByApiKey(apiKey, req.query);

    res.status(200).json({
      success: true,
      data: data.stocks,
      pagination: data.pagination
    });
  } catch (error) {
    console.error("Error fetching stock via API token:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch stock data",
    });
  }
};

export const toggleApiKeyStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { isActive } = req.body;

    const apiKey = await shareApiService.toggleApiKeyStatus(id, userId, isActive);

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: "API key not found or you don't have permission",
      });
    }

    res.status(200).json({
      success: true,
      message: `API key ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: apiKey,
    });
  } catch (error) {
    console.error("Error toggling API key status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle API key status",
    });
  }
};
