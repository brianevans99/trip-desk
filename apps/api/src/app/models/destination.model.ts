import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Attribution } from './attribution.model';
import { Photo } from './photo.model';
import { Place } from './place.model';

@ObjectType({ description: 'A place people travel to' })
export class Destination {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field() country!: string;
  @Field({ nullable: true }) airportCode?: string;
  @Field({ nullable: true }) summary?: string;
  @Field(() => [Photo]) photos!: Photo[];
  @Field(() => [Place], { nullable: true }) places?: Place[];
  @Field(() => Attribution, { nullable: true })
  summaryAttribution?: Attribution;
}
