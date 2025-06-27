import { Order, OrderStatus } from '@/entities/order.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsInt,
  Min,
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

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  note?: string;
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
export class RefundOrderInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  reason?: string;
}
