import { registerEnumType } from '@nestjs/graphql';

export enum QueryUserType {
  MERCHANT = 'merchant',
  CUSTOMER = 'customer',
  AFFILIATE = 'affiliate',
}

registerEnumType(QueryUserType, {
  name: 'QueryUserType',
});
