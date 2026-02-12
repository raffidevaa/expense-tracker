import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import { ResponseInterceptor } from 'src/common/response/response.interceptor';

describe('Accounts (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;
  let accountId: string;

  const testUser = {
    username: `account_${Date.now()}`,
    email: `account_${Date.now()}@test.com`,
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();

    // Register
    await request(app.getHttpServer() as Server)
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    // Login
    const loginRes = await request(app.getHttpServer() as Server)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    const body = loginRes.body as {
      data: {
        id: string;
        access_token: string;
      };
    };

    accessToken = body.data.access_token;
    userId = body.data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  // Without token
  it('Should reject create account without token', async () => {
    await request(app.getHttpServer() as Server)
      .post('/accounts')
      .send({ name: 'Wallet', balance: 100000 })
      .expect(401);
  });

  // Create account
  it('Should create account', async () => {
    const res = await request(app.getHttpServer() as Server)
      .post('/accounts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Wallet',
        balance: 100000,
      })
      .expect(201);

    expect(res.body).toHaveProperty('data');
    expect((res.body as { data: { id: string } }).data).toHaveProperty('id');

    accountId = (res.body as { data: { id: string } }).data.id;
  });

  // Get accounts by user
  it('Should get accounts by user id', async () => {
    const res = await request(app.getHttpServer() as Server)
      .get(`/accounts/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('data');
    const body = res.body as { data: unknown[] };
    expect(Array.isArray(body.data)).toBe(true);
  });

  // Update account
  it('Should update account', async () => {
    const res = await request(app.getHttpServer() as Server)
      .put(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated Wallet',
        balance: 200000,
      })
      .expect(200);

    expect(res.body).toHaveProperty('data');

    const body = res.body as { data: { name: string; balance: number } };
    expect(body.data.name).toBe('Updated Wallet');
  });

  // Delete account
  it('Should delete account', async () => {
    await request(app.getHttpServer() as Server)
      .delete(`/accounts/${accountId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
