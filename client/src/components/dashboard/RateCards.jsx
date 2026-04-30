import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
} from "lucide-react";
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
 * Format rate value with proper currency and formatting
 * @param {string} type
 * @param {number} value
 * @returns {string}
 */
const formatRateValue = (type, value) => {
  if (value === null || value === undefined) return "--";

  if (type === "usd") {
    return `₹${value.toFixed(2)}`;
  }
  if (type === "gold" || type === "silver") {
    return `₹${Math.round(value).toLocaleString()}`;
  }
  return value.toString();
};

/**
 * Individual Rate Card Component
 */
const RateCard = ({ type, rate, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const change = rate?.change ?? 0;
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0 || change === null;

  const typeConfig = {
    usd: {
      title: "Dollar Rate",
      subtitle: "USD/INR",
      icon: DollarSign,
      color: "from-blue-500/10 to-blue-600/5",
      iconColor: "text-blue-600",
    },
    gold: {
      title: "Gold Rate",
      subtitle: "24K per gram",
      icon: TrendingUp,
      color: "from-amber-500/10 to-amber-600/5",
      iconColor: "text-amber-600",
    },
    silver: {
      title: "Silver Rate",
      subtitle: "per gram",
      icon: TrendingUp,
      color: "from-gray-500/10 to-gray-600/5",
      iconColor: "text-gray-600",
    },
  };

  const config = typeConfig[type] || typeConfig.usd;
  const Icon = config.icon;

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Gradient background */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${config.color} opacity-50`}
      />

      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center ${config.iconColor}`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                {config.title}
              </h3>
              <p className="text-xs text-gray-500">{config.subtitle}</p>
            </div>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Refresh rate"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-400 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0F172A]">
              {formatRateValue(type, rate?.value)}
            </span>
          </div>

          {/* Change indicator */}
          <div className="flex items-center gap-2 mt-2">
            {isPositive && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                <TrendingUp className="w-3 h-3" />+{change.toFixed(2)}
              </span>
            )}
            {isNegative && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">
                <TrendingDown className="w-3 h-3" />
                {change.toFixed(2)}
              </span>
            )}
            {isNeutral && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-bold">
                <Minus className="w-3 h-3" />
                0.00
              </span>
            )}

            {/* Stale indicator */}
            {rate?.isStale && (
              <span className="text-[10px] text-amber-500 font-medium">
                (Data may be outdated)
              </span>
            )}
          </div>
        </div>

        {/* Last updated */}
        <div className="mt-4 pt-3 border-t border-gray-50">
          <p className="text-[10px] text-gray-400 font-medium">
            Last updated {formatTimeAgo(rate?.updated_at)}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * RateCards Dashboard Component
 * Display USD and Gold rates as dashboard cards
 */
const RateCards = () => {
  const [rates, setRates] = useState({
    usd: null,
    gold: null,
    silver: null,
  });
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
    fetchRates();

    // Refresh every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !rates.usd && !rates.gold) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const showUsd = rates.usd?.value !== null && rates.usd?.value !== undefined;
  const showGold =
    rates.gold?.value !== null && rates.gold?.value !== undefined;

  if (!showUsd && !showGold) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {showUsd && (
        <RateCard type="usd" rate={rates.usd} onRefresh={fetchRates} />
      )}
      {showGold && (
        <RateCard type="gold" rate={rates.gold} onRefresh={fetchRates} />
      )}
    </div>
  );
};

export default RateCards;
