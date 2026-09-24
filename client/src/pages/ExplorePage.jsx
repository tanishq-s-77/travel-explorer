import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';
import { getDestinations } from '../services/api.js';
import DestinationCard from '../components/destinations/DestinationCard.jsx';
import FilterBar from '../components/filters/FilterBar.jsx';
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters read from URL params or default to 'all' / ''
  const searchQuery = searchParams.get('q') || '';
  const continent = searchParams.get('continent') || 'all';
  const climate = searchParams.get('climate') || 'all';
  const budget = searchParams.get('budget') || 'all';

  // Fetch full 20 destinations
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDestinations();
        if (mounted) {
          setDestinations(data.destinations || []);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load destinations:', err);
        if (mounted) {
          setError('Could not connect to the destination server. Please ensure the backend is running.');
          setLoading(false);
        }
      }
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  // Update URL params helper
  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === 'all') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  // Filter client-side among the curated 20 for instantaneous responsiveness
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      // Search text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = dest.name.toLowerCase().includes(q);
        const matchesCountry = dest.country.toLowerCase().includes(q);
        const matchesContinent = dest.continent.toLowerCase().includes(q);
        const matchesClimate = dest.climate.toLowerCase().includes(q);
        if (!matchesName && !matchesCountry && !matchesContinent && !matchesClimate) {
          return false;
        }
      }

      // Continent filter
      if (continent !== 'all' && dest.continent.toLowerCase() !== continent.toLowerCase()) {
        return false;
      }

      // Climate filter
      if (climate !== 'all' && dest.climate.toLowerCase() !== climate.toLowerCase()) {
        return false;
      }

      // Budget filter
      if (budget !== 'all' && dest.budget !== budget) {
        return false;
      }

      return true;
    });
  }, [destinations, searchQuery, continent, climate, budget]);

  return (
    <div className="space-y-8 py-4">
      {/* Page Title & Intro with Scenic Travel Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 border border-white/80 shadow-soft">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80"
          alt="Atmospheric mountain vista"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/60 backdrop-blur-[2px]" />

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-skyvibe-700 uppercase tracking-widest mb-2 px-3 py-1 rounded-full bg-skyvibe-50/90 border border-skyvibe-200">
            <Compass className="w-3.5 h-3.5 text-skyvibe-600" />
            The Curated Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slatevibe-900 tracking-tight">
            Explore 20 Global Wonderlands
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slatevibe-700 leading-relaxed font-normal">
            Filter by region, atmosphere, or budget to discover live meteorological conditions and curated photography from across the globe.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={(val) => updateParam('q', val)}
        continent={continent}
        onContinentChange={(val) => updateParam('continent', val)}
        climate={climate}
        onClimateChange={(val) => updateParam('climate', val)}
        budget={budget}
        onBudgetChange={(val) => updateParam('budget', val)}
        totalResults={filteredDestinations.length}
        onReset={handleResetFilters}
      />

      {/* Error Notice if any */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Grid of Destination Cards */}
      {loading ? (
        <LoadingSkeleton count={8} />
      ) : filteredDestinations.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState
          title="No Wonderlands Match Your Criteria"
          description="None of our 20 curated world destinations match the selected combination of region, climate, and budget."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
}
