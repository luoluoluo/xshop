import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ArticleModule } from './article/article.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { createGraphQLConfig } from '@/config/graphql.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from '@/config/type-orm.config';
import { I18nModule } from 'nestjs-i18n';
import { createI18nConfig } from '@/config/i18n.config';
import { WechatPayModule } from '../_common/wechat-pay/wechat-pay.module';
import { WechatModule } from '../_common/wechat/wechat.module';
import { ShortLinkModule } from '../_common/short-link/short-link.module';
import { LinkModule } from './link/link.module';
import { UserModule } from './user/user.module';
import { FileModule } from '../_common/file/file.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ClientType } from '@/types/client';

const storeModules = [
  FileModule,
  AuthModule,
  ProductModule,
  ArticleModule,
  OrderModule,
  WechatPayModule,
  WechatModule,
  ShortLinkModule,
  LinkModule,
  UserModule,
  AnalyticsModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot(createTypeOrmConfig()),
    I18nModule.forRoot(createI18nConfig()),
    ...storeModules,
    GraphQLModule.forRoot<ApolloDriverConfig>(
      createGraphQLConfig({
        path: '/store',
        schemaPath: './schemas/store.gql',
        modules: storeModules,
        clientType: ClientType.STORE,
      }),
    ),
  ],
})
export class StoreModule {}
