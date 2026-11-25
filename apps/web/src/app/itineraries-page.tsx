import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { graphql } from '../gql';
import { Link } from 'react-router-dom';
import { isUnauthenticated } from "./errors";

const ITINERARIES = graphql(`
  query Itineraries {
    itineraries {
      id
      name
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
    createItinerary(input: $input) { id name }
  }
`);

const REMOVE_ITEM = graphql(`
  mutation RemoveItineraryItem($id: ID!) {
    removeItineraryItem(id: $id)
  }
`);

export function ItinerariesPage() {
  const [name, setName] = useState('');
  const [removeItem] = useMutation(REMOVE_ITEM, { refetchQueries: ['Itineraries'] });
  const { data, loading, error } = useQuery(ITINERARIES);
  const [createItinerary, { loading: saving }] = useMutation(CREATE_ITINERARY, {
    refetchQueries: ['Itineraries'],
  });

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) {
    if (isUnauthenticated(error)) {
      return (
        <section className="text-sm text-gray-500">
          Sign in to see your itineraries.
        </section>
      );
    }
    return (
      <section role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
        Something went wrong loading your itineraries. Please try again.
      </section>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createItinerary({ variables: { input: { name: name.trim() } } });
    setName('');
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-6">My itineraries</h1>

      <form onSubmit={onSubmit} className="flex gap-2 mb-8">
        <label htmlFor="itinerary-name" className="sr-only">Itinerary name</label>
        <input
          id="itinerary-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Lisbon weekend"
          className="flex-1 rounded border px-3 py-2"
        />
        <button type="submit" disabled={saving} className="rounded bg-brand-600 px-4 py-2 text-white disabled:opacity-50">
          {saving ? 'Creating…' : 'Create'}
        </button>
      </form>

      <ul className="space-y-4">
        {data?.itineraries.map((it) => (
          <li key={it.id} className="rounded border p-4">
            <h2 className="text-xl font-semibold">{it.name}</h2>
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
                        className="mt-1 text-sm text-red-700 underline"
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
    </main>
  );
}
