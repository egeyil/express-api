import request from "supertest";
import app from "../../app";

describe('POST /auth/login', () => {
  describe('given the user exists', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).post('/api/auth/login').send({
        username: 'Ege',
        password: '123456',
      });
      console.log(res.body)
      expect(res.statusCode).toBe(200);
    });
  });
  // describe('given the user does not exist', () => {
  //   it('should return 401', () => {
  //     const user = {
  //       username: 'NONEXISTENT',
  //       password: '123456',
  //     };
  //     supertest(app).post('/api/auth/login').send(user).expect(401);
  //   });
  // });
})
