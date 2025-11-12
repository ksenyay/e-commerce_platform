import { OrderStatus } from '../../types/types';

export class CreateOrderDto {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
}
