import type { DestinationsQuery } from '../gql/graphql';

type Destination = DestinationsQuery['destinations'][number];

export function DestinationCard({ d }: { d: Destination }) {
  const photo = d.photos[0];
  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {photo && (
        <figure>
          {/* An empty `alt` is the accessible fallback, because screen readers skip the image instead of reading out its file name */}
          <img src={photo.url} alt={photo.alt ?? ''} className="h-48 w-full object-cover" />
          <figcaption className="px-4 pt-2 text-xs text-gray-500">
            Photo by <a href={photo.attribution.url ?? undefined} className="underline" target="_blank" rel="noreferrer">{photo.attribution.author}</a> on Unsplash
          </figcaption>
        </figure>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-ink">{d.name}, {d.country}</h2>
        <p className="mt-2 line-clamp-4 text-sm text-gray-700">{d.summary}</p>
        {d.summaryAttribution && (
          <p className="mt-2 text-xs text-gray-500">
            From <a href={d.summaryAttribution.url ?? undefined} className="underline" target="_blank" rel="noreferrer">{d.summaryAttribution.source}</a>, {d.summaryAttribution.license}
          </p>
        )}
      </div>
    </article>
  );
}
