import type { AttractionDetails, DetailedLandmark, Landmark } from '../types';

export interface CityPageData {
  landmarks: DetailedLandmark[];
  stats: {
    activities: string;
    saved: string;
    restaurants: string;
    events: string;
  };
  aiTip: string;
}

// ─── Paris ───────────────────────────────────────────────────────────────────
const parisLandmarks: Landmark[] = [
  {
    id: 'par-1',
    name: 'Eiffel Tower',
    category: 'Monument',
    description:
      'The iconic iron lattice tower on the Champ de Mars, built by Gustave Eiffel for the 1889 World Fair. Offers stunning panoramic views of Paris from three viewing platforms.',
    rating: 4.8,
    reviewCount: 234567,
    distance: '1.2 km',
    openNow: true,
    hours: '9:00 AM – 12:45 AM',
    image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&q=80',
    tags: ['Must-see', 'Views', 'Historic'],
    address: 'Champ de Mars, 5 Av. Anatole France',
    ticketPrice: '€26.10',
  },
  {
    id: 'par-2',
    name: 'Louvre Museum',
    category: 'Museum',
    description:
      "The world's largest art museum and a historic monument. Home to the Mona Lisa, Venus de Milo, and over 35,000 works of art. Allow at least 3–4 hours.",
    rating: 4.7,
    reviewCount: 189432,
    distance: '2.5 km',
    openNow: true,
    hours: '9:00 AM – 6:00 PM',
    image: 'https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?w=600&q=80',
    tags: ['Art', 'Culture', 'World-class'],
    address: 'Rue de Rivoli, 75001',
    ticketPrice: '€17',
  },
  {
    id: 'par-3',
    name: 'Notre-Dame Cathedral',
    category: 'Cathedral',
    description:
      'Medieval Catholic cathedral on the Île de la Cité — an architectural masterpiece with stunning Gothic design, currently undergoing restoration after the 2019 fire.',
    rating: 4.7,
    reviewCount: 156789,
    distance: '3.1 km',
    openNow: true,
    hours: '8:00 AM – 6:45 PM',
    image: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=600&q=80',
    tags: ['Gothic', 'Historic', 'Architecture'],
    address: '6 Parvis Notre-Dame, 75004',
    ticketPrice: 'Free',
  },
  {
    id: 'par-4',
    name: "Musée d'Orsay",
    category: 'Museum',
    description:
      "Housed in a Beaux-Arts railway station, this museum holds the world's largest collection of Impressionist and Post-Impressionist masterpieces — Monet, Renoir, Van Gogh.",
    rating: 4.8,
    reviewCount: 98765,
    distance: '2.0 km',
    openNow: true,
    hours: '9:30 AM – 6:00 PM',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&q=80',
    tags: ['Impressionism', 'Art', 'Culture'],
    address: "1 Rue de la Légion d'Honneur",
    ticketPrice: '€16',
  },
  {
    id: 'par-5',
    name: 'Sacré-Cœur Basilica',
    category: 'Church',
    description:
      'A stunning Romano-Byzantine basilica perched on the highest point in Paris at Montmartre. Offers breathtaking views of the city from the dome.',
    rating: 4.6,
    reviewCount: 87654,
    distance: '4.8 km',
    openNow: true,
    hours: '6:00 AM – 10:30 PM',
    image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=600&q=80',
    tags: ['Views', 'Religion', 'Montmartre'],
    address: '35 Rue du Chevalier de la Barre',
    ticketPrice: 'Free',
  },
  {
    id: 'par-6',
    name: 'Palace of Versailles',
    category: 'Palace',
    description:
      "A royal château that was the political center of France for over a century. The Hall of Mirrors, formal gardens, and Grand Trianon are must-sees.",
    rating: 4.7,
    reviewCount: 145678,
    distance: '22 km',
    openNow: false,
    hours: '9:00 AM – 5:30 PM (Closed Mon)',
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=80',
    tags: ['Royal', 'Gardens', 'Day trip'],
    address: "Place d'Armes, 78000 Versailles",
    ticketPrice: '€19.50',
  },
];

