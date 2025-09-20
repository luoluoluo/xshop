import { InputType, Field, Int, ObjectType, Float } from '@nestjs/graphql';
import { View } from '@/entities/view.entity';

@InputType()
export class AnalyticsStatsWhereInput {
  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}

@ObjectType()
export class AnalyticsStats {
  @Field(() => Int)
  pv: number;

  @Field(() => Int)
  uv: number;

  @Field(() => Int)
  orderCount: number;

  @Field(() => Float)
  orderAmount: number;
}

@InputType()
export class ViewWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  productId?: string;

  @Field({ nullable: true })
  articleId?: string;

  @Field({ nullable: true })
  creatorId?: string;

  @Field({ nullable: true })
  ipAddress?: string;

  @Field({ nullable: true })
  pageType?: string;
}

@ObjectType()
export class ViewPagination {
  @Field(() => [View])
  data: View[];

  @Field(() => Int)
  total: number;
}
