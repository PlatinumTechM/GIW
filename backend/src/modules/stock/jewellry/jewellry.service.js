import * as jewellryRepo from "./jewellry.repo.js";

export const getAllJewellry = async (page, limit, sortBy, filters) => {
  return await jewellryRepo.getAll(page, limit, sortBy, filters);
};

export const getJewellryById = async (id) => {
  return await jewellryRepo.getById(id);
};

export const createJewellry = async (data) => {
  // Add some basic validation or formatting if needed
  if (!data.stock_id) {
    data.stock_id = `JW-${Date.now()}`;
  }
  return await jewellryRepo.create(data);
};

export const updateJewellry = async (id, data) => {
  return await jewellryRepo.update(id, data);
};

export const deleteJewellry = async (id) => {
  return await jewellryRepo.deleteById(id);
};

export const getFilterOptions = async (userId) => {
  return await jewellryRepo.getFilterOptions(userId);
};

export const getPublicFilterOptions = async () => {
  return await jewellryRepo.getPublicFilterOptions();
};
