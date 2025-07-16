import { Injectable } from '@nestjs/common';
import { Product } from '@/entities/product.entity';
import {
  MERCHANT_AFFILIATE_COMMISSION_PERCENTAGE,
  PLATFORM_FEE_PERCENTAGE,
} from '@/core/constants';

@Injectable()
export class CommonProductService {
  withCommission(product: Product): Product {
    if (!product.commissionRate) {
      return product;
    }
    // 总佣金
    product.commission =
      Math.floor(product.price * product.commissionRate) / 100;

    // 平台佣金
    product.platformCommissionRate =
      product.platformCommissionRate || PLATFORM_FEE_PERCENTAGE;
    product.platformCommission =
      Math.floor(product.price * product.platformCommissionRate) / 100;

    // 商户推广者佣金
    product.merchantAffiliateCommissionRate =
      product.merchantAffiliateCommissionRate ||
      MERCHANT_AFFILIATE_COMMISSION_PERCENTAGE;

    product.merchantAffiliateCommission =
      Math.floor(product.price * product.merchantAffiliateCommissionRate) / 100;

    // 推广者佣金
    product.affiliateCommissionRate =
      product.commissionRate -
      product.platformCommissionRate -
      product.merchantAffiliateCommissionRate;

    product.affiliateCommission =
      product.commission -
      product.platformCommission -
      product.merchantAffiliateCommission;

    if (product.affiliateCommissionRate < 0) {
      throw new Error('佣金比例不能小于平台佣金比例和招商经理佣金比例之和');
    }

    return product;
  }
}
