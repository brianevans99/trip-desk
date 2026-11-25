import { Route, Routes } from 'react-router-dom';
import { DestinationList } from './destination-list';
import { DestinationDetail } from './destination-detail';
import { ItinerariesPage } from "./itineraries-page";
import { AuthCallback } from "./auth/auth-callback";
import { Navbar } from './navbar'

export function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl p-6">
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<DestinationList />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/itineraries" element={<ItinerariesPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
