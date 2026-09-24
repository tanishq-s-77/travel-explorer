import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import WeatherBadge from './WeatherBadge.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DestinationCard({ destination }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isSaved = isInWishlist(destination.id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/auth?mode=login&redirect=' + encodeURIComponent(`/destination/${destination.id}`));
      return;
    }
    toggleWishlist(destination);
  };

  const getClimateBadgeStyle = (climate) => {
    switch (climate?.toLowerCase()) {
      case 'beach':
        return 'bg-amber-100/90 text-amber-800 border-amber-200/80';
      case 'mountain':
        return 'bg-emerald-100/90 text-emerald-800 border-emerald-200/80';
      case 'cold':
        return 'bg-sky-100/90 text-sky-800 border-sky-200/80';
      case 'city':
      default:
        return 'bg-purple-100/90 text-purple-800 border-purple-200/80';
    }
  };

  const imageUrl = destination.image?.thumb || destination.image?.url || destination.fallbackImage?.thumb;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-slatevibe-200/70 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col h-full"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slatevibe-100">
        <img
          src={imageUrl}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slatevibe-900/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          {/* Weather Badge */}
          <div className="pointer-events-auto">
            <WeatherBadge weather={destination.weather} compact />
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleHeartClick}
            aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
            className={`pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
              isSaved
                ? 'bg-rose-500 text-white shadow-rose-200'
                : 'bg-white/85 text-slatevibe-700 hover:bg-white hover:text-rose-500 border border-white/60'
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform ${isSaved ? 'fill-current scale-110' : ''}`} />
          </motion.button>
        </div>

        {/* Bottom image overlay metadata */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
          <span className="inline-flex items-center gap-1 font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            <MapPin className="w-3 h-3 text-skyvibe-300" />
            {destination.country}
          </span>
          <span className="font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
            {destination.budget}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full border ${getClimateBadgeStyle(destination.climate)}`}>
              {destination.climate}
            </span>
            <span className="text-[11px] font-medium text-slatevibe-500 bg-slatevibe-100 px-2 py-0.5 rounded-full">
              {destination.continent}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slatevibe-900 group-hover:text-skyvibe-600 transition-colors">
            {destination.name}
          </h3>

          <p className="mt-2 text-sm text-slatevibe-600 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-5 pt-4 border-t border-slatevibe-100 flex items-center justify-between">
          <div className="text-xs text-slatevibe-500">
            <span className="text-slatevibe-400">Best:</span> {destination.bestTimeToVisit?.split('&')[0]}
          </div>

          <Link
            to={`/destination/${destination.id}`}
            className="text-xs font-semibold text-skyvibe-600 hover:text-skyvibe-700 flex items-center gap-1 group/btn"
          >
            Explore
            <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
