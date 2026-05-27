import type { ItineraryItem } from '../types';

/** One day without its number or date — those are computed from trip.startDate in the page */
export interface CityDayPlan {
  label: string;
  items: ItineraryItem[];
}

export interface CityPlannerData {
  days: CityDayPlan[];
  aiTips: string[]; // one per day, indexed to match days[]
}

// ─── Paris ────────────────────────────────────────────────────────────────────
const parisPlan: CityPlannerData = {
  aiTips: [
    'Book the Eiffel Tower summit tickets online well in advance — queues without a ticket can be 2+ hours. Evening light shows are free and unmissable.',
    'Arrive at the Louvre right at 9 AM; crowds build fast. Use the Porte des Lions entrance to skip the main pyramid queue.',
    'Montmartre is best explored on foot early morning before tour groups arrive. Wear grippy shoes — the hill is steeper than it looks.',
    'Take the RER C all the way to Versailles-Château — direct and cheaper than a tour. Avoid Mondays when part of the palace is closed.',
    'CDG airport can be very busy. Allow at least 3 hours before departure and pre-book your taxi or RER transfer the night before.',
  ],
  days: [
    {
      label: 'Arrival & Eiffel',
      items: [
        {
          id: 'par-1-1', time: '2:00 PM', title: 'Hotel check-in',
          type: 'hotel', duration: '30 min',
          location: 'Hôtel du Louvre, 75001', notes: 'Early check-in confirmed',
          cost: 'Prepaid',
        },
        {
          id: 'par-1-2', time: '3:00 PM', title: 'Champ de Mars & Eiffel Tower',
          type: 'attraction', duration: '2.5 hrs',
          location: 'Champ de Mars, 75007', notes: 'Summit tickets booked for 4:30 PM',
          cost: '€26/person',
          image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&q=80',
        },
        {
          id: 'par-1-3', time: '6:00 PM', title: 'Golden-hour walk along the Seine',
          type: 'free', duration: '1 hr',
          location: 'Quai Branly, 75007', notes: 'Perfect for photos — Pont de Bir-Hakeim is iconic',
        },
        {
          id: 'par-1-4', time: '7:30 PM', title: 'Dinner at Le Bouillon Chartier',
          type: 'food', duration: '1.5 hrs',
          location: '7 Rue du Faubourg Montmartre', notes: 'No reservation needed. Cash preferred.',
          cost: '~€30/person',
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
        },
        {
          id: 'par-1-5', time: '9:30 PM', title: 'Eiffel Tower light show from Trocadéro',
          type: 'attraction', duration: '30 min',
          location: 'Place du Trocadéro, 75016', notes: 'Sparkles every hour on the hour — completely free',
        },
      ],
    },
    {
      label: 'Museums Day',
      items: [
        {
          id: 'par-2-1', time: '8:00 AM', title: 'Breakfast at Café de Flore',
          type: 'food', duration: '1 hr',
          location: '172 Bd Saint-Germain, 75006', notes: 'Famous literary café — go early before the rush',
          cost: '~€20/person',
        },
        {
          id: 'par-2-2', time: '9:30 AM', title: 'Louvre Museum',
          type: 'attraction', duration: '4 hrs',
          location: 'Rue de Rivoli, 75001', notes: 'Focus: Mona Lisa, Venus de Milo, Winged Victory',
          cost: '€17/person',
          image: 'https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?w=400&q=80',
        },
        {
          id: 'par-2-3', time: '2:00 PM', title: 'Lunch at Café Marly',
          type: 'food', duration: '1 hr',
          location: '93 Rue de Rivoli, 75001', notes: 'Overlooks the Louvre pyramid — worth the price',
          cost: '~€35/person',
        },
        {
          id: 'par-2-4', time: '3:30 PM', title: "Musée d'Orsay",
          type: 'attraction', duration: '2.5 hrs',
          location: "1 Rue de la Légion d'Honneur, 75007", notes: 'Monet, Van Gogh, Renoir collections',
          cost: '€16/person',
          image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80',
        },
        {
          id: 'par-2-5', time: '7:00 PM', title: 'Paris Jazz Festival',
          type: 'event', duration: '2.5 hrs',
          location: 'Parc Floral de Paris, 75012', notes: 'Bring a blanket and a picnic!',
          cost: '€7/person',
        },
      ],
    },
    {
      label: 'Montmartre & Seine',
      items: [
        {
          id: 'par-3-1', time: '9:00 AM', title: 'Montmartre & Sacré-Cœur Basilica',
          type: 'attraction', duration: '2 hrs',
          location: '35 Rue du Chevalier de la Barre, 75018', notes: 'Morning is best — fewer crowds. Dome climb is free',
          cost: 'Free',
          image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=400&q=80',
        },
        {
          id: 'par-3-2', time: '11:00 AM', title: 'French Pastry Cooking Class',
          type: 'event', duration: '3 hrs',
          location: '6 Rue Baudelique, 75018', notes: 'Hands-on — wear comfortable clothes',
          cost: '€85/person',
        },
        {
          id: 'par-3-3', time: '2:30 PM', title: 'Lunch at a local crêperie',
          type: 'food', duration: '45 min',
          location: 'Rue Lepic, Montmartre', notes: 'Try the savoury galettes — buckwheat with cheese and ham',
          cost: '~€15/person',
        },
        {
          id: 'par-3-4', time: '4:00 PM', title: 'Seine River Cruise',
          type: 'attraction', duration: '1.5 hrs',
          location: "Pont de l'Alma dock, 75007", notes: 'Bateaux Parisiens — book online for a discount',
          cost: '€17/person',
        },
        {
          id: 'par-3-5', time: '7:30 PM', title: 'Dinner at Septime',
          type: 'food', duration: '2.5 hrs',
          location: '80 Rue de Charonne, 75011', notes: 'Michelin-starred. Reservation required weeks in advance!',
          cost: '~€95/person',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
        },
      ],
    },
    {
      label: 'Versailles Day Trip',
      items: [
        {
          id: 'par-4-1', time: '8:30 AM', title: 'RER C to Versailles',
          type: 'transport', duration: '45 min',
          location: "Gare d'Austerlitz", notes: 'Take RER C direction Versailles-Château',
          cost: '€7/person return',
        },
        {
          id: 'par-4-2', time: '9:30 AM', title: 'Palace of Versailles',
          type: 'attraction', duration: '4 hrs',
          location: "Place d'Armes, Versailles", notes: 'State apartments, Hall of Mirrors, gardens',
          cost: '€19.50/person',
          image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400&q=80',
        },
        {
          id: 'par-4-3', time: '2:00 PM', title: 'Lunch in Versailles town',
          type: 'food', duration: '1 hr',
          location: 'Rue de la Paroisse, Versailles',
          cost: '~€20/person',
        },
        {
          id: 'par-4-4', time: '4:00 PM', title: 'Return train to Paris',
          type: 'transport', duration: '45 min',
          location: 'Versailles-Château station',
        },
        {
          id: 'par-4-5', time: '5:30 PM', title: 'Le Marais neighbourhood walk',
          type: 'free', duration: '2 hrs',
          location: 'Place des Vosges, 75004', notes: 'Galleries, boutiques and the oldest square in Paris',
        },
      ],
    },
    {
      label: 'Last Day & Departure',
      items: [
        {
          id: 'par-5-1', time: '9:00 AM', title: 'Morning stroll in Tuileries Garden',
          type: 'free', duration: '1 hr',
          location: 'Jardin des Tuileries, 75001', notes: 'Final peaceful Paris morning',
        },
        {
          id: 'par-5-2', time: '10:30 AM', title: 'Souvenir shopping — Rue de Rivoli',
          type: 'free', duration: '1.5 hrs',
          location: 'Rue de Rivoli, 75001',
          cost: 'Budget: €50',
        },
        {
          id: 'par-5-3', time: '12:30 PM', title: 'Final lunch at Brasserie Lipp',
          type: 'food', duration: '1.5 hrs',
          location: '151 Bd Saint-Germain, 75006',
          cost: '~€40/person',
        },
        {
          id: 'par-5-4', time: '2:30 PM', title: 'Hotel checkout & taxi to CDG',
          type: 'transport', duration: '1 hr',
          location: 'CDG Airport', notes: 'Flight at 5:30 PM — allow 3 hrs for check-in and security',
          cost: '~€55',
        },
      ],
    },
  ],
};

