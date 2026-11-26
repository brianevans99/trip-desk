import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { graphql } from '../gql';
import { Link } from 'react-router-dom';
import { isUnauthenticated } from "./errors";
import { ErrorAlert } from "./error-alert";
import { ItinerariesSkeleton } from "./skeletons";

const ITINERARIES = graphql(`
  query Itineraries {
    itineraries {
      id
      name
      startDate
      endDate
      createdAt
      items {
        id
        position
        note
        destination {
          id
          name
          country
          photos {
            url
            alt
          }
        }
      }
    }
  }
`);

const CREATE_ITINERARY = graphql(`
  mutation CreateItinerary($input: CreateItineraryInput!) {
    createItinerary(input: $input) { id name startDate endDate }
  }
`);

const REMOVE_ITEM = graphql(`
  mutation RemoveItineraryItem($id: ID!) {
    removeItineraryItem(id: $id)
  }
`);

function formatRange(start?: string | null, end?: string | null) {
  const fmt = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `From ${fmt(start)}`;
  if (end) return `Until ${fmt(end)}`;
  return null;
}
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">My itineraries</h1>
      {children}
    </section>
  );
}

export function ItinerariesPage() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [removeItem] = useMutation(REMOVE_ITEM, { refetchQueries: ['Itineraries'] });
  const { data, loading, error } = useQuery(ITINERARIES, {
    fetchPolicy: 'cache-and-network',
  });
  const [createItinerary, { loading: saving }] = useMutation(CREATE_ITINERARY, {
    refetchQueries: ['Itineraries'],
  });

  if (loading) return <PageShell><ItinerariesSkeleton /></PageShell>;
  if (error) {
    return (
      <PageShell>
        <ErrorAlert
          message={
            isUnauthenticated(error)
              ? 'Sign in to see your itineraries.'
              : 'Something went wrong loading your itineraries. Please try again.'
          }
        />
      </PageShell>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createItinerary({
      variables: {
        input: { name: name.trim(), startDate: startDate || null, endDate: endDate || null },
      },
    });
    setName('');
    setStartDate('');
    setEndDate('');
  }

  return (
    <PageShell>
      <form onSubmit={onSubmit} className="flex flex-wrap gap-2 mb-8">
        <label htmlFor="itinerary-name" className="sr-only">Itinerary name</label>
        <input
          id="itinerary-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Lisbon weekend"
          className="flex-1 rounded border px-3 py-2"
        />
        <label htmlFor="itinerary-start" className="sr-only">Start date</label>
        <input
          id="itinerary-start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <label htmlFor="itinerary-end" className="sr-only">End date</label>
        <input
          id="itinerary-end"
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <button type="submit" disabled={saving} className="rounded bg-brand-600 px-4 py-2 text-white disabled:opacity-50 cursor-pointer">
          {saving ? 'Creating…' : 'Create'}
        </button>
      </form>

      <ul className="space-y-4">
        {data?.itineraries.map((it) => (
          <li key={it.id} className="rounded border border-gray-200 p-4">
            <h2 className="text-xl font-semibold">{it.name}</h2>
            {formatRange(it.startDate, it.endDate) && (
              <p className="text-sm text-gray-600">{formatRange(it.startDate, it.endDate)}</p>
            )}
            <div className="text-sm text-gray-500">
              {it.items.length === 0 ? (
                <p className="text-sm text-gray-500">No destinations yet.</p>
              ) : (
                <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {it.items.map((item) => (
                    <li key={item.id}>
                      {item.destination?.photos[0] && (
                        <img
                          src={item.destination.photos[0].url}
                          alt={item.destination.photos[0].alt ?? ''}
                          className="h-24 w-full rounded object-cover"
                        />
                      )}
                      <Link to={`/destinations/${item.destination?.id}`} className="mt-1 block font-medium underline">
                        {item.destination?.name ?? 'Unknown destination'}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem({ variables: { id: item.id } })}
                        aria-label={`Remove ${item.destination?.name ?? 'destination'} from ${it.name}`}
                        className="mt-1 text-sm text-red-700 underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
