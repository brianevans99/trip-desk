import { Args, Query, Resolver } from '@nestjs/graphql';
import { FlightOffer } from '../models/flight-offer.model';
import { DuffelService } from '../providers/duffel.service';

@Resolver(() => FlightOffer)
export class FlightsResolver {
  constructor(private readonly duffel: DuffelService) {}

  @Query(() => [FlightOffer])
  flightOffers(
    @Args('origin') origin: string,
    @Args('destination') destination: string,
    @Args('date') date: string,
  ): Promise<FlightOffer[]> {
    return this.duffel.searchOffers(origin, destination, date);
  }
}
