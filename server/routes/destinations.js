import { Router } from 'express';
import { CURATED_DESTINATIONS } from '../data/destinations.js';
import { getDestinationWeather } from '../services/weatherService.js';
import { getDestinationImage } from '../services/unsplashService.js';

const router = Router();

/**
 * Helper to enrich a destination with live weather and image
 */
async function enrichDestination(dest) {
  const [weather, image] = await Promise.all([
    getDestinationWeather(dest.cityName, dest.fallbackWeather),
    getDestinationImage(dest.name, dest.searchQuery, dest.fallbackImage)
  ]);

  return {
    ...dest,
    weather,
    image
  };
}

/**
 * GET /api/destinations
 * Serves the curated 20 destinations, optionally filtered by continent, climate, budget, or search query.
 */
router.get('/', async (req, res) => {
  try {
    const { q, continent, climate, budget } = req.query;

    let filtered = CURATED_DESTINATIONS;

    // Filter strictly within the curated 20
    if (q && q.trim()) {
      const search = q.trim().toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(search) ||
        d.country.toLowerCase().includes(search) ||
        d.continent.toLowerCase().includes(search) ||
        d.climate.toLowerCase().includes(search)
      );
    }

    if (continent && continent !== 'all') {
      filtered = filtered.filter(d => d.continent.toLowerCase() === continent.toLowerCase());
    }

    if (climate && climate !== 'all') {
      filtered = filtered.filter(d => d.climate.toLowerCase() === climate.toLowerCase());
    }

    if (budget && budget !== 'all') {
      filtered = filtered.filter(d => d.budget === budget);
    }

    // Enrich filtered results with live weather and images in parallel
    const enrichedResults = await Promise.all(
      filtered.map(dest => enrichDestination(dest))
    );

    res.json({
      total: enrichedResults.length,
      destinations: enrichedResults
    });
  } catch (error) {
    console.error('[GET /api/destinations] Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve destination catalog.'
    });
  }
});

/**
 * GET /api/destinations/:id
 * Retrieve full details for a single destination from the curated 20
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dest = CURATED_DESTINATIONS.find(d => d.id.toLowerCase() === id.toLowerCase());

    if (!dest) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Destination '${id}' does not exist in the curated catalog.`
      });
    }

    const enriched = await enrichDestination(dest);
    res.json(enriched);
  } catch (error) {
    console.error(`[GET /api/destinations/${req.params.id}] Error:`, error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve destination details.'
    });
  }
});

export default router;
