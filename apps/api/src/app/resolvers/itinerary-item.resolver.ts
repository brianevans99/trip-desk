import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ItineraryItem } from '../models/itinerary.model';
import { Destination } from '../models/destination.model';
import { DESTINATIONS } from '../data/destinations'; // adjust to where your sample array lives

@Resolver(() => ItineraryItem)
export class ItineraryItemResolver {
  @ResolveField(() => Destination, { nullable: true })
  destination(@Parent() item: ItineraryItem) {
    return DESTINATIONS.find((d) => d.id === item.destinationId) ?? null;
  }
}
