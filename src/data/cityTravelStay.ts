export type TransportType = 'Flight' | 'Train' | 'Bus';

export interface TransportOption {
  id: string;
  type: TransportType;
  provider: string;
  route: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  baggage: string;
  comfort: string;
}

export interface StayOption {
  id: string;
  name: string;
  neighborhood: string;
  rating: number;
  pricePerNight: number;
  bestFor: string;
  amenities: string[];
}

interface Recommendation {
  transportId: string;
  stayId: string;
  title: string;
  reason: string;
}

export interface TravelStayData {
  transport: TransportOption[];
  stays: StayOption[];
  recommendation: Recommendation;
}

const travelStayData: Record<string, TravelStayData> = {
  Paris: {
    transport: [
      {
        id: 'par-train',
        type: 'Train',
        provider: 'Eurostar',
        route: 'London St Pancras - Paris Gare du Nord',
        departure: '08:01',
        arrival: '11:20',
        duration: '2h 19m',
        price: 89,
        baggage: '2 bags + hand luggage included',
        comfort: 'High comfort',
      },
      {
        id: 'par-flight',
        type: 'Flight',
        provider: 'Air France',
        route: 'Madrid MAD - Paris CDG',
        departure: '09:10',
        arrival: '11:15',
        duration: '2h 05m',
        price: 142,
        baggage: 'Cabin bag included',
        comfort: 'Standard comfort',
      },
      {
        id: 'par-bus',
        type: 'Bus',
        provider: 'FlixBus',
        route: 'Brussels Midi - Paris Bercy',
        departure: '07:30',
        arrival: '11:35',
        duration: '4h 05m',
        price: 27,
        baggage: '1 checked + 1 cabin bag',
        comfort: 'Budget comfort',
      },
    ],
    stays: [
      {
        id: 'par-hotel-central',
        name: 'Hotel Lumiere Marais',
        neighborhood: 'Le Marais',
        rating: 4.7,
        pricePerNight: 184,
        bestFor: 'Central location',
        amenities: ['Breakfast', 'Wi-Fi', 'Metro nearby', 'Concierge'],
      },
      {
        id: 'par-apartment',
        name: 'Left Bank Studio Suites',
        neighborhood: 'Saint-Germain',
        rating: 4.6,
        pricePerNight: 156,
        bestFor: 'Romantic',
        amenities: ['Kitchenette', 'Balcony', 'Wi-Fi'],
      },
      {
        id: 'par-budget',
        name: 'Canal Stay Hotel',
        neighborhood: 'Canal Saint-Martin',
        rating: 4.3,
        pricePerNight: 104,
        bestFor: 'Budget',
        amenities: ['Wi-Fi', 'Cafe', 'Luggage storage'],
      },
    ],
    recommendation: {
      transportId: 'par-train',
      stayId: 'par-hotel-central',
      title: 'Best value',
      reason:
        'Morning train + Hotel Lumiere Marais saves airport transfer time and keeps you close to major sights.',
    },
  },
  Barcelona: {
    transport: [
      {
        id: 'bcn-train',
        type: 'Train',
        provider: 'Renfe AVE',
        route: 'Madrid Atocha - Barcelona Sants',
        departure: '08:30',
        arrival: '11:15',
        duration: '2h 45m',
        price: 62,
        baggage: '3 pieces included',
        comfort: 'High comfort',
      },
      {
        id: 'bcn-flight',
        type: 'Flight',
        provider: 'Vueling',
        route: 'Seville SVQ - Barcelona BCN',
        departure: '09:05',
        arrival: '10:45',
        duration: '1h 40m',
        price: 93,
        baggage: 'Underseat bag included',
        comfort: 'Standard comfort',
      },
      {
        id: 'bcn-bus',
        type: 'Bus',
        provider: 'ALSA',
        route: 'Valencia - Barcelona Nord',
        departure: '07:00',
        arrival: '11:15',
        duration: '4h 15m',
        price: 31,
        baggage: 'Checked bag included',
        comfort: 'Comfort seats',
      },
    ],
    stays: [
      {
        id: 'bcn-hotel',
        name: 'Eixample Design Hotel',
        neighborhood: 'Eixample',
        rating: 4.8,
        pricePerNight: 169,
        bestFor: 'Central location',
        amenities: ['Rooftop pool', 'Breakfast', 'Wi-Fi', 'Gym'],
      },
      {
        id: 'bcn-apartment',
        name: 'Born Family Apartments',
        neighborhood: 'El Born',
        rating: 4.5,
        pricePerNight: 145,
        bestFor: 'Family',
        amenities: ['Kitchen', 'Washer', 'Two bedrooms'],
      },
      {
        id: 'bcn-budget',
        name: 'Gracia Urban Rooms',
        neighborhood: 'Gracia',
        rating: 4.4,
        pricePerNight: 92,
        bestFor: 'Budget',
        amenities: ['Wi-Fi', 'Shared terrace', 'Metro nearby'],
      },
    ],
    recommendation: {
      transportId: 'bcn-train',
      stayId: 'bcn-hotel',
      title: 'Best city break',
      reason:
        'AVE train + Eixample Design Hotel gives a fast city-center arrival and easy access to Gaudi highlights.',
    },
  },
  Rome: {
    transport: [
      {
        id: 'rom-train',
        type: 'Train',
        provider: 'Italo',
        route: 'Milan Centrale - Roma Termini',
        departure: '07:40',
        arrival: '10:50',
        duration: '3h 10m',
        price: 59,
        baggage: 'Bags included without fee',
        comfort: 'High comfort',
      },
      {
        id: 'rom-flight',
        type: 'Flight',
        provider: 'ITA Airways',
        route: 'Paris CDG - Rome FCO',
        departure: '08:20',
        arrival: '10:25',
        duration: '2h 05m',
        price: 128,
        baggage: 'Cabin bag included',
        comfort: 'Standard comfort',
      },
      {
        id: 'rom-bus',
        type: 'Bus',
        provider: 'Itabus',
        route: 'Florence Villa Costanza - Rome Tiburtina',
        departure: '08:00',
        arrival: '11:25',
        duration: '3h 25m',
        price: 18,
        baggage: '1 hold bag included',
        comfort: 'Budget comfort',
      },
    ],
    stays: [
      {
        id: 'rom-hotel',
        name: 'Palazzo Navona Boutique',
        neighborhood: 'Centro Storico',
        rating: 4.8,
        pricePerNight: 192,
        bestFor: 'Romantic',
        amenities: ['Rooftop terrace', 'Breakfast', 'Airport transfer'],
      },
      {
        id: 'rom-apartment',
        name: 'Monti Heritage Apartments',
        neighborhood: 'Monti',
        rating: 4.6,
        pricePerNight: 148,
        bestFor: 'Central location',
        amenities: ['Kitchen', 'Wi-Fi', 'Colosseum walk'],
      },
      {
        id: 'rom-budget',
        name: 'Trastevere Guesthouse',
        neighborhood: 'Trastevere',
        rating: 4.4,
        pricePerNight: 88,
        bestFor: 'Budget',
        amenities: ['Breakfast', 'Wi-Fi', 'Courtyard'],
      },
    ],
    recommendation: {
      transportId: 'rom-train',
      stayId: 'rom-apartment',
      title: 'Smoothest arrival',
      reason:
        'Italo train + Monti Heritage Apartments arrives centrally and puts ancient Rome within walking distance.',
    },
  },
  Istanbul: {
    transport: [
      {
        id: 'ist-flight',
        type: 'Flight',
        provider: 'Turkish Airlines',
        route: 'Madrid MAD - Istanbul IST',
        departure: '10:20',
        arrival: '15:35',
        duration: '4h 15m',
        price: 216,
        baggage: 'Cabin + 23 kg checked bag',
        comfort: 'High comfort',
      },
      {
        id: 'ist-train',
        type: 'Train',
        provider: 'TCDD / BDZ Night Express',
        route: 'Sofia Central - Istanbul Halkali',
        departure: '18:40',
        arrival: '06:34',
        duration: '11h 54m',
        price: 48,
        baggage: 'Luggage included',
        comfort: 'Sleeper cabin',
      },
      {
        id: 'ist-bus',
        type: 'Bus',
        provider: 'Metro Turizm',
        route: 'Ankara ASTI - Istanbul Esenler',
        departure: '08:00',
        arrival: '14:15',
        duration: '6h 15m',
        price: 24,
        baggage: '1 hold bag included',
        comfort: 'Comfort seats',
      },
    ],
    stays: [
      {
        id: 'ist-hotel',
        name: 'Bosphorus Terrace Hotel',
        neighborhood: 'Karakoy',
        rating: 4.8,
        pricePerNight: 138,
        bestFor: 'Romantic',
        amenities: ['Bosphorus views', 'Breakfast', 'Roof terrace'],
      },
      {
        id: 'ist-central',
        name: 'Sultanahmet Courtyard Inn',
        neighborhood: 'Sultanahmet',
        rating: 4.6,
        pricePerNight: 112,
        bestFor: 'Central location',
        amenities: ['Breakfast', 'Hammam', 'Airport shuttle'],
      },
      {
        id: 'ist-apartment',
        name: 'Galata Family Residence',
        neighborhood: 'Galata',
        rating: 4.5,
        pricePerNight: 86,
        bestFor: 'Family',
        amenities: ['Kitchen', 'Washer', 'Wi-Fi'],
      },
    ],
    recommendation: {
      transportId: 'ist-flight',
      stayId: 'ist-central',
      title: 'Best first visit',
      reason:
        'Direct flight + Sultanahmet Courtyard Inn reduces travel fatigue and puts historic highlights nearby.',
    },
  },
};

export function getCityTravelStayData(city: string): TravelStayData {
  return travelStayData[city] ?? travelStayData.Paris;
}
