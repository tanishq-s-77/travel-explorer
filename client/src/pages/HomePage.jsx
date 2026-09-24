import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Compass, Sun, MapPin, Sparkles, ArrowRight, Heart, CloudSun, Wind, Droplets } from 'lucide-react';
import { getDestinations } from '../services/api.js';
import DestinationCard from '../components/destinations/DestinationCard.jsx';
import LoadingSkeleton from '../components/ui/LoadingSkeleton.jsx';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTeaser, setSearchTeaser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function loadFeatured() {
      try {
        const data = await getDestinations();
        if (mounted) {
          // Select 4 visually diverse destinations for hero showcase
          const highlights = (data.destinations || []).slice(0, 8);
          setFeatured(highlights);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load featured destinations:', err);
        if (mounted) setLoading(false);
      }
    }
    loadFeatured();
    return () => { mounted = false; };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTeaser.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchTeaser.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section with Beautiful Scenic Landscape Background */}
      <section className="relative rounded-4xl overflow-hidden p-8 sm:p-14 lg:p-20 border border-white/80 shadow-soft-hover">
        {/* Scenic Background Photography */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=85"
          alt="Scenic mountain wonderland"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95 transform scale-105"
        />

        {/* Soft, Fresh Airy Gradient & Frosted Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/85 to-cream-100/95 backdrop-blur-[2px]" />

        {/* Soft decorative ambient glow circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-skyvibe-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sunset-300/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          {/* Top pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slatevibe-200/60 shadow-sm text-xs font-semibold text-skyvibe-700"
          >
            <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Curated 20 World Escapes with Live Weather</span>
            <span className="w-1.5 h-1.5 rounded-full bg-meadow-500" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slatevibe-900 leading-[1.15]"
          >
            Follow the Sun, <br className="hidden sm:block" />
            <span className="gradient-text-sky">Chase the Fresh Breeze.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slatevibe-600 max-w-2xl mx-auto leading-relaxed"
          >
            Discover twenty handpicked global wonderlands. Real-time atmospheric forecasts, high-resolution photography, and thoughtful travel curation.
          </motion.p>

          {/* Hero Search Bar */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto pt-2"
          >
            <div className="relative flex items-center bg-white rounded-full p-2 shadow-lg shadow-skyvibe-100/50 border border-slatevibe-200/80">
              <Search className="w-5 h-5 text-slatevibe-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchTeaser}
                onChange={(e) => setSearchTeaser(e.target.value)}
                placeholder="Where to next? Try 'Bali', 'Cold', or 'Mountain'..."
                className="w-full px-3 py-2 bg-transparent text-sm sm:text-base text-slatevibe-800 placeholder:text-slatevibe-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-skyvibe-600 to-skyvibe-500 hover:from-skyvibe-700 hover:to-skyvibe-600 text-white text-sm font-semibold shadow-md transition-all shrink-0 flex items-center gap-1.5"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>

          {/* Quick Category Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium">
            <Link
              to="/explore?climate=Beach"
              className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-slatevibe-700 border border-slatevibe-200/60 shadow-sm transition-all flex items-center gap-1"
            >
              🏖️ Tropical Beach
            </Link>
            <Link
              to="/explore?climate=Mountain"
              className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-slatevibe-700 border border-slatevibe-200/60 shadow-sm transition-all flex items-center gap-1"
            >
              ⛰️ Alpine Peaks
            </Link>
            <Link
              to="/explore?climate=City"
              className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-slatevibe-700 border border-slatevibe-200/60 shadow-sm transition-all flex items-center gap-1"
            >
              🏙️ Cultural Cities
            </Link>
            <Link
              to="/explore?climate=Cold"
              className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-slatevibe-700 border border-slatevibe-200/60 shadow-sm transition-all flex items-center gap-1"
            >
              ❄️ Arctic & Snow
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-skyvibe-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slatevibe-900 tracking-tight">
              Trending Wonderlands
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-skyvibe-600 hover:text-skyvibe-700 group"
          >
            <span>View All 20 Curated Places</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* Atmospheric Travel Features */}
      <section className="bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-slatevibe-200/70 shadow-soft">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slatevibe-900 tracking-tight">
            Crafted for the Mindful Adventurer
          </h2>
          <p className="mt-2 text-sm text-slatevibe-600">
            Everything you need to dream, plan, and pick the perfect climate for your next trip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-cream-50/80 border border-slatevibe-200/60">
            <div className="w-12 h-12 rounded-xl bg-skyvibe-100 text-skyvibe-600 flex items-center justify-center mb-4">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slatevibe-900 mb-2">Live Weather Sync</h3>
            <p className="text-sm text-slatevibe-600 leading-relaxed">
              Real-time atmospheric temperatures, wind speeds, and sky conditions fetched straight from OpenWeatherMap.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cream-50/80 border border-slatevibe-200/60">
            <div className="w-12 h-12 rounded-xl bg-sunset-100 text-sunset-600 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slatevibe-900 mb-2">The Curated 20</h3>
            <p className="text-sm text-slatevibe-600 leading-relaxed">
              No endless infinite-scroll noise. Strictly 20 hand-selected world icons balanced across budget and geography.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cream-50/80 border border-slatevibe-200/60">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slatevibe-900 mb-2">Cloud Wishlists</h3>
            <p className="text-sm text-slatevibe-600 leading-relaxed">
              Save your dream escapes directly to your personal account powered by Supabase PostgreSQL.
            </p>
          </div>
        </div>
      </section>

      {/* Second Grid: Cold & Mountain Picks */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-meadow-600 uppercase tracking-widest mb-1">
              ⛰️ Alpine & Arctic Wonders
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slatevibe-900 tracking-tight">
              Breathtaking Cold & Mountain Escapes
            </h2>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(4, 8).map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* Call to action with scenic road-trip travel background */}
      <section className="relative rounded-4xl overflow-hidden p-10 sm:p-14 text-center text-white shadow-xl border border-white/40">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
          alt="Open road travel horizon"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-skyvibe-950/85 via-skyvibe-900/60 to-slatevibe-900/50 backdrop-blur-[1px]" />

        <div className="relative max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-skyvibe-100 text-sm sm:text-base leading-relaxed">
            Explore all 20 destinations, filter by your preferred climate and budget, and save your personal bucket list.
          </p>
          <div className="pt-2">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-skyvibe-800 hover:bg-cream-50 font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <span>Explore All 20 Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
