import { Injectable, Logger } from '@nestjs/common';
import { FlightOffer } from '../models/flight-offer.model';

@Injectable()
export class DuffelService {
  private readonly logger = new Logger(DuffelService.name);
  private readonly cache = new Map<string, { value: FlightOffer[]; expires: number }>();
  private readonly ttlMs = 10 * 60 * 1000; // fares change fast: 10 minutes

  async searchOffers(origin: string, destination: string, date: string, limit = 5): Promise<FlightOffer[]> {
    const key = `${origin}:${destination}:${date}:${limit}`.toUpperCase();
    const hit = this.cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;

    const token = process.env.DUFFEL_ACCESS_TOKEN;
    if (!token) {
      this.logger.warn('DUFFEL_ACCESS_TOKEN is not set');
      return [];
    }

    const res = await fetch('https://api.duffel.com/air/offer_requests?return_offers=true', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Duffel-Version': 'v2',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        data: {
          slices: [{ origin, destination, departure_date: date }],
          passengers: [{ type: 'adult' }],
          cabin_class: 'economy',
        },
      }),
    });
    if (!res.ok) {
      this.logger.warn(`Duffel ${res.status}: ${await res.text()}`);
      return [];
    }
    const body = (await res.json()) as { data: { offers: any[] } };
    const value: FlightOffer[] = body.data.offers.slice(0, limit).map((o) => {
      const segments = o.slices[0].segments;
      return {
        id: o.id,
        airline: o.owner.name,
        price: { amount: o.total_amount, currency: o.total_currency },
        stops: segments.length - 1,
        isSample: true,
        segments: segments.map((s: any) => ({
          from: s.origin.iata_code,
          to: s.destination.iata_code,
          departsAt: s.departing_at,
          arrivesAt: s.arriving_at,
          carrier: s.marketing_carrier.name,
          flightNumber: `${s.marketing_carrier.iata_code}${s.marketing_carrier_flight_number}`,
        })),
      };
    });
    this.cache.set(key, { value, expires: Date.now() + this.ttlMs });
    return value;
  }
}
