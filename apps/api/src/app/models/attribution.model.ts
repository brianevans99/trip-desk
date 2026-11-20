import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Attribution {
  @Field() source!: string;        // e.g. "Unsplash"
  @Field({ nullable: true }) author?: string;
  @Field({ nullable: true }) url?: string;
  @Field({ nullable: true }) license?: string; // e.g. "CC BY-SA 4.0"
}
