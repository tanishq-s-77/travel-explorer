import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext.jsx';
import { getWishlist, addToWishlistApi, removeFromWishlistApi } from '../services/api.js';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, session } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync wishlist from backend whenever user logs in or changes
  const fetchUserWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      setWishlistIds(new Set());
      return;
    }

    setLoading(true);
    setError(null);

    // If session has a valid token, attempt backend API sync
    if (session?.access_token && session.access_token !== 'demo-jwt-token-preview') {
      try {
        const response = await getWishlist(session.access_token);
        const items = response.wishlist || [];
        setWishlistItems(items);
        setWishlistIds(new Set(items.map(item => item.destination_id)));
      } catch (err) {
        console.warn('[WishlistContext] Backend sync fallback to local store:', err.message);
        // Fallback to local storage for user
        const localKey = `travel_wishlist_${user.id}`;
        const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
        setWishlistItems(localData);
        setWishlistIds(new Set(localData.map(item => item.destination_id)));
      } finally {
        setLoading(false);
      }
    } else {
      // Local storage fallback for preview/demo sessions
      const localKey = `travel_wishlist_${user.id}`;
      const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
      setWishlistItems(localData);
      setWishlistIds(new Set(localData.map(item => item.destination_id)));
      setLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    fetchUserWishlist();
  }, [fetchUserWishlist]);

  // Check if destination is in wishlist
  const isInWishlist = useCallback((destinationId) => {
    return wishlistIds.has(destinationId);
  }, [wishlistIds]);

  // Add destination to wishlist
  const addToWishlist = async (destination) => {
    if (!user) return { success: false, reason: 'unauthenticated' };
    const destinationId = destination.id;
    const destinationName = destination.name;

    // Optimistic UI update
    const newItem = {
      id: 'item-' + Date.now(),
      user_id: user.id,
      destination_id: destinationId,
      destination_name: destinationName,
      created_at: new Date().toISOString(),
      destination: destination
    };

    setWishlistItems(prev => [newItem, ...prev.filter(i => i.destination_id !== destinationId)]);
    setWishlistIds(prev => new Set([...prev, destinationId]));

    // Confetti burst for cheerful travel vibe
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#38BDF8', '#F97316', '#34D399', '#FDE047']
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }

    // Persist to local storage
    const localKey = `travel_wishlist_${user.id}`;
    const currentLocal = JSON.parse(localStorage.getItem(localKey) || '[]');
    const updatedLocal = [newItem, ...currentLocal.filter(i => i.destination_id !== destinationId)];
    localStorage.setItem(localKey, JSON.stringify(updatedLocal));

    // Persist to backend if real Supabase token
    if (session?.access_token && session.access_token !== 'demo-jwt-token-preview') {
      try {
        await addToWishlistApi(session.access_token, destinationId, destinationName);
      } catch (err) {
        console.warn('[WishlistContext] Backend API save notice:', err.message);
      }
    }

    return { success: true };
  };

  // Remove destination from wishlist
  const removeFromWishlist = async (destinationId) => {
    if (!user) return { success: false, reason: 'unauthenticated' };

    // Optimistic UI update
    setWishlistItems(prev => prev.filter(item => item.destination_id !== destinationId));
    setWishlistIds(prev => {
      const next = new Set(prev);
      next.delete(destinationId);
      return next;
    });

    // Update local storage
    const localKey = `travel_wishlist_${user.id}`;
    const currentLocal = JSON.parse(localStorage.getItem(localKey) || '[]');
    const updatedLocal = currentLocal.filter(i => i.destination_id !== destinationId);
    localStorage.setItem(localKey, JSON.stringify(updatedLocal));

    // Remove from backend if real Supabase token
    if (session?.access_token && session.access_token !== 'demo-jwt-token-preview') {
      try {
        await removeFromWishlistApi(session.access_token, destinationId);
      } catch (err) {
        console.warn('[WishlistContext] Backend API remove notice:', err.message);
      }
    }

    return { success: true };
  };

  // Toggle wishlist state
  const toggleWishlist = async (destination) => {
    if (isInWishlist(destination.id)) {
      return await removeFromWishlist(destination.id);
    } else {
      return await addToWishlist(destination);
    }
  };

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    loading,
    error,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist: fetchUserWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
