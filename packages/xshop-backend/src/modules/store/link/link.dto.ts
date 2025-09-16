import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { Link } from '@/entities/link.entity';

@InputType()
export class CreateLinkInput {
  @Field({ nullable: true })
  friendId?: string;

  @Field({ nullable: true })
  logo?: string;

  @Field(() => Int, { nullable: true })
  sort?: number;

  @Field({ nullable: true })
  qrcode?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  url?: string;
}

@InputType()
export class UpdateLinkInput {
  @Field({ nullable: true })
  logo?: string;

  @Field(() => Int, { nullable: true })
  sort?: number;

  @Field({ nullable: true })
  qrcode?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  url?: string;
}

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
