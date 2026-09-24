import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch destinations with optional filters
 */
export async function getDestinations(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.append('q', params.q);
  if (params.continent && params.continent !== 'all') queryParams.append('continent', params.continent);
  if (params.climate && params.climate !== 'all') queryParams.append('climate', params.climate);
  if (params.budget && params.budget !== 'all') queryParams.append('budget', params.budget);

  const response = await apiClient.get(`/destinations?${queryParams.toString()}`);
  return response.data;
}

/**
 * Fetch a single destination by ID
 */
export async function getDestinationById(id) {
  const response = await apiClient.get(`/destinations/${id}`);
  return response.data;
}

/**
 * Fetch user wishlist (requires auth token)
 */
export async function getWishlist(token) {
  const response = await apiClient.get('/wishlist', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

/**
 * Add destination to wishlist (requires auth token)
 */
export async function addToWishlistApi(token, destinationId, destinationName) {
  const response = await apiClient.post(
    '/wishlist',
    { destinationId, destinationName },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
}

/**
 * Remove destination from wishlist (requires auth token)
 */
export async function removeFromWishlistApi(token, destinationId) {
  const response = await apiClient.delete(`/wishlist/${destinationId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

/**
 * Check backend server health
 */
export async function checkHealth() {
  const response = await apiClient.get('/health');
  return response.data;
}

export default apiClient;
