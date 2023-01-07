"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
describe('auth', () => {
    describe('POST /auth/login', async () => {
        describe('given the user exists', () => {
            it('should return 200 OK', async () => {
                const user = {
                    username: 'Ege',
                    password: '123456',
                };
                await (0, supertest_1.default)(server_1.app).post('/api/auth/login').send(user).expect(200);
            });
        });
        describe('given the user does not exist', () => {
            it('should return 401', function () {
                const user = {
                    username: 'NONEXISTENT',
                    password: '123456',
                };
                (0, supertest_1.default)(server_1.app).post('/api/auth/login').send(user).expect(401);
            });
        });
    });
});
//# sourceMappingURL=auth.test.js.map