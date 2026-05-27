import type { DetailedEvent, Event, EventDetails } from '../types';

export interface CityEventsData {
  events: DetailedEvent[];
  eventTip: string;
}

interface BaseCityEventsData {
  events: Event[];
  eventTip: string;
}

const detailGuidanceByCity: Record<string, Omit<EventDetails, 'whyAttend'>> = {
  Paris: {
    bestFor: 'Travelers who want an atmospheric Paris evening with culture woven into the trip.',
    localTip: 'Use the Metro for evening events and keep time afterward for a cafe stop nearby.',
    ticketAdvice: 'Book timed or small-group Paris events ahead; free public events need no ticket.',
  },
  Barcelona: {
    bestFor: 'Visitors who enjoy energetic nights, Catalan culture, and memorable shared experiences.',
    localTip: 'Barcelona events begin late; leave room for a relaxed meal before evening entry.',
    ticketAdvice: 'Popular festival and landmark evening tickets often sell out, so reserve early.',
  },
  Rome: {
    bestFor: 'Travelers looking to experience Roman history and summer life after sightseeing hours.',
    localTip: 'Evening venues pair well with a slow dinner; wear comfortable shoes on historic streets.',
    ticketAdvice: 'Reserve limited-access tours and classes early; arrive before the published start time.',
  },
  Istanbul: {
    bestFor: 'Visitors drawn to Istanbul traditions, waterfront views, and distinctive cultural settings.',
    localTip: 'Allow extra travel time across the city in the evening, especially when crossing the Bosphorus.',
    ticketAdvice: 'Secure seats for performances and cruises ahead; free walks can be added without booking.',
  },
};

function addEventDetails(event: Event, city: string): DetailedEvent {
  const guidance = detailGuidanceByCity[city] ?? detailGuidanceByCity.Paris;
  return {
    ...event,
    whyAttend: `${event.title} brings you into ${city}'s local event scene at ${event.venue}, with an experience that goes beyond a standard sightseeing stop.`,
    ...guidance,
  };
}

// Category names are intentionally shared across cities so the filter chips work consistently.
// Colours for these are defined in EventsPage.tsx's categoryColors map.

// ─── Paris ────────────────────────────────────────────────────────────────────
const parisEvents: BaseCityEventsData = {
  eventTip: "Paris really comes alive in summer. Fête de la Musique (Jun 21) fills every street corner with free music — don't miss it. Book evening events early as they sell out fast.",
  events: [
    {
      id: 'par-e1',
      title: 'Fête de la Musique',
      category: 'Music',
      date: 'Jun 21, 2026',
      time: 'All day',
      venue: 'Throughout Paris',
      address: 'Various locations',
      price: 'Free',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
      description: "France's largest free music festival — thousands of concerts fill the streets, parks and courtyards of the city all day and into the night.",
      tags: ['Free', 'Music', 'Outdoor', 'Festival'],
      isFeatured: true,
    },
    {
      id: 'par-e2',
      title: 'Louvre Late-Night Opening',
      category: 'Arts & Culture',
      date: 'Jun 10, 2026',
      time: '6:00 PM – 9:45 PM',
      venue: 'Musée du Louvre',
      address: 'Rue de Rivoli, 75001',
      price: '€17',
      image: 'https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?w=600&q=80',
      description: 'Extended evening opening with guided tours of the Egyptian Antiquities and French Crown Jewels — far fewer crowds than daytime.',
      tags: ['Art', 'Guided Tour', 'Evening'],
      isFeatured: true,
    },
    {
      id: 'par-e3',
      title: 'Paris Jazz Festival',
      category: 'Music',
      date: 'Jun 11–12, 2026',
      time: '4:00 PM – 7:30 PM',
      venue: 'Parc Floral de Paris',
      address: 'Route de la Pyramide, 75012',
      price: '€7',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80',
      description: 'Annual open-air jazz festival in the Parc Floral with French and international artists. Bring a blanket.',
      tags: ['Jazz', 'Outdoor', 'Park'],
    },
    {
      id: 'par-e4',
      title: 'French Pastry Cooking Class',
      category: 'Workshop',
      date: 'Jun 12, 2026',
      time: '10:00 AM – 1:00 PM',
      venue: "Cook'n With Class",
      address: '6 Rue Baudelique, 75018',
      price: '€85',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
      description: 'Learn to make croissants, éclairs and macarons from a professional Parisian pastry chef.',
      tags: ['Food', 'Workshop', 'Hands-on'],
    },
    {
      id: 'par-e5',
      title: 'Palais Royal Light Installation',
      category: 'Arts & Culture',
      date: 'Jun 10–14, 2026',
      time: 'Sunset (9:15 PM)',
      venue: 'Palais Royal Gardens',
      address: 'Place du Palais Royal, 75001',
      price: 'Free',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
      description: 'Nightly light and water installation at the historic Palais Royal gardens, running throughout June.',
      tags: ['Free', 'Art', 'Evening', 'Outdoors'],
    },
    {
      id: 'par-e6',
      title: 'Wine & Cheese Evening',
      category: 'Food & Drink',
      date: 'Jun 13, 2026',
      time: '7:00 PM – 9:30 PM',
      venue: 'Cave des Abbesses',
      address: '43 Rue des Abbesses, 75018',
      price: '€45',
      image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80',
      description: 'Guided tasting of 6 French wines paired with artisan cheeses from different French regions.',
      tags: ['Wine', 'Cheese', 'Tasting', 'Indoor'],
    },
  ],
};

