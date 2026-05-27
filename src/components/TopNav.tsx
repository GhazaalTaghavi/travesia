import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  MapPin,
  UtensilsCrossed,
  Calendar,
  CalendarDays,
  Sparkles,
  ScanLine,
  CloudSun,
  Settings2,
  Luggage,
  BedDouble,
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

const navItems = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/landmarks', label: 'Explore', icon: MapPin },
  { to: '/food', label: 'Food', icon: UtensilsCrossed },
  { to: '/planner', label: 'Planner', icon: CalendarDays },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/weather', label: 'Weather', icon: CloudSun },
  { to: '/scan', label: 'Landmark Identifier', icon: ScanLine },
  { to: '/travel-stay', label: 'Travel & Stay', icon: BedDouble },
];

export default function TopNav() {
  const location = useLocation();
  const { trip, openSettings } = useTrip();

  return (
    <nav className="hidden md:block sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center h-16 gap-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 flex-shrink-0 mr-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <Luggage size={18} strokeWidth={2.2} className="text-white" />
          </div>
          <span className="text-gray-900 font-black text-xl tracking-wide">TRAVESIA</span>
        </NavLink>

        {/* Nav items */}
        <div className="flex items-center gap-0.5">
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const isActive = exact
              ? location.pathname === to
              : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 1.8} />
                {label}
              </NavLink>
            );
          })}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2.5">
          {/* Clickable location badge → opens trip settings */}
          <button
            onClick={openSettings}
            className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 hover:bg-gray-200 transition-colors group"
            title="Edit trip settings"
          >
            <MapPin size={12} className="text-gray-500" />
            <span className="text-gray-600 text-xs font-medium">
              {trip.city}, {trip.country}
            </span>
            <Settings2
              size={11}
              className="text-gray-400 group-hover:text-gray-600 transition-colors"
            />
          </button>

          <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full px-3 py-1.5">
            <Sparkles size={12} className="text-white" />
            <span className="text-white text-xs font-semibold">AI Powered</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
