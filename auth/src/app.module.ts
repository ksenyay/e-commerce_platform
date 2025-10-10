import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://auth-mongo-srv:27017/auth'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
