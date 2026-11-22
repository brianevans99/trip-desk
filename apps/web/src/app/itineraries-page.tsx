import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { graphql } from '../gql';

const ITINERARIES = graphql(`
  query Itineraries {
    itineraries {
      id
      name
      createdAt
      items { id destinationId note position }
    }
  }
`);

const CREATE_ITINERARY = graphql(`
  mutation CreateItinerary($input: CreateItineraryInput!) {
    createItinerary(input: $input) { id name }
  }
`);

export function ItinerariesPage() {
  const [name, setName] = useState('');
  const { data, loading, error } = useQuery(ITINERARIES);
  const [createItinerary, { loading: saving }] = useMutation(CREATE_ITINERARY, {
    refetchQueries: ['Itineraries'],
  });

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

      {loading && <p>Loading…</p>}
      {error && <p role="alert">Couldn't load itineraries.</p>}

      <ul className="space-y-4">
        {data?.itineraries.map((it) => (
          <li key={it.id} className="rounded border p-4">
            <h2 className="text-xl font-semibold">{it.name}</h2>
            <p className="text-sm text-gray-500">
              {it.items.length} {it.items.length === 1 ? 'item' : 'items'}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
