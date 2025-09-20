import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
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
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { LinkModule } from './link/link.module';
import { UserModule } from './user/user.module';
import { FileModule } from '../_common/file/file.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ClientType } from '@/types/client';

const creatorModules = [
  FileModule,
  AuthModule,
  ProductModule,
  OrderModule,
  WechatPayModule,
  WechatModule,
  ShortLinkModule,
  WithdrawalModule,
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
    ...creatorModules,
    GraphQLModule.forRoot<ApolloDriverConfig>(
      createGraphQLConfig({
        path: '/creator',
        schemaPath: './schemas/creator.gql',
        modules: creatorModules,
        clientType: ClientType.CREATOR,
      }),
    ),
  ],
})
export class CreatorModule {}