// ─── Barcelona ────────────────────────────────────────────────────────────────
const barcelonaEvents: BaseCityEventsData = {
  eventTip: "Barcelona's festival season peaks in June and July — Primavera Sound and Sónar are world-class. Book tickets months ahead. La Mercè in September is the city's biggest free street festival.",
  events: [
    {
      id: 'bcn-e1',
      title: 'Primavera Sound',
      category: 'Music',
      date: 'Jun 5–9, 2026',
      time: '4:00 PM – 6:00 AM',
      venue: 'Parc del Fòrum',
      address: 'Av. d\'Eduard Maristany, 08019',
      price: '€95',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
      description: 'One of Europe\'s best music festivals spanning indie, electronic, pop and more — the Fòrum site by the sea makes it unforgettable.',
      tags: ['Festival', 'International', 'Multi-day'],
      isFeatured: true,
    },
    {
      id: 'bcn-e2',
      title: 'Sónar Festival',
      category: 'Music',
      date: 'Jun 12–14, 2026',
      time: '6:00 PM – 8:00 AM',
      venue: 'Fira Gran Via & Fira Montjuïc',
      address: 'Av. Joan Carles I, 64, 08908',
      price: '€75',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
      description: 'International festival of advanced music and new media art — daytime exhibitions and night-time concerts across two venues.',
      tags: ['Electronic', 'Art', 'Nightlife'],
      isFeatured: true,
    },
    {
      id: 'bcn-e3',
      title: 'FC Barcelona vs. Sevilla',
      category: 'Sports',
      date: 'Jun 11, 2026',
      time: '9:00 PM',
      venue: 'Spotify Camp Nou',
      address: 'C/ d\'Arístides Maillol, 12, 08028',
      price: '€60',
      image: 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=600&q=80',
      description: 'Catch Barcelona in action at the newly renovated Camp Nou — the largest stadium in Europe. A bucket-list experience for any football fan.',
      tags: ['Football', 'La Liga', 'Iconic Venue'],
    },
    {
      id: 'bcn-e4',
      title: 'Grec Festival: Flamenco Night',
      category: 'Arts & Culture',
      date: 'Jun 13, 2026',
      time: '9:30 PM',
      venue: 'Teatre Grec, Montjuïc',
      address: 'Passeig de Santa Madrona, 36',
      price: '€28',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80',
      description: 'The annual Grec summer festival brings world-class performing arts to the stunning open-air Greek theatre on Montjuïc hill.',
      tags: ['Theatre', 'Flamenco', 'Open Air'],
    },
    {
      id: 'bcn-e5',
      title: 'Tapas & Vermouth Tour',
      category: 'Food & Drink',
      date: 'Jun 10, 2026',
      time: '11:00 AM – 2:00 PM',
      venue: 'El Born & La Barceloneta',
      address: 'Meeting point: Mercat de Santa Caterina',
      price: '€65',
      image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600&q=80',
      description: 'Small-group walking tour hitting the best tapas bars in El Born, sampling jamón, pintxos and classic vermouth with a local guide.',
      tags: ['Food', 'Walking Tour', 'Small Group'],
    },
    {
      id: 'bcn-e6',
      title: 'Sagrada Família After Hours',
      category: 'Arts & Culture',
      date: 'Jun 10–14, 2026',
      time: '9:00 PM – 11:00 PM',
      venue: 'Sagrada Família',
      address: 'C/ de Mallorca, 401, 08013',
      price: '€40',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
      description: 'Exclusive evening access to Gaudí\'s masterpiece with a guided tour and illuminated façade — far fewer visitors than during the day.',
      tags: ['Architecture', 'Guided', 'Evening'],
    },
  ],
};

