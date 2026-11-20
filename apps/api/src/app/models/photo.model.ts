import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Attribution } from './attribution.model';

@ObjectType()
export class Photo {
  @Field() url!: string;
  @Field({ nullable: true }) alt?: string;
  @Field(() => Int, { nullable: true }) width?: number;
  @Field(() => Int, { nullable: true }) height?: number;
  @Field(() => Attribution) attribution!: Attribution;
}
