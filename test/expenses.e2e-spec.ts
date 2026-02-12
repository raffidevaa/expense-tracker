import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import { ResponseInterceptor } from 'src/common/response/response.interceptor';

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface ExpenseResponse {
  id: string;
  type: string;
  amount: number;
  description: string;
  account_id: string;
  category_id: string;
}

interface StatisticsResponse {
  balance: number;
  spending: number;
  cashflow: number;
  income: number;
}

describe('Expenses (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  //   let userId: string;
  let accountId: string;
  let expenseId: string;

  // Seeded category (Food)
  const FOOD_CATEGORY_ID = '294109b5-0e46-4512-a36e-087270e5cbf6';

  const testUser = {
    username: `expense_${Date.now()}`,
    email: `expense_${Date.now()}@test.com`,
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

    const loginBody = loginRes.body as ApiResponse<{
      id: string;
      access_token: string;
    }>;

    accessToken = loginBody.data.access_token;
    // userId = loginBody.data.id;

    // Create Account
    const accountRes = await request(app.getHttpServer() as Server)
      .post('/accounts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Wallet',
        balance: 100000,
      })
      .expect(201);

    accountId = (accountRes.body as ApiResponse<{ id: string }>).data.id;
  });

  afterAll(async () => {
    await app.close();
  });

  // No token
  it('Should reject creating expense without token', async () => {
    await request(app.getHttpServer() as Server)
      .post('/expenses')
      .send({
        type: 'EXPENSE',
        amount: 20000,
        description: 'Lunch',
        account_id: accountId,
        category_id: FOOD_CATEGORY_ID,
      })
      .expect(401);
  });

  // Create Expense
  it('Should create expense and reduce balance', async () => {
    const res = await request(app.getHttpServer() as Server)
      .post('/expenses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        type: 'EXPENSE',
        amount: 20000,
        description: 'Lunch',
        account_id: accountId,
        category_id: FOOD_CATEGORY_ID,
      })
      .expect(201);

    const body = res.body as ApiResponse<ExpenseResponse>;

    expenseId = body.data.id;

    expect(body.data.amount).toBe(20000);
    expect(body.data.type).toBe('EXPENSE');
  });

  // Get Expense By ID
  it('Should get expense by id', async () => {
    const res = await request(app.getHttpServer() as Server)
      .get(`/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = res.body as ApiResponse<ExpenseResponse>;

    expect(body.data.id).toBe(expenseId);
  });

  // Update Expense (change amount)
  it('Should update expense and adjust balance', async () => {
    const res = await request(app.getHttpServer() as Server)
      .put(`/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        amount: 30000,
        description: 'Dinner',
      })
      .expect(200);

    const body = res.body as ApiResponse<ExpenseResponse>;

    expect(body.data.amount).toBe(30000);
    expect(body.data.description).toBe('Dinner');
  });

  // Get All Expenses By Account
  it('Should get all expenses by account id', async () => {
    const res = await request(app.getHttpServer() as Server)
      .get(`/expenses/account/${accountId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = res.body as ApiResponse<ExpenseResponse[]>;

    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  // Get Statistics
  it('Should return correct statistics', async () => {
    const res = await request(app.getHttpServer() as Server)
      .get('/expenses/statistics')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = res.body as ApiResponse<StatisticsResponse>;

    expect(body.data).toHaveProperty('balance');
    expect(body.data).toHaveProperty('spending');
    expect(body.data).toHaveProperty('cashflow');
    expect(body.data).toHaveProperty('income');
  });

  // Delete Expense
  it('Should delete expense', async () => {
    await request(app.getHttpServer() as Server)
      .delete(`/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});
