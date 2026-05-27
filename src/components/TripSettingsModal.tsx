import { useState, useEffect } from 'react';
import { X, Calendar, Users, Minus, Plus, Settings2 } from 'lucide-react';
import { useTrip } from '../context/TripContext';

/** "Jun 10, 2026" → "2026-06-10" */
function toInputDate(display: string): string {
  const months: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };
  const match = display.match(/(\w{3})\s+(\d{1,2}),\s+(\d{4})/);
  if (!match) return '';
  const [, mon, day, year] = match;
  const m = months[mon];
  if (!m) return '';
  return `${year}-${m}-${day.padStart(2, '0')}`;
}

/** "2026-06-10" → "Jun 10, 2026" */
function toDisplayDate(inputVal: string): string {
  if (!inputVal) return '';
  const [year, month, day] = inputVal.split('-').map(Number);
  if (!year || !month || !day) return inputVal;
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TripSettingsModal() {
  const { trip, updateTrip, isSettingsOpen, closeSettings } = useTrip();

  const [form, setForm] = useState({
    startDate: toInputDate(trip.startDate),
    endDate: toInputDate(trip.endDate),
    travelers: trip.travelers,
  });

  // Re-sync form fields each time the modal opens
  useEffect(() => {
    if (isSettingsOpen) {
      setForm({
        startDate: toInputDate(trip.startDate),
        endDate: toInputDate(trip.endDate),
        travelers: trip.travelers,
      });
    }
  }, [isSettingsOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    updateTrip({
      startDate: toDisplayDate(form.startDate) || trip.startDate,
      endDate: toDisplayDate(form.endDate) || trip.endDate,
      travelers: form.travelers,
    });
    closeSettings();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeSettings}
      />

      {/* Sheet / Dialog */}
      <div className="relative w-full md:max-w-md mx-auto bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 size={18} className="text-white" />
              <h2 className="text-white font-bold text-lg">Edit Trip</h2>
            </div>
            <button
              onClick={closeSettings}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Close"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
          <p className="text-blue-100 text-xs mt-1">Update your travel details</p>
        </div>

        {/* Form */}
        <div className="px-5 py-5 space-y-5">
          {/* Dates */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
              <Calendar size={13} className="text-blue-500" />
              Travel Dates
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <p className="text-[10px] text-gray-400 font-medium mb-1">Start Date</p>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium mb-1">End Date</p>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Travelers */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
              <Users size={13} className="text-blue-500" />
              Travelers
            </label>
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3">
              <button
                onClick={() => setForm((p) => ({ ...p, travelers: Math.max(1, p.travelers - 1) }))}
                className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:border-blue-400 transition-colors flex-shrink-0"
                aria-label="Decrease travelers"
              >
                <Minus size={15} className="text-gray-600" />
              </button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-black text-gray-900">{form.travelers}</span>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-none">
                  {form.travelers === 1 ? 'traveler' : 'travelers'}
                </p>
              </div>
              <button
                onClick={() => setForm((p) => ({ ...p, travelers: Math.min(20, p.travelers + 1) }))}
                className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:border-blue-400 transition-colors flex-shrink-0"
                aria-label="Increase travelers"
              >
                <Plus size={15} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 flex gap-3">
          <button
            onClick={closeSettings}
            className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-200"
          >
            Save Trip
          </button>
        </div>

        {/* Mobile safe-area spacer */}
        <div className="h-[env(safe-area-inset-bottom,0px)] bg-white" />
      </div>
    </div>
  );
}
