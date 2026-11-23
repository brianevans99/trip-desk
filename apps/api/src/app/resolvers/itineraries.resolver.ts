import {Args, Mutation, Query, ResolveField, Parent, Resolver, Context, ID} from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Itinerary, ItineraryItem } from '../models/itinerary.model';
import { AddItemInput, CreateItineraryInput } from '../inputs/itinerary.inputs';
import type { Loaders } from "../loaders/loaders";

function requireUser(userId: string | null) {
  if (!userId) throw new UnauthorizedException('Sign in to manage itineraries');
  return userId;
}

@Resolver(() => Itinerary)
export class ItinerariesResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [Itinerary])
  itineraries(@Context('userId') userId: string | null) {
    return this.prisma.itinerary.findMany({
      where: { ownerId: requireUser(userId) },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Mutation(() => Itinerary)
  createItinerary(@Args('input') input: CreateItineraryInput, @Context('userId') userId: string | null) {
    return this.prisma.itinerary.create({
      data: { name: input.name, ownerId: requireUser(userId) },
    });
  }

  @Mutation(() => ItineraryItem)
  async addItineraryItem(@Args('input') input: AddItemInput, @Context('userId') userId: string | null) {
    const owned = await this.prisma.itinerary.findFirst({
      where: { id: input.itineraryId, ownerId: requireUser(userId) },
    });
    if (!owned) throw new UnauthorizedException();
    const position = await this.prisma.itineraryItem.count({
      where: { itineraryId: input.itineraryId },
    });
    return this.prisma.itineraryItem.create({ data: { ...input, position } });
  }

  // Batched per request by DataLoader.
  @ResolveField(() => [ItineraryItem])
  items(@Parent() itinerary: Itinerary, @Context('loaders') loaders: Loaders) {
    return loaders.itemsByItinerary.load(itinerary.id);
  }

  @Mutation(() => Boolean)
  async removeItineraryItem(@Args('id', { type: () => ID }) id: string, @Context('userId') userId: string | null) {
    const item = await this.prisma.itineraryItem.findFirst({
      where: { id, itinerary: { ownerId: requireUser(userId) } },
    });
    if (!item) return false; // not found, or not yours; the caller can't tell which

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
