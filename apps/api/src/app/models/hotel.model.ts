import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Attribution } from './attribution.model';
import { Money } from './money.model';

@ObjectType()
export class Hotel {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field({ nullable: true }) address?: string;
  @Field(() => Float) lat!: number;
  @Field(() => Float) lon!: number;
  @Field(() => Float, { nullable: true }) rating?: number;
  @Field(() => Money, { nullable: true }) price?: Money;
  @Field() isSample!: boolean; // true for Duffel test-mode data
  @Field(() => Attribution) attribution!: Attribution;
}
