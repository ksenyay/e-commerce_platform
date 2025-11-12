import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Headers,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderStatus } from '../types/types';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../db/order.schema';
import { Model } from 'mongoose';

type OrderPayload = {
  id: string;
  status: OrderStatus;
  userId: string;
  price: number;
  title: string;
  productId: string;
};

@Controller('/api/payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    @InjectModel(Order.name) private orders: Model<OrderDocument>,
  ) {}

  @Post('/checkout')
  async createCheckoutSession(@Body() payload: CreatePaymentDto) {
    return this.paymentsService.handleCheckoutSession(payload);
  }

  @Post('/success')
  markOrderAsPaid(@Body() body: { sessionId: string }) {
    return this.paymentsService.markOrderAsPaid(body.sessionId);
  }

  @Post('/cancel')
  markOrderAsCancelled(@Body() body: { sessionId: string }) {
    return this.paymentsService.markOrderAsCancelled(body.sessionId);
  }

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() orderData: OrderPayload) {
    console.log('Received event at payment service', orderData);
    await this.orders.create({
      _id: orderData.id,
      status: orderData.status,
      userId: orderData.userId,
      price: orderData.price,
      title: orderData.title,
      productId: orderData.productId,
    });
  }

  @EventPattern('order.cancelled')
  async handleOrderCancelled(@Payload() payload: { id: string }) {
    const { id } = payload;
    const cancelled = await this.orders.findById(id);

    if (!cancelled) {
      throw new NotFoundException();
    }

    cancelled.status = OrderStatus.Cancelled;
    await cancelled.save();
  }
}
