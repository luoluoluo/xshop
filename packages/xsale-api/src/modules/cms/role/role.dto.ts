import { ObjectType, Int, InputType, Field } from '@nestjs/graphql';
import { Role } from '@/entities/role.entity';

@InputType()
export class CreateRoleInput {
  @Field()
  name: string;

  @Field(() => [String], { nullable: true })
  permissions?: string[];

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  isActive?: boolean;
}

@InputType()
export class UpdateRoleInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => [String], { nullable: true })
  permissions?: string[];

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class RoleWhereInput {
  @Field({ nullable: true })
  id?: string;
}

@ObjectType()
export class RolePagination {
  @Field(() => [Role])
  data: Role[];

  @Field(() => Int)
  total: number;
}
