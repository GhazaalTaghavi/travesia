import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  UtensilsCrossed,
  CloudSun,
  CalendarDays,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  ArrowRight,
  Compass,
  ScanLine,
  PartyPopper,
  Settings2,
  Pencil,
  Luggage,
  BedDouble,
} from 'lucide-react';
import { localEvents } from '../data/mockData';
import { getCityPageData } from '../data/cityData';
import { useTrip } from '../context/TripContext';

const CITY_OPTIONS = [
  {
    city: 'Paris',
    country: 'France',
    coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    description: 'Experience the magic of the City of Light — art, culture, cuisine and romance await.',
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
    description: 'Discover the vibrant Catalan capital — Gaudí, tapas, beaches and endless sunshine.',
  },
  {
    city: 'Rome',
    country: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    description: 'Step back in time in the Eternal City — ancient ruins, world-class art and la dolce vita.',
  },
  {
    city: 'Istanbul',
    country: 'Turkey',
    coverImage: 'https://images.unsplash.com/photo-1545041019-38cfd79c8cfa?w=800&q=80',
    description: 'Where East meets West — stunning mosques, bustling bazaars and incredible Bosphorus views.',
  },
];

const features = [
  {
    to: '/landmarks',
    icon: Compass,
    label: 'Attractions',
    description: 'Top sights & landmarks',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    to: '/scan',
    icon: ScanLine,
    label: 'Landmark Identifier',
    description: 'Identify landmarks from a photo',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    to: '/food',
    icon: UtensilsCrossed,
    label: 'Food & Drinks',
    description: 'Best restaurants nearby',
    color: 'from-orange-400 to-rose-500',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    to: '/weather',
    icon: CloudSun,
    label: 'Weather',
    description: 'Pack smart for your trip',
    color: 'from-cyan-400 to-blue-500',
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
  {
    to: '/events',
    icon: PartyPopper,
    label: 'Local Events',
    description: "What's on in the city",
    color: 'from-pink-400 to-rose-500',
    bg: 'bg-pink-50',
    iconColor: 'text-pink-500',
  },
  {
    to: '/planner',
    icon: CalendarDays,
    label: 'Day Planner',
    description: 'Your AI itinerary',
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    to: '/travel-stay',
    icon: BedDouble,
    label: 'Travel & Stay',
    description: 'Transport and accommodation',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
];

export default function HomePage() {
  const { trip, updateTrip, openSettings } = useTrip();

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const opt = CITY_OPTIONS.find((o) => `${o.city}, ${o.country}` === e.target.value);
    if (opt) updateTrip({ city: opt.city, country: opt.country, coverImage: opt.coverImage, description: opt.description });
  };

  const cityData = getCityPageData(trip.city);
  const topLandmark = cityData.landmarks[0];
  const featuredEvent = localEvents.find((e) => e.isFeatured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.city}
          className="w-full h-72 md:h-[420px] object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

        {/* Mobile header (hidden on desktop — TopNav handles it) */}
        <div className="md:hidden absolute top-0 left-0 right-0 px-4 pt-10 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Luggage size={14} strokeWidth={2.25} className="text-blue-600" />
            </div>
            <span className="text-white font-bold text-lg tracking-wide">TRAVESIA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Sparkles size={13} className="text-amber-300" />
              <span className="text-white text-xs font-medium">AI Powered</span>
            </div>
            {/* Mobile settings trigger */}
            <button
              onClick={openSettings}
              className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/30 transition-colors"
              aria-label="Edit trip settings"
            >
              <Settings2 size={15} className="text-white" />
            </button>
          </div>
        </div>

        {/* City info overlay */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-5 md:pb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <MapPin size={14} className="text-cyan-300" />
                <span className="text-cyan-300 text-sm font-medium">{trip.country}</span>
              </div>
              <h2 className="text-white text-4xl md:text-6xl font-black leading-none">
                {trip.city}
              </h2>
              <p className="text-white/80 text-sm md:text-base mt-1.5 max-w-md">
                {trip.description}
              </p>
            </div>

            {/* Trip date card — clickable to edit */}
            <button
              onClick={openSettings}
              className="text-right hidden sm:block group"
              aria-label="Edit trip details"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-white/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                    Your Trip
                  </span>
                  <Pencil
                    size={11}
                    className="text-white/60 group-hover:text-white transition-colors ml-3"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-white/90 text-xs mb-1">
                  <Calendar size={12} />
                  <span>{trip.startDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/90 text-xs mb-1">
                  <span className="text-white/50 ml-4">→</span>
                  <span>{trip.endDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/90 text-xs">
                  <Users size={12} />
                  <span>
                    {trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Search bar */}
        <div className="-mt-5 relative z-10 md:max-w-2xl md:mx-0">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 px-4 py-3.5">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <div className="relative flex-1 flex items-center">
              <select
                value={`${trip.city}, ${trip.country}`}
                onChange={handleCityChange}
                className="w-full text-sm text-gray-700 outline-none bg-transparent appearance-none cursor-pointer pr-5"
              >
                {CITY_OPTIONS.map((opt) => (
                  <option key={opt.city} value={`${opt.city}, ${opt.country}`}>
                    {opt.city}, {opt.country}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-0 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={openSettings}
              className="bg-blue-600 text-white rounded-xl px-4 py-1.5 text-xs font-semibold flex items-center gap-1 whitespace-nowrap hover:bg-blue-700 transition-colors"
            >
              <Sparkles size={12} />
              Plan Trip
            </button>
          </div>
        </div>
      </div>

      {/* ── Explore Tools ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base md:text-lg font-bold text-gray-900">Explore Tools</h3>
          <span className="text-xs text-blue-600 font-medium">All AI-powered</span>
        </div>
        {/* Mobile: 3 cols; desktop: tools in a single row */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
          {features.map(({ to, icon: Icon, label, description, bg, iconColor }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-2xl p-3.5 md:p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <div
                className={`w-11 h-11 md:w-12 md:h-12 ${bg} rounded-xl flex items-center justify-center`}
              >
                <Icon size={22} className={iconColor} strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 leading-tight">{label}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-tight hidden md:block">
                  {description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Main content: two-column on desktop ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-7 md:grid md:grid-cols-3 md:gap-6 pb-6">
        {/* LEFT (2/3): Today's Highlight */}
        <div className="md:col-span-2 space-y-5">
          {/* Today's Highlight */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base md:text-lg font-bold text-gray-900">Today's Highlight</h3>
              <Link
                to="/planner"
                className="text-xs text-blue-600 font-medium flex items-center gap-1"
              >
                Full Plan <ChevronRight size={13} />
              </Link>
            </div>
            <Link to="/planner" className="block">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-5 md:p-6 text-white shadow-lg shadow-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CalendarDays size={14} className="text-blue-200" />
                      <span className="text-blue-100 text-xs">Day 1 · {trip.startDate}</span>
                    </div>
                    <h4 className="text-xl md:text-2xl font-black">Arrival &amp; Eiffel Tower</h4>
                    <p className="text-blue-100 text-sm mt-1 hidden md:block">
                      Your first evening in the City of Light — an unforgettable start.
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-full p-2.5">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { time: '3:00 PM', title: 'Eiffel Tower summit visit' },
                    { time: '7:30 PM', title: 'Dinner at Le Bouillon Chartier' },
                    { time: '9:30 PM', title: 'Eiffel light show at Trocadéro' },
                  ].map((item) => (
                    <div key={item.time} className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-lg px-2.5 py-1 text-[10px] font-bold text-white w-16 text-center flex-shrink-0">
                        {item.time}
                      </div>
                      <span className="text-sm text-white/90">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>

          {/* Featured Event — shown in left col on desktop */}
          {featuredEvent && (
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base md:text-lg font-bold text-gray-900">Featured Event</h3>
                <Link
                  to="/events"
                  className="text-xs text-blue-600 font-medium flex items-center gap-1"
                >
                  See all <ChevronRight size={13} />
                </Link>
              </div>
              <Link to="/events">
                <div className="relative rounded-2xl overflow-hidden h-44 shadow-sm">
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {featuredEvent.price === 'Free' ? 'FREE' : featuredEvent.price}
                      </span>
                      <span className="text-white/70 text-xs">{featuredEvent.date}</span>
                    </div>
                    <h4 className="text-white font-bold text-lg leading-tight">
                      {featuredEvent.title}
                    </h4>
                    <p className="text-white/70 text-xs mt-0.5">{featuredEvent.venue}</p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT (1/3): Top Landmark + AI tip */}
        <div className="md:col-span-1 space-y-5 mt-5 md:mt-0">
          {/* Top Landmark */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">Top Landmark</h3>
              <Link
                to="/landmarks"
                className="text-xs text-blue-600 font-medium flex items-center gap-1"
              >
                See all <ChevronRight size={13} />
              </Link>
            </div>
            <Link to="/landmarks" className="block">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative h-40">
                  <img
                    src={topLandmark.image}
                    alt={topLandmark.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <span className="text-white/70 text-xs">{topLandmark.category}</span>
                      <h4 className="text-white font-bold text-base">{topLandmark.name}</h4>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-white text-xs font-bold">{topLandmark.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin size={12} />
                    <span className="text-xs">{topLandmark.distance} away</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock size={12} />
                    <span className="text-xs">{topLandmark.hours}</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      topLandmark.openNow
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {topLandmark.openNow ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* AI Tip card (desktop only) */}
          <div className="hidden md:block bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles size={13} className="text-white" />
              </div>
              <p className="text-xs font-bold text-amber-900">AI Travel Tip</p>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              {cityData.aiTip}
            </p>
          </div>
        </div>
      </div>

      {/* ── Featured Event (mobile only) ── */}
      {featuredEvent && (
        <div className="md:hidden max-w-7xl mx-auto px-4 md:px-8 mt-0 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900">Featured Event</h3>
            <Link
              to="/events"
              className="text-xs text-blue-600 font-medium flex items-center gap-1"
            >
              See all <ChevronRight size={13} />
            </Link>
          </div>
          <Link to="/events">
            <div className="relative rounded-2xl overflow-hidden h-36 shadow-sm">
              <img
                src={featuredEvent.image}
                alt={featuredEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {featuredEvent.price === 'Free' ? 'FREE' : featuredEvent.price}
                  </span>
                  <span className="text-white/70 text-xs">{featuredEvent.date}</span>
                </div>
                <h4 className="text-white font-bold text-base leading-tight">
                  {featuredEvent.title}
                </h4>
                <p className="text-white/70 text-xs mt-0.5">{featuredEvent.venue}</p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
