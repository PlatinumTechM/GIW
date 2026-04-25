import * as shareApiRepo from "./share-api.repo.js";
import crypto from "crypto";

// Generate a random authorized token
const generateApiToken = () => {
  return "GIW_" + crypto.randomBytes(24).toString("hex");
};

export const createApiKey = async (userId, data) => {
  const apiToken = generateApiToken();
  
  const apiKey = await shareApiRepo.createShareApiKey({
    userId,
    ...data,
    apiToken,
  });

  return apiKey;
};

export const getUserApiKeys = async (userId, page, limit) => {
  return await shareApiRepo.getShareApiKeysByUserId(userId, page, limit);
};

export const getStockByApiKey = async (apiKey, queryParams) => {
  return await shareApiRepo.getStockForApiKey(apiKey, queryParams);
};

export const getStockByToken = async (token, queryParams) => {
  const apiKey = await shareApiRepo.getShareApiKeyByToken(token);
  
  if (!apiKey) {
    throw new Error("Invalid API token");
  }

  if (!apiKey.is_active) {
    throw new Error("This API token has been disabled");
  }

  return await getStockByApiKey(apiKey, queryParams);
};

export const toggleApiKeyStatus = async (id, userId, isActive) => {
  return await shareApiRepo.updateShareApiKeyStatus(id, userId, isActive);
};
