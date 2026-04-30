import * as jewellryService from "./jewellry.service.js";

export const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const sortBy = req.query.sortBy || "created_at DESC";
    const ensureArray = (name) => {
      const val = req.query[name] || req.query[`${name}[]`];
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    };

    const filters = {
      userId: req.user.id,
      categories: ensureArray('categories'),
      materials: ensureArray('materials'),
      shapes: ensureArray('shapes'),
      colors: ensureArray('colors'),
      clarities: ensureArray('clarities'),
      status: req.query.status,
      diamond_type: req.query.diamond_type,
      weight: req.query.weight,
      diamond_weight: req.query.diamond_weight,
      totalWeightFrom: req.query.totalWeightFrom,
      totalWeightTo: req.query.totalWeightTo,
      priceFrom: req.query.priceFrom,
      priceTo: req.query.priceTo,
      stock_id: req.query.stock_id,
      search: req.query.search
    };

    const result = await jewellryService.getAllJewellry(page, limit, sortBy, filters);
    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const item = await jewellryService.getJewellryById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Jewellry not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const data = { ...req.body, user_id: req.user.id };
    const newItem = await jewellryService.createJewellry(data);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updatedItem = await jewellryService.updateJewellry(req.params.id, req.body);
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Jewellry not found" });
    }
    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const deletedItem = await jewellryService.deleteJewellry(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Jewellry not found" });
    }
    res.status(200).json({ success: true, message: "Jewellry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFilters = async (req, res) => {
  try {
    const filters = await jewellryService.getFilterOptions(req.user.id);
    res.status(200).json({ success: true, data: filters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public storefront endpoints (no auth required)
const buildPublicFilters = (req, typeFilter) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const sortBy = req.query.sortBy || "created_at DESC";
  const ensureArray = (name) => {
    const val = req.query[name] || req.query[`${name}[]`];
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  return {
    page, limit, sortBy,
    filters: {
      categories: ensureArray('categories'),
      materials: ensureArray('materials'),
      shapes: ensureArray('shapes'),
      colors: ensureArray('colors'),
      clarities: ensureArray('clarities'),
      status: req.query.status,
      typeFilter,
      weight: req.query.weight,
      diamond_weight: req.query.diamond_weight,
      totalWeightFrom: req.query.totalWeightFrom,
      totalWeightTo: req.query.totalWeightTo,
      priceFrom: req.query.priceFrom,
      priceTo: req.query.priceTo,
      stock_id: req.query.stock_id,
      search: req.query.search
    }
  };
};

export const getAllNaturalPublic = async (req, res) => {
  try {
    const { page, limit, sortBy, filters } = buildPublicFilters(req, "natural");
    const result = await jewellryService.getAllJewellry(page, limit, sortBy, filters);
    res.status(200).json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllLabGrownPublic = async (req, res) => {
  try {
    const { page, limit, sortBy, filters } = buildPublicFilters(req, "lab-grown");
    const result = await jewellryService.getAllJewellry(page, limit, sortBy, filters);
    res.status(200).json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getByIdPublic = async (req, res) => {
  try {
    const item = await jewellryService.getJewellryById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Jewellry not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFiltersPublic = async (req, res) => {
  try {
    const filters = await jewellryService.getPublicFilterOptions();
    res.status(200).json({ success: true, data: filters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkUpload = async (req, res) => {
  try {
    const { stock } = req.body;
    const userId = req.user.id;

    if (!stock || !Array.isArray(stock) || stock.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No stock data provided or invalid format",
      });
    }

    const result = await jewellryService.bulkUpload(stock, userId);
    res.status(201).json({
      success: true,
      message: `Successfully processed ${result.insertedCount + result.updatedCount} items`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
