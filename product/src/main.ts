import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'filters/all-exceptions.filter';
import cookieSession from 'cookie-session';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allows listening to events
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@rabbitmq:5672'],
      queue: 'product_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  app.getHttpAdapter().getInstance().set('trust proxy', true);

  app.use(
    cookieSession({
      signed: false,
      secure: true,
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 4001);
}
bootstrap();
