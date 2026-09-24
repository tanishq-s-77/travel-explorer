import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sun, CloudRain, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slatevibe-200/80 bg-white/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-skyvibe-500 to-skyvibe-300 text-white flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-slatevibe-900">
                Travel<span className="text-skyvibe-600">Explorer</span>
              </span>
            </Link>
            <p className="text-sm text-slatevibe-600 max-w-md leading-relaxed">
              Curating 20 of Earth's most breathtaking wonderlands with live weather feeds, atmospheric photography, and custom wishlists. Built with love for mindful adventurers.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slatevibe-500">
              <span className="inline-flex items-center gap-1 text-skyvibe-600 font-medium">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Live OpenWeatherMap
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-slatevibe-700 font-medium">
                Unsplash Photography
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Supabase Auth
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slatevibe-400 mb-3">
              Discover
            </h4>
            <ul className="space-y-2 text-sm text-slatevibe-600">
              <li>
                <Link to="/explore" className="hover:text-skyvibe-600 transition-colors">
                  All 20 Destinations
                </Link>
              </li>
              <li>
                <Link to="/explore?climate=Beach" className="hover:text-skyvibe-600 transition-colors">
                  Tropical Beaches
                </Link>
              </li>
              <li>
                <Link to="/explore?climate=Mountain" className="hover:text-skyvibe-600 transition-colors">
                  Mountain Escapes
                </Link>
              </li>
              <li>
                <Link to="/explore?climate=Cold" className="hover:text-skyvibe-600 transition-colors">
                  Arctic & Cold Frontiers
                </Link>
              </li>
            </ul>
          </div>

          {/* User Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slatevibe-400 mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-sm text-slatevibe-600">
              <li>
                <Link to="/wishlist" className="hover:text-skyvibe-600 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-skyvibe-600 transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=login" className="hover:text-skyvibe-600 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=signup" className="hover:text-skyvibe-600 transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slatevibe-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slatevibe-500 gap-4">
          <p>© {new Date().getFullYear()} Travel Explorer. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> and fresh weather vibes
          </p>
        </div>
      </div>
    </footer>
  );
}
