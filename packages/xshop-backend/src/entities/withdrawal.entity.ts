import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType, Float } from '@nestjs/graphql';
import { Base } from './base.entity';
import { User } from './user.entity';
import { WithdrawalStatus } from '@/types/withdrawal-status';

@ObjectType()
@Entity('withdrawal')
export class Withdrawal extends Base {
  @Field(() => String, { nullable: true })
  @Column({ name: 'user_id' })
  userId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', precision: 10, scale: 2 })
  amount?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', precision: 10, scale: 2, name: 'tax_amount' })
  taxAmount?: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', precision: 10, scale: 2, name: 'after_tax_amount' })
  afterTaxAmount?: number;

  @Field(() => WithdrawalStatus, { nullable: true })
  @Column({
    type: 'enum',
    enum: WithdrawalStatus,
    default: WithdrawalStatus.CREATED,
  })
  status?: WithdrawalStatus;

  @Field({ nullable: true })
  @Column({ length: 50, name: 'bank_account_number' })
  bankAccountNumber?: string;

  @Field({ nullable: true })
  @Column({ length: 50, name: 'bank_account_name' })
  bankAccountName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  note?: string;

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
