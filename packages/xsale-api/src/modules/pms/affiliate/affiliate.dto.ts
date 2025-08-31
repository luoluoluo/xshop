import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { Affiliate } from '@/entities/affiliate.entity';
import { IsOptional, IsBoolean, IsArray } from 'class-validator';

@InputType()
export class CreateAffiliateInput {
  @Field()
  name: string;

  @Field()
  phone: string;
}

@InputType()
export class AffiliateWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;
}

@ObjectType()
export class AffiliatePagination {
  @Field(() => [Affiliate])
  data: Affiliate[];

  @Field(() => Int)
  total: number;
}
