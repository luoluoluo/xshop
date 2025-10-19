import { Resolver, Query, Args, Int, Context } from '@nestjs/graphql';
import { Link } from '@/entities/link.entity';
import { LinkService } from './link.service';
import { LinkPagination, LinkWhereInput } from './link.dto';
import { SorterInput } from '@/types/sorter';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';
import { StoreContext } from '@/types/graphql-context';

@Resolver(() => Link)
export class LinkResolver {
  constructor(private readonly linkService: LinkService) {}

  @Query(() => LinkPagination)
  @UseGuards(UserAuthGuard)
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
}
