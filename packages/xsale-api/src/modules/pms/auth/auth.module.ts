import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { MerchantModule } from '../merchant/merchant.module';
import { AuthResolver } from './auth.resolver';
import { ConfigService } from '@nestjs/config';
import { getJwtOptions } from '../../../core/auth.config';
import { PMS_JWT_STRATEGY } from '@/core/constants';
import { SmsModule } from '../../_common/sms/sms.module';

@Module({
  imports: [
    MerchantModule,
    SmsModule,
    // TypeOrmModule.forFeature([...CommonEntities]),
    PassportModule.register({ defaultStrategy: PMS_JWT_STRATEGY }),
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
