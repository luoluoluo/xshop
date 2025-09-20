import { Logger } from '@nestjs/common';

export interface ParsedUrlInfo {
  pageType: 'product' | 'article' | 'user' | 'home' | 'unknown';
  productId?: string;
  articleId?: string;
  creatorId?: string;
  userId?: string;
}

export class UrlParser {
  private static readonly logger = new Logger(UrlParser.name);

  /**
   * 解析页面 URL，自动分析出页面类型和相关 ID
   */
  static parsePageUrl(pageUrl: string): ParsedUrlInfo {
    try {
      const url = new URL(pageUrl);
      const pathname = url.pathname;

      // 移除开头的斜杠并分割路径
      const pathSegments = pathname
        .replace(/^\/+/, '')
        .split('/')
        .filter(Boolean);

      this.logger.debug(
        `Parsing URL: ${pageUrl}, segments: ${JSON.stringify(pathSegments)}`,
      );

      // 匹配不同的 URL 模式

      // 1. 商品页面: /product/[pid]
      if (pathSegments.length === 2 && pathSegments[0] === 'product') {
        const productId = pathSegments[1];
        return {
          pageType: 'product',
          productId,
        };
      }

      // 2. 文章页面: /article/[slug]
      if (pathSegments.length === 2 && pathSegments[0] === 'article') {
        const articleSlug = pathSegments[1];
        return {
          pageType: 'article',
          articleId: articleSlug, // 这里使用 slug 作为 articleId
        };
      }

      // 3. 用户页面: /[slug]
      if (pathSegments.length === 1) {
        const userSlug = pathSegments[0];
        return {
          pageType: 'user',
          userId: userSlug, // 这里使用 slug 作为 userId
        };
      }

      // 4. 首页: /
      if (pathSegments.length === 0) {
        return {
          pageType: 'home',
        };
      }

      // 5. 其他页面类型，可以根据需要扩展
      // 例如: /order/[oid], /me/order/[oid] 等
      if (pathSegments.length >= 2) {
        if (pathSegments[0] === 'order' && pathSegments[1]) {
          return {
            pageType: 'unknown',
            // 可以在这里添加订单相关的解析逻辑
          };
        }
      }

      this.logger.warn(`Unknown URL pattern: ${pageUrl}`);
      return {
        pageType: 'unknown',
      };
    } catch (error) {
      this.logger.error(`Failed to parse URL: ${pageUrl}`, error);
      return {
        pageType: 'unknown',
      };
    }
  }

  /**
   * 从商品 ID 获取创建者 ID
   * 这个方法需要在 service 中调用数据库查询
   */
  static async getCreatorIdFromProductId(
    productId: string,
    productRepository: any,
  ): Promise<string | null> {
    try {
      const product = await productRepository.findOne({
        where: { id: productId },
        select: ['userId'],
      });
      return product?.userId || null;
    } catch (error) {
      this.logger.error(
        `Failed to get creator ID for product: ${productId}`,
        error,
      );
      return null;
    }
  }

  /**
   * 从文章 slug 获取文章 ID 和创建者 ID
   */
  static async getArticleInfoFromSlug(
    articleSlug: string,
    articleRepository: any,
  ): Promise<{ articleId: string; creatorId: string } | null> {
    try {
      const article = await articleRepository.findOne({
        where: { slug: articleSlug },
        select: ['id', 'userId'],
      });
      if (article) {
        return {
          articleId: article.id,
          creatorId: article.userId,
        };
      }
      return null;
    } catch (error) {
      this.logger.error(
        `Failed to get article info for slug: ${articleSlug}`,
        error,
      );
      return null;
    }
  }

  /**
   * 从用户 slug 获取用户 ID
   */
  static async getUserIdFromSlug(
    userSlug: string,
    userRepository: any,
  ): Promise<string | null> {
    try {
      const user = await userRepository.findOne({
        where: { slug: userSlug },
        select: ['id'],
      });
      return user?.id || null;
    } catch (error) {
      this.logger.error(`Failed to get user ID for slug: ${userSlug}`, error);
      return null;
    }
  }
}
