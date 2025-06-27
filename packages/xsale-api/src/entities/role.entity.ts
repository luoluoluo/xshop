import { Entity, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from './base.entity';
import { Client } from '@/decorators/client.decorator';

@ObjectType()
@Client('cms')
@Entity('role')
export class Role extends Base {
  @Field({ nullable: true })
  @Column({ length: 50, unique: true })
  name: string;

  @Field(() => [String], { nullable: true })
  @Column('simple-array')
  permissions: string[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
