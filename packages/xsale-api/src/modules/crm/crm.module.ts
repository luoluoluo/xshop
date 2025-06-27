import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { createGraphQLConfig } from '@/core/graphql.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from '@/core/type-orm.config';
import { I18nModule } from 'nestjs-i18n';
import { createI18nConfig } from '@/core/i18n.config';
import { AffiliateModule } from './affiliate/affiliate.module';
import { WechatModule } from '../_common/wechat/wechat.module';
import { AffiliateWithdrawalModule } from './affiliate-withdrawal/affiliate-withdrawal.module';
import { MerchantModule } from './merchant/merchant.module';
import { FileModule } from '../_common/file/file.module';

const CrmModules = [
  AuthModule,
  ProductModule,
  OrderModule,
  MerchantModule,
  AffiliateModule,
  WechatModule,
  AffiliateWithdrawalModule,
  FileModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot(createTypeOrmConfig()),
    I18nModule.forRoot(createI18nConfig()),
    ...CrmModules,
    GraphQLModule.forRoot<ApolloDriverConfig>(
      createGraphQLConfig({
        path: '/crm',
        schemaPath: './schemas/crm.gql',
        modules: CrmModules,
        clientType: 'crm',
      }),
    ),
  ],
})
export class CrmModule {}
