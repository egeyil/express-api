"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = exports.LoginSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
const post_schema_1 = require("./post.schema");
exports.UserSchema = {
    body: zod_1.z.object({
        username: zod_1.z.string().trim().min(3).max(20),
        displayName: zod_1.z.string().min(3).max(20),
        password: zod_1.z.string().trim().min(6).max(25),
        email: zod_1.z.string().email().trim(),
        roles: zod_1.z.object({
            User: zod_1.z.number().min(0).max(7000),
            Editor: zod_1.z.number().min(0).max(7000),
            Admin: zod_1.z.number().min(0).max(7000),
        }).optional(),
        posts: zod_1.z.array(post_schema_1.PostSchema).optional(),
    }),
};
exports.LoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().trim().min(3).max(20).optional(),
        email: zod_1.z.string().email().trim().optional(),
        password: zod_1.z.string().trim().min(6).max(25),
    }),
});
exports.RegisterSchema = zod_1.z.object(Object.assign({}, exports.UserSchema));
//# sourceMappingURL=user.schema.js.map