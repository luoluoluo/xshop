import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { Order, OrderStatus } from '@/entities/order.entity';

@ObjectType()
export class OrderPagination {
  @Field(() => [Order])
  data: Order[];

  @Field(() => Int)
  total: number;
}

@InputType()
export class OrderWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  productId?: string;

  @Field({ nullable: true })
  merchantId?: string;

  @Field({ nullable: true })
  affiliateId?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field(() => OrderStatus, { nullable: true })
  status?: OrderStatus;

  @Field(() => Date, { nullable: true })
  createdAtStart?: Date;

  @Field(() => Date, { nullable: true })
  createdAtEnd?: Date;
}
