import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  AuthToken,
  LoginInput,
  RegisterInput,
  SendSmsCodeInput,
  WechatLoginInput,
} from './auth.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean)
  sendSmsCode(@Args('data') data: SendSmsCodeInput) {
    return this.authService.sendSmsCode(data);
  }

  @Mutation(() => AuthToken)
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Args('data') data: LoginInput): Promise<AuthToken> {
    return this.authService.login(data);
  }

  @Mutation(() => AuthToken)
  register(@Args('data') data: RegisterInput) {
    return this.authService.register(data);
  }

  @Mutation(() => AuthToken)
  wechatLogin(@Args('data') data: WechatLoginInput) {
    return this.authService.wechatLogin(data);
  }
}
