import { useQuery } from '@apollo/client/react';
import { graphql } from '../gql';
import { DestinationCard } from './destination-card';
import { CardGridSkeleton } from './skeletons'
import { ErrorAlert } from './error-alert'

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
  return (
    <section>
      <h1 className="text-3xl font-bold text-ink">Destinations</h1>
      {loading ? (
        <CardGridSkeleton />
      ) : error ? (
        <ErrorAlert message="We couldn't load destinations. Please try again." />
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.destinations.map((d) => <DestinationCard key={d.id} d={d} />)}
        </div>
      )}
    </section>
  );
}
