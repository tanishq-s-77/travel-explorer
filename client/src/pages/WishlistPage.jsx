import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ArrowRight, Compass, Sparkles, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import WeatherBadge from '../components/destinations/WeatherBadge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, removeFromWishlist, loading: wishlistLoading } = useWishlist();

  // If auth is still checking, render skeleton
  if (authLoading) {
    return (
      <div className="py-12 animate-pulse space-y-6">
        <div className="h-8 w-48 bg-slatevibe-200 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slatevibe-200 rounded-3xl" />
          <div className="h-64 bg-slatevibe-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Protected route: Redirect unauthenticated users
  if (!user) {
    return <Navigate to="/auth?mode=login&redirect=/wishlist" replace />;
  }

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-widest mb-1.5">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Personal Bucket List
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slatevibe-900 tracking-tight">
            My Saved Destinations
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slatevibe-600">
            {wishlistItems.length === 0
              ? 'Your dream itinerary is waiting to be filled.'
              : `You have ${wishlistItems.length} wonderland${wishlistItems.length === 1 ? '' : 's'} saved to your adventure wishlist.`}
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-skyvibe-600 hover:text-skyvibe-700"
        >
          <span>Discover More Escapes</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Wishlist Items Grid */}
      {wishlistItems.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {wishlistItems.map((item) => {
              const dest = item.destination || {
                id: item.destination_id,
                name: item.destination_name,
                country: 'World',
                climate: 'Curated',
                budget: '$$',
                image: { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }
              };

              const imgUrl = dest.image?.thumb || dest.image?.url;

              return (
                <motion.div
                  key={item.destination_id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-slatevibe-200/70 shadow-soft hover:shadow-soft-hover transition-all flex flex-col justify-between"
                >
                  {/* Photo area */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slatevibe-100">
                    <img
                      src={imgUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slatevibe-900/60 via-transparent to-black/20" />

                    {/* Weather Badge */}
                    <div className="absolute top-3.5 left-3.5">
                      <WeatherBadge weather={dest.weather} compact />
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(dest.id)}
                      title="Remove from wishlist"
                      aria-label="Remove from wishlist"
                      className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-500 text-slatevibe-600 hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Metadata pill */}
                    <div className="absolute bottom-3 left-3.5 text-white text-xs">
                      <span className="inline-flex items-center gap-1 font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                        <MapPin className="w-3 h-3 text-skyvibe-300" />
                        {dest.country}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold text-slatevibe-500 uppercase tracking-wide">
                          {dest.climate} • {dest.continent || 'World'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slatevibe-900">
                        {dest.name}
                      </h3>
                      {dest.description && (
                        <p className="mt-2 text-xs text-slatevibe-600 line-clamp-2 leading-relaxed">
                          {dest.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slatevibe-100 flex items-center justify-between">
                      <span className="text-xs text-slatevibe-400">
                        Saved {new Date(item.created_at || Date.now()).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/destination/${dest.id}`}
                        className="text-xs font-bold text-skyvibe-600 hover:text-skyvibe-700 flex items-center gap-1"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any wonderlands yet. Explore our curated 20 world destinations and tap the heart icon to save your favorites!"
          actionLabel="Explore 20 Destinations"
          onAction={() => window.location.href = '/explore'}
        />
      )}
    </div>
  );
}
