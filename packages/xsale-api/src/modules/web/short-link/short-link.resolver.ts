import { Args, Query, Resolver } from '@nestjs/graphql';
import { ShortLink } from '@/entities/short-link.entity';
import { ShortLinkService } from './short-link.service';

@Resolver(() => ShortLink)
export class ShortLinkResolver {
  constructor(private readonly shortLinkService: ShortLinkService) {}

  @Query(() => ShortLink)
  async shortLink(@Args('id') id: string): Promise<ShortLink> {
    return this.shortLinkService.findOne(id);
  }
}
