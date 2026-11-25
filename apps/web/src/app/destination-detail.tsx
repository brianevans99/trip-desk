import { useQuery } from '@apollo/client/react';
import { Link, useParams } from 'react-router-dom';
import { graphql } from '../gql';
import { FlightSearch } from './flight-search'
import { SaveToItinerary } from "./save-to-itinerary";
import { ErrorAlert } from "./error-alert";

const DESTINATION = graphql(`
  query Destination($id: ID!) {
    destination(id: $id) {
      id name country airportCode summary
      summaryAttribution { source url license }
      photos { url alt attribution { author url } }
      places { id name category address }
    }
  }
`);

export function DestinationDetail() {
  const { id = '' } = useParams();
  const { data, loading, error } = useQuery(DESTINATION, { variables: { id } });
  if (loading) return <p>Loading…</p>;
  if (error) return <ErrorAlert message="We couldn't load this destination. Please try again." />;
  const d = data?.destination;
  if (!d) return <p>Destination not found. <Link to="/" className="underline">Back to all destinations</Link></p>;

  return (
    <article className="mt-6">
      <h2 className="mt-2 text-2xl font-semibold text-ink">{d.name}, {d.country}</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {d.photos.map((p, i) => (
          <figure key={p.url} className={i > 0 ? 'hidden sm:block' : undefined}>
            <img loading={"lazy"} src={p.url} alt={p.alt ?? ''} className="h-48 w-full rounded-lg object-cover" />
            <figcaption className="mt-1 text-xs text-gray-500">
              Photo by <a href={p.attribution.url ?? undefined} className="underline" target="_blank" rel="noreferrer">{p.attribution.author}</a> on Unsplash
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="mt-6 max-w-prose text-gray-700">{d.summary}</p>
      <SaveToItinerary destinationId={d.id} destinationName={d.name} />
      {d.summaryAttribution && (
        <p className="mt-2 text-xs text-gray-500">
          From <a href={d.summaryAttribution.url ?? undefined} className="underline" target="_blank" rel="noreferrer">{d.summaryAttribution.source}</a>, {d.summaryAttribution.license}
        </p>
      )}

      <h3 className="mt-8 text-lg font-semibold text-ink">Things to see</h3>
      <ul className="mt-2 divide-y divide-gray-200">
        {(d.places ?? []).map((p) => (
          <li key={p.id} className="py-2">
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-gray-500">{p.address}</p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-gray-500">Places data © OpenStreetMap contributors, via Geoapify</p>
      <FlightSearch defaultDestination={d.airportCode ?? ''} />
    </article>
  );
}
