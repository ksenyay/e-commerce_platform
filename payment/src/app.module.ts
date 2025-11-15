import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [PaymentsModule, MongooseModule.forRoot(process.env.MONGO_URL!)],
})
export class AppModule {}
