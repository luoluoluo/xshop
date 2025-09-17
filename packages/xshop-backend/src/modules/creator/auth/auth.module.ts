import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { ConfigService } from '@nestjs/config';
import { STORE_JWT_STRATEGY } from '@/constants/jwt-strategy';
import { getJwtOptions } from '../../../config/auth.config';
import { SmsModule } from '../../_common/sms/sms.module';
import { AuthModule as CommonAuthModule } from '../../_common/auth/auth.module';
import { WechatModule } from '../../_common/wechat/wechat.module';

@Module({
  imports: [
    WechatModule,
    CommonAuthModule,
    UserModule,
    SmsModule,
    // TypeOrmModule.forFeature([...CommonEntities]),
    PassportModule.register({ defaultStrategy: STORE_JWT_STRATEGY }),
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
