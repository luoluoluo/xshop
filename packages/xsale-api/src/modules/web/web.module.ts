import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ArticleModule } from './article/article.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { createGraphQLConfig } from '@/core/graphql.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from '@/core/type-orm.config';
import { I18nModule } from 'nestjs-i18n';
import { createI18nConfig } from '@/core/i18n.config';
import { BannerModule } from './banner/banner.module';
import { CustomerModule } from './customer/customer.module';
import { WechatPayModule } from '../_common/wechat-pay/wechat-pay.module';
import { WechatModule } from '../_common/wechat/wechat.module';
import { MerchantModule } from './merchant/merchant.module';
import { AffiliateModule } from './affiliate/affiliate.module';

const webModules = [
  AuthModule,
  ProductModule,
  ArticleModule,
  OrderModule,
  MerchantModule,
  BannerModule,
  CustomerModule,
  WechatPayModule,
  WechatModule,
  AffiliateModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot(createTypeOrmConfig()),
    I18nModule.forRoot(createI18nConfig()),
    ...webModules,
    GraphQLModule.forRoot<ApolloDriverConfig>(
      createGraphQLConfig({
        path: '/web',
        schemaPath: './schemas/web.gql',
        modules: webModules,
        clientType: 'web',
      }),
    ),
  ],
})
export class WebModule {}
