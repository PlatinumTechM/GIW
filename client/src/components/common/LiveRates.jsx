import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { rateAPI } from "@/services/api";

/**
 * Format time difference for display
 * @param {Date|string} date
 * @returns {string}
 */
const formatTimeAgo = (date) => {
  if (!date) return "Unknown";

  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

/**
 * Format rate value with proper currency
 * @param {string} type
 * @param {number} value
 * @returns {string}
 */
const formatRateValue = (type, value) => {
  if (value === null || value === undefined) return "--";

  if (type === "usd") {
    return `₹${value.toFixed(2)}`;
  }
  if (type === "gold") {
    return `₹${Math.round(value).toLocaleString()}`;
  }
  if (type === "silver") {
    return `₹${Math.round(value).toLocaleString()}`;
  }
  return value.toString();
};

/**
 * Rate Item Component - Desktop
 */
const RateItem = ({ type, rate, icon: Icon }) => {
  const change = rate?.change ?? 0;
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0 || change === null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-lg border border-gray-100/50">
      <Icon className="w-4 h-4 text-[#2e7c9e]" />
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          {type === "usd" ? "USD" : type === "gold" ? "GOLD" : "SILVER"}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-[#0F172A]">
            {formatRateValue(type, rate?.value)}
          </span>
          {isPositive && (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          )}
          {isNegative && <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
          {isNeutral && <Minus className="w-3.5 h-3.5 text-gray-400" />}
        </div>
      </div>
    </div>
  );
};

/**
 * LiveRates Header Widget
 * Compact display for navbar integration
 */
const LiveRates = () => {
  const [rates, setRates] = useState({
    usd: null,
    gold: null,
    silver: null,
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await rateAPI.getRates();

      if (response.success) {
        setRates({
          usd: response.data.usd,
          gold: response.data.gold,
          silver: response.data.silver,
        });

        // Determine the most recent update time
        const timestamps = [
          response.data.usd?.updated_at,
          response.data.gold?.updated_at,
        ].filter(Boolean);

        if (timestamps.length > 0) {
          const latest = new Date(
            Math.max(...timestamps.map((t) => new Date(t))),
          );
          setLastUpdated(latest);

          // Check if data is stale (older than 1 hour)
          const now = new Date();
          const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
          setIsStale(latest < oneHourAgo);
        }

        setError(null);
      }
    } catch (err) {
      console.error("Error fetching rates:", err);
      setError("Failed to load rates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchRates();

    // Refresh every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);

    // Refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchRates();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Skeleton loaders
  if (loading && !rates.usd && !rates.gold) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className="hidden md:flex items-center gap-2">
          <div className="h-8 w-20 bg-gray-200/50 rounded-lg animate-pulse" />
          <div className="h-8 w-20 bg-gray-200/50 rounded-lg animate-pulse" />
        </div>
        {/* Mobile skeleton */}
        <div className="flex md:hidden items-center gap-2">
          <div className="h-7 w-16 bg-gray-200/50 rounded-lg animate-pulse" />
          <div className="h-7 w-16 bg-gray-200/50 rounded-lg animate-pulse" />
        </div>
      </>
    );
  }

  // Show cached data even on error
  const showUsd = rates.usd?.value !== null && rates.usd?.value !== undefined;
  const showGold =
    rates.gold?.value !== null && rates.gold?.value !== undefined;

  if (!showUsd && !showGold) {
    return null; // Don't show anything if no data available
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex flex-col items-end">
        <div className="flex items-center gap-2">
          {showUsd && (
            <RateItem type="usd" rate={rates.usd} icon={DollarSign} />
          )}
          {showGold && (
            <RateItem type="gold" rate={rates.gold} icon={TrendingUp} />
          )}
        </div>
        {lastUpdated && (
          <span
            className={`text-[9px] font-medium mt-1 ${
              isStale ? "text-amber-500" : "text-gray-400"
            }`}
          >
            Updated {formatTimeAgo(lastUpdated)}
            {isStale && " (stale)"}
          </span>
        )}
      </div>

      {/* Mobile View - Compact */}
      <div className="flex md:hidden items-center gap-2">
        {showUsd && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded-md border border-gray-100">
            <DollarSign className="w-3.5 h-3.5 text-[#2e7c9e]" />
            <span className="text-xs font-bold text-[#0F172A]">
              {formatRateValue("usd", rates.usd?.value)}
            </span>
          </div>
        )}
        {showGold && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded-md border border-gray-100">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-bold text-[#0F172A]">
              {formatRateValue("gold", rates.gold?.value)}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default LiveRates;
