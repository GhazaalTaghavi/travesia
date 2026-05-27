export interface Landmark {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  distance: string;
  openNow: boolean;
  hours: string;
  image: string;
  tags: string[];
  address: string;
  ticketPrice?: string;
}

export interface AttractionDetails {
  whyVisit: string;
  bestTimeToVisit: string;
  visitDuration: string;
  localTip: string;
}

export type DetailedLandmark = Landmark & AttractionDetails;

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  distance: string;
  openNow: boolean;
  hours: string;
  image: string;
  tags: string[];
  address: string;
  specialDish: string;
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  allergens: string[];
  calories?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isPopular?: boolean;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export interface WeatherDay {
  date: string;
  day: string;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface PackingItem {
  item: string;
  category: string;
  reason: string;
}

export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  price: string;
  image: string;
  description: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface EventDetails {
  whyAttend: string;
  bestFor: string;
  localTip: string;
  ticketAdvice: string;
}

export type DetailedEvent = Event & EventDetails;

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  type: 'attraction' | 'food' | 'transport' | 'hotel' | 'event' | 'free';
  duration: string;
  location: string;
  notes?: string;
  cost?: string;
  image?: string;
}

export interface DayPlan {
  day: number;
  date: string;
  label: string;
  items: ItineraryItem[];
}

export interface TripInfo {
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  travelers: number;
  coverImage: string;
  description: string;
}

export interface ScanLandmarkResult {
  name: string;
  confidence: number;
  category: string;
  description: string;
  rating: number;
  openNow: boolean;
  hours: string;
  ticketPrice: string;
  distance: string;
  image: string;
  funFact: string;
}

export interface ScanMenuItem {
  original: string;
  translated: string;
  price: string;
  description: string;
  allergens: string[];
  isPopular: boolean;
}
