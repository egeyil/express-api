import supertest from "supertest";
import app from "../app";
describe('post', () => {
  describe('If the user is not logged in', () => {
    it('should return 401', function () {
      supertest(app).get('/api/posts').expect(401);
    });
  });
})


// describe('GET /posts', () => {
//   // describe('given the post exists', () => {
//   //   it('should return 200 OK', () => {
//   //     // return request(app).get('/posts').expect(200);
//   //     expect(true).toBe(true);
//   //   });
//   // });
//   describe('given the post does not exist', () => {
//     it('should return 404', async () => {
//       const postId = 1;
//       await supertest(app).get(`/api/posts/${postId}`).expect(404);
//     });
//   });
// });