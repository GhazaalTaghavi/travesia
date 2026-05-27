import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  MapPin,
  UtensilsCrossed,
  Calendar,
  CalendarDays,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/landmarks', label: 'Explore', icon: MapPin },
  { to: '/food', label: 'Food', icon: UtensilsCrossed },
  { to: '/planner', label: 'Planner', icon: CalendarDays },
  { to: '/events', label: 'Events', icon: Calendar },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-stretch h-16">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all"
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-blue-50' : 'bg-transparent'
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? 'text-blue-600' : 'text-gray-400'}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span
                className={`text-[10px] font-medium leading-none ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-white" />
    </nav>
  );
}
