import { registerEnumType } from '@nestjs/graphql';

export enum WechatMerchantStatus {
  CREATED = 'created', // 已申请
  APPLIED = 'applied', // 已通过
  REJECTED = 'rejected', // 已拒绝
  COMPLETED = 'completed', // 已完成
}

registerEnumType(WechatMerchantStatus, {
  name: 'WechatMerchantStatus',
});
