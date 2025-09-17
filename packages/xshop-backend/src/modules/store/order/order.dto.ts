import { Order } from '@/entities/order.entity';
import { OrderStatus } from '@/types/order-status';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsInt,
} from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  productId: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  receiverName: string;

  @Field(() => String)
  @IsString()
  receiverPhone: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  affiliateId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  note?: string;

  @Field(() => Int)
  @IsInt()
  quantity: number;
}

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
  merchantId?: string;

  @Field(() => OrderStatus, { nullable: true })
  status?: OrderStatus;
}

@InputType()
export class CreateOrderPaymentInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  openId: string;
}
