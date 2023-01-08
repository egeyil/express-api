"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
describe('POST /auth/login', () => {
    describe('given the user exists', () => {
        it('should return 200 OK', async () => {
            const res = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
                username: 'Ege',
                password: '123456',
            });
            console.log(res.body);
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
});
//# sourceMappingURL=auth.test.js.map