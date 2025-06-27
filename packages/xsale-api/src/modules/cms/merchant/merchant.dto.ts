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

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field()
  password: string;
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

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  password?: string;
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
