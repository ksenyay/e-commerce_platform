import {
  Body,
  Controller,
  Patch,
  Get,
  Param,
  Post,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import type { Request } from 'express';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  OrderStatus,
  type PaymentPayload,
  type ProductPayload,
} from '../types/types';
import { Product, ProductDocument } from '../db/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../db/order.schema';

@Controller('/api/orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @InjectModel(Product.name) private products: Model<ProductDocument>,
    @InjectModel(Order.name) private orders: Model<OrderDocument>,
  ) {}

  @Get()
  getAllOrders(@Req() req: Request) {
    return this.ordersService.getAllOrders(req);
  }

  @Get(':id')
  getOrderById(@Param('id') id: string, @Req() req: Request) {
    return this.ordersService.getOrderById(id, req);
  }

  @Get('/users/:id')
  getOrderByUserId(@Param('id') id: string) {
    return this.ordersService.getOrderByUserId(id);
  }

  @Post()
  createOrder(@Body('productId') productId: string, @Req() req: Request) {
    return this.ordersService.createOrder(productId, req);
  }

  @Patch(':id')
  cancelOrder(@Param('id') id: string, @Req() req: Request) {
    return this.ordersService.cancelOrder(id, req);
  }

  // ----- EVENTS -----

  @EventPattern('product.created')
  async handleProductCreated(@Payload() productData: ProductPayload) {
    console.log('Received product.created event:', productData);
    const { id, title, price } = productData;
    await this.products.create({ _id: id, title, price });
  }

  @EventPattern('product.updated')
  async handleProductUpdated(@Payload() productData: ProductPayload) {
    const { id, title, price } = productData;

    const product = await this.products.findByIdAndUpdate(
      id,
      { title, price },
      { new: true },
    );

    if (!product) {
      throw new NotFoundException();
    }
  }

  @EventPattern('product.deleted')
  async handleProductDeleted(@Payload() id: string) {
    await this.products.findByIdAndDelete(id);
  }

  @EventPattern('payment.complete')
  async handlePayment(@Payload() payment: PaymentPayload) {
    const { orderId } = payment;
    const order = await this.orders.findById(orderId);

    if (!order) {
      throw new BadRequestException();
    }

    order.status = OrderStatus.Complete;

    await order.save();
  }

  @EventPattern('payment.cancelled')
  async handlePaymentCancelled(@Payload() payment: PaymentPayload) {
    const { orderId } = payment;
    const order = await this.orders.findById(orderId);

    if (!order) {
      throw new BadRequestException();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();
  }
}
