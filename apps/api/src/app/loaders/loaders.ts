import DataLoader from 'dataloader';
import { PrismaService } from '../prisma/prisma.service';

export function createLoaders(prisma: PrismaService) {
  return {
    itemsByItinerary: new DataLoader(async (itineraryIds: readonly string[]) => {
      console.log(`[query] items for ${itineraryIds.length} itineraries (batched)`);
      const items = await prisma.itineraryItem.findMany({
        where: { itineraryId: { in: [...itineraryIds] } },
        orderBy: { position: 'asc' },
      });
      // DataLoader needs results in the same order as the ids it was given.
      return itineraryIds.map((id) => items.filter((i) => i.itineraryId === id));
    }),
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
