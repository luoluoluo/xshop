import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { CommonAuthService } from './auth.service';
import { UserAuthGuard } from './guards/user-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Role } from '@/entities/role.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtOptions } from '@/config/auth.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) =>
        getJwtOptions(configService),
      inject: [ConfigService],
    }),
    JwtModule,
    RedisModule,
    TypeOrmModule.forFeature([User, Role]),
    ConfigModule,
  ],
  providers: [CommonAuthService, UserAuthGuard],
  exports: [
    CommonAuthService,
    UserAuthGuard,
    JwtModule,
    TypeOrmModule.forFeature([User, Role]),
  ],
})
export class AuthModule {}
