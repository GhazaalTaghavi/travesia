import { useEffect, useState } from 'react';
import {
  BedDouble,
  BriefcaseBusiness,
  Bus,
  CalendarDays,
  CheckCircle,
  Clock,
  MapPin,
  Plane,
  Sparkles,
  Star,
  Train,
  Users,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useTrip } from '../context/TripContext';
import {
  getCityTravelStayData,
  type StayOption,
  type TransportOption,
  type TransportType,
} from '../data/cityTravelStay';

const transportIcons: Record<TransportType, React.ElementType> = {
  Flight: Plane,
  Train,
  Bus,
};

function price(value: number): string {
  return `€${value.toLocaleString()}`;
}

export default function TravelStayPage() {
  const { trip, tripDays, openSettings, travelPlans, selectTravelTransport, reserveTravelStay } =
    useTrip();
  const data = getCityTravelStayData(trip.city);
  const nights = Math.max(1, tripDays - 1);
  const [notice, setNotice] = useState('');
  const selectedPlan = travelPlans[trip.city] ?? {};

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const chooseTransport = (option: TransportOption) => {
    selectTravelTransport(option);
    setNotice(`${option.provider} ${option.type.toLowerCase()} selected for your ${trip.city} trip.`);
  };

  const chooseStay = (stay: StayOption) => {
    reserveTravelStay(stay);
    setNotice(`${stay.name} reserved in your mock travel plan.`);
  };

  const recommendedTransport = data.transport.find(
    (option) => option.id === data.recommendation.transportId,
  );
  const recommendedStay = data.stays.find((stay) => stay.id === data.recommendation.stayId);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Travel & Stay"
        subtitle={`${trip.city}, ${trip.country} | ${trip.startDate} - ${trip.endDate}`}
        gradient
        showBack
        action={
          <button
            type="button"
            onClick={openSettings}
            className="hidden sm:flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-xs font-semibold text-white hover:bg-white/30 transition-colors"
          >
            <CalendarDays size={14} />
            Edit trip
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 md:py-7">
        {notice && (
          <div
            role="status"
            className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            <CheckCircle size={17} />
            {notice}
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <MapPin size={16} className="text-blue-600" />
            {trip.city}, {trip.country}
          </div>
          <span className="hidden sm:block h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays size={16} className="text-cyan-600" />
            {trip.startDate} - {trip.endDate} ({nights} night{nights !== 1 ? 's' : ''})
          </div>
          <span className="hidden sm:block h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} className="text-cyan-600" />
            {trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-6">
          <div className="space-y-7">
            <section>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Transport planning</h2>
                  <p className="text-sm text-gray-500">Mock routes arriving in {trip.city}</p>
                </div>
                <span className="text-xs font-medium text-blue-600">Price per traveler</span>
              </div>
              <div className="grid gap-3 xl:grid-cols-3">
                {data.transport.map((option) => {
                  const Icon = transportIcons[option.type];
                  const selected = selectedPlan.transport?.id === option.id;
                  const recommended = option.id === data.recommendation.transportId;
                  return (
                    <article
                      key={option.id}
                      className={`rounded-2xl border bg-white p-4 shadow-sm transition-colors ${
                        selected ? 'border-blue-400 ring-1 ring-blue-100' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <Icon size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                              {option.type}
                            </p>
                            <h3 className="text-sm font-bold text-gray-900">{option.provider}</h3>
                          </div>
                        </div>
                        {recommended && (
                          <span className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-700">
                            AI pick
                          </span>
                        )}
                      </div>
                      <p className="mt-3 min-h-8 text-xs font-medium leading-4 text-gray-500">
                        {option.route}
                      </p>
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{option.departure}</p>
                          <p className="text-[10px] text-gray-400">Departure</p>
                        </div>
                        <div className="text-center text-gray-400">
                          <Clock size={12} className="mx-auto" />
                          <p className="text-[10px]">{option.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{option.arrival}</p>
                          <p className="text-[10px] text-gray-400">Arrival</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <BriefcaseBusiness size={13} className="text-gray-400" />
                          {option.baggage}
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles size={13} className="text-gray-400" />
                          {option.comfort}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <p className="text-lg font-black text-gray-900">{price(option.price)}</p>
                        <button
                          type="button"
                          onClick={() => chooseTransport(option)}
                          className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                            selected
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {selected ? 'Selected' : 'Select Option'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Accommodation</h2>
                  <p className="text-sm text-gray-500">Stays selected for {trip.city}</p>
                </div>
                <span className="text-xs font-medium text-blue-600">{nights} nights total</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {data.stays.map((stay) => {
                  const selected = selectedPlan.stay?.id === stay.id;
                  const recommended = stay.id === data.recommendation.stayId;
                  return (
                    <article
                      key={stay.id}
                      className={`flex flex-col rounded-2xl border bg-white p-4 shadow-sm transition-colors ${
                        selected ? 'border-cyan-400 ring-1 ring-cyan-100' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                          <BedDouble size={20} className="text-cyan-700" />
                        </div>
                        {recommended && (
                          <span className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-700">
                            AI pick
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-gray-900">{stay.name}</h3>
                      <div className="mt-1 flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-1 text-gray-500">
                          <MapPin size={11} />
                          {stay.neighborhood}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-gray-700">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          {stay.rating}
                        </span>
                      </div>
                      <p className="mt-3 inline-flex self-start rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                        Best for: {stay.bestFor}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {stay.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-lg bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-500"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto pt-4">
                        <div className="mb-3 flex items-end justify-between">
                          <div>
                            <p className="text-lg font-black text-gray-900">{price(stay.pricePerNight)}</p>
                            <p className="text-[10px] text-gray-400">per night</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-cyan-700">
                              {price(stay.pricePerNight * nights)}
                            </p>
                            <p className="text-[10px] text-gray-400">trip total</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => chooseStay(stay)}
                          className={`w-full rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                            selected
                              ? 'bg-cyan-50 text-cyan-700'
                              : 'bg-cyan-600 text-white hover:bg-cyan-700'
                          }`}
                        >
                          {selected ? 'Reserved' : 'Reserve Stay'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="mt-7 space-y-4 lg:mt-0">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-5 text-white shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Sparkles size={17} />
                AI recommendation
              </div>
              <p className="mt-4 text-base font-bold">{data.recommendation.title}</p>
              <p className="mt-2 text-sm leading-6 text-blue-50">{data.recommendation.reason}</p>
              {recommendedTransport && recommendedStay && (
                <div className="mt-4 rounded-xl bg-white/15 px-3 py-3 text-xs text-white/90">
                  {recommendedTransport.provider} + {recommendedStay.name}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900">Your selected travel plan</h2>
              <p className="mt-1 text-xs text-gray-500">
                {trip.city} | {trip.startDate} - {trip.endDate}
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Transport
                  </p>
                  {selectedPlan.transport ? (
                    <>
                      <p className="mt-1 text-sm font-bold text-gray-900">
                        {selectedPlan.transport.provider} {selectedPlan.transport.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedPlan.transport.departure} - {selectedPlan.transport.arrival} |{' '}
                        {price(selectedPlan.transport.price)} per traveler
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">No transport option selected yet.</p>
                  )}
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Accommodation
                  </p>
                  {selectedPlan.stay ? (
                    <>
                      <p className="mt-1 text-sm font-bold text-gray-900">{selectedPlan.stay.name}</p>
                      <p className="text-xs text-gray-500">
                        {nights} night{nights !== 1 ? 's' : ''} |{' '}
                        {price(selectedPlan.stay.pricePerNight * nights)} total
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">No stay reserved yet.</p>
                  )}
                </div>
              </div>
              <p className="mt-4 text-[11px] leading-4 text-gray-400">
                Prototype only. No payment is processed and no real reservation is created.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