// ─── Barcelona ────────────────────────────────────────────────────────────────
const barcelonaPlan: CityPlannerData = {
  aiTips: [
    "Barcelona's Gothic Quarter is magical at dusk — get lost in the lanes after the crowds thin out. The Barri Gòtic is completely free to explore.",
    "Book Sagrada Família tickets at least 2 weeks in advance — they sell out fast. Park Güell's monumental zone also needs pre-booking.",
    "La Barceloneta beach gets very crowded by 11 AM. Arrive early, then escape the heat in the Picasso Museum after lunch.",
    "Montjuïc by cable car offers the best panoramic views. The castle and Olympic stadium are free — great value for a half-day.",
    "El Prat airport has two terminals. Double-check which one your airline uses and allow 2.5 hrs minimum for departures.",
  ],
  days: [
    {
      label: 'Arrival & Gothic Quarter',
      items: [
        {
          id: 'bcn-1-1', time: '2:30 PM', title: 'Hotel check-in',
          type: 'hotel', duration: '30 min',
          location: 'Eixample district hotel', notes: 'Central location — easy metro access to all sights',
          cost: 'Prepaid',
        },
        {
          id: 'bcn-1-2', time: '3:30 PM', title: 'Gothic Quarter exploration',
          type: 'free', duration: '2 hrs',
          location: 'Barri Gòtic, Barcelona', notes: 'No map — just wander the medieval lanes and discover hidden plazas',
        },
        {
          id: 'bcn-1-3', time: '6:00 PM', title: 'Barcelona Cathedral',
          type: 'attraction', duration: '45 min',
          location: 'Pla de la Seu, s/n, 08002', notes: 'Free entry until 12:30 PM and after 5:30 PM. Watch for the 13 white geese in the cloister',
          cost: 'Free',
        },
        {
          id: 'bcn-1-4', time: '7:30 PM', title: 'Vermouth hour at El Nacional',
          type: 'food', duration: '1 hr',
          location: 'Pg. de Gràcia, 24 Bis, 08007', notes: 'Barcelona tradition: vermouth with olives and light tapas before dinner',
          cost: '~€15/person',
        },
        {
          id: 'bcn-1-5', time: '9:00 PM', title: 'Dinner at Cervecería Catalana',
          type: 'food', duration: '1.5 hrs',
          location: 'C/ de Mallorca, 236, 08008', notes: 'No reservations — arrive early or expect a short queue',
          cost: '~€25/person',
          image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&q=80',
        },
      ],
    },
    {
      label: 'Gaudí Day',
      items: [
        {
          id: 'bcn-2-1', time: '9:00 AM', title: 'Sagrada Família',
          type: 'attraction', duration: '2.5 hrs',
          location: 'C/ de Mallorca, 401, 08013', notes: 'Timed entry tickets booked. Tower access highly recommended for views',
          cost: '€26/person',
          image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80',
        },
        {
          id: 'bcn-2-2', time: '12:00 PM', title: 'Lunch at a local café in Eixample',
          type: 'food', duration: '1 hr',
          location: 'Eixample, Barcelona', notes: 'Try the menú del día — a 3-course lunch for ~€12–15',
          cost: '~€15/person',
        },
        {
          id: 'bcn-2-3', time: '1:30 PM', title: 'Park Güell',
          type: 'attraction', duration: '2 hrs',
          location: "C/ d'Olot, s/n, 08024", notes: 'Monumental zone tickets needed. Visit the terrace early for best views',
          cost: '€10/person',
          image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80',
        },
        {
          id: 'bcn-2-4', time: '4:30 PM', title: 'Passeig de Gràcia walk — Casa Batlló & Casa Milà',
          type: 'free', duration: '1 hr',
          location: 'Pg. de Gràcia, Barcelona', notes: 'Admire the Gaudí and Modernista exteriors for free — save the €35 interior for another time',
        },
        {
          id: 'bcn-2-5', time: '7:30 PM', title: 'Tapas dinner at Bodega Sepúlveda',
          type: 'food', duration: '2 hrs',
          location: 'C/ de Sepúlveda, 173, 08011', notes: 'Neighbourhood wine bar — excellent Catalan cheese and charcuterie',
          cost: '~€30/person',
        },
      ],
    },
    {
      label: 'Barceloneta & El Born',
      items: [
        {
          id: 'bcn-3-1', time: '9:30 AM', title: 'Barceloneta beach morning',
          type: 'free', duration: '1.5 hrs',
          location: 'Platja de la Barceloneta', notes: 'Morning swim before the beach fills up. Sunscreen essential',
        },
        {
          id: 'bcn-3-2', time: '11:30 AM', title: 'La Barceloneta neighbourhood walk',
          type: 'free', duration: '45 min',
          location: 'La Barceloneta, Barcelona', notes: 'Original 18th-century fishing quarter — charming narrow streets',
        },
        {
          id: 'bcn-3-3', time: '1:00 PM', title: 'Seafood lunch at La Mar Salada',
          type: 'food', duration: '1.5 hrs',
          location: 'Pg. de Joan de Borbó, 58–59', notes: 'The black rice with alioli is a must',
          cost: '~€35/person',
          image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80',
        },
        {
          id: 'bcn-3-4', time: '3:30 PM', title: 'Picasso Museum',
          type: 'attraction', duration: '2 hrs',
          location: 'C/ Montcada, 15-23, 08003', notes: 'Free on first Sunday of the month and Thursday evenings',
          cost: '€14/person',
        },
        {
          id: 'bcn-3-5', time: '7:00 PM', title: 'Evening tapas crawl in El Born',
          type: 'food', duration: '2.5 hrs',
          location: 'El Born district, Barcelona', notes: 'Bar Marsella, El Xampanyet — no need to book, just wander',
          cost: '~€25/person',
        },
      ],
    },
    {
      label: 'Montjuïc & Views',
      items: [
        {
          id: 'bcn-4-1', time: '9:00 AM', title: 'Cable car up to Montjuïc',
          type: 'transport', duration: '20 min',
          location: 'Paral·lel metro station', notes: 'Teleféric de Montjuïc runs from Paral·lel — scenic ride up the hill',
          cost: '€12/person return',
        },
        {
          id: 'bcn-4-2', time: '9:30 AM', title: 'Palau Nacional — MNAC',
          type: 'attraction', duration: '2.5 hrs',
          location: 'Palau Nacional, Parc de Montjuïc', notes: 'World-class Romanesque art collection. Rooftop terrace has best city views',
          cost: '€12/person',
          image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80',
        },
        {
          id: 'bcn-4-3', time: '12:30 PM', title: 'Lunch on Montjuïc',
          type: 'food', duration: '1 hr',
          location: 'Montjuïc, Barcelona',
          cost: '~€20/person',
        },
        {
          id: 'bcn-4-4', time: '2:30 PM', title: 'Montjuïc Castle & gardens',
          type: 'attraction', duration: '1.5 hrs',
          location: 'Carretera de Montjuïc, 66', notes: 'Panoramic views of the port and city. Gardens are free',
          cost: '€5/person',
        },
        {
          id: 'bcn-4-5', time: '7:00 PM', title: 'Sunset dinner at El Quim de la Boqueria',
          type: 'food', duration: '1.5 hrs',
          location: 'Mercat de la Boqueria, La Rambla 91', notes: 'Counter seating only — arrive when they open for evening service',
          cost: '~€30/person',
          image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80',
        },
      ],
    },
    {
      label: 'Last Day & Departure',
      items: [
        {
          id: 'bcn-5-1', time: '8:00 AM', title: 'La Boqueria market breakfast',
          type: 'food', duration: '1 hr',
          location: 'La Rambla 91, 08001', notes: 'Go early before the tourist rush. Try fresh fruit and a tortilla bocadillo',
          cost: '~€10/person',
        },
        {
          id: 'bcn-5-2', time: '9:30 AM', title: 'Final La Rambla stroll & souvenir shopping',
          type: 'free', duration: '1.5 hrs',
          location: 'La Rambla, Barcelona',
          cost: 'Budget: €40',
        },
        {
          id: 'bcn-5-3', time: '11:30 AM', title: 'Hotel checkout',
          type: 'hotel', duration: '30 min',
          location: 'Hotel reception',
        },
        {
          id: 'bcn-5-4', time: '12:30 PM', title: 'Lunch near hotel',
          type: 'food', duration: '1 hr',
          location: 'Eixample, Barcelona',
          cost: '~€20/person',
        },
        {
          id: 'bcn-5-5', time: '2:30 PM', title: 'Taxi to El Prat Airport',
          type: 'transport', duration: '45 min',
          location: 'Barcelona El Prat Airport (BCN)', notes: 'Allow 2.5 hrs before departure — check your terminal (T1 or T2)',
          cost: '~€35',
        },
      ],
    },
  ],
};

