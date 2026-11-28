import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ServeStaticModule } from '@nestjs/serve-static';
import type { Request } from 'express';
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
import { ItineraryItemResolver } from './resolvers/itinerary-item.resolver';
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'
import { MeResolver } from './resolvers/me.resolver'

@Module({
  imports: [
    ...(process.env.NODE_ENV === 'production'
      ? [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', '..', 'web', 'dist'),
          exclude: ['/api/{*path}', '/graphql'],
        }),
      ]
      : []),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [PrismaService],
      useFactory: (prismaService: PrismaService) => ({
        autoSchemaFile: join(process.cwd(), 'apps/api/schema.graphql'),
        sortSchema: true,
        graphiql: true,
        context: ({ req } : { req: Request }) => ({
          loaders: createLoaders(prismaService),
          userId: (req.signedCookies?.session as string | undefined) ?? null
        })
      }),
    }),
    PrismaModule
  ],
  controllers: [AppController,AuthController],
  providers: [
    AppService,
    AuthService,
    MeResolver,
    DestinationsResolver,
    WikivoyageService,
    UnsplashService,
    GeoapifyService,
    DuffelService,
    FlightsResolver,
    ItinerariesResolver,
    ItineraryItemResolver
  ],
})
export class AppModule {

}
