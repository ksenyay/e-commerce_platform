import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'filters/all-exceptions.filter';
import cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.getHttpAdapter().getInstance().set('trust proxy', true); // Trust proxy for secure cookies behind proxies/load balancers

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  app.use(
    cookieSession({
      signed: false,
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  console.log('Starting up Auth...');
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
