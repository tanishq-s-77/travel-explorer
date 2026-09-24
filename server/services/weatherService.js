import axios from 'axios';

// In-memory weather cache: cityName -> { data, timestamp }
const weatherCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

/**
 * Format unix timestamp to readable time string (e.g. "06:15 AM")
 */
function formatTime(unixSeconds, timezoneOffsetSeconds = 0) {
  if (!unixSeconds) return null;
  const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return date.toUTCString().slice(17, 22) + ' ' + (date.getUTCHours() >= 12 ? 'PM' : 'AM');
}

/**
 * Fetch live weather from OpenWeatherMap or fallback to curated destination weather
 */
export async function getDestinationWeather(cityName, fallbackWeather = {}) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Check cache first
  const cacheKey = cityName.toLowerCase().trim();
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // If no API key is provided, use fallback immediately
  if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
    const result = {
      ...fallbackWeather,
      isLive: false,
      source: 'curated_fresh'
    };
    weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url, { timeout: 4500 });
    const data = response.data;

    const weatherResult = {
      temp: Math.round(data.main?.temp ?? fallbackWeather.temp ?? 20),
      feels_like: Math.round(data.main?.feels_like ?? fallbackWeather.feels_like ?? 20),
      temp_min: Math.round(data.main?.temp_min ?? fallbackWeather.temp_min ?? 15),
      temp_max: Math.round(data.main?.temp_max ?? fallbackWeather.temp_max ?? 25),
      humidity: data.main?.humidity ?? fallbackWeather.humidity ?? 60,
      wind_speed: Number((data.wind?.speed ?? fallbackWeather.wind_speed ?? 3.5).toFixed(1)),
      condition: data.weather?.[0]?.main ?? fallbackWeather.condition ?? 'Clear',
      description: data.weather?.[0]?.description ?? fallbackWeather.description ?? 'clear sky',
      icon: data.weather?.[0]?.icon ?? fallbackWeather.icon ?? '01d',
      pressure: data.main?.pressure ?? 1013,
      sunrise: formatTime(data.sys?.sunrise, data.timezone) || fallbackWeather.sunrise || '06:00 AM',
      sunset: formatTime(data.sys?.sunset, data.timezone) || fallbackWeather.sunset || '06:30 PM',
      isLive: true,
      source: 'openweathermap'
    };

    weatherCache.set(cacheKey, { data: weatherResult, timestamp: Date.now() });
    return weatherResult;
  } catch (error) {
    console.warn(`[WeatherService] Could not fetch live weather for ${cityName}:`, error.message);
    const result = {
      ...fallbackWeather,
      isLive: false,
      source: 'fallback_error_recovery'
    };
    weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }
}
