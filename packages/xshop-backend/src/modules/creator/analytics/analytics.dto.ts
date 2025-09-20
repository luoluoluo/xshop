import { InputType, Field, Int, ObjectType, Float } from '@nestjs/graphql';

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
