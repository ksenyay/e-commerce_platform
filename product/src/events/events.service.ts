import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class EventsService {
  @MessagePattern('user.updated')
  handleUserUpdated(@Payload() userData: any) {
    console.log('User updated event received:', userData);
    // Just log or send to analytics
    // No database operations needed
  }

  @MessagePattern('user.deleted')
  handleUserDeleted(@Payload() userData: any) {
    console.log('User deleted event received:', userData);
    // Maybe just log for audit purposes
  }

  @MessagePattern('order.created')
  handleOrderCreated(@Payload() orderData: any) {
    console.log('Order created event received:', orderData);
    // Track analytics, send notifications, etc.
  }
}
