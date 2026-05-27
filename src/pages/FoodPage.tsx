import { useEffect, useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Heart,
  Camera,
  Upload,
  Sparkles,
  Navigation,
  Bookmark,
  X,
  CalendarPlus,
} from 'lucide-react';
import { getCityFoodData } from '../data/cityFood';
import PageHeader from '../components/PageHeader';
import MapModal from '../components/MapModal';
import { useTrip } from '../context/TripContext';
import type { Restaurant } from '../types';

type Tab = 'restaurants' | 'menu' | 'identifier';

interface RestaurantIdentification {
  reservation: string;
  reviewSummary: string;
  decision: 'Good choice' | 'Maybe skip' | 'Book ahead';
  reason: string;
}

interface MenuHighlight {
  original: string;
  translated: string;
  explanation: string;
  tags: string[];
}

interface MenuScanResult {
  highlights: MenuHighlight[];
  authenticOrder: string;
  pairingReason: string;
  priceEstimate: string;
}

interface DiningGuidance {
  recommendation: string;
  reviewSummary: string;
  reason: string;
  reservationAdvice: string;
}

const priceFilters = ['All', '€', '€€', '€€€', '€€€€'];

const diningGuidanceByCity: Record<string, DiningGuidance> = {
  Paris: {
    recommendation: 'Good choice for classic Paris dining',
    reviewSummary:
      'Diners value traditional cooking and a lively Paris atmosphere, with peak dinner hours often feeling busy.',
    reason:
      'This fits a French-food focused visit and gives you an approachable taste of the city beyond sightseeing.',
    reservationAdvice: 'Reserve for dinner where available; for casual bistros, arrive before noon or 7 PM.',
  },
  Barcelona: {
    recommendation: 'Good choice for local Catalan flavors',
    reviewSummary:
      'Reviews highlight fresh ingredients and sociable dining, while popular market and tapas spots can have lines.',
    reason:
      'This is a strong way to sample Barcelona dining culture and share regional dishes at a relaxed pace.',
    reservationAdvice: 'Book seafood dinners; for market counters or tapas bars, go early and expect to wait.',
  },
  Rome: {
    recommendation: 'Book ahead for an authentic Roman meal',
    reviewSummary:
      'Guests praise simple, rich Roman classics and neighborhood energy; the most loved tables fill quickly at night.',
    reason:
      'The signature dish offers a clear introduction to Roman cooking, especially away from the busiest landmarks.',
    reservationAdvice: 'Reserve for dinner after 8 PM, especially in Trastevere; quick street-food stops need no booking.',
  },
  Istanbul: {
    recommendation: 'Good choice for local Turkish food',
    reviewSummary:
      'Visitors enjoy generous regional dishes and warm service, with destination restaurants busier in the evening.',
    reason:
      'It showcases Istanbul food traditions and the selected specialty is a useful alternative to generic tourist menus.',
    reservationAdvice: 'Book evening dining and waterfront tables; street-food and pastry stops are usually walk-in.',
  },
};

const restaurantIdentificationByCity: Record<string, RestaurantIdentification> = {
  Paris: {
    reservation: 'Not required for lunch; expect a short queue',
    reviewSummary:
      'Travelers praise the lively historic dining room, fair prices, and dependable French comfort dishes.',
    decision: 'Good choice',
    reason:
      'It offers classic Paris bistro cooking at a reasonable price and is currently open nearby.',
  },
  Barcelona: {
    reservation: 'Not accepted; arrive early for a counter seat',
    reviewSummary:
      'Visitors love the fresh market ingredients and energetic atmosphere, but mention lines at peak lunch hours.',
    decision: 'Good choice',
    reason:
      'The market setting and highly rated Catalan cooking make this an excellent casual local stop.',
  },
  Rome: {
    reservation: 'Recommended for dinner',
    reviewSummary:
      'Guests consistently enjoy generous Roman pasta and the Trastevere atmosphere; evenings get very busy.',
    decision: 'Book ahead',
    reason:
      'It is a strong choice for Roman classics, but its popularity means dinner tables fill quickly.',
  },
  Istanbul: {
    reservation: 'Recommended for evening dining',
    reviewSummary:
      'Diners highlight refined Turkish home-style recipes and attentive service in a fashionable Karakoy setting.',
    decision: 'Book ahead',
    reason:
      'It is well rated for a local Turkish dinner and the evening service is in high demand.',
  },
};

