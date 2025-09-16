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
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { StoreContext } from '@/types/graphql-context';

@Resolver(() => Link)
export class LinkResolver {
  constructor(private readonly linkService: LinkService) {}

  @Query(() => LinkPagination)
  @UseGuards(GqlAuthGuard)
  async links(
    @Context() ctx: StoreContext,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => LinkWhereInput, defaultValue: {} })
    where?: LinkWhereInput,
    @Args('sorters', { type: () => [SorterInput], defaultValue: {} })
    sorters?: SorterInput[],
  ): Promise<LinkPagination> {
    return await this.linkService.findAll({
      skip,
      take,
      where: {
        ...where,
        userId: ctx.req.user?.id,
      },
      sorters,
    });
  }

  @Query(() => Link)
  async link(@Args('id') id: string): Promise<Link> {
    return await this.linkService.findOne(id);
  }

  @Mutation(() => Link)
  @UseGuards(GqlAuthGuard)
  async createLink(
    @Context() ctx: StoreContext,
    @Args('data') data: CreateLinkInput,
  ): Promise<Link> {
    return await this.linkService.create({
      ...data,
      userId: ctx.req.user?.id,
    });
  }

  @Mutation(() => Link)
  @UseGuards(GqlAuthGuard)
  async updateLink(
    @Context() ctx: StoreContext,
    @Args('id') id: string,
    @Args('data') data: UpdateLinkInput,
  ): Promise<Link> {
    return await this.linkService.update(id, data, ctx.req.user?.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteLink(
    @Context() ctx: StoreContext,
    @Args('id') id: string,
  ): Promise<boolean> {
    return await this.linkService.delete(id, ctx.req.user?.id);
  }
}
