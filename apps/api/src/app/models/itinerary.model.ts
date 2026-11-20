import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Destination } from './destination.model';
import { Hotel } from './hotel.model';
import { Place } from './place.model';
import { FlightOffer } from './flight-offer.model';

@ObjectType()
export class Itinerary {
  @Field(() => ID) id!: string;
  @Field() title!: string;
  @Field(() => Destination) destination!: Destination;
  @Field({ nullable: true }) startDate?: string;
  @Field({ nullable: true }) endDate?: string;
  @Field(() => [Hotel]) hotels!: Hotel[];
  @Field(() => [Place]) places!: Place[];
  @Field(() => [FlightOffer]) flights!: FlightOffer[];
}
