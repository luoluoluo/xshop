import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { Banner } from '@/entities/banner.entity';

@ObjectType()
export class BannerPagination {
  @Field(() => [Banner])
  data: Banner[];

  @Field(() => Int)
  total: number;
}

@InputType()
export class BannerWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  merchantId?: string;
}
