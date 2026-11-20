import { Injectable, Logger } from '@nestjs/common';
import { Place } from '../models/place.model';

@Injectable()
export class GeoapifyService {
  private readonly logger = new Logger(GeoapifyService.name);
  private readonly cache = new Map<
    string,
    { value: Place[]; expires: number }
  >();
  private readonly ttlMs = 24 * 60 * 60 * 1000;
  private readonly base = 'https://api.geoapify.com';

  async getPlaces(
    city: string,
    country?: string,
    categories = 'tourism.sights,entertainment.museum,heritage',
    limit = 5,
  ): Promise<Place[]> {
    const text = country ? `${city}, ${country}` : city;
    const key = `${city.toLowerCase()}:${country?.toLowerCase()}:${categories}:${limit}`;
    const hit = this.cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;

    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      this.logger.warn('GEOAPIFY_API_KEY is not set');
      return [];
    }

    // Step 1: city + country -> coordinates
    const geoRes = await fetch(
      `${this.base}/v1/geocode/search?text=${encodeURIComponent(text)}&type=city&limit=1&apiKey=${apiKey}`,
    );
    if (!geoRes.ok) {
      this.logger.warn(`Geoapify geocode ${geoRes.status} for "${city}"`);
      return [];
    }
    const geo = (await geoRes.json()) as { features: any[] };

    const props = geo.features[0]?.properties;
    if (!props) return [];
    const { lon, lat } = props;

    // Step 2: sights within 5 km of the center
    const res = await fetch(
      `${this.base}/v2/places?categories=${categories}&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=${limit}&apiKey=${apiKey}`,
    );
    if (!res.ok) {
      this.logger.warn(`Geoapify places ${res.status} for "${city}"`);
      return [];
    }
    const body = (await res.json()) as { features: any[] };
    const value: Place[] = body.features
      .filter(
        (f) =>
          f.properties.name &&
          !f.properties.name.toLowerCase().includes(city.toLowerCase()),
      )
      .map((f) => ({
        id: f.properties.place_id,
        name: f.properties.name,
        address: f.properties.formatted,
        lat: f.properties.lat,
        long: f.properties.lon,
        category: [...(f.properties.categories ?? [])].sort(
          (a, b) => b.length - a.length,
        )[0],
        attribution: {
          source: 'Geoapify / OpenStreetMap',
          url: 'https://www.openstreetmap.org/copyright',
          license: 'ODbL',
        },
      }));
    this.cache.set(key, { value, expires: Date.now() + this.ttlMs });
    return value;
  }
}
