import app from "./app.js";
import { initRateCron, runImmediateFetch } from "./cron/rateCron.js";
import { rateService } from "./modules/rates/rate.service.js";

const PORT = process.env.PORT || 5000;

// Rate fetching configuration
// Set USE_MOCK_RATES=true to use static mock data (no API calls)
// This avoids hitting API rate limits during development/testing
const USE_MOCK_RATES = process.env.USE_MOCK_RATES === "true";
const ENABLE_RATE_CRON = process.env.ENABLE_RATE_CRON !== "false"; // Default: enabled

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);

  if (USE_MOCK_RATES) {
    console.log(
      "🧪 MOCK MODE: Rates will use static values (no external API calls)",
    );
  }

  // Initialize rate fetching cron job (unless explicitly disabled)
  if (ENABLE_RATE_CRON) {
    initRateCron();
  } else {
    console.log("⏸️ Rate cron job disabled (ENABLE_RATE_CRON=false)");
  }

  // Seed initial rates if DB is empty (ensures UI shows data even if APIs fail)
  try {
    await rateService.seedInitialRates();
  } catch (error) {
    console.warn("Initial rate seeding failed:", error.message);
  }

  // Run immediate fetch on startup to get fresh data from APIs
  // Uses mock data if USE_MOCK_RATES=true
  if (ENABLE_RATE_CRON) {
    try {
      await runImmediateFetch();
    } catch (error) {
      console.warn(
        "Initial rate fetch failed (will retry on schedule):",
        error.message,
      );
    }
  }
});
