import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import {
  MerchantWithdrawal,
  MerchantWithdrawalStatus,
} from '@/entities/merchant-withdrawal.entity';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';

@InputType()
export class CreateMerchantWithdrawalInput {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  bankName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  bankAccount: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  accountName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  note?: string;
}

@InputType()
export class MerchantWithdrawalWhereInput {
  @Field({ nullable: true })
  id?: string;

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
