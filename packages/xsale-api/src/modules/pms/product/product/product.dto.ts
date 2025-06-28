import { ObjectType, Int, InputType, Field, Float } from '@nestjs/graphql';
import { Product } from '@/entities/product.entity';

@InputType()
export class CreateProductInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  image: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  commission: number;

  @Field(() => Int)
  stock: number;

  @Field(() => Int)
  sort: number;

  @Field(() => [ProductAttributeInput], { nullable: true })
  attributes?: ProductAttributeInput[];
}

@InputType()
class ProductAttributeInput {
  @Field()
  name: string;

  @Field(() => [String])
  values: string[];

  @Field(() => Int)
  sort: number;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  title?: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => Float, { nullable: true })
  commission?: number;

  @Field(() => Int, { nullable: true })
  stock?: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => Int)
  sort: number;

  @Field(() => [ProductAttributeInput], { nullable: true })
  attributes?: ProductAttributeInput[];
}

@InputType()
export class ProductWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  categoryId?: string;

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