// ─── Rome ─────────────────────────────────────────────────────────────────────
const romePlan: CityPlannerData = {
  aiTips: [
    'The Trevi Fountain is least crowded at 7–8 AM. Visit on your way to the hotel and enjoy it nearly alone before the day-trippers arrive.',
    'Buy the Colosseum + Roman Forum + Palatine combo ticket online — it covers all three sites and skips the long ticket queue.',
    'Vatican entry closes at 4 PM. Arrive no later than 2 PM even with pre-booked tickets. The Sistine Chapel photography ban is enforced.',
    'The Pantheon requires paid timed entry now. Book online. Piazza Navona, Campo de Fiori and the Spanish Steps are always free.',
    "Rome's Fiumicino airport takes 30–40 min by express train from Termini. Buy the Leonardo Express ticket in advance to save queuing.",
  ],
  days: [
    {
      label: 'Arrival & Trastevere',
      items: [
        {
          id: 'rom-1-1', time: '2:30 PM', title: 'Hotel check-in',
          type: 'hotel', duration: '30 min',
          location: 'Hotel near Trastevere', notes: 'Drop luggage and head straight out — afternoon light is beautiful',
          cost: 'Prepaid',
        },
        {
          id: 'rom-1-2', time: '3:30 PM', title: 'Trevi Fountain & Spanish Steps',
          type: 'attraction', duration: '1.5 hrs',
          location: 'Piazza di Trevi & Piazza di Spagna', notes: 'Toss a coin at Trevi for good luck. Gelato at the Spanish Steps is overpriced — buy elsewhere!',
          cost: 'Free',
          image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=400&q=80',
        },
        {
          id: 'rom-1-3', time: '5:30 PM', title: 'Aperitivo at Campo de Fiori',
          type: 'food', duration: '1 hr',
          location: 'Campo de Fiori, 00186', notes: 'Lively piazza with outdoor bars — Spritz or Aperol with free nibbles',
          cost: '~€12/person',
        },
        {
          id: 'rom-1-4', time: '7:30 PM', title: 'Explore Trastevere neighbourhood',
          type: 'free', duration: '1 hr',
          location: 'Trastevere, Rome', notes: "Rome's most charming neighbourhood — cobbled streets and ivy-covered buildings",
        },
        {
          id: 'rom-1-5', time: '9:00 PM', title: 'Dinner at Tonnarello',
          type: 'food', duration: '2 hrs',
          location: 'Via della Paglia, 1–2, Trastevere', notes: 'Arrive at opening to avoid the queue. Cacio e pepe is unmissable',
          cost: '~€30/person',
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
        },
      ],
    },
    {
      label: 'Ancient Rome',
      items: [
        {
          id: 'rom-2-1', time: '8:30 AM', title: 'Roman Forum & Palatine Hill',
          type: 'attraction', duration: '2.5 hrs',
          location: 'Via Sacra, 00186', notes: 'Combo ticket with Colosseum — start here before the heat builds',
          cost: '€16/person',
        },
        {
          id: 'rom-2-2', time: '11:30 AM', title: 'Colosseum',
          type: 'attraction', duration: '1.5 hrs',
          location: 'Piazza del Colosseo, 1', notes: 'Included in Forum combo. Arena floor access available if pre-booked',
          cost: 'Included',
          image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80',
        },
        {
          id: 'rom-2-3', time: '1:30 PM', title: 'Supplì Roma lunch',
          type: 'food', duration: '45 min',
          location: 'Via di San Francesco a Ripa, 137', notes: 'Rome\'s best supplì — the "telephone" stretchy mozzarella inside is legendary',
          cost: '~€10/person',
        },
        {
          id: 'rom-2-4', time: '3:00 PM', title: 'Circus Maximus & Aventine Hill',
          type: 'free', duration: '1.5 hrs',
          location: 'Via del Circo Massimo, 00186', notes: 'Free ancient chariot-racing venue. Walk up to the Knights of Malta keyhole for a famous view of St Peter\'s dome',
        },
        {
          id: 'rom-2-5', time: '8:00 PM', title: 'Estate Romana open-air cinema',
          type: 'event', duration: '2.5 hrs',
          location: 'Isola Tiberina, 00186', notes: 'Films under the stars on the Tiber island — arrive 30 min early for good seats',
          cost: '€6/person',
        },
      ],
    },
    {
      label: 'Vatican Day',
      items: [
        {
          id: 'rom-3-1', time: '9:00 AM', title: 'Vatican Museums & Sistine Chapel',
          type: 'attraction', duration: '3 hrs',
          location: 'Viale Vaticano, Vatican City', notes: 'Timed tickets booked. Photography is banned in the Sistine Chapel',
          cost: '€17/person',
          image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&q=80',
        },
        {
          id: 'rom-3-2', time: '12:30 PM', title: "St. Peter's Basilica & dome climb",
          type: 'attraction', duration: '2 hrs',
          location: "Piazza San Pietro, Vatican City", notes: 'Dress code enforced — covered shoulders and knees required. Dome stairs are free; lift costs €8',
          cost: 'Free (dome €8)',
          image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400&q=80',
        },
        {
          id: 'rom-3-3', time: '3:00 PM', title: 'Lunch in Prati neighbourhood',
          type: 'food', duration: '1 hr',
          location: 'Via Cola di Rienzo, Prati', notes: 'One of Rome\'s best food streets — locals eat here, not tourists',
          cost: '~€20/person',
        },
        {
          id: 'rom-3-4', time: '4:30 PM', title: 'Castel Sant\'Angelo & riverside walk',
          type: 'free', duration: '1.5 hrs',
          location: "Lungotevere Castello, 50, 00193", notes: 'Free to walk around the exterior. Sunset on the bridge is spectacular',
        },
        {
          id: 'rom-3-5', time: '8:00 PM', title: 'Dinner at Osteria dell\'Angelo',
          type: 'food', duration: '2 hrs',
          location: 'Via Giuseppe Bettolo, 24, 00195', notes: 'Classic Roman — no frills, incredible carbonara. Book 2 days ahead',
          cost: '~€28/person',
        },
      ],
    },
    {
      label: 'Piazzas & Galleries',
      items: [
        {
          id: 'rom-4-1', time: '9:00 AM', title: 'Pantheon',
          type: 'attraction', duration: '1 hr',
          location: 'Piazza della Rotonda, 00186', notes: 'Book online to guarantee entry. Arrive exactly on time — no waiting inside',
          cost: '€5/person',
          image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80',
        },
        {
          id: 'rom-4-2', time: '10:30 AM', title: 'Piazza Navona & Sant\'Ivo alla Sapienza',
          type: 'free', duration: '1 hr',
          location: 'Piazza Navona, 00186', notes: "Bernini's Fountain of the Four Rivers — don't pay for the overpriced cafés on the piazza",
        },
        {
          id: 'rom-4-3', time: '12:00 PM', title: 'Gelato & lunch at Grazia & Graziella',
          type: 'food', duration: '1 hr',
          location: 'Via del Pellegrino, 25, 00186', notes: 'Best pistachio gelato in Rome — worth a short detour',
          cost: '~€12/person',
        },
        {
          id: 'rom-4-4', time: '2:00 PM', title: 'Borghese Gallery',
          type: 'attraction', duration: '2 hrs',
          location: 'Piazzale Scipione Borghese, 5', notes: 'STRICTLY by timed reservation — 2-hour slots only. Bernini sculptures are astonishing in person',
          cost: '€13/person',
          image: 'https://images.unsplash.com/photo-1503152394-c571994fd383?w=400&q=80',
        },
        {
          id: 'rom-4-5', time: '8:00 PM', title: 'Final dinner at Il Pagliaccio',
          type: 'food', duration: '2.5 hrs',
          location: 'Via dei Banchi Vecchi, 129A', notes: '2 Michelin stars. Reservation required — dress smartly',
          cost: '~€95/person',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
        },
      ],
    },
    {
      label: 'Last Day & Departure',
      items: [
        {
          id: 'rom-5-1', time: '8:30 AM', title: 'Breakfast at a local bar',
          type: 'food', duration: '30 min',
          location: 'Near hotel', notes: "Romans stand at the bar — joining this ritual is the most authentic Roman breakfast experience",
          cost: '~€5/person',
        },
        {
          id: 'rom-5-2', time: '9:30 AM', title: 'Campo de Fiori morning market',
          type: 'free', duration: '1 hr',
          location: 'Campo de Fiori, 00186', notes: 'Daily market with produce, spices and food gifts — great for last-minute souvenirs',
        },
        {
          id: 'rom-5-3', time: '11:00 AM', title: 'Hotel checkout & luggage storage',
          type: 'hotel', duration: '30 min',
          location: 'Hotel reception',
        },
        {
          id: 'rom-5-4', time: '12:30 PM', title: 'Final lunch at Tonnarello',
          type: 'food', duration: '1.5 hrs',
          location: 'Via della Paglia, 1–2, Trastevere',
          cost: '~€25/person',
        },
        {
          id: 'rom-5-5', time: '3:00 PM', title: 'Leonardo Express train to Fiumicino',
          type: 'transport', duration: '35 min',
          location: 'Roma Termini → FCO Airport', notes: 'Departs every 30 min. Allow 2.5 hrs before flight',
          cost: '€14/person',
        },
      ],
    },
  ],
};

