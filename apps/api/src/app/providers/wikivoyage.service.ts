import { Injectable, Logger } from '@nestjs/common';
import { Attribution } from '../models/attribution.model';

export interface GuideSummary {
  summary: string;
  attribution: Attribution;
}

@Injectable()
export class WikivoyageService {
  private readonly logger = new Logger(WikivoyageService.name);
  private readonly base = 'https://en.wikivoyage.org/api/rest_v1/page/summary/';
  private readonly cache = new Map<string, { value: GuideSummary | null; expires: number }>();
  private readonly ttlMs = 24 * 60 * 60 * 1000;

  async getSummary(title: string): Promise<GuideSummary | null> {
    const key = title.toLowerCase();
    const hit = this.cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;
    const value = await this.fetchSummary(title);
    this.cache.set(key, { value, expires: Date.now() + this.ttlMs });
    return value;
  }

  private async fetchSummary(title: string): Promise<GuideSummary | null> {
    const url = this.base + encodeURIComponent(title);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'trip-desk portfolio app (brian.evans@bravoechoweb.com)' },
    });
    if (!res.ok) {
      this.logger.warn(`Wikivoyage ${res.status} for "${title}"`);
      return null;
    }
    const body = (await res.json()) as { extract?: string; content_urls?: { desktop?: { page?: string } } };
    if (!body.extract) return null;
    return {
      summary: body.extract,
      attribution: {
        source: 'Wikivoyage',
        url: body.content_urls?.desktop?.page,
        license: 'CC BY-SA 4.0',
      },
    };
  }
}
