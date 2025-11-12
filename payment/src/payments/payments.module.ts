import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from '../db/order.schema';
import {
  CurrentUserMiddleware,
  RequireAuthMiddleware,
} from '@soundio-common/ecommerce-common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentSchema } from '../db/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Payment', schema: PaymentSchema },
    ]),
    ClientsModule.register([
      {
        name: 'PAYMENT_RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'payment_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware, RequireAuthMiddleware)
      .forRoutes({ path: '/api/payments', method: RequestMethod.POST });
  }
}
