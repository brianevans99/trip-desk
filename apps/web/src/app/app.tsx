import { Route, Routes } from 'react-router-dom';
import { DestinationList } from './destination-list';
import { DestinationDetail } from './destination-detail';

export function App() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-brand-700">Trip Desk</h1>
      <Routes>
        <Route path="/" element={<DestinationList />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
      </Routes>
    </main>
  );
}

export default App;
