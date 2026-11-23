import { Context, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../models/user.model';

@Resolver(() => User)
export class MeResolver {
  constructor(private readonly prisma: PrismaService) {}

  // Returns null when signed out, so the UI can just check for a user
  @Query(() => User, { nullable: true })
  me(@Context('userId') userId: string | null) {
    if (!userId) return null;
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