// ─── Rome ─────────────────────────────────────────────────────────────────────
const romeEvents: BaseCityEventsData = {
  eventTip: 'Estate Romana transforms the city every summer — free outdoor cinema, concerts and art in ancient settings. The Colosseum Night Tour sells out weeks in advance; book as soon as you can.',
  events: [
    {
      id: 'rom-e1',
      title: 'Estate Romana: Open-Air Cinema',
      category: 'Arts & Culture',
      date: 'Jun 10–14, 2026',
      time: '9:30 PM',
      venue: 'Isola Tiberina',
      address: 'Isola Tiberina, 00186',
      price: '€6',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
      description: "Rome's beloved summer festival turns the Tiber island into an open-air cinema. Watch international and Italian films under the stars with the ancient city as your backdrop.",
      tags: ['Cinema', 'Outdoor', 'Summer'],
      isFeatured: true,
    },
    {
      id: 'rom-e2',
      title: 'Jazz at Villa Celimontana',
      category: 'Music',
      date: 'Jun 11, 2026',
      time: '8:00 PM – 11:00 PM',
      venue: 'Villa Celimontana',
      address: 'Piazza della Navicella, 12, 00184',
      price: '€15',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80',
      description: 'Summer jazz festival in the gardens of Villa Celimontana, a Renaissance villa near the Colosseum — one of Rome\'s most atmospheric music events.',
      tags: ['Jazz', 'Garden', 'Summer'],
      isFeatured: true,
    },
    {
      id: 'rom-e3',
      title: 'Colosseum Night Tour',
      category: 'Arts & Culture',
      date: 'Jun 10–14, 2026',
      time: '8:15 PM – 11:00 PM',
      venue: 'Colosseum',
      address: 'Piazza del Colosseo, 1, 00184',
      price: '€28',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
      description: 'Experience the Colosseum lit up after dark with a small-group guided tour that brings two millennia of history vividly to life.',
      tags: ['History', 'Guided', 'Evening'],
    },
    {
      id: 'rom-e4',
      title: 'Fresh Pasta Cooking Class',
      category: 'Workshop',
      date: 'Jun 12, 2026',
      time: '10:00 AM – 1:30 PM',
      venue: 'Cook in Rome',
      address: 'Via dei Giubbonari, 54, 00186',
      price: '€75',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
      description: 'A hands-on class making fresh tagliatelle, gnocchi and tiramisù from scratch with a professional Roman chef in a home kitchen setting.',
      tags: ['Cooking', 'Hands-on', 'Small Group'],
    },
    {
      id: 'rom-e5',
      title: 'Vatican Museums Private Access',
      category: 'Arts & Culture',
      date: 'Jun 13, 2026',
      time: '7:00 AM – 9:00 AM',
      venue: 'Vatican Museums',
      address: 'Viale Vaticano, Vatican City',
      price: '€85',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80',
      description: 'Exclusive early-morning access before public opening — see the Sistine Chapel with virtually no crowds and a private expert guide.',
      tags: ['Art', 'Exclusive', 'Early Morning'],
    },
    {
      id: 'rom-e6',
      title: 'Trastevere Food & Wine Walk',
      category: 'Food & Drink',
      date: 'Jun 14, 2026',
      time: '6:00 PM – 9:30 PM',
      venue: 'Trastevere',
      address: 'Meeting: Piazza di Santa Maria in Trastevere',
      price: '€55',
      image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&q=80',
      description: 'Evening food walk through cobblestone Trastevere — supplì, cacio e pepe bites, and Lazio wines at five stops with a local guide.',
      tags: ['Food', 'Wine', 'Walking Tour'],
    },
  ],
};

