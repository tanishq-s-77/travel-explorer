import React from 'react';
import { Search, X, SlidersHorizontal, Compass, CloudRain, DollarSign, Globe2 } from 'lucide-react';

const CONTINENTS = [
  { id: 'all', label: 'All Continents' },
  { id: 'Asia', label: 'Asia' },
  { id: 'Europe', label: 'Europe' },
  { id: 'Americas', label: 'Americas' },
  { id: 'Africa', label: 'Africa' },
  { id: 'Oceania', label: 'Oceania' },
];

const CLIMATES = [
  { id: 'all', label: 'All Climates' },
  { id: 'Beach', label: '🏖️ Beach' },
  { id: 'Mountain', label: '⛰️ Mountain' },
  { id: 'City', label: '🏙️ City' },
  { id: 'Cold', label: '❄️ Cold' },
];

const BUDGETS = [
  { id: 'all', label: 'All Budgets' },
  { id: '$', label: '$ Budget' },
  { id: '$$', label: '$$ Moderate' },
  { id: '$$$', label: '$$$ Luxury' },
];

export default function FilterBar({
  searchQuery,
  onSearchChange,
  continent,
  onContinentChange,
  climate,
  onClimateChange,
  budget,
  onBudgetChange,
  totalResults,
  onReset
}) {
  const hasActiveFilters = searchQuery || continent !== 'all' || climate !== 'all' || budget !== 'all';

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-slatevibe-200/80 shadow-soft mb-8">
      {/* Top Row: Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slatevibe-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search 20 curated destinations (e.g. Bali, Paris, Japan, Switzerland)..."
          className="w-full pl-12 pr-10 py-3.5 bg-cream-50 rounded-2xl text-slatevibe-800 placeholder:text-slatevibe-400 border border-slatevibe-200/80 focus:outline-none focus:ring-2 focus:ring-skyvibe-400 focus:border-transparent transition-all text-sm md:text-base font-normal"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slatevibe-200 hover:bg-slatevibe-300 text-slatevibe-600 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Rows */}
      <div className="space-y-4">
        {/* Continent Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slatevibe-400 uppercase tracking-wider min-w-[70px] flex items-center gap-1">
            <Globe2 className="w-3 h-3 text-skyvibe-500" />
            Region:
          </span>
          <div className="flex flex-wrap gap-1.5 flex-1">
            {CONTINENTS.map((item) => {
              const active = continent === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onContinentChange(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-skyvibe-600 text-white shadow-sm'
                      : 'bg-cream-100 hover:bg-slatevibe-100 text-slatevibe-700 border border-slatevibe-200/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Climate & Budget Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slatevibe-100">
          {/* Climate */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slatevibe-400 uppercase tracking-wider min-w-[70px]">
              Climate:
            </span>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {CLIMATES.map((item) => {
                const active = climate === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onClimateChange(item.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      active
                        ? 'bg-meadow-600 text-white shadow-sm'
                        : 'bg-cream-100 hover:bg-slatevibe-100 text-slatevibe-700 border border-slatevibe-200/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slatevibe-400 uppercase tracking-wider min-w-[70px]">
              Budget:
            </span>
            <div className="flex flex-wrap gap-1.5 flex-1">
              {BUDGETS.map((item) => {
                const active = budget === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onBudgetChange(item.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      active
                        ? 'bg-sunset-500 text-white shadow-sm'
                        : 'bg-cream-100 hover:bg-slatevibe-100 text-slatevibe-700 border border-slatevibe-200/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results Bar & Clear Filter button */}
      <div className="mt-4 pt-4 border-t border-slatevibe-100 flex items-center justify-between text-xs text-slatevibe-500">
        <div>
          Showing <span className="font-bold text-slatevibe-800">{totalResults}</span> of 20 curated world destinations
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sunset-600 hover:text-sunset-700 font-medium inline-flex items-center gap-1 hover:underline"
          >
            <X className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        )}
      </div>
    </div>
  );
}
