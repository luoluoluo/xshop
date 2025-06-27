import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthPayload, AuthToken } from './auth.dto';
import { User } from '@/entities/user.entity';
import { getJwtExpiresIn } from '../../../core/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: AuthPayload): Promise<User> {
    const user = await this.userService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('用戶未找到');
    }
    return user;
  }

  async login(email: string, password: string): Promise<AuthToken> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('電郵或密碼錯誤');
    }

    const iat = Math.floor(Date.now() / 1000);
    const expiresIn = getJwtExpiresIn();

    const payload: AuthPayload = {
      sub: user.id,
      iat,
    };

    return {
      token: this.jwtService.sign(payload, {
        expiresIn,
      }),
      user: { ...user, password: '' },
      expiresIn,
    };
  }
}
