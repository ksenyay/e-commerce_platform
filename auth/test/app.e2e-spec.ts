/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import cookieSession from 'cookie-session';

// Helper function to sign up a user
async function authorizeUser(app: INestApplication): Promise<string[]> {
  const response = await request(app.getHttpServer())
    .post('/api/users/signup')
    .send({ email: 'ksenya@gmail.com', password: 'mypassword1' })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  if (!cookie) {
    throw new Error('Expected Set-Cookie header to be present');
  }
  return cookie;
}

describe('Auth [e2e]', () => {
  process.env.JWT_SECRET = 'testsecret';

  let app: INestApplication;
  let mongo: MongoMemoryServer;
  let connection: mongoose.Connection;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    connection = mongoose.createConnection(mongoUri);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getConnectionToken())
      .useValue(connection)
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

  // ----- SIGNUP -----

  describe('/signup (POST)', () => {
    it('should return 201 on successful signup', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/signup')
        .send({
          email: 'ksenya@gmail.com',
          password: 'mypassword1',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', 'ksenya@gmail.com');
    });

    it('should return 400 if email is invalid', async () => {
      return request(app.getHttpServer())
        .post('/api/users/signup')
        .send({
          email: 'invalid-email',
          password: 'mypassword1',
        })
        .expect(400);
    });

    it('should return 400 if password is invalid', async () => {
      return request(app.getHttpServer())
        .post('/api/users/signup')
        .send({
          email: 'ksenya@gmail.com',
          password: '123',
        })
        .expect(400);
    });

    it('should return 400 if password or/and email are missing', async () => {
      await request(app.getHttpServer())
        .post('/api/users/signup')
        .send({
          email: 'ksenya@gmail.com',
        })
        .expect(400);

      await request(app.getHttpServer())
        .post('/api/users/signup')
        .send({
          password: 'mypassword1',
        })
        .expect(400);

      return request(app.getHttpServer())
        .post('/api/users/signup')
        .send({})
        .expect(400);
    });

    it('should return 409 if email is not unique', async () => {
      await request(app.getHttpServer())
        .post('/api/users/signup')
        .send({
          email: 'ksenya@gmail.com',
          password: 'mypassword1',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/users/signup')
        .send({
          email: 'ksenya@gmail.com',
          password: 'mypassword1',
        })
        .expect(409);
    });

    it('should set a cookie after successful signup', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/signup')
        .send({
          email: 'ksenya@gmail.com',
          password: 'mypassword1',
        })
        .expect(201);

      expect(response.get('Set-Cookie')).toBeDefined();
    });
  });

  // ----- SIGNIN -----

  describe('/signin (POST)', () => {
    it('should return 401 when user with the email does not exist', async () => {
      return request(app.getHttpServer())
        .post('/api/users/signin')
        .send({
          email: 'ksenya@gmail.com',
          password: 'mypassword1',
        })
        .expect(401);
    });

    it('should return 401 if password is not correct', async () => {
      await request(app.getHttpServer())
        .post('/api/users/signup')
        .send({
          email: 'ksenya@gmail.com',
          password: 'mypassword1',
        })
        .expect(201);

      return request(app.getHttpServer())
        .post('/api/users/signin')
        .send({
          email: 'ksenya@gmail.com',
          password: 'sssdsss1',
        })
        .expect(401);
    });

    it('should return 200 and a cookie if credentials are valid', async () => {
      await request(app.getHttpServer())
        .post('/api/users/signup')
        .send({
          email: 'ksenya@gmail.com',
          password: 'mypassword1',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/api/users/signin')
        .send({
          email: 'ksenya@gmail.com',
          password: 'mypassword1',
        })
        .expect(200);

      expect(response.get('Set-Cookie')).toBeDefined();
    });
  });

  // ----- SIGNOUT -----

  describe('/signout (POST)', () => {
    it('should clear the cookie on signout', async () => {
      await request(app.getHttpServer())
        .post('/api/users/signup')
        .send({ email: 'ksenya@gmail.com', password: 'mypassword1' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/api/users/signout')
        .send({})
        .expect(200);

      const cookie = response.get('Set-Cookie');
      if (!cookie) {
        throw new Error('Expected cookie but got undefined.');
      }

      expect(cookie[0]).toEqual(
        'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=none; httponly',
      );
    });
  });

  // ----- GET USER -----

  describe('/currentuser (GET)', () => {
    it('should respond with details about the current user', async () => {
      const cookie = await authorizeUser(app);

      const response = await request(app.getHttpServer())
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

      expect(response.body).toEqual({
        currentUser: {
          email: 'ksenya@gmail.com',
          id: expect.any(String),
          iat: expect.any(Number),
        },
      });
    });

    it('should respond with null if not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/currentuser')
        .send()
        .expect(200);

      expect(response.body).toEqual({ currentUser: null });
    });
  });
});
