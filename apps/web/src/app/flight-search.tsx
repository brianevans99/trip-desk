import { useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { graphql } from '../gql';

const FLIGHT_OFFERS = graphql(`
  query FlightOffers($origin: String!, $destination: String!, $date: String!) {
    flightOffers(origin: $origin, destination: $destination, date: $date) {
      id stops isSample
      price { amount currency }
      segments { from to departsAt arrivesAt carrier flightNumber }
    }
  }
`);

export function FlightSearch({ defaultDestination = '' }: { defaultDestination?: string }) {
  const [origin, setOrigin] = useState('ATL');
  const [destination, setDestination] = useState(defaultDestination);
  const [date, setDate] = useState('');
  const [search, { data, loading, error, called }] = useLazyQuery(FLIGHT_OFFERS);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search({ variables: { origin: origin.toUpperCase(), destination: destination.toUpperCase(), date } });
  };

  const input = 'mt-1 block w-full rounded-lg border border-gray-300 p-2';

  return (
    <section className="mt-8" aria-labelledby="flights-heading">
      <h3 id="flights-heading" className="text-lg font-semibold text-ink">Find flights</h3>
      <form onSubmit={onSubmit} className="mt-2 grid gap-4 sm:grid-cols-4 sm:items-end">
        <label className="text-sm">From (airport code)
          <input className={input} value={origin} onChange={(e) => setOrigin(e.target.value)} maxLength={3} required />
        </label>
        <label className="text-sm">To (airport code)
          <input className={input} value={destination} onChange={(e) => setDestination(e.target.value)} maxLength={3} required />
        </label>
        <label className="text-sm">Date
          <input className={input} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading} className="rounded-lg bg-brand-600 p-2 font-medium text-white hover:bg-brand-700 disabled:opacity-50">
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div aria-live="polite">
        {error && <p className="mt-4 text-red-700">Error: {error.message}</p>}
        {called && !loading && data?.flightOffers.length === 0 && <p className="mt-4">No flights found.</p>}
        {data && data.flightOffers.length > 0 && (
          <>
            {data.flightOffers[0].isSample && (
              <p className="mt-4 text-xs text-gray-500">Sample data from Duffel test mode. Not real fares.</p>
            )}
            <ul className="mt-2 divide-y divide-gray-200">
              {data.flightOffers.map((o) => (
                <li key={o.id} className="flex justify-between py-3">
                  <div>
                    <p className="font-medium">{o.segments[0].carrier} · {o.stops === 0 ? 'Nonstop' : `${o.stops} stop${o.stops > 1 ? 's' : ''}`}</p>
                    <p className="text-sm text-gray-500">
                      {o.segments.map((s) => `${s.from} ${s.departsAt.slice(11, 16)} → ${s.to} ${s.arrivesAt.slice(11, 16)}`).join(', ')}
                    </p>
                  </div>
                  <p className="font-semibold">{o.price.amount} {o.price.currency}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
