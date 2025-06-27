import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { ProductCategory } from '@/entities/product-category.entity';

@InputType()
export class CreateProductCategoryInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Int)
  sort: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class UpdateProductCategoryInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Int, { nullable: true })
  sort?: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class ProductCategoryWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}

@ObjectType()
export class ProductCategoryPagination {
  @Field(() => [ProductCategory])
  data: ProductCategory[];

  @Field(() => Int)
  total: number;
}
