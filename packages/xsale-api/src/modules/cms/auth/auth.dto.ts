import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { User } from '@/entities/user.entity';

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AuthToken {
  @Field()
  token: string;

  @Field(() => User)
  user: User;

  @Field()
  expiresIn: number;
}

@ObjectType()
export class AuthPayload {
  @Field()
  sub: string;

  @Field()
  iat: number;
}
