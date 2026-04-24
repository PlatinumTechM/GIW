import * as shareApiRepo from "../modules/share/share-api/share-api.repo.js";
import { findUserById } from "../modules/auth/auth.repo.js";

/**
 * Middleware to authenticate requests using an API token from headers
 * Checks for token validity, duplication (ensuring it's a unique valid token),
 * and verifies user status before granting access.
 */
export const authenticateHeader = async (req, res, next) => {
  try {
    let token = req.headers["x-share-api-token"];
    // Also check Authorization header for Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    // Check query parameter as fallback (if needed, though user asked for Header)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "API token is required in headers (x-share-api-token or Bearer token)",
      });
    }

    const apiKeyData = await shareApiRepo.getShareApiKeyByToken(token);

    if (!apiKeyData) {
      return res.status(401).json({
        success: false,
        message: "Invalid API token",
      });
    }

    // Check if the API token itself is active
    if (!apiKeyData.is_active) {
      return res.status(403).json({
        success: false,
        message: "This API token has been disabled. Please contact the API provider.",
      });
    }

    // Check if the user ID associated with this token exists and is active
    const user = await findUserById(apiKeyData.user_id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token not found",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive. Stock access denied.",
      });
    }

    // Attach both apiKey data and user data to the request object
    req.apiKey = apiKeyData;
    req.user = user;

    next();
  } catch (error) {
    console.error("AuthenticateHeader Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during header authentication",
      error: error.message
    });
  }
};
