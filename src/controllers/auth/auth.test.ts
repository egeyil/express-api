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
});
