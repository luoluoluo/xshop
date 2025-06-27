import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import {
  AffiliateWithdrawal,
  AffiliateWithdrawalStatus,
} from '@/entities/affiliate-withdrawal.entity';
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
export class CreateAffiliateWithdrawalInput {
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
export class AffiliateWithdrawalWhereInput {
  @Field({ nullable: true })
  id?: string;

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
