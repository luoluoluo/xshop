import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsEnum } from 'class-validator';
import {
  AffiliateWithdrawal,
  AffiliateWithdrawalStatus,
} from '@/entities/affiliate-withdrawal.entity';

@InputType()
export class AffiliateWithdrawalWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  affiliateId?: string;

  @Field(() => AffiliateWithdrawalStatus, { nullable: true })
  @IsOptional()
  @IsEnum(AffiliateWithdrawalStatus)
  status?: AffiliateWithdrawalStatus;
}

@ObjectType()
export class AffiliateWithdrawalPagination {
  @Field(() => [AffiliateWithdrawal])
  data: AffiliateWithdrawal[];

  @Field(() => Int)
  total: number;
}
