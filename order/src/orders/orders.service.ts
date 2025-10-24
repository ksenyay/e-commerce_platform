import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../db/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orders: Model<Order>) {}

  getAllOrders() {}

  createOrder() {}

  cancelOrder(id: string) {
    return id;
  }

  getOrderById(id: string) {
    return id;
  }
}
