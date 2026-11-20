import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { Destination } from './destination.model';

const SAMPLE: Destination[] = [
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', summary: 'Hills, trams and pastéis de nata.' },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', summary: 'Temples, gardens and old streets.' },
];

@Resolver(() => Destination)
export class DestinationsResolver {
  @Query(() => [Destination])
  destinations(): Destination[] {
    return SAMPLE;
  }

  @Query(() => Destination, { nullable: true })
  destination(@Args('id', { type: () => ID }) id: string): Destination | undefined {
    return SAMPLE.find((d) => d.id === id);
  }
}
