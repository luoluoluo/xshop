import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { User } from '@/entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => [String], { nullable: true })
  roleIds?: string[];

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => [String], { nullable: true })
  roleIds?: string[];

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class UserWhereInput {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  email?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@ObjectType()
export class UserPagination {
  @Field(() => [User])
  data: User[];

  @Field(() => Int)
  total: number;
}

@InputType()
export class CompleteUserWechatMerchantInput {
  @Field(() => String)
  wechatMerchantId: string;
}
