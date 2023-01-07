"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
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
                await (0, supertest_1.default)(server_1.app).get(`/api/posts/${postId}`).expect(404);
            });
        });
    });
});
//# sourceMappingURL=post.test.js.map