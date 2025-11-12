import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../db/order.schema';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../db/product.schema';
import { OrderStatus } from '../types/types';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orders: Model<OrderDocument>,
    @InjectModel(Product.name) private products: Model<ProductDocument>,
    @Inject('ORDER_RABBITMQ_SERVICE')
    private readonly orderClient: ClientProxy,
  ) {}

  async getAllOrders(req: Request) {
    const orders = await this.orders
      .find({
        userId: req.currentUser!.id,
      })
      .populate('product');

    return orders;
  }

  async createOrder(productId: string, req: Request) {
    const product = await this.products.findById(productId).exec();

    if (!product) {
      throw new NotFoundException();
    }

    const expirationTime = 1000 * 60 * 60;

    const orders = await this.orders.find({ userId: req.currentUser!.id });

    const isAlreadyPurchased = orders.some(
      (order) => order.product && order.product.id.toString() === productId,
    );

    if (isAlreadyPurchased) {
      throw new BadRequestException('Product already purchased.');
    }

    const order = await this.orders.create({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: new Date(Date.now() + expirationTime),
      product: productId,
    });

    this.orderClient.emit('order.created', {
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      price: product.price,
      title: product.title,
      productId: product.id,
    });

    return order;
  }

  async cancelOrder(id: string, req: Request) {
    const order = await this.orders
      .findOne({
        _id: id,
        userId: req.currentUser!.id,
      })
      .populate('product');

    if (!order) {
      throw new NotFoundException();
    }

    order.status = OrderStatus.Cancelled;

    this.orderClient.emit('order.cancelled', {
      id: order.id,
    });

    return await order.save();
  }

  async getOrderById(id: string, req: Request) {
    const order = await this.orders
      .findOne({
        _id: id,
        userId: req.currentUser!.id,
      })
      .populate('product');

    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }

  async getOrderByUserId(id: string) {
    const orders = await this.orders
      .find({ userId: id, status: OrderStatus.Complete })
      .populate('product');

    if (!orders || orders.length === 0) {
      return [];
    }
    return orders;
  }

  @Interval(60000)
  async cancelExpiredOrders() {
    await this.orders.updateMany(
      { expiresAt: { $lt: new Date() }, status: OrderStatus.Created },
      { $set: { status: OrderStatus.Cancelled } },
    );
  }
}
