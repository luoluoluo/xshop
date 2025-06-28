import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { FileModule } from '../_common/file/file.module';
import { ConfigModule } from '@nestjs/config';
import { createGraphQLConfig } from '@/core/graphql.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import { createTypeOrmConfig } from '@/core/type-orm.config';
import { createI18nConfig } from '@/core/i18n.config';
import { MerchantWithdrawalModule } from './merchant-withdrawal/merchant-withdrawal.module';
import { OrderModule } from './order/order.module';

const pmsModules = [
  AuthModule,
  FileModule,
  ProductModule,
  MerchantWithdrawalModule,
  OrderModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(createTypeOrmConfig()),
    I18nModule.forRoot(createI18nConfig()),
    ...pmsModules,
    GraphQLModule.forRoot<ApolloDriverConfig>(
      createGraphQLConfig({
        path: '/pms',
        schemaPath: './schemas/pms.gql',
        modules: pmsModules,
        clientType: 'pms',
      }),
    ),
  ],
})
export class PmsModule {}
