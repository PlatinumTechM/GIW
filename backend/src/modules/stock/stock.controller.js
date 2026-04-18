import * as stockService from "./stock.service.js";

export const bulkUpload = async (req, res) => {
  try {
    const { stock, type } = req.body;

    const userId = req.user?.id || null;

    if (!stock || !Array.isArray(stock) || stock.length === 0) {
      return res.status(400).json({
        success: false,

        message: "No stock data provided or invalid format",
      });
    }

    const result = await stockService.bulkUpload(stock, userId, type);

    res.status(201).json({
      success: true,

      message: `Successfully uploaded ${result.insertedCount} stock items`,

      data: result,
    });
  } catch (error) {
    console.error("Error at bulkUpload = ", error);

    res.status(500).json({
      success: false,

      message: error.message || "Failed to upload stock data",
    });
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      stockId,
      certificate,
      status,
      shape,
      weight,
      minWeight,
      maxWeight,
      color,
      cut,
      clarity,
      lab,
      minPricePerCarat,
      maxPricePerCarat,
      growthType,
      search,
      sortBy,
      sortOrder,
    } = req.query;

    const filters = {
      stockId,
      certificate,
      status,
      shape,
      weight,
      minWeight: minWeight ? parseFloat(minWeight) : null,
      maxWeight: maxWeight ? parseFloat(maxWeight) : null,
      color,
      cut,
      clarity,
      lab,
      minPricePerCarat: minPricePerCarat ? parseFloat(minPricePerCarat) : null,
      maxPricePerCarat: maxPricePerCarat ? parseFloat(maxPricePerCarat) : null,
      growthType,
      search,
      sortBy: sortBy || "created_at",
      sortOrder: sortOrder || "DESC",
    };

    const result = await stockService.getAllStocks(
      parseInt(page),
      parseInt(limit),
      filters,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error at getAllStocks = ", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStockById = async (req, res) => {
  try {
    const { id } = req.params;

    const stock = await stockService.getStockById(id);

    res.status(200).json({
      success: true,

      data: stock,
    });
  } catch (error) {
    console.error("Error at getStockById = ", error);

    res.status(error.message === "Stock not found" ? 404 : 500).json({
      success: false,

      message: error.message,
    });
  }
};

export const createStock = async (req, res) => {
  try {
    const stockData = req.body;

    const userId = req.user?.id || null;

    const result = await stockService.createStock(stockData, userId);

    res.status(201).json({
      success: true,

      message: "Stock created successfully",

      data: result,
    });
  } catch (error) {
    console.error("Error at createStock = ", error);

    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;

    const stockData = req.body;

    const result = await stockService.updateStock(id, stockData);

    res.status(200).json({
      success: true,

      message: "Stock updated successfully",

      data: result,
    });
  } catch (error) {
    console.error("Error at updateStock = ", error);

    res.status(error.message === "Stock not found" ? 404 : 400).json({
      success: false,

      message: error.message,
    });
  }
};

export const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;

    await stockService.deleteStock(id);

    res.status(200).json({
      success: true,

      message: "Stock deleted successfully",
    });
  } catch (error) {
    console.error("Error at deleteStock = ", error);

    res.status(error.message === "Stock not found" ? 404 : 500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getFieldMapping = async (req, res) => {
  try {
    const mapping = stockService.getFieldMapping();

    res.status(200).json({
      success: true,

      data: mapping,
    });
  } catch (error) {
    console.error("Error at getFieldMapping = ", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getMyStocks = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const {
      page = 1,
      limit = 50,
      stockId,
      certificate,
      status,
      shape,
      minWeight,
      maxWeight,
      color,
      cut,
      clarity,
      lab,
      minPricePerCarat,
      maxPricePerCarat,
      growthType,
      search,
      sortBy,
      sortOrder,
    } = req.query;

    const filters = {
      stockId,
      certificate,
      status,
      shape,
      minWeight: minWeight ? parseFloat(minWeight) : null,
      maxWeight: maxWeight ? parseFloat(maxWeight) : null,
      color,
      cut,
      clarity,
      lab,
      minPricePerCarat: minPricePerCarat ? parseFloat(minPricePerCarat) : null,
      maxPricePerCarat: maxPricePerCarat ? parseFloat(maxPricePerCarat) : null,
      growthType,
      search,
      sortBy: sortBy || "created_at",
      sortOrder: sortOrder || "DESC",
    };

    const result = await stockService.getStocksByUserId(
      userId,
      parseInt(page),
      parseInt(limit),
      filters,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error at getMyStocks = ", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch your stock",
    });
  }
};

export const getFilterOptions = async (req, res) => {
  try {
    const result = await stockService.getFilterOptions();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error at getFilterOptions = ", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch filter options",
    });
  }
};