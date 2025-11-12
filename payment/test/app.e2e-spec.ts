import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import { AllExceptionsFilter } from '@soundio-common/ecommerce-common';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import cookieSession from 'cookie-session';
import * as jwt from 'jsonwebtoken';
import { OrderSchema } from '../src/db/order.schema';
import { OrderStatus } from '../src/types/types';

function signin(id?: string) {
  const payload = {
    id: id || new Types.ObjectId().toString(),
    email: 'admin@gmail.com',
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];
}

async function createOrder(connection) {
  const userId = new mongoose.Types.ObjectId();
  const orderId = new mongoose.Types.ObjectId();

  const OrderModel = connection.model('Order', OrderSchema);
  const product = await OrderModel.create({
    _id: orderId,
    status: OrderStatus.Created,
    userId,
    price: 20,
  });
  return product;
}

describe('Payment [e2e]', () => {
  process.env.JWT_SECRET = 'testsecret';

  let app: INestApplication;
  let mongo: MongoMemoryServer;
  let connection: mongoose.Connection;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    connection = mongoose.createConnection(mongoUri);

    const mockRabbitClient = {
      emit: jest.fn(),
      send: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getConnectionToken())
      .useValue(connection)
      .overrideProvider('ORDER_RABBITMQ_SERVICE')
      .useValue(mockRabbitClient)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new AllExceptionsFilter());

    app.use(
      cookieSession({
        signed: false,
        secure: false,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      }),
    );

    await app.init();
  });

  beforeEach(async () => {
    const collections = connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await app.close();
    await connection.close();
    await mongo.stop();
  });

  describe('Order [e2e]', () => {
    const orderId = new mongoose.Types.ObjectId();
    it('should return 404 if the order does not exist', async () => {
      await request(app.getHttpServer())
        .post('/api/payments')
        .set('Cookie', signin())
        .send({ orderId, token: 'asdasd' })
        .expect(404);
    });

    it('should return 401 if the order does not belong to a user', async () => {
      const user = signin();
      const order = await createOrder(connection);
      await request(app.getHttpServer())
        .post('/api/payments')
        .set('Cookie', user)
        .send({ orderId: order.id, token: 'asdasd' })
        .expect(401);
    });

    it('should return 400 if the order is cancelled', async () => {
      const order = await createOrder(connection);
      const user = signin(order.userId);
      order.status = OrderStatus.Cancelled;
      await order.save();
      await request(app.getHttpServer())
        .post('/api/payments')
        .set('Cookie', user)
        .send({ orderId: order.id, token: 'asdasd' })
        .expect(400);
    });
  });
});
