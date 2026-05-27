import { useEffect, useState } from 'react';
import {
  BookOpen,
  Camera,
  ChevronRight,
  MapPin,
  MessageCircle,
  Plus,
  RotateCcw,
  ScanLine,
  Send,
  Sparkles,
  Star,
  Upload,
  X,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import MapModal from '../components/MapModal';
import { useTrip } from '../context/TripContext';
import { getCityPageData } from '../data/cityData';

type ScanMode = 'idle' | 'scanning' | 'result';

interface ScanDetails {
  location: string;
  confidence: number;
  culturalContext: string;
  nearbyAttractions: string[];
  funFact: string;
  walkingDistance: string;
  walkingTime: string;
  photoTip: string;
}

const cityScanDetails: Record<string, ScanDetails> = {
  Paris: {
    location: 'Paris, France',
    confidence: 98,
    culturalContext:
      "Designed for the 1889 World's Fair, the Eiffel Tower became a lasting emblem of French engineering and the modern Paris skyline.",
    nearbyAttractions: ['Champ de Mars', 'Trocadero Gardens', 'Seine River Cruise'],
    funFact: 'The tower can grow slightly taller in summer as its iron expands in the heat.',
    walkingDistance: '1.2 km',
    walkingTime: '16 min',
    photoTip: 'Use Trocadero Gardens for a clean full-tower frame, especially at sunrise.',
  },
  Barcelona: {
    location: 'Barcelona, Spain',
    confidence: 99,
    culturalContext:
      "Antoni Gaudi devoted the final years of his life to this basilica. Its ongoing construction carries forward his vision through Catalan Modernisme.",
    nearbyAttractions: ['Hospital de Sant Pau', 'Avinguda de Gaudi', 'Casa Mila'],
    funFact: 'Its towers are designed so the finished basilica will remain lower than Montjuic hill.',
    walkingDistance: '950 m',
    walkingTime: '13 min',
    photoTip: 'Photograph the Nativity facade in morning light for the richest detail.',
  },
  Rome: {
    location: 'Rome, Italy',
    confidence: 98,
    culturalContext:
      'Opened in AD 80, the Colosseum staged public spectacles at the heart of imperial Rome and remains a powerful symbol of ancient Roman life.',
    nearbyAttractions: ['Roman Forum', 'Palatine Hill', 'Arch of Constantine'],
    funFact: 'A complex system of tunnels beneath the arena once lifted scenery and performers into view.',
    walkingDistance: '1.1 km',
    walkingTime: '15 min',
    photoTip: 'Frame the exterior from Colle Oppio near golden hour for softer stone color.',
  },
  Istanbul: {
    location: 'Istanbul, Turkey',
    confidence: 97,
    culturalContext:
      'Completed in 537, Hagia Sophia has served as a Byzantine cathedral, an Ottoman mosque, a museum, and today a mosque, reflecting the city\'s layered history.',
    nearbyAttractions: ['Blue Mosque', 'Basilica Cistern', 'Topkapi Palace'],
    funFact: 'Its immense central dome transformed the possibilities of Byzantine architecture.',
    walkingDistance: '700 m',
    walkingTime: '9 min',
    photoTip: 'The Sultanahmet square approach gives a balanced dome-and-minaret composition.',
  },
};

type ActivePanel = 'assistant' | null;

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}

