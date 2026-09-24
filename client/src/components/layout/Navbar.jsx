import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, Heart, User, LogIn, LogOut, Menu, X, Sun, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-skyvibe-600 font-semibold'
        : 'text-slatevibe-600 hover:text-slatevibe-900'
    }`;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler';

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-skyvibe-500 to-skyvibe-300 text-white flex items-center justify-center shadow-md shadow-skyvibe-200 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-slatevibe-900 flex items-center gap-1">
                Travel<span className="text-skyvibe-600">Explorer</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slatevibe-600 font-semibold -mt-1">
                Fresh Weather Vibes
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/explore" className={navLinkClass}>
              Explore 20
            </NavLink>
            <NavLink to="/wishlist" className={navLinkClass}>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-0.5 px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </span>
            </NavLink>
          </nav>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slatevibe-200 shadow-sm hover:border-skyvibe-300 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-skyvibe-100 text-skyvibe-700 flex items-center justify-center text-xs font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slatevibe-700 max-w-[100px] truncate">
                    {displayName}
                  </span>
                </Link>

                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  className="p-2 rounded-full text-slatevibe-500 hover:text-slatevibe-800 hover:bg-slatevibe-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth?mode=login"
                  className="px-4 py-2 text-xs font-semibold text-slatevibe-700 hover:text-slatevibe-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="px-4 py-2 rounded-full bg-skyvibe-600 hover:bg-skyvibe-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <NavLink to="/wishlist" className="relative p-2 text-slatevibe-600">
              <Heart className="w-5 h-5 text-rose-500" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold rounded-full bg-rose-500 text-white flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slatevibe-700 hover:bg-slatevibe-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slatevibe-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-slatevibe-700 hover:bg-slatevibe-50"
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-slatevibe-700 hover:bg-slatevibe-50"
          >
            Explore 20 Destinations
          </NavLink>
          <NavLink
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-base font-medium text-slatevibe-700 hover:bg-slatevibe-50"
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              My Wishlist
            </span>
            {wishlistCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          <div className="pt-4 border-t border-slatevibe-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slatevibe-800 hover:bg-slatevibe-50"
                >
                  <User className="w-4 h-4 text-skyvibe-600" />
                  Profile ({displayName})
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/auth?mode=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slatevibe-200 text-sm font-semibold text-slatevibe-700 hover:bg-slatevibe-50"
                >
                  Log In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-skyvibe-600 text-white text-sm font-semibold hover:bg-skyvibe-700 shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
