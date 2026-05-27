import { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
  Heart,
  X,
  Ticket,
  CalendarPlus,
  Navigation,
  CheckCircle,
} from 'lucide-react';
import { getCityEventsData } from '../data/cityEvents';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import MapModal from '../components/MapModal';
import { useTrip } from '../context/TripContext';
import type { DetailedEvent } from '../types';

// Covers all category values used across all cities
const categoryColors: Record<
  string,
  'blue' | 'purple' | 'amber' | 'green' | 'cyan' | 'red' | 'gray'
> = {
  Music: 'purple',
  'Arts & Culture': 'blue',
  Sports: 'cyan',
  'Food & Drink': 'red',
  Festival: 'amber',
  Workshop: 'green',
  Cultural: 'amber',
  // legacy Paris category names (kept for safety)
  'Music Festival': 'purple',
  'Museum Event': 'blue',
  Jazz: 'amber',
  'Art Installation': 'cyan',
};

interface ReservationOption {
  id: string;
  name: string;
  description: string;
  price: string;
  included: string;
}

interface ReservationForm {
  name: string;
  email: string;
  people: string;
  session: string;
  optionId: string;
  note: string;
}

function increasedPrice(price: string, amount: number): string {
  const match = price.match(/([€$£])(\d+)/);
  if (!match) return price;
  return `${match[1]}${Number(match[2]) + amount}`;
}

function totalPrice(price: string, people: number): string {
  if (price === 'Free') return 'Free';
  const match = price.match(/([€$£])(\d+)/);
  if (!match) return price;
  return `${match[1]}${Number(match[2]) * people}`;
}

function getSessionOptions(event: DetailedEvent): string[] {
  const optionsByEvent: Record<string, string[]> = {
    'par-e1': ['Afternoon street concerts', 'Evening headline stages'],
    'par-e3': ['Jun 11 · 4:00 PM', 'Jun 12 · 4:00 PM'],
    'par-e5': ['Jun 10 · Sunset entry', 'Jun 12 · Sunset entry', 'Jun 14 · Sunset entry'],
    'bcn-e1': ['Jun 5 · Opening night', 'Jun 7 · Weekend programme', 'Jun 9 · Closing night'],
    'bcn-e2': ['Sónar by Day', 'Sónar by Night'],
    'bcn-e6': ['Jun 10 · 9:00 PM', 'Jun 12 · 9:00 PM', 'Jun 14 · 9:00 PM'],
    'rom-e1': ['Jun 10 · 9:30 PM', 'Jun 12 · 9:30 PM', 'Jun 14 · 9:30 PM'],
    'rom-e3': ['Jun 10 · 8:15 PM', 'Jun 12 · 8:15 PM', 'Jun 14 · 8:15 PM'],
    'ist-e1': ['Hagia Eirene · 8:00 PM', 'Festival venue selection · 8:00 PM'],
    'ist-e2': ['Jun 10 · 7:30 PM', 'Jun 12 · 7:30 PM', 'Jun 14 · 7:30 PM'],
    'ist-e3': ['Jun 10 · Sunset sailing', 'Jun 12 · Sunset sailing', 'Jun 14 · Sunset sailing'],
  };
  return optionsByEvent[event.id] ?? [];
}

function getReservationOptions(event: DetailedEvent, city: string): ReservationOption[] {
  if (event.price === 'Free') {
    return [
      {
        id: 'rsvp',
        name: 'Free RSVP',
        description: `Reserve a reminder for ${event.title}.`,
        price: 'Free',
        included: `Event access, directions to ${event.venue}, trip reminder`,
      },
      {
        id: 'hosted',
        name: 'Guided experience',
        description: `Discover the story behind this ${city} experience with a local host.`,
        price: '€12',
        included: 'Free event access, 45-minute hosted introduction, local recommendations',
      },
    ];
  }

  if (event.category === 'Workshop') {
    return [
      {
        id: 'standard',
        name: 'Participant place',
        description: `Join the hands-on ${event.title} session.`,
        price: event.price,
        included: 'Workshop admission, equipment and ingredients, recipe notes',
      },
      {
        id: 'premium',
        name: 'Small-group experience',
        description: 'More time with the instructor and a relaxed group size.',
        price: increasedPrice(event.price, 25),
        included: 'Everything in Participant place, priority workstation, take-home gift',
      },
    ];
  }

  const options: ReservationOption[] = [
    {
      id: 'standard',
      name: 'Standard entry',
      description: `General admission to ${event.title}.`,
      price: event.price,
      included: `Admission at ${event.venue}, digital trip voucher`,
    },
    {
      id: 'guided',
      name: 'Guided experience',
      description: `Add context from a local ${city} host before the event.`,
      price: increasedPrice(event.price, 18),
      included: 'Standard entry, hosted introduction, local tip sheet',
    },
    {
      id: 'priority',
      name: 'VIP / priority access',
      description: 'An easier arrival with reserved priority entry.',
      price: increasedPrice(event.price, 35),
      included: 'Priority entrance, premium viewing area where available, welcome refreshment',
    },
  ];

  if (['Arts & Culture', 'Music', 'Sports'].includes(event.category)) {
    options.push({
      id: 'reduced',
      name: 'Student / reduced ticket',
      description: 'Reduced admission; valid supporting ID may be requested.',
      price: increasedPrice(event.price, -4),
      included: 'Standard admission, digital voucher, reduced-price eligibility check',
    });
  }

  return options;
}

