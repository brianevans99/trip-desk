import { Injectable, Logger } from '@nestjs/common';
import { Photo } from '../models/photo.model';

@Injectable()
export class UnsplashService {
  private readonly logger = new Logger(UnsplashService.name);
  private readonly cache = new Map<string, { value: Photo[]; expires: number }>();
  private readonly ttlMs = 24 * 60 * 60 * 1000;

  async getPhotos(query: string, count = 3): Promise<Photo[]> {
    const key = `${query.toLowerCase()}:${count}`;
    const hit = this.cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      this.logger.warn('UNSPLASH_ACCESS_KEY is not set');
      return [];
    }
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${accessKey}` } });
    if (!res.ok) {
      this.logger.warn(`Unsplash ${res.status} for "${query}"`);
      return [];
    }
    const body = (await res.json()) as { results: any[] };
    const value: Photo[] = body.results.map((p) => ({
      url: p.urls.regular,
      alt: p.alt_description ?? query,
      attribution: {
        source: 'Unsplash',
        author: p.user.name,
        url: `${p.links.html}?utm_source=trip-desk&utm_medium=referral`,
        license: 'Unsplash License',
      },
    }));
    this.cache.set(key, { value, expires: Date.now() + this.ttlMs });
    return value;
  }
}
