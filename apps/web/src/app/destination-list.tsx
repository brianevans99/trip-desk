import { useQuery } from '@apollo/client/react';
import { graphql } from '../gql';
import { DestinationCard } from './destination-card';

const DESTINATIONS = graphql(`
  query Destinations {
    destinations {
      id name country summary
      summaryAttribution { source url license }
      photos { url alt attribution { author url } }
    }
  }
`);

export function DestinationList() {
  const { data, loading, error } = useQuery(DESTINATIONS);
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data?.destinations.map((d) => <DestinationCard key={d.id} d={d} />)}
    </div>
  );
}
