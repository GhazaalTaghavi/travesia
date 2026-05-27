import { HashRouter, Routes, Route } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LandmarksPage from './pages/LandmarksPage';
import ScanPage from './pages/ScanPage';
import FoodPage from './pages/FoodPage';
import WeatherPage from './pages/WeatherPage';
import EventsPage from './pages/EventsPage';
import PlannerPage from './pages/PlannerPage';
import TravelStayPage from './pages/TravelStayPage';

export default function App() {
  return (
    <TripProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/landmarks" element={<LandmarksPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/travel-stay" element={<TravelStayPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </TripProvider>
  );
}
