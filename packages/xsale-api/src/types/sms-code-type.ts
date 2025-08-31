import { registerEnumType } from '@nestjs/graphql';

export enum SmsCodeType {
  LOGIN = 'login',
  REGISTER = 'register',
}

registerEnumType(SmsCodeType, {
  name: 'SmsCodeType',
  description: '短信验证码类型',
});
