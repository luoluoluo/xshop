import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class TrackViewInput {
  @Field({ nullable: true })
  userId?: string;

  @Field()
  pageUrl: string;
}
