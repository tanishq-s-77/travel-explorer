import axios from 'axios';

// In-memory image cache: query -> { data, timestamp }
const imageCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours cache for images

/**
 * Fetch high-resolution photo from Unsplash or fallback to curated photography
 */
export async function getDestinationImage(destinationName, searchQuery, fallbackImage = {}) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  const query = searchQuery || `${destinationName} travel landmark`;
  const cacheKey = destinationName.toLowerCase().trim();

  // Check cache first
  const cached = imageCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // If no Unsplash key provided, return fallback immediately
  if (!accessKey || accessKey === 'your_unsplash_access_key_here') {
    const result = {
      ...fallbackImage,
      source: 'curated_unsplash_cdn'
    };
    imageCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`
      },
      timeout: 4500
    });

    const photo = response.data?.results?.[0];
    if (photo) {
      const imageResult = {
        url: photo.urls?.regular || photo.urls?.full || fallbackImage.url,
        thumb: photo.urls?.small || fallbackImage.thumb,
        photographer: photo.user?.name || fallbackImage.photographer || 'Unsplash Photographer',
        photographerUrl: photo.user?.links?.html || fallbackImage.photographerUrl || 'https://unsplash.com',
        source: 'unsplash_api'
      };
      imageCache.set(cacheKey, { data: imageResult, timestamp: Date.now() });
      return imageResult;
    }

    // Fallback if no photo found
    imageCache.set(cacheKey, { data: fallbackImage, timestamp: Date.now() });
    return fallbackImage;
  } catch (error) {
    console.warn(`[UnsplashService] Could not fetch live image for ${destinationName}:`, error.message);
    const result = {
      ...fallbackImage,
      source: 'fallback_error_recovery'
    };
    imageCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }
}
