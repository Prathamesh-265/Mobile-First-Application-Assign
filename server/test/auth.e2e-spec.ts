import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const testEmail = `e2e-${Date.now()}@example.com`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects registration with an invalid email', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'not-an-email', password: 'password123' })
      .expect(400);
  });

  it('registers a new user and returns an access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ name: 'Test User', email: testEmail, password: 'password123' })
      .expect(201);

    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe(testEmail);
  });

  it('rejects a duplicate registration', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ name: 'Test User', email: testEmail, password: 'password123' })
      .expect(409);
  });

  it('logs in with the correct credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'password123' })
      .expect(200);

    expect(res.body.data.accessToken).toBeDefined();
  });

  it('rejects a protected route with no token', () => {
    return request(app.getHttpServer()).get('/api/tasks').expect(401);
  });
});