// ─── Barcelona ───────────────────────────────────────────────────────────────
const barcelonaLandmarks: Landmark[] = [
  {
    id: 'bcn-1',
    name: 'Sagrada Família',
    category: 'Monument',
    description:
      "Gaudí's extraordinary unfinished basilica, under construction since 1882 and still evolving. The intricate stone facades and kaleidoscopic interior light are unmissable.",
    rating: 4.9,
    reviewCount: 312450,
    distance: '2.1 km',
    openNow: true,
    hours: '9:00 AM – 8:00 PM',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
    tags: ['Must-see', 'Gaudí', 'Architecture'],
    address: 'C/ de Mallorca, 401, 08013',
    ticketPrice: '€26',
  },
  {
    id: 'bcn-2',
    name: 'Park Güell',
    category: 'Monument',
    description:
      "A UNESCO World Heritage Site filled with colourful mosaic terraces, sculptural forms and panoramic views of Barcelona — Gaudí's magical public park.",
    rating: 4.6,
    reviewCount: 178900,
    distance: '3.8 km',
    openNow: true,
    hours: '8:00 AM – 8:30 PM',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80',
    tags: ['Gaudí', 'Views', 'UNESCO'],
    address: "C/ d'Olot, s/n, 08024",
    ticketPrice: '€10',
  },
  {
    id: 'bcn-3',
    name: 'Casa Batlló',
    category: 'Monument',
    description:
      "One of Gaudí's finest works — a surreal modernist building on Passeig de Gràcia with an undulating façade, dragon-scale roof, and dazzling interior.",
    rating: 4.7,
    reviewCount: 94200,
    distance: '1.5 km',
    openNow: true,
    hours: '9:00 AM – 9:00 PM',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    tags: ['Gaudí', 'Design', 'Architecture'],
    address: 'Pg. de Gràcia, 43, 08007',
    ticketPrice: '€35',
  },
  {
    id: 'bcn-4',
    name: 'Barcelona Cathedral',
    category: 'Cathedral',
    description:
      'The Gothic cathedral of the Holy Cross and Saint Eulalia, built between the 13th and 15th centuries. The cloister with its 13 white geese is a hidden highlight.',
    rating: 4.5,
    reviewCount: 67800,
    distance: '2.4 km',
    openNow: true,
    hours: '12:30 PM – 7:30 PM',
    image: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=600&q=80',
    tags: ['Gothic', 'Historic', 'Free entry'],
    address: 'Pla de la Seu, s/n, 08002',
    ticketPrice: 'Free',
  },
  {
    id: 'bcn-5',
    name: 'Picasso Museum',
    category: 'Museum',
    description:
      "One of the most visited museums in Spain, spanning five medieval palaces and housing over 4,200 works chronicling Picasso's formative years in Barcelona.",
    rating: 4.5,
    reviewCount: 52300,
    distance: '2.7 km',
    openNow: true,
    hours: '10:00 AM – 7:00 PM (Closed Mon)',
    image: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=600&q=80',
    tags: ['Art', 'Picasso', 'Culture'],
    address: 'C/ Montcada, 15-23, 08003',
    ticketPrice: '€14',
  },
  {
    id: 'bcn-6',
    name: 'Palau Nacional (MNAC)',
    category: 'Palace',
    description:
      "Spectacular palace on Montjuïc hill housing the National Art Museum of Catalonia. The Romanesque collection is world-class and the views of the city are superb.",
    rating: 4.6,
    reviewCount: 38900,
    distance: '4.2 km',
    openNow: false,
    hours: '10:00 AM – 6:00 PM (Closed Mon)',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    tags: ['Art', 'Views', 'Romanesque'],
    address: "Palau Nacional, Parc de Montjuïc, 08038",
    ticketPrice: '€12',
  },
];

