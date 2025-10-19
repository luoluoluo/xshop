import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { ConfigService } from '@nestjs/config';
import { getJwtOptions } from '../../../config/auth.config';
import { AuthModule as CommonAuthModule } from '../../_common/auth/auth.module';

@Module({
  imports: [
    CommonAuthModule,
    UserModule,
    // TypeOrmModule.forFeature([...CommonEntities]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) =>
        getJwtOptions(configService),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
