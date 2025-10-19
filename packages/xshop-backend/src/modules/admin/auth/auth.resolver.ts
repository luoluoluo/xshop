import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthToken, LoginInput } from './auth.dto';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../../_common/auth/guards/user-auth.guard';
import { User } from '@/entities/user.entity';
import { UserSession } from '@/modules/_common/auth/decorators/user-session.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthToken)
  login(@Args('data') data: LoginInput) {
    return this.authService.login(data.email, data.password);
  }

  @Query(() => User)
  @UseGuards(UserAuthGuard)
  me(@UserSession() user: User) {
    return user;
  }
}
