import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { ProductCategory } from '@/entities/product-category.entity';

@InputType()
export class ProductCategoryWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  merchantId?: string;
}

@ObjectType()
export class ProductCategoryPagination {
  @Field(() => [ProductCategory])
  data: ProductCategory[];

  @Field(() => Int)
  total: number;
}
