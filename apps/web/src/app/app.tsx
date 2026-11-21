import { useQuery } from '@apollo/client/react';
import { graphql } from '../gql'

const DESTINATIONS = graphql(`
  query Destinations {
    destinations { id name country summary }
  }
`);

export function App() {
  const { data, loading, error } = useQuery(DESTINATIONS);
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <main>
      <h1>Trip Desk</h1>
      <ul>
        {data?.destinations.map((d) => (
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
