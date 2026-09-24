import React from 'react';
import { Sun, Cloud, CloudSun, CloudRain, CloudSnow, Wind, Droplets } from 'lucide-react';

/**
 * Maps condition text or icon codes to Lucide icons
 */
export function getWeatherIcon(condition = '', iconCode = '') {
  const cond = condition.toLowerCase();
  if (cond.includes('snow') || cond.includes('flurr') || cond.includes('blizz') || iconCode.includes('13')) {
    return <CloudSnow className="w-4 h-4 text-sky-400 animate-pulse" />;
  }
  if (cond.includes('rain') || cond.includes('drizz') || cond.includes('shower') || iconCode.includes('09') || iconCode.includes('10')) {
    return <CloudRain className="w-4 h-4 text-blue-500" />;
  }
  if (cond.includes('cloud') || cond.includes('overcast') || iconCode.includes('03') || iconCode.includes('04')) {
    return <Cloud className="w-4 h-4 text-slate-500" />;
  }
  if (cond.includes('partly') || cond.includes('scatter') || iconCode.includes('02')) {
    return <CloudSun className="w-4 h-4 text-amber-500" />;
  }
  return <Sun className="w-4 h-4 text-amber-500" />;
}

export default function WeatherBadge({ weather, compact = false, className = '' }) {
  if (!weather) return null;

  const temp = weather.temp ?? 20;
  const condition = weather.condition || 'Clear';

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/90 text-slatevibe-800 shadow-sm border border-white/60 ${className}`}>
        {getWeatherIcon(condition, weather.icon)}
        <span>{temp}°C</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md bg-white/90 text-slatevibe-800 shadow-sm border border-white/70 ${className}`}>
      {getWeatherIcon(condition, weather.icon)}
      <span className="font-bold text-slatevibe-900">{temp}°C</span>
      <span className="text-slatevibe-400 font-normal">|</span>
      <span className="capitalize text-slatevibe-700 truncate max-w-[120px]">{condition}</span>
    </div>
  );
}
