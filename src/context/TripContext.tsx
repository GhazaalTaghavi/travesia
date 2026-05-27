import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { DetailedEvent, DetailedLandmark, Restaurant } from '../types';
import type { StayOption, TransportOption } from '../data/cityTravelStay';

export interface TripSettings {
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  travelers: number;
  coverImage: string;
  description: string;
}

export interface TripAttraction extends DetailedLandmark {
  city: string;
}

export interface TripRestaurant extends Restaurant {
  city: string;
}

export interface TripEvent extends DetailedEvent {
  city: string;
}

export interface EventReservation extends TripEvent {
  reservationId: string;
  optionName: string;
  optionPrice: string;
  people: number;
  guestName: string;
  guestEmail: string;
  session: string;
  totalPrice: string;
  status: 'Confirmed';
}

export interface SelectedTravelPlan {
  transport?: TransportOption;
  stay?: StayOption;
}

/** Parse "Jun 10, 2026" → Date (or null if unparseable) */
function parseTripDate(displayDate: string): Date | null {
  const d = new Date(displayDate);
  return isNaN(d.getTime()) ? null : d;
}

interface TripContextType {
  trip: TripSettings;
  updateTrip: (updates: Partial<TripSettings>) => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  /** Number of days in the trip (inclusive). Falls back to 1 if dates can't be parsed. */
  tripDays: number;
  plannedAttractions: TripAttraction[];
  savedAttractions: TripAttraction[];
  plannedRestaurants: TripRestaurant[];
  savedRestaurants: TripRestaurant[];
  plannedEvents: TripEvent[];
  savedEvents: TripEvent[];
  eventReservations: EventReservation[];
  travelPlans: Record<string, SelectedTravelPlan>;
  addAttractionToPlan: (attraction: DetailedLandmark) => void;
  saveAttraction: (attraction: DetailedLandmark) => void;
  addRestaurantToPlan: (restaurant: Restaurant) => void;
  saveRestaurant: (restaurant: Restaurant) => void;
  addEventToPlan: (event: DetailedEvent) => void;
  saveEvent: (event: DetailedEvent) => void;
  addEventReservation: (reservation: Omit<EventReservation, 'city'>) => void;
  cancelEventReservation: (reservationId: string) => void;
  selectTravelTransport: (option: TransportOption) => void;
  reserveTravelStay: (stay: StayOption) => void;
}

const defaultTrip: TripSettings = {
  city: 'Paris',
  country: 'France',
  startDate: 'Jun 10, 2026',
  endDate: 'Jun 14, 2026',
  travelers: 2,
  coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
  description:
    'Experience the magic of the City of Light — art, culture, cuisine and romance await.',
};

