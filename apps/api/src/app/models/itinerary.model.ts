import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ItineraryItem {
  @Field(() => ID) id!: string;
  @Field() destinationId!: string;
  @Field({ nullable: true }) placeId?: string;
  @Field({ nullable: true }) note?: string;
  @Field(() => Int) position!: number;
}

@ObjectType()
export class Itinerary {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field(() => String, { nullable: true }) startDate?: string | null;
  @Field(() => String, { nullable: true }) endDate?: string | null;
  @Field() createdAt!: Date;
  @Field(() => [ItineraryItem]) items!: ItineraryItem[];
}
