import {Args, Mutation, Query, ResolveField, Parent, Resolver, Context, ID} from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { Itinerary, ItineraryItem } from '../models/itinerary.model';
import { AddItemInput, CreateItineraryInput } from '../inputs/itinerary.inputs';
import type { Loaders } from "../loaders/loaders";

// Temporary until OAuth: everything belongs to one demo user.
const DEMO_USER = 'demo-user';

@Resolver(() => Itinerary)
export class ItinerariesResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [Itinerary])
  itineraries() {
    return this.prisma.itinerary.findMany({
      where: { ownerId: DEMO_USER },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Mutation(() => Itinerary)
  createItinerary(@Args('input') input: CreateItineraryInput) {
    return this.prisma.itinerary.create({
      data: { name: input.name, ownerId: DEMO_USER },
    });
  }

  @Mutation(() => ItineraryItem)
  async addItineraryItem(@Args('input') input: AddItemInput) {
    const position = await this.prisma.itineraryItem.count({
      where: { itineraryId: input.itineraryId },
    });
    return this.prisma.itineraryItem.create({ data: { ...input, position } });
  }

  // Runs once per itinerary: this is the N+1 we'll fix with DataLoader.
  @ResolveField(() => [ItineraryItem])
  items(@Parent() itinerary: Itinerary, @Context('loaders') loaders: Loaders) {
    return loaders.itemsByItinerary.load(itinerary.id);
  }

  @Mutation(() => Boolean)
  async removeItineraryItem(@Args('id', { type: () => ID }) id: string) {
    const item = await this.prisma.itineraryItem.findUnique({ where: { id } });
    if (!item) return false;

    await this.prisma.$transaction([
      this.prisma.itineraryItem.delete({ where: { id } }),
      // Close the gap so positions stay 0, 1, 2…
      this.prisma.itineraryItem.updateMany({
        where: { itineraryId: item.itineraryId, position: { gt: item.position } },
        data: { position: { decrement: 1 } },
      }),
    ]);
    return true;
  }
}
