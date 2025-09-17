import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { User } from '@/entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  wechatOpenId?: string;
}

@InputType()
export class UpdateMeInput {
  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  wechatId?: string;

  @Field(() => String, { nullable: true })
  title?: string;

  // 介绍
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => String, { nullable: true })
  backgroundImage?: string;
}

@InputType()
export class UserWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;
}

@ObjectType()
export class UserPagination {
  @Field(() => [User])
  data: User[];

  @Field(() => Int)
  total: number;
}

@InputType()
export class CreateUserWechatMerchantInput {
  @Field(() => String)
  bankAccountNumber: string;

  @Field(() => String)
  businessLicensePhoto: string;

  @Field(() => String)
  idCardFrontPhoto: string;

  @Field(() => String)
  idCardBackPhoto: string;
}