const menuScanByCity: Record<string, MenuScanResult> = {
  Paris: {
    highlights: [
      {
        original: "Soupe à l'Oignon",
        translated: 'French onion soup',
        explanation: 'Slow-cooked onions in broth topped with toasted bread and melted Gruyere.',
        tags: ['local', 'classic', 'vegetarian'],
      },
      {
        original: 'Confit de Canard',
        translated: 'Duck confit',
        explanation: 'Tender preserved duck leg served crisp, usually with sauteed potatoes.',
        tags: ['local', 'classic'],
      },
      {
        original: 'Crème Brûlée',
        translated: 'Caramelized custard',
        explanation: 'Cool vanilla custard beneath a thin crackling sugar top.',
        tags: ['classic', 'dessert'],
      },
    ],
    authenticOrder: "Onion soup + duck confit + crème brûlée",
    pairingReason:
      'A warming bistro starter leads into rich duck, with a light caramelized custard finish for a traditional Paris meal.',
    priceEstimate: 'Estimated total: €42-€48 per person',
  },
  Barcelona: {
    highlights: [
      {
        original: 'Pan con Tomate',
        translated: 'Tomato-rubbed bread',
        explanation: 'Crisp bread rubbed with ripe tomato, garlic, olive oil, and salt.',
        tags: ['local', 'classic', 'vegetarian', 'budget-friendly'],
      },
      {
        original: 'Paella de Marisco',
        translated: 'Seafood paella',
        explanation: 'Saffron rice cooked in a pan with prawns, mussels, and squid.',
        tags: ['local', 'seafood'],
      },
      {
        original: 'Crema Catalana',
        translated: 'Catalan burnt cream',
        explanation: 'Citrus-and-cinnamon custard with a crisp caramel top.',
        tags: ['local', 'dessert'],
      },
    ],
    authenticOrder: 'Pan con tomate + seafood paella + crema catalana',
    pairingReason:
      'Simple tomato bread opens the meal without masking the seafood rice, followed by Catalonia\'s signature creamy dessert.',
    priceEstimate: 'Estimated total: €34-€44 per person',
  },
  Rome: {
    highlights: [
      {
        original: 'Cacio e Pepe',
        translated: 'Cheese and pepper pasta',
        explanation: 'Pasta coated with Pecorino Romano and black pepper; creamy without cream.',
        tags: ['local', 'classic', 'vegetarian'],
      },
      {
        original: 'Saltimbocca alla Romana',
        translated: 'Veal with prosciutto and sage',
        explanation: 'Thin veal cooked with salty cured ham, sage, and a white-wine pan sauce.',
        tags: ['local', 'classic'],
      },
      {
        original: 'Tiramisù',
        translated: 'Coffee mascarpone dessert',
        explanation: 'Espresso-soaked biscuits layered with soft mascarpone cream and cocoa.',
        tags: ['classic', 'dessert'],
      },
    ],
    authenticOrder: 'Cacio e pepe + saltimbocca + tiramisu',
    pairingReason:
      'Peppery Pecorino pasta and savory sage veal showcase Roman cooking, while coffee dessert gives a balanced finish.',
    priceEstimate: 'Estimated total: €38-€48 per person',
  },
  Istanbul: {
    highlights: [
      {
        original: 'Mezeler',
        translated: 'Small shared starters',
        explanation: 'A selection such as hummus, eggplant salad, and yogurt dips served with bread.',
        tags: ['local', 'vegetarian'],
      },
      {
        original: 'Kuzu Kebap',
        translated: 'Grilled lamb kebab',
        explanation: 'Seasoned lamb grilled over charcoal, typically served with rice and vegetables.',
        tags: ['local', 'classic'],
      },
      {
        original: 'Baklava ve Türk Çayı',
        translated: 'Baklava with Turkish tea',
        explanation: 'Crisp pistachio pastry in syrup paired with small glasses of black tea.',
        tags: ['local', 'dessert', 'budget-friendly'],
      },
    ],
    authenticOrder: 'Mezze to share + lamb kebab + baklava with Turkish tea',
    pairingReason:
      'Cool shared starters complement smoky grilled lamb, then sweet pistachio pastry and tea close a classic Istanbul meal.',
    priceEstimate: 'Estimated total: €28-€38 per person',
  },
};

export default function FoodPage() {
  const { trip } = useTrip();

  return <FoodPageContent key={trip.city} />;
}

