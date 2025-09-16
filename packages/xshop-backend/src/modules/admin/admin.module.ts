import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { ProductModule } from './product/product.module';
import { ArticleModule } from './article/article.module';
import { FileModule } from '../_common/file/file.module';
import { ConfigModule } from '@nestjs/config';
import { createGraphQLConfig } from '@/core/graphql.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import { createTypeOrmConfig } from '@/core/type-orm.config';
import { createI18nConfig } from '@/core/i18n.config';
import { OrderModule } from './order/order.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';

const adminModules = [
  UserModule,
  AuthModule,
  RoleModule,
  FileModule,
  PermissionModule,
  ProductModule,
  ArticleModule,
  OrderModule,
  WithdrawalModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(createTypeOrmConfig()),
    I18nModule.forRoot(createI18nConfig()),
    ...adminModules,
    GraphQLModule.forRoot<ApolloDriverConfig>(
      createGraphQLConfig({
        path: '/admin',
        schemaPath: './schemas/admin.gql',
        modules: adminModules,
        clientType: 'admin',
      }),
    ),
  ],
})
export class AdminModule {}