const TripContext = createContext<TripContextType>({
  trip: defaultTrip,
  updateTrip: () => {},
  isSettingsOpen: false,
  openSettings: () => {},
  closeSettings: () => {},
  tripDays: 5,
  plannedAttractions: [],
  savedAttractions: [],
  plannedRestaurants: [],
  savedRestaurants: [],
  plannedEvents: [],
  savedEvents: [],
  eventReservations: [],
  travelPlans: {},
  addAttractionToPlan: () => {},
  saveAttraction: () => {},
  addRestaurantToPlan: () => {},
  saveRestaurant: () => {},
  addEventToPlan: () => {},
  saveEvent: () => {},
  addEventReservation: () => {},
  cancelEventReservation: () => {},
  selectTravelTransport: () => {},
  reserveTravelStay: () => {},
});

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState<TripSettings>(defaultTrip);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [plannedAttractions, setPlannedAttractions] = useState<TripAttraction[]>([]);
  const [savedAttractions, setSavedAttractions] = useState<TripAttraction[]>([]);
  const [plannedRestaurants, setPlannedRestaurants] = useState<TripRestaurant[]>([]);
  const [savedRestaurants, setSavedRestaurants] = useState<TripRestaurant[]>([]);
  const [plannedEvents, setPlannedEvents] = useState<TripEvent[]>([]);
  const [savedEvents, setSavedEvents] = useState<TripEvent[]>([]);
  const [eventReservations, setEventReservations] = useState<EventReservation[]>([]);
  const [travelPlans, setTravelPlans] = useState<Record<string, SelectedTravelPlan>>({});

  const updateTrip = (updates: Partial<TripSettings>) => {
    setTrip((prev) => ({ ...prev, ...updates }));
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const addAttractionToPlan = (attraction: DetailedLandmark) => {
    setPlannedAttractions((previous) => {
      if (previous.some((item) => item.city === trip.city && item.id === attraction.id)) {
        return previous;
      }
      return [...previous, { ...attraction, city: trip.city }];
    });
  };

  const saveAttraction = (attraction: DetailedLandmark) => {
    setSavedAttractions((previous) => {
      if (previous.some((item) => item.city === trip.city && item.id === attraction.id)) {
        return previous;
      }
      return [...previous, { ...attraction, city: trip.city }];
    });
  };

  const addRestaurantToPlan = (restaurant: Restaurant) => {
    setPlannedRestaurants((previous) => {
      if (previous.some((item) => item.city === trip.city && item.id === restaurant.id)) {
        return previous;
      }
      return [...previous, { ...restaurant, city: trip.city }];
    });
  };

  const saveRestaurant = (restaurant: Restaurant) => {
    setSavedRestaurants((previous) => {
      if (previous.some((item) => item.city === trip.city && item.id === restaurant.id)) {
        return previous;
      }
      return [...previous, { ...restaurant, city: trip.city }];
    });
  };

  const addEventToPlan = (event: DetailedEvent) => {
    setPlannedEvents((previous) => {
      if (previous.some((item) => item.city === trip.city && item.id === event.id)) {
        return previous;
      }
      return [...previous, { ...event, city: trip.city }];
    });
  };

  const saveEvent = (event: DetailedEvent) => {
    setSavedEvents((previous) => {
      if (previous.some((item) => item.city === trip.city && item.id === event.id)) {
        return previous;
      }
      return [...previous, { ...event, city: trip.city }];
    });
  };

  const addEventReservation = (reservation: Omit<EventReservation, 'city'>) => {
    setEventReservations((previous) => {
      const confirmedReservation = { ...reservation, city: trip.city };
      const existingIndex = previous.findIndex(
        (item) => item.reservationId === reservation.reservationId,
      );
      if (existingIndex === -1) {
        return [...previous, confirmedReservation];
      }
      return previous.map((item, index) =>
        index === existingIndex ? confirmedReservation : item,
      );
    });
  };

  const cancelEventReservation = (reservationId: string) => {
    setEventReservations((previous) =>
      previous.filter((reservation) => reservation.reservationId !== reservationId),
    );
  };

  const selectTravelTransport = (option: TransportOption) => {
    setTravelPlans((previous) => ({
      ...previous,
      [trip.city]: { ...previous[trip.city], transport: option },
    }));
  };

  const reserveTravelStay = (stay: StayOption) => {
    setTravelPlans((previous) => ({
      ...previous,
      [trip.city]: { ...previous[trip.city], stay },
    }));
  };

  const tripDays = useMemo(() => {
    const start = parseTripDate(trip.startDate);
    const end = parseTripDate(trip.endDate);
    if (!start || !end) return 1;
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff + 1); // inclusive (Jun 10 → Jun 14 = 5 days)
  }, [trip.startDate, trip.endDate]);

  return (
    <TripContext.Provider
      value={{
        trip,
        updateTrip,
        isSettingsOpen,
        openSettings,
        closeSettings,
        tripDays,
        plannedAttractions,
        savedAttractions,
        plannedRestaurants,
        savedRestaurants,
        plannedEvents,
        savedEvents,
        eventReservations,
        travelPlans,
        addAttractionToPlan,
        saveAttraction,
        addRestaurantToPlan,
        saveRestaurant,
        addEventToPlan,
        saveEvent,
        addEventReservation,
        cancelEventReservation,
        selectTravelTransport,
        reserveTravelStay,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(TripContext);
}
