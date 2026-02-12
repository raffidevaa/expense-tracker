import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import { ResponseInterceptor } from 'src/common/response/response.interceptor';

describe('Auth Token (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  const testUser = {
    username: `demon_${Date.now()}`,
    email: `demon_${Date.now()}@test.com`,
    password: 'demon123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Register user
  it('Should register user', async () => {
    await request(app.getHttpServer() as Server)
      .post('/auth/register')
      .send(testUser)
      .expect(201);
  });

  // Login user and get token
  it('Should login and return access token', async () => {
    const res = await request(app.getHttpServer() as Server)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(
      (res.body as { data: { access_token: string } }).data,
    ).toHaveProperty('access_token');

    accessToken = (res.body as { data: { access_token: string } }).data
      .access_token;
  });

  // Access protected route without token → 401
  it('Should reject request without token', async () => {
    await request(app.getHttpServer() as Server)
      .get('/expenses/statistics')
      .expect(401);
  });

  //Access protected route with invalid token → 401
  it('Should reject invalid token', async () => {
    await request(app.getHttpServer() as Server)
      .get('/expenses/statistics')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });

  //Access protected route with valid token → 200
  it('Should allow access with valid token', async () => {
    await request(app.getHttpServer() as Server)
      .get('/expenses/statistics')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
