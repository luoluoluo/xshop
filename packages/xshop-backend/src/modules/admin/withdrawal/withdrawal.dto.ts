import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsEnum } from 'class-validator';
import { Withdrawal } from '@/entities/withdrawal.entity';
import { WithdrawalStatus } from '@/types/withdrawal-status';

@InputType()
export class WithdrawalWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field(() => WithdrawalStatus, { nullable: true })
  @IsOptional()
  @IsEnum(WithdrawalStatus)
  status?: WithdrawalStatus;
}

@ObjectType()
export class WithdrawalPagination {
  @Field(() => [Withdrawal])
  data: Withdrawal[];

  @Field(() => Int)
  total: number;
}
