
import React from 'react';
import { WidgetContainer } from './WidgetContainer';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye } from 'lucide-react';

interface WeatherWidgetProps {
  onRemove?: () => void;
  className?: string;
}

export const WeatherWidget = ({ onRemove, className }: WeatherWidgetProps) => {
  // Mock weather data
  const weatherData = {
    condition: 'sunny',
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 6
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'cloudy': return <Cloud className="w-8 h-8 text-slate-400" />;
      case 'rainy': return <CloudRain className="w-8 h-8 text-blue-400" />;
      default: return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  return (
    <WidgetContainer 
      title="Weather Conditions" 
      onRemove={onRemove}
      className={className}
    >
      <div className="space-y-4">
        {/* Main Weather Display */}
        <div className="flex items-center gap-4">
          {getWeatherIcon(weatherData.condition)}
          <div>
            <div className="text-3xl font-bold text-white">{weatherData.temperature}°C</div>
            <div className="text-sm text-slate-400 capitalize">{weatherData.condition}</div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg">
            <Droplets className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-sm font-medium text-white">{weatherData.humidity}%</div>
              <div className="text-xs text-slate-400">Humidity</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg">
            <Wind className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-sm font-medium text-white">{weatherData.windSpeed} km/h</div>
              <div className="text-xs text-slate-400">Wind</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg">
            <Eye className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-sm font-medium text-white">{weatherData.visibility} km</div>
              <div className="text-xs text-slate-400">Visibility</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg">
            <Sun className="w-4 h-4 text-yellow-400" />
            <div>
              <div className="text-sm font-medium text-white">{weatherData.uvIndex}</div>
              <div className="text-xs text-slate-400">UV Index</div>
            </div>
          </div>
        </div>

        {/* Impact on Generation */}
        <div className="pt-2 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Generation Impact</span>
            <span className="text-sm text-emerald-400 font-medium">+8% Optimal</span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};
