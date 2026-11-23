import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID) id!: string;
  @Field() login!: string;
  @Field({ nullable: true }) avatarUrl?: string;
}