export default function EventsPage() {
  const {
    trip,
    plannedEvents,
    savedEvents,
    eventReservations,
    addEventToPlan,
    saveEvent,
    addEventReservation,
    cancelEventReservation,
  } = useTrip();
  const { events: cityEvents, eventTip } = getCityEventsData(trip.city);

  // Derive category list from current city's events
  const categories = ['All', ...Array.from(new Set(cityEvents.map((e) => e.category)))];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'discover' | 'reservations'>('discover');
  const [selectedEvent, setSelectedEvent] = useState<DetailedEvent | null>(null);
  const [mapEvent, setMapEvent] = useState<DetailedEvent | null>(null);
  const [reservationEvent, setReservationEvent] = useState<DetailedEvent | null>(null);
  const [reservationForm, setReservationForm] = useState<ReservationForm>({
    name: '',
    email: '',
    people: '1',
    session: '',
    optionId: '',
    note: '',
  });
  const [notice, setNotice] = useState('');

  // Reset filters when city changes
  useEffect(() => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedEvent(null);
    setMapEvent(null);
    setReservationEvent(null);
  }, [trip.city]);

  useEffect(() => {
    if (!selectedEvent && !reservationEvent) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (reservationEvent) {
        setReservationEvent(null);
      } else {
        setSelectedEvent(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedEvent, reservationEvent]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const filtered = cityEvents.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || e.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const featured = filtered.filter((e) => e.isFeatured);
  const regular = filtered.filter((e) => !e.isFeatured);
  const reservations = eventReservations.filter((reservation) => reservation.city === trip.city);

  const isPlanned = (event: DetailedEvent) =>
    plannedEvents.some((item) => item.city === trip.city && item.id === event.id);

  const isSaved = (event: DetailedEvent) =>
    savedEvents.some((item) => item.city === trip.city && item.id === event.id);

  function saveForTrip(event: DetailedEvent) {
    const alreadySaved = isSaved(event);
    saveEvent(event);
    setNotice(alreadySaved ? `${event.title} is already saved.` : `${event.title} was saved.`);
  }

  function addToPlan(event: DetailedEvent) {
    const alreadyPlanned = isPlanned(event);
    addEventToPlan(event);
    setNotice(
      alreadyPlanned
        ? `${event.title} is already in your itinerary.`
        : `${event.title} was added to your itinerary.`,
    );
  }

  function openReservation(event: DetailedEvent) {
    const sessions = getSessionOptions(event);
    const options = getReservationOptions(event, trip.city);
    setReservationForm({
      name: '',
      email: '',
      people: String(Math.max(1, trip.travelers)),
      session: sessions[0] ?? '',
      optionId: options[0].id,
      note: '',
    });
    setReservationEvent(event);
  }

  function confirmReservation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reservationEvent) return;
    const option = getReservationOptions(reservationEvent, trip.city).find(
      (item) => item.id === reservationForm.optionId,
    );
    if (!option) return;
    const people = Number(reservationForm.people);
    addEventReservation({
      ...reservationEvent,
      reservationId: `${trip.city}:${reservationEvent.id}`,
      optionName: option.name,
      optionPrice: option.price,
      people,
      guestName: reservationForm.name,
      guestEmail: reservationForm.email,
      session: reservationForm.session,
      totalPrice: totalPrice(option.price, people),
      status: 'Confirmed',
    });
    addEventToPlan(reservationEvent);
    setReservationEvent(null);
    setSelectedEvent(null);
    setActiveTab('reservations');
    setNotice('Reservation confirmed and saved for your trip.');
  }

  function cancelReservation(reservationId: string) {
    cancelEventReservation(reservationId);
    setNotice('Reservation cancelled.');
  }

  function getDirections(event: DetailedEvent) {
    setSelectedEvent(null);
    setMapEvent(event);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Local Events"
        subtitle={`${trip.city} · ${trip.startDate} – ${trip.endDate}`}
        gradient
      />

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
          <div className="flex gap-1 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className={`px-4 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'discover'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Discover Events
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reservations')}
              className={`px-4 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'reservations'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Reservations
              {reservations.length > 0 && (
                <span className="ml-2 rounded-full bg-pink-50 text-pink-600 px-2 py-0.5 text-[10px]">
                  {reservations.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'discover' && (
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
                placeholder="Search events..."
                className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2 mt-3 md:mt-0 overflow-x-auto scrollbar-hide pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                    selectedCategory === cat
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-6">
        {/* AI Picks */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-3.5 mb-5 flex items-start gap-3">
          <div className="w-9 h-9 bg-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-pink-800">AI Event Picks</p>
            <p className="text-xs text-pink-600 mt-1 leading-relaxed">{eventTip}</p>
          </div>
        </div>

        {/* Featured events */}
        {featured.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
              ✨ Featured
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="relative h-44">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <button
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation();
                        saveForTrip(event);
                      }}
                      aria-label={`Save ${event.title}`}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
                    >
                      <Heart
                        size={14}
                        className={
                          isSaved(event) ? 'text-rose-500 fill-rose-500' : 'text-gray-400'
                        }
                      />
                    </button>

                    <div className="absolute top-3 left-3">
                      <Badge
                        label={event.category}
                        variant={categoryColors[event.category] ?? 'gray'}
                        size="xs"
                      />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            event.price === 'Free'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white/20 text-white backdrop-blur-sm'
                          }`}
                        >
                          {event.price === 'Free' ? 'FREE' : event.price}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-base leading-tight">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-white/80">
                        <MapPin size={11} />
                        <span className="text-xs">{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 text-gray-400">
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar size={11} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock size={11} />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <button
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          setSelectedEvent(event);
                        }}
                        className="bg-pink-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 hover:bg-pink-600 transition-colors"
                      >
                        Details <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular events */}
        {regular.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
              📅 More Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {regular.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex cursor-pointer"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-24 flex-shrink-0 object-cover"
                  />
                  <div className="p-3 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">
                          {event.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{event.category}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            event.price === 'Free'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {event.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-gray-400">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar size={10} />
                        <span>{event.date}</span>
                      </div>
                      <span className="text-gray-200">·</span>
                      <div className="flex items-center gap-1 text-[11px]">
                        <MapPin size={10} />
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {event.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          setSelectedEvent(event);
                        }}
                        className="ml-auto text-[11px] font-semibold text-pink-600 hover:text-pink-700"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Calendar size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No events found</p>
          </div>
        )}
      </div>
        </>
      )}

      {activeTab === 'reservations' && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-5 pb-6">
          {reservations.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl text-center py-14 px-5">
              <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-4">
                <Ticket size={22} />
              </div>
              <h2 className="text-base font-bold text-gray-900">No reservations yet</h2>
              <p className="text-sm text-gray-500 mt-2">
                You don&apos;t have any event reservations yet. Discover events and reserve your spot.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('discover')}
                className="mt-5 rounded-xl bg-pink-500 text-white px-5 py-2.5 text-sm font-semibold hover:bg-pink-600 transition-colors"
              >
                Discover Events
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">My Reservations</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Your confirmed event reservations in {trip.city}.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {reservations.map((reservation) => (
                  <article
                    key={reservation.reservationId}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                  >
                    <div className="flex">
                      <img
                        src={reservation.image}
                        alt={reservation.title}
                        className="w-28 md:w-36 object-cover flex-shrink-0"
                      />
                      <div className="p-4 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-gray-900 leading-tight">
                            {reservation.title}
                          </h3>
                          <span className="flex-shrink-0 rounded-full bg-emerald-50 text-emerald-600 px-2 py-1 text-[10px] font-bold">
                            {reservation.status}
                          </span>
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-3">
                          <Calendar size={12} />
                          {reservation.date} · {reservation.time}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                          <MapPin size={12} />
                          {reservation.venue}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="uppercase tracking-wide font-bold text-gray-400">Option</p>
                          <p className="text-gray-700 font-semibold mt-1">{reservation.optionName}</p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wide font-bold text-gray-400">Guests</p>
                          <p className="text-gray-700 font-semibold mt-1">
                            {reservation.people} {reservation.people === 1 ? 'person' : 'people'}
                          </p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wide font-bold text-gray-400">Reserved For</p>
                          <p className="text-gray-700 font-semibold mt-1">{reservation.guestName}</p>
                          <p className="text-gray-500 break-all">{reservation.guestEmail}</p>
                        </div>
                        <div>
                          <p className="uppercase tracking-wide font-bold text-gray-400">Total Price</p>
                          <p className="text-pink-600 font-bold mt-1">{reservation.totalPrice}</p>
                        </div>
                      </div>
                      {reservation.session && (
                        <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                          <strong className="text-gray-700">Selected time:</strong> {reservation.session}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(reservation)}
                          className="rounded-xl border border-gray-200 text-gray-700 px-3 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => addToPlan(reservation)}
                          className="rounded-xl border border-pink-200 text-pink-600 px-3 py-2 text-xs font-semibold flex items-center gap-1.5 hover:bg-pink-50 transition-colors"
                        >
                          <CalendarPlus size={13} />
                          {isPlanned(reservation) ? 'Added to Itinerary' : 'Add to Itinerary'}
                        </button>
                        <button
                          type="button"
                          onClick={() => cancelReservation(reservation.reservationId)}
                          className="rounded-xl border border-gray-200 text-gray-600 px-3 py-2 text-xs font-semibold hover:border-red-200 hover:text-red-600 transition-colors"
                        >
                          Cancel Reservation
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="fixed z-[60] bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-gray-900 text-white shadow-lg px-4 py-3 text-sm font-medium flex items-center gap-2"
        >
          <CheckCircle size={15} className="text-emerald-400" />
          {notice}
        </div>
      )}

      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/55 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedEvent(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-title"
            className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-xl"
          >
            <div className="relative h-60 md:h-72">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close event details"
                className="absolute right-4 top-4 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center text-gray-700 hover:bg-white"
              >
                <X size={18} />
              </button>
              <div className="absolute left-5 right-5 bottom-5">
                <Badge
                  label={selectedEvent.category}
                  variant={categoryColors[selectedEvent.category] ?? 'gray'}
                  size="xs"
                />
                <h2 id="event-title" className="text-2xl md:text-3xl text-white font-black mt-2">
                  {selectedEvent.title}
                </h2>
                <p className="flex items-center gap-1 text-sm text-white/90 mt-2">
                  <MapPin size={14} />
                  {selectedEvent.venue}
                </p>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">Date</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{selectedEvent.date}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">Time</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{selectedEvent.time}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">Price</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{selectedEvent.price}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">Entry</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">
                    {selectedEvent.price === 'Free' ? 'Free event' : 'Paid event'}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{selectedEvent.description}</p>
              <p className="text-xs text-gray-500 mt-3">
                <strong>Location:</strong> {selectedEvent.address}
              </p>

              <div className="grid md:grid-cols-2 gap-3 mt-5">
                <div className="border border-pink-100 bg-pink-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-pink-800">Why it is worth attending</p>
                  <p className="text-xs text-pink-700 leading-relaxed mt-1">{selectedEvent.whyAttend}</p>
                </div>
                <div className="border border-blue-100 bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-blue-800">Best for</p>
                  <p className="text-xs text-blue-700 leading-relaxed mt-1">{selectedEvent.bestFor}</p>
                </div>
                <div className="border border-emerald-100 bg-emerald-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-emerald-800">Local tip</p>
                  <p className="text-xs text-emerald-700 leading-relaxed mt-1">{selectedEvent.localTip}</p>
                </div>
                <div className="border border-amber-100 bg-amber-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-amber-800">Ticket / reservation advice</p>
                  <p className="text-xs text-amber-700 leading-relaxed mt-1">{selectedEvent.ticketAdvice}</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:px-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openReservation(selectedEvent)}
                className="flex-1 min-w-36 bg-pink-500 text-white rounded-xl px-4 py-2.5 text-sm font-semibold flex justify-center items-center gap-2 hover:bg-pink-600 transition-colors"
              >
                <Ticket size={16} />
                Reserve
              </button>
              <button
                type="button"
                onClick={() => addToPlan(selectedEvent)}
                className="rounded-xl border border-pink-200 text-pink-600 px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors"
              >
                <CalendarPlus size={16} />
                {isPlanned(selectedEvent) ? 'Added to Itinerary' : 'Add to Itinerary'}
              </button>
              <button
                type="button"
                onClick={() => saveForTrip(selectedEvent)}
                className="rounded-xl border border-gray-200 text-gray-700 px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Heart size={16} className={isSaved(selectedEvent) ? 'fill-pink-500 text-pink-500' : ''} />
                {isSaved(selectedEvent) ? 'Saved' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => getDirections(selectedEvent)}
                className="rounded-xl border border-pink-200 text-pink-600 px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors"
              >
                <Navigation size={16} />
                Get Directions
              </button>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="rounded-xl border border-gray-200 text-gray-600 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      {mapEvent && (
        <MapModal
          place={{
            name: mapEvent.title,
            city: trip.city,
            country: trip.country,
            address: mapEvent.address,
            nearbyPlaces: cityEvents
              .filter((event) => event.id !== mapEvent.id)
              .slice(0, 3)
              .map((event) => event.venue),
          }}
          onClose={() => setMapEvent(null)}
          onAddToPlan={() => addToPlan(mapEvent)}
          isAdded={isPlanned(mapEvent)}
        />
      )}

      {reservationEvent && (
        <div
          className="fixed inset-0 z-[70] bg-gray-900/60 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setReservationEvent(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservation-title"
            className="bg-white w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-t-3xl md:rounded-3xl shadow-xl"
          >
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-5 md:px-6 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide font-bold text-pink-500">Reservation</p>
                <h2 id="reservation-title" className="text-xl font-black text-gray-900 mt-1">
                  {reservationEvent.title}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {reservationEvent.date} · {reservationEvent.venue}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReservationEvent(null)}
                aria-label="Close reservation"
                className="w-9 h-9 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={confirmReservation} className="p-5 md:p-6">
              <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Choose your ticket</h3>
                  <div className="space-y-3">
                    {getReservationOptions(reservationEvent, trip.city).map((option) => (
                      <label
                        key={option.id}
                        className={`block cursor-pointer rounded-xl border p-3 transition-colors ${
                          reservationForm.optionId === option.id
                            ? 'border-pink-400 bg-pink-50'
                            : 'border-gray-200 hover:border-pink-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="ticketType"
                            value={option.id}
                            checked={reservationForm.optionId === option.id}
                            onChange={(event) =>
                              setReservationForm((current) => ({
                                ...current,
                                optionId: event.target.value,
                              }))
                            }
                            className="mt-1 accent-pink-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-bold text-gray-900">{option.name}</p>
                              <span className="text-sm font-bold text-pink-600 flex-shrink-0">
                                {option.price}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                            <p className="text-[11px] text-gray-500 mt-2">
                              <strong className="text-gray-700">Includes:</strong> {option.included}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Reservation details</h3>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="block text-xs font-semibold text-gray-600 mb-1">Name</span>
                      <input
                        type="text"
                        required
                        value={reservationForm.name}
                        onChange={(event) =>
                          setReservationForm((current) => ({ ...current, name: event.target.value }))
                        }
                        placeholder="Your name"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-pink-400"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-xs font-semibold text-gray-600 mb-1">Email</span>
                      <input
                        type="email"
                        required
                        value={reservationForm.email}
                        onChange={(event) =>
                          setReservationForm((current) => ({ ...current, email: event.target.value }))
                        }
                        placeholder="you@email.com"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-pink-400"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-xs font-semibold text-gray-600 mb-1">
                        Number of tickets / people
                      </span>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        required
                        value={reservationForm.people}
                        onChange={(event) =>
                          setReservationForm((current) => ({ ...current, people: event.target.value }))
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-pink-400"
                      />
                    </label>
                    {getSessionOptions(reservationEvent).length > 0 && (
                      <label className="block">
                        <span className="block text-xs font-semibold text-gray-600 mb-1">
                          Preferred time or session
                        </span>
                        <select
                          required
                          value={reservationForm.session}
                          onChange={(event) =>
                            setReservationForm((current) => ({ ...current, session: event.target.value }))
                          }
                          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-white outline-none focus:border-pink-400"
                        >
                          {getSessionOptions(reservationEvent).map((session) => (
                            <option key={session} value={session}>
                              {session}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <label className="block">
                      <span className="block text-xs font-semibold text-gray-600 mb-1">
                        Optional note
                      </span>
                      <textarea
                        rows={3}
                        value={reservationForm.note}
                        onChange={(event) =>
                          setReservationForm((current) => ({ ...current, note: event.target.value }))
                        }
                        placeholder="Accessibility needs, seating request, or anything else"
                        className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-pink-400"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReservationEvent(null)}
                  className="rounded-xl border border-gray-200 text-gray-600 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-pink-500 text-white px-5 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors"
                >
                  <CheckCircle size={16} />
                  Confirm Reservation
                </button>
              </div>
              <p className="text-center text-[11px] text-gray-400 mt-3">
                Prototype reservation only. No payment will be processed.
              </p>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
