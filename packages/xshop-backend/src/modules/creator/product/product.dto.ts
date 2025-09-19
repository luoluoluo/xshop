import { ObjectType, Int, InputType, Field, Float } from '@nestjs/graphql';
import { Product } from '@/entities/product.entity';

@InputType()
export class CreateProductInput {
  @Field(() => [String])
  images: string[];

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  commission: number;

  @Field(() => Int)
  stock: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  sort?: number;

  @Field({ nullable: true })
  slug?: string;
}

@InputType()
export class UpdateProductInput {
  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;

  @Field(() => Float, { nullable: true })
  commission?: number;

  @Field(() => Int, { nullable: true })
  stock?: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  sort?: number;

  @Field({ nullable: true })
  slug?: string;
}

@InputType()
export class ProductWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  userId?: string;
}

@ObjectType()
export class ProductPagination {
  @Field(() => [Product])
  data: Product[];

  @Field(() => Int)
  total: number;
}
