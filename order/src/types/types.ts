export enum OrderStatus {
  Created = 'created',
  Cancelled = 'cancelled',
  AwaitingPayment = 'awaiting:payment',
  Complete = 'complete',
}

export interface ProductPayload {
  id: string;
  title: string;
  price: number;
}

export interface PaymentPayload {
  id: string;
  stripeId: string;
  orderId: string;
}
