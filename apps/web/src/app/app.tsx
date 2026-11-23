import { Route, Routes } from 'react-router-dom';
import { DestinationList } from './destination-list';
import { DestinationDetail } from './destination-detail';
import { ItinerariesPage } from "./itineraries-page";
import { AuthCallback } from "./auth/auth-callback";
import {UserMenu} from "./auth/user-menu";

export function App() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-brand-700">Trip Desk</h1>
      <UserMenu />
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<DestinationList />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/itineraries" element={<ItinerariesPage />} />
      </Routes>
    </main>
  );
}

export default App;
