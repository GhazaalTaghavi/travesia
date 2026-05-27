import { useEffect } from 'react';
import { CalendarPlus, Clock3, ExternalLink, MapPin, Navigation, TrainFront, X } from 'lucide-react';

export interface MapModalPlace {
  name: string;
  city: string;
  country?: string;
  address?: string;
  distance?: string;
  walkingTime?: string;
  transitTime?: string;
  nearbyPlaces?: string[];
}

interface MapModalProps {
  place: MapModalPlace;
  onClose: () => void;
  onAddToPlan: () => void;
  isAdded?: boolean;
}

export default function MapModal({
  place,
  onClose,
  onAddToPlan,
  isAdded = false,
}: MapModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const destination = [place.name, place.address, place.city, place.country].filter(Boolean).join(', ');
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination || place.name)}`;
  const nearbyPlaces = place.nearbyPlaces?.slice(0, 3) ?? [];

  return (
    <div
      className="fixed inset-0 z-[70] bg-gray-950/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 md:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-modal-title"
        className="bg-white w-full max-w-xl max-h-[94vh] overflow-y-auto rounded-3xl shadow-2xl"
      >
        <div className="px-5 pt-4 pb-3 flex items-start justify-between border-b border-gray-100">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
              {place.city}{place.country ? `, ${place.country}` : ''} map
            </p>
            <h2 id="map-modal-title" className="text-lg font-black text-gray-900 mt-1">
              {place.name}
            </h2>
            {place.address && <p className="text-xs text-gray-500 mt-1">{place.address}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100"
            aria-label="Close map"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative h-64 md:h-72 overflow-hidden bg-[#e8f1eb]">
          <div className="absolute -left-14 top-12 h-6 w-96 rotate-12 bg-white/90 border-y border-gray-200" />
          <div className="absolute left-[39%] -top-10 h-96 w-8 rotate-12 bg-white/80 border-x border-gray-200" />
          <div className="absolute right-0 top-48 h-6 w-64 -rotate-12 bg-white/85 border-y border-gray-200" />
          <div className="absolute left-7 bottom-8 w-36 h-20 rounded-full bg-emerald-200/65" />
          <div className="absolute right-7 top-7 w-28 h-20 rounded-3xl bg-emerald-200/60" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 288" aria-hidden="true">
            <path
              d="M62 232 C 116 210, 106 170, 172 166 S 241 128, 282 129 S 321 96, 361 83"
              fill="none"
              stroke="#fff"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M62 232 C 116 210, 106 170, 172 166 S 241 128, 282 129 S 321 96, 361 83"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeDasharray="6 7"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute left-7 bottom-7 flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-full shadow-sm text-[11px] font-semibold text-gray-700">
            <Navigation size={12} className="text-blue-600 fill-blue-600" />
            Your location
          </div>
          <div className="absolute right-[19%] top-[17%] flex flex-col items-center max-w-[48%]">
            <div className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md truncate max-w-full">
              {place.name}
            </div>
            <MapPin size={30} className="text-blue-600 fill-blue-100 -mt-0.5" />
          </div>
          {nearbyPlaces.map((nearbyPlace, index) => (
            <div
              key={nearbyPlace}
              className={`absolute flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-sm text-[10px] font-semibold text-gray-600 max-w-36 ${
                index === 0
                  ? 'left-[34%] top-[35%]'
                  : index === 1
                    ? 'right-[7%] bottom-[25%]'
                    : 'left-[9%] top-[24%]'
              }`}
            >
              <MapPin size={11} className="text-emerald-500 fill-emerald-100 flex-shrink-0" />
              <span className="truncate">{nearbyPlace}</span>
            </div>
          ))}
        </div>

        <div className="p-4 md:p-5">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="rounded-xl bg-blue-50 p-3">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">Distance</p>
              <p className="text-sm font-bold text-blue-800 mt-1">{place.distance ?? '1.2 km'}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                <Clock3 size={10} />
                Walk
              </p>
              <p className="text-sm font-bold text-gray-800 mt-1">{place.walkingTime ?? '16 min'}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                <TrainFront size={10} />
                Transit
              </p>
              <p className="text-sm font-bold text-gray-800 mt-1">{place.transitTime ?? '9 min'}</p>
            </div>
          </div>

          {nearbyPlaces.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-700 mb-2">Nearby places</p>
              <div className="flex flex-wrap gap-2">
                {nearbyPlaces.map((nearbyPlace) => (
                  <span
                    key={nearbyPlace}
                    className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    {nearbyPlace}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 text-white rounded-xl px-4 py-3 text-sm font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <ExternalLink size={15} />
              Open in Google Maps
            </a>
            <button
              type="button"
              onClick={onAddToPlan}
              className="flex-1 rounded-xl border border-blue-200 text-blue-600 px-4 py-3 text-sm font-semibold flex justify-center items-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <CalendarPlus size={16} />
              {isAdded ? 'Added to Plan' : 'Add to Plan'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 text-gray-600 px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
