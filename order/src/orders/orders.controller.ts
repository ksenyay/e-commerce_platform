import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  getOrderById(@Param() id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Post()
  createOrder() {
    return this.ordersService.createOrder();
  }

  @Delete(':id')
  cancelOrder(@Param() id: string) {
    return this.ordersService.cancelOrder(id);
  }
}
