import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { graphql } from '../gql';

const ITINERARY_OPTIONS = graphql(`
  query ItineraryOptions {
    itineraries { id name }
  }
`);

const ADD_ITEM = graphql(`
  mutation AddItineraryItem($input: AddItemInput!) {
    addItineraryItem(input: $input) { id position }
  }
`);

type Props = { destinationId: string; destinationName: string };

export function SaveToItinerary({ destinationId, destinationName }: Props) {
  const { data, loading } = useQuery(ITINERARY_OPTIONS);
  const [itineraryId, setItineraryId] = useState('');
  const [message, setMessage] = useState('');
  const [addItem, { loading: saving }] = useMutation(ADD_ITEM, {
    refetchQueries: ['Itineraries'],
  });

  const itineraries = data?.itineraries ?? [];

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!itineraryId) return;
    await addItem({ variables: { input: { itineraryId, destinationId } } });
    const name = itineraries.find((i) => i.id === itineraryId)?.name;
    setMessage(`Saved ${destinationName} to ${name}.`);
  }

  if (loading) return null;

  if (itineraries.length === 0) {
    return (
      <p className="mt-6">
        <Link to="/itineraries" className="underline">Create an itinerary</Link> to save this destination.
      </p>
    );
  }

  return (
    <form onSubmit={onSave} className="mt-6 flex flex-wrap items-center gap-2">
      <label htmlFor="itinerary-select" className="font-medium">Save to</label>
      <select
        id="itinerary-select"
        value={itineraryId}
        onChange={(e) => { setItineraryId(e.target.value); setMessage(''); }}
        className="rounded border px-3 py-2"
      >
        <option value="">Choose an itinerary</option>
        {itineraries.map((i) => (
          <option key={i.id} value={i.id}>{i.name}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={!itineraryId || saving}
        className="rounded bg-brand-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
      <p aria-live="polite" className="w-full text-sm text-green-700">{message}</p>
    </form>
  );
}
