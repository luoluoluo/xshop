import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignedFileUrl {
  @Field()
  uploadUrl: string;
  @Field()
  downloadUrl: string;
}
