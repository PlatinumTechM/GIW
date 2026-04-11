import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import ShowStock from "./ShowStock";

const shapes = [
  { name: "Round", icon: "M12 2L4 8L12 22L20 8L12 2Z" },
  { name: "Oval", icon: "M12 2C6.5 2 2 6 2 12s4.5 10 10 10 10-4 10-10S17.5 2 12 2z" },
  { name: "Pear", icon: "M12 2C8 2 6 6 6 10c0 5 6 14 6 14s6-9 6-14c0-4-2-8-6-8z" },
  { name: "Cushion Mod", icon: "M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { name: "Cush Brill", icon: "M5 5h14l3 3-3 3H5l-3-3 3-3z" },
  { name: "Emerald", icon: "M4 6h16v12H4V6z" },
  { name: "Radiant", icon: "M6 4h12l4 4-4 4-6 8-6-8-4-4 4-4z" },
  { name: "Princess", icon: "M4 4h16l-8 16L4 4z" },
  { name: "Asscher", icon: "M6 6h12v12H6V6z" },
  { name: "Square", icon: "M4 4h16v16H4V4z" },
  { name: "Marquise", icon: "M12 2c-6 0-10 5-10 10 0 6 4 12 10 12s10-6 10-12c0-5-4-10-10-10z" },
  { name: "Heart", icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" },
];

const NaturalDiamond = () => {
  const [activeTab, setActiveTab] = useState("Single Stone");
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [showOnlyMedia, setShowOnlyMedia] = useState(false);
  const [availableItems, setAvailableItems] = useState(false);
  const [caratMin, setCaratMin] = useState("");
  const [caratMax, setCaratMax] = useState("");

  const toggleShape = (shape) => {
    if (selectedShapes.includes(shape)) {
      setSelectedShapes(selectedShapes.filter((s) => s !== shape));
    } else {
      setSelectedShapes([...selectedShapes, shape]);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-primary)">
      {/* Header */}
      <div className="bg-(--accent-primary) text-white pt-20 pb-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">Natural Diamonds</h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6">
            {["Single Stone", "Pair", "Parcel"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-white text-white"
                    : "border-transparent text-white/60 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
            <button className="ml-auto p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 space-y-4">
            {/* Show Only */}
            <div className="card p-4">
              <h3 className="font-semibold text-[--text-primary] mb-3">Show only</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyMedia}
                    onChange={(e) => setShowOnlyMedia(e.target.checked)}
                    className="w-4 h-4 rounded border-(--border) text-(--accent-primary) focus:ring-(--accent-primary)"
                  />
                  <span className="text-sm text-(--text-secondary)">Items With Media</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availableItems}
                    onChange={(e) => setAvailableItems(e.target.checked)}
                    className="w-4 h-4 rounded border-(--border) text-(--accent-primary) focus:ring-(--accent-primary)"
                  />
                  <span className="text-sm text-(--text-secondary)">Available Items</span>
                </label>
              </div>
            </div>

            {/* Shape Filter */}
            <div className="card p-4">
              <h3 className="font-semibold text-[--text-primary] mb-3">Shape</h3>
              <div className="grid grid-cols-3 gap-2">
                {shapes.map((shape) => (
                  <button
                    key={shape.name}
                    onClick={() => toggleShape(shape.name)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      selectedShapes.includes(shape.name)
                        ? "bg-(--accent-light) ring-2 ring-(--accent-primary)"
                        : "hover:bg-(--bg-tertiary)"
                    }`}
                  >
                    <svg
                      className={`w-8 h-8 ${
                        selectedShapes.includes(shape.name)
                          ? "text-(--accent-primary)"
                          : "text-(--text-muted)"
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path d={shape.icon} />
                    </svg>
                    <span
                      className={`text-xs ${
                        selectedShapes.includes(shape.name)
                          ? "text-(--accent-primary) font-medium"
                          : "text-(--text-secondary)"
                      }`}
                    >
                      {shape.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Carat Filter */}
            <div className="card p-4">
              <h3 className="font-semibold text-(--text-primary) mb-3">Carat</h3>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Min. ct"
                    value={caratMin}
                    onChange={(e) => setCaratMin(e.target.value)}
                    className="input-field text-sm py-2"
                  />
                  {caratMin && (
                    <span className="absolute left-3 bottom-2 text-xs text-(--text-muted)">
                      {caratMin}
                    </span>
                  )}
                </div>
                <span className="text-(--text-muted)">→</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Max. ct"
                    value={caratMax}
                    onChange={(e) => setCaratMax(e.target.value)}
                    className="input-field text-sm py-2"
                  />
                </div>
              </div>
            </div>

            {/* Expand More */}
            <button className="w-full flex items-center justify-center gap-2 p-3 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors">
              <ChevronDown className="w-4 h-4" />
              More Filters
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Stock Grid */}
            <ShowStock 
              type="natural" 
              filters={{
                shapes: selectedShapes,
                available: availableItems,
                caratMin,
                caratMax
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NaturalDiamond;
