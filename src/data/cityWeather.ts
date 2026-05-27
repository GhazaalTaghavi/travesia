import type { PackingItem } from '../types';

/** Weather for one day — dates/day-names are computed from trip.startDate in the page */
export interface DayForecast {
  condition: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface CityWeatherData {
  forecast: DayForecast[]; // 5 days
  packingList: PackingItem[];
}

// ─── Paris (Jun, temperate) ───────────────────────────────────────────────────
const parisWeather: CityWeatherData = {
  forecast: [
    { condition: 'Partly Cloudy', high: 22, low: 14, humidity: 65, windSpeed: 12, icon: '⛅' },
    { condition: 'Sunny',         high: 26, low: 16, humidity: 50, windSpeed: 8,  icon: '☀️' },
    { condition: 'Sunny',         high: 27, low: 17, humidity: 48, windSpeed: 10, icon: '☀️' },
    { condition: 'Light Rain',    high: 20, low: 13, humidity: 80, windSpeed: 18, icon: '🌧️' },
    { condition: 'Overcast',      high: 19, low: 12, humidity: 72, windSpeed: 15, icon: '☁️' },
  ],
  packingList: [
    { item: 'Light rain jacket',        category: 'Clothing',    reason: 'Rain expected on Day 4' },
    { item: 'Comfortable walking shoes',category: 'Footwear',    reason: 'Expect 15,000+ steps/day on cobblestones' },
    { item: 'Light layers / cardigan',  category: 'Clothing',    reason: 'Evenings can be cool (12–14°C)' },
    { item: 'Sunglasses',               category: 'Accessories', reason: '3 sunny days forecast' },
    { item: 'Sunscreen SPF 50',         category: 'Health',      reason: 'UV index moderate–high on sunny days' },
    { item: 'Compact umbrella',         category: 'Accessories', reason: 'Rain shower expected Day 4' },
    { item: 'Museum bag / tote',        category: 'Accessories', reason: 'No large bags allowed in museums' },
    { item: 'Power bank',               category: 'Tech',        reason: 'Long days of sightseeing' },
    { item: 'EU type E/F adapter',      category: 'Tech',        reason: 'French power sockets' },
    { item: 'Reusable water bottle',    category: 'Health',      reason: 'Free water fountains throughout Paris' },
    { item: 'Smart-casual outfit',      category: 'Clothing',    reason: 'Fine dining restaurants have dress codes' },
    { item: 'Euros (cash)',             category: 'Finance',     reason: 'Some markets and small bistros prefer cash' },
  ],
};

// ─── Barcelona (Jun, hot & sunny) ────────────────────────────────────────────
const barcelonaWeather: CityWeatherData = {
  forecast: [
    { condition: 'Sunny',        high: 29, low: 20, humidity: 55, windSpeed: 10, icon: '☀️' },
    { condition: 'Sunny',        high: 31, low: 21, humidity: 48, windSpeed: 14, icon: '☀️' },
    { condition: 'Partly Cloudy',high: 28, low: 19, humidity: 60, windSpeed: 12, icon: '⛅' },
    { condition: 'Sunny',        high: 30, low: 21, humidity: 50, windSpeed: 8,  icon: '☀️' },
    { condition: 'Thunderstorm', high: 24, low: 18, humidity: 78, windSpeed: 22, icon: '⛈️' },
  ],
  packingList: [
    { item: 'Sunscreen SPF 50+',         category: 'Health',      reason: 'Very high UV index — 4 sunny days' },
    { item: 'Swimwear',                  category: 'Clothing',    reason: 'Barceloneta beach is walkable from most hotels' },
    { item: 'Lightweight clothing',      category: 'Clothing',    reason: 'Temperatures hit 31°C — breathable fabrics only' },
    { item: 'Comfortable walking shoes', category: 'Footwear',    reason: 'Gaudí sites involve many stairs and steep paths' },
    { item: 'Sandals / espadrilles',     category: 'Footwear',    reason: 'Beach and warm evenings call for lighter footwear' },
    { item: 'Sunglasses',                category: 'Accessories', reason: '4 days of intense sunshine' },
    { item: 'Wide-brim hat',             category: 'Accessories', reason: 'Limited shade at Park Güell and open terraces' },
    { item: 'Rain jacket',               category: 'Clothing',    reason: 'Thunderstorm forecast on Day 5' },
    { item: 'Reusable water bottle',     category: 'Health',      reason: 'Stay hydrated — free drinking fountains at parks' },
    { item: 'EU adapter',                category: 'Tech',        reason: 'Spanish type C/F sockets' },
    { item: 'Power bank',                category: 'Tech',        reason: 'Long beach and sightseeing days drain phones fast' },
    { item: 'Euros (cash)',              category: 'Finance',     reason: 'La Boqueria stalls and smaller tapas bars are cash-only' },
  ],
};

// ─── Rome (Jun, hot & dry) ────────────────────────────────────────────────────
const romeWeather: CityWeatherData = {
  forecast: [
    { condition: 'Sunny',        high: 30, low: 19, humidity: 45, windSpeed: 10, icon: '☀️' },
    { condition: 'Sunny',        high: 32, low: 21, humidity: 40, windSpeed: 8,  icon: '☀️' },
    { condition: 'Partly Cloudy',high: 29, low: 20, humidity: 52, windSpeed: 12, icon: '⛅' },
    { condition: 'Sunny',        high: 33, low: 22, humidity: 38, windSpeed: 7,  icon: '☀️' },
    { condition: 'Partly Cloudy',high: 28, low: 19, humidity: 55, windSpeed: 11, icon: '⛅' },
  ],
  packingList: [
    { item: 'Sunscreen SPF 50+',         category: 'Health',      reason: 'Extreme UV — up to 33°C and full sun 4 days' },
    { item: 'Lightweight clothing',      category: 'Clothing',    reason: 'Linen or moisture-wicking fabrics for the heat' },
    { item: 'Modest cover-up (shoulders & knees)', category: 'Clothing', reason: "Required for Vatican, St. Peter's and all churches" },
    { item: 'Comfortable walking shoes', category: 'Footwear',    reason: 'Cobblestone streets — avoid flip-flops for long walks' },
    { item: 'Wide-brim hat / cap',       category: 'Accessories', reason: 'Little shade at Colosseum, Forum and open piazzas' },
    { item: 'Sunglasses',                category: 'Accessories', reason: 'Intense glare off white marble all day' },
    { item: 'Reusable water bottle',     category: 'Health',      reason: "Rome's free nasoni drinking fountains are everywhere — fill up often" },
    { item: 'Portable hand fan',         category: 'Accessories', reason: 'Queue times at popular sites can be 30+ min in the heat' },
    { item: 'EU adapter',                category: 'Tech',        reason: 'Italian type C/F/L sockets' },
    { item: 'Power bank',                category: 'Tech',        reason: 'Navigation and photo-heavy days drain batteries quickly' },
    { item: 'Museum reservation printouts', category: 'Accessories', reason: 'Vatican & Borghese require pre-booked timed tickets' },
    { item: 'Euros (cash)',              category: 'Finance',     reason: 'Many trattorias and gelaterie are cash-only' },
  ],
};

// ─── Istanbul (Jun, warm with occasional rain) ───────────────────────────────
const istanbulWeather: CityWeatherData = {
  forecast: [
    { condition: 'Partly Cloudy', high: 26, low: 17, humidity: 62, windSpeed: 15, icon: '⛅' },
    { condition: 'Sunny',         high: 28, low: 18, humidity: 55, windSpeed: 12, icon: '☀️' },
    { condition: 'Sunny',         high: 29, low: 19, humidity: 50, windSpeed: 10, icon: '☀️' },
    { condition: 'Light Rain',    high: 23, low: 16, humidity: 75, windSpeed: 18, icon: '🌧️' },
    { condition: 'Partly Cloudy', high: 25, low: 17, humidity: 65, windSpeed: 13, icon: '⛅' },
  ],
  packingList: [
    { item: 'Headscarf / shawl',         category: 'Accessories', reason: 'Mandatory for women entering mosques — easily borrowed but bring your own' },
    { item: 'Modest clothing',           category: 'Clothing',    reason: 'Covered shoulders and knees required at Hagia Sophia and the Blue Mosque' },
    { item: 'Comfortable walking shoes', category: 'Footwear',    reason: "Istanbul's hills and cobblestones are tough on feet — sturdy soles essential" },
    { item: 'Sunscreen SPF 30+',         category: 'Health',      reason: 'UV moderate–high on sunny days, especially on Bosphorus cruise' },
    { item: 'Light layers / cardigan',   category: 'Clothing',    reason: 'Evenings and ferry rides on the Bosphorus can be breezy' },
    { item: 'Compact umbrella',          category: 'Accessories', reason: 'Light rain expected on Day 4' },
    { item: 'Sunglasses',                category: 'Accessories', reason: 'Sunny days and bright light off the Bosphorus' },
    { item: 'Reusable water bottle',     category: 'Health',      reason: 'Tap water is not drinkable — buy big bottles or refill from dispensers' },
    { item: 'EU / Type F adapter',       category: 'Tech',        reason: 'Turkish sockets are type F (same as EU)' },
    { item: 'Power bank',                category: 'Tech',        reason: 'Grand Bazaar, boat trips and mosques — long days away from outlets' },
    { item: 'Small day bag',             category: 'Accessories', reason: 'Keep valuables secure in the Grand Bazaar and crowded areas' },
    { item: 'Turkish Lira (cash)',       category: 'Finance',     reason: 'Many street food vendors, ferry tickets and bazaar stalls are cash-only' },
  ],
};

// ─── Data map ─────────────────────────────────────────────────────────────────
export const cityWeatherData: Record<string, CityWeatherData> = {
  Paris:     parisWeather,
  Barcelona: barcelonaWeather,
  Rome:      romeWeather,
  Istanbul:  istanbulWeather,
};

export function getCityWeatherData(city: string): CityWeatherData {
  return cityWeatherData[city] ?? cityWeatherData['Paris'];
}
