import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Role } from '@/entities/role.entity';
import { RoleService } from './role.service';
import {
  CreateRoleInput,
  UpdateRoleInput,
  RolePagination,
  RoleWhereInput,
} from './role.dto';
import { RequirePermission } from '@/modules/_common/auth/decorators/require-permission.decorator';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => RolePagination)
  @UseGuards(UserAuthGuard)
  @RequirePermission('role.list')
  async roles(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => RoleWhereInput, defaultValue: {} })
    where?: RoleWhereInput,
  ): Promise<RolePagination> {
    return await this.roleService.findAll({
      skip,
      take,
      where,
    });
  }

  @Query(() => Role)
  @UseGuards(UserAuthGuard)
  @RequirePermission('role.show')
  async role(@Args('id') id: string): Promise<Role> {
    return await this.roleService.findOne(id);
  }

  @Mutation(() => Role)
  @UseGuards(UserAuthGuard)
  @RequirePermission('role.create')
  async createRole(@Args('data') data: CreateRoleInput): Promise<Role> {
    return await this.roleService.create(data);
  }

  @Mutation(() => Role)
  @UseGuards(UserAuthGuard)
  @RequirePermission('role.edit')
  async updateRole(
    @Args('id') id: string,
    @Args('data') data: UpdateRoleInput,
  ): Promise<Role> {
    return await this.roleService.update(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(UserAuthGuard)
  @RequirePermission('role.delete')
  async deleteRole(@Args('id') id: string): Promise<boolean> {
    return await this.roleService.delete(id);
  }
}
