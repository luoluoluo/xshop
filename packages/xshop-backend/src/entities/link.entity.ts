import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@ObjectType()
@Entity('link')
export class Link extends Base {
  @Field(() => String, { nullable: true })
  @Column({ name: 'user_id' })
  userId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Field(() => String, { nullable: true })
  @Column({ name: 'logo', nullable: true })
  logo?: string;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'sort', default: 0 })
  sort?: number;

  @Field(() => String, { nullable: true })
  @Column({ name: 'qrcode', nullable: true })
  qrcode?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'name', nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'url', type: 'text', nullable: true })
  url?: string;
}