// ─── Rome ─────────────────────────────────────────────────────────────────────
const romeLandmarks: Landmark[] = [
  {
    id: 'rom-1',
    name: 'Colosseum',
    category: 'Monument',
    description:
      "The world's largest ancient amphitheatre, built in 70–80 AD. Once held 50,000–80,000 spectators for gladiatorial contests. Buy timed tickets online to skip the queue.",
    rating: 4.8,
    reviewCount: 298400,
    distance: '1.8 km',
    openNow: true,
    hours: '9:00 AM – 7:00 PM',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
    tags: ['Must-see', 'Ancient', 'Historic'],
    address: 'Piazza del Colosseo, 1, 00184',
    ticketPrice: '€16',
  },
  {
    id: 'rom-2',
    name: 'Vatican Museums',
    category: 'Museum',
    description:
      "Containing one of the world's greatest art collections, culminating in Michelangelo's breathtaking Sistine Chapel ceiling. Book well in advance to avoid long queues.",
    rating: 4.7,
    reviewCount: 224100,
    distance: '5.3 km',
    openNow: true,
    hours: '9:00 AM – 6:00 PM (Closed Sun)',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80',
    tags: ['Art', 'Sistine Chapel', 'UNESCO'],
    address: 'Viale Vaticano, 00165 Vatican City',
    ticketPrice: '€17',
  },
  {
    id: 'rom-3',
    name: "St. Peter's Basilica",
    category: 'Cathedral',
    description:
      "The world's largest church and one of the holiest Catholic sites. Climb the dome for extraordinary views and marvel at Michelangelo's Pietà and Bernini's baldachin.",
    rating: 4.8,
    reviewCount: 187600,
    distance: '5.5 km',
    openNow: true,
    hours: '7:00 AM – 7:00 PM',
    image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=80',
    tags: ['Sacred', 'Art', 'Architecture'],
    address: 'Piazza San Pietro, Vatican City',
    ticketPrice: 'Free (dome €8)',
  },
  {
    id: 'rom-4',
    name: 'Trevi Fountain',
    category: 'Monument',
    description:
      "Rome's largest and most famous baroque fountain, immortalised in Fellini's La Dolce Vita. Toss a coin over your left shoulder to ensure a return to Rome.",
    rating: 4.7,
    reviewCount: 241800,
    distance: '3.1 km',
    openNow: true,
    hours: 'Open 24 hours',
    image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=600&q=80',
    tags: ['Baroque', 'Iconic', 'Free'],
    address: 'Piazza di Trevi, 00187',
    ticketPrice: 'Free',
  },
  {
    id: 'rom-5',
    name: 'Pantheon',
    category: 'Monument',
    description:
      "The best-preserved ancient Roman building, built around 125 AD. Its coffered concrete dome with the open oculus at the top remains an engineering marvel.",
    rating: 4.7,
    reviewCount: 162300,
    distance: '3.4 km',
    openNow: true,
    hours: '9:00 AM – 7:00 PM',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80',
    tags: ['Ancient', 'Architecture', 'History'],
    address: 'Piazza della Rotonda, 00186',
    ticketPrice: '€5',
  },
  {
    id: 'rom-6',
    name: 'Borghese Gallery',
    category: 'Museum',
    description:
      "A jewel-box museum inside a 17th-century villa, housing an extraordinary collection of Bernini sculptures and Caravaggio paintings. Entry is strictly by timed reservation.",
    rating: 4.8,
    reviewCount: 48900,
    distance: '4.9 km',
    openNow: false,
    hours: '9:00 AM – 7:00 PM (Closed Mon)',
    image: 'https://images.unsplash.com/photo-1503152394-c571994fd383?w=600&q=80',
    tags: ['Bernini', 'Art', 'Reservation required'],
    address: 'Piazzale Scipione Borghese, 5',
    ticketPrice: '€13',
  },
];

