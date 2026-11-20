import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Money {
  @Field() amount!: string;   // string avoids float rounding on prices
  @Field() currency!: string; // ISO code, e.g. "USD"
}
