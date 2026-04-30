import app from "./app.js";
import { initRateCron, runImmediateFetch } from "./cron/rateCron.js";
import { rateService } from "./modules/rates/rate.service.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);

  // Initialize rate fetching cron job
  initRateCron();

  // Seed initial rates if DB is empty (ensures UI shows data even if APIs fail)
  try {
    await rateService.seedInitialRates();
  } catch (error) {
    console.warn("Initial rate seeding failed:", error.message);
  }

  // Run immediate fetch on startup to get fresh data from APIs
  // This updates the seeded values with real data if APIs are available
  try {
    await runImmediateFetch();
  } catch (error) {
    console.warn(
      "Initial rate fetch failed (will retry on schedule):",
      error.message,
    );
  }
});
