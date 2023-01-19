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
describe('Auth', () => {
    beforeAll(async () => {
        await (0, dbConnect_1.default)();
    });
    afterAll(async () => {
        await (0, dbConnect_1.disconnectDB)();
    });
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
        describe('given the wrong username', () => {
            it('should return 401', () => {
                const user = {
                    username: 'NONEXISTENT',
                    password: '123456',
                };
                request.post('/api/auth/login').send(user).expect(401);
            });
        });
        describe('given the invalid email', () => {
            it('should return 400', () => {
                const user = {
                    email: 'INVALID',
                    password: '123456',
                };
                request.post('/api/auth/login').send(user).expect(400);
            });
        });
        describe('given the valid email, but non-existent on the db', () => {
            it('should return 401', () => {
                const user = {
                    email: 'nonexistent@gmail.com',
                    password: '123456',
                };
                request.post('/api/auth/login').send(user).expect(401);
            });
        });
        describe('given the wrong password', () => {
            it('should return 401', () => {
                const user = {
                    username: 'Ege',
                    password: '12345689',
                };
                request.post('/api/auth/login').send(user).expect(401);
            });
        });
    });
    describe('POST /auth/register', () => {
        describe('given valid credentials', () => {
            describe('given the user already exists', () => {
                it('should return 409', async () => {
                    const res = await request.post('/api/auth/register').send({
                        username: 'Test',
                        email: 'test@gmail.com',
                        displayName: 'Test',
                        password: '123456',
                        confirmPassword: '123456',
                    });
                    expect(res.statusCode).toBe(201);
                });
            });
            describe('given the user does not exist', () => {
                it('should return 201', async () => {
                    const res = await request.post('/api/auth/register').send({
                        username: `Test${(Math.random() * 10000000).toFixed(0)}`,
                        email: `Test${(Math.random() * 10000000).toFixed(0)}@gmail.com`,
                        displayName: 'Test',
                        password: '123456',
                        confirmPassword: '123456',
                    });
                    expect(res.statusCode).toBe(201);
                });
            });
        });
        describe('given not matching passwords', () => {
            it('should return 400', async () => {
                const res = await request.post('/api/auth/register').send({
                    username: 'Test',
                    email: 'test@gmail.com',
                    displayName: 'Test',
                    password: '123456',
                    confirmPassword: '12345',
                });
                expect(res.statusCode).toBe(400);
            });
        });
        describe('given either no username, no pwd, no displayName, no email', () => {
            it('should return 400', async () => {
                let res = await request.post('/api/auth/register').send({
                    email: 'test@gmail.com',
                    displayName: 'Test',
                    password: '123456',
                    confirmPassword: '12345',
                });
                expect(res.statusCode).toBe(400);
                let res2 = await request.post('/api/auth/register').send({
                    username: 'Test',
                    displayName: 'Test',
                    password: '123456',
                    confirmPassword: '12345',
                });
                expect(res2.statusCode).toBe(400);
                let res3 = await request.post('/api/auth/register').send({
                    username: 'Test',
                    email: 'test@gmail.com',
                    password: '123456',
                    confirmPassword: '12345',
                });
                expect(res3.statusCode).toBe(400);
                let res4 = await request.post('/api/auth/register').send({
                    username: 'Test',
                    displayName: 'Test',
                    email: 'test@gmail.com',
                    confirmPassword: '12345',
                });
                expect(res4.statusCode).toBe(400);
            });
        });
    });
});
//# sourceMappingURL=auth.test.js.map