import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Permission {
  @Field()
  resource: string;
  @Field()
  action: string;
  @Field()
  value: string;
}
