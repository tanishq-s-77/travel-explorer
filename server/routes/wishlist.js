import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabase, getScopedSupabase } from '../services/supabaseAdmin.js';
import { CURATED_DESTINATIONS } from '../data/destinations.js';
import { getDestinationWeather } from '../services/weatherService.js';
import { getDestinationImage } from '../services/unsplashService.js';

const router = Router();

// Protect all wishlist endpoints with Supabase auth middleware
router.use(requireAuth);

/**
 * Helper to get active Supabase client for operation
 */
function getClient(req) {
  return getScopedSupabase(req.token) || supabase;
}

/**
 * GET /api/wishlist
 * Returns all saved destinations for the authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const client = getClient(req);
    const userId = req.user.id;

    const { data: wishlistItems, error } = await client
      .from('wishlist')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/wishlist] Supabase query error:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Could not fetch wishlist items.',
        details: error.message
      });
    }

    // Enrich wishlist entries with current destination details, weather, and photos
    const enrichedWishlist = await Promise.all(
      (wishlistItems || []).map(async (item) => {
        const dest = CURATED_DESTINATIONS.find(d => d.id === item.destination_id);
        if (dest) {
          const [weather, image] = await Promise.all([
            getDestinationWeather(dest.cityName, dest.fallbackWeather),
            getDestinationImage(dest.name, dest.searchQuery, dest.fallbackImage)
          ]);
          return {
            ...item,
            destination: {
              ...dest,
              weather,
              image
            }
          };
        }
        return {
          ...item,
          destination: null
        };
      })
    );

    res.json({
      total: enrichedWishlist.length,
      wishlist: enrichedWishlist
    });
  } catch (err) {
    console.error('[GET /api/wishlist] Unexpected error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve wishlist.'
    });
  }
});

/**
 * POST /api/wishlist
 * Add a destination to the authenticated user's wishlist
 */
router.post('/', async (req, res) => {
  try {
    const client = getClient(req);
    const userId = req.user.id;
    const { destinationId, destinationName } = req.body;

    if (!destinationId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'destinationId is required.'
      });
    }

    // Match against curated list for destinationName if not passed
    const matchedDest = CURATED_DESTINATIONS.find(d => d.id === destinationId);
    const finalName = destinationName || matchedDest?.name || destinationId;

    const { data, error } = await client
      .from('wishlist')
      .upsert(
        {
          user_id: userId,
          destination_id: destinationId,
          destination_name: finalName
        },
        { onConflict: 'user_id,destination_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('[POST /api/wishlist] Supabase insert error:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Could not save destination to wishlist.',
        details: error.message
      });
    }

    res.status(201).json({
      message: 'Destination saved to wishlist successfully.',
      item: data
    });
  } catch (err) {
    console.error('[POST /api/wishlist] Unexpected error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add item to wishlist.'
    });
  }
});

/**
 * DELETE /api/wishlist/:destinationId
 * Remove a destination from the user's wishlist
 */
router.delete('/:destinationId', async (req, res) => {
  try {
    const client = getClient(req);
    const userId = req.user.id;
    const { destinationId } = req.params;

    const { data, error } = await client
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('destination_id', destinationId);

    if (error) {
      console.error('[DELETE /api/wishlist] Supabase delete error:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Could not remove destination from wishlist.',
        details: error.message
      });
    }

    res.json({
      message: 'Destination removed from wishlist successfully.',
      destinationId
    });
  } catch (err) {
    console.error('[DELETE /api/wishlist] Unexpected error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to remove item from wishlist.'
    });
  }
});

export default router;