// ─── Istanbul ────────────────────────────────────────────────────────────────
const istanbulLandmarks: Landmark[] = [
  {
    id: 'ist-1',
    name: 'Hagia Sophia',
    category: 'Monument',
    description:
      "Built in 537 AD as the world's greatest cathedral, later converted to a mosque, then a museum, and now a mosque again. Its colossal dome and Byzantine mosaics are awe-inspiring.",
    rating: 4.8,
    reviewCount: 203500,
    distance: '1.0 km',
    openNow: true,
    hours: '8:30 AM – 5:00 PM (closed during prayer)',
    image: 'https://images.unsplash.com/photo-1545041019-38cfd79c8cfa?w=600&q=80',
    tags: ['Must-see', 'Byzantine', 'Historic'],
    address: 'Sultan Ahmet, Ayasofya Meydanı No:1, 34122',
    ticketPrice: 'Free',
  },
  {
    id: 'ist-2',
    name: 'Blue Mosque',
    category: 'Mosque',
    description:
      "The Sultan Ahmed Mosque, famous for its six minarets and stunning interior of 20,000 hand-painted Iznik blue tiles that give it its popular name.",
    rating: 4.7,
    reviewCount: 178200,
    distance: '1.2 km',
    openNow: true,
    hours: '8:30 AM – 11:30 PM (closed during prayers)',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80',
    tags: ['Ottoman', 'Architecture', 'Free'],
    address: 'Sultan Ahmet, At Meydanı No:7, 34122',
    ticketPrice: 'Free',
  },
  {
    id: 'ist-3',
    name: 'Topkapi Palace',
    category: 'Palace',
    description:
      "The opulent administrative centre of the Ottoman Empire for 400 years. Explore the Imperial Harem, Treasury (with the famous Spoonmaker's Diamond), and sacred relics.",
    rating: 4.6,
    reviewCount: 124700,
    distance: '1.5 km',
    openNow: true,
    hours: '9:00 AM – 6:00 PM (Closed Tue)',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80',
    tags: ['Ottoman', 'History', 'Royal'],
    address: 'Cankurtaran, 34122 Fatih',
    ticketPrice: '₺500 (~€15)',
  },
  {
    id: 'ist-4',
    name: 'Grand Bazaar',
    category: 'Market',
    description:
      "One of the world's oldest and largest covered markets with over 4,000 shops across 60 streets. A labyrinthine paradise for carpets, spices, jewellery, and ceramics.",
    rating: 4.4,
    reviewCount: 156900,
    distance: '2.3 km',
    openNow: true,
    hours: '8:30 AM – 7:00 PM (Closed Sun)',
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=600&q=80',
    tags: ['Shopping', 'Culture', 'Historic'],
    address: 'Beyazıt, Kalpakçılar Cd. No:22, 34126',
    ticketPrice: 'Free',
  },
  {
    id: 'ist-5',
    name: 'Istanbul Archaeology Museums',
    category: 'Museum',
    description:
      "Three museums in one stunning complex — the Archaeological Museum, the Ancient Orient Museum, and the Tiled Pavilion — housing 1 million objects spanning 5,000 years.",
    rating: 4.5,
    reviewCount: 37400,
    distance: '1.8 km',
    openNow: true,
    hours: '9:00 AM – 7:00 PM (Closed Mon)',
    image: 'https://images.unsplash.com/photo-1583791031153-d55e79f7f115?w=600&q=80',
    tags: ['Ancient', 'Art', 'History'],
    address: 'Osman Hamdi Bey Yokuşu Sk., 34122',
    ticketPrice: '₺250 (~€7)',
  },
  {
    id: 'ist-6',
    name: 'Dolmabahçe Palace',
    category: 'Palace',
    description:
      "An extravagant 19th-century Ottoman palace on the European shore of the Bosphorus, blending baroque, rococo and neoclassical styles. Home to the largest crystal chandelier in the world.",
    rating: 4.6,
    reviewCount: 61800,
    distance: '6.1 km',
    openNow: false,
    hours: '9:00 AM – 4:00 PM (Closed Mon & Thu)',
    image: 'https://images.unsplash.com/photo-1473800447596-b34d284f5f4a?w=600&q=80',
    tags: ['Ottoman', 'Baroque', 'Bosphorus'],
    address: 'Beşiktaş, 34357',
    ticketPrice: '₺600 (~€18)',
  },
];

