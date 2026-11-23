import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Destination } from '../models/destination.model';
import { WikivoyageService } from '../providers/wikivoyage.service';
import { Attribution } from '../models/attribution.model';
import { UnsplashService } from '../providers/unsplash.service';
import { Photo } from '../models/photo.model';
import { GeoapifyService } from '../providers/geoapify.service';
import { Place } from '../models/place.model';
import { DESTINATIONS } from '../data/destinations';

@Resolver(() => Destination)
export class DestinationsResolver {
  constructor(
    private wikivoyageService: WikivoyageService,
    private unsplashService: UnsplashService,
    private readonly geoapifyService: GeoapifyService,
  ) {}
  @Query(() => [Destination])
  destinations(): Destination[] {
    return DESTINATIONS;
  }

  @Query(() => Destination, { nullable: true })
  destination(@Args('id', { type: () => ID }) id: string): Destination | null {
    return DESTINATIONS.find((d) => d.id === id) ?? null;
  }

  @ResolveField(() => String, { nullable: true })
  async summary(@Parent() d: Destination): Promise<string | null> {
    return (
      (await this.wikivoyageService.getSummary(d.name))?.summary ??
      d.summary ??
      null
    );
  }

  @ResolveField(() => Attribution, { nullable: true })
  async summaryAttribution(
    @Parent() d: Destination,
  ): Promise<Attribution | null> {
    return (
      (await this.wikivoyageService.getSummary(d.name))?.attribution ?? null
    );
  }

  @ResolveField(() => [Photo])
  async photos(@Parent() d: Destination): Promise<Photo[]> {
    return this.unsplashService.getPhotos(d.name);
  }

  @ResolveField(() => [Place])
  async places(@Parent() d: Destination): Promise<Place[]> {
    return this.geoapifyService.getPlaces(d.name, d.country);
  }
}
