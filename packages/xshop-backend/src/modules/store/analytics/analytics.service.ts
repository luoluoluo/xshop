import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { View } from '@/entities/view.entity';
import { Product } from '@/entities/product.entity';
import { User } from '@/entities/user.entity';
import { Article } from '@/entities/article.entity';
import { UrlParser } from '@/utils/url-parser';
import { Request } from 'express';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  /**
   * 记录页面浏览
   */
  async trackView(
    data: {
      userId?: string;
      pageUrl: string;
    },
    request: Request,
  ): Promise<View> {
    try {
      // 从请求中获取客户端信息
      const ipAddress = this.getClientIp(request);
      const userAgent = request.headers['user-agent'] || '';
      const referer = Array.isArray(request.headers.referer)
        ? request.headers.referer[0]
        : request.headers.referer ||
          (Array.isArray(request.headers.referrer)
            ? request.headers.referrer[0]
            : request.headers.referrer) ||
          '';

      // 解析 URL 获取页面信息
      const urlInfo = UrlParser.parsePageUrl(data.pageUrl);

      let productId: string | undefined;
      let articleId: string | undefined;
      let creatorId: string | undefined;
      let resolvedUserId: string | undefined;

      // 根据页面类型获取相关信息
      switch (urlInfo.pageType) {
        case 'product':
          productId = urlInfo.productId;
          if (productId) {
            creatorId =
              (await UrlParser.getCreatorIdFromProductId(
                productId,
                this.productRepository,
              )) ?? undefined;
          }
          break;

        case 'article':
          if (urlInfo.articleId) {
            const articleInfo = await UrlParser.getArticleInfoFromSlug(
              urlInfo.articleId,
              this.articleRepository,
            );
            if (articleInfo) {
              articleId = articleInfo.articleId;
              creatorId = articleInfo.creatorId;
            }
          }
          break;

        case 'user':
          if (urlInfo.userId) {
            resolvedUserId =
              (await UrlParser.getUserIdFromSlug(
                urlInfo.userId,
                this.userRepository,
              )) ?? undefined;
            // 对于用户页面，creatorId 就是该用户
            creatorId = resolvedUserId;
          }
          break;

        case 'home':
          // 首页不需要特殊处理
          break;

        default:
          this.logger.warn(
            `Unknown page type: ${urlInfo.pageType} for URL: ${data.pageUrl}`,
          );
      }

      const view = this.viewRepository.create({
        userId: data.userId || resolvedUserId,
        productId,
        articleId,
        creatorId,
        ipAddress,
        userAgent,
        referer,
        pageType: urlInfo.pageType,
        pageUrl: data.pageUrl,
      });

      const savedView = await this.viewRepository.save(view);
      this.logger.log(
        `View tracked: ${savedView.id}, type: ${urlInfo.pageType}, URL: ${data.pageUrl}`,
      );
      return savedView;
    } catch (error) {
      this.logger.error('Failed to track view', error);
      throw error;
    }
  }

  /**
   * 获取商品浏览量统计
   */
  async getProductViews(productId: string): Promise<number> {
    return this.viewRepository.count({
      where: { productId },
    });
  }

  /**
   * 获取用户页面浏览量统计
   */
  async getUserPageViews(userId: string): Promise<number> {
    return this.viewRepository.count({
      where: { creatorId: userId },
    });
  }

  /**
   * 获取时间范围内的浏览量统计
   */
  async getViewsInTimeRange(
    startDate: Date,
    endDate: Date,
    creatorId?: string,
  ): Promise<{
    totalViews: number;
    uniqueViews: number;
  }> {
    const whereCondition: any = {
      createdAt: Between(startDate, endDate),
    };

    if (creatorId) {
      whereCondition.creatorId = creatorId;
    }

    const [totalViews, uniqueViews] = await Promise.all([
      this.viewRepository.count({ where: whereCondition }),
      this.viewRepository
        .createQueryBuilder('view')
        .select('COUNT(DISTINCT view.ipAddress)', 'count')
        .where('view.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .andWhere(creatorId ? 'view.creatorId = :creatorId' : '1=1', {
          creatorId,
        })
        .getRawOne(),
    ]);

    return {
      totalViews,
      uniqueViews: parseInt(uniqueViews.count) || 0,
    };
  }

  /**
   * 获取客户端真实 IP 地址
   */
  private getClientIp(request: Request): string {
    // 检查各种可能的 IP 头
    const ipHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'x-client-ip',
      'cf-connecting-ip', // Cloudflare
      'x-cluster-client-ip',
      'x-forwarded',
      'forwarded-for',
      'forwarded',
    ];

    for (const header of ipHeaders) {
      const value = request.headers[header];
      if (value) {
        // x-forwarded-for 可能包含多个 IP，取第一个
        const ip = Array.isArray(value)
          ? value[0]
          : String(value).split(',')[0].trim();
        if (ip && ip !== 'unknown') {
          return ip;
        }
      }
    }

    // 回退到连接 IP
    return (
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }
}
