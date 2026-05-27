import { useState, useEffect, useMemo, type FormEvent } from 'react';
import {
  Wind,
  Droplets,
  CheckCircle2,
  Circle,
  Sparkles,
  Bot,
  Plus,
  Send,
  ShoppingBag,
  X,
} from 'lucide-react';
import { getCityWeatherData } from '../data/cityWeather';
import type { PackingItem, WeatherDay } from '../types';
import PageHeader from '../components/PageHeader';
import { useTrip } from '../context/TripContext';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const HOURLY_LABELS = ['8 AM', '12 PM', '4 PM', '8 PM'];
const CITY_TEMPERATURE_PROFILES: Record<string, number[]> = {
  Paris: [0.2, 0.75, 1, 0.45],
  Barcelona: [0.22, 0.82, 1, 0.62],
  Rome: [0.25, 0.84, 1, 0.64],
  Istanbul: [0.2, 0.72, 1, 0.48],
};

function buildForecast(startDate: string, cityKey: string): WeatherDay[] {
  const base = new Date(startDate);
  const valid = !isNaN(base.getTime());
  return getCityWeatherData(cityKey).forecast.map((d, i) => {
    let date = `Day ${i + 1}`;
    let day  = '—';
    if (valid) {
      const cur = new Date(base);
      cur.setDate(base.getDate() + i);
      date = `${MONTHS[cur.getMonth()]} ${cur.getDate()}`;
      day  = WEEK_DAYS[cur.getDay()];
    }
    return { ...d, date, day };
  });
}

function weatherInsight(day: WeatherDay, city: string): string {
  const c = day.condition.toLowerCase();
  if (c.includes('thunder'))
    return `⛈️ ${day.day} brings thunderstorms to ${city}. Stay indoors — ideal for museums, galleries and a long café lunch. Keep an eye on local alerts.`;
  if (c.includes('rain'))
    return `🌧️ ${day.day} looks rainy in ${city}. Great day for indoor attractions and cosy cafés. Pack your umbrella!`;
  if (c.includes('overcast') || c.includes('cloud'))
    return `☁️ ${day.day} is overcast but mostly dry — perfect for outdoor walks without the harsh glare. Bring a light layer for the evening.`;
  return `☀️ Beautiful weather for exploring ${city}! Apply sunscreen, stay hydrated and make the most of the sunshine.`;
}

function hourlyTemperatureTrend(day: WeatherDay, city: string): number[] {
  const range = day.high - day.low;
  const profile = CITY_TEMPERATURE_PROFILES[city] ?? [0.2, 0.78, 1, 0.5];
  return profile.map((point) => Math.round(day.low + range * point));
}

