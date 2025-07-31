import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { Product } from '@/entities/product.entity';
import { OrderBy } from '@/entities/base.entity';

@InputType()
export class ProductWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  merchantId?: string;
}

@InputType()
export class ProductOrderByInput {
  @Field({ nullable: true })
  id?: OrderBy;

  @Field({ nullable: true })
  price?: OrderBy;
}

@ObjectType()
export class ProductPagination {
  @Field(() => [Product])
  data: Product[];

  @Field(() => Int)
  total: number;
}
