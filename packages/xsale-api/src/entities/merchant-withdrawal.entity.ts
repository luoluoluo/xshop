import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType, Float, registerEnumType } from '@nestjs/graphql';
import { Base } from './base.entity';
import { Merchant } from './merchant.entity';

export enum MerchantWithdrawalStatus {
  CREATED = 'created',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

registerEnumType(MerchantWithdrawalStatus, {
  name: 'MerchantWithdrawalStatus',
});

@ObjectType()
@Entity('merchant_withdrawal')
export class MerchantWithdrawal extends Base {
  @Field(() => String)
  @Column({ name: 'merchant_id' })
  merchantId: string;

  @Field(() => Merchant)
  @ManyToOne(() => Merchant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Field(() => MerchantWithdrawalStatus)
  @Column({
    type: 'enum',
    enum: MerchantWithdrawalStatus,
    default: MerchantWithdrawalStatus.CREATED,
  })
  status: MerchantWithdrawalStatus;

  @Field()
  @Column({ length: 100 })
  bankName: string;

  @Field()
  @Column({ length: 50 })
  bankAccount: string;

  @Field()
  @Column({ length: 50 })
  accountName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  note?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  rejectReason?: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'datetime', nullable: true, name: 'approved_at' })
  approvedAt?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'datetime', nullable: true, name: 'rejected_at' })
  rejectedAt?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'datetime', nullable: true, name: 'completed_at' })
  completedAt?: Date;
}
