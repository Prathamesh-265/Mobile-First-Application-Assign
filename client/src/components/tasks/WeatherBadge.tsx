import Image from "next/image";
import type { WeatherSnapshot } from "../../types/task";

export function WeatherBadge({ weather }: { weather: WeatherSnapshot | null }) {
  if (!weather) return null;

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-300">
      <Image
        src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
        alt={weather.description}
        width={16}
        height={16}
        unoptimized
      />
      <span>
        {weather.tempC}°C, {weather.description}
      </span>
    </div>
  );
}
