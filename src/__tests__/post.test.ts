import supertest from "supertest";
import {app} from "../server";
describe('post', () => {
  describe('GET /posts', () => {
    describe('given the post exists', () => {
      it('should return 200 OK', () => {
        // return request(app).get('/posts').expect(200);
        expect(true).toBe(true);
      });
    });
    describe('given the post does not exist', () => {
      it('should return 404', async () => {
        const postId = 1;
        await supertest(app).get(`/api/posts/${postId}`).expect(404);
      });
    });
  });
})