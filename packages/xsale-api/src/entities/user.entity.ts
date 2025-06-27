import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';
import { Base } from './base.entity';
import { Client } from '@/decorators/client.decorator';

@Client(['cms'])
@ObjectType()
@Entity('user')
export class User extends Base {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  password?: string;

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
  roles: Role[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
