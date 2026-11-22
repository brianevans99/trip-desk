import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateItineraryInput {
  @Field() name!: string;
}

@InputType()
export class AddItemInput {
  @Field(() => ID) itineraryId!: string;
  @Field() destinationId!: string;
  @Field({ nullable: true }) placeId?: string;
  @Field({ nullable: true }) note?: string;
}
