import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  CREATED = 'created',
  PAID = 'paid',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});
