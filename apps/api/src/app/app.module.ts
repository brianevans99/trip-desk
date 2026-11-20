import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DestinationsResolver } from './destinations/destinations.resolver';
import {WikivoyageService} from "./providers/wikivoyage.service";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/api/schema.graphql'),
      sortSchema: true,
      graphiql: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DestinationsResolver,WikivoyageService],
})
export class AppModule {}
