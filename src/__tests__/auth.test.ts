import supertest from "supertest";
import {app} from "../server";

describe('auth', () => {
  describe('POST /auth/login', () => {
    describe('given the user exists', () => {
      it('should return 200 OK', () => {
        const user = {
          username: 'Ege',
          password: '123456',
        };
        supertest(app).post('/api/auth/login').send(user).expect(200);
      });
    });
    describe('given the user does not exist', () => {
      it('should return 401', () => {
        const user = {
          username: 'NONEXISTENT',
          password: '123456',
        };
        supertest(app).post('/api/auth/login').send(user).expect(401);
      });
    });
  })
});