import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Money } from './money.model';

@ObjectType()
export class FlightSegment {
  @Field() from!: string;      // IATA code, e.g. "ATL"
  @Field() to!: string;
  @Field() departsAt!: string; // ISO date-time
  @Field() arrivesAt!: string;
  @Field() carrier!: string;
  @Field() flightNumber!: string;
}

@ObjectType()
export class FlightOffer {
  @Field(() => ID) id!: string;
  @Field(() => Money) price!: Money;
  @Field(() => [FlightSegment]) segments!: FlightSegment[];
  @Field(() => Int) stops!: number;
  @Field() isSample!: boolean; // Duffel test mode = "sample fares"
}
