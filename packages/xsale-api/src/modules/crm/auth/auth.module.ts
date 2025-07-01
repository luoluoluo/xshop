import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AffiliateModule } from '../affiliate/affiliate.module';
import { AuthResolver } from './auth.resolver';
import { ConfigService } from '@nestjs/config';
import { CRM_JWT_STRATEGY } from '@/core/constants';
import { getJwtOptions } from '../../../core/auth.config';
import { SmsModule } from '../../_common/sms/sms.module';

@Module({
  imports: [
    AffiliateModule,
    SmsModule,
    // TypeOrmModule.forFeature([...CommonEntities]),
    PassportModule.register({ defaultStrategy: CRM_JWT_STRATEGY }),
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
