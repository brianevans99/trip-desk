import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Attribution } from './attribution.model';

@ObjectType()
export class Place {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field({ nullable: true }) category?: string;
  @Field(() => Float) lat!: number;
  @Field(() => Float) lon!: number;
  @Field(() => Attribution) attribution!: Attribution;
}
