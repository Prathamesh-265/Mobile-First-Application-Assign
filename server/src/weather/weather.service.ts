import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface WeatherSnapshot {
  tempC: number;
  feelsLikeC: number;
  description: string;
  icon: string;
  cityName: string;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey?: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('weather.apiKey');
  }

  // Best-effort lookup - weather is context, not core task data, so a
  // failed/missing API key should never break task creation or fetching.
  // We just return null and let the frontend show "weather unavailable".
  async getByLocation(location?: string): Promise<WeatherSnapshot | null> {
    if (!location || !this.apiKey) {
      return null;
    }

    try {
      const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: { q: location, appid: this.apiKey, units: 'metric' },
        timeout: 5000,
      });

      return {
        tempC: Math.round(data.main.temp),
        feelsLikeC: Math.round(data.main.feels_like),
        description: data.weather?.[0]?.description ?? 'unknown',
        icon: data.weather?.[0]?.icon ?? '01d',
        cityName: data.name,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown error';
      this.logger.warn(`Weather lookup failed for "${location}": ${message}`);
      return null;
    }
  }
}
