import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const DESTINATIONS = gql`
  query Destinations {
    destinations { id name country summary }
  }
`;

export function App() {
  const { data, loading, error } = useQuery<any>(DESTINATIONS);
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <main>
      <h1>Trip Desk</h1>
      <ul>
        {data.destinations.map((d: any) => (
          <li key={d.id}>
            <h2>{d.name}, {d.country}</h2>
            <p>{d.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
