import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { snowflakeGenerator } from '@/core/snowflake';

@ObjectType()
export class Base {
  @Field()
  @Column({
    primary: true,
    type: 'varchar',
    length: 12, // 36进制 Snowflake ID 长度约为6-12位
    generated: false,
  })
  id: string;

  constructor() {
    if (!this.id) {
      this.id = snowflakeGenerator.nextId();
    }
  }

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
