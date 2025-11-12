import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import cookieSession from 'cookie-session';
import * as jwt from 'jsonwebtoken';
import { ProductSchema } from '../src/db/product.schema';

function signin() {
  const payload = {
    id: new Types.ObjectId().toString(),
    email: 'admin@gmail.com',
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];
}

async function createProduct(connection) {
  const productId = new mongoose.Types.ObjectId();

  const ProductModel = connection.model('Product', ProductSchema);
  const product = await ProductModel.create({
    _id: productId,
    title: 'Test Product',
    price: 10,
    version: 0,
  });
  return product;
}

describe('Order [e2e]', () => {
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
      .overrideProvider('PRODUCT_RABBITMQ_SERVICE')
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
    // POST /api/orders
    it('returns an error if the product does not exist', async () => {
      const productId = new mongoose.Types.ObjectId().toHexString();
      await request(app.getHttpServer())
        .post('/api/orders')
        .set('Cookie', signin())
        .send({ productId })
        .expect(404);
    });

    it('returns a 200 if the order is created successfully', async () => {
      const productId = new mongoose.Types.ObjectId();

      await connection.collection('products').insertOne({
        _id: productId,
        title: 'Test Product',
        price: 10,
        version: 0,
      });

      await request(app.getHttpServer())
        .post('/api/orders')
        .set('Cookie', signin())
        .send({ productId: productId.toHexString() })
        .expect(201);
    });

    // GET /api/orders
    it('returns orders from a particular user', async () => {
      const productOne = await createProduct(connection);
      const productTwo = await createProduct(connection);
      const productThree = await createProduct(connection);

      const userOne = signin();
      const userTwo = signin();

      // Creating orders for user 1
      await request(app.getHttpServer())
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ productId: productOne._id.toHexString() })
        .expect(201);

      // Creating orders for user 2
      const { body: orderOne } = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ productId: productTwo._id.toHexString() })
        .expect(201);

      const { body: orderTwo } = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ productId: productThree._id.toHexString() })
        .expect(201);

      // Getting orders for user 1
      const responseUserOne = await request(app.getHttpServer())
        .get('/api/orders')
        .set('Cookie', userOne)
        .send({})
        .expect(200);

      // Getting orders for user 2
      const responseUserTwo = await request(app.getHttpServer())
        .get('/api/orders')
        .set('Cookie', userTwo)
        .send({})
        .expect(200);

      expect(responseUserTwo.body.length).toEqual(2);
      expect(responseUserTwo.body[0].id).toEqual(orderOne.id);
      expect(responseUserTwo.body[1].id).toEqual(orderTwo.id);
      expect(responseUserOne.body.length).toEqual(1);
    });

    // GET /api/orders/:id
    it('should return an order by id', async () => {
      const product = await createProduct(connection);
      const user = signin();

      const { body: order } = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Cookie', user)
        .send({ productId: product._id.toHexString() })
        .expect(201);

      const { body: fetchedOrder } = await request(app.getHttpServer())
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send({})
        .expect(200);

      expect(fetchedOrder.id).toEqual(order.id);
    });

    // PATCH /api/orders/:id
    it('should mark an order as cancelled', async () => {
      const product = await createProduct(connection);
      const user = signin();

      const { body: order } = await request(app.getHttpServer())
        .post('/api/orders')
        .set('Cookie', user)
        .send({ productId: product._id.toHexString() })
        .expect(201);

      const { body: fetchedOrder } = await request(app.getHttpServer())
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send({})
        .expect(200);

      expect(fetchedOrder.status).toEqual('cancelled');
    });
  });
});
