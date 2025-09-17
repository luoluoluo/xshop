import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { Role } from '@/entities/role.entity';
import { WechatModule } from '@/modules/_common/wechat/wechat.module';

@Module({
  imports: [WechatModule, TypeOrmModule.forFeature([User, Role])],
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver],
})
export class UserModule {}