const attractionDetails: Record<string, AttractionDetails> = {
  'par-1': {
    whyVisit: 'It is the defining Paris skyline experience, with sweeping views across the Seine and city monuments.',
    bestTimeToVisit: 'Book a late afternoon slot to see daylight, sunset, and the evening sparkle.',
    visitDuration: '2-3 hours',
    localTip: 'Use the stairs to the second floor if available, then take the lift to the summit.',
  },
  'par-2': {
    whyVisit: 'A single visit brings you face to face with masterpieces spanning civilizations and centuries.',
    bestTimeToVisit: 'Arrive at opening or choose a Wednesday evening session when offered.',
    visitDuration: '3-4 hours',
    localTip: 'Choose two or three wings in advance rather than trying to cover the entire museum.',
  },
  'par-3': {
    whyVisit: 'Its restored Gothic interior and island setting connect medieval Paris with the city today.',
    bestTimeToVisit: 'Early morning for a calmer visit and softer light around Ile de la Cite.',
    visitDuration: '45-75 minutes',
    localTip: 'Pair the visit with the nearby Sainte-Chapelle stained glass.',
  },
  'par-4': {
    whyVisit: 'The converted station is as striking as its exceptional Impressionist collection.',
    bestTimeToVisit: 'Thursday late opening or the first hour after doors open.',
    visitDuration: '2-3 hours',
    localTip: 'Pause by the giant clock windows for one of the best museum views in Paris.',
  },
  'par-5': {
    whyVisit: 'The basilica crowns Montmartre and offers a memorable panorama over Paris.',
    bestTimeToVisit: 'Morning for quieter steps or evening for city lights from the terrace.',
    visitDuration: '1-2 hours',
    localTip: 'Walk through the quieter back streets of Montmartre after your visit.',
  },
  'par-6': {
    whyVisit: 'Its palace rooms and immense gardens reveal the scale of French royal life.',
    bestTimeToVisit: 'A weekday morning, reserving the gardens for the afternoon.',
    visitDuration: 'Full day',
    localTip: 'Wear comfortable shoes and consider the estate shuttle for the Trianon area.',
  },
  'bcn-1': {
    whyVisit: 'Gaudi designed a basilica unlike any other, filled with structure, symbolism, and colored light.',
    bestTimeToVisit: 'Morning for the Nativity facade light or late afternoon for the interior glow.',
    visitDuration: '1.5-2 hours',
    localTip: 'Reserve a tower-access ticket in advance if city views matter to you.',
  },
  'bcn-2': {
    whyVisit: 'Mosaic architecture, playful garden design, and Barcelona views meet in one open-air visit.',
    bestTimeToVisit: 'At opening before heat and crowds build.',
    visitDuration: '1.5-2 hours',
    localTip: 'The Monumental Zone requires a timed ticket; do not rely on same-day entry.',
  },
  'bcn-3': {
    whyVisit: 'This house turns everyday architecture into an immersive Gaudi fantasy.',
    bestTimeToVisit: 'First entry of the morning or evening when the facade is illuminated.',
    visitDuration: '1-1.5 hours',
    localTip: 'Spend time on the roof terrace to appreciate the dragon-back design up close.',
  },
  'bcn-4': {
    whyVisit: 'A peaceful Gothic landmark in the old city, with a distinctive cloister and rooftop.',
    bestTimeToVisit: 'Morning before the Gothic Quarter becomes busy.',
    visitDuration: '45-60 minutes',
    localTip: 'Look for the thirteen geese in the cloister, a local cathedral tradition.',
  },
  'bcn-5': {
    whyVisit: 'The collection explains how Barcelona shaped Picasso before his most famous period.',
    bestTimeToVisit: 'Weekday opening time; reserve ahead for popular dates.',
    visitDuration: '1.5-2 hours',
    localTip: 'Continue through El Born afterward for cafes and medieval lanes.',
  },
  'bcn-6': {
    whyVisit: 'The grand hilltop palace combines Catalan art with outstanding city viewpoints.',
    bestTimeToVisit: 'Late afternoon to finish with sunset views over Placa d Espanya.',
    visitDuration: '2-3 hours',
    localTip: 'Use the outdoor terraces even if your schedule does not allow the full museum.',
  },
  'rom-1': {
    whyVisit: 'Standing inside the amphitheatre gives immediate scale to the drama of ancient Rome.',
    bestTimeToVisit: 'First timed entry or late afternoon outside peak heat.',
    visitDuration: '2-3 hours',
    localTip: 'Combine your ticket with the Roman Forum and Palatine Hill on the same day.',
  },
  'rom-2': {
    whyVisit: 'The route through papal galleries culminates in the Sistine Chapel, a singular art experience.',
    bestTimeToVisit: 'Earliest entry available on a weekday.',
    visitDuration: '3-4 hours',
    localTip: 'Dress for covered shoulders and knees if continuing into St. Peter s Basilica.',
  },
  'rom-3': {
    whyVisit: 'The immense basilica brings together Renaissance architecture and landmark works of art.',
    bestTimeToVisit: 'Shortly after opening for easier security queues.',
    visitDuration: '1.5-2 hours',
    localTip: 'Climb the dome early before the narrow upper stairs become crowded.',
  },
  'rom-4': {
    whyVisit: 'This theatrical Baroque fountain is one of Rome s most atmospheric public spaces.',
    bestTimeToVisit: 'Very early morning or after dark for atmosphere with fewer groups.',
    visitDuration: '20-40 minutes',
    localTip: 'Keep coins and belongings secure in the crowded square.',
  },
  'rom-5': {
    whyVisit: 'Its intact ancient dome and open oculus remain astonishing feats of engineering.',
    bestTimeToVisit: 'Morning, when light through the oculus shifts across the interior.',
    visitDuration: '30-60 minutes',
    localTip: 'On rainy days, watch how the floor drains water entering through the oculus.',
  },
  'rom-6': {
    whyVisit: 'Timed entry creates an intimate viewing experience with Bernini and Caravaggio masterpieces.',
    bestTimeToVisit: 'Book the first or last timed session of the day.',
    visitDuration: '2 hours',
    localTip: 'Tickets are limited and timed strictly, so arrive before your reserved slot.',
  },
  'ist-1': {
    whyVisit: 'Its vast dome and layered Byzantine and Ottoman history make it central to Istanbul.',
    bestTimeToVisit: 'Early morning, outside prayer times.',
    visitDuration: '1-1.5 hours',
    localTip: 'Carry a scarf and dress modestly; visitor access changes during worship.',
  },
  'ist-2': {
    whyVisit: 'The mosque balances a monumental exterior with an intricate blue-tiled interior.',
    bestTimeToVisit: 'Early morning between prayer times.',
    visitDuration: '45-60 minutes',
    localTip: 'Shoes are removed inside, so bring socks and use the provided bag.',
  },
  'ist-3': {
    whyVisit: 'Courtyards, treasury objects, and Bosphorus views tell the Ottoman imperial story.',
    bestTimeToVisit: 'At opening, heading to the Harem before queues form.',
    visitDuration: '3-4 hours',
    localTip: 'The Harem needs an additional ticket but is a highlight of the palace visit.',
  },
  'ist-4': {
    whyVisit: 'Its covered lanes offer a living trading tradition and a vivid Istanbul atmosphere.',
    bestTimeToVisit: 'Late morning on a weekday when most shops are open.',
    visitDuration: '1.5-3 hours',
    localTip: 'Compare prices across shops and negotiate politely before buying.',
  },
  'ist-5': {
    whyVisit: 'A calm, exceptionally broad collection traces civilizations connected to the city.',
    bestTimeToVisit: 'Morning, especially as a quieter follow-up to nearby palace sights.',
    visitDuration: '2-3 hours',
    localTip: 'Do not miss the Tiled Pavilion, set slightly apart within the complex.',
  },
  'ist-6': {
    whyVisit: 'The lavish waterfront palace captures the Ottoman Empire s European-facing final era.',
    bestTimeToVisit: 'Morning for tour availability and clear Bosphorus views.',
    visitDuration: '2-3 hours',
    localTip: 'Photography restrictions apply in parts of the palace; enjoy the waterfront garden after.',
  },
};

