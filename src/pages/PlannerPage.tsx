import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Car,
  Hotel,
  Utensils,
  Camera,
  Calendar,
  Footprints,
  DollarSign,
  StickyNote,
  Map as MapIcon,
  Route,
  Navigation,
  Send,
  Bot,
  ArrowUp,
  ArrowDown,
  Trash2,
  Info,
  X,
  CheckCircle,
} from 'lucide-react';
import { getCityPlannerData } from '../data/cityPlanner';
import type { ItineraryItem, DayPlan } from '../types';
import PageHeader from '../components/PageHeader';
import MapModal from '../components/MapModal';
import { useTrip } from '../context/TripContext';
import type { TripAttraction, TripEvent, TripRestaurant } from '../context/TripContext';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function buildItinerary(startDate: string, city: string, maxDays: number): DayPlan[] {
  const planner = getCityPlannerData(city);
  const base  = new Date(startDate);
  const valid = !isNaN(base.getTime());
  const count = Math.max(1, maxDays);
  return Array.from({ length: count }, (_, i) => {
    const d = planner.days[i % planner.days.length];
    let date = `Day ${i + 1}`;
    if (valid) {
      const cur = new Date(base);
      cur.setDate(base.getDate() + i);
      date = `${MONTHS[cur.getMonth()]} ${cur.getDate()}`;
    }
    return {
      day: i + 1,
      date,
      label: i < planner.days.length ? d.label : `${d.label} Revisited`,
      items: d.items.map((item) => ({ ...item, id: `${item.id}-day-${i + 1}` })),
    };
  });
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

const suggestionChips = [
  'More food',
  'More culture',
  'Less walking',
  'Budget-friendly',
  'Hidden gems',
  'Family friendly',
];

const improvementActions = [
  {
    label: 'Optimize route',
    confirmation: 'Optimized your route so nearby stops are grouped together and transfer time is shorter.',
  },
  {
    label: 'Make it more relaxed',
    confirmation: 'Updated your plan with a slower pace, longer breaks, and fewer rushed transitions.',
  },
  {
    label: 'Add local food stops',
    confirmation: 'Updated your plan to include more local food stops and reduce walking time.',
  },
  {
    label: 'Reduce walking',
    confirmation: 'Reduced walking by connecting distant stops with convenient local transport options.',
  },
  {
    label: 'Add hidden gems',
    confirmation: 'Added a few quieter local gems near your existing route for this day.',
  },
];

function createAiResponse(request: string, city: string, dayNumber: number): string {
  const prompt = request.toLowerCase();
  if (prompt.includes('food')) {
    return `I would add two well-rated local ${city} food stops to Day ${dayNumber}, placed between nearby sights so the route stays efficient.`;
  }
  if (prompt.includes('relaxed') || prompt.includes('walking')) {
    return `I would make Day ${dayNumber} gentler by spacing out activities, adding a café break, and reducing long walks with short transfers.`;
  }
  if (prompt.includes('museum') || prompt.includes('culture')) {
    return `I would prioritize ${city}'s museum and cultural highlights on Day ${dayNumber}, with timed visits and a nearby lunch stop.`;
  }
  if (prompt.includes('cheap') || prompt.includes('budget')) {
    return `I would lower the Day ${dayNumber} budget by replacing paid stops with excellent free sights, markets, and affordable local dining.`;
  }
  if (prompt.includes('hidden')) {
    return `I would add lesser-known ${city} spots close to the current route on Day ${dayNumber}, while keeping the major highlight you selected.`;
  }
  if (prompt.includes('family')) {
    return `I would make Day ${dayNumber} family friendly with shorter visits, easy breaks, and engaging stops with minimal transfers.`;
  }
  return `I can adapt Day ${dayNumber} in ${city} around that preference, rearranging stops and travel time while preserving its key highlights.`;
}

const typeConfig: Record<
  ItineraryItem['type'],
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  attraction: {
    icon: Camera,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  food: {
    icon: Utensils,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  transport: {
    icon: Car,
    color: 'text-gray-500',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
  },
  hotel: {
    icon: Hotel,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  event: {
    icon: Calendar,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
  },
  free: {
    icon: Footprints,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
};

function getItemDetails(item: ItineraryItem, city: string) {
  const whyIncluded: Record<ItineraryItem['type'], string> = {
    attraction: `A highlight of ${city} that anchors this day's sightseeing route.`,
    food: `A local meal stop placed naturally between nearby activities in ${city}.`,
    transport: 'Keeps transfers predictable and reduces unnecessary travel time.',
    hotel: 'Builds practical check-in or rest time into the itinerary.',
    event: 'Adds a scheduled local experience to the day.',
    free: 'Provides flexible time to explore at a relaxed pace.',
  };
  const transportNote: Record<ItineraryItem['type'], string> = {
    attraction: 'Walk or take local transit from the previous stop depending on energy level.',
    food: 'Chosen to fit the surrounding route; allow a short walk after dining.',
    transport: 'Allow a few extra minutes for boarding and transfers.',
    hotel: 'Keep luggage timing in mind when arriving or departing.',
    event: 'Plan to arrive 15 minutes early and check return transport.',
    free: 'Best enjoyed on foot with comfortable shoes.',
  };
  const needsReservation = /book|ticket|reservation|required|timed/i.test(item.notes ?? '')
    || item.type === 'event';

  return {
    whyIncluded: whyIncluded[item.type],
    transportNote: transportNote[item.type],
    localTip: item.notes ?? 'Leave a little flexibility to explore nearby streets and local spots.',
    reservation: needsReservation ? 'Recommended - check availability ahead.' : 'Not typically needed.',
    bestTime: `Planned for ${item.time} to fit the day's route and pace.`,
  };
}

function ItineraryCard({
  item,
  city,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  item: ItineraryItem;
  city: string;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = typeConfig[item.type];
  const Icon = cfg.icon;
  const details = getItemDetails(item, city);
  const actionClass =
    'rounded-lg border border-gray-200 px-2 py-1.5 text-[11px] font-semibold text-gray-500 flex items-center gap-1 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-35 disabled:pointer-events-none';

  return (
    <div className={`bg-white rounded-2xl border ${cfg.border} shadow-sm overflow-hidden`}>
      <div
        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Time column */}
        <div className="flex flex-col items-center flex-shrink-0 w-14">
          <span className="text-xs font-black text-gray-800 leading-tight">{item.time}</span>
          <div className={`w-0.5 h-6 mt-1 ${cfg.bg} rounded-full`} />
        </div>

        {/* Icon */}
        <div
          className={`w-9 h-9 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
        >
          <Icon size={16} className={cfg.color} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-gray-400">
              <Clock size={10} />
              <span className="text-[11px]">{item.duration}</span>
            </div>
            {item.cost && (
              <>
                <span className="text-gray-200">·</span>
                <div className="flex items-center gap-1 text-gray-400">
                  <DollarSign size={10} />
                  <span className="text-[11px]">{item.cost}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        <div className="flex-shrink-0">
          {expanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      <div className="px-3 pb-3 flex items-center gap-1.5 flex-wrap">
        <button type="button" className={actionClass} onClick={onMoveUp} disabled={isFirst}>
          <ArrowUp size={12} />
          Move up
        </button>
        <button type="button" className={actionClass} onClick={onMoveDown} disabled={isLast}>
          <ArrowDown size={12} />
          Move down
        </button>
        <button
          type="button"
          className={actionClass}
          onClick={() => setExpanded((current) => !current)}
        >
          <Info size={12} />
          {expanded ? 'Hide details' : 'View details'}
        </button>
        <button
          type="button"
          className={`${actionClass} ml-auto hover:border-red-200 hover:text-red-600 hover:bg-red-50`}
          onClick={onDelete}
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className={`px-3 pb-3 border-t ${cfg.border}`}>
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-36 object-cover rounded-xl mt-3"
            />
          )}
          <div className="flex items-start gap-2 mt-3">
            <MapPin size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-gray-600">{item.location}</span>
          </div>
          {item.notes && (
            <div className="flex items-start gap-2 mt-2">
              <StickyNote size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-gray-600 italic">{item.notes}</span>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-2 mt-3">
            {[
              { label: 'Why included', value: details.whyIncluded },
              { label: 'Duration / cost', value: `${item.duration} · ${item.cost ?? 'No estimated cost'}` },
              { label: 'Transport note', value: details.transportNote },
              { label: 'Local tip', value: details.localTip },
              { label: 'Reservation', value: details.reservation },
              { label: 'Best time to go', value: details.bestTime },
            ].map((detail) => (
              <div key={detail.label} className="rounded-xl bg-gray-50 p-2.5">
                <p className="text-[10px] uppercase tracking-wide font-bold text-gray-400">
                  {detail.label}
                </p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MapView({
  day,
  city,
  onOpenMap,
}: {
  day: DayPlan;
  city: string;
  onOpenMap: () => void;
}) {
  const points = [
    { left: '14%', top: '68%' },
    { left: '32%', top: '34%' },
    { left: '54%', top: '50%' },
    { left: '69%', top: '20%' },
    { left: '84%', top: '43%' },
  ];
  const stops = day.items.slice(0, points.length);

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 pb-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <MapIcon size={16} className="text-blue-600" />
            Map View
          </h3>
          <p className="text-xs text-gray-500 mt-1">Day {day.day} route in {city}</p>
        </div>
        <div className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">
          {stops.length} stops
        </div>
      </div>

      <div className="mx-4 relative h-52 overflow-hidden rounded-2xl bg-emerald-50 border border-emerald-100">
        <div className="absolute -top-5 left-8 w-16 h-64 rotate-12 bg-blue-100/80 rounded-full" />
        <div className="absolute top-7 -right-12 w-48 h-24 bg-emerald-100 rounded-full" />
        <div className="absolute bottom-3 left-28 w-52 h-16 bg-amber-50 rounded-full" />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points="14,68 32,34 54,50 69,20 84,43"
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.8"
            strokeDasharray="3 2"
          />
        </svg>
        {stops.map((stop, i) => (
          <div
            key={stop.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={points[i]}
            title={stop.title}
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-md text-white text-xs font-black flex items-center justify-center">
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {stops.map((stop, i) => (
          <div key={stop.id} className="flex items-center gap-1.5 flex-shrink-0 text-[11px] text-gray-500">
            <span className="w-4 h-4 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <span className="max-w-24 truncate">{stop.title}</span>
          </div>
        ))}
      </div>

      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={onOpenMap}
          className="rounded-xl bg-blue-600 text-white py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors"
        >
          <Route size={14} />
          View Route Map
        </button>
        <button
          onClick={onOpenMap}
          className="rounded-xl border border-blue-200 text-blue-600 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors"
        >
          <Navigation size={14} />
          View Map & Transport
        </button>
      </div>
    </section>
  );
}

interface NewActivityForm {
  title: string;
  type: ItineraryItem['type'];
  time: string;
  duration: string;
  notes: string;
}

const emptyActivityForm: NewActivityForm = {
  title: '',
  type: 'attraction',
  time: '',
  duration: '',
  notes: '',
};

function PlannerContent({
  trip,
  tripDays,
  addedAttractions,
  addedRestaurants,
  addedEvents,
}: {
  trip: ReturnType<typeof useTrip>['trip'];
  tripDays: number;
  addedAttractions: TripAttraction[];
  addedRestaurants: TripRestaurant[];
  addedEvents: TripEvent[];
}) {
  const [activeDay, setActiveDay] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [dayUpdates, setDayUpdates] = useState<Record<number, string[]>>({});
  const [itinerary, setItinerary] = useState<DayPlan[]>(() =>
    buildItinerary(trip.startDate, trip.city, tripDays),
  );
  const [notice, setNotice] = useState('');
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [newActivity, setNewActivity] = useState<NewActivityForm>(emptyActivityForm);

  const day = itinerary[activeDay] ?? itinerary[0];

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const dayCost = day.items
    .filter((i) => i.cost && !i.cost.includes('Prepaid'))
    .map((i) => {
      const match = i.cost?.match(/\d+/);
      return match ? parseInt(match[0]) * (trip.travelers || 2) : 0;
    })
    .reduce((a, b) => a + b, 0);

  const cityAiTips = getCityPlannerData(trip.city).aiTips;

  function sendPreference(preference: string) {
    const request = preference.trim();
    if (!request) return;
    setChatMessages((previous) => [
      ...previous,
      { role: 'user', text: request },
      { role: 'assistant', text: createAiResponse(request, trip.city, day.day) },
    ]);
    setChatInput('');
  }

  function applyImprovement(label: string, confirmation: string) {
    setDayUpdates((previous) => ({
      ...previous,
      [day.day]: previous[day.day]?.includes(label)
        ? previous[day.day]
        : [...(previous[day.day] ?? []), label],
    }));
    setChatMessages((previous) => [
      ...previous,
      { role: 'assistant', text: confirmation },
    ]);
  }

  function selectDay(index: number) {
    setActiveDay(index);
    setIsMapOpen(false);
  }

  function updateSelectedDayItems(update: (items: ItineraryItem[]) => ItineraryItem[]) {
    setItinerary((previous) =>
      previous.map((plan, index) =>
        index === activeDay ? { ...plan, items: update(plan.items) } : plan,
      ),
    );
  }

  function moveActivity(index: number, direction: -1 | 1) {
    updateSelectedDayItems((items) => {
      const destination = index + direction;
      if (destination < 0 || destination >= items.length) return items;
      const reordered = [...items];
      [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
      return reordered;
    });
  }

  function deleteActivity(id: string) {
    updateSelectedDayItems((items) => items.filter((item) => item.id !== id));
    setNotice('Activity removed from your plan');
  }

  function addActivity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const item: ItineraryItem = {
      id: `custom-${day.day}-${Date.now()}`,
      title: newActivity.title.trim(),
      type: newActivity.type,
      time: newActivity.time.trim(),
      duration: newActivity.duration.trim(),
      location: 'Location to be decided',
      notes: newActivity.notes.trim() || undefined,
    };
    updateSelectedDayItems((items) => [...items, item]);
    setNewActivity(emptyActivityForm);
    setIsAddActivityOpen(false);
    setNotice('Activity added to your plan');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Day Planner"
        subtitle={`${trip.city} · ${trip.travelers} traveler${trip.travelers !== 1 ? 's' : ''}`}
        gradient
        action={
          <button className="p-2 bg-white/20 rounded-full">
            <Sparkles size={18} className="text-white" />
          </button>
        }
      />

      {/* Day selector */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide md:overflow-visible">
            {itinerary.map((d, i) => (
              <button
                key={d.day}
                onClick={() => selectDay(i)}
                className={`flex-shrink-0 flex flex-col items-center px-3 md:px-4 py-2 rounded-xl border transition-all ${
                  activeDay === i
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                }`}
              >
                <span
                  className={`text-[10px] font-bold ${
                    activeDay === i ? 'text-blue-200' : 'text-gray-400'
                  }`}
                >
                  Day {d.day}
                </span>
                <span className="text-xs font-bold mt-0.5">{d.date}</span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    activeDay === i ? 'text-blue-200' : 'text-gray-400'
                  } text-center max-w-16 leading-tight`}
                >
                  {d.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-5 pb-6 md:grid md:grid-cols-3 md:gap-6">
        {/* LEFT sidebar: day summary + AI tip */}
        <div className="md:col-span-1 space-y-4 mb-5 md:mb-0">
          {/* Day summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  Day {day.day}: {day.label}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                  <CalendarDays size={13} />
                  {day.date} · {day.items.length} activities
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-blue-600">~€{dayCost}</div>
                <div className="text-[10px] text-gray-400">Est. total</div>
              </div>
            </div>

            {/* Activity type breakdown */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {(
                ['attraction', 'food', 'event', 'transport', 'hotel', 'free'] as ItineraryItem['type'][]
              ).map((type) => {
                const count = day.items.filter((i) => i.type === type).length;
                if (count === 0) return null;
                const cfg = typeConfig[type];
                const Icon = cfg.icon;
                return (
                  <div
                    key={type}
                    className={`flex items-center gap-1 ${cfg.bg} rounded-full px-2.5 py-1`}
                  >
                    <Icon size={11} className={cfg.color} />
                    <span className={`text-[10px] font-bold ${cfg.color}`}>
                      {count} {type}
                    </span>
                  </div>
                );
              })}
            </div>
            {(dayUpdates[day.day]?.length ?? 0) > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">
                  AI improvements applied
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {dayUpdates[day.day].map((update) => (
                    <span
                      key={update}
                      className="text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 px-2 py-1"
                    >
                      {update}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI tip */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-2">
            <Sparkles size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>AI Tip for Day {day.day}:</strong>{' '}
              {cityAiTips[activeDay % cityAiTips.length]}
            </p>
          </div>

          {/* AI planner conversation */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">AI Planner</h4>
                <p className="text-[11px] text-gray-400">Refine Day {day.day} with your preferences</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {suggestionChips.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendPreference(suggestion)}
                  className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto mb-3">
              {chatMessages.length === 0 && (
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 leading-relaxed">
                  Tell me what you prefer and I will suggest adjustments to your {trip.city} itinerary.
                </div>
              )}
              {chatMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white ml-6'
                      : 'bg-blue-50 text-blue-800 mr-3'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <form
              className="relative"
              onSubmit={(event) => {
                event.preventDefault();
                sendPreference(chatInput);
              }}
            >
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Make this day more relaxed..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-10 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-300"
              />
              <button
                type="submit"
                aria-label="Send preference"
                className="absolute right-1.5 top-1.5 w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Send size={13} />
              </button>
            </form>
          </section>

          {/* Trip overview (desktop only) */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3">Trip Overview</h4>
            <div className="space-y-2">
              {itinerary.map((d, i) => (
                <button
                  key={d.day}
                  onClick={() => selectDay(i)}
                  className={`w-full flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                    activeDay === i ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                      activeDay === i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {d.day}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-semibold truncate ${
                        activeDay === i ? 'text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      {d.label}
                    </div>
                    <div className="text-[10px] text-gray-400">{d.date}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: interactive route and timeline */}
        <div className="md:col-span-2 space-y-4">
          {addedAttractions.length > 0 && (
            <section className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Camera size={15} className="text-blue-600" />
                <h3 className="text-sm font-bold text-gray-900">Added from Attractions</h3>
                <span className="ml-auto bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">
                  {addedAttractions.length} saved for your trip
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {addedAttractions.map((attraction) => (
                  <div
                    key={attraction.id}
                    className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-2.5"
                  >
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="h-16 w-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-blue-600 font-bold">{attraction.category}</p>
                      <h4 className="text-sm font-bold text-gray-900 truncate">{attraction.name}</h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                        <Clock size={10} />
                        {attraction.visitDuration}
                        <span className="text-gray-300">·</span>
                        {attraction.ticketPrice ?? 'Free'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {addedRestaurants.length > 0 && (
            <section className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Utensils size={15} className="text-orange-500" />
                <h3 className="text-sm font-bold text-gray-900">Added from Food</h3>
                <span className="ml-auto bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-full">
                  {addedRestaurants.length} dining plan{addedRestaurants.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {addedRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-2.5"
                  >
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="h-16 w-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-orange-600 font-bold">{restaurant.cuisine}</p>
                      <h4 className="text-sm font-bold text-gray-900 truncate">{restaurant.name}</h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={10} />
                        {restaurant.distance}
                        <span className="text-gray-300">·</span>
                        {restaurant.priceRange}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {addedEvents.length > 0 && (
            <section className="bg-white rounded-2xl border border-pink-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={15} className="text-pink-500" />
                <h3 className="text-sm font-bold text-gray-900">Added from Events</h3>
                <span className="ml-auto bg-pink-50 text-pink-600 text-[10px] font-bold px-2 py-1 rounded-full">
                  {addedEvents.length} event{addedEvents.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {addedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-2.5"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-16 w-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-pink-600 font-bold">{event.category}</p>
                      <h4 className="text-sm font-bold text-gray-900 truncate">{event.title}</h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar size={10} />
                        {event.date}
                        <span className="text-gray-300">·</span>
                        {event.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <MapView day={day} city={trip.city} onOpenMap={() => setIsMapOpen(true)} />

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={15} className="text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Improve this itinerary</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {improvementActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => applyImprovement(action.label, action.confirmation)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold border transition-colors ${
                    dayUpdates[day.day]?.includes(action.label)
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </section>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[3.25rem] top-12 bottom-4 w-px bg-gray-100" />

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Day {day.day} itinerary</h3>
              <span className="text-xs text-gray-400">{day.items.length} activities</span>
            </div>
            <div className="space-y-3">
              {day.items.map((item, index) => (
                <ItineraryCard
                  key={item.id}
                  item={item}
                  city={trip.city}
                  isFirst={index === 0}
                  isLast={index === day.items.length - 1}
                  onMoveUp={() => moveActivity(index, -1)}
                  onMoveDown={() => moveActivity(index, 1)}
                  onDelete={() => deleteActivity(item.id)}
                />
              ))}
              {day.items.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-8 text-center text-sm text-gray-400">
                  No activities planned for this day yet.
                </div>
              )}
            </div>
          </div>

          {/* Add activity button */}
          <button
            type="button"
            onClick={() => setIsAddActivityOpen(true)}
            className="w-full mt-4 border-2 border-dashed border-blue-200 rounded-2xl py-4 flex items-center justify-center gap-2 text-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm font-semibold">Add Activity</span>
          </button>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="fixed z-[60] bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-gray-900 text-white shadow-lg px-4 py-3 text-sm font-medium flex items-center gap-2"
        >
          <CheckCircle size={15} className="text-emerald-400" />
          {notice}
        </div>
      )}

      {isMapOpen && (
        <MapModal
          place={{
            name: `Day ${day.day}: ${day.label}`,
            city: trip.city,
            country: trip.country,
            address: day.items[0]?.location,
            distance: `${Math.max(1, day.items.length * 1.1).toFixed(1)} km`,
            walkingTime: `${Math.max(12, day.items.length * 11)} min`,
            transitTime: `${Math.max(8, day.items.length * 6)} min`,
            nearbyPlaces: day.items.slice(0, 3).map((item) => item.title),
          }}
          onClose={() => setIsMapOpen(false)}
          onAddToPlan={() => setNotice(`Day ${day.day} route is already in your plan.`)}
          isAdded
        />
      )}

      {isAddActivityOpen && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/55 backdrop-blur-sm flex items-end md:items-center justify-center md:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsAddActivityOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-activity-title"
            className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 id="add-activity-title" className="text-lg font-black text-gray-900">
                  Add Activity
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Day {day.day} · {day.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddActivityOpen(false)}
                aria-label="Close add activity"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>

            <form className="space-y-3" onSubmit={addActivity}>
              <label className="block">
                <span className="text-xs font-bold text-gray-600">Activity name</span>
                <input
                  required
                  value={newActivity.title}
                  onChange={(event) =>
                    setNewActivity((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Coffee tasting in Le Marais"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-300"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-bold text-gray-600">Type / category</span>
                  <select
                    value={newActivity.type}
                    onChange={(event) =>
                      setNewActivity((current) => ({
                        ...current,
                        type: event.target.value as ItineraryItem['type'],
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-300"
                  >
                    <option value="attraction">Attraction</option>
                    <option value="food">Food</option>
                    <option value="event">Event</option>
                    <option value="transport">Transport</option>
                    <option value="hotel">Hotel</option>
                    <option value="free">Free time</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-gray-600">Time</span>
                  <input
                    required
                    value={newActivity.time}
                    onChange={(event) =>
                      setNewActivity((current) => ({ ...current, time: event.target.value }))
                    }
                    placeholder="4:30 PM"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-300"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-bold text-gray-600">Duration</span>
                <input
                  required
                  value={newActivity.duration}
                  onChange={(event) =>
                    setNewActivity((current) => ({ ...current, duration: event.target.value }))
                  }
                  placeholder="1.5 hrs"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-300"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-gray-600">Short note</span>
                <textarea
                  value={newActivity.notes}
                  onChange={(event) =>
                    setNewActivity((current) => ({ ...current, notes: event.target.value }))
                  }
                  placeholder="Optional reminder or local tip"
                  rows={3}
                  className="mt-1 w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-300"
                />
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddActivityOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save activity
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default function PlannerPage() {
  const { trip, tripDays, plannedAttractions, plannedRestaurants, plannedEvents } = useTrip();
  const tripKey = `${trip.city}-${trip.startDate}-${trip.endDate}`;
  const addedAttractions = plannedAttractions.filter((attraction) => attraction.city === trip.city);
  const addedRestaurants = plannedRestaurants.filter((restaurant) => restaurant.city === trip.city);
  const addedEvents = plannedEvents.filter((event) => event.city === trip.city);

  return (
    <PlannerContent
      key={tripKey}
      trip={trip}
      tripDays={tripDays}
      addedAttractions={addedAttractions}
      addedRestaurants={addedRestaurants}
      addedEvents={addedEvents}
    />
  );
}
