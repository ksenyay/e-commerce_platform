import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://localhost:27017/product',
    ),
  ],
})
export class AppModule {}
