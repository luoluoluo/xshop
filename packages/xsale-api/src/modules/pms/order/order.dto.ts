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

  @Field(() => OrderStatus, { nullable: true })
  status?: OrderStatus;
}
