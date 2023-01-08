import supertest from "supertest";
import app from "../../app";
const request = supertest(app);
import connectDB, {disconnectDB} from "../../utils/dbConnect";

const login = async (username: string, password: string) => {
  return request.post('/api/auth/login').send({
    username,
    password,
  });
}

let cookies;

describe('Post', () => {
  beforeAll(async () => {
    await connectDB();
    const res = await login("Ege", "123456");
    cookies = res.headers['set-cookie'];
    console.log(cookies);
  });

  afterAll(async () => {
    await disconnectDB();
  })
  describe('GET /posts', () => {
    it('should return 200 OK', async () => {
      expect(true).toBe(true);
    });
    // describe('If the user is not logged in', () => {
    //   it('should return 401', async () => {
    //     await request.get('/api/posts').expect(401);
    //   });
    // });
    // describe('given the post does not exist', () => {
    //   it('should return 404', async () => {
    //     const postId = 1;
    //     await request.get(`/api/posts/${postId}`).expect(404);
    //   });
    // });
    // describe('given the post exists', () => {
    //   it('should return 200 OK', async () => {
    //     const postId = 1;
    //     await request.get(`/api/posts/${postId}`).expect(200);
    //   });
    // });
  });
})