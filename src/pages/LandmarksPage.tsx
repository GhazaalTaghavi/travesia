import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Ticket,
  Map,
  X,
  CalendarPlus,
  Heart,
  Navigation,
} from 'lucide-react';
import { getCityPageData } from '../data/cityData';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import MapModal from '../components/MapModal';
import { useTrip } from '../context/TripContext';
import type { DetailedLandmark } from '../types';

export default function LandmarksPage() {
  const { trip, plannedAttractions, savedAttractions, addAttractionToPlan, saveAttraction } =
    useTrip();
  const landmarks = getCityPageData(trip.city).landmarks;
  const categories = ['All', ...Array.from(new Set(landmarks.map((l) => l.category)))];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLandmark, setSelectedLandmark] = useState<DetailedLandmark | null>(null);
  const [mapLandmark, setMapLandmark] = useState<DetailedLandmark | null>(null);
  const [notice, setNotice] = useState('');

  // Reset filter when city changes so stale categories don't persist
  useEffect(() => {
    setSelectedCategory('All');
    setSearch('');
    setSelectedLandmark(null);
    setMapLandmark(null);
  }, [trip.city]);

  useEffect(() => {
    if (!selectedLandmark) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedLandmark(null);
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedLandmark]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const filtered = landmarks.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || l.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const isPlanned = (landmark: DetailedLandmark) =>
    plannedAttractions.some((item) => item.city === trip.city && item.id === landmark.id);

  const isSaved = (landmark: DetailedLandmark) =>
    savedAttractions.some((item) => item.city === trip.city && item.id === landmark.id);

  function addToPlan(landmark: DetailedLandmark) {
    const alreadyPlanned = isPlanned(landmark);
    addAttractionToPlan(landmark);
    setNotice(
      alreadyPlanned
        ? `${landmark.name} is already in your plan.`
        : `${landmark.name} was added to your plan.`,
    );
  }

  function saveForTrip(landmark: DetailedLandmark) {
    const alreadySaved = isSaved(landmark);
    saveAttraction(landmark);
    setNotice(alreadySaved ? `${landmark.name} is already saved.` : `${landmark.name} was saved.`);
  }

  function getDirections(landmark: DetailedLandmark) {
    setSelectedLandmark(null);
    setMapLandmark(landmark);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Attractions"
        subtitle={`${trip.city}, ${trip.country} · ${landmarks.length} attractions`}
        gradient
        action={
          <button
            type="button"
            onClick={() => setMapLandmark(landmarks[0])}
            aria-label={`View ${trip.city} attraction map`}
            className="p-2 bg-white/20 rounded-full"
          >
            <Map size={18} className="text-white" />
          </button>
        }
      />

      {/* Search + filters */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-3">
          <div className="md:flex md:items-center md:gap-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3.5 py-2.5 md:flex-1">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search landmarks..."
                className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
              />
            </div>
            {/* Category filters */}
            <div className="flex gap-2 mt-3 md:mt-0 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* AI Suggestion banner */}
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-3.5 border border-blue-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Star size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-blue-800">AI Recommendation</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Visit Louvre early morning (9 AM) to beat crowds. The Eiffel Tower at sunset is
              magical!
            </p>
          </div>
        </div>

        {/* Landmark cards grid */}
        <div className="mt-4 pb-4">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <MapPin size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No landmarks found</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((landmark) => (
              <div
                key={landmark.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={landmark.image}
                    alt={landmark.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {landmark.category}
                    </span>
                  </div>

                  {/* Open/Closed */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        landmark.openNow
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-800/70 text-white/80'
                      }`}
                    >
                      {landmark.openNow ? '● Open' : '● Closed'}
                    </span>
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-bold text-lg leading-tight">{landmark.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-white text-xs font-bold">{landmark.rating}</span>
                        <span className="text-white/60 text-xs">
                          ({(landmark.reviewCount / 1000).toFixed(0)}k)
                        </span>
                      </div>
                      <span className="text-white/40">·</span>
                      <div className="flex items-center gap-1 text-white/80">
                        <MapPin size={11} />
                        <span className="text-xs">{landmark.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3">
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {landmark.description}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock size={12} />
                      <span className="text-xs">{landmark.hours}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {landmark.tags.map((tag) => (
                        <Badge key={tag} label={tag} variant="blue" size="xs" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {landmark.ticketPrice && (
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1">
                          <Ticket size={11} className="text-gray-500" />
                          <span className="text-xs font-bold text-gray-700">
                            {landmark.ticketPrice}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedLandmark(landmark)}
                        className="bg-blue-600 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 hover:bg-blue-700 transition-colors"
                      >
                        Details <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="fixed z-[60] bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-gray-900 text-white shadow-lg px-4 py-3 text-sm font-medium"
        >
          {notice}
        </div>
      )}

      {selectedLandmark && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/55 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedLandmark(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="attraction-title"
            className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-xl"
          >
            <div className="relative h-60 md:h-72">
              <img
                src={selectedLandmark.image}
                alt={selectedLandmark.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              <button
                type="button"
                onClick={() => setSelectedLandmark(null)}
                aria-label="Close details"
                className="absolute right-4 top-4 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center text-gray-700 hover:bg-white"
              >
                <X size={18} />
              </button>
              <div className="absolute left-5 right-5 bottom-5">
                <span className="inline-flex bg-white/95 rounded-full px-3 py-1 text-xs font-bold text-blue-700">
                  {selectedLandmark.category}
                </span>
                <h2 id="attraction-title" className="text-2xl md:text-3xl text-white font-black mt-2">
                  {selectedLandmark.name}
                </h2>
                <div className="flex items-center gap-3 text-sm text-white/90 mt-2">
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    {selectedLandmark.rating} ({selectedLandmark.reviewCount.toLocaleString()} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {selectedLandmark.distance}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">Hours</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{selectedLandmark.hours}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">Price</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">
                    {selectedLandmark.ticketPrice ?? 'Free'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 col-span-2 md:col-span-1">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">
                    Visit duration
                  </p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">
                    {selectedLandmark.visitDuration}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{selectedLandmark.description}</p>

              <div className="grid md:grid-cols-2 gap-3 mt-5">
                <div className="border border-blue-100 bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-blue-800">Why it is worth visiting</p>
                  <p className="text-xs text-blue-700 leading-relaxed mt-1">{selectedLandmark.whyVisit}</p>
                </div>
                <div className="border border-amber-100 bg-amber-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-amber-800">Best time to visit</p>
                  <p className="text-xs text-amber-700 leading-relaxed mt-1">
                    {selectedLandmark.bestTimeToVisit}
                  </p>
                </div>
                <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-3 md:col-span-2">
                  <p className="text-xs font-bold text-emerald-800">Local tip</p>
                  <p className="text-xs text-emerald-700 leading-relaxed mt-1">{selectedLandmark.localTip}</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:px-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addToPlan(selectedLandmark)}
                className="flex-1 min-w-32 bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <CalendarPlus size={16} />
                {isPlanned(selectedLandmark) ? 'Added to Plan' : 'Add to Plan'}
              </button>
              <button
                type="button"
                onClick={() => saveForTrip(selectedLandmark)}
                className="rounded-xl border border-gray-200 text-gray-700 px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Heart size={16} className={isSaved(selectedLandmark) ? 'fill-blue-600 text-blue-600' : ''} />
                {isSaved(selectedLandmark) ? 'Saved' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => getDirections(selectedLandmark)}
                className="rounded-xl border border-blue-200 text-blue-600 px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors"
              >
                <Navigation size={16} />
                Get Directions
              </button>
              <button
                type="button"
                onClick={() => setSelectedLandmark(null)}
                className="rounded-xl border border-gray-200 text-gray-600 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      {mapLandmark && (
        <MapModal
          place={{
            name: mapLandmark.name,
            city: trip.city,
            country: trip.country,
            address: mapLandmark.address,
            distance: mapLandmark.distance,
            nearbyPlaces: landmarks
              .filter((landmark) => landmark.id !== mapLandmark.id)
              .slice(0, 3)
              .map((landmark) => landmark.name),
          }}
          onClose={() => setMapLandmark(null)}
          onAddToPlan={() => addToPlan(mapLandmark)}
          isAdded={isPlanned(mapLandmark)}
        />
      )}
    </div>
  );
}
