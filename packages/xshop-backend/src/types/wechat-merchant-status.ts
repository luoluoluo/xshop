import { registerEnumType } from '@nestjs/graphql';

export enum WechatMerchantStatus {
  CREATED = 'created', // 已申请
  COMPLETED = 'completed', // 已完成
}

registerEnumType(WechatMerchantStatus, {
  name: 'WechatMerchantStatus',
});
