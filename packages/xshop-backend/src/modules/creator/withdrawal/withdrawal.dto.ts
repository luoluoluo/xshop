import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { Withdrawal } from '@/entities/withdrawal.entity';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';
import { WithdrawalStatus } from '@/types/withdrawal-status';

@InputType()
export class CreateWithdrawalInput {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  bankAccountNumber: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  bankAccountName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  note?: string;
}

@InputType()
export class WithdrawalWhereInput {
  @Field({ nullable: true })
  id?: string;

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
