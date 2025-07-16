import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { Merchant } from '@/entities/merchant.entity';
import { IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateMerchantInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  logo: string;

  @Field()
  address: string;

  @Field()
  phone: string;

  @Field()
  affiliateId: string;

  @Field()
  password: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  businessScope?: string;

  @Field({ nullable: true })
  wechatQrcode?: string;

  @Field({ nullable: true })
  bankName?: string;

  @Field({ nullable: true })
  bankAccount?: string;

  @Field({ nullable: true })
  accountName?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  images?: string[];
}

@InputType()
export class UpdateMerchantInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  logo?: string;

  @Field({ nullable: true })
  @IsOptional()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  affiliateId?: string;

  @Field({ nullable: true })
  @IsOptional()
  password?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  businessScope?: string;

  @Field({ nullable: true })
  wechatQrcode?: string;

  @Field({ nullable: true })
  bankName?: string;

  @Field({ nullable: true })
  bankAccount?: string;

  @Field({ nullable: true })
  accountName?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  images?: string[];
}

@InputType()
export class MerchantWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  affiliateId?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@ObjectType()
export class MerchantPagination {
  @Field(() => [Merchant])
  data: Merchant[];

  @Field(() => Int)
  total: number;
}
