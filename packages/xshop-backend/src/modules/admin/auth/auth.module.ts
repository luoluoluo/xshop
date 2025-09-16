import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { ConfigService } from '@nestjs/config';
import { ADMIN_JWT_STRATEGY } from '@/core/constants';
import { getJwtOptions } from '../../../core/auth.config';
import { AuthModule as CommonAuthModule } from '../../_common/auth/auth.module';

@Module({
  imports: [
    CommonAuthModule,
    UserModule,
    // TypeOrmModule.forFeature([...CommonEntities]),
    PassportModule.register({ defaultStrategy: ADMIN_JWT_STRATEGY }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) =>
        getJwtOptions(configService),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, GqlAuthGuard],
  exports: [AuthService, GqlAuthGuard],
})
export class AuthModule {}
