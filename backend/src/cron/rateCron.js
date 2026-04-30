import cron from "node-cron";
import { rateService } from "../modules/rates/rate.service.js";

// Flag to prevent overlapping executions
let isRunning = false;

/**
 * Initialize the rate fetching cron job
 * Runs every hour at minute 0
 */
export const initRateCron = () => {
  // Run every hour: "0 * * * *"
  // For testing, you can use "*/5 * * * * *" (every 5 seconds)
  const schedule = process.env.NODE_ENV === "development" && process.env.RATE_CRON_TEST === "true"
    ? "*/5 * * * * *"  // Every 5 seconds for testing
    : "0 * * * *";      // Every hour in production

  console.log(`📅 Rate Cron: Scheduling rate fetch job (${process.env.NODE_ENV === "development" && process.env.RATE_CRON_TEST === "true" ? "every 5 seconds (TEST)" : "every hour"})`);

  cron.schedule(schedule, async () => {
    if (isRunning) {
      console.log("⏭️ Rate Cron: Previous job still running, skipping...");
      return;
    }

    isRunning = true;
    console.log("🔄 Rate Cron: Starting scheduled rate fetch...");

    try {
      const results = await rateService.fetchAndStoreRates();
      const updatedTypes = Object.keys(results);

      if (updatedTypes.length > 0) {
        console.log(`✅ Rate Cron: Successfully updated rates for: ${updatedTypes.join(", ")}`);
      } else {
        console.warn("⚠️ Rate Cron: No rates were updated (API failures)");
      }
    } catch (error) {
      console.error("❌ Rate Cron: Error during rate fetch:", error.message);
    } finally {
      isRunning = false;
    }
  });

  console.log("✅ Rate Cron: Job scheduled successfully");
};

/**
 * Run an immediate rate fetch (useful for initial seeding)
 */
export const runImmediateFetch = async () => {
  console.log("🚀 Rate Cron: Running immediate rate fetch...");

  try {
    const results = await rateService.fetchAndStoreRates();
    const updatedTypes = Object.keys(results);

    if (updatedTypes.length > 0) {
      console.log(`✅ Rate Cron: Immediate fetch successful for: ${updatedTypes.join(", ")}`);
    } else {
      console.warn("⚠️ Rate Cron: Immediate fetch - no rates updated");
    }

    return results;
  } catch (error) {
    console.error("❌ Rate Cron: Immediate fetch failed:", error.message);
    throw error;
  }
};

export default { initRateCron, runImmediateFetch };
