import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType, Float, registerEnumType } from '@nestjs/graphql';
import { Base } from './base.entity';
import { Affiliate } from './affiliate.entity';

export enum AffiliateWithdrawalStatus {
  CREATED = 'created',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

registerEnumType(AffiliateWithdrawalStatus, {
  name: 'AffiliateWithdrawalStatus',
});

@ObjectType()
@Entity('affiliate_withdrawal')
export class AffiliateWithdrawal extends Base {
  @Field(() => String)
  @Column({ name: 'affiliate_id' })
  affiliateId: string;

  @Field(() => Affiliate)
  @ManyToOne(() => Affiliate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Field(() => AffiliateWithdrawalStatus)
  @Column({
    type: 'enum',
    enum: AffiliateWithdrawalStatus,
    default: AffiliateWithdrawalStatus.CREATED,
  })
  status: AffiliateWithdrawalStatus;

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
