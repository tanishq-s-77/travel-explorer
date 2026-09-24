import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Heart, LogOut, ShieldCheck, ArrowRight, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-pulse space-y-6">
        <div className="h-8 w-40 bg-slatevibe-200 rounded-md" />
        <div className="h-64 bg-slatevibe-200 rounded-3xl" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login&redirect=/profile" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Traveler';
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Active Explorer';

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-skyvibe-600 uppercase tracking-widest mb-1">
          <User className="w-3.5 h-3.5" />
          Explorer Profile
        </div>
        <h1 className="text-3xl font-extrabold text-slatevibe-900 tracking-tight">
          Account Overview
        </h1>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slatevibe-200/80 shadow-soft space-y-8">
        {/* User Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-skyvibe-500 to-skyvibe-300 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shadow-skyvibe-200">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slatevibe-900 flex items-center gap-2">
              {displayName}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-meadow-100 text-meadow-700 border border-meadow-200">
                <ShieldCheck className="w-3 h-3" />
                Verified Traveler
              </span>
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slatevibe-500 mt-1.5">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slatevibe-400" />
                {user.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slatevibe-400" />
                Joined {joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slatevibe-100">
          {/* Wishlist Stat Card */}
          <Link
            to="/wishlist"
            className="p-5 rounded-2xl bg-rose-50/70 border border-rose-100 hover:border-rose-300 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-semibold text-rose-600 block mb-1">
                Saved Destinations
              </span>
              <span className="text-3xl font-extrabold text-slatevibe-900">
                {wishlistCount}
              </span>
              <span className="text-xs text-slatevibe-500 block mt-1">
                Out of 20 Curated Escapes
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 fill-current" />
            </div>
          </Link>

          {/* Curated Explorer Catalog Stat */}
          <Link
            to="/explore"
            className="p-5 rounded-2xl bg-skyvibe-50/70 border border-skyvibe-100 hover:border-skyvibe-300 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-semibold text-skyvibe-600 block mb-1">
                Curated Catalog
              </span>
              <span className="text-3xl font-extrabold text-slatevibe-900">
                20
              </span>
              <span className="text-xs text-slatevibe-500 block mt-1">
                Live OpenWeather Synced
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-skyvibe-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* Technical User ID info */}
        <div className="p-4 rounded-2xl bg-cream-50 border border-slatevibe-200/60 text-xs text-slatevibe-500 space-y-1">
          <span className="font-semibold text-slatevibe-700 block">Supabase Auth User Identifier:</span>
          <code className="text-skyvibe-700 break-all font-mono">{user.id}</code>
        </div>

        {/* Sign Out CTA */}
        <div className="pt-4 border-t border-slatevibe-100 flex items-center justify-between">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-skyvibe-600 hover:text-skyvibe-700"
          >
            <span>Continue Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slatevibe-100 hover:bg-rose-50 hover:text-rose-600 text-slatevibe-700 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
