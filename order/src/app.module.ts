import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    OrdersModule,
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://localhost:27017/order',
    ),
  ],
})
export class AppModule {}
