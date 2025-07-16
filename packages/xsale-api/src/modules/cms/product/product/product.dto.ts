import { ObjectType, Int, InputType, Field, Float } from '@nestjs/graphql';
import { Product, PosterQrcodeConfig } from '@/entities/product.entity';

@InputType()
export class CreateProductInput {
  @Field()
  merchantId: string;

  @Field()
  content: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  commissionRate?: number;

  @Field(() => Int)
  platformCommissionRate?: number;

  @Field(() => Int)
  merchantAffiliateCommissionRate?: number;

  @Field(() => Int)
  stock: number;

  @Field(() => Int)
  sort: number;

  @Field()
  title: string;

  @Field()
  image: string;

  @Field({ nullable: true })
  poster?: string;

  @Field(() => PosterQrcodeConfig, { nullable: true })
  posterQrcodeConfig?: PosterQrcodeConfig;

  @Field({ nullable: true })
  description?: string;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  merchantId?: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: number;

  @Field(() => Int)
  commissionRate?: number;

  @Field(() => Int)
  platformCommissionRate?: number;

  @Field(() => Int)
  merchantAffiliateCommissionRate?: number;

  @Field(() => Int, { nullable: true })
  stock?: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => Int)
  sort: number;

  @Field()
  title: string;

  @Field()
  image: string;

  @Field({ nullable: true })
  poster?: string;

  @Field(() => PosterQrcodeConfig, { nullable: true })
  posterQrcodeConfig?: PosterQrcodeConfig;
}

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
