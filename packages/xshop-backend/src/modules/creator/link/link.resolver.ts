import { Resolver, Query, Args, Int, Mutation, Context } from '@nestjs/graphql';
import { Link } from '@/entities/link.entity';
import { LinkService } from './link.service';
import {
  CreateLinkInput,
  LinkPagination,
  LinkWhereInput,
  UpdateLinkInput,
} from './link.dto';
import { SorterInput } from '@/types/sorter';
import { UseGuards } from '@nestjs/common';
import { UserSession } from '@/modules/_common/auth/decorators/user-session.decorator';
import { User } from '@/entities/user.entity';

@Resolver(() => Link)
export class LinkResolver {
  constructor(private readonly linkService: LinkService) {}

  @Query(() => LinkPagination)
  async links(
    @UserSession() user: User,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => LinkWhereInput, nullable: true })
    where?: LinkWhereInput,
    @Args('sorters', { type: () => [SorterInput], nullable: true })
    sorters?: SorterInput[],
  ): Promise<LinkPagination> {
    return await this.linkService.findAll({
      skip,
      take,
      where: {
        ...where,
        userId: user.id,
      },
      sorters,
    });
  }

  @Query(() => Link)
  async link(@Args('id') id: string): Promise<Link> {
    return await this.linkService.findOne(id);
  }

  @Mutation(() => Link)
  async createLink(
    @UserSession() user: User,
    @Args('data') data: CreateLinkInput,
  ): Promise<Link> {
    return await this.linkService.create({
      ...data,
      userId: user.id,
    });
  }

  @Mutation(() => Link)
  async updateLink(
    @UserSession() user: User,
    @Args('id') id: string,
    @Args('data') data: UpdateLinkInput,
  ): Promise<Link> {
    return await this.linkService.update(id, data, user.id);
  }

  @Mutation(() => Boolean)
  async deleteLink(
    @UserSession() user: User,
    @Args('id') id: string,
  ): Promise<boolean> {
    return await this.linkService.delete(id, user.id);
  }
}
