import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { Banner } from '@/entities/banner.entity';

@ObjectType()
export class BannerPagination {
  @Field(() => [Banner])
  data: Banner[];

  @Field(() => Int)
  total: number;
}

@InputType()
export class CreateBannerInput {
  @Field()
  merchantId: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  image: string;

  @Field(() => Int)
  sort: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  link?: string;
}

@InputType()
export class UpdateBannerInput {
  @Field({ nullable: true })
  merchantId?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Int, { nullable: true })
  sort?: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  link?: string;
}

@InputType()
export class BannerWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  merchantId?: string;
}
