import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import TopNav from './TopNav';
import TripSettingsModal from './TripSettingsModal';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
      <TripSettingsModal />
    </div>
  );
}
