import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsEnum } from 'class-validator';
import {
  MerchantWithdrawal,
  MerchantWithdrawalStatus,
} from '@/entities/merchant-withdrawal.entity';

@InputType()
export class MerchantWithdrawalWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  merchantId?: string;

  @Field(() => MerchantWithdrawalStatus, { nullable: true })
  @IsOptional()
  @IsEnum(MerchantWithdrawalStatus)
  status?: MerchantWithdrawalStatus;
}

@ObjectType()
export class MerchantWithdrawalPagination {
  @Field(() => [MerchantWithdrawal])
  data: MerchantWithdrawal[];

  @Field(() => Int)
  total: number;
}
