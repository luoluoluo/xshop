import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { Affiliate } from '@/entities/affiliate.entity';
import { IsOptional, IsBoolean, IsArray } from 'class-validator';

@InputType()
export class CreateAffiliateInput {
  @Field()
  name: string;

  @Field()
  phone: string;

  @Field()
  password: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  bankName?: string;

  @Field({ nullable: true })
  @IsOptional()
  bankAccount?: string;

  @Field({ nullable: true })
  @IsOptional()
  accountName?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  merchantIds?: string[];
}

@InputType()
export class UpdateAffiliateInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  password?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  bankName?: string;

  @Field({ nullable: true })
  @IsOptional()
  bankAccount?: string;

  @Field({ nullable: true })
  @IsOptional()
  accountName?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  merchantIds?: string[];
}

@InputType()
export class AffiliateWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  affiliateId?: string;

  @Field({ nullable: true })
  merchantId?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@ObjectType()
export class AffiliatePagination {
  @Field(() => [Affiliate])
  data: Affiliate[];

  @Field(() => Int)
  total: number;
}
