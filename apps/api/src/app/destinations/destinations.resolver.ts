import {Args, ID, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import { Destination } from './destination.model';
import { WikivoyageService } from '../providers/wikivoyage.service'
import { Attribution } from "../models/attribution.model";
import { UnsplashService } from "../providers/unsplash.service";
import { Photo } from "../models/photo.model";

const SAMPLE: Destination[] = [
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', summary: 'Hills, trams and pastéis de nata.', photos: [] },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', summary: 'Temples, gardens and old streets.', photos: [] },
  { id: 'toronto', name: 'Toronto', country: 'Canada', summary: 'Canadian history.', photos: [] }
];

@Resolver(() => Destination)
export class DestinationsResolver {
  constructor(
    private wikivoyageService: WikivoyageService,
    private unsplashService: UnsplashService
  ) {}
  @Query(() => [Destination])
  destinations(): Destination[] {
    return SAMPLE;
  }

  @Query(() => Destination, { nullable: true })
  destination(@Args('id', { type: () => ID }) id: string): Destination | undefined {
    return SAMPLE.find((d) => d.id === id);
  }

  @ResolveField(() => String, { nullable: true })
  async summary(@Parent() d: Destination): Promise<string | null> {
    return (await this.wikivoyageService.getSummary(d.name))?.summary ?? d.summary ?? null;
  }

  @ResolveField(() => Attribution, { nullable: true })
  async summaryAttribution(@Parent() d: Destination): Promise<Attribution | null> {
    return (await this.wikivoyageService.getSummary(d.name))?.attribution ?? null;
  }

  @ResolveField(() => [Photo])
  async photos(@Parent() d: Destination): Promise<Photo[]> {
    return this.unsplashService.getPhotos(d.name);
  }
}
