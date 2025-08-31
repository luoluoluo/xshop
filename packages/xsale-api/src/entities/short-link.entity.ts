import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@ObjectType()
@Entity('short_link')
export class ShortLink extends Base {
  @Field()
  @Column({ name: 'url', type: 'text' })
  url: string;
}
