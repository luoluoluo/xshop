import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { Affiliate } from '@/entities/affiliate.entity';
import { IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateAffiliateInput {
  @Field()
  name: string;

  @Field()
  phone: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field()
  password: string;
}

@InputType()
export class UpdateAffiliateInput {
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  phone?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  password?: string;
}

@InputType()
export class AffiliateWhereInput {
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
export class AffiliatePagination {
  @Field(() => [Affiliate])
  data: Affiliate[];

  @Field(() => Int)
  total: number;
}
