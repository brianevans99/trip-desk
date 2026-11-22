import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DestinationsResolver } from './resolvers/destinations.resolver';
import { WikivoyageService } from './providers/wikivoyage.service';
import { UnsplashService } from './providers/unsplash.service';
import { GeoapifyService } from './providers/geoapify.service';
import { DuffelService } from './providers/duffel.service';
import { FlightsResolver } from './resolvers/flights.resolver';
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/api/schema.graphql'),
      sortSchema: true,
      graphiql: true,
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
    FlightsResolver
  ],
})
export class AppModule {}