// ─── Istanbul ─────────────────────────────────────────────────────────────────
const istanbulPlan: CityPlannerData = {
  aiTips: [
    'Both Hagia Sophia and the Blue Mosque close to visitors during the five daily prayer times — usually 20–30 min each. Check the day\'s prayer schedule on arrival.',
    'Topkapi Palace is huge — buy the Harem add-on when you enter or it often sells out. Start with the palace exterior courts then work inward.',
    'The Dolmabahçe Palace visit requires a guided tour — slots fill up fast, especially the 9 AM entry. Buy tickets online the night before.',
    "The ferry to Kadıköy is one of Istanbul's great travel experiences — the 25-min Bosphorus crossing costs about €0.60. Buy an Istanbulkart (transit card) for easy payment.",
    "Istanbul's Atatürk and Sabiha Gökçen airports serve different sides of the city. Check your flight. Allow 2+ hrs travel time from the city centre.",
  ],
  days: [
    {
      label: 'Arrival & Sultanahmet',
      items: [
        {
          id: 'ist-1-1', time: '2:00 PM', title: 'Hotel check-in',
          type: 'hotel', duration: '30 min',
          location: 'Sultanahmet area hotel', notes: 'Central location — Hagia Sophia and Blue Mosque are walking distance',
          cost: 'Prepaid',
        },
        {
          id: 'ist-1-2', time: '3:00 PM', title: 'Hagia Sophia',
          type: 'attraction', duration: '1.5 hrs',
          location: 'Sultan Ahmet Meydanı No:1, 34122', notes: 'Free entry. Modest dress required — free robes available at entrance. Check prayer times',
          cost: 'Free',
          image: 'https://images.unsplash.com/photo-1545041019-38cfd79c8cfa?w=400&q=80',
        },
        {
          id: 'ist-1-3', time: '5:00 PM', title: 'Blue Mosque (Sultan Ahmed Mosque)',
          type: 'attraction', duration: '45 min',
          location: 'Sultan Ahmet, At Meydanı No:7, 34122', notes: 'Free entry. Remove shoes and cover up. Best light for photos is late afternoon',
          cost: 'Free',
          image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&q=80',
        },
        {
          id: 'ist-1-4', time: '6:30 PM', title: 'Sunset at Galata Bridge',
          type: 'free', duration: '1 hr',
          location: 'Galata Bridge, Eminönü', notes: 'Watch fishermen casting lines as the minarets glow at sunset — iconic Istanbul scene',
        },
        {
          id: 'ist-1-5', time: '8:30 PM', title: 'Dinner at Balıkçı Sabahattin',
          type: 'food', duration: '2 hrs',
          location: 'Seyit Hasan Kuyu Sk. No:1, Sultanahmet', notes: 'Traditional meyhane (tavern) — grilled fish with rakı and mezes',
          cost: '~€35/person',
          image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&q=80',
        },
      ],
    },
    {
      label: 'Palaces & Bazaars',
      items: [
        {
          id: 'ist-2-1', time: '9:00 AM', title: 'Topkapi Palace',
          type: 'attraction', duration: '3 hrs',
          location: 'Cankurtaran, 34122 Fatih', notes: 'Buy the Harem add-on at entrance — it sells out. Treasury holds the famous Spoonmaker\'s Diamond',
          cost: '~€15/person',
          image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80',
        },
        {
          id: 'ist-2-2', time: '12:30 PM', title: 'Köfte lunch at Sultanahmet Köftecisi',
          type: 'food', duration: '45 min',
          location: 'Divan Yolu Cad. No:12, Sultanahmet', notes: 'Legendary köfte spot open since 1920 — order with white beans and ayran',
          cost: '~€8/person',
        },
        {
          id: 'ist-2-3', time: '2:00 PM', title: 'Grand Bazaar',
          type: 'attraction', duration: '2 hrs',
          location: 'Beyazıt, Kalpakçılar Cd. No:22', notes: 'Over 4,000 shops — don\'t buy at the first price. Carpets, lanterns and ceramics are best buys',
          cost: 'Free',
          image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400&q=80',
        },
        {
          id: 'ist-2-4', time: '4:30 PM', title: 'Spice Bazaar (Egyptian Bazaar)',
          type: 'attraction', duration: '1 hr',
          location: 'Eminönü, 34116 Fatih', notes: 'Atmospheric covered market — Turkish tea, saffron and lokum make great gifts',
          cost: 'Free',
        },
        {
          id: 'ist-2-5', time: '7:00 PM', title: 'Bosphorus Sunset Dinner Cruise',
          type: 'event', duration: '2.5 hrs',
          location: 'Eminönü Ferry Terminal', notes: 'Traditional mezes and live fasıl music. Watch both continents glow at sunset',
          cost: '~€40/person',
        },
      ],
    },
    {
      label: 'Bosphorus & Beyoğlu',
      items: [
        {
          id: 'ist-3-1', time: '9:30 AM', title: 'Dolmabahçe Palace',
          type: 'attraction', duration: '2 hrs',
          location: 'Beşiktaş, 34357', notes: 'Guided tour only — book the 9:30 AM slot online. World\'s largest crystal chandelier is astonishing',
          cost: '~€18/person',
          image: 'https://images.unsplash.com/photo-1473800447596-b34d284f5f4a?w=400&q=80',
        },
        {
          id: 'ist-3-2', time: '12:00 PM', title: 'Lunch at Karaköy Lokantası',
          type: 'food', duration: '1.5 hrs',
          location: 'Kemankeş Cad. No:37A, Karaköy', notes: 'Modern Turkish — the slow-cooked lamb and the mezeler are outstanding',
          cost: '~€15/person',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
        },
        {
          id: 'ist-3-3', time: '2:00 PM', title: 'Galata Tower',
          type: 'attraction', duration: '1 hr',
          location: 'Galata, Beyoğlu', notes: '360° panoramic views of the Bosphorus and city skyline. Avoid the roof café — prices are steep',
          cost: '~€10/person',
        },
        {
          id: 'ist-3-4', time: '3:30 PM', title: 'Istiklal Avenue & Tünel tram',
          type: 'free', duration: '1.5 hrs',
          location: 'Istiklal Caddesi, Beyoğlu', notes: "Istanbul's busiest street — street musicians, bookshops and the historic Tünel funicular",
        },
        {
          id: 'ist-3-5', time: '7:30 PM', title: 'Whirling Dervishes Ceremony',
          type: 'event', duration: '1.5 hrs',
          location: 'Hodjapasha Cultural Center', notes: 'Book in advance — evening slots sell out. A profound and unforgettable experience',
          cost: '~€25/person',
        },
      ],
    },
    {
      label: 'Asian Side & Archaeology',
      items: [
        {
          id: 'ist-4-1', time: '9:00 AM', title: 'Ferry to Kadıköy (Asian side)',
          type: 'transport', duration: '25 min',
          location: 'Eminönü pier → Kadıköy', notes: 'Use your Istanbulkart. Sit on the upper deck for Bosphorus views',
          cost: '~€1/person',
        },
        {
          id: 'ist-4-2', time: '9:30 AM', title: 'Kadıköy market & neighbourhood walk',
          type: 'free', duration: '2 hrs',
          location: 'Kadıköy, Asian Istanbul', notes: "Vibrant local market district — Istanbul's hippest neighbourhood. Try simit and fresh-squeezed pomegranate juice",
        },
        {
          id: 'ist-4-3', time: '12:00 PM', title: 'Lunch at Çiya Sofrası',
          type: 'food', duration: '1.5 hrs',
          location: 'Güneşlibahçe Sk. 43, Kadıköy', notes: 'Legendary Anatolian home cooking — choose from a vast daily changing menu at the counter',
          cost: '~€12/person',
          image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80',
        },
        {
          id: 'ist-4-4', time: '2:30 PM', title: 'Istanbul Archaeology Museums',
          type: 'attraction', duration: '2 hrs',
          location: 'Osman Hamdi Bey Yokuşu Sk., 34122', notes: '1 million artefacts spanning 5,000 years — the sarcophagus of Alexander the Great is extraordinary',
          cost: '~€7/person',
          image: 'https://images.unsplash.com/photo-1583791031153-d55e79f7f115?w=400&q=80',
        },
        {
          id: 'ist-4-5', time: '7:30 PM', title: 'Turkish Cooking Masterclass & dinner',
          type: 'event', duration: '3 hrs',
          location: 'Istanbul Culinary Institute, Beyoğlu', notes: 'Includes Spice Bazaar visit. Make köfte, börek and baklava from scratch',
          cost: '~€70/person',
        },
      ],
    },
    {
      label: 'Last Morning & Departure',
      items: [
        {
          id: 'ist-5-1', time: '8:00 AM', title: 'Simit breakfast by the Bosphorus',
          type: 'food', duration: '45 min',
          location: 'Karaköy waterfront', notes: "Simit (sesame ring) with white cheese and tea — the authentic Turkish breakfast of champions",
          cost: '~€4/person',
        },
        {
          id: 'ist-5-2', time: '9:00 AM', title: 'Baklava at Karaköy Güllüoğlu',
          type: 'food', duration: '30 min',
          location: 'Rıhtım Cad. No:3–4, Karaköy', notes: 'The pistachio baklava here is the best in the city. Buy a gift box to take home',
          cost: '~€8/person',
        },
        {
          id: 'ist-5-3', time: '10:00 AM', title: 'Final souvenir shopping in Karaköy',
          type: 'free', duration: '1.5 hrs',
          location: 'Karaköy & Grand Bazaar', notes: 'Ceramics, evil-eye charms and Turkish tea sets make excellent gifts',
          cost: 'Budget: €50',
        },
        {
          id: 'ist-5-4', time: '12:30 PM', title: 'Hotel checkout & luggage',
          type: 'hotel', duration: '30 min',
          location: 'Hotel reception',
        },
        {
          id: 'ist-5-5', time: '2:00 PM', title: 'Taxi to airport',
          type: 'transport', duration: '1 hr',
          location: 'Istanbul Airport (IST)', notes: 'Check which airport your flight departs from — IST (European side) or SAW (Asian side)',
          cost: '~€25',
        },
      ],
    },
  ],
};

// ─── Data map ─────────────────────────────────────────────────────────────────
export const cityPlannerData: Record<string, CityPlannerData> = {
  Paris:     parisPlan,
  Barcelona: barcelonaPlan,
  Rome:      romePlan,
  Istanbul:  istanbulPlan,
};

export function getCityPlannerData(city: string): CityPlannerData {
  return cityPlannerData[city] ?? cityPlannerData['Paris'];
}
