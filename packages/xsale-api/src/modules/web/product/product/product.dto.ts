import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { Product } from '@/entities/product.entity';

@InputType()
export class ProductWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  merchantId?: string;
}

@ObjectType()
export class ProductPagination {
  @Field(() => [Product])
  data: Product[];

  @Field(() => Int)
  total: number;
}
