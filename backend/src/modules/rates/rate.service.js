import axios from "axios";
import { rateRepo } from "./rate.repo.js";

// Mock data mode - set USE_MOCK_RATES=true to avoid API calls
const USE_MOCK_RATES = process.env.USE_MOCK_RATES === "true";

// Mock rate values for development/testing without API calls
const MOCK_RATES = {
  usd: 83.5,
  gold: 7250,
  silver: 85,
};

// API sources for fetching rates
const EXTERNAL_APIS = {
  // Using exchangerate-api.com for USD/INR (free tier available)
  usd: async () => {
    // Primary: exchangerate-api
    try {
      const response = await axios.get(
        // "https://api.exchangerate-api.com/v4/latest/USD",
        "https://v6.exchangerate-api.com/v6/48c8e535cf927c0f74422bd0/latest/USD",
        { timeout: 10000 },
      );
      if (response.data && response.data.rates && response.data.rates.INR) {
        return parseFloat(response.data.rates.INR);
      }
    } catch (error) {
      console.warn("Primary USD API failed, trying fallback...");
    }

    // Fallback: using fawazahmed0's free API
    try {
      const response = await axios.get(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
        { timeout: 10000 },
      );
      if (response.data && response.data.inr) {
        return parseFloat(response.data.inr);
      }
    } catch (error) {
      console.error("All USD APIs failed:", error.message);
    }

    return null;
  },

  // Gold rate - using USD/INR conversion with approximate gold price
  gold: async () => {
    // Gold price in USD per ounce (approximate market rate)
    // In production, replace with a reliable gold API
    const GOLD_USD_PER_OUNCE = 2400; // Approximate current gold price
    const GRAMS_PER_OUNCE = 31.1035;

    try {
      // Get current USD/INR rate
      const usdRate = await EXTERNAL_APIS.usd();
      if (!usdRate) {
        console.warn("Cannot fetch gold rate: USD rate unavailable");
        return null;
      }

      // Convert USD per ounce to INR per gram
      const pricePerGramINR = (GOLD_USD_PER_OUNCE * usdRate) / GRAMS_PER_OUNCE;
      const roundedPrice = Math.round(pricePerGramINR * 100) / 100;

      console.log(
        `Gold calculated: $${GOLD_USD_PER_OUNCE}/oz * ₹${usdRate} / ${GRAMS_PER_OUNCE}g = ₹${roundedPrice}/g`,
      );

      return roundedPrice;
    } catch (error) {
      console.error("Gold rate calculation failed:", error.message);
    }

    return null;
  },

  // Silver rate (optional - extensible design)
  silver: async () => {
    try {
      const silverResponse = await axios.get(
        "https://api.gold-api.com/price/XAG",
        { timeout: 10000 },
      );

      if (silverResponse.data && silverResponse.data.price) {
        const usdRate = await EXTERNAL_APIS.usd();
        if (!usdRate) return null;

        // Convert USD per ounce to INR per gram
        const pricePerOunceUSD = parseFloat(silverResponse.data.price);
        const pricePerGramINR = (pricePerOunceUSD * usdRate) / 31.1035;

        return Math.round(pricePerGramINR * 100) / 100;
      }
    } catch (error) {
      console.warn("Silver API failed:", error.message);
    }

    return null;
  },
};

export const rateService = {
  /**
   * Fetch and store rates for all types
   * Updates existing records instead of inserting new ones
   * Uses mock data if USE_MOCK_RATES=true to avoid API rate limits
   */
  async fetchAndStoreRates() {
    const types = ["usd", "gold"]; // Add 'silver' if needed
    const results = {};

    if (USE_MOCK_RATES) {
      console.log("🧪 MOCK MODE: Using static rates (no API calls)");
    }

    for (const type of types) {
      try {
        // Fetch from external API or use mock data
        const value = USE_MOCK_RATES
          ? MOCK_RATES[type]
          : await EXTERNAL_APIS[type]();

        if (value === null) {
          console.warn(`Failed to fetch ${type} rate`);
          continue;
        }

        // Get current rate to calculate change
        const currentRate = await rateRepo.getLatestRate(type);
        let changeValue = null;

        if (currentRate) {
          changeValue = parseFloat(
            (value - parseFloat(currentRate.value)).toFixed(4),
          );
        }

        // Upsert rate (update if exists, insert if not)
        const updatedRate = await rateRepo.upsertRate({
          type,
          value,
          change_value: changeValue,
        });

        results[type] = updatedRate;
        const changeStr =
          changeValue !== null
            ? `(${changeValue >= 0 ? "+" : ""}${changeValue})`
            : "(new)";
        const mockLabel = USE_MOCK_RATES ? " [MOCK]" : "";
        console.log(
          `✅ ${type.toUpperCase()} rate updated${mockLabel}: ₹${value} ${changeStr}`,
        );
      } catch (error) {
        console.error(`Error fetching ${type} rate:`, error.message);
      }
    }

    return results;
  },

  /**
   * Get current rates for all types
   */
  async getCurrentRates() {
    const latestRates = await rateRepo.getAllLatestRates();

    // Format response
    const formatted = {
      usd: null,
      gold: null,
      silver: null,
    };

    for (const rate of latestRates) {
      formatted[rate.type] = {
        value: parseFloat(rate.value),
        change:
          rate.change_value !== null ? parseFloat(rate.change_value) : null,
        updated_at: rate.updated_at,
      };
    }

    return formatted;
  },

  /**
   * Get rate history for a specific type
   */
  async getRateHistory(type, limit = 24) {
    const history = await rateRepo.getRateHistory(type, limit);
    return history.map((rate) => ({
      id: rate.id,
      value: parseFloat(rate.value),
      change: rate.change_value !== null ? parseFloat(rate.change_value) : null,
      updated_at: rate.updated_at,
    }));
  },

  /**
   * Manual refresh (for admin use)
   */
  async manualRefresh() {
    return await this.fetchAndStoreRates();
  },

  /**
   * Seed initial rates if none exist (for first-time setup)
   * Uses approximate default values to ensure UI shows something
   */
  async seedInitialRates() {
    const existingRates = await rateRepo.getAllLatestRates();
    if (existingRates.length > 0) {
      console.log("✅ Rates already seeded, skipping...");
      return;
    }

    console.log("🌱 Seeding initial rates...");

    // Default approximate values - will be updated by cron job
    const defaults = [
      { type: "usd", value: 83.5 },
      { type: "gold", value: 7250 },
      { type: "silver", value: 85 },
    ];

    for (const { type, value } of defaults) {
      try {
        await rateRepo.upsertRate({
          type,
          value,
          change_value: null,
        });
        console.log(
          `✅ ${type.toUpperCase()} seeded with default value: ₹${value}`,
        );
      } catch (error) {
        console.error(`❌ Failed to seed ${type}:`, error.message);
      }
    }
  },
};

export default rateService;