function addDetails(landmarks: Landmark[]): DetailedLandmark[] {
  return landmarks.map((landmark) => ({ ...landmark, ...attractionDetails[landmark.id] }));
}

// ─── Data map ─────────────────────────────────────────────────────────────────
export const cityPageData: Record<string, CityPageData> = {
  Paris: {
    landmarks: addDetails(parisLandmarks),
    stats: { activities: '24', saved: '€480', restaurants: '8', events: '7' },
    aiTip:
      'Visit the Eiffel Tower at sunset for golden-hour photos, then stay for the light show at 10 PM. Book summit tickets online to skip the 2-hour queue!',
  },
  Barcelona: {
    landmarks: addDetails(barcelonaLandmarks),
    stats: { activities: '18', saved: '€320', restaurants: '9', events: '5' },
    aiTip:
      'Book Sagrada Família tickets 2–3 weeks in advance — they sell out fast. Visit Park Güell early morning to beat the crowds and catch the best city views.',
  },
  Rome: {
    landmarks: addDetails(romeLandmarks),
    stats: { activities: '22', saved: '€395', restaurants: '7', events: '6' },
    aiTip:
      'Buy the Colosseum + Roman Forum combo ticket online to skip queues. Vatican Museums are least crowded on Wednesday mornings — arrive before 9 AM.',
  },
  Istanbul: {
    landmarks: addDetails(istanbulLandmarks),
    stats: { activities: '20', saved: '€290', restaurants: '10', events: '8' },
    aiTip:
      'Hagia Sophia and the Blue Mosque are just 200 m apart and both free. Visit early morning before tour groups arrive, then explore the Grand Bazaar at leisure.',
  },
};

export function getCityPageData(city: string): CityPageData {
  return cityPageData[city] ?? cityPageData['Paris'];
}
