import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from '../db/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrentUserMiddleware } from './middleware';
// import { RequireAuthMiddleware } from './middleware/require-auth.middleware';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes({
      path: 'api/users/currentuser',
      method: RequestMethod.GET,
    });
    // consumer.apply(RequireAuthMiddleware).forRoutes({
    //   path: 'api/users/currentuser',
    //   method: RequestMethod.GET,
    // });
  }
}
