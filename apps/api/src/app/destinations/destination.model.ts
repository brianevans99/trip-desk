import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Attribution } from '../models/attribution.model'
import { Photo } from '../models/photo.model'

@ObjectType({ description: 'A place people travel to' })
export class Destination {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field() country!: string;
  @Field({ nullable: true }) summary?: string;
  @Field(() => [Photo]) photos!: Photo[];
  @Field(() => Attribution, { nullable: true }) summaryAttribution?: Attribution;
}
