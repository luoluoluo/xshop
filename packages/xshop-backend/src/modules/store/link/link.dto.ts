import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { Link } from '@/entities/link.entity';

@InputType()
export class LinkWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  name?: string;
}

@ObjectType()
export class LinkPagination {
  @Field(() => [Link])
  data: Link[];

  @Field(() => Int)
  total: number;
}