function FoodPageContent() {
  const {
    trip,
    plannedRestaurants,
    savedRestaurants,
    addRestaurantToPlan,
    saveRestaurant,
  } = useTrip();
  const cityFood = getCityFoodData(trip.city);

  const [tab, setTab] = useState<Tab>('restaurants');
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState('All');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [mapRestaurant, setMapRestaurant] = useState<Restaurant | null>(null);
  const [notice, setNotice] = useState('');
  const [isMenuScanned, setIsMenuScanned] = useState(false);
  const [isRestaurantIdentified, setIsRestaurantIdentified] = useState(false);
  const [isRecommendationSaved, setIsRecommendationSaved] = useState(false);
  const [isIdentifiedRestaurantSaved, setIsIdentifiedRestaurantSaved] = useState(false);

  const menuScan = menuScanByCity[trip.city] ?? menuScanByCity.Paris;
  const identification =
    restaurantIdentificationByCity[trip.city] ?? restaurantIdentificationByCity.Paris;
  const identifiedRestaurant = cityFood.restaurants[0];
  const diningGuidance = diningGuidanceByCity[trip.city] ?? diningGuidanceByCity.Paris;

  const filteredRestaurants = cityFood.restaurants.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase());
    const matchPrice = priceFilter === 'All' || r.priceRange === priceFilter;
    return matchSearch && matchPrice;
  });

  useEffect(() => {
    if (!selectedRestaurant) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedRestaurant(null);
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedRestaurant]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const isPlanned = (restaurant: Restaurant) =>
    plannedRestaurants.some((item) => item.city === trip.city && item.id === restaurant.id);

  const isSaved = (restaurant: Restaurant) =>
    savedRestaurants.some((item) => item.city === trip.city && item.id === restaurant.id);

  function reserve(restaurant: Restaurant) {
    setNotice(`Reservation request saved for your trip: ${restaurant.name}.`);
  }

  function addToPlan(restaurant: Restaurant) {
    const alreadyPlanned = isPlanned(restaurant);
    addRestaurantToPlan(restaurant);
    setNotice(
      alreadyPlanned
        ? `${restaurant.name} is already in your dining plans.`
        : `${restaurant.name} was added to your dining plans.`,
    );
  }

  function saveForTrip(restaurant: Restaurant) {
    const alreadySaved = isSaved(restaurant);
    saveRestaurant(restaurant);
    setNotice(
      alreadySaved ? `${restaurant.name} is already saved.` : `${restaurant.name} was saved.`,
    );
  }

  function getDirections(restaurant: Restaurant) {
    setSelectedRestaurant(null);
    setMapRestaurant(restaurant);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Food & Drinks"
        subtitle={`${trip.city}, ${trip.country} · Best dining`}
        gradient
      />

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex">
            {(['restaurants', 'menu', 'identifier'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 md:flex-none md:px-6 py-3.5 px-1 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                  tab === t
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {t === 'restaurants'
                  ? 'Restaurants'
                  : t === 'menu'
                    ? 'Menu Scanner'
                    : 'Restaurant Identifier'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === 'restaurants' && (
        <>
          {/* Search + filters */}
          <div className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-3">
              <div className="md:flex md:items-center md:gap-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3.5 py-2.5 md:flex-1">
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search restaurants..."
                    className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2 mt-3 md:mt-0 overflow-x-auto scrollbar-hide">
                  {priceFilters.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriceFilter(p)}
                      className={`flex-shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${
                        priceFilter === p
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* AI pick */}
            <div className="mt-4 bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-100 rounded-2xl p-3.5 flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="text-xs font-bold text-orange-800">AI Food Tip</p>
                <p className="text-xs text-orange-600 mt-0.5">{cityFood.foodTip}</p>
              </div>
            </div>

            {/* Restaurant grid */}
            <div className="mt-4 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRestaurants.map((r) => (
                <div
                  key={r.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedRestaurant(r)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedRestaurant(r);
                    }
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <div className="relative h-44">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <button
                      type="button"
                      aria-label={`Save ${r.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        saveForTrip(r);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
                    >
                      <Heart
                        size={15}
                        className={
                          isSaved(r) ? 'text-rose-500 fill-rose-500' : 'text-gray-400'
                        }
                      />
                    </button>

                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          r.openNow
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-800/70 text-white/80'
                        }`}
                      >
                        {r.openNow ? '● Open' : '● Closed'}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-bold text-base">{r.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-white text-xs font-bold">{r.rating}</span>
                          <span className="text-white/60 text-xs">
                            ({(r.reviewCount / 1000).toFixed(0)}k)
                          </span>
                        </div>
                        <span className="text-white/40">·</span>
                        <span className="text-white/80 text-xs">{r.priceRange}</span>
                        <span className="text-white/40">·</span>
                        <span className="text-white/80 text-xs">{r.cuisine}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={11} />
                        <span>{r.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>{r.hours}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-gray-400 font-medium">Must try: </span>
                        <span className="text-xs text-gray-700 font-semibold">{r.specialDish}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedRestaurant(r);
                          }}
                          className="border border-orange-200 text-orange-600 rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-orange-50 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            reserve(r);
                          }}
                          className="bg-orange-500 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1 hover:bg-orange-600 transition-colors"
                        >
                          Reserve <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'menu' && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Camera size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Scan a menu at your table</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Already inside a restaurant? Photograph the menu to translate dishes and
                  discover what locals would order together in {trip.city}.
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setIsMenuScanned(true)}
                className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors"
              >
                <Camera size={14} />
                Take Photo
              </button>
              <button
                onClick={() => setIsMenuScanned(true)}
                className="flex-1 border border-blue-200 text-blue-600 rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors"
              >
                <Upload size={14} />
                Upload Menu
              </button>
            </div>
          </div>

          {isMenuScanned && (
            <>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5 flex items-start gap-2">
                <Sparkles size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>Menu translated:</strong> AI found local specialties on this {trip.city}{' '}
                  menu and prepared a smart order recommendation.
                </p>
              </div>

              <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">
                Translated Menu Highlights
              </h3>
              <div className="md:grid md:grid-cols-3 md:gap-4 space-y-3 md:space-y-0">
                {menuScan.highlights.map((item) => (
                  <div
                    key={item.original}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                  >
                    <h4 className="text-sm font-bold text-gray-900">{item.original}</h4>
                    <p className="text-xs font-semibold text-blue-600 mt-1">{item.translated}</p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {item.explanation}
                    </p>
                    <div className="flex gap-1.5 flex-wrap mt-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-orange-500" />
                  <h3 className="text-sm font-bold text-gray-900">Recommended Combination</h3>
                </div>
                <p className="text-xs text-gray-500 font-semibold">
                  For a more authentic local experience, order these together:
                </p>
                <p className="text-sm font-bold text-gray-900 mt-2">{menuScan.authenticOrder}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-3">
                  <strong className="text-gray-700">Why these go well together:</strong>{' '}
                  {menuScan.pairingReason}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-orange-600">{menuScan.priceEstimate}</p>
                  <button
                    onClick={() => setIsRecommendationSaved(true)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      isRecommendationSaved
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    <Bookmark size={13} />
                    {isRecommendationSaved ? 'Recommendation Saved' : 'Save Recommendation'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'identifier' && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 pb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Camera size={20} className="text-orange-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Identify a restaurant from the street</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Take a photo of a restaurant exterior or sign. AI will identify it and help
                  you decide whether it is a good place to eat in {trip.city}.
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setIsRestaurantIdentified(true)}
                className="flex-1 bg-orange-500 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-orange-600 transition-colors"
              >
                <Camera size={14} />
                Take Photo
              </button>
              <button
                onClick={() => setIsRestaurantIdentified(true)}
                className="flex-1 border border-orange-200 text-orange-600 rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-orange-50 transition-colors"
              >
                <Upload size={14} />
                Upload Image
              </button>
            </div>
          </div>

          {isRestaurantIdentified && (
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="relative h-48 md:h-56">
                <img
                  src={identifiedRestaurant.image}
                  alt={identifiedRestaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <span
                  className={`absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    identifiedRestaurant.openNow
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-800/80 text-white'
                  }`}
                >
                  {identifiedRestaurant.openNow ? 'Open now' : 'Closed now'}
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] font-bold text-orange-300 uppercase tracking-wider">
                    Restaurant identified
                  </p>
                  <h3 className="text-xl font-bold text-white mt-1">{identifiedRestaurant.name}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{identifiedRestaurant.cuisine}</p>
                </div>
              </div>

              <div className="p-4 md:p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-semibold">Rating</p>
                    <p className="text-sm font-bold text-gray-900 mt-1 flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      {identifiedRestaurant.rating}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {identifiedRestaurant.reviewCount.toLocaleString()} reviews
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-semibold">Price level</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      {identifiedRestaurant.priceRange}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                    <p className="text-[10px] text-gray-400 font-semibold">Location</p>
                    <p className="text-xs font-semibold text-gray-700 mt-1">
                      {identifiedRestaurant.address}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2 text-gray-600">
                    <Clock size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-700">Hours:</strong> {identifiedRestaurant.hours}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <Bookmark size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-700">Reservation:</strong> {identification.reservation}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mt-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Review Summary
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1">
                    {identification.reviewSummary}
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mt-4">
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                    AI Decision
                  </p>
                  <p className="text-lg font-black text-orange-700 mt-1">{identification.decision}</p>
                  <p className="text-xs text-orange-700 leading-relaxed mt-1">
                    {identification.reason}
                  </p>
                  <p className="text-xs text-gray-700 mt-3">
                    <strong>Best dish to try:</strong> {identifiedRestaurant.specialDish}
                  </p>
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => setSelectedRestaurant(identifiedRestaurant)}
                    className="flex-1 bg-orange-500 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-orange-600 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => getDirections(identifiedRestaurant)}
                    className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                  >
                    <Navigation size={13} />
                    Get Directions
                  </button>
                  <button
                    onClick={() => setIsIdentifiedRestaurantSaved((current) => !current)}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                      isIdentifiedRestaurantSaved
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart
                      size={13}
                      className={isIdentifiedRestaurantSaved ? 'fill-emerald-600' : ''}
                    />
                    {isIdentifiedRestaurantSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="fixed z-[60] bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-gray-900 text-white shadow-lg px-4 py-3 text-sm font-medium"
        >
          {notice}
        </div>
      )}

      {selectedRestaurant && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/55 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedRestaurant(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="restaurant-title"
            className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-xl"
          >
            <div className="relative h-60 md:h-72">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              <button
                type="button"
                onClick={() => setSelectedRestaurant(null)}
                aria-label="Close details"
                className="absolute right-4 top-4 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center text-gray-700 hover:bg-white"
              >
                <X size={18} />
              </button>
              <div className="absolute left-5 right-5 bottom-5">
                <span className="inline-flex bg-white/95 rounded-full px-3 py-1 text-xs font-bold text-orange-700">
                  {selectedRestaurant.cuisine}
                </span>
                <h2 id="restaurant-title" className="text-2xl md:text-3xl text-white font-black mt-2">
                  {selectedRestaurant.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/90 mt-2">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    {selectedRestaurant.rating} ({selectedRestaurant.reviewCount.toLocaleString()} reviews)
                  </span>
                  <span className="font-semibold">{selectedRestaurant.priceRange}</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {selectedRestaurant.distance}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">Hours</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{selectedRestaurant.hours}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">Best dish to try</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{selectedRestaurant.specialDish}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 col-span-2 md:col-span-1">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">Neighborhood</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{selectedRestaurant.address}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-700">Review summary</p>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">{diningGuidance.reviewSummary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <div className="border border-orange-100 bg-orange-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-orange-800">AI recommendation</p>
                  <p className="text-base font-black text-orange-700 mt-1">
                    {diningGuidance.recommendation}
                  </p>
                  <p className="text-xs text-orange-700 leading-relaxed mt-2">
                    <strong>Why:</strong> {diningGuidance.reason}
                  </p>
                </div>
                <div className="border border-blue-100 bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-blue-800">Reservation advice</p>
                  <p className="text-xs text-blue-700 leading-relaxed mt-1">
                    {diningGuidance.reservationAdvice}
                  </p>
                  <p className="text-xs text-blue-700 mt-3">
                    <strong>Location:</strong> {selectedRestaurant.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:px-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => reserve(selectedRestaurant)}
                className="flex-1 min-w-28 bg-orange-500 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors"
              >
                Reserve
              </button>
              <button
                type="button"
                onClick={() => addToPlan(selectedRestaurant)}
                className="flex-1 min-w-32 bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <CalendarPlus size={16} />
                {isPlanned(selectedRestaurant) ? 'Added to Plan' : 'Add to Plan'}
              </button>
              <button
                type="button"
                onClick={() => saveForTrip(selectedRestaurant)}
                className="rounded-xl border border-gray-200 text-gray-700 px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Heart size={16} className={isSaved(selectedRestaurant) ? 'fill-orange-500 text-orange-500' : ''} />
                {isSaved(selectedRestaurant) ? 'Saved' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => getDirections(selectedRestaurant)}
                className="rounded-xl border border-orange-200 text-orange-600 px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-orange-50 transition-colors"
              >
                <Navigation size={16} />
                Get Directions
              </button>
              <button
                type="button"
                onClick={() => setSelectedRestaurant(null)}
                className="rounded-xl border border-gray-200 text-gray-600 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      {mapRestaurant && (
        <MapModal
          place={{
            name: mapRestaurant.name,
            city: trip.city,
            country: trip.country,
            address: mapRestaurant.address,
            distance: mapRestaurant.distance,
            nearbyPlaces: cityFood.restaurants
              .filter((restaurant) => restaurant.id !== mapRestaurant.id)
              .slice(0, 3)
              .map((restaurant) => restaurant.name),
          }}
          onClose={() => setMapRestaurant(null)}
          onAddToPlan={() => addToPlan(mapRestaurant)}
          isAdded={isPlanned(mapRestaurant)}
        />
      )}
    </div>
  );
}
