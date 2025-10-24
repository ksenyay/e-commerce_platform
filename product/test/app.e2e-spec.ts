/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { ProductSchema } from '../src/db/schemas/product.schema';
import { Types } from 'mongoose';
import cookieSession from 'cookie-session';

// Helper function to sign up a user
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

describe('Product [e2e]', () => {
  process.env.JWT_SECRET = 'testsecret';

  let app: INestApplication;
  let mongo: MongoMemoryServer;
  let connection: mongoose.Connection;
  let ProductModel: mongoose.Model<any>;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    connection = mongoose.createConnection(mongoUri);
    ProductModel = connection.model('Product', ProductSchema);

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

  // ----- CREATE PRODUCTS -----

  describe('/products (POST)', () => {
    it('should return 401 if user is not logged in', async () => {
      await request(app.getHttpServer())
        .post('/api/products')
        .send({})
        .expect(401);
    });

    it('should return 201 and create product when user is logged in', async () => {
      const product = {
        title: 'Sample Product',
        description: 'A test product',
        price: 99.99,
        tags: ['test', 'sample'],
        category: 'nature',
        downloads: 0,
      };
      await request(app.getHttpServer())
        .post('/api/products')
        .set('Cookie', signin())
        .send(product)
        .expect(201);
    });

    it('should return an error if any of the required fields are not provided', async () => {
      await request(app.getHttpServer())
        .post('/api/products')
        .set('Cookie', signin())
        .send({})
        .expect(400);
    });

    it('should create product with valid inputs', async () => {
      const product = {
        title: 'Valid Product',
        description: 'This is a valid product description.',
        price: 49.99,
        tags: ['valid', 'product'],
        category: 'nature',
        downloads: 10,
      };

      let products = await ProductModel.find({});
      expect(products.length).toEqual(0);

      await request(app.getHttpServer())
        .post('/api/products')
        .set('Cookie', signin())
        .send(product)
        .expect(201);

      products = await ProductModel.find({});
      expect(products.length).toEqual(1);
    });
  });

  // ----- GET PRODUCT BY ID -----

  describe('/products/:id GET', () => {
    it('should return product by id', async () => {
      const product = {
        title: 'Valid Product',
        description: 'This is a valid product description.',
        price: 49.99,
        tags: ['valid', 'product'],
        category: 'nature',
        downloads: 10,
      };
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Cookie', signin())
        .send(product)
        .expect(201);

      const productResponse = await request(app.getHttpServer())
        .get(`/api/products/${response.body.id}`)
        .send()
        .expect(200);

      expect(productResponse.body.title).toEqual(product.title);
      expect(productResponse.body.description).toEqual(product.description);
    });

    it('should return 404 if the product is not found', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app.getHttpServer())
        .get(`/api/products/${nonExistentId}`)
        .send()
        .expect(404);
    });
  });

  // ----- GET ALL PRODUCTS -----

  async function createProduct() {
    const product = {
      title: 'Valid Product',
      description: 'This is a valid product description.',
      price: 49.99,
      tags: ['valid', 'product'],
      category: 'nature',
      downloads: 10,
    };
    const created = await request(app.getHttpServer())
      .post('/api/products')
      .set('Cookie', signin())
      .send(product)
      .expect(201);

    return created;
  }

  describe('/products GET', () => {
    it('should return all created products', async () => {
      createProduct();
      createProduct();
      createProduct();

      const products = await request(app.getHttpServer())
        .get('/api/products')
        .send()
        .expect(200);

      expect(products.body.length).toEqual(3);
    });
  });

  // ----- UPDATE THE PRODUCT -----

  describe('/products GET', () => {
    it('should return 404 if the product does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app.getHttpServer())
        .patch(`/api/products/${nonExistentId}`)
        .set('Cookie', signin())
        .send()
        .expect(404);
    });

    it('should return 401 if the user is not authenticated', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app.getHttpServer())
        .patch(`/api/products/${nonExistentId}`)
        .send()
        .expect(401);
    });

    it('should return 401 if the user does now own the product', async () => {
      const product = await createProduct();

      await request(app.getHttpServer())
        .patch(`/api/products/${product.body.id}`)
        .set('Cookie', signin())
        .send({})
        .expect(401);
    });

    it('should return 400 if the title or price are not valid', async () => {
      const product = {
        title: 'Valid Product',
        description: 'This is a valid product description.',
        price: 49.99,
        tags: ['valid', 'product'],
        category: 'nature',
        downloads: 10,
      };

      const cookie = signin();

      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Cookie', cookie)
        .send(product)
        .expect(201);

      const updated = {
        title: 12,
        price: '123123',
      };

      await request(app.getHttpServer())
        .patch(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send(updated)
        .expect(400);
    });

    it('should return updated ticket', async () => {
      const product = {
        title: 'Valid Product',
        description: 'This is a valid product description.',
        price: 49.99,
        tags: ['valid', 'product'],
        category: 'nature',
        downloads: 10,
      };

      const cookie = signin();

      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Cookie', cookie)
        .send(product)
        .expect(201);

      const updated = {
        title: 'updated product',
      };

      const updatedProduct = await request(app.getHttpServer())
        .patch(`/api/products/${response.body.id}`)
        .set('Cookie', cookie)
        .send(updated)
        .expect(200);

      expect(updatedProduct).toBeDefined();
    });
  });
});
