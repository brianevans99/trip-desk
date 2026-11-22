import { Args, Mutation, Query, ResolveField, Parent, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { Itinerary, ItineraryItem } from '../models/itinerary.model';
import { AddItemInput, CreateItineraryInput } from '../inputs/itinerary.inputs';

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
  items(@Parent() itinerary: Itinerary) {
    console.log(`[query] items for ${itinerary.id}`);
    return this.prisma.itineraryItem.findMany({
      where: { itineraryId: itinerary.id },
      orderBy: { position: 'asc' },
    });
  }
}
