import supertest from "supertest";
import app from "../../app";
const request = supertest(app);
import connectDB, {disconnectDB} from "../../utils/dbConnect";

describe('Auth', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  })

  describe('POST /auth/login', () => {
    describe('given the user exists', () => {
      it('should return 200 OK', async () => {
        const res = await request.post('/api/auth/login').send({
          username: 'Ege',
          password: '123456',
        });
        expect(res.statusCode).toBe(200);
      });
    });
    describe('given the wrong username', () => {
      it('should return 401', () => {
        const user = {
          username: 'NONEXISTENT',
          password: '123456',
        };
        request.post('/api/auth/login').send(user).expect(401);
      });
    });
    describe('given the invalid email', () => {
      it('should return 400', () => {
        const user = {
          email: 'INVALID',
          password: '123456',
        };
        request.post('/api/auth/login').send(user).expect(400);
      });
    });
    describe('given the valid email, but non-existent on the db', () => {
      it('should return 401', () => {
        const user = {
          email: 'nonexistent@gmail.com',
          password: '123456',
        };
        request.post('/api/auth/login').send(user).expect(401);
      });
    });
    describe('given the wrong password', () => {
      it('should return 401', () => {
        const user = {
          username: 'Ege',
          password: '12345689',
        };
        request.post('/api/auth/login').send(user).expect(401);
      });
    });
  })
  describe('POST /auth/register', () => {
    describe('given valid credentials', () => {
      it('should return 201', async () => {
        const res = await request.post('/api/auth/register').send({
          username: 'Test',
          email: 'test@gmail.com',
          displayName: 'Test',
          password: '123456',
          confirmPassword: '123456',
        });
        expect(res.statusCode).toBe(201);
      });
    });
    describe('given not matching passwords', () => {
      it('should return 400', async () => {
        const res = await request.post('/api/auth/register').send({
          username: 'Test',
          email: 'test@gmail.com',
          displayName: 'Test',
          password: '123456',
          confirmPassword: '12345',
        });
        expect(res.statusCode).toBe(400);
      });
    });
    describe('given either no username, no pwd, no displayName, no email', () => {
      it('should return 400', async () => {
        let res = await request.post('/api/auth/register').send({
          email: 'test@gmail.com',
          displayName: 'Test',
          password: '123456',
          confirmPassword: '12345',
        });
        expect(res.statusCode).toBe(400);
        let res2 = await request.post('/api/auth/register').send({
          username: 'Test',
          displayName: 'Test',
          password: '123456',
          confirmPassword: '12345',
        });
        expect(res2.statusCode).toBe(400);
        let res3 = await request.post('/api/auth/register').send({
          username: 'Test',
          email: 'test@gmail.com',
          password: '123456',
          confirmPassword: '12345',
        });
        expect(res3.statusCode).toBe(400);
        let res4 = await request.post('/api/auth/register').send({
          username: 'Test',
          displayName: 'Test',
          email: 'test@gmail.com',
          confirmPassword: '12345',
        });
        expect(res4.statusCode).toBe(400);
      });
    });
  })
});
