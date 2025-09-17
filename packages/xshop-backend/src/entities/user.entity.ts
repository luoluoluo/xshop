import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { Base } from './base.entity';
import { Client } from '@/decorators/client.decorator';
import { WechatMerchantStatus } from '@/types/wechat-merchant-status';
import { Link } from './link.entity';
import { Product } from './product.entity';
import { ClientType } from '@/types/client';

@ObjectType()
@Entity('user')
export class User extends Base {
  constructor() {
    super();
    if (!this.slug) {
      this.slug = this.id;
    }
  }
  @Field({ nullable: true })
  @Column({ name: 'slug', unique: true })
  slug?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ name: 'avatar', nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  @Column({ name: 'background_image', nullable: true })
  backgroundImage?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'wechat_id', nullable: true })
  wechatId?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'title', nullable: true })
  title?: string;

  // 介绍
  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'wechat_open_id', nullable: true })
  wechatOpenId?: string;

  @Client([ClientType.ADMIN, ClientType.CREATOR])
  @Field(() => Float, { nullable: true })
  @Column({
    name: 'balance',
    nullable: true,
    type: 'float',
    default: 0,
    precision: 10,
    scale: 2,
  })
  balance?: number;

  @Client([ClientType.ADMIN, ClientType.CREATOR])
  @Field(() => String, { nullable: true })
  @Column({ name: 'wechat_merchant_id', nullable: true })
  wechatMerchantId?: string;

  @Client([ClientType.ADMIN, ClientType.CREATOR])
  @Field(() => String, { nullable: true })
  @Column({ name: 'bank_account_number', nullable: true })
  bankAccountNumber?: string;

  @Client([ClientType.ADMIN, ClientType.CREATOR])
  @Field(() => String, { nullable: true })
  @Column({ name: 'bank_account_name', nullable: true })
  bankAccountName?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'business_license_photo', nullable: true })
  businessLicensePhoto?: string;

  @Client([ClientType.ADMIN, ClientType.CREATOR])
  @Field(() => String, { nullable: true })
  @Column({ name: 'id_card_front_photo', nullable: true })
  idCardFrontPhoto?: string;

  @Client([ClientType.ADMIN, ClientType.CREATOR])
  @Field(() => String, { nullable: true })
  @Column({ name: 'id_card_back_photo', nullable: true })
  idCardBackPhoto?: string;

  @Client([ClientType.ADMIN, ClientType.CREATOR])
  @Field(() => WechatMerchantStatus, { nullable: true })
  @Column({
    name: 'wechat_merchant_status',
    nullable: true,
  })
  wechatMerchantStatus?: WechatMerchantStatus;

  @Client([ClientType.ADMIN])
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive?: boolean;

  @Client([ClientType.ADMIN])
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ name: 'is_admin', default: false })
  isAdmin?: boolean;

  @Client([ClientType.ADMIN])
  @Field(() => [Role], { nullable: true })
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_role', // 指定中间表名称
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles?: Role[];

  @Field(() => [Link], { nullable: true })
  @OneToMany(() => Link, (link) => link.user)
  links?: Link[];

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.user)
  products?: Product[];
}