export default function ScanPage() {
  const { trip, plannedAttractions, addAttractionToPlan } = useTrip();
  const [mode, setMode] = useState<ScanMode>('idle');
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const city =
    Object.keys(cityScanDetails).find(
      (availableCity) => availableCity.toLowerCase() === trip.city.trim().toLowerCase(),
    ) ?? 'Paris';
  const landmark = getCityPageData(city).landmarks[0];
  const scanDetails = cityScanDetails[city];
  const isLandmarkPlanned = plannedAttractions.some(
    (item) => item.city === trip.city && item.id === landmark.id,
  );

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!activePanel) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePanel(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel]);

  const simulateRecognition = () => {
    setMode('scanning');
    window.setTimeout(() => setMode('result'), 1800);
  };

  const openAssistant = () => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          role: 'assistant',
          text: `I can help you plan a visit to ${landmark.name} in ${city}. What would you like to know?`,
        },
      ]);
    }
    setActivePanel('assistant');
  };

  const addLandmarkToPlan = () => {
    addAttractionToPlan(landmark);
    setToast(`${landmark.name} added to your planner.`);
  };

  const getAssistantReply = (question: string) => {
    const prompt = question.toLowerCase();
    if (prompt.includes('worth')) {
      return `${landmark.name} is worth visiting: ${landmark.whyVisit}`;
    }
    if (prompt.includes('best') || prompt.includes('when')) {
      return `Best time to visit: ${landmark.bestTimeToVisit}`;
    }
    if (prompt.includes('nearby') || prompt.includes('see')) {
      return `Nearby, consider ${scanDetails.nearbyAttractions.join(', ')}. They pair well with a visit to ${landmark.name}.`;
    }
    if (prompt.includes('history')) {
      return scanDetails.culturalContext;
    }
    if (prompt.includes('photo')) {
      return scanDetails.photoTip;
    }
    if (prompt.includes('long') || prompt.includes('spend')) {
      return `Plan for ${landmark.visitDuration} at ${landmark.name}, with a little extra time for photos and the surrounding area.`;
    }
    if (prompt.includes('tip')) {
      return landmark.localTip;
    }
    return `For ${landmark.name}, I recommend allowing ${landmark.visitDuration}. ${landmark.localTip}`;
  };

  const askAssistant = (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;
    setChatMessages((previous) => [
      ...previous,
      { role: 'user', text: trimmedQuestion },
      { role: 'assistant', text: getAssistantReply(trimmedQuestion) },
    ]);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Landmark Identifier"
        subtitle={`${trip.city} · Identify landmarks from a photo`}
        gradient
      />

      <div className="max-w-2xl mx-auto px-4 md:px-6">
        {mode === 'idle' && (
          <div className="pt-6 pb-6">
            <div className="bg-white border border-blue-100 rounded-2xl p-3.5 mb-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Sparkles size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Landmark Recognition</p>
                <p className="text-xs text-gray-500">
                  Demo result prepared for {trip.city}, {trip.country}
                </p>
              </div>
            </div>

            <div
              className="relative bg-gray-900 rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center cursor-pointer"
              onClick={simulateRecognition}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') simulateRecognition();
              }}
            >
              <img
                src={landmark.image}
                alt={`Camera preview in ${scanDetails.location}`}
                className="w-full h-full object-cover opacity-60"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <ScanLine size={28} className="text-cyan-400 opacity-80" />
                    <span className="text-cyan-300 text-xs font-medium bg-black/40 px-3 py-1 rounded-full">
                      Tap to identify
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <Sparkles size={12} className="text-cyan-400" />
                <span className="text-white text-xs font-medium">AI Vision Active</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={simulateRecognition}
                className="border-2 border-dashed border-gray-200 rounded-2xl py-4 flex items-center justify-center gap-2 text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-colors"
              >
                <Upload size={18} />
                <span className="text-sm font-medium">Upload</span>
              </button>
              <button
                onClick={simulateRecognition}
                className="bg-blue-600 text-white rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Camera size={18} />
                <span className="text-sm font-semibold">Take Photo</span>
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { icon: '📷', text: 'Point your camera at a landmark or upload a travel photo' },
                { icon: '🔍', text: `AI recognizes iconic places around ${trip.city} instantly` },
                { icon: '📍', text: 'Explore context, nearby attractions, and map directions' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-start gap-3 bg-white rounded-xl p-3 border border-gray-100"
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'scanning' && (
          <div className="pt-12 flex flex-col items-center justify-center min-h-96">
            <div className="relative w-24 h-24 mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-blue-100 absolute" />
              <div className="w-24 h-24 rounded-full border-4 border-blue-500 border-t-transparent absolute animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={28} className="text-blue-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Analysing Image...</h3>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              AI Vision is matching your image with landmarks in {trip.city}
            </p>
            <div className="mt-6 flex gap-1">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${index * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {mode === 'result' && (
          <div className="pt-4 pb-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-3.5 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800">Landmark Identified!</p>
                <p className="text-xs text-emerald-600">
                  {scanDetails.confidence}% confidence · {landmark.category}
                </p>
              </div>
              <button
                onClick={() => setMode('idle')}
                className="ml-auto p-2 bg-white rounded-xl border border-emerald-200"
                aria-label="Identify another landmark"
              >
                <RotateCcw size={14} className="text-emerald-600" />
              </button>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src={landmark.image}
                alt={landmark.name}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{landmark.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-gray-500">
                      <MapPin size={13} className="text-blue-500" />
                      <span className="text-sm font-medium">{scanDetails.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 rounded-full px-2.5 py-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-gray-700">{landmark.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {landmark.description}
                </p>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: 'Distance', value: landmark.distance, icon: '📍' },
                    { label: 'Ticket', value: landmark.ticketPrice ?? 'Check', icon: '🎟️' },
                    { label: 'Hours', value: landmark.openNow ? 'Open' : 'Closed', icon: '🕐' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <div className="text-lg">{stat.icon}</div>
                      <div className="text-xs font-bold text-gray-900 mt-0.5">{stat.value}</div>
                      <div className="text-[10px] text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <BookOpen size={13} className="text-blue-600" />
                    <p className="text-xs font-bold text-blue-800">History & Culture</p>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    {scanDetails.culturalContext}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-700 mb-2">Nearby Attractions</p>
                  <div className="flex flex-wrap gap-2">
                    {scanDetails.nearbyAttractions.map((attraction) => (
                      <span
                        key={attraction}
                        className="bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-600 font-medium"
                      >
                        {attraction}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <span className="font-bold">Did you know? </span>
                    {scanDetails.funFact}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => setIsMapOpen(true)}
                    className="border border-blue-200 text-blue-600 rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors"
                  >
                    <MapPin size={15} />
                    View on Map
                  </button>
                  <button
                    onClick={openAssistant}
                    className="bg-blue-600 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle size={15} />
                    Ask AI Assistant
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isMapOpen && (
        <MapModal
          place={{
            name: landmark.name,
            city: trip.city,
            country: trip.country,
            address: landmark.address,
            distance: scanDetails.walkingDistance,
            walkingTime: scanDetails.walkingTime,
            nearbyPlaces: scanDetails.nearbyAttractions,
          }}
          onClose={() => setIsMapOpen(false)}
          onAddToPlan={addLandmarkToPlan}
          isAdded={isLandmarkPlanned}
        />
      )}

      {activePanel === 'assistant' && (
        <div
          className="fixed inset-0 z-50 bg-gray-950/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
          onClick={() => setActivePanel(null)}
          role="presentation"
        >
          <section
            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`AI assistant for ${landmark.name}`}
          >
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/15 rounded-xl">
                  <Sparkles size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">AI Travel Assistant</h3>
                  <p className="text-xs text-blue-100">{landmark.name} · {city}</p>
                </div>
              </div>
              <button
                onClick={() => setActivePanel(null)}
                className="p-2 rounded-xl text-white hover:bg-white/15"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-60 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <p
                    className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white border border-gray-100 text-gray-700 rounded-bl-md'
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500 mb-2">Suggested questions</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {['Best time', 'Nearby places', 'History', 'Photo tips'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => askAssistant(suggestion)}
                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    {suggestion}
                  </button>
                ))}
                <button
                  onClick={addLandmarkToPlan}
                  className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  <Plus size={12} className="inline -mt-0.5 mr-1" />
                  Add to plan
                </button>
              </div>
              <form
                className="flex items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  askAssistant(chatInput);
                }}
              >
                <input
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Ask about your visit..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700"
                  aria-label="Send question"
                >
                  <Send size={17} />
                </button>
              </form>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div
          className="fixed z-[60] left-1/2 -translate-x-1/2 bottom-6 bg-gray-900 text-white rounded-full px-4 py-2.5 shadow-xl text-sm font-medium"
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
