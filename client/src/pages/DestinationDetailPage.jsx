import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Sun,
  Wind,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { getDestinationById } from '../services/api.js';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getWeatherIcon } from '../components/destinations/WeatherBadge.jsx';

export default function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDestinationById(id);
        if (mounted) {
          setDestination(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load destination detail:', err);
        if (mounted) {
          setError(err.response?.data?.message || 'Destination not found.');
          setLoading(false);
        }
      }
    }
    loadDetail();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="py-12 animate-pulse space-y-8">
        <div className="h-8 w-40 bg-slatevibe-200 rounded-full" />
        <div className="h-[460px] bg-slatevibe-200 rounded-4xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-2/3 bg-slatevibe-200 rounded-md" />
            <div className="h-24 bg-slatevibe-100 rounded-2xl" />
          </div>
          <div className="h-64 bg-slatevibe-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slatevibe-900">Destination Not Found</h2>
        <p className="text-sm text-slatevibe-600 max-w-md mx-auto">{error}</p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-skyvibe-600 text-white font-semibold text-sm hover:bg-skyvibe-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(destination.id);
  const weather = destination.weather || destination.fallbackWeather;
  const image = destination.image || destination.fallbackImage;

  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/auth?mode=login&redirect=' + encodeURIComponent(`/destination/${destination.id}`));
      return;
    }
    toggleWishlist(destination);
  };

  return (
    <div className="space-y-10 py-4">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slatevibe-600 hover:text-skyvibe-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All 20 Destinations
        </Link>

        <div className="flex items-center gap-2 text-xs font-medium text-slatevibe-500">
          <span>{destination.continent}</span>
          <span>/</span>
          <span className="text-slatevibe-900 font-bold">{destination.name}</span>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="relative rounded-4xl overflow-hidden shadow-soft-hover border border-white/70 h-[380px] sm:h-[480px] group">
        <img
          src={image.url}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slatevibe-950/85 via-slatevibe-900/30 to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/90 backdrop-blur-md text-slatevibe-800 shadow-sm">
              {destination.climate} Climate
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-md text-white border border-white/20">
              Budget: {destination.budget}
            </span>
          </div>

          {/* Unsplash Photographer Credit */}
          {image.photographer && (
            <a
              href={image.photographerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white text-xs border border-white/10 transition-colors"
            >
              <span>Photo by {image.photographer}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Hero Bottom Information */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="text-white space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-skyvibe-300">
              <MapPin className="w-4 h-4" />
              {destination.country} • {destination.continent}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {destination.name}
            </h1>
          </div>

          {/* Save to Wishlist Action Button */}
          <div className="shrink-0">
            {user ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlistToggle}
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm shadow-lg transition-all ${
                  isSaved
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                    : 'bg-white hover:bg-cream-50 text-slatevibe-900 shadow-black/20'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : 'text-rose-500'}`} />
                <span>{isSaved ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
              </motion.button>
            ) : (
              <button
                onClick={handleWishlistToggle}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/95 hover:bg-white text-slatevibe-900 font-bold text-sm shadow-lg backdrop-blur-md transition-all hover:scale-105"
              >
                <Heart className="w-5 h-5 text-rose-500" />
                <span>Log in to Save</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Grid: Guide vs Live Weather Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Description & Highlights */}
        <div className="lg:col-span-2 space-y-8">
          {/* About destination */}
          <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slatevibe-200/70 shadow-soft">
            <h2 className="text-xl sm:text-2xl font-bold text-slatevibe-900 mb-4">
              About {destination.name}
            </h2>
            <p className="text-slatevibe-700 leading-relaxed text-base sm:text-lg">
              {destination.description}
            </p>

            {/* Best Season */}
            <div className="mt-6 p-4 rounded-2xl bg-cream-50 border border-slatevibe-200/60 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-skyvibe-600 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slatevibe-400 block">
                  Best Time to Visit
                </span>
                <span className="text-sm font-semibold text-slatevibe-800">
                  {destination.bestTimeToVisit}
                </span>
              </div>
            </div>
          </section>

          {/* Curated Highlights */}
          <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slatevibe-200/70 shadow-soft">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-sunset-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-slatevibe-900">
                Key Highlights & Experiences
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(destination.highlights || []).map((highlight, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-cream-50/80 border border-slatevibe-200/60 flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-meadow-100 text-meadow-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-medium text-slatevibe-800 leading-relaxed">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Live Weather Station Widget */}
        <div className="space-y-6">
          <section className="bg-gradient-to-br from-skyvibe-500 via-skyvibe-600 to-skyvibe-700 rounded-3xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
            {/* Background weather flare */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-skyvibe-100 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-300" />
                Live Atmosphere
              </span>
              <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                {weather.isLive ? 'Live OpenWeather' : 'Curated Weather'}
              </span>
            </div>

            {/* Big Temperature Display */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tight">
                {weather.temp ?? 20}°
              </span>
              <span className="text-2xl font-light text-skyvibe-200">C</span>
            </div>

            <div className="capitalize text-lg font-semibold text-white mb-6 flex items-center gap-2">
              {getWeatherIcon(weather.condition, weather.icon)}
              <span>{weather.condition}</span>
              <span className="text-skyvibe-200 text-sm font-normal">
                ({weather.description})
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20 text-xs">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                <div className="flex items-center gap-1 text-skyvibe-100 mb-1">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-base font-bold">{weather.wind_speed} m/s</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                <div className="flex items-center gap-1 text-skyvibe-100 mb-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Humidity</span>
                </div>
                <div className="text-base font-bold">{weather.humidity}%</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                <div className="flex items-center gap-1 text-skyvibe-100 mb-1">
                  <Sunrise className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sunrise</span>
                </div>
                <div className="text-sm font-bold">{weather.sunrise || '06:00 AM'}</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                <div className="flex items-center gap-1 text-skyvibe-100 mb-1">
                  <Sunset className="w-3.5 h-3.5 text-sunset-300" />
                  <span>Sunset</span>
                </div>
                <div className="text-sm font-bold">{weather.sunset || '06:30 PM'}</div>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-skyvibe-100 text-center">
              Feels like {weather.feels_like}°C • High: {weather.temp_max}°C • Low: {weather.temp_min}°C
            </div>
          </section>

          {/* Quick Travel Tips Card */}
          <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slatevibe-200/70 shadow-soft space-y-4">
            <h3 className="font-bold text-slatevibe-900 text-base">
              Travel Checklist
            </h3>
            <ul className="space-y-2.5 text-xs text-slatevibe-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-meadow-500 shrink-0" />
                <span>Passport valid for at least 6 months</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-meadow-500 shrink-0" />
                <span>Weather-appropriate attire for {destination.climate.toLowerCase()} climate</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-meadow-500 shrink-0" />
                <span>Check local currency and digital payment acceptance</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
