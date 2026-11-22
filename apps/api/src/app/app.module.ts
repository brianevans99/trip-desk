import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path'
import { DestinationsResolver } from './resolvers/destinations.resolver';
import { WikivoyageService } from './providers/wikivoyage.service';
import { UnsplashService } from './providers/unsplash.service';
import { GeoapifyService } from './providers/geoapify.service';
import { DuffelService } from './providers/duffel.service';
import { FlightsResolver } from './resolvers/flights.resolver';
import { PrismaModule } from './prisma/prisma.module'
import { ItinerariesResolver } from './resolvers/itineraries.resolver'
import { PrismaService } from "./prisma/prisma.service";
import { createLoaders } from "./loaders/loaders";


@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [PrismaService],
      useFactory: (prismaService: PrismaService) => ({
        autoSchemaFile: join(process.cwd(), 'apps/api/schema.graphql'),
        sortSchema: true,
        graphiql: true,
        context: () => ({ loaders: createLoaders(prismaService) })
      })
    }),
    PrismaModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DestinationsResolver,
    WikivoyageService,
    UnsplashService,
    GeoapifyService,
    DuffelService,
    FlightsResolver,
    ItinerariesResolver
  ],
})
export class AppModule {}
