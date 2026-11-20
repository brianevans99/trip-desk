import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'A place people travel to' })
export class Destination {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field() country!: string;
  @Field({ nullable: true }) summary?: string;
}
