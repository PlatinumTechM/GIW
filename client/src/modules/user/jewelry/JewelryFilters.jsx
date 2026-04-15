import { motion, AnimatePresence } from "framer-motion";
import {
  Diamond,
  Sparkles,
  Star,
  Gem,
  Crown,
  Filter,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";
import Input from "../../../components/ui/Input";

const JewelryFilters = ({
  // Desktop filters
  tempCategory,
  setTempCategory,
  tempPriceRange,
  setTempPriceRange,
  tempMetals,
  toggleMetal,
  expandedSections,
  toggleSection,
  applyFilters,
  clearAllFilters,
  // Mobile filters
  mobileFiltersOpen,
  setMobileFiltersOpen,
  // Data
  categories,
  metalTypes,
  filteredItemsCount,
  // Optional
  isLabGrown = false,
}) => {
  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A] lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filters</span>
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <div className="sticky top-[120px] flex max-h-[calc(100vh-140px)] flex-col rounded-xl border border-[#E2E8F0] bg-white">
          <div className="flex-1 space-y-6 overflow-y-auto p-5 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {/* Categories */}
            <div>
              <button
                onClick={() => toggleSection("category")}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="font-semibold text-[#0F172A]">Categories</h3>
                <ChevronDown
                  className={`h-4 w-4 text-[#64748B] transition-transform ${
                    expandedSections.category ? "" : "-rotate-90"
                  }`}
                />
              </button>

              {expandedSections.category && (
                <div className="mt-4 space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setTempCategory(category.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                        tempCategory === category.id
                          ? "bg-[#DBEAFE] text-[#1E3A8A]"
                          : "text-[#475569] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
                        {category.label}
                      </span>
                      <span className="text-xs text-[#64748B]">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div>
              <button
                onClick={() => toggleSection("price")}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="font-semibold text-[#0F172A]">Price Range</h3>
                <ChevronDown
                  className={`h-4 w-4 text-[#64748B] transition-transform ${
                    expandedSections.price ? "" : "-rotate-90"
                  }`}
                />
              </button>

              {expandedSections.price && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={tempPriceRange[0]}
                        onChange={(e) =>
                          setTempPriceRange([
                            Number(e.target.value),
                            tempPriceRange[1],
                          ])
                        }
                        icon={<span className="text-[#64748B]">$</span>}
                        className="rounded-lg py-2.5"
                        placeholder="Min"
                      />
                    </div>

                    <span className="text-[#64748B]">-</span>

                    <div className="flex-1">
                      <Input
                        type="number"
                        value={tempPriceRange[1]}
                        onChange={(e) =>
                          setTempPriceRange([
                            tempPriceRange[0],
                            Number(e.target.value),
                          ])
                        }
                        icon={<span className="text-[#64748B]">$</span>}
                        className="rounded-lg py-2.5"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={tempPriceRange[1]}
                    onChange={(e) =>
                      setTempPriceRange([
                        tempPriceRange[0],
                        Number(e.target.value),
                      ])
                    }
                    className="w-full accent-[#1E3A8A]"
                  />

                  <div className="flex justify-between text-xs text-[#64748B]">
                    <span>${tempPriceRange[0].toLocaleString()}</span>
                    <span>${tempPriceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Metal Type */}
            <div>
              <button
                onClick={() => toggleSection("metal")}
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="font-semibold text-[#0F172A]">Metal Type</h3>
                <ChevronDown
                  className={`h-4 w-4 text-[#64748B] transition-transform ${
                    expandedSections.metal ? "" : "-rotate-90"
                  }`}
                />
              </button>

              {expandedSections.metal && (
                <div className="mt-4 space-y-2">
                  {metalTypes.map((metal) => (
                    <label
                      key={metal.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-[#F1F5F9]"
                    >
                      <input
                        type="checkbox"
                        checked={tempMetals.includes(metal.id)}
                        onChange={() => toggleMetal(metal.id)}
                        className="h-4 w-4 rounded border-[#E2E8F0] text-[#1E3A8A] focus:ring-[#1E3A8A]"
                      />
                      <span
                        className="h-4 w-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: metal.color }}
                      />
                      <span className="text-sm text-[#475569]">
                        {metal.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Apply & Clear Buttons */}
          <div className="border-t border-[#E2E8F0] bg-white p-4 space-y-3">
            <button
              onClick={applyFilters}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] py-3 text-sm font-medium text-white transition-all hover:bg-[#1E40AF] active:scale-95"
            >
              <Filter className="h-4 w-4" />
              Apply Filters
            </button>
            <button
              onClick={clearAllFilters}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-3 text-sm font-medium text-[#475569] transition-all hover:border-[#64748B] hover:text-[#0F172A] active:scale-95"
            >
              <X className="h-4 w-4" />
              Clear All Filters
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 flex h-full w-80 flex-col bg-white lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] p-4">
                <div>
                  <h2 className="text-sm font-semibold text-[#0F172A]">
                    Filters
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    {filteredItemsCount} items
                  </p>
                </div>

                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-full p-2 hover:bg-[#F1F5F9]"
                >
                  <X className="h-5 w-5 text-[#64748B]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {/* Mobile Categories */}
                <div className="mb-6">
                  <h3 className="mb-3 font-semibold text-[#0F172A]">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setTempCategory(category.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                          tempCategory === category.id
                            ? "bg-[#DBEAFE] text-[#1E3A8A]"
                            : "text-[#475569] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          {category.label}
                        </span>
                        <span className="text-xs text-[#64748B]">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Price Range */}
                <div className="mb-6">
                  <h3 className="mb-3 font-semibold text-[#0F172A]">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={tempPriceRange[0]}
                          onChange={(e) =>
                            setTempPriceRange([
                              Number(e.target.value),
                              tempPriceRange[1],
                            ])
                          }
                          icon={<span className="text-[#64748B]">$</span>}
                          className="rounded-lg py-2.5"
                          placeholder="Min"
                        />
                      </div>
                      <span className="text-[#64748B]">-</span>
                      <div className="flex-1">
                        <Input
                          type="number"
                          value={tempPriceRange[1]}
                          onChange={(e) =>
                            setTempPriceRange([
                              tempPriceRange[0],
                              Number(e.target.value),
                            ])
                          }
                          icon={<span className="text-[#64748B]">$</span>}
                          className="rounded-lg py-2.5"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Metal Type */}
                <div className="mb-6">
                  <h3 className="mb-3 font-semibold text-[#0F172A]">
                    Metal Type
                  </h3>
                  <div className="space-y-2">
                    {metalTypes.map((metal) => (
                      <label
                        key={metal.id}
                        className="flex cursor-pointer items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          checked={tempMetals.includes(metal.id)}
                          onChange={() => toggleMetal(metal.id)}
                          className="h-4 w-4 rounded border-[#E2E8F0] text-[#1E3A8A]"
                        />
                        <span
                          className="h-4 w-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: metal.color }}
                        />
                        <span className="text-sm text-[#475569]">
                          {metal.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Footer Buttons */}
              <div className="border-t border-[#E2E8F0] p-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="flex-1 rounded-lg border border-[#E2E8F0] py-3 text-sm font-medium text-[#475569]"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => {
                      applyFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="flex-1 rounded-lg bg-[#1E3A8A] py-3 text-sm font-medium text-white"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default JewelryFilters;