function TemperatureTrend({ day, city }: { day: WeatherDay; city: string }) {
  const temperatures = hourlyTemperatureTrend(day, city);
  const chartWidth = 420;
  const chartHeight = 160;
  const left = 30;
  const right = 392;
  const top = 30;
  const bottom = 112;
  const minTemperature = Math.min(...temperatures) - 2;
  const maxTemperature = Math.max(...temperatures) + 2;
  const temperatureRange = maxTemperature - minTemperature;
  const points = temperatures.map((temperature, index) => {
    const x = left + (index * (right - left)) / (temperatures.length - 1);
    const y = bottom - ((temperature - minTemperature) / temperatureRange) * (bottom - top);
    return { temperature, x, y };
  });
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
  const areaPath = `${linePath} L ${right} ${bottom} L ${left} ${bottom} Z`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h4 className="text-sm font-bold text-gray-900">Daytime temperature trend</h4>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {city} · {day.day}, {day.date}
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600">
          {day.low}° - {day.high}°C
        </span>
      </div>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
        role="img"
        aria-label={`${city} temperature trend for ${day.day}: ${HOURLY_LABELS.map((label, index) => `${label} ${temperatures[index]} degrees Celsius`).join(', ')}`}
      >
        <defs>
          <linearGradient id="temperature-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[top, (top + bottom) / 2, bottom].map((y) => (
          <line
            key={y}
            x1={left}
            x2={right}
            y1={y}
            y2={y}
            stroke="#e5e7eb"
            strokeDasharray="4 5"
          />
        ))}
        <path d={areaPath} fill="url(#temperature-area)" />
        <path
          d={linePath}
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <g key={HOURLY_LABELS[index]}>
            <circle cx={point.x} cy={point.y} r="5" fill="white" stroke="#2563eb" strokeWidth="2.5" />
            <text
              x={point.x}
              y={point.y - 13}
              textAnchor="middle"
              className="fill-gray-700 text-[11px] font-bold"
            >
              {point.temperature}°
            </text>
            <text
              x={point.x}
              y={bottom + 26}
              textAnchor="middle"
              className="fill-gray-400 text-[11px] font-medium"
            >
              {HOURLY_LABELS[index]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

const packingSuggestions = ['rain plan', 'light packing', 'evening outfits', 'family trip'];

const shopOptions = [
  { name: 'Glovo', delivery: '25-40 min', price: 'EUR 8-24' },
  { name: 'Local pharmacy', delivery: '20-35 min', price: 'EUR 5-20' },
  { name: 'Travel store', delivery: '45-60 min', price: 'EUR 12-45' },
  { name: 'Supermarket', delivery: '30-50 min', price: 'EUR 4-18' },
];

function packingChatResponse(
  request: string,
  city: string,
  startDate: string,
  endDate: string,
  forecast: WeatherDay[],
  selectedDay: WeatherDay,
): string {
  const prompt = request.toLowerCase();
  const rainyDays = forecast.filter((forecastDay) =>
    /rain|thunder/i.test(forecastDay.condition),
  );
  const lowestTemperature = Math.min(...forecast.map((forecastDay) => forecastDay.low));
  const highestTemperature = Math.max(...forecast.map((forecastDay) => forecastDay.high));
  const tripWindow = `${startDate} to ${endDate}`;

  if (prompt.includes('jacket') || prompt.includes('layer') || prompt.includes('coat')) {
    return rainyDays.length > 0
      ? `Yes. For ${city} (${tripWindow}), bring a light waterproof jacket: ${rainyDays.length} forecast day${rainyDays.length === 1 ? '' : 's'} may be wet and lows reach ${lowestTemperature}°C.`
      : `A light evening layer is enough for ${city} (${tripWindow}); the forecast is mostly dry with lows around ${lowestTemperature}°C.`;
  }
  if (prompt.includes('rain') || prompt.includes('umbrella')) {
    return rainyDays.length > 0
      ? `Pack a compact umbrella and a light rain shell for ${city}. Wet weather is forecast on ${rainyDays.map((forecastDay) => forecastDay.day).join(' and ')}, so water-resistant shoes will help too.`
      : `${city} looks dry across these dates, so you can skip heavy rain gear and keep only a compact umbrella if you want backup.`;
  }
  if (
    prompt.includes('restaurant') ||
    prompt.includes('dinner') ||
    prompt.includes('evening') ||
    prompt.includes('outfit')
  ) {
    return `For evenings in ${city}, add one smart-casual outfit and comfortable dress shoes. A light layer works after dinner when temperatures can fall to about ${lowestTemperature}°C.`;
  }
  if (prompt.includes('light') || prompt.includes('lighter') || prompt.includes('minimal')) {
    return `For a lighter ${city} bag, use repeatable layers, one walking shoe, travel-size sunscreen, and only compact weather gear. Keep protection for the ${lowestTemperature}°C to ${highestTemperature}°C forecast range.`;
  }
  if (prompt.includes('family') || prompt.includes('child') || prompt.includes('kids')) {
    return `For a family trip to ${city}, add refillable bottles, sunscreen, snacks, and spare lightweight layers. ${rainyDays.length > 0 ? 'Pack one compact umbrella or rain cover per adult.' : 'The forecast is mostly suitable for outdoor stops.'}`;
  }
  return `For ${city}, ${selectedDay.day} is currently showing ${selectedDay.condition.toLowerCase()} and ${selectedDay.low}°C-${selectedDay.high}°C. I suggest comfortable shoes, flexible layers, and weather protection matched to your plans.`;
}

const categoryIcons: Record<string, string> = {
  Clothing: '👕',
  Footwear: '👟',
  Accessories: '🎒',
  Health: '💊',
  Tech: '🔌',
  Finance: '💳',
};

export default function WeatherPage() {
  const { trip } = useTrip();
  const [selectedDay, setSelectedDay] = useState(0);
  const [packed, setPacked] = useState<Set<string>>(new Set());
  const [customItems, setCustomItems] = useState<PackingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [customItemError, setCustomItemError] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [shoppingItem, setShoppingItem] = useState<PackingItem | null>(null);

  // Rebuild forecast whenever city or start date changes
  const weatherForecast = useMemo(
    () => buildForecast(trip.startDate, trip.city),
    [trip.city, trip.startDate],
  );

  const cityWeather = getCityWeatherData(trip.city);
  const packingList = [...cityWeather.packingList, ...customItems];

  // Packing interactions are specific to the active trip forecast.
  useEffect(() => {
    setSelectedDay(0);
    setPacked(new Set());
    setCustomItems([]);
    setNewItemName('');
    setCustomItemError('');
    setChatInput('');
    setChatMessages([]);
    setShoppingItem(null);
  }, [trip.city, trip.startDate, trip.endDate]);

  const day = weatherForecast[selectedDay] ?? weatherForecast[0];
  const categories = [...new Set(packingList.map((p) => p.category))];

  const togglePacked = (item: string) => {
    setPacked((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const addCustomItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const itemName = newItemName.trim();
    if (!itemName) return;
    if (packingList.some((packingItem) => packingItem.item.toLowerCase() === itemName.toLowerCase())) {
      setCustomItemError('That item is already in your packing list.');
      return;
    }
    setCustomItems((items) => [
      ...items,
      {
        item: itemName,
        category: 'Custom items',
        reason: `Added for your ${trip.city} trip`,
      },
    ]);
    setNewItemName('');
    setCustomItemError('');
  };

  const askPackingAssistant = (question: string) => {
    const request = question.trim();
    if (!request) return;
    const response = packingChatResponse(
      request,
      trip.city,
      trip.startDate,
      trip.endDate,
      weatherForecast,
      day,
    );
    setChatMessages((messages) => [
      ...messages,
      { role: 'user', text: request },
      { role: 'assistant', text: response },
    ]);
    setChatInput('');
  };

  const packedCount = packed.size;
  const totalCount = packingList.length;
  const progress = Math.round((packedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Weather & Packing"
        subtitle={`${trip.city} · ${trip.startDate} – ${trip.endDate}`}
        gradient
      />

      {/* Current weather summary */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-2 pb-6">
          <div className="md:flex md:items-end md:justify-between">
            <div className="flex items-center justify-between md:gap-12">
              <div>
                <div className="text-6xl md:text-7xl font-black text-white">{day.high}°</div>
                <div className="text-blue-100 text-sm mt-1">{day.condition}</div>
                <div className="text-blue-200 text-xs mt-0.5">
                  {day.day}, {day.date}
                </div>
              </div>
              <div className="text-center md:ml-8">
                <div className="text-6xl md:text-7xl">{day.icon}</div>
                <div className="text-blue-100 text-xs mt-1">Low {day.low}°</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5">
                <Droplets size={13} className="text-blue-100" />
                <span className="text-white text-xs font-medium">{day.humidity}% humidity</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5">
                <Wind size={13} className="text-blue-100" />
                <span className="text-white text-xs font-medium">{day.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-day forecast strip */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-3 relative z-10">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-3">
          <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide md:overflow-visible md:justify-between">
            {weatherForecast.map((d, i) => (
              <button
                key={d.date}
                onClick={() => setSelectedDay(i)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 md:px-4 py-2.5 rounded-xl transition-all ${
                  selectedDay === i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span
                  className={`text-[10px] font-bold ${
                    selectedDay === i ? 'text-blue-100' : 'text-gray-400'
                  }`}
                >
                  {d.day}
                </span>
                <span className="text-xl">{d.icon}</span>
                <span className="text-sm font-black">{d.high}°</span>
                <span
                  className={`text-[10px] ${
                    selectedDay === i ? 'text-blue-200' : 'text-gray-400'
                  }`}
                >
                  {d.low}°
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column layout on desktop */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5 md:grid md:grid-cols-2 md:gap-8 pb-6">
        {/* LEFT: AI insight */}
        <div className="space-y-5">
          {/* AI weather insight */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">AI Weather Insight</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                {weatherInsight(day, trip.city)}
              </p>
            </div>
          </div>

          {/* Daily breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3">
              {day.day} — {day.date} Forecast
            </h4>
            <div className="space-y-2.5">
              {[
                { label: 'Morning', icon: '🌤️', temp: `${day.low}° – ${Math.round((day.low + day.high) / 2)}°`, note: 'Light jacket recommended' },
                { label: 'Afternoon', icon: day.icon, temp: `${day.high}°`, note: day.condition },
                { label: 'Evening', icon: '🌆', temp: `${Math.round(day.low + 3)}°`, note: 'Cool down — bring a layer' },
              ].map((period) => (
                <div
                  key={period.label}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50"
                >
                  <span className="text-xl">{period.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-800">{period.label}</div>
                    <div className="text-[10px] text-gray-500">{period.note}</div>
                  </div>
                  <span className="text-sm font-black text-gray-700">{period.temp}</span>
                </div>
              ))}
            </div>
          </div>

          <TemperatureTrend day={day} city={trip.city} />
        </div>

        {/* RIGHT: Packing list */}
        <div className="mt-5 md:mt-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">AI Packing List</h3>
              <p className="text-xs text-gray-400 mt-0.5">Based on your {trip.city} forecast</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-blue-600">{progress}%</span>
              <p className="text-[10px] text-gray-400">
                {packedCount}/{totalCount} packed
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-gray-100 rounded-full h-2 mb-5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* AI packing chat */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-3.5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Bot size={16} className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Ask AI about packing</h4>
                <p className="text-[10px] text-gray-400">Suggestions use your {trip.city} forecast</p>
              </div>
            </div>
            <div className="h-32 overflow-y-auto bg-gray-50 rounded-xl p-2.5 space-y-2 mb-3">
              {chatMessages.length === 0 && (
                <p className="text-xs text-gray-400 leading-relaxed">
                  Ask what to bring for the weather or your plans in {trip.city}.
                </p>
              )}
              {chatMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[92%] rounded-xl px-2.5 py-2 text-xs leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-white border border-gray-100 text-gray-600'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {packingSuggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => askPackingAssistant(suggestion)}
                  className="text-[11px] font-medium text-blue-600 bg-blue-50 rounded-full px-2.5 py-1 hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                askPackingAssistant(chatInput);
              }}
            >
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Do I need a jacket?"
                aria-label="Ask about packing"
                className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                aria-label="Send packing question"
                className="rounded-xl bg-blue-600 px-3 text-white hover:bg-blue-700 transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Manual packing item */}
          <form onSubmit={addCustomItem} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 mb-5">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Add packing item</h4>
            <div className="flex gap-2">
              <input
                value={newItemName}
                onChange={(event) => {
                  setNewItemName(event.target.value);
                  setCustomItemError('');
                }}
                placeholder="Item name"
                aria-label="Packing item name"
                className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                className="flex items-center gap-1 rounded-xl bg-gray-900 px-3 text-xs font-semibold text-white hover:bg-gray-700 transition-colors"
              >
                <Plus size={13} />
                Add item
              </button>
            </div>
            {customItemError && <p className="text-[11px] text-red-500 mt-2">{customItemError}</p>}
          </form>

          {/* Packing items by category */}
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-base">{categoryIcons[cat] || '📦'}</span>
                <h4 className="text-sm font-bold text-gray-700">{cat}</h4>
                <span className="text-xs text-gray-400">
                  ({packingList.filter((p) => p.category === cat && packed.has(p.item)).length}/
                  {packingList.filter((p) => p.category === cat).length})
                </span>
              </div>
              <div className="space-y-2">
                {packingList
                  .filter((p) => p.category === cat)
                  .map((p) => (
                    <div
                      key={p.item}
                      className={`w-full bg-white rounded-xl border p-2 flex items-center gap-2 transition-all ${
                        packed.has(p.item)
                          ? 'border-emerald-200 bg-emerald-50/50'
                          : 'border-gray-100'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => togglePacked(p.item)}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left rounded-lg p-1 hover:bg-gray-50 transition-colors"
                      >
                        {packed.has(p.item) ? (
                          <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle size={18} className="text-gray-300 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-sm font-semibold ${
                              packed.has(p.item) ? 'text-gray-400 line-through' : 'text-gray-800'
                            }`}
                          >
                            {p.item}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-0.5">{p.reason}</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShoppingItem(p)}
                        className="flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-2 py-1.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <ShoppingBag size={12} />
                        Shop
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {progress === 100 && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-center mt-4">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-white font-bold text-sm">All packed! Have a wonderful trip!</p>
              <p className="text-emerald-100 text-xs mt-1">Bon voyage to {trip.city}!</p>
            </div>
          )}
        </div>
      </div>

      {shoppingItem && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/55 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
          onClick={() => setShoppingItem(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Shop ${shoppingItem.item}`}
            className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-bold text-blue-600">Shop for your {trip.city} trip</p>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{shoppingItem.item}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Shop this item from Glovo or nearby stores.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShoppingItem(null)}
                aria-label="Close shopping options"
                className="rounded-lg bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {shopOptions.map((option) => (
                <div
                  key={option.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-800">{option.name}</p>
                    <p className="text-[11px] text-gray-400">Delivery in {option.delivery}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{option.price}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-4">
              Prototype options only. Availability and pricing are simulated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