// ─── Istanbul ────────────────────────────────────────────────────────────────
const istanbulEvents: BaseCityEventsData = {
  eventTip: 'The Istanbul Music Festival in June is world-class — book early. Whirling Dervish ceremonies at the Hodjapasha venue are a profound cultural experience; evening slots often sell out.',
  events: [
    {
      id: 'ist-e1',
      title: 'Istanbul International Music Festival',
      category: 'Music',
      date: 'Jun 5–27, 2026',
      time: 'Various (8:00 PM)',
      venue: 'Hagia Eirene & various venues',
      address: 'Topkapı Palace, Sultanahmet',
      price: '€25–€60',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
      description: "One of Europe's premier classical music festivals, held in the extraordinary setting of Hagia Eirene — a Byzantine church inside the Topkapi Palace complex.",
      tags: ['Classical', 'Historic Venue', 'World-class'],
      isFeatured: true,
    },
    {
      id: 'ist-e2',
      title: 'Whirling Dervishes Ceremony',
      category: 'Arts & Culture',
      date: 'Jun 10–14, 2026',
      time: '7:30 PM',
      venue: 'Hodjapasha Cultural Center',
      address: 'Hoca Paşa Mh., Ankara Cad. No:3',
      price: '€25',
      image: 'https://images.unsplash.com/photo-1545041019-38cfd79c8cfa?w=600&q=80',
      description: "A Sema ceremony by the Mevlevi Order — a mesmerising Sufi spiritual practice where dervishes whirl in white robes as a form of meditation. A deeply moving experience.",
      tags: ['Cultural', 'Sufi', 'Traditional'],
      isFeatured: true,
    },
    {
      id: 'ist-e3',
      title: 'Bosphorus Sunset Cruise',
      category: 'Food & Drink',
      date: 'Jun 10–14, 2026',
      time: '6:30 PM – 9:00 PM',
      venue: 'Eminönü Ferry Terminal',
      address: 'Eminönü Meydanı, 34110',
      price: '€40',
      image: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=600&q=80',
      description: 'Two-hour dinner cruise along the Bosphorus with traditional Turkish mezes and live fasıl music — watch the city glow as the sun dips behind the minarets.',
      tags: ['Cruise', 'Dinner', 'Views'],
    },
    {
      id: 'ist-e4',
      title: 'Turkish Cooking Masterclass',
      category: 'Workshop',
      date: 'Jun 12, 2026',
      time: '10:00 AM – 2:00 PM',
      venue: 'Istanbul Culinary Institute',
      address: 'Meşrutiyet Cad. 59, Beyoğlu',
      price: '€70',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
      description: 'Learn to cook köfte, börek, and baklava alongside a professional Turkish chef. Market visit to the Spice Bazaar included.',
      tags: ['Cooking', 'Spice Bazaar', 'Hands-on'],
    },
    {
      id: 'ist-e5',
      title: 'Street Art Walk: Karaköy',
      category: 'Arts & Culture',
      date: 'Jun 11, 2026',
      time: '3:00 PM – 5:30 PM',
      venue: 'Karaköy & Galata',
      address: 'Meeting: Karaköy Square',
      price: 'Free',
      image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=600&q=80',
      description: "Self-guided walking tour map of Karaköy's vibrant street art scene — where Ottoman architecture meets contemporary murals.",
      tags: ['Free', 'Art', 'Walking Tour'],
    },
    {
      id: 'ist-e6',
      title: 'Grand Bazaar Treasure Hunt',
      category: 'Workshop',
      date: 'Jun 13, 2026',
      time: '9:30 AM – 12:30 PM',
      venue: 'Grand Bazaar',
      address: 'Beyazıt, Kalpakçılar Cd. No:22',
      price: '€35',
      image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80',
      description: "Guided exploration of the Grand Bazaar's 60 streets with an expert who teaches you how to spot quality carpets, ceramics and jewellery — and how to haggle.",
      tags: ['Shopping', 'Guided', 'Cultural'],
    },
  ],
};

// ─── Data map ─────────────────────────────────────────────────────────────────
const cityEventsData: Record<string, BaseCityEventsData> = {
  Paris: parisEvents,
  Barcelona: barcelonaEvents,
  Rome: romeEvents,
  Istanbul: istanbulEvents,
};

export function getCityEventsData(city: string): CityEventsData {
  const resolvedCity = cityEventsData[city] ? city : 'Paris';
  const cityData = cityEventsData[resolvedCity];
  return {
    eventTip: cityData.eventTip,
    events: cityData.events.map((event) => addEventDetails(event, resolvedCity)),
  };
}
