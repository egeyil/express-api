"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const request = (0, supertest_1.default)(app_1.default);
const dbConnect_1 = __importStar(require("../../utils/dbConnect"));
const login = async (username, password) => {
    return request.post('/api/auth/login').send({
        username,
        password,
    });
};
let cookies;
describe('Post', () => {
    beforeAll(async () => {
        await (0, dbConnect_1.default)();
        const res = await login("Ege", "123456");
        cookies = res.headers['set-cookie'];
        console.log(cookies);
    });
    afterAll(async () => {
        await (0, dbConnect_1.disconnectDB)();
    });
    describe('GET /posts', () => {
        describe('If the user is not logged in', () => {
            it('should return 401', async () => {
                await request.get('/api/posts').expect(401);
            });
        });
        describe('given the post does not exist', () => {
            it('should return 404', async () => {
                const postId = 1;
                await request.get(`/api/posts/${postId}`).expect(404);
            });
        });
        describe('given the post exists', () => {
            it('should return 200 OK', async () => {
                const postId = 1;
                await request.get(`/api/posts/${postId}`).expect(200);
            });
        });
    });
});
//# sourceMappingURL=post.test.js.map