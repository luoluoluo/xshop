import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { Order } from '@/entities/order.entity';
import { OrderStatus } from '@/types/order-status';

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
