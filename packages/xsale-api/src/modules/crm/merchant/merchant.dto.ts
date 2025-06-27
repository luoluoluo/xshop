import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { Merchant } from '@/entities/merchant.entity';

@InputType()
export class MerchantWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;
}

@ObjectType()
export class MerchantPagination {
  @Field(() => [Merchant])
  data: Merchant[];

  @Field(() => Int)
  total: number;
}
