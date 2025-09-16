import { registerEnumType } from '@nestjs/graphql';

export enum WithdrawalStatus {
  CREATED = 'created',
  COMPLETED = 'completed',
}

registerEnumType(WithdrawalStatus, {
  name: 'WithdrawalStatus',
});
